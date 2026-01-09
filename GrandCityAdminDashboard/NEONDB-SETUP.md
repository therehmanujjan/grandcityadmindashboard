# NeonDB Setup Guide

This guide will help you set up NeonDB (Serverless Postgres) for your Grand City Admin Dashboard.

## Why NeonDB?

- ✅ Serverless Postgres database
- ✅ Automatic scaling
- ✅ Generous free tier
- ✅ Fast cold starts
- ✅ Built for modern applications
- ✅ Excellent Vercel integration

## Step-by-Step Setup

### 1. Create a NeonDB Account

1. Go to https://console.neon.tech
2. Sign up with GitHub, Google, or email
3. Verify your email if required

### 2. Create a New Project

1. Click "Create Project"
2. Give your project a name (e.g., "grand-city-dashboard")
3. Select a region (choose one closest to your users)
4. Click "Create Project"

### 3. Get Your Connection String

1. After project creation, you'll see your connection string
2. Click the "Copy" button next to the connection string
3. It will look like:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### 4. Configure Environment Variables

#### For Local Development:

1. Open `.env.local` in your project root
2. Replace the placeholder with your actual connection string:
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

#### For Vercel Deployment:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** Your NeonDB connection string
   - **Environment:** Production, Preview, Development (select all)
4. Click "Save"

### 5. Set Up Database Schema

1. Go to NeonDB Console → SQL Editor
2. Open the `neon-schema.sql` file from your project
3. Copy all the SQL content
4. Paste it into the NeonDB SQL Editor
5. Click "Run" to execute the schema

This will create:
- ✅ All necessary tables (users, projects, shifts, etc.)
- ✅ Indexes for better performance
- ✅ Auto-update triggers
- ✅ Sample data (optional)

### 6. Test Your Connection

Run your Next.js dev server:
```bash
npm run dev
```

Visit http://localhost:3000 and check if the app loads without database errors.

## Database Tables

Your NeonDB includes these tables:

| Table | Description |
|-------|-------------|
| `users` | Employee/user information |
| `projects` | Construction projects |
| `shifts` | Employee shift schedules |
| `communications` | Internal communications |
| `photo_logs` | Project photos and documentation |
| `tasks` | Task management |
| `payments` | Payment tracking |
| `vendors` | Vendor management |
| `reports` | Generated reports |

## Querying the Database

### Using the NeonDB Client

The app uses `@neondatabase/serverless` for database operations:

```typescript
import { sql } from '@/utils/neonClient';

// Simple query
const users = await sql`SELECT * FROM users`;

// Parameterized query (prevents SQL injection)
const user = await sql`
  SELECT * FROM users 
  WHERE email = ${email}
`;

// Insert
const newUser = await sql`
  INSERT INTO users (name, email, role)
  VALUES (${name}, ${email}, ${role})
  RETURNING *
`;

// Update
await sql`
  UPDATE users 
  SET status = ${status}
  WHERE id = ${userId}
`;

// Delete
await sql`
  DELETE FROM users 
  WHERE id = ${userId}
`;
```

### Using API Routes

The app includes API routes for database operations:

```typescript
// Fetch users
const response = await fetch('/api/users');
const users = await response.json();

// Create user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Manager'
  })
});
```

## Managing Your Database

### NeonDB Console Features

1. **SQL Editor**: Run SQL queries directly
2. **Tables**: View and edit table data
3. **Branches**: Create database branches (like Git)
4. **Monitoring**: View performance metrics
5. **Backups**: Automatic daily backups

### Branching (Advanced)

NeonDB supports database branching:

```bash
# Create a branch for testing
neonctl branches create --name testing

# Switch your connection string to the branch
DATABASE_URL=postgresql://...@ep-xxx-xxx.../dbname?options=branch:testing
```

## Performance Tips

1. **Connection Pooling**: Already handled by `@neondatabase/serverless`
2. **Indexes**: Created automatically by the schema
3. **Query Optimization**: Use `EXPLAIN` to analyze slow queries
4. **Caching**: Consider adding Redis for frequently accessed data

## Troubleshooting

### Error: "Database not configured"

**Solution**: Make sure `DATABASE_URL` is set in `.env.local`

### Error: "Connection timeout"

**Solutions**:
- Check your internet connection
- Verify the connection string is correct
- Ensure your IP isn't blocked (NeonDB allows all IPs by default)

### Error: "SSL required"

**Solution**: Make sure your connection string includes `?sslmode=require`

### Error: "Table does not exist"

**Solution**: Run the `neon-schema.sql` in NeonDB SQL Editor

## Migration from Supabase

If you're migrating from Supabase:

1. Export your Supabase data (SQL dump)
2. Import the dump into NeonDB SQL Editor
3. Update environment variables
4. Update code references from Supabase to NeonDB

## Resources

- 📚 [NeonDB Documentation](https://neon.tech/docs)
- 🔧 [NeonDB CLI](https://neon.tech/docs/reference/neon-cli)
- 💬 [NeonDB Discord Community](https://discord.gg/neon)
- 📖 [Serverless Driver Docs](https://neon.tech/docs/serverless/serverless-driver)

## Free Tier Limits

NeonDB free tier includes:
- ✅ 0.5 GB storage
- ✅ 1 project
- ✅ 10 branches
- ✅ Unlimited compute hours (with autosuspend)

Perfect for development and small applications!

## Next Steps

1. ✅ Set up NeonDB account
2. ✅ Configure environment variables
3. ✅ Run database schema
4. ✅ Test local development
5. ✅ Deploy to Vercel
6. 🚀 Build amazing features!

---

**Need help?** Check the [NeonDB documentation](https://neon.tech/docs) or ask in their Discord community.
