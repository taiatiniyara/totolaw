-- Migration: Rename division to case_type
-- Description: Rename the 'division' column to 'case_type' in the cases table
-- This better reflects that it represents the case type, not a division

ALTER TABLE "cases" RENAME COLUMN "division" TO "case_type";

-- Update comment
COMMENT ON COLUMN "cases"."case_type" IS 'Case type: criminal, civil for high courts';
