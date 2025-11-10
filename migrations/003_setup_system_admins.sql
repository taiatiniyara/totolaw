-- Migration: Setup System Admin Team
-- This migration creates the system admin infrastructure and adds initial super admin team members
-- Super admins can set up and manage the entire system using their own credentials

-- ========================================
-- PART 1: CREATE INITIAL SYSTEM ADMINS
-- ========================================

-- IMPORTANT: Replace these email addresses with your actual super admin team emails
-- These users will have platform-wide access to set up organizations, roles, and permissions

INSERT INTO system_admins (id, email, name, is_active, added_at, created_at, updated_at)
VALUES
  -- Add your super admin team members here
  -- Example:
  (gen_random_uuid()::text, 'admin@totolaw.org', 'System Administrator', true, NOW(), NOW(), NOW()),
  (gen_random_uuid()::text, 'setup@totolaw.org', 'Setup Admin', true, NOW(), NOW(), NOW());
  -- Add more admins as needed:
  -- (gen_random_uuid()::text, 'your-email@example.com', 'Your Name', true, NOW(), NOW(), NOW()),

-- ========================================
-- PART 2: CREATE SYSTEM ADMIN HELPER FUNCTIONS
-- ========================================

-- Function to add a new system admin
CREATE OR REPLACE FUNCTION add_system_admin(
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_admin_id TEXT;
BEGIN
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM system_admins WHERE email = LOWER(p_email)) THEN
    RAISE EXCEPTION 'Email % is already registered as a system admin', p_email;
  END IF;

  -- Create new admin
  v_admin_id := gen_random_uuid()::text;
  INSERT INTO system_admins (id, email, name, notes, is_active, added_at, created_at, updated_at)
  VALUES (v_admin_id, LOWER(p_email), p_name, p_notes, true, NOW(), NOW(), NOW());

  -- Log the action
  INSERT INTO system_admin_audit_log (id, admin_id, action, entity_type, entity_id, description, created_at)
  VALUES (
    gen_random_uuid()::text,
    v_admin_id,
    'created',
    'system_admin',
    v_admin_id,
    format('System admin added: %s', p_email),
    NOW()
  );

  RETURN v_admin_id;
END;
$$ LANGUAGE plpgsql;

-- Function to remove/deactivate a system admin
CREATE OR REPLACE FUNCTION remove_system_admin(p_email TEXT)
RETURNS void AS $$
DECLARE
  v_admin RECORD;
BEGIN
  -- Get admin record
  SELECT * INTO v_admin FROM system_admins WHERE email = LOWER(p_email) LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'System admin with email % not found', p_email;
  END IF;

  -- Deactivate admin
  UPDATE system_admins
  SET is_active = false, updated_at = NOW()
  WHERE id = v_admin.id;

  -- Remove super admin flag from linked user
  IF v_admin.user_id IS NOT NULL THEN
    UPDATE "user"
    SET is_super_admin = false, updated_at = NOW()
    WHERE id = v_admin.user_id;
  END IF;

  -- Log the action
  INSERT INTO system_admin_audit_log (id, admin_id, action, entity_type, entity_id, description, created_at)
  VALUES (
    gen_random_uuid()::text,
    v_admin.id,
    'deactivated',
    'system_admin',
    v_admin.id,
    format('System admin deactivated: %s', p_email),
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to reactivate a system admin
CREATE OR REPLACE FUNCTION reactivate_system_admin(p_email TEXT)
RETURNS void AS $$
DECLARE
  v_admin RECORD;
BEGIN
  -- Get admin record
  SELECT * INTO v_admin FROM system_admins WHERE email = LOWER(p_email) LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'System admin with email % not found', p_email;
  END IF;

  -- Reactivate admin
  UPDATE system_admins
  SET is_active = true, updated_at = NOW()
  WHERE id = v_admin.id;

  -- Restore super admin flag to linked user
  IF v_admin.user_id IS NOT NULL THEN
    UPDATE "user"
    SET is_super_admin = true, updated_at = NOW()
    WHERE id = v_admin.user_id;
  END IF;

  -- Log the action
  INSERT INTO system_admin_audit_log (id, admin_id, action, entity_type, entity_id, description, created_at)
  VALUES (
    gen_random_uuid()::text,
    v_admin.id,
    'reactivated',
    'system_admin',
    v_admin.id,
    format('System admin reactivated: %s', p_email),
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to list all active system admins
CREATE OR REPLACE FUNCTION list_system_admins()
RETURNS TABLE (
  id TEXT,
  email TEXT,
  name TEXT,
  is_linked BOOLEAN,
  last_login TIMESTAMP,
  added_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sa.id,
    sa.email,
    sa.name,
    (sa.user_id IS NOT NULL) as is_linked,
    sa.last_login,
    sa.added_at
  FROM system_admins sa
  WHERE sa.is_active = true
  ORDER BY sa.added_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- PART 3: VERIFICATION & EXAMPLES
-- ========================================

-- View current system admins
SELECT 
  email,
  name,
  CASE WHEN user_id IS NOT NULL THEN 'Linked' ELSE 'Not Linked' END as status,
  is_active,
  last_login,
  added_at
FROM system_admins
ORDER BY added_at;

-- Example: How to add a new system admin
-- SELECT add_system_admin('newadmin@example.com', 'New Admin', 'Added for setup');

-- Example: How to remove a system admin
-- SELECT remove_system_admin('admin@example.com');

-- Example: How to reactivate a system admin
-- SELECT reactivate_system_admin('admin@example.com');

-- Example: List all active admins
-- SELECT * FROM list_system_admins();

RAISE NOTICE '===========================================';
RAISE NOTICE 'System Admin Setup Complete!';
RAISE NOTICE '===========================================';
RAISE NOTICE 'Initial system admins have been created.';
RAISE NOTICE 'These users can now login with their credentials and will be automatically elevated to super admin.';
RAISE NOTICE '';
RAISE NOTICE 'Next Steps:';
RAISE NOTICE '1. Share login link with your super admin team';
RAISE NOTICE '2. Team members log in using magic link with their registered email';
RAISE NOTICE '3. Upon first login, they will automatically get super admin privileges';
RAISE NOTICE '4. Super admins can then set up organizations, roles, and permissions';
RAISE NOTICE '';
RAISE NOTICE 'Helper Functions Available:';
RAISE NOTICE '  - add_system_admin(email, name, notes)';
RAISE NOTICE '  - remove_system_admin(email)';
RAISE NOTICE '  - reactivate_system_admin(email)';
RAISE NOTICE '  - list_system_admins()';
RAISE NOTICE '===========================================';
