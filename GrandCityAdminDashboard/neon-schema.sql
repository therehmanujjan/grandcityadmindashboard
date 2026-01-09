-- Grand City Admin Dashboard - NeonDB Schema
-- Run this in your Neon SQL Editor: https://console.neon.tech
-- This schema includes all tables needed to replace hardcoded data

-- ============================================
-- CORE TABLES
-- ============================================

-- Users/Employees Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100),
  location VARCHAR(255),
  shift VARCHAR(100),
  status VARCHAR(50),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Planning',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  client VARCHAR(255),
  manager VARCHAR(255),
  team INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shifts/Staff Table
CREATE TABLE IF NOT EXISTS shifts (
  id SERIAL PRIMARY KEY,
  employee VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  shift VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Off Duty',
  location VARCHAR(255),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Communications Table
CREATE TABLE IF NOT EXISTS communications (
  id SERIAL PRIMARY KEY,
  project VARCHAR(255),
  user_name VARCHAR(255),
  message TEXT NOT NULL,
  time VARCHAR(100),
  unread INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Photo Logs Table
CREATE TABLE IF NOT EXISTS photo_logs (
  id SERIAL PRIMARY KEY,
  project VARCHAR(255),
  location VARCHAR(500),
  photos INTEGER DEFAULT 0,
  uploaded_by VARCHAR(255),
  time VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Photo Comments Table (for photo log comments)
CREATE TABLE IF NOT EXISTS photo_comments (
  id SERIAL PRIMARY KEY,
  photo_log_id INTEGER REFERENCES photo_logs(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  text TEXT NOT NULL,
  time VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  assignee VARCHAR(255),
  project VARCHAR(255),
  priority VARCHAR(50) DEFAULT 'Medium',
  due VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Pending',
  completion INTEGER DEFAULT 0 CHECK (completion >= 0 AND completion <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Task Subtasks Table
CREATE TABLE IF NOT EXISTS task_subtasks (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Task Checklist Items Table
CREATE TABLE IF NOT EXISTS task_checklist (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  vendor VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('Payable', 'Receivable')),
  due VARCHAR(50),
  status VARCHAR(100) DEFAULT 'Pending',
  project VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100),
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  active_contracts INTEGER DEFAULT 0,
  last_payment VARCHAR(50),
  projects TEXT[],
  performance INTEGER DEFAULT 0 CHECK (performance >= 0 AND performance <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SCHEDULER TABLES (Required by maintenance system)
-- ============================================

-- Properties Table (Buildings/Units requiring maintenance)
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance Schedules Table
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(100) NOT NULL,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE SET NULL,
  vendor_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'ongoing', 'completed')),
  requested_time VARCHAR(10),
  start_time VARCHAR(10),
  end_time VARCHAR(10),
  description TEXT,
  priority VARCHAR(50) DEFAULT 'Normal' CHECK (priority IN ('Normal', 'Urgent')),
  acknowledgments JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Personnel Property Assignments (Links staff to properties)
CREATE TABLE IF NOT EXISTS personnel_properties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  project VARCHAR(255),
  date VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Pending',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client Access Table
CREATE TABLE IF NOT EXISTS client_access (
  id SERIAL PRIMARY KEY,
  client VARCHAR(255) NOT NULL,
  project VARCHAR(255),
  last_login VARCHAR(100),
  reports_viewed INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dashboard Stats Table (for storing dashboard metrics)
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id SERIAL PRIMARY KEY,
  pending_tasks INTEGER DEFAULT 0,
  today_meetings INTEGER DEFAULT 0,
  pending_payments INTEGER DEFAULT 0,
  active_vendors INTEGER DEFAULT 0,
  monthly_budget DECIMAL(15, 2) DEFAULT 0,
  budget_used DECIMAL(15, 2) DEFAULT 0,
  staff_present INTEGER DEFAULT 0,
  total_staff INTEGER DEFAULT 0,
  active_projects INTEGER DEFAULT 0,
  client_satisfaction INTEGER DEFAULT 0,
  daily_photo_uploads INTEGER DEFAULT 0,
  shifts_today INTEGER DEFAULT 0,
  stats_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client);
CREATE INDEX IF NOT EXISTS idx_shifts_employee ON shifts(employee);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);
CREATE INDEX IF NOT EXISTS idx_communications_project ON communications(project);
CREATE INDEX IF NOT EXISTS idx_photo_logs_project ON photo_logs(project);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_vendor ON payments(vendor);
CREATE INDEX IF NOT EXISTS idx_payments_project ON payments(project);
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(name);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_reports_project ON reports(project);
CREATE INDEX IF NOT EXISTS idx_client_access_client ON client_access(client);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to auto-update updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON communications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photo_logs_updated_at BEFORE UPDATE ON photo_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_access_updated_at BEFORE UPDATE ON client_access
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_stats_updated_at BEFORE UPDATE ON dashboard_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA - Replace hardcoded data
-- ============================================

-- Dashboard Stats (current metrics)
INSERT INTO dashboard_stats (
  pending_tasks, today_meetings, pending_payments, active_vendors,
  monthly_budget, budget_used, staff_present, total_staff,
  active_projects, client_satisfaction, daily_photo_uploads, shifts_today,
  stats_date
) VALUES (
  12, 5, 8, 23,
  15000000, 9500000, 47, 52,
  8, 94, 145, 18,
  CURRENT_DATE
);

-- Projects
INSERT INTO projects (name, status, progress, client, manager, team) VALUES
  ('Kharian Megaproject', 'Active', 67, 'RUDA', 'Ali Ahmed', 15),
  ('Grand City Phase 2', 'Active', 45, 'Direct', 'Sara Khan', 22),
  ('Smart Villas Complex', 'Planning', 12, 'RDA Investors', 'Usman Tariq', 8);

-- Users/Employees (including staff from shifts)
INSERT INTO users (name, email, role, location, shift, status) VALUES
  ('Ahmed Ali', 'ahmed.ali@grandcity.com', 'Security', 'Main Gate', 'Night (8PM-8AM)', 'active'),
  ('Fatima Khan', 'fatima.khan@grandcity.com', 'Admin', 'HQ Office', 'Day (9AM-5PM)', 'active'),
  ('Bilal Raza', 'bilal.raza@grandcity.com', 'Site Supervisor', 'Kharian', 'Day (8AM-6PM)', 'active'),
  ('Ayesha Malik', 'ayesha.malik@grandcity.com', 'HR Coordinator', 'HQ Office', 'Day (9AM-5PM)', 'active'),
  ('Ali Ahmed', 'ali.ahmed@grandcity.com', 'Site Manager', 'Kharian', 'Day (9AM-6PM)', 'active'),
  ('Sara Khan', 'sara.khan@grandcity.com', 'Project Manager', 'Phase 2', 'Day (9AM-6PM)', 'active'),
  ('Usman Tariq', 'usman.tariq@grandcity.com', 'Planning Manager', 'HQ Office', 'Day (9AM-5PM)', 'active')
ON CONFLICT (email) DO NOTHING;

-- Shifts (current staff on duty)
INSERT INTO shifts (employee, role, shift, status, location) VALUES
  ('Ahmed Ali', 'Security', 'Night (8PM-8AM)', 'On Duty', 'Main Gate'),
  ('Fatima Khan', 'Admin', 'Day (9AM-5PM)', 'Present', 'HQ Office'),
  ('Bilal Raza', 'Site Supervisor', 'Day (8AM-6PM)', 'On Site', 'Kharian'),
  ('Ayesha Malik', 'HR Coordinator', 'Day (9AM-5PM)', 'Present', 'HQ Office');

-- Communications
INSERT INTO communications (project, user_name, message, time, unread) VALUES
  ('Kharian Megaproject', 'Ali Ahmed', 'Foundation work completed for Block A', '2 hours ago', 3),
  ('Grand City Phase 2', 'Sara Khan', 'Client inspection scheduled for tomorrow', '4 hours ago', 0),
  ('Smart Villas Complex', 'Usman Tariq', 'Blueprint revisions uploaded', '5 hours ago', 1);

-- Photo Logs
INSERT INTO photo_logs (project, location, photos, uploaded_by, time, tags) VALUES
  ('Kharian Megaproject', 'Block A - Foundation', 12, 'Ali Ahmed', '10:30 AM', ARRAY['progress', 'foundation']),
  ('Grand City Phase 2', 'Main Entrance', 8, 'Site Engineer', '11:45 AM', ARRAY['inspection', 'entrance']),
  ('Smart Villas Complex', 'Plot 23-A', 15, 'Contractor', '2:15 PM', ARRAY['excavation', 'before']);

-- Tasks
INSERT INTO tasks (title, assignee, project, priority, due, status, completion) VALUES
  ('Q4 Budget Approval', 'Finance Team', 'HQ Operations', 'High', '2025-10-03', 'Pending', 0),
  ('HVAC Maintenance', 'Ahmad Raza', 'HQ Operations', 'Medium', '2025-10-02', 'In Progress', 60),
  ('Foundation Inspection', 'Ali Ahmed', 'Kharian Megaproject', 'High', '2025-10-01', 'Completed', 100),
  ('Client Presentation Prep', 'Sara Khan', 'Grand City Phase 2', 'High', '2025-10-02', 'In Progress', 75);

-- Payments
INSERT INTO payments (vendor, amount, type, due, status, project) VALUES
  ('ABC Construction', 2500000, 'Payable', '2025-10-05', 'Pending', 'Kharian Megaproject'),
  ('Client - Plot A-123', 3000000, 'Receivable', '2025-10-02', 'Confirmed', 'Grand City Phase 2'),
  ('Tech Solutions Ltd', 450000, 'Payable', '2025-10-03', 'Approved', 'HQ Operations');

-- Vendors
INSERT INTO vendors (name, category, rating, active_contracts, last_payment, projects, performance) VALUES
  ('ABC Construction', 'Construction', 4.5, 3, '2025-09-28', ARRAY['Kharian', 'Phase 2'], 92),
  ('Tech Solutions Ltd', 'IT Services', 4.8, 2, '2025-09-25', ARRAY['HQ Operations'], 95),
  ('Facility Care Pro', 'Maintenance', 4.2, 1, '2025-09-30', ARRAY['All Sites'], 88)
ON CONFLICT (name) DO NOTHING;

-- Reports
INSERT INTO reports (type, project, date, status, downloads) VALUES
  ('Daily Progress', 'Kharian Megaproject', '2025-10-01', 'Generated', 5),
  ('Financial Summary', 'All Projects', '2025-09-30', 'Generated', 12),
  ('Client Dashboard', 'Grand City Phase 2', '2025-10-01', 'Pending', 0);

-- Client Access
INSERT INTO client_access (client, project, last_login, reports_viewed, comments, notifications_enabled, status) VALUES
  ('RUDA', 'Kharian Megaproject', '2 hours ago', 12, 5, TRUE, 'Active'),
  ('Direct', 'Grand City Phase 2', '5 hours ago', 8, 2, TRUE, 'Active'),
  ('RDA Investors', 'Smart Villas Complex', '1 day ago', 3, 0, FALSE, 'Active');

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- View: Active Projects Overview
CREATE OR REPLACE VIEW active_projects_overview AS
SELECT 
  p.id,
  p.name,
  p.status,
  p.progress,
  p.client,
  p.manager,
  p.team,
  COUNT(DISTINCT t.id) as total_tasks,
  SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
  COUNT(DISTINCT ph.id) as total_photos
FROM projects p
LEFT JOIN tasks t ON t.project = p.name
LEFT JOIN photo_logs ph ON ph.project = p.name
WHERE p.status IN ('Active', 'In Progress')
GROUP BY p.id, p.name, p.status, p.progress, p.client, p.manager, p.team;

-- View: Today's Staff Status
CREATE OR REPLACE VIEW todays_staff_status AS
SELECT 
  s.employee,
  s.role,
  s.shift,
  s.status,
  s.location,
  u.email
FROM shifts s
LEFT JOIN users u ON u.name = s.employee
WHERE s.date = CURRENT_DATE;

-- View: Pending Payments Summary
CREATE OR REPLACE VIEW pending_payments_summary AS
SELECT 
  vendor,
  SUM(CASE WHEN type = 'Payable' THEN amount ELSE 0 END) as total_payable,
  SUM(CASE WHEN type = 'Receivable' THEN amount ELSE 0 END) as total_receivable,
  COUNT(*) as payment_count,
  array_agg(DISTINCT project) as projects
FROM payments
WHERE status IN ('Pending', 'Approved')
GROUP BY vendor;

-- ============================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ============================================

-- Function: Get project statistics
CREATE OR REPLACE FUNCTION get_project_stats(project_name VARCHAR)
RETURNS TABLE (
  total_tasks INTEGER,
  completed_tasks INTEGER,
  pending_tasks INTEGER,
  total_photos INTEGER,
  team_size INTEGER,
  progress INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT t.id)::INTEGER as total_tasks,
    SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END)::INTEGER as completed_tasks,
    SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END)::INTEGER as pending_tasks,
    COUNT(DISTINCT ph.id)::INTEGER as total_photos,
    MAX(p.team)::INTEGER as team_size,
    MAX(p.progress)::INTEGER as progress
  FROM projects p
  LEFT JOIN tasks t ON t.project = p.name
  LEFT JOIN photo_logs ph ON ph.project = p.name
  WHERE p.name = project_name
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql;

-- Function: Update dashboard stats (call this daily or on-demand)
CREATE OR REPLACE FUNCTION update_dashboard_stats()
RETURNS VOID AS $$
BEGIN
  INSERT INTO dashboard_stats (
    pending_tasks,
    today_meetings,
    pending_payments,
    active_vendors,
    active_projects,
    staff_present,
    total_staff,
    shifts_today,
    stats_date
  ) VALUES (
    (SELECT COUNT(*) FROM tasks WHERE status = 'Pending'),
    0,
    (SELECT COUNT(*) FROM payments WHERE status IN ('Pending', 'Approved')),
    (SELECT COUNT(*) FROM vendors),
    (SELECT COUNT(*) FROM projects WHERE status IN ('Active', 'In Progress')),
    (SELECT COUNT(*) FROM shifts WHERE status IN ('Present', 'On Site', 'On Duty') AND date = CURRENT_DATE),
    (SELECT COUNT(*) FROM users WHERE status = 'active'),
    (SELECT COUNT(*) FROM shifts WHERE date = CURRENT_DATE),
    CURRENT_DATE
  )
  ON CONFLICT (id) DO UPDATE SET
    pending_tasks = EXCLUDED.pending_tasks,
    pending_payments = EXCLUDED.pending_payments,
    active_vendors = EXCLUDED.active_vendors,
    active_projects = EXCLUDED.active_projects,
    staff_present = EXCLUDED.staff_present,
    total_staff = EXCLUDED.total_staff,
    shifts_today = EXCLUDED.shifts_today,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Run this query to verify everything is set up correctly
SELECT 
  'Projects' as table_name, COUNT(*) as record_count FROM projects
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Shifts', COUNT(*) FROM shifts
UNION ALL
SELECT 'Communications', COUNT(*) FROM communications
UNION ALL
SELECT 'Photo Logs', COUNT(*) FROM photo_logs
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'Reports', COUNT(*) FROM reports
UNION ALL
SELECT 'Client Access', COUNT(*) FROM client_access
UNION ALL
SELECT 'Dashboard Stats', COUNT(*) FROM dashboard_stats;

-- Initialize dashboard stats
SELECT update_dashboard_stats();

-- ============================================
-- SCHEDULER SEED DATA
-- ============================================

-- Insert default properties
INSERT INTO properties (name, location, description) VALUES
('Rehan Gillani House', 'Lahore', 'Primary residence'),
('Salman Gillani House', 'Lahore', 'Secondary residence'),
('Safehouse', 'Lahore', 'Security facility'),
('Amma Jee/Muhammad Gillani House', 'Lahore', 'Family residence'),
('Mess', 'Lahore', 'Dining facility'),
('ARD', 'Karachi', 'Regional office'),
('MISU', 'Islamabad', 'Management office'),
('RUDA', 'Rawalpindi', 'Development office'),
('Kharian', 'Kharian', 'Branch office'),
('Faisalabad', 'Faisalabad', 'Branch office')
ON CONFLICT DO NOTHING;

-- Insert default personnel (if not exists)
INSERT INTO users (name, email, role, location, status) VALUES
('Muzzamil', 'muzzamil@grandcity.com', 'Electrician', 'Lahore', 'Active'),
('Sajawal', 'sajawal@grandcity.com', 'Electrician', 'Lahore', 'Active'),
('Naveed', 'naveed@grandcity.com', 'Car Maintenance', 'Lahore', 'Active'),
('Allah Ditta', 'allahdditta@grandcity.com', 'Car Maintenance', 'Lahore', 'Active'),
('Abdul Rehman', 'abdulrehman@grandcity.com', 'IT Support', 'Islamabad', 'Active'),
('Momin', 'momin@grandcity.com', 'IT Support', 'Lahore', 'Active'),
('Irfan', 'irfan@grandcity.com', 'IT Support', 'Lahore', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Assign personnel to properties (Muzzamil -> Properties 1,2)
INSERT INTO personnel_properties (user_id, property_id)
SELECT u.id, p.id FROM users u, properties p
WHERE u.name = 'Muzzamil' AND p.id IN (1, 2)
ON CONFLICT DO NOTHING;

-- Assign Sajawal -> Properties 3,4
INSERT INTO personnel_properties (user_id, property_id)
SELECT u.id, p.id FROM users u, properties p
WHERE u.name = 'Sajawal' AND p.id IN (3, 4)
ON CONFLICT DO NOTHING;

-- Assign Naveed -> Properties 5,6
INSERT INTO personnel_properties (user_id, property_id)
SELECT u.id, p.id FROM users u, properties p
WHERE u.name = 'Naveed' AND p.id IN (5, 6)
ON CONFLICT DO NOTHING;

-- Assign Allah Ditta -> Properties 7,8
INSERT INTO personnel_properties (user_id, property_id)
SELECT u.id, p.id FROM users u, properties p
WHERE u.name = 'Allah Ditta' AND p.id IN (7, 8)
ON CONFLICT DO NOTHING;

-- Assign Abdul Rehman -> Properties 9,10
INSERT INTO personnel_properties (user_id, property_id)
SELECT u.id, p.id FROM users u, properties p
WHERE u.name = 'Abdul Rehman' AND p.id IN (9, 10)
ON CONFLICT DO NOTHING;

-- Assign Momin -> Property 1
INSERT INTO personnel_properties (user_id, property_id)
SELECT u.id, p.id FROM users u, properties p
WHERE u.name = 'Momin' AND p.id = 1
ON CONFLICT DO NOTHING;

-- Assign Irfan -> Property 2
INSERT INTO personnel_properties (user_id, property_id)
SELECT u.id, p.id FROM users u, properties p
WHERE u.name = 'Irfan' AND p.id = 2
ON CONFLICT DO NOTHING;

-- Add maintenance-related vendors (if not exists)
INSERT INTO vendors (name, category, rating, contracts, performance) VALUES
('Muzzamil Electrical Services', 'Electrical', 4.8, 12, 95),
('Sajawal Electric Works', 'Electrical', 4.7, 8, 92),
('Naveed Auto Care', 'Car Maintenance', 4.9, 15, 97),
('Allah Ditta Motors', 'Car Maintenance', 4.6, 10, 90),
('Abdul Rehman IT Solutions', 'IT Support', 4.8, 20, 94),
('Momin Tech Support', 'IT Support', 4.7, 12, 91),
('Irfan IT Services', 'IT Support', 4.5, 8, 88)
ON CONFLICT DO NOTHING;
