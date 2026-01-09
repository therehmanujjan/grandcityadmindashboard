# GuestPass Data Migration Plan

This guide details how to migrate data from the existing GuestPass Database into the new `guestpass` schema in the GrandCity Database.

## Prerequisites
- Tools required: `pg_dump`, `psql` (or a GUI like pgAdmin/DBeaver)
- Credentials for both GuestPass DB (Source) and GrandCity DB (Target)

## Step 1: Export Data from GuestPass
We will export data using `pg_dump`. Since the source DB has tables in `public`, we must be careful to import them into `guestpass`.

**Command:**
```powershell
pg_dump "postgres://user:pass@source_host/source_db?sslmode=require" ^
  --data-only ^
  --column-inserts ^
  --schema=public ^
  --file=guestpass_data.sql
```
*Note: We only need `--data-only` because the schema structure is already created by `grandcity_guestpass_schema.sql`.*

## Step 2: Prepare the Dump File
The exported SQL will contain statements like `INSERT INTO public.users ...`. We need to change `public.` to `guestpass.`.

**Manual Adjustment (Recommended):**
1. Open `guestpass_data.sql` in a text editor (VS Code).
2. Find and Replace All:
   - Find: `INSERT INTO public.`
   - Replace: `INSERT INTO guestpass.`
3. Add this line at the very top of the file:
   ```sql
   SET search_path TO guestpass;
   ```

## Step 3: Clear Existing Seed Data (Optional)
If you already ran the migration script, it might have inserted a default admin user. You may want to truncation tables before importing to avoid conflicts, or use `ON CONFLICT DO NOTHING`.

**Clean up script:**
```sql
TRUNCATE TABLE guestpass.audit_logs CASCADE;
TRUNCATE TABLE guestpass.notifications CASCADE;
TRUNCATE TABLE guestpass.visit_approvals CASCADE;
TRUNCATE TABLE guestpass.visits CASCADE;
TRUNCATE TABLE guestpass.visitors CASCADE;
TRUNCATE TABLE guestpass.executives CASCADE;
TRUNCATE TABLE guestpass.users CASCADE;
```

## Step 4: Import Data to GrandCity DB
Run the modified SQL against GrandCity DB.

**Command:**
```powershell
psql "postgres://user:pass@target_host/grandcity_db?sslmode=require" -f guestpass_data.sql
```

## Step 5: Runtime Configuration
Update GuestPass application to use the GrandCity DB connection string with the search path option.

**.env file in GuestPass:**
```env
DATABASE_URL=postgres://grandcity_user:password@neon-host/grandcity_db?sslmode=require&options=-csearch_path%3Dguestpass,public
```
*Note: The `options=-csearch_path...` is crucial for the application to find its tables without code changes.*
