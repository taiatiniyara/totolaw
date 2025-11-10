-- Migration Script: Setup Multi-Tenant RBAC for Pacific Islands
-- This script creates initial organizations, roles, permissions, and system configurations

-- ========================================
-- PART 1: CREATE PACIFIC ISLAND ORGANIZATIONS
-- ========================================

-- Fiji
INSERT INTO organizations (id, name, code, type, description, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid()::text,
  'Fiji',
  'FJ',
  'country',
  'Republic of Fiji Court System',
  true,
  NOW(),
  NOW()
);

-- Samoa
INSERT INTO organizations (id, name, code, type, description, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid()::text,
  'Samoa',
  'WS',
  'country',
  'Independent State of Samoa Court System',
  true,
  NOW(),
  NOW()
);

-- Tonga
INSERT INTO organizations (id, name, code, type, description, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid()::text,
  'Tonga',
  'TO',
  'country',
  'Kingdom of Tonga Court System',
  true,
  NOW(),
  NOW()
);

-- Vanuatu
INSERT INTO organizations (id, name, code, type, description, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid()::text,
  'Vanuatu',
  'VU',
  'country',
  'Republic of Vanuatu Court System',
  true,
  NOW(),
  NOW()
);

-- ========================================
-- PART 2: CREATE SYSTEM PERMISSIONS
-- ========================================

-- Case Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'cases', 'create', 'cases:create', 'Create new cases', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'read', 'cases:read', 'View case details', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'read-all', 'cases:read-all', 'View all cases in organization', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'read-own', 'cases:read-own', 'View only assigned/created cases', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'update', 'cases:update', 'Edit case information', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'delete', 'cases:delete', 'Delete cases', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'assign', 'cases:assign', 'Assign cases to judges/staff', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'close', 'cases:close', 'Close/finalize cases', true, NOW(), NOW());

-- Hearing Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'hearings', 'create', 'hearings:create', 'Schedule hearings', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'read', 'hearings:read', 'View hearing details', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'update', 'hearings:update', 'Modify hearing schedule', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'delete', 'hearings:delete', 'Cancel hearings', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'reschedule', 'hearings:reschedule', 'Reschedule hearings', true, NOW(), NOW());

-- Evidence Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'evidence', 'submit', 'evidence:submit', 'Submit evidence', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'read', 'evidence:read', 'View evidence', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'update', 'evidence:update', 'Edit evidence metadata', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'approve', 'evidence:approve', 'Approve evidence admission', true, NOW(), NOW());

-- Verdict Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'verdicts', 'create', 'verdicts:create', 'Issue verdicts', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'verdicts', 'read', 'verdicts:read', 'View verdicts', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'verdicts', 'update', 'verdicts:update', 'Modify verdicts', true, NOW(), NOW());

-- Sentence Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'sentences', 'create', 'sentences:create', 'Issue sentences', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'sentences', 'read', 'sentences:read', 'View sentences', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'sentences', 'update', 'sentences:update', 'Modify sentences', true, NOW(), NOW());

-- User Management Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'users', 'create', 'users:create', 'Create user accounts', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'read', 'users:read', 'View user profiles', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'read-all', 'users:read-all', 'View all users in organization', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'update', 'users:update', 'Edit user information', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'delete', 'users:delete', 'Delete users', true, NOW(), NOW());

-- Role Management Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'roles', 'create', 'roles:create', 'Create new roles', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'roles', 'read', 'roles:read', 'View roles', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'roles', 'update', 'roles:update', 'Edit role details', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'roles', 'assign', 'roles:assign', 'Assign roles to users', true, NOW(), NOW());

-- Settings Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'settings', 'read', 'settings:read', 'View system settings', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'settings', 'update', 'settings:update', 'Modify system settings', true, NOW(), NOW());

-- Reports Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'reports', 'view', 'reports:view', 'View reports', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'reports', 'export', 'reports:export', 'Export report data', true, NOW(), NOW());

-- Audit Permissions
INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'audit', 'view', 'audit:view', 'View audit logs', true, NOW(), NOW());

