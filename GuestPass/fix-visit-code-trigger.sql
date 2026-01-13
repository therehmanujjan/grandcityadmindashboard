-- Fix the visit code generation trigger to work with guestpass schema
-- This ensures the trigger looks in the correct schema when generating codes

SET search_path TO guestpass;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS generate_visit_code_trigger ON visits;

-- Recreate the function with explicit schema reference
CREATE OR REPLACE FUNCTION generate_visit_code()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_part VARCHAR(6);
    next_number INTEGER;
    max_code TEXT;
BEGIN
    year_part := TO_CHAR(NEW.scheduled_date, 'YYYY');

    -- Get the highest visit code for the year from guestpass schema
    SELECT visit_code INTO max_code
    FROM guestpass.visits
    WHERE visit_code LIKE 'GC-' || year_part || '-%'
    ORDER BY visit_code DESC
    LIMIT 1;

    -- Extract the numeric part and increment
    IF max_code IS NOT NULL THEN
        -- Extract last 6 digits: GC-2026-000001 -> 000001 -> 1
        next_number := CAST(SUBSTRING(max_code FROM '\d{6}$') AS INTEGER) + 1;
    ELSE
        next_number := 1;
    END IF;

    -- Format as 6-digit padded number
    sequence_part := LPAD(next_number::TEXT, 6, '0');

    -- Standard format: GC-YYYY-XXXXXX
    NEW.visit_code := 'GC-' || year_part || '-' || sequence_part;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER generate_visit_code_trigger
    BEFORE INSERT ON visits
    FOR EACH ROW
    WHEN (NEW.visit_code IS NULL)
    EXECUTE FUNCTION generate_visit_code();

-- Verify the trigger is created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'visits' 
AND indexname LIKE '%visit_code%';

SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    proname as function_name,
    tgenabled as enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'generate_visit_code_trigger';
