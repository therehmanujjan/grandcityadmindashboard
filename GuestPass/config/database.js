require('dotenv').config();
const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return error after 10 seconds if connection not available
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Connected to Neon PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  // Wrap query to ensure search_path is set for every request
  // This is necessary because transaction pooling doesn't support session-level search_path
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      await client.query('SET search_path TO guestpass');
      return await client.query(text, params);
    } finally {
      client.release();
    }
  },
  
  // Get a client for transaction handling
  getClient: async () => {
    const client = await pool.connect();
    await client.query('SET search_path TO guestpass');
    return client;
  },
  
  pool
};
