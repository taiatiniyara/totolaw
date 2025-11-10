-- =============================================================================
-- Totolaw Database Initial Schema Migration
-- This consolidated migration sets up the complete database schema and initial data
-- =============================================================================

-- ========================================
-- PART 1: CREATE ORGANIZATIONS
-- ========================================

INSERT INTO organizations (id, name, code, type, description, is_active, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'Fiji', 'FJ', 'country', 'Republic of Fiji Court System', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Samoa', 'WS', 'country', 'Independent State of Samoa Court System', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Tonga', 'TO', 'country', 'Kingdom of Tonga Court System', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Vanuatu', 'VU', 'country', 'Republic of Vanuatu Court System', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ========================================
-- PART 2: CREATE SYSTEM PERMISSIONS
-- ========================================

INSERT INTO permissions (id, resource, action, slug, description, is_system, created_at, updated_at)
VALUES
  -- Case Permissions
  (gen_random_uuid()::text, 'cases', 'create', 'cases:create', 'Create new cases', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'read', 'cases:read', 'View case details', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'read-all', 'cases:read-all', 'View all cases in organization', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'read-own', 'cases:read-own', 'View only assigned/created cases', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'update', 'cases:update', 'Edit case information', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'delete', 'cases:delete', 'Delete cases', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'assign', 'cases:assign', 'Assign cases to judges/staff', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'cases', 'close', 'cases:close', 'Close/finalize cases', true, NOW(), NOW()),
  
  -- Hearing Permissions
  (gen_random_uuid()::text, 'hearings', 'create', 'hearings:create', 'Schedule hearings', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'read', 'hearings:read', 'View hearing details', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'update', 'hearings:update', 'Modify hearing schedule', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'delete', 'hearings:delete', 'Cancel hearings', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'hearings', 'reschedule', 'hearings:reschedule', 'Reschedule hearings', true, NOW(), NOW()),
  
  -- Evidence Permissions
  (gen_random_uuid()::text, 'evidence', 'create', 'evidence:create', 'Create evidence', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'submit', 'evidence:submit', 'Submit evidence', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'read', 'evidence:read', 'View evidence', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'update', 'evidence:update', 'Edit evidence metadata', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'approve', 'evidence:approve', 'Approve evidence admission', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'evidence', 'delete', 'evidence:delete', 'Delete evidence', true, NOW(), NOW()),
  
  -- Verdict Permissions
  (gen_random_uuid()::text, 'verdicts', 'create', 'verdicts:create', 'Issue verdicts', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'verdicts', 'read', 'verdicts:read', 'View verdicts', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'verdicts', 'update', 'verdicts:update', 'Modify verdicts', true, NOW(), NOW()),
  
  -- Sentence Permissions
  (gen_random_uuid()::text, 'sentences', 'create', 'sentences:create', 'Issue sentences', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'sentences', 'read', 'sentences:read', 'View sentences', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'sentences', 'update', 'sentences:update', 'Modify sentences', true, NOW(), NOW()),
  
  -- User Management Permissions
  (gen_random_uuid()::text, 'users', 'create', 'users:create', 'Create user accounts', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'read', 'users:read', 'View user profiles', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'read-all', 'users:read-all', 'View all users in organization', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'update', 'users:update', 'Edit user information', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'users', 'delete', 'users:delete', 'Delete users', true, NOW(), NOW()),
  
  -- Role Management Permissions
  (gen_random_uuid()::text, 'roles', 'create', 'roles:create', 'Create new roles', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'roles', 'read', 'roles:read', 'View roles', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'roles', 'update', 'roles:update', 'Edit role details', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'roles', 'assign', 'roles:assign', 'Assign roles to users', true, NOW(), NOW()),
  
  -- Settings Permissions
  (gen_random_uuid()::text, 'settings', 'read', 'settings:read', 'View system settings', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'settings', 'update', 'settings:update', 'Modify system settings', true, NOW(), NOW()),
  
  -- Reports Permissions
  (gen_random_uuid()::text, 'reports', 'view', 'reports:view', 'View reports', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'reports', 'export', 'reports:export', 'Export report data', true, NOW(), NOW()),
  
  -- Audit Permissions
  (gen_random_uuid()::text, 'audit', 'view', 'audit:view', 'View audit logs', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- PART 3: CREATE STANDARD ROLES FOR ALL ORGANIZATIONS
-- ========================================

DO $$
DECLARE
  org RECORD;
  org_id TEXT;
BEGIN
  FOR org IN SELECT id, name, code FROM organizations LOOP
    org_id := org.id;
    
    -- Judge Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Judge', 'judge', 'Presiding judge with full case authority', true, true, NOW(), NOW());
    
    -- Magistrate Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Magistrate', 'magistrate', 'Lower court judge for minor cases', true, true, NOW(), NOW());
    
    -- Court Clerk Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Court Clerk', 'court-clerk', 'Day-to-day case administration', true, true, NOW(), NOW());
    
    -- Senior Clerk Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Senior Clerk', 'senior-clerk', 'Administrative clerk with user management', true, true, NOW(), NOW());
    
    -- Prosecutor Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Prosecutor', 'prosecutor', 'Government/state prosecutor', true, true, NOW(), NOW());
    
    -- Public Defender Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Public Defender', 'public-defender', 'Defense attorney', true, true, NOW(), NOW());
    
    -- Administrator Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Administrator', 'administrator', 'System and user administrator', true, true, NOW(), NOW());
    
    -- Viewer Role
    INSERT INTO roles (id, organization_id, name, slug, description, is_system, is_active, created_at, updated_at)
    VALUES (gen_random_uuid()::text, org_id, 'Viewer', 'viewer', 'Read-only access for auditors/observers', true, true, NOW(), NOW());
    
  END LOOP;
END $$;

-- ========================================
-- PART 4: ASSIGN PERMISSIONS TO ROLES
-- ========================================

DO $$
DECLARE
  org RECORD;
  role_id TEXT;
  perm_id TEXT;
BEGIN
  FOR org IN SELECT id, code FROM organizations LOOP
    
    -- Judge Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'judge';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:read-all', 'cases:update', 'cases:assign', 'cases:close',
        'hearings:create', 'hearings:read', 'hearings:update', 'hearings:reschedule',
        'evidence:read', 'evidence:approve',
        'verdicts:create', 'verdicts:update',
        'sentences:create', 'sentences:update',
        'reports:view', 'reports:export'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Magistrate Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'magistrate';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:read-own', 'cases:update', 'cases:close',
        'hearings:read', 'hearings:update',
        'evidence:read', 'evidence:approve',
        'verdicts:create', 'sentences:create'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Court Clerk Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'court-clerk';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:create', 'cases:read-own', 'cases:update',
        'hearings:create', 'hearings:read', 'hearings:update',
        'evidence:create', 'evidence:read', 'evidence:update'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Senior Clerk Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'senior-clerk';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:read-all', 'cases:create', 'cases:update',
        'hearings:create', 'hearings:read', 'hearings:update', 'hearings:reschedule',
        'evidence:read', 'users:read', 'users:create', 'users:update', 'roles:assign'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Prosecutor Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'prosecutor';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:create', 'cases:read-own',
        'hearings:read',
        'evidence:submit', 'evidence:read',
        'verdicts:read', 'sentences:read'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Public Defender Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'public-defender';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:read-own',
        'hearings:read',
        'evidence:submit', 'evidence:read',
        'verdicts:read', 'sentences:read'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Administrator Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'administrator';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:read-all', 'cases:delete', 'evidence:delete',
        'users:create', 'users:read', 'users:read-all', 'users:update', 'users:delete',
        'roles:create', 'roles:read', 'roles:update', 'roles:assign',
        'settings:read', 'settings:update',
        'reports:view', 'reports:export', 'audit:view'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Viewer Permissions
    SELECT id INTO role_id FROM roles WHERE organization_id = org.id AND slug = 'viewer';
    FOR perm_id IN 
      SELECT p.id FROM permissions p WHERE p.slug IN (
        'cases:read-all', 'hearings:read', 'evidence:read',
        'verdicts:read', 'sentences:read', 'reports:view'
      )
    LOOP
      INSERT INTO role_permissions (id, role_id, permission_id, created_at)
      VALUES (gen_random_uuid()::text, role_id, perm_id, NOW())
      ON CONFLICT DO NOTHING;
    END LOOP;
    
  END LOOP;
END $$;

-- ========================================
-- PART 5: CREATE SYSTEM ADMIN TABLES
-- ========================================

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

CREATE INDEX IF NOT EXISTS system_admin_email_idx ON system_admins(email);
CREATE INDEX IF NOT EXISTS system_admin_user_idx ON system_admins(user_id);
CREATE INDEX IF NOT EXISTS system_admin_active_idx ON system_admins(is_active);

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

CREATE INDEX IF NOT EXISTS sys_admin_audit_admin_idx ON system_admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS sys_admin_audit_action_idx ON system_admin_audit_log(action);
CREATE INDEX IF NOT EXISTS sys_admin_audit_entity_idx ON system_admin_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS sys_admin_audit_created_at_idx ON system_admin_audit_log(created_at);

-- ========================================
-- PART 6: UPDATE EVIDENCE TABLE FOR FILE MANAGEMENT
-- ========================================

-- Add file metadata columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'hearing_id') THEN
    ALTER TABLE evidence ADD COLUMN hearing_id TEXT REFERENCES hearings(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'file_name') THEN
    ALTER TABLE evidence ADD COLUMN file_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'file_size') THEN
    ALTER TABLE evidence ADD COLUMN file_size INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'file_type') THEN
    ALTER TABLE evidence ADD COLUMN file_type VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'file_path') THEN
    ALTER TABLE evidence ADD COLUMN file_path TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS evidence_hearing_idx ON evidence(hearing_id);

