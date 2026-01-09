require('dotenv').config();
const { Pool } = require('pg');

// 1. Source Database (Import Branch - Public Schema)
const SOURCE_DB_URL = 'postgresql://neondb_owner:npg_IczWjokiE7r8@ep-lucky-brook-ad9sw46i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// 2. Target Database (Production - GuestPass Schema)
const TARGET_DB_URL = process.env.DATABASE_URL;

const sourcePool = new Pool({
  connectionString: SOURCE_DB_URL,
  ssl: { rejectUnauthorized: false }
});

const targetPool = new Pool({
  connectionString: TARGET_DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const sourceClient = await sourcePool.connect();
  const targetClient = await targetPool.connect();
  
  try {
    console.log('🚀 Starting migration...');
    console.log('Source: Import Branch (public)');
    console.log('Target: Production (guestpass)');
    
    await targetClient.query('BEGIN');
    await targetClient.query('SET search_path TO guestpass, public');
    await sourceClient.query('SET search_path TO public'); // Assuming source data is in public

    // --- 1. USERS (Phase 1: Insert without executive_id linkage) ---
    console.log('Migrating Users (Phase 1)...');
    const usersResult = await sourceClient.query('SELECT * FROM users');
    console.log(`- Found ${usersResult.rows.length} users.`);

    for (const user of usersResult.rows) {
      // Exclude executive_id and created_by initially to avoid FK errors
      // Keys: id, email, password_hash, full_name...
      const columns = Object.keys(user).filter(k => k !== 'executive_id' && k !== 'created_by');
      const values = columns.map(k => user[k]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO guestpass.users (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (id) DO NOTHING
      `;
      
      await targetClient.query(query, values);
    }

    // --- 2. EXECUTIVES ---
    console.log('Migrating Executives...');
    const execsResult = await sourceClient.query('SELECT * FROM executives');
    console.log(`- Found ${execsResult.rows.length} executives.`);
    
    for (const exec of execsResult.rows) {
      const columns = Object.keys(exec);
      const values = columns.map(k => exec[k]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      
      await targetClient.query(`
        INSERT INTO guestpass.executives (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (id) DO NOTHING
      `, values);
    }

    // --- 3. USERS (Phase 2: Link Executive IDs and Created By) ---
    console.log('Linking Users (Phase 2)...');
    for (const user of usersResult.rows) {
      if (user.executive_id || user.created_by) {
        await targetClient.query(`
          UPDATE guestpass.users 
          SET executive_id = $1, created_by = $2
          WHERE id = $3
        `, [user.executive_id, user.created_by, user.id]);
      }
    }

    // --- 4. VISITORS ---
    console.log('Migrating Visitors...');
    const visitorsResult = await sourceClient.query('SELECT * FROM visitors');
    console.log(`- Found ${visitorsResult.rows.length} visitors.`);
    
    for (const row of visitorsResult.rows) {
      // Remove blacklisted_by if it causes issues, or keep if user exists
      const columns = Object.keys(row);
      const values = columns.map(k => row[k]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      
      await targetClient.query(`
        INSERT INTO guestpass.visitors (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (id) DO NOTHING
      `, values);
    }

    // --- 5. VISITS ---
    console.log('Migrating Visits...');
    const visitsResult = await sourceClient.query('SELECT * FROM visits');
    console.log(`- Found ${visitsResult.rows.length} visits.`);
    
    for (const row of visitsResult.rows) {
      const columns = Object.keys(row);
      const values = columns.map(k => row[k]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      
      await targetClient.query(`
        INSERT INTO guestpass.visits (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (id) DO NOTHING
      `, values);
    }

    // --- 6. OTHER TABLES (System Settings, etc) ---
    const otherTables = ['system_settings', 'audit_logs', 'notifications', 'visit_approvals']; // Add more if needed
    for (const table of otherTables) {
         // Check if table exists in source
         const checkTable = await sourceClient.query(`
             SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)
         `, [table]);
         
         if (checkTable.rows[0].exists) {
            console.log(`Migrating ${table}...`);
            const rows = await sourceClient.query(`SELECT * FROM ${table}`);
            if (rows.rows.length > 0) {
                 for (const row of rows.rows) {
                    const columns = Object.keys(row);
                    const values = columns.map(k => row[k]);
                    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
                     await targetClient.query(`
                        INSERT INTO guestpass.${table} (${columns.join(', ')})
                        VALUES (${placeholders})
                        ON CONFLICT (id) DO NOTHING
                     `, values);
                 }
            }
         }
    }

    await targetClient.query('COMMIT');
    console.log('✅ Migration completed successfully!');

  } catch (error) {
    await targetClient.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sourceClient.release();
    targetClient.release();
    await sourcePool.end();
    await targetPool.end();
  }
}

migrate();