-- ========================================
-- PART 3: CREATE ROLES FOR EACH ORGANIZATION
-- ========================================

-- Function to create standard roles for an organization
CREATE OR REPLACE FUNCTION create_standard_roles(org_id TEXT, org_name TEXT)
RETURNS void AS $$
BEGIN
  -- Judge Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Judge',
    'judge',
    'Presiding judge with full case authority',
    true,
    true,
    NOW(),
    NOW()
  );

  -- Magistrate Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Magistrate',
    'magistrate',
    'Lower court judge for minor cases',
    true,
    true,
    NOW(),
    NOW()
  );

  -- Court Clerk Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Court Clerk',
    'court-clerk',
    'Day-to-day case administration',
    true,
    true,
    NOW(),
    NOW()
  );

  -- Senior Clerk Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Senior Clerk',
    'senior-clerk',
    'Administrative clerk with user management',
    true,
    true,
    NOW(),
    NOW()
  );

  -- Prosecutor Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Prosecutor',
    'prosecutor',
    'Government/state prosecutor',
    true,
    true,
    NOW(),
    NOW()
  );

  -- Public Defender Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Public Defender',
    'public-defender',
    'Defense attorney',
    true,
    true,
    NOW(),
    NOW()
  );

  -- Administrator Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Administrator',
    'administrator',
    'System and user administrator',
    true,
    true,
    NOW(),
    NOW()
  );

  -- Viewer Role
  INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    org_id,
    'Viewer',
    'viewer',
    'Read-only access for auditors/observers',
    true,
    true,
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created standard roles for organization: %', org_name;
END;
$$ LANGUAGE plpgsql;

-- Create roles for each organization
DO $$
DECLARE
  org RECORD;
BEGIN
  FOR org IN SELECT id, name FROM organizations LOOP
    PERFORM create_standard_roles(org.id, org.name);
  END LOOP;
END $$;

-- ========================================
-- PART 4: ASSIGN PERMISSIONS TO ROLES
-- ========================================

-- Function to assign permissions to a role
CREATE OR REPLACE FUNCTION assign_permissions_to_role(
  org_code TEXT,
  role_slug TEXT,
  permission_slugs TEXT[]
)
RETURNS void AS $$
DECLARE
  role_id TEXT;
  perm_slug TEXT;
  perm_id TEXT;
BEGIN
  -- Get role ID
  SELECT r.id INTO role_id
  FROM roles r
  JOIN organizations o ON r.organization_id = o.id
  WHERE o.code = org_code AND r.slug = role_slug;

  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role % not found in organization %', role_slug, org_code;
  END IF;

  -- Assign each permission
  FOREACH perm_slug IN ARRAY permission_slugs
  LOOP
    SELECT id INTO perm_id FROM permissions WHERE slug = perm_slug;
    
    IF perm_id IS NOT NULL THEN
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Assign permissions for all organizations
DO $$
DECLARE
  org_code TEXT;
