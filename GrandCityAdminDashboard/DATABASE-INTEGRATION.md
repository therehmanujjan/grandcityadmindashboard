# Database Integration Guide

## Overview

This guide explains how to integrate the Grand City Admin Dashboard with NeonDB, replacing all hardcoded data with database-driven content.

## Database Schema

The database includes **11 main tables** to store all application data:

### Core Tables

1. **users** - Employee and staff information
2. **projects** - Construction projects
3. **shifts** - Staff shift schedules
4. **communications** - Project communications
5. **photo_logs** - Project photos and documentation
6. **photo_comments** - Comments on photo logs
7. **tasks** - Task management
8. **task_subtasks** - Subtasks for tasks
9. **task_checklist** - Checklist items for tasks
10. **payments** - Payment tracking
11. **vendors** - Vendor management
12. **reports** - Generated reports
13. **client_access** - Client portal access
14. **dashboard_stats** - Dashboard metrics

## Setup Instructions

### 1. Run the Schema

1. Open NeonDB Console → SQL Editor
2. Copy all content from `neon-schema.sql`
3. Click "Run" to execute

This will:
- ✅ Create all tables with proper relationships
- ✅ Add indexes for performance
- ✅ Set up auto-update triggers
- ✅ Insert seed data (replaces hardcoded data)
- ✅ Create views for easy querying
- ✅ Add helper functions

### 2. Verify Setup

After running the schema, you should see:

```
table_name         | record_count
-------------------|-------------
Projects           | 3
Users              | 7
Shifts             | 4
Communications     | 3
Photo Logs         | 3
Tasks              | 4
Payments           | 3
Vendors            | 3
Reports            | 3
Client Access      | 3
Dashboard Stats    | 1
```

## Data Structure Mapping

### Projects
```typescript
{
  id: number,
  name: string,
  status: 'Active' | 'Planning' | 'In Progress' | 'Completed',
  progress: number (0-100),
  client: string,
  manager: string,
  team: number
}
```

**SQL:**
```sql
SELECT * FROM projects ORDER BY id;
```

### Users/Staff
```typescript
{
  id: number,
  name: string,
  email: string,
  role: string,
  location: string,
  shift: string,
  status: 'active' | 'inactive'
}
```

**SQL:**
```sql
SELECT * FROM users WHERE status = 'active';
```

### Shifts
```typescript
{
  id: number,
  employee: string,
  role: string,
  shift: string,
  status: 'On Duty' | 'Present' | 'On Site' | 'Off Duty',
  location: string
}
```

**SQL:**
```sql
SELECT * FROM shifts WHERE date = CURRENT_DATE;
```

### Communications
```typescript
{
  id: number,
  project: string,
  user: string,
  message: string,
  time: string,
  unread: number
}
```

**SQL:**
```sql
SELECT * FROM communications ORDER BY created_at DESC;
```

### Photo Logs
```typescript
{
  id: number,
  project: string,
  location: string,
  photos: number,
  uploadedBy: string,
  time: string,
  tags: string[]
}
```

**SQL:**
```sql
SELECT * FROM photo_logs ORDER BY created_at DESC;
```

### Tasks
```typescript
{
  id: number,
  title: string,
  assignee: string,
  project: string,
  priority: 'High' | 'Medium' | 'Low',
  due: string,
  status: 'Pending' | 'In Progress' | 'Completed',
  completion: number (0-100)
}
```

**SQL:**
```sql
SELECT * FROM tasks ORDER BY 
  CASE priority 
    WHEN 'High' THEN 1 
    WHEN 'Medium' THEN 2 
    ELSE 3 
  END;
```

### Payments
```typescript
{
  id: number,
  vendor: string,
  amount: number,
  type: 'Payable' | 'Receivable',
  due: string,
  status: string,
  project: string
}
```

**SQL:**
```sql
SELECT * FROM payments WHERE status = 'Pending';
```

### Vendors
```typescript
{
  id: number,
  name: string,
  category: string,
  rating: number,
  activeContracts: number,
  lastPayment: string,
  projects: string[],
  performance: number
}
```

**SQL:**
```sql
SELECT * FROM vendors ORDER BY performance DESC;
```

## Helper Views

The schema includes pre-built views for common queries:

### Active Projects Overview
```sql
SELECT * FROM active_projects_overview;
```
Returns projects with task and photo counts.

### Today's Staff Status
```sql
SELECT * FROM todays_staff_status;
```
Returns all staff on duty today.

### Pending Payments Summary
```sql
SELECT * FROM pending_payments_summary;
```
Returns payment totals by vendor.

## Helper Functions

### Get Project Statistics
```sql
SELECT * FROM get_project_stats('Kharian Megaproject');
```
Returns comprehensive stats for a specific project.

### Update Dashboard Stats
```sql
SELECT update_dashboard_stats();
```
Recalculates and updates dashboard metrics.

## Updating Your Code

