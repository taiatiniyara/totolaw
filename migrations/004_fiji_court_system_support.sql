-- Migration: Add Fiji Court System Support
-- Date: 2025-11-11
-- Description: Extends schema to support Fiji court procedures including court hierarchy,
--              hearing action types, legal representatives, daily cause lists, and enhanced case tracking

-- ============================================================================
-- 1. Extend User Table for Judicial Designations
-- ============================================================================

ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "judicial_title" TEXT,
ADD COLUMN IF NOT EXISTS "designation" TEXT;

COMMENT ON COLUMN "user"."judicial_title" IS 'Judicial title for judges/magistrates (e.g., Justice, Resident Magistrate)';
COMMENT ON COLUMN "user"."designation" IS 'Professional designation (e.g., Judge, Magistrate, Prosecutor, Defense Attorney)';

-- ============================================================================
-- 2. Extend Organisations Table for Court Hierarchy
-- ============================================================================

ALTER TABLE "organisations"
ADD COLUMN IF NOT EXISTS "court_level" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "court_type" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "jurisdiction" TEXT;

CREATE INDEX IF NOT EXISTS "org_court_level_idx" ON "organisations"("court_level");

COMMENT ON COLUMN "organisations"."court_level" IS 'Court level: court_of_appeal, high_court, magistrates, tribunal';
COMMENT ON COLUMN "organisations"."court_type" IS 'Court type: criminal, civil, family, agricultural, small_claims';
COMMENT ON COLUMN "organisations"."jurisdiction" IS 'Geographic or subject matter jurisdiction';

-- ============================================================================
-- 3. Extend Cases Table for Enhanced Case Tracking
-- ============================================================================

-- Add new columns to cases table
ALTER TABLE "cases"
ADD COLUMN IF NOT EXISTS "case_number" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "court_level" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "division" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "parties" JSONB,
ADD COLUMN IF NOT EXISTS "assigned_judge_id" TEXT REFERENCES "user"("id"),
ADD COLUMN IF NOT EXISTS "assigned_clerk_id" TEXT REFERENCES "user"("id"),
ADD COLUMN IF NOT EXISTS "filed_date" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "first_hearing_date" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "closed_date" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "offences" JSONB,
ADD COLUMN IF NOT EXISTS "notes" TEXT,
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT NOW();

-- Migrate existing data
UPDATE "cases"
SET
  "case_number" = "id",
  "filed_date" = "created_at",
  "parties" = jsonb_build_object(
    'prosecution', jsonb_build_array(),
    'defense', jsonb_build_array(),
    'plaintiff', jsonb_build_array(),
    'defendant', jsonb_build_array()
  ),
  "court_level" = 'magistrates',
  "updated_at" = NOW()
WHERE "case_number" IS NULL;

-- Make case_number required after migration
ALTER TABLE "cases"
ALTER COLUMN "case_number" SET NOT NULL,
ALTER COLUMN "filed_date" SET NOT NULL,
ALTER COLUMN "parties" SET NOT NULL,
ALTER COLUMN "court_level" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- Rename old columns to new naming convention
ALTER TABLE "cases"
RENAME COLUMN "filed_by" TO "filed_by";

ALTER TABLE "cases"
RENAME COLUMN "assigned_to" TO "assigned_to_old";

-- Create indexes
CREATE INDEX IF NOT EXISTS "case_number_idx" ON "cases"("case_number");
CREATE INDEX IF NOT EXISTS "case_court_level_idx" ON "cases"("court_level");
CREATE INDEX IF NOT EXISTS "case_assigned_judge_idx" ON "cases"("assigned_judge_id");
CREATE INDEX IF NOT EXISTS "case_filed_date_idx" ON "cases"("filed_date");

