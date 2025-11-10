-- Quick System Admin Setup Migration
-- Run this to create the system admin infrastructure quickly

-- Create system_admins table
CREATE TABLE IF NOT EXISTS system_admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  added_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  added_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_login TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS system_admin_email_idx ON system_admins(email);
CREATE INDEX IF NOT EXISTS system_admin_user_idx ON system_admins(user_id);
CREATE INDEX IF NOT EXISTS system_admin_active_idx ON system_admins(is_active);

-- Create system_admin_audit_log table
CREATE TABLE IF NOT EXISTS system_admin_audit_log (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES system_admins(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id TEXT,
  description TEXT NOT NULL,
  metadata TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS sys_admin_audit_admin_idx ON system_admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS sys_admin_audit_action_idx ON system_admin_audit_log(action);
CREATE INDEX IF NOT EXISTS sys_admin_audit_entity_idx ON system_admin_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS sys_admin_audit_created_at_idx ON system_admin_audit_log(created_at);

-- Add your initial system admins here
-- IMPORTANT: Replace these with your actual super admin emails
INSERT INTO system_admins (id, email, name, is_active, added_at, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'admin@totolaw.org', 'System Administrator', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify setup
SELECT 
  'System admins created:' as status,
  COUNT(*) as count
FROM system_admins;

SELECT 
  email,
  name,
  is_active,
  CASE WHEN user_id IS NOT NULL THEN 'Linked' ELSE 'Pending' END as status
FROM system_admins
ORDER BY added_at;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ System admin infrastructure created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update the INSERT statement above with your team emails';
  RAISE NOTICE '2. Re-run this migration or use: npm run admin:add email@example.com "Name"';
  RAISE NOTICE '3. Team members can now log in at /auth/login';
  RAISE NOTICE '4. They will be automatically elevated to super admin';
  RAISE NOTICE '5. Access super admin dashboard at /dashboard/system-admin';
END $$;