-- ========================================
-- PART 7: CREATE TRANSCRIPT TABLES
-- ========================================

CREATE TABLE IF NOT EXISTS transcripts (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES cases(id),
  hearing_id TEXT NOT NULL REFERENCES hearings(id),
  title TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration INTEGER,
  recording_url TEXT,
  transcription_service VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',
  accuracy INTEGER,
  created_by TEXT REFERENCES "user"(id),
  reviewed_by TEXT REFERENCES "user"(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_org_idx ON transcripts(organization_id);
CREATE INDEX IF NOT EXISTS transcript_case_idx ON transcripts(case_id);
CREATE INDEX IF NOT EXISTS transcript_hearing_idx ON transcripts(hearing_id);
CREATE INDEX IF NOT EXISTS transcript_status_idx ON transcripts(status);
CREATE INDEX IF NOT EXISTS transcript_created_by_idx ON transcripts(created_by);

CREATE TABLE IF NOT EXISTS transcript_speakers (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role VARCHAR(50) NOT NULL,
  user_id TEXT REFERENCES "user"(id),
  speaker_label VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_speaker_org_idx ON transcript_speakers(organization_id);
CREATE INDEX IF NOT EXISTS transcript_speaker_transcript_idx ON transcript_speakers(transcript_id);
CREATE INDEX IF NOT EXISTS transcript_speaker_role_idx ON transcript_speakers(role);

CREATE TABLE IF NOT EXISTS transcript_segments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  speaker_id TEXT REFERENCES transcript_speakers(id),
  segment_number INTEGER NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER NOT NULL,
  text TEXT NOT NULL,
  original_text TEXT,
  confidence INTEGER,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_by TEXT REFERENCES "user"(id),
  edited_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_segment_org_idx ON transcript_segments(organization_id);
CREATE INDEX IF NOT EXISTS transcript_segment_transcript_idx ON transcript_segments(transcript_id);
CREATE INDEX IF NOT EXISTS transcript_segment_speaker_idx ON transcript_segments(speaker_id);
CREATE INDEX IF NOT EXISTS transcript_segment_number_idx ON transcript_segments(transcript_id, segment_number);
CREATE INDEX IF NOT EXISTS transcript_segment_start_time_idx ON transcript_segments(transcript_id, start_time);
CREATE INDEX IF NOT EXISTS transcript_segment_text_search_idx ON transcript_segments USING GIN (to_tsvector('english', text));

CREATE TABLE IF NOT EXISTS transcript_annotations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  segment_id TEXT REFERENCES transcript_segments(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT,
  start_time INTEGER,
  end_time INTEGER,
  color VARCHAR(20),
  created_by TEXT NOT NULL REFERENCES "user"(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_annotation_org_idx ON transcript_annotations(organization_id);
CREATE INDEX IF NOT EXISTS transcript_annotation_transcript_idx ON transcript_annotations(transcript_id);
CREATE INDEX IF NOT EXISTS transcript_annotation_segment_idx ON transcript_annotations(segment_id);
CREATE INDEX IF NOT EXISTS transcript_annotation_type_idx ON transcript_annotations(type);
CREATE INDEX IF NOT EXISTS transcript_annotation_created_by_idx ON transcript_annotations(created_by);
