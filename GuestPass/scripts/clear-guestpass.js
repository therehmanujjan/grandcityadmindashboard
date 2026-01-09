require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function clearData() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Clearing all data from GUESTPASS schema...');
    await client.query('BEGIN');

    // Set search path first
    await client.query('SET search_path TO guestpass, public');
    
    // Truncate all tables with CASCADE
    // Order doesn't matter much with CASCADE, but good to be thorough
    const tables = [
      'audit_logs',
      'notifications',
      'visit_approvals',
      'recurring_visits',
      'visits',
      'visitors',
      'weekly_reports',
      'executives',
      'users',
      'system_settings'
    ];

    for (const table of tables) {
      // Check if table exists first to avoid errors
      const exists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'guestpass' 
          AND table_name = $1
        );
      `, [table]);

      if (exists.rows[0].exists) {
        console.log(`- Truncating ${table}...`);
        await client.query(`TRUNCATE TABLE guestpass.${table} CASCADE`);
      } else {
        console.log(`- Table ${table} not found, skipping.`);
      }
    }

    await client.query('COMMIT');
    console.log('✅ GuestPass schema cleared successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to clear data:', error);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

clearData();
