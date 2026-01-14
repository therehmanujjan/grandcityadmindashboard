-- ============================================
-- Communications Table Migration
-- ============================================
-- Purpose: Ensure communications table supports full CRUD operations
--          with proper constraints, indexes, and data integrity
--          Removes static 'time' field in favor of dynamic 'created_at'
-- 
-- How to run:
--   1. Open Neon SQL Editor: https://console.neon.tech
--   2. Copy and paste this entire script
--   3. Execute
--   4. Verify no errors
--
-- This script is IDEMPOTENT - safe to run multiple times
-- ============================================

-- Set timezone to Pakistan Standard Time (UTC+5)
-- This ensures timestamps are stored in the correct local timezone
SET timezone = 'Asia/Karachi';

-- Ensure the communications table exists with all required columns
-- (This should already exist from neon-schema.sql, but we verify here)
CREATE TABLE IF NOT EXISTS communications (
  id SERIAL PRIMARY KEY,
  project VARCHAR(255),
  user_name VARCHAR(255),
  message TEXT NOT NULL,
  time VARCHAR(100),  -- Will be dropped below
  unread INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Karachi'),
  updated_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Karachi')
);

-- Drop the 'time' column if it exists (static strings don't update dynamically)
-- We'll use created_at instead for dynamic relative time calculation in the UI
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'communications' 
    AND column_name = 'time'
  ) THEN
    ALTER TABLE communications DROP COLUMN time;
    RAISE NOTICE 'Dropped time column - will use created_at for dynamic time display';
  ELSE
    RAISE NOTICE 'Time column already removed';
  END IF;
END $$;

-- Add CHECK constraint to ensure unread is only 0 or 1
-- Using DO block to make it idempotent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'communications_unread_check' 
    AND conrelid = 'communications'::regclass
  ) THEN
    ALTER TABLE communications 
    ADD CONSTRAINT communications_unread_check 
    CHECK (unread IN (0, 1));
    RAISE NOTICE 'Added unread check constraint';
  ELSE
    RAISE NOTICE 'Unread check constraint already exists';
  END IF;
END $$;

-- Add index on (project, created_at DESC) for efficient queries
-- This helps when filtering by project and sorting by newest first
CREATE INDEX IF NOT EXISTS idx_communications_project_created 
ON communications(project, created_at DESC);

-- Add index on (unread) for filtering unread messages
CREATE INDEX IF NOT EXISTS idx_communications_unread 
ON communications(unread);

-- Add index on created_at for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_communications_created_at 
ON communications(created_at DESC);

-- Ensure the updated_at trigger exists
-- (Should already exist from neon-schema.sql, but we verify here)
CREATE OR REPLACE FUNCTION update_communications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate to ensure it's current
DROP TRIGGER IF EXISTS update_communications_updated_at ON communications;

CREATE TRIGGER update_communications_updated_at 
BEFORE UPDATE ON communications
FOR EACH ROW 
EXECUTE FUNCTION update_communications_updated_at();

-- Add helpful comments to document column usage
COMMENT ON TABLE communications IS 'Stores project communications and messages';
COMMENT ON COLUMN communications.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN communications.project IS 'Project name this communication belongs to';
COMMENT ON COLUMN communications.user_name IS 'Name of the user who sent the message';
COMMENT ON COLUMN communications.message IS 'The message content (required)';
COMMENT ON COLUMN communications.unread IS 'Unread status: 1 = unread, 0 = read';
COMMENT ON COLUMN communications.created_at IS 'Timestamp when the message was created - use this for sorting and calculating relative time (e.g., "2 hours ago")';
COMMENT ON COLUMN communications.updated_at IS 'Timestamp when the message was last updated (auto-updated by trigger)';

-- Verify the setup
DO $$
DECLARE
  constraint_count INTEGER;
  index_count INTEGER;
  trigger_count INTEGER;
  time_column_exists BOOLEAN;
BEGIN
  -- Check constraints
  SELECT COUNT(*) INTO constraint_count
  FROM pg_constraint 
  WHERE conname = 'communications_unread_check' 
  AND conrelid = 'communications'::regclass;
  
  -- Check indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE tablename = 'communications' 
  AND indexname IN ('idx_communications_project_created', 'idx_communications_unread', 'idx_communications_created_at');
  
  -- Check trigger
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger 
  WHERE tgname = 'update_communications_updated_at' 
  AND tgrelid = 'communications'::regclass;
  
  -- Check if time column still exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'communications' 
    AND column_name = 'time'
  ) INTO time_column_exists;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration verification:';
  RAISE NOTICE '  - Unread constraint: % (expected: 1)', constraint_count;
  RAISE NOTICE '  - Indexes: % (expected: 3)', index_count;
  RAISE NOTICE '  - Updated_at trigger: % (expected: 1)', trigger_count;
  RAISE NOTICE '  - Time column removed: % (expected: false)', time_column_exists;
  RAISE NOTICE '========================================';
  
  IF constraint_count = 1 AND index_count = 3 AND trigger_count = 1 AND NOT time_column_exists THEN
    RAISE NOTICE 'SUCCESS: All migration components applied correctly!';
    RAISE NOTICE 'The UI will now calculate relative time dynamically from created_at';
  ELSE
    RAISE WARNING 'Some components may not have been applied. Please review the output above.';
  END IF;
END $$;

-- Display current table structure
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'communications'
ORDER BY ordinal_position;

-- Display current indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'communications'
ORDER BY indexname;

-- Display current constraints
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'communications'::regclass
ORDER BY conname;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Update API to not send/expect 'time' field
-- 2. Update UI to calculate relative time from created_at
--    Example: "2 hours ago", "Just now", "3 days ago"
-- ============================================

