-- =====================================================
-- PERSONNEL DIRECTORY - DATABASE SCHEMA UPDATE
-- =====================================================
-- This script creates a comprehensive personnel table
-- and updates the personnel_properties relationship table
-- Based on Gillani's Maintenance System requirements
-- =====================================================

-- 1. Drop existing personnel_properties if it exists (to recreate with proper structure)
DROP TABLE IF EXISTS personnel_properties CASCADE;

-- 2. Create comprehensive Personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) UNIQUE,
  department VARCHAR(100),
  shift VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  hire_date DATE,
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(50),
  specialization VARCHAR(255), -- e.g., "Electrical Systems", "HVAC", "Plumbing"
  certification VARCHAR(255), -- Professional certifications
  experience_years INTEGER DEFAULT 0,
  location VARCHAR(255), -- Primary work location
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Recreate personnel_properties with proper foreign keys
-- If you want to update existing table, comment out DROP and CREATE, and just add ALTER statements
CREATE TABLE IF NOT EXISTS personnel_properties (
  id SERIAL PRIMARY KEY,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  is_primary BOOLEAN DEFAULT FALSE, -- Indicates if this is their primary assigned property
  notes TEXT, -- Any specific notes about this assignment
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(personnel_id, property_id)
);

-- 4. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_personnel_role ON personnel(role);
CREATE INDEX IF NOT EXISTS idx_personnel_status ON personnel(status);
CREATE INDEX IF NOT EXISTS idx_personnel_properties_personnel ON personnel_properties(personnel_id);
CREATE INDEX IF NOT EXISTS idx_personnel_properties_property ON personnel_properties(property_id);

-- 5. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_personnel_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_personnel_timestamp ON personnel;
CREATE TRIGGER trigger_update_personnel_timestamp
  BEFORE UPDATE ON personnel
  FOR EACH ROW
  EXECUTE FUNCTION update_personnel_updated_at();

DROP TRIGGER IF EXISTS trigger_update_personnel_properties_timestamp ON personnel_properties;
CREATE TRIGGER trigger_update_personnel_properties_timestamp
  BEFORE UPDATE ON personnel_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_personnel_updated_at();

