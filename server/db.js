const { Pool } = require('pg');

// Throw an error if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.SSL_ENABLED === 'true' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
  try {
    console.log('Attempting to connect to database with URL:', process.env.DATABASE_URL);
    const client = await pool.connect();
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        branch VARCHAR(50),
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS doubts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        branch VARCHAR(50),
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        doubt_id INTEGER NOT NULL,
        responder_id VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        contact_info VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doubt_id) REFERENCES doubts(id) ON DELETE CASCADE,
        FOREIGN KEY (responder_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);
    
    client.release();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection test failed:', err);
    throw err;
  }
}

module.exports = { pool, initializeDatabase, testConnection };