BEGIN
  FOR org_code IN SELECT code FROM organizations LOOP
    -- Judge Permissions
    PERFORM assign_permissions_to_role(org_code, 'judge', ARRAY[
      'cases:read-all', 'cases:update', 'cases:assign', 'cases:close',
      'hearings:create', 'hearings:read', 'hearings:update', 'hearings:reschedule',
      'evidence:read', 'evidence:approve',
      'verdicts:create', 'verdicts:update',
      'sentences:create', 'sentences:update',
      'reports:view', 'reports:export'
    ]);

    -- Magistrate Permissions
    PERFORM assign_permissions_to_role(org_code, 'magistrate', ARRAY[
      'cases:read-own', 'cases:update', 'cases:close',
      'hearings:read', 'hearings:update',
      'evidence:read', 'evidence:approve',
      'verdicts:create',
      'sentences:create'
    ]);

    -- Court Clerk Permissions
    PERFORM assign_permissions_to_role(org_code, 'court-clerk', ARRAY[
      'cases:create', 'cases:read-own', 'cases:update',
      'hearings:create', 'hearings:read', 'hearings:update',
      'evidence:read', 'evidence:update'
    ]);

    -- Senior Clerk Permissions
    PERFORM assign_permissions_to_role(org_code, 'senior-clerk', ARRAY[
      'cases:read-all', 'cases:create', 'cases:update',
      'hearings:create', 'hearings:read', 'hearings:update', 'hearings:reschedule',
      'evidence:read',
      'users:read', 'users:create', 'users:update',
      'roles:assign'
    ]);

    -- Prosecutor Permissions
    PERFORM assign_permissions_to_role(org_code, 'prosecutor', ARRAY[
      'cases:create', 'cases:read-own',
      'hearings:read',
      'evidence:submit', 'evidence:read',
      'verdicts:read',
      'sentences:read'
    ]);

    -- Public Defender Permissions
    PERFORM assign_permissions_to_role(org_code, 'public-defender', ARRAY[
      'cases:read-own',
      'hearings:read',
      'evidence:submit', 'evidence:read',
      'verdicts:read',
      'sentences:read'
    ]);

    -- Administrator Permissions
    PERFORM assign_permissions_to_role(org_code, 'administrator', ARRAY[
      'cases:read-all', 'cases:delete',
      'users:create', 'users:read', 'users:read-all', 'users:update', 'users:delete',
      'roles:create', 'roles:read', 'roles:update', 'roles:assign',
      'settings:read', 'settings:update',
      'reports:view', 'reports:export',
      'audit:view'
    ]);

    -- Viewer Permissions
    PERFORM assign_permissions_to_role(org_code, 'viewer', ARRAY[
      'cases:read-all',
      'hearings:read',
      'evidence:read',
      'verdicts:read',
      'sentences:read',
      'reports:view'
    ]);

    RAISE NOTICE 'Assigned permissions for organization: %', org_code;
  END LOOP;
END $$;

-- ========================================
-- PART 5: MIGRATE EXISTING DATA
-- ========================================

-- Add organizationId to existing cases (if any)
-- NOTE: This assumes Fiji is the default organization for existing data
-- Adjust as needed based on your actual data

DO $$
DECLARE
  fiji_org_id TEXT;
BEGIN
  SELECT id INTO fiji_org_id FROM organizations WHERE code = 'FJ' LIMIT 1;
  
  IF fiji_org_id IS NOT NULL THEN
    -- Update cases without organizationId
    UPDATE cases SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update evidence
    UPDATE evidence SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update hearings
    UPDATE hearings SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update pleas
    UPDATE pleas SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update trials
    UPDATE trials SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update sentences
    UPDATE sentences SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update appeals
    UPDATE appeals SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update enforcement
    UPDATE enforcement SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update managed_lists
    UPDATE managed_lists SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update proceeding_templates
    UPDATE proceeding_templates SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    -- Update proceeding_steps
    UPDATE proceeding_steps SET organization_id = fiji_org_id WHERE organization_id IS NULL;
    
    RAISE NOTICE 'Migrated existing data to Fiji organization';
  END IF;
END $$;

-- ========================================
-- CLEANUP
-- ========================================

-- Drop temporary functions
DROP FUNCTION IF EXISTS create_standard_roles(TEXT, TEXT);
DROP FUNCTION IF EXISTS assign_permissions_to_role(TEXT, TEXT, TEXT[]);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- View created organizations
SELECT name, code, type FROM organizations ORDER BY name;

-- View permissions count
SELECT COUNT(*) as permission_count FROM permissions;

-- View roles per organization
SELECT o.name as organization, COUNT(r.id) as role_count
FROM organizations o
LEFT JOIN roles r ON o.id = r.organization_id
GROUP BY o.name
ORDER BY o.name;

-- View role-permission mappings
SELECT o.name as organization, r.name as role, COUNT(rp.id) as permission_count
FROM organizations o
JOIN roles r ON o.id = r.organization_id
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY o.name, r.name
ORDER BY o.name, r.name;

RAISE NOTICE 'Multi-tenant RBAC setup completed successfully!';
