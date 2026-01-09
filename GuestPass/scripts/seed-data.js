require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function seedData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seed...');
    await client.query('BEGIN');
    
    // Set search path to ensure we use the correct schema
    await client.query('SET search_path TO guestpass, public');

    // 1. Create Admin User (if not exists)
    const adminEmail = 'admin@grandcity.pk';
    const adminPasswordHtml = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYPq/gkmGru'; // "admin123" (hashed) or similar default
    
    let adminResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (adminResult.rows.length === 0) {
      console.log('Creating Admin user...');
      adminResult = await client.query(`
        INSERT INTO users (email, password_hash, full_name, role, is_active)
        VALUES ($1, $2, $3, 'admin', true)
        RETURNING id
      `, [adminEmail, adminPasswordHtml, 'System Administrator']);
    }

    // 2. Create Executives
    console.log('Creating Executives...');
    const executives = [
      {
        name: 'John Doe',
        email: 'john.doe@grandcity.pk',
        title: 'Chief Executive Officer',
        position: 'ceo',
        department: 'Management',
        location: 'Building A, Floor 3'
      },
      {
        name: 'Sarah Smith',
        email: 'sarah.smith@grandcity.pk',
        title: 'Director Operations',
        position: 'director_operations',
        department: 'Operations',
        location: 'Building B, Floor 2'
      },
      {
        name: 'Ali Khan',
        email: 'ali.khan@grandcity.pk',
        title: 'Director Faisalabad',
        position: 'director_faisalabad',
        department: 'Regional Management',
        location: 'Faisalabad Office'
      }
    ];

    for (const exec of executives) {
      // Check if user exists
      let userResult = await client.query('SELECT id FROM users WHERE email = $1', [exec.email]);
      let userId;

      if (userResult.rows.length === 0) {
        // Create User for Executive
        const execUser = await client.query(`
          INSERT INTO users (email, password_hash, full_name, role, department, is_active)
          VALUES ($1, $2, $3, 'executive', $4, true)
          RETURNING id
        `, [exec.email, adminPasswordHtml, exec.name, exec.department]);
        userId = execUser.rows[0].id;
      } else {
        userId = userResult.rows[0].id;
      }

      // Check if executive profile exists
      const execProfile = await client.query('SELECT id FROM executives WHERE user_id = $1', [userId]);
      
      if (execProfile.rows.length === 0) {
        await client.query(`
          INSERT INTO executives (user_id, title, position, office_location, is_active)
          VALUES ($1, $2, $3, $4, true)
        `, [userId, exec.title, exec.position, exec.location]);
        console.log(`- Created Executive: ${exec.name}`);
      }
      
      // Update user with executive_id (link back)
      await client.query(`
        UPDATE users 
        SET executive_id = (SELECT id FROM executives WHERE user_id = $1) 
        WHERE id = $1
      `, [userId]);
    }

    // 3. Create Sample Visitors
    console.log('Creating Sample Visitors...');
    const visitors = [
      { name: 'Guest User 1', phone: '03001234567', company: 'ABC Corp', email: 'guest1@example.com' },
      { name: 'Guest User 2', phone: '03217654321', company: 'XYZ Ltd', email: 'guest2@example.com' }
    ];

    for (const visitor of visitors) {
      await client.query(`
        INSERT INTO visitors (full_name, phone, company, email)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [visitor.name, visitor.phone, visitor.company, visitor.email]);
    }

    await client.query('COMMIT');
    console.log('✅ Seed completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seedData();
