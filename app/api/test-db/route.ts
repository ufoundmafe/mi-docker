import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  // Conectamos usando la URL del docker-compose
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000, // Si en 5 segundos no responde, se rinde y no se congela
  });

  try {
    await client.connect();
    
    // Ejecutamos un SELECT directo al procesador de Postgres, no requiere tablas
    const res = await client.query('SELECT 1 AS conectado;');
    await client.end();

    return NextResponse.json({
      status: '¡CONEXIÓN EXITOSA CON POSTGRES! 🚀',
      resultado: res.rows[0].conectado
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'Error de conexión ❌',
      error: error.message
    }, { status: 500 });
  }
}