-- =====================================================
-- SEED DATA - Personnel (Based on Gillani's HTML System)
-- =====================================================

-- Insert Personnel Data
INSERT INTO personnel (name, role, phone, email, department, shift, status, specialization, experience_years, location) VALUES
  ('Ahmed Khan', 'Electrician', '+92-300-1234567', 'ahmed.khan@grandcity.com', 'Maintenance', 'Morning', 'active', 'Electrical Systems, Power Distribution', 8, 'Grand City Plaza'),
  ('Hassan Ali', 'Electrician', '+92-301-2345678', 'hassan.ali@grandcity.com', 'Maintenance', 'Evening', 'active', 'Lighting Systems, Wiring', 5, 'Faisalabad Office'),
  ('Bilal Ahmad', 'Car Maintenance', '+92-302-3456789', 'bilal.ahmad@grandcity.com', 'Transportation', 'Morning', 'active', 'Automotive Repair, Vehicle Inspection', 10, 'Grand City Plaza'),
  ('Usman Tariq', 'Car Maintenance', '+92-303-4567890', 'usman.tariq@grandcity.com', 'Transportation', 'Morning', 'active', 'Mechanical Systems, Car Diagnostics', 7, 'Faisalabad Office'),
  ('Zain Malik', 'IT Support', '+92-304-5678901', 'zain.malik@grandcity.com', 'IT', 'Morning', 'active', 'Network Administration, Hardware Support', 6, 'Grand City Plaza'),
  ('Imran Sheikh', 'IT Support', '+92-305-6789012', 'imran.sheikh@grandcity.com', 'IT', 'Evening', 'active', 'Software Support, System Maintenance', 4, 'Grand City Plaza'),
  ('Fatima Noor', 'HR', '+92-306-7890123', 'fatima.noor@grandcity.com', 'Human Resources', 'Morning', 'active', 'Employee Relations, Compliance', 12, 'Grand City Plaza'),
  ('Ayesha Saleem', 'HR', '+92-307-8901234', 'ayesha.saleem@grandcity.com', 'Human Resources', 'Morning', 'active', 'Recruitment, Training & Development', 9, 'Grand City Plaza'),
  ('Rashid Mahmood', 'Maintenance', '+92-308-9012345', 'rashid.mahmood@grandcity.com', 'Maintenance', 'Morning', 'active', 'General Maintenance, Facility Management', 15, 'Grand City Plaza'),
  ('Kamran Javed', 'Maintenance', '+92-309-0123456', 'kamran.javed@grandcity.com', 'Maintenance', 'Evening', 'active', 'Building Systems, Preventive Maintenance', 11, 'Faisalabad Office'),
  ('Saad Iqbal', 'Plumber', '+92-310-1234567', 'saad.iqbal@grandcity.com', 'Maintenance', 'Morning', 'active', 'Plumbing Systems, Water Supply', 9, 'Grand City Plaza'),
  ('Farhan Raza', 'HVAC Technician', '+92-311-2345678', 'farhan.raza@grandcity.com', 'Maintenance', 'Morning', 'active', 'HVAC Systems, Climate Control', 7, 'Grand City Plaza'),
  ('Naveed Ahmed', 'Security Manager', '+92-312-3456789', 'naveed.ahmed@grandcity.com', 'Security', 'Night', 'active', 'Security Operations, Access Control', 13, 'Grand City Plaza'),
  ('Waqas Hussain', 'Facility Manager', '+92-313-4567890', 'waqas.hussain@grandcity.com', 'Operations', 'Morning', 'active', 'Facility Planning, Vendor Management', 16, 'Grand City Plaza'),
  ('Tariq Aziz', 'Carpenter', '+92-314-5678901', 'tariq.aziz@grandcity.com', 'Maintenance', 'Morning', 'active', 'Woodwork, Furniture Repair', 10, 'Faisalabad Office')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SEED DATA - Properties (Create sample properties if needed)
-- =====================================================
-- Create sample properties if they don't exist
INSERT INTO properties (id, name, location, description) VALUES
  (1, 'Grand City Plaza', 'Main Boulevard, Faisalabad', 'Commercial property - main plaza'),
  (2, 'Faisalabad Office', 'Canal Road, Faisalabad', 'Office building'),
  (3, 'Residential Units', 'Satellite Town, Faisalabad', 'Residential units complex')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence if needed (in case properties already exist with higher IDs)
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));

-- =====================================================
-- SEED DATA - Property Assignments
-- =====================================================
-- Note: Make sure properties exist with these IDs or adjust accordingly
-- The above section creates sample properties with id 1, 2, 3

-- Electricians assigned to properties
INSERT INTO personnel_properties (personnel_id, property_id, is_primary, notes) VALUES
  (1, 1, TRUE, 'Primary electrician for Grand City Plaza'),
  (1, 2, FALSE, 'Backup support for Faisalabad Office'),
  (2, 2, TRUE, 'Primary electrician for Faisalabad Office'),
  (2, 3, FALSE, 'Backup support for residential units')
ON CONFLICT (personnel_id, property_id) DO NOTHING;

-- Car Maintenance assigned to properties
INSERT INTO personnel_properties (personnel_id, property_id, is_primary, notes) VALUES
  (3, 1, TRUE, 'Primary car maintenance for Grand City Plaza fleet'),
  (4, 2, TRUE, 'Primary car maintenance for Faisalabad Office fleet')
ON CONFLICT (personnel_id, property_id) DO NOTHING;

-- IT Support assigned to properties
INSERT INTO personnel_properties (personnel_id, property_id, is_primary, notes) VALUES
  (5, 1, TRUE, 'Primary IT support for Grand City Plaza'),
  (5, 2, FALSE, 'Remote IT support for Faisalabad Office'),
  (6, 1, FALSE, 'Evening shift IT support for Grand City Plaza')
ON CONFLICT (personnel_id, property_id) DO NOTHING;