### Before (Hardcoded)
```typescript
const [projects, setProjects] = useState<Project[]>([
  { id: 1, name: 'Project A', status: 'Active', ... },
  // ... more hardcoded data
]);
```

### After (Database)
```typescript
const [projects, setProjects] = useState<Project[]>([]);

useEffect(() => {
  const loadProjects = async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    setProjects(data);
  };
  loadProjects();
}, []);
```

## API Routes Usage

The app includes API routes for database operations:

### Fetch Projects
```typescript
GET /api/projects
```

### Create Project
```typescript
POST /api/projects
Body: {
  name: string,
  status: string,
  progress: number,
  client: string,
  manager: string,
  team: number
}
```

### Fetch Users
```typescript
GET /api/users
```

### Create User
```typescript
POST /api/users
Body: {
  name: string,
  email: string,
  role: string,
  location: string,
  shift: string,
  status: string
}
```

## Common Queries

### Get All Active Projects
```sql
SELECT * FROM projects 
WHERE status IN ('Active', 'In Progress')
ORDER BY progress DESC;
```

### Get Today's Shifts
```sql
SELECT * FROM shifts 
WHERE date = CURRENT_DATE
ORDER BY employee;
```

### Get Pending Tasks
```sql
SELECT * FROM tasks 
WHERE status = 'Pending'
ORDER BY 
  CASE priority 
    WHEN 'High' THEN 1 
    WHEN 'Medium' THEN 2 
    ELSE 3 
  END,
  due;
```

### Get Overdue Payments
```sql
SELECT * FROM payments 
WHERE status = 'Pending'
  AND due < CURRENT_DATE::TEXT
ORDER BY due;
```

### Get Project Progress
```sql
SELECT 
  name,
  progress,
  (SELECT COUNT(*) FROM tasks WHERE project = p.name) as total_tasks,
  (SELECT COUNT(*) FROM tasks WHERE project = p.name AND status = 'Completed') as completed_tasks
FROM projects p
WHERE status = 'Active';
```

## Data Maintenance

### Daily Tasks

Run this daily to update stats:
```sql
SELECT update_dashboard_stats();
```

### Weekly Tasks

1. Archive completed tasks:
```sql
-- Create archive table if needed
CREATE TABLE IF NOT EXISTS tasks_archive AS SELECT * FROM tasks WHERE 1=0;

-- Move completed tasks older than 30 days
INSERT INTO tasks_archive SELECT * FROM tasks 
WHERE status = 'Completed' 
  AND created_at < NOW() - INTERVAL '30 days';

DELETE FROM tasks 
WHERE status = 'Completed' 
  AND created_at < NOW() - INTERVAL '30 days';
```

2. Clean old photo logs:
```sql
-- Archive old photo logs (keep last 90 days)
DELETE FROM photo_logs 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Monthly Tasks

1. Update vendor performance:
```sql
UPDATE vendors v
SET performance = (
  SELECT AVG(rating) * 20
  FROM (
    SELECT 5 as rating -- Calculate based on your criteria
  ) sub
)
WHERE id = v.id;
```

2. Generate monthly reports:
```sql
INSERT INTO reports (type, project, date, status)
SELECT 
  'Monthly Summary',
  name,
  CURRENT_DATE::TEXT,
  'Generated'
FROM projects
WHERE status = 'Active';
```

## Backup & Recovery

### Backup
```bash
# Use NeonDB's built-in backup (automatic daily backups)
# Or export data manually:
pg_dump $DATABASE_URL > backup.sql
```

### Restore
```sql
-- In NeonDB SQL Editor, paste the backup SQL
-- Or use command line:
psql $DATABASE_URL < backup.sql
```

## Performance Tips

1. **Use Indexes**: Already created for all frequently queried columns
2. **Use Views**: Pre-built views optimize complex queries
3. **Pagination**: For large datasets, use LIMIT and OFFSET
4. **Connection Pooling**: Handled automatically by `@neondatabase/serverless`

### Example Pagination
```sql
-- Get page 1 (10 items per page)
SELECT * FROM tasks 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 0;

-- Get page 2
SELECT * FROM tasks 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 10;
```

## Troubleshooting

### Issue: Foreign key constraint errors
**Solution**: Insert data in the correct order (projects before photo_logs)

### Issue: Duplicate key errors
**Solution**: Use `ON CONFLICT DO NOTHING` or `ON CONFLICT DO UPDATE`

### Issue: Slow queries
**Solution**: Check indexes with `EXPLAIN ANALYZE`
```sql
EXPLAIN ANALYZE SELECT * FROM tasks WHERE assignee = 'John Doe';
```

## Next Steps

1. ✅ Run `neon-schema.sql` in NeonDB
2. ✅ Verify seed data is loaded
3. ✅ Update `useGrandCityData` hook to fetch from database
4. ✅ Test all CRUD operations
5. ✅ Deploy to production

---

**Database is ready!** All hardcoded data has been seeded. Start building your database-driven features! 🚀
