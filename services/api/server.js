const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'postgres_container', 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: "healthy", runtime: "Node.js en WSL2" });
});

app.get('/api/v1/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW();');
    res.json({ connection: "successful", db_time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ connection: "failed", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API activa en puerto ${port}`);
});
