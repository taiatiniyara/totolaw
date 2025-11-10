-- Migration Script: Update Evidence Table for File Management
-- This script updates the evidence table to support proper file upload functionality

-- ========================================
-- PART 1: UPDATE EVIDENCE TABLE STRUCTURE
-- ========================================

-- Drop old fileUrl column and add new file metadata columns
ALTER TABLE evidence DROP COLUMN IF EXISTS file_url;

-- Add new file metadata columns
ALTER TABLE evidence 
ADD COLUMN IF NOT EXISTS hearing_id TEXT REFERENCES hearings(id),
ADD COLUMN IF NOT EXISTS file_name TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS file_size INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100) NOT NULL DEFAULT 'application/octet-stream',
ADD COLUMN IF NOT EXISTS file_path TEXT NOT NULL DEFAULT '';

-- Remove defaults after migration
ALTER TABLE evidence 
ALTER COLUMN file_name DROP DEFAULT,
ALTER COLUMN file_size DROP DEFAULT,
ALTER COLUMN file_type DROP DEFAULT,
ALTER COLUMN file_path DROP DEFAULT;

-- Create index for hearing_id
CREATE INDEX IF NOT EXISTS evidence_hearing_idx ON evidence(hearing_id);

-- ========================================
-- PART 2: ADD EVIDENCE PERMISSIONS
-- ========================================

-- First, ensure evidence permissions exist
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'evidence', 'create', 'evidence:create', 'Create evidence', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'delete', 'evidence:delete', 'Delete evidence', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Add evidence permissions to existing roles (if not already present)
DO $$
DECLARE
  fiji_id TEXT;
  samoa_id TEXT;
  tonga_id TEXT;
  vanuatu_id TEXT;
  current_org_id TEXT;
  
  admin_role_id TEXT;
  judge_role_id TEXT;
  prosecutor_role_id TEXT;
  defender_role_id TEXT;
  clerk_role_id TEXT;
  
  perm_create_id TEXT;
  perm_read_id TEXT;
  perm_update_id TEXT;
  perm_delete_id TEXT;
BEGIN
  -- Get permission IDs
  SELECT id INTO perm_create_id FROM permissions WHERE slug = 'evidence:create';
  SELECT id INTO perm_read_id FROM permissions WHERE slug = 'evidence:read';
  SELECT id INTO perm_update_id FROM permissions WHERE slug = 'evidence:update';
  SELECT id INTO perm_delete_id FROM permissions WHERE slug = 'evidence:delete';

  -- Get organization IDs
  SELECT id INTO fiji_id FROM organizations WHERE code = 'FJ';
  SELECT id INTO samoa_id FROM organizations WHERE code = 'WS';
  SELECT id INTO tonga_id FROM organizations WHERE code = 'TO';
  SELECT id INTO vanuatu_id FROM organizations WHERE code = 'VU';

  -- For each organization, add evidence permissions to roles
  FOREACH current_org_id IN ARRAY ARRAY[fiji_id, samoa_id, tonga_id, vanuatu_id] LOOP
    
    -- Get role IDs for this organization
    SELECT id INTO admin_role_id FROM roles WHERE organization_id = current_org_id AND slug = 'administrator';
    SELECT id INTO judge_role_id FROM roles WHERE organization_id = current_org_id AND slug = 'judge';
    SELECT id INTO prosecutor_role_id FROM roles WHERE organization_id = current_org_id AND slug = 'prosecutor';
    SELECT id INTO defender_role_id FROM roles WHERE organization_id = current_org_id AND slug = 'public-defender';
    SELECT id INTO clerk_role_id FROM roles WHERE organization_id = current_org_id AND slug = 'court-clerk';

    -- Admin: Full evidence access
    INSERT INTO role_permissions (id, role_id, permission_id, created_at)
    VALUES 
      (gen_random_uuid()::text, admin_role_id, perm_create_id, NOW()),
      (gen_random_uuid()::text, admin_role_id, perm_read_id, NOW()),
      (gen_random_uuid()::text, admin_role_id, perm_update_id, NOW()),
      (gen_random_uuid()::text, admin_role_id, perm_delete_id, NOW())
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- Judge: Read and update evidence
    INSERT INTO role_permissions (id, role_id, permission_id, created_at)
    VALUES 
      (gen_random_uuid()::text, judge_role_id, perm_read_id, NOW()),
      (gen_random_uuid()::text, judge_role_id, perm_update_id, NOW())
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- Prosecutor: Create and read evidence
    INSERT INTO role_permissions (id, role_id, permission_id, created_at)
    VALUES 
      (gen_random_uuid()::text, prosecutor_role_id, perm_create_id, NOW()),
      (gen_random_uuid()::text, prosecutor_role_id, perm_read_id, NOW())
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- Public Defender: Read evidence
    INSERT INTO role_permissions (id, role_id, permission_id, created_at)
    VALUES 
      (gen_random_uuid()::text, defender_role_id, perm_read_id, NOW())
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- Court Clerk: Create and read evidence
    INSERT INTO role_permissions (id, role_id, permission_id, created_at)
    VALUES 
      (gen_random_uuid()::text, clerk_role_id, perm_create_id, NOW()),
      (gen_random_uuid()::text, clerk_role_id, perm_read_id, NOW())
    ON CONFLICT (role_id, permission_id) DO NOTHING;

  END LOOP;
END $$;