-- ============================================================================
-- 4. Create Court Rooms Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "court_rooms" (
  "id" TEXT PRIMARY KEY,
  "organisation_id" TEXT NOT NULL REFERENCES "organisations"("id") ON DELETE CASCADE,
  "name" VARCHAR(100) NOT NULL,
  "code" VARCHAR(20) NOT NULL,
  "court_level" VARCHAR(50) NOT NULL,
  "location" TEXT,
  "capacity" INTEGER,
  "is_active" BOOLEAN DEFAULT true NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "courtroom_org_idx" ON "court_rooms"("organisation_id");
CREATE INDEX IF NOT EXISTS "courtroom_code_idx" ON "court_rooms"("code");
CREATE INDEX IF NOT EXISTS "courtroom_active_idx" ON "court_rooms"("is_active");

COMMENT ON TABLE "court_rooms" IS 'Physical courtrooms within court buildings';

-- ============================================================================
-- 5. Extend Hearings Table for Fiji Court Procedures
-- ============================================================================

ALTER TABLE "hearings"
ADD COLUMN IF NOT EXISTS "scheduled_date" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "scheduled_time" VARCHAR(10),
ADD COLUMN IF NOT EXISTS "estimated_duration" INTEGER,
ADD COLUMN IF NOT EXISTS "court_room_id" TEXT REFERENCES "court_rooms"("id"),
ADD COLUMN IF NOT EXISTS "location" TEXT,
ADD COLUMN IF NOT EXISTS "action_type" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "status" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "magistrate_id" TEXT REFERENCES "user"("id"),
ADD COLUMN IF NOT EXISTS "clerk_id" TEXT REFERENCES "user"("id"),
ADD COLUMN IF NOT EXISTS "outcome" TEXT,
ADD COLUMN IF NOT EXISTS "next_action_required" TEXT,
ADD COLUMN IF NOT EXISTS "bail_considered" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "bail_amount" INTEGER,
ADD COLUMN IF NOT EXISTS "bail_conditions" TEXT,
ADD COLUMN IF NOT EXISTS "minutes" TEXT,
ADD COLUMN IF NOT EXISTS "notes" TEXT,
ADD COLUMN IF NOT EXISTS "created_by" TEXT REFERENCES "user"("id"),
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT NOW();

-- Migrate existing data
UPDATE "hearings"
SET
  "scheduled_date" = "date",
  "scheduled_time" = '9:30AM',
  "action_type" = 'HEARING',
  "status" = 'scheduled',
  "location" = COALESCE("location", 'Not specified'),
  "updated_at" = NOW()
WHERE "scheduled_date" IS NULL;

-- Make required columns not null after migration
ALTER TABLE "hearings"
ALTER COLUMN "scheduled_date" SET NOT NULL,
ALTER COLUMN "scheduled_time" SET NOT NULL,
ALTER COLUMN "action_type" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- Rename old column
ALTER TABLE "hearings"
RENAME COLUMN "judge_id" TO "judge_id";

-- Update foreign key on hearings.case_id to cascade deletes
ALTER TABLE "hearings"
DROP CONSTRAINT IF EXISTS "hearings_case_id_cases_id_fk",
ADD CONSTRAINT "hearings_case_id_cases_id_fk" 
  FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE;

-- Create new indexes
CREATE INDEX IF NOT EXISTS "hearing_status_idx" ON "hearings"("status");
CREATE INDEX IF NOT EXISTS "hearing_action_type_idx" ON "hearings"("action_type");
CREATE INDEX IF NOT EXISTS "hearing_courtroom_idx" ON "hearings"("court_room_id");

-- ============================================================================
-- 6. Extend Appeals Table for Better Case Linking
-- ============================================================================

ALTER TABLE "appeals"
ADD COLUMN IF NOT EXISTS "original_case_id" TEXT REFERENCES "cases"("id"),
ADD COLUMN IF NOT EXISTS "appeal_case_id" TEXT REFERENCES "cases"("id"),
ADD COLUMN IF NOT EXISTS "appeal_type" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "grounds" TEXT,
ADD COLUMN IF NOT EXISTS "status" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "appellant_id" TEXT REFERENCES "user"("id"),
ADD COLUMN IF NOT EXISTS "appellant_counsel" TEXT,
ADD COLUMN IF NOT EXISTS "respondent_counsel" TEXT,
ADD COLUMN IF NOT EXISTS "filed_date" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "hearing_date" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "decision_date" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "decision" TEXT,
ADD COLUMN IF NOT EXISTS "orders" TEXT,
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT NOW();

-- Migrate existing data
UPDATE "appeals"
SET
  "original_case_id" = "case_id",
  "appeal_type" = 'criminal_appeal',
  "status" = 'pending',
  "filed_date" = "created_at",
  "grounds" = "reason",
  "decision" = "outcome",
  "updated_at" = NOW()
WHERE "original_case_id" IS NULL;

-- Make required columns not null
ALTER TABLE "appeals"
ALTER COLUMN "original_case_id" SET NOT NULL,
ALTER COLUMN "appeal_type" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "filed_date" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS "appeal_original_case_idx" ON "appeals"("original_case_id");
CREATE INDEX IF NOT EXISTS "appeal_case_idx" ON "appeals"("appeal_case_id");
CREATE INDEX IF NOT EXISTS "appeal_status_idx" ON "appeals"("status");

-- ============================================================================
-- 7. Create Legal Representatives Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "legal_representatives" (
  "id" TEXT PRIMARY KEY,
  "organisation_id" TEXT NOT NULL REFERENCES "organisations"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "type" VARCHAR(50) NOT NULL,
  "firm_name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "practice_areas" JSONB,
  "user_id" TEXT REFERENCES "user"("id"),
  "is_active" BOOLEAN DEFAULT true NOT NULL,
  "notes" TEXT,
  "created_by" TEXT REFERENCES "user"("id"),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "legal_rep_org_idx" ON "legal_representatives"("organisation_id");
CREATE INDEX IF NOT EXISTS "legal_rep_user_idx" ON "legal_representatives"("user_id");
CREATE INDEX IF NOT EXISTS "legal_rep_active_idx" ON "legal_representatives"("is_active");

COMMENT ON TABLE "legal_representatives" IS 'Legal representatives including lawyers, law firms, and legal aid';

-- ============================================================================
-- 8. Create Daily Cause Lists Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "daily_cause_lists" (
  "id" TEXT PRIMARY KEY,
  "organisation_id" TEXT NOT NULL REFERENCES "organisations"("id") ON DELETE CASCADE,
  "list_date" TIMESTAMP NOT NULL,
  "court_level" VARCHAR(50) NOT NULL,
  "presiding_officer_id" TEXT NOT NULL REFERENCES "user"("id"),
  "presiding_officer_title" VARCHAR(100),
  "court_room_id" TEXT REFERENCES "court_rooms"("id"),
  "session_time" VARCHAR(20),
  "status" VARCHAR(50) DEFAULT 'draft' NOT NULL,
  "published_at" TIMESTAMP,
  "notes" TEXT,
  "created_by" TEXT REFERENCES "user"("id"),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "cause_list_org_idx" ON "daily_cause_lists"("organisation_id");
CREATE INDEX IF NOT EXISTS "cause_list_date_idx" ON "daily_cause_lists"("list_date");
CREATE INDEX IF NOT EXISTS "cause_list_officer_idx" ON "daily_cause_lists"("presiding_officer_id");
CREATE INDEX IF NOT EXISTS "cause_list_status_idx" ON "daily_cause_lists"("status");

COMMENT ON TABLE "daily_cause_lists" IS 'Daily court schedules/cause lists organized by judge and courtroom';

-- ============================================================================
-- 9. Update Comments for Better Documentation
-- ============================================================================

COMMENT ON COLUMN "cases"."case_number" IS 'Court case number (e.g., HAC 179/2024, ABU 002/20)';
COMMENT ON COLUMN "cases"."court_level" IS 'Court level: court_of_appeal, high_court, magistrates, tribunal';
COMMENT ON COLUMN "cases"."division" IS 'Court division: criminal, civil for high courts';
COMMENT ON COLUMN "cases"."parties" IS 'JSON object containing all case parties with their legal representation';
COMMENT ON COLUMN "cases"."offences" IS 'JSON array of offences for criminal cases';

COMMENT ON COLUMN "hearings"."action_type" IS 'Hearing action type: MENTION, HEARING, TRIAL, CONTINUATION OF TRIAL, VOIR DIRE HEARING, PRE-TRIAL CONFERENCE, RULING, FIRST CALL, BAIL HEARING';
COMMENT ON COLUMN "hearings"."scheduled_time" IS 'Scheduled time in format like "9:30AM", "10:00AM"';

-- ============================================================================
-- 10. Create Helper Views for Common Queries
-- ============================================================================

-- View for upcoming hearings with case details
CREATE OR REPLACE VIEW "v_upcoming_hearings" AS
SELECT 
  h."id" AS "hearing_id",
  h."scheduled_date",
  h."scheduled_time",
  h."action_type",
  h."status",
  c."id" AS "case_id",
  c."case_number",
  c."title" AS "case_title",
  c."type" AS "case_type",
  c."court_level",
  j."name" AS "judge_name",
  j."judicial_title",
  cr."name" AS "courtroom_name",
  h."organisation_id"
FROM "hearings" h
JOIN "cases" c ON h."case_id" = c."id"
LEFT JOIN "user" j ON h."judge_id" = j."id"
LEFT JOIN "court_rooms" cr ON h."court_room_id" = cr."id"
WHERE h."status" IN ('scheduled', 'in_progress')
  AND h."scheduled_date" >= CURRENT_DATE
ORDER BY h."scheduled_date", h."scheduled_time";

COMMENT ON VIEW "v_upcoming_hearings" IS 'View of upcoming scheduled hearings with case and judge details';

-- View for active cases with latest hearing
CREATE OR REPLACE VIEW "v_active_cases" AS
SELECT 
  c."id",
  c."case_number",
  c."title",
  c."type",
  c."court_level",
  c."status",
  c."filed_date",
  j."name" AS "assigned_judge_name",
  (
    SELECT "scheduled_date"
    FROM "hearings"
    WHERE "case_id" = c."id"
      AND "status" = 'scheduled'
      AND "scheduled_date" >= CURRENT_DATE
    ORDER BY "scheduled_date"
    LIMIT 1
  ) AS "next_hearing_date",
  c."organisation_id"
FROM "cases" c
LEFT JOIN "user" j ON c."assigned_judge_id" = j."id"
WHERE c."status" IN ('open', 'active')
ORDER BY c."filed_date" DESC;

COMMENT ON VIEW "v_active_cases" IS 'View of active cases with next hearing date';

-- ============================================================================
-- Migration Complete
-- ============================================================================
