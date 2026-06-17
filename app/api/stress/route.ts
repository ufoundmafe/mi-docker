import { NextResponse } from 'next/server';
import { Client } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://univalle_user:univalle_password@postgres-db:5432/univalle_stress_db',
};

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'http') {
    let start = Date.now();
    while (Date.now() - start < 8000) {
      Math.sqrt(Math.random() * 100000);
    }
    return NextResponse.json({ message: 'HTTP Flood finalizado' });
  }

  if (type === 'query') {
    const client = new Client(dbConfig);
    await client.connect();
    try {
      // Hacemos que la consulta masiva corra 30 veces seguidas para darle tiempo a htop de registrarla
      for (let i = 0; i < 30; i++) {
        await client.query(`
          WITH RECURSIVE t(n) AS (
            VALUES (1)
            UNION ALL
            SELECT n+1 FROM t WHERE n < 150000
          )
          SELECT md5(string_agg(md5(n::text), '')) FROM t;
        `);
      }
    } catch (e) {
      console.error(e);
    } finally {
      await client.end();
    }
    return NextResponse.json({ message: 'Query Flood ejecutado en PostgreSQL' });
  }

  if (type === 'insert') {
    const client = new Client(dbConfig);
    await client.connect();
    try {
      await client.query(`CREATE TABLE IF NOT EXISTS test_stress (id SERIAL, data TEXT);`);
      for (let i = 0; i < 8000; i++) {
        await client.query(`INSERT INTO test_stress (data) VALUES (repeat('ESTRES_UNIVALLE_SO_', 50));`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      await client.end();
    }
    return NextResponse.json({ message: 'Insert Flood completado' });
  }

  return NextResponse.json({ error: 'Mecanismo no valido' }, { status: 400 });
}