-- HR assigned to all properties (corporate-wide)
INSERT INTO personnel_properties (personnel_id, property_id, is_primary, notes) VALUES
  (7, 1, TRUE, 'HR Manager for Grand City Plaza'),
  (7, 2, TRUE, 'HR Manager for Faisalabad Office'),
  (8, 1, FALSE, 'HR Coordinator for Grand City Plaza'),
  (8, 2, FALSE, 'HR Coordinator for Faisalabad Office')
ON CONFLICT (personnel_id, property_id) DO NOTHING;

-- Maintenance staff assigned to properties
INSERT INTO personnel_properties (personnel_id, property_id, is_primary, notes) VALUES
  (9, 1, TRUE, 'General maintenance supervisor for Grand City Plaza'),
  (10, 2, TRUE, 'General maintenance supervisor for Faisalabad Office'),
  (11, 1, TRUE, 'Primary plumber for Grand City Plaza'),
  (12, 1, TRUE, 'Primary HVAC technician for Grand City Plaza'),
  (13, 1, TRUE, 'Security manager for Grand City Plaza'),
  (14, 1, TRUE, 'Facility manager for Grand City Plaza'),
  (15, 2, TRUE, 'Primary carpenter for Faisalabad Office')
ON CONFLICT (personnel_id, property_id) DO NOTHING;

-- =====================================================
-- OPTIONAL: Migration from users table to personnel
-- =====================================================
-- If you have existing personnel data in the users table,
-- you can migrate it to the new personnel table:
/*
INSERT INTO personnel (name, email, role, location, status, created_at)
SELECT 
  name,
  email,
  role,
  location,
  CASE 
    WHEN status = 'Active' THEN 'active'
    WHEN status = 'Inactive' THEN 'inactive'
    ELSE 'active'
  END as status,
  created_at
FROM users
WHERE role IN ('Electrician', 'Car Maintenance', 'IT Support', 'HR', 'Maintenance', 
               'Plumber', 'HVAC Technician', 'Security Manager', 'Facility Manager', 'Carpenter')
ON CONFLICT (email) DO NOTHING;
*/

-- =====================================================
-- VIEWS FOR EASY QUERYING
-- =====================================================

-- View to see personnel with their assigned properties
CREATE OR REPLACE VIEW personnel_with_properties AS
SELECT 
  p.id,
  p.name,
  p.role,
  p.phone,
  p.email,
  p.department,
  p.shift,
  p.status,
  p.specialization,
  p.experience_years,
  p.location,
  COUNT(pp.property_id) as assigned_properties_count,
  STRING_AGG(prop.name, ', ') as assigned_property_names
FROM personnel p
LEFT JOIN personnel_properties pp ON p.id = pp.personnel_id
LEFT JOIN properties prop ON pp.property_id = prop.id
GROUP BY p.id, p.name, p.role, p.phone, p.email, p.department, p.shift, p.status, 
         p.specialization, p.experience_years, p.location;

-- View to see personnel by role
CREATE OR REPLACE VIEW personnel_by_role AS
SELECT 
  role,
  COUNT(*) as total_count,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_count,
  COUNT(CASE WHEN status = 'on_leave' THEN 1 END) as on_leave_count
FROM personnel
GROUP BY role
ORDER BY total_count DESC;

-- =====================================================
-- SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Get all active personnel
-- SELECT * FROM personnel WHERE status = 'active' ORDER BY name;

-- Get all electricians
-- SELECT * FROM personnel WHERE role = 'Electrician';

-- Get personnel assigned to a specific property
-- SELECT p.* FROM personnel p
-- JOIN personnel_properties pp ON p.id = pp.personnel_id
-- WHERE pp.property_id = 1;

-- Get personnel with their property assignments
-- SELECT * FROM personnel_with_properties ORDER BY name;

-- Get personnel count by role
-- SELECT * FROM personnel_by_role;

-- =====================================================
-- CLEANUP (Optional - use with caution)
-- =====================================================
-- To reset and start fresh (WARNING: This will delete all data):
-- DROP TABLE IF EXISTS personnel_properties CASCADE;
-- DROP TABLE IF EXISTS personnel CASCADE;
-- DROP VIEW IF EXISTS personnel_with_properties;
-- DROP VIEW IF EXISTS personnel_by_role;
