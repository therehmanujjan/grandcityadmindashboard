-- ============================================
-- TIMEZONE FIX FOR COMMUNICATIONS
-- ============================================
-- Problem: Database stores timestamps in UTC, but user is in UTC+5 (Asia/Karachi)
-- Solution: Use TIMESTAMPTZ (timestamp with timezone) and set database timezone
-- ============================================

-- Step 1: Set the database timezone to Asia/Karachi (UTC+5)
-- Note: This affects the current session. For permanent fix, set in Neon dashboard.
SET timezone = 'Asia/Karachi';

-- Step 2: Convert existing TIMESTAMP columns to TIMESTAMPTZ
-- This preserves existing data and makes future timestamps timezone-aware

-- Backup: First, let's see what we have
SELECT id, created_at, updated_at FROM communications LIMIT 5;

-- Convert created_at to TIMESTAMPTZ
ALTER TABLE communications 
ALTER COLUMN created_at TYPE TIMESTAMPTZ 
USING created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi';

-- Convert updated_at to TIMESTAMPTZ  
ALTER TABLE communications 
ALTER COLUMN updated_at TYPE TIMESTAMPTZ 
USING updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi';

-- Step 3: Update defaults to use timezone-aware NOW()
ALTER TABLE communications 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE communications 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Step 4: Update the trigger function (it will now use timezone-aware NOW())
CREATE OR REPLACE FUNCTION update_communications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Verify the changes
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'communications'
AND column_name IN ('created_at', 'updated_at');

-- Test: Insert a new record and check the timestamp
INSERT INTO communications (project, user_name, message, unread)
VALUES ('Test', 'System', 'Timezone test message', 1)
RETURNING id, created_at, updated_at, 
  created_at AT TIME ZONE 'Asia/Karachi' as local_time,
  EXTRACT(TIMEZONE FROM created_at)/3600 as timezone_offset_hours;

-- Clean up test record (uncomment if you want to remove it)
-- DELETE FROM communications WHERE message = 'Timezone test message';

SELECT 'Timezone fix completed! Timestamps now use Asia/Karachi timezone.' as status;

-- ============================================
-- IMPORTANT: For permanent fix
-- ============================================
-- Go to your Neon dashboard and set the database timezone:
-- 1. Open Neon Console: https://console.neon.tech
-- 2. Select your project
-- 3. Go to Settings
-- 4. Set timezone to 'Asia/Karachi'
-- ============================================
