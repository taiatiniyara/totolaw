-- Migration: Add managed lists table with enhanced schema
-- This migration updates the managed_lists table to support categorized, system-level lists

-- Drop existing table if it exists (since we're changing the structure significantly)
DROP TABLE IF EXISTS managed_lists CASCADE;

-- Create managed_lists table with new schema
CREATE TABLE IF NOT EXISTS managed_lists (
  id TEXT PRIMARY KEY,
  organisation_id TEXT REFERENCES organisations(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  items JSONB NOT NULL,
  is_system BOOLEAN DEFAULT FALSE NOT NULL,
  created_by TEXT REFERENCES "user"(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX managed_list_org_idx ON managed_lists(organisation_id);
CREATE INDEX managed_list_category_idx ON managed_lists(category);
CREATE INDEX managed_list_system_idx ON managed_lists(is_system);

-- Insert system default lists

-- Court Levels
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_court_levels',
  NULL,
  'court_levels',
  'Court Levels',
  'Default court hierarchy levels',
  '[
    {"id": "cl_1", "value": "high_court", "label": "High Court", "description": "Superior court for serious matters", "sortOrder": 1, "isActive": true},
    {"id": "cl_2", "value": "magistrates", "label": "Magistrates Court", "description": "Lower court for minor matters", "sortOrder": 2, "isActive": true},
    {"id": "cl_3", "value": "court_of_appeal", "label": "Court of Appeal", "description": "Appellate court", "sortOrder": 3, "isActive": true},
    {"id": "cl_4", "value": "tribunal", "label": "Tribunal", "description": "Specialized tribunals", "sortOrder": 4, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);

-- Case Types (High Court Divisions)
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_case_types',
  NULL,
  'case_types',
  'Case Types',
  'Default case type categories',
  '[
    {"id": "ct_1", "value": "criminal", "label": "Criminal", "description": "Criminal prosecutions", "sortOrder": 1, "isActive": true},
    {"id": "ct_2", "value": "civil", "label": "Civil", "description": "Civil disputes", "sortOrder": 2, "isActive": true},
    {"id": "ct_3", "value": "family", "label": "Family", "description": "Family law matters", "sortOrder": 3, "isActive": true},
    {"id": "ct_4", "value": "appeal", "label": "Appeal", "description": "Appeals from lower courts", "sortOrder": 4, "isActive": true},
    {"id": "ct_5", "value": "agricultural", "label": "Agricultural", "description": "Agricultural tribunal matters", "sortOrder": 5, "isActive": true},
    {"id": "ct_6", "value": "small_claims", "label": "Small Claims", "description": "Small claims tribunal", "sortOrder": 6, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);

-- Case Statuses
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_case_statuses',
  NULL,
  'case_statuses',
  'Case Statuses',
  'Default case status options',
  '[
    {"id": "cs_1", "value": "PENDING", "label": "Pending", "description": "Case filed but not yet active", "sortOrder": 1, "isActive": true},
    {"id": "cs_2", "value": "ACTIVE", "label": "Active", "description": "Case is actively being processed", "sortOrder": 2, "isActive": true},
    {"id": "cs_3", "value": "IN_PROGRESS", "label": "In Progress", "description": "Hearings or trials underway", "sortOrder": 3, "isActive": true},
    {"id": "cs_4", "value": "CLOSED", "label": "Closed", "description": "Case concluded", "sortOrder": 4, "isActive": true},
    {"id": "cs_5", "value": "ARCHIVED", "label": "Archived", "description": "Case archived for records", "sortOrder": 5, "isActive": true},
    {"id": "cs_6", "value": "APPEALED", "label": "Appealed", "description": "Under appeal", "sortOrder": 6, "isActive": true},
    {"id": "cs_7", "value": "DISMISSED", "label": "Dismissed", "description": "Case dismissed", "sortOrder": 7, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);

-- Hearing Action Types
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_action_types',
  NULL,
  'action_types',
  'Hearing Action Types',
  'Default hearing action type options based on Fiji court procedures',
  '[
    {"id": "at_1", "value": "MENTION", "label": "Mention", "description": "Brief court appearance", "sortOrder": 1, "isActive": true},
    {"id": "at_2", "value": "HEARING", "label": "Hearing", "description": "General hearing", "sortOrder": 2, "isActive": true},
    {"id": "at_3", "value": "TRIAL", "label": "Trial", "description": "Main trial proceedings", "sortOrder": 3, "isActive": true},
    {"id": "at_4", "value": "CONTINUATION_OF_TRIAL", "label": "Continuation of Trial", "description": "Ongoing trial session", "sortOrder": 4, "isActive": true},
    {"id": "at_5", "value": "VOIR_DIRE_HEARING", "label": "Voir Dire Hearing", "description": "Trial within a trial", "sortOrder": 5, "isActive": true},
    {"id": "at_6", "value": "PRE_TRIAL_CONFERENCE", "label": "Pre-Trial Conference", "description": "Case management conference", "sortOrder": 6, "isActive": true},
    {"id": "at_7", "value": "RULING", "label": "Ruling", "description": "Judgment or ruling delivery", "sortOrder": 7, "isActive": true},
    {"id": "at_8", "value": "FIRST_CALL", "label": "First Call", "description": "Initial case call", "sortOrder": 8, "isActive": true},
    {"id": "at_9", "value": "BAIL_HEARING", "label": "Bail Hearing", "description": "Bail application hearing", "sortOrder": 9, "isActive": true},
    {"id": "at_10", "value": "SENTENCING", "label": "Sentencing", "description": "Sentencing hearing", "sortOrder": 10, "isActive": true},
    {"id": "at_11", "value": "CASE_CONFERENCE", "label": "Case Conference", "description": "Case management discussion", "sortOrder": 11, "isActive": true},
    {"id": "at_12", "value": "OTHER", "label": "Other", "description": "Other hearing type", "sortOrder": 12, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);

-- Common Offense Types (Fiji Criminal Law)
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_offense_types',
  NULL,
  'offense_types',
  'Common Offense Types',
  'Common criminal offenses in Fiji',
  '[
    {"id": "of_1", "value": "theft", "label": "Theft contrary to section 291 of the Crimes Act", "sortOrder": 1, "isActive": true},
    {"id": "of_2", "value": "assault_abh", "label": "Assault Causing Actual Bodily Harm", "sortOrder": 2, "isActive": true},
    {"id": "of_3", "value": "aggravated_robbery", "label": "Aggravated Robbery", "sortOrder": 3, "isActive": true},
    {"id": "of_4", "value": "rape", "label": "Rape contrary to section 207 of the Crimes Act", "sortOrder": 4, "isActive": true},
    {"id": "of_5", "value": "murder", "label": "Murder contrary to section 237 of the Crimes Act", "sortOrder": 5, "isActive": true},
    {"id": "of_6", "value": "dangerous_driving_death", "label": "Dangerous Driving Occasioning Death", "sortOrder": 6, "isActive": true},
    {"id": "of_7", "value": "drug_possession", "label": "Possession of Illicit Drugs", "sortOrder": 7, "isActive": true},
    {"id": "of_8", "value": "breach_of_trust", "label": "Breach of Trust", "sortOrder": 8, "isActive": true},
    {"id": "of_9", "value": "obtaining_financial_advantage", "label": "Obtaining Financial Advantage by Deception", "sortOrder": 9, "isActive": true},
    {"id": "of_10", "value": "burglary", "label": "Burglary", "sortOrder": 10, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);

-- Bail Decisions
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_bail_decisions',
  NULL,
  'bail_decisions',
  'Bail Decisions',
  'Bail decision options',
  '[
    {"id": "bd_1", "value": "not_decided", "label": "Not yet decided", "sortOrder": 1, "isActive": true},
    {"id": "bd_2", "value": "granted", "label": "Granted", "sortOrder": 2, "isActive": true},
    {"id": "bd_3", "value": "denied", "label": "Denied", "sortOrder": 3, "isActive": true},
    {"id": "bd_4", "value": "continued", "label": "Continued", "sortOrder": 4, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);

-- Sentence Types
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_sentence_types',
  NULL,
  'sentence_types',
  'Sentence Types',
  'Types of sentences that can be imposed',
  '[
    {"id": "st_1", "value": "imprisonment", "label": "Imprisonment", "sortOrder": 1, "isActive": true},
    {"id": "st_2", "value": "fine", "label": "Fine", "sortOrder": 2, "isActive": true},
    {"id": "st_3", "value": "community_service", "label": "Community Service", "sortOrder": 3, "isActive": true},
    {"id": "st_4", "value": "suspended_sentence", "label": "Suspended Sentence", "sortOrder": 4, "isActive": true},
    {"id": "st_5", "value": "probation", "label": "Probation", "sortOrder": 5, "isActive": true},
    {"id": "st_6", "value": "life_imprisonment", "label": "Life Imprisonment", "sortOrder": 6, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);

-- Appeal Types
INSERT INTO managed_lists (id, organisation_id, category, name, description, items, is_system, created_at, updated_at)
VALUES (
  'system_appeal_types',
  NULL,
  'appeal_types',
  'Appeal Types',
  'Types of appeals',
  '[
    {"id": "apt_1", "value": "criminal_appeal", "label": "Criminal Appeal", "sortOrder": 1, "isActive": true},
    {"id": "apt_2", "value": "civil_appeal", "label": "Civil Appeal", "sortOrder": 2, "isActive": true},
    {"id": "apt_3", "value": "bail_application", "label": "Bail Application", "sortOrder": 3, "isActive": true},
    {"id": "apt_4", "value": "leave_to_appeal", "label": "Leave to Appeal", "sortOrder": 4, "isActive": true}
  ]'::jsonb,
  true,
  NOW(),
  NOW()
);
