-- =============================================================================
-- Totolaw Database Migration 002: Simplify System Admin Schema
-- This migration simplifies the system admin architecture by:
-- 1. Migrating system_admins data to user table
-- 2. Updating system_admin_audit_log to reference users directly
-- 3. Dropping the redundant system_admins table
-- =============================================================================

-- ========================================
-- PART 1: MIGRATE DATA FROM system_admins TO users
-- ========================================

-- First, ensure any system_admins that are linked to users have isSuperAdmin = true
UPDATE "user" u
SET 
  is_super_admin = true,
  updated_at = NOW()
FROM system_admins sa
WHERE sa.user_id = u.id 
  AND sa.is_active = true
  AND u.is_super_admin = false;

-- ========================================
-- PART 2: ADD ADMIN METADATA TO USER TABLE
-- ========================================

-- Add columns to track admin-specific information in the user table
DO $$
BEGIN
  -- Add admin notes field
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user' AND column_name = 'admin_notes') THEN
    ALTER TABLE "user" ADD COLUMN admin_notes TEXT;
  END IF;
  
  -- Add admin added_by tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user' AND column_name = 'admin_added_by') THEN
    ALTER TABLE "user" ADD COLUMN admin_added_by TEXT REFERENCES "user"(id) ON DELETE SET NULL;
  END IF;
  
  -- Add admin added_at timestamp
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user' AND column_name = 'admin_added_at') THEN
    ALTER TABLE "user" ADD COLUMN admin_added_at TIMESTAMP;
  END IF;
  
  -- Add last_login tracking (if not already present)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user' AND column_name = 'last_login') THEN
    ALTER TABLE "user" ADD COLUMN last_login TIMESTAMP;
  END IF;
END $$;

-- Migrate admin metadata from system_admins to user table
UPDATE "user" u
SET 
  admin_notes = sa.notes,
  admin_added_by = sa.added_by,
  admin_added_at = sa.added_at,
  last_login = COALESCE(sa.last_login, u.last_login)
FROM system_admins sa
WHERE sa.user_id = u.id;

-- ========================================
-- PART 3: UPDATE system_admin_audit_log TO REFERENCE users
-- ========================================

-- Rename admin_id column to user_id for clarity
ALTER TABLE system_admin_audit_log 
  RENAME COLUMN admin_id TO user_id;

-- Drop old foreign key constraint to system_admins
ALTER TABLE system_admin_audit_log 
  DROP CONSTRAINT IF EXISTS system_admin_audit_log_admin_id_system_admins_id_fk;

-- Add new foreign key constraint to user table
ALTER TABLE system_admin_audit_log 
  ADD CONSTRAINT system_admin_audit_log_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

-- Update existing audit log entries to point to user_id instead of system_admins.id
UPDATE system_admin_audit_log sal
SET user_id = sa.user_id
FROM system_admins sa
WHERE sal.user_id = sa.id AND sa.user_id IS NOT NULL;

-- Delete audit entries that can't be mapped (system_admins without user_id)
DELETE FROM system_admin_audit_log
WHERE user_id NOT IN (SELECT id FROM "user");

-- Update indexes
DROP INDEX IF EXISTS sys_admin_audit_admin_idx;
CREATE INDEX IF NOT EXISTS sys_admin_audit_user_idx ON system_admin_audit_log(user_id);

-- ========================================
-- PART 4: DROP system_admins TABLE
-- ========================================

-- Drop the system_admins table as it's no longer needed
DROP TABLE IF EXISTS system_admins CASCADE;

-- ========================================
-- PART 5: CREATE HELPER FUNCTIONS
-- ========================================

-- Function to grant super admin privileges to a user
CREATE OR REPLACE FUNCTION grant_super_admin(
  p_user_id TEXT,
  p_granted_by TEXT,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Update user to be super admin
  UPDATE "user"
  SET 
    is_super_admin = true,
    admin_added_by = p_granted_by,
    admin_added_at = NOW(),
    admin_notes = COALESCE(p_notes, admin_notes),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Log the action
  INSERT INTO system_admin_audit_log (
    id, user_id, action, entity_type, entity_id, 
    description, metadata, created_at
  )
  VALUES (
    gen_random_uuid()::text,
    p_granted_by,
    'granted_super_admin',
    'user',
    p_user_id,
    'Super admin privileges granted to user',
    json_build_object('user_id', p_user_id, 'notes', p_notes)::text,
    NOW()
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to revoke super admin privileges
CREATE OR REPLACE FUNCTION revoke_super_admin(
  p_user_id TEXT,
  p_revoked_by TEXT,
  p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Update user to remove super admin
  UPDATE "user"
  SET 
    is_super_admin = false,
    admin_notes = CASE 
      WHEN p_reason IS NOT NULL 
      THEN COALESCE(admin_notes || E'\n', '') || 'Revoked: ' || p_reason
      ELSE admin_notes
    END,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Log the action
  INSERT INTO system_admin_audit_log (
    id, user_id, action, entity_type, entity_id, 
    description, metadata, created_at
  )
  VALUES (
    gen_random_uuid()::text,
    p_revoked_by,
    'revoked_super_admin',
    'user',
    p_user_id,
    'Super admin privileges revoked from user',
    json_build_object('user_id', p_user_id, 'reason', p_reason)::text,
    NOW()
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to list all super admins
CREATE OR REPLACE FUNCTION list_super_admins()
RETURNS TABLE (
  id TEXT,
  email TEXT,
  name TEXT,
  is_super_admin BOOLEAN,
  admin_added_at TIMESTAMP,
  last_login TIMESTAMP,
  admin_notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.name,
    u.is_super_admin,
    u.admin_added_at,
    u.last_login,
    u.admin_notes
  FROM "user" u
  WHERE u.is_super_admin = true
  ORDER BY u.admin_added_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- PART 6: CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS user_is_super_admin_idx ON "user"(is_super_admin) WHERE is_super_admin = true;
CREATE INDEX IF NOT EXISTS user_last_login_idx ON "user"(last_login);

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- Verify migration success
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM "user" WHERE is_super_admin = true;
  RAISE NOTICE 'Migration complete. Total super admins: %', admin_count;
END $$;
