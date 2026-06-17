'use client';
import { useState } from 'react';

export default function StressDashboard() {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    http: false,
    query: false,
    insert: false,
  });
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  const runStress = async (type: 'http' | 'query' | 'insert') => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setMessages(prev => ({ ...prev, [type]: `⚡ Ejecutando ataque de estrés masivo: ${type.toUpperCase()}...` }));

    try {
      const response = await fetch(`/api/stress?type=${type}`, { method: 'POST' });
      const data = await response.json();
      setMessages(prev => ({ ...prev, [type]: `✅ ${data.message || 'Completado con éxito'}` }));
    } catch (error) {
      setMessages(prev => ({ ...prev, [type]: `❌ Simulación en ejecución (Revisa htop para ver el impacto en CPU)` }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div style={{ backgroundColor: '#111827', color: '#f3f4f6', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #374151', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#ef4444', fontSize: '2.5rem', margin: 0 }}>📊 Panel de Control de Estrés Multicapa</h1>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Mini-Proyecto Sistemas Operativos - Universidad del Valle (Sede Tuluá)</p>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* MECANISMO 1: HTTP FLOOD */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>🌐 1. Inundación HTTP (HTTP Flood)</h2>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: '1.4' }}>
            Satura el event loop de Node.js inyectando ráfagas de peticiones HTTP concurrentes para elevar el uso de CPU.
          </p>
          <button 
            onClick={() => runStress('http')}
            disabled={loading.http}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: loading.http ? '#4b5563' : '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            {loading.http ? 'Atacando...' : 'Detonar HTTP Flood'}
          </button>
          {messages.http && <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#60a5fa' }}>{messages.http}</p>}
        </div>

        {/* MECANISMO 2: QUERY FLOOD */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>🔍 2. Inyección de Consultas (Query Flood)</h2>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: '1.4' }}>
            Maximiza el procesamiento de PostgreSQL mediante consultas complejas (SELECT con JOINs y agregaciones pesadas).
          </p>
          <button 
            onClick={() => runStress('query')}
            disabled={loading.query}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: loading.query ? '#4b5563' : '#f59e0b', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            {loading.query ? 'Procesando Queries...' : 'Detonar Query Flood'}
          </button>
          {messages.query && <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#60a5fa' }}>{messages.query}</p>}
        </div>

        {/* MECANISMO 3: INSERT FLOOD */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>💾 3. Escritura Masiva (Insert Flood)</h2>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: '1.4' }}>
            Estresa el I/O de disco duro mediante la inserción masiva en lotes (batch INSERT) directo al WAL de la base de datos.
          </p>
          <button 
            onClick={() => runStress('insert')}
            disabled={loading.insert}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: loading.insert ? '#4b5563' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            {loading.insert ? 'Escribiendo en Disco...' : 'Detonar Insert Flood'}
          </button>
          {messages.insert && <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#60a5fa' }}>{messages.insert}</p>}
        </div>

      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: '#4b5563', fontSize: '0.85rem', borderTop: '1px solid #1f2937', paddingTop: '1rem' }}>
        Evidencias requeridas: htop (árbol de procesos), vmstat 2 30, iostat y docker stats.
      </footer>
    </div>
  );
}
