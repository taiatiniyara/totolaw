-- =============================================================================
-- Totolaw Database Migration 005: Rename Division to Case Type
-- Date: Applied
-- Status: ACTIVE - DO NOT REMOVE
-- 
-- Description: Rename the 'division' column to 'case_type' in the cases table
-- This better reflects that it represents the case type, not a division
-- =============================================================================

ALTER TABLE "cases" RENAME COLUMN "division" TO "case_type";

-- Update comment
COMMENT ON COLUMN "cases"."case_type" IS 'Case type: criminal, civil for high courts';
