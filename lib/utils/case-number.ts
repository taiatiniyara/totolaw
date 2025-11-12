/**
 * Case Number Generation Utilities (Server-Only)
 * 
 * Generates case numbers according to Fiji court formats:
 * - High Court Criminal: HAC 179/2024
 * - High Court Civil: HBC 188/2023
 * - High Court Appeal: HAA 19/2025
 * - Court of Appeal: ABU 002/20
 * - Magistrates: 707/21, 1314/25
 * - Agricultural Tribunal: C & ED 03/2025
 */

import { db } from "@/lib/drizzle/connection";
import { cases } from "@/lib/drizzle/schema/db-schema";
import { eq, and, sql } from "drizzle-orm";

// Re-export client-safe utilities
export {
  getCaseNumberFormat,
  parseCaseNumber,
  validateCaseNumber,
  CASE_NUMBER_EXAMPLES,
} from "./case-number-format";

interface CaseNumberConfig {
  prefix: string;
  padLength: number;
  yearDigits: 2 | 4;
  separator: string;
}

const CASE_NUMBER_FORMATS: Record<string, CaseNumberConfig> = {
  // High Court
  "high_court_criminal": {
    prefix: "HAC",
    padLength: 3,
    yearDigits: 4,
    separator: "/",
  },
  "high_court_civil": {
    prefix: "HBC",
    padLength: 3,
    yearDigits: 4,
    separator: "/",
  },
  "high_court_appeal": {
    prefix: "HAA",
    padLength: 2,
    yearDigits: 4,
    separator: "/",
  },
  
  // Court of Appeal
  "court_of_appeal_all": {
    prefix: "ABU",
    padLength: 3,
    yearDigits: 2,
    separator: "/",
  },
  
  // Magistrates Courts
  "magistrates_all": {
    prefix: "",
    padLength: 1,
    yearDigits: 2,
    separator: "/",
  },
  
  // Tribunals
  "tribunal_agricultural": {
    prefix: "C & ED",
    padLength: 2,
    yearDigits: 4,
    separator: "/",
  },
  "tribunal_small_claims": {
    prefix: "SCT",
    padLength: 3,
    yearDigits: 2,
    separator: "/",
  },
};

/**
 * Get the format key for a case based on court level and type
 */
function getFormatKey(courtLevel: string, courtType?: string): string {
  if (courtLevel === "high_court") {
    if (courtType === "criminal") return "high_court_criminal";
    if (courtType === "civil") return "high_court_civil";
    if (courtType === "appeal") return "high_court_appeal";
  }
  
  if (courtLevel === "court_of_appeal") {
    return "court_of_appeal_all";
  }
  
  if (courtLevel === "magistrates") {
    return "magistrates_all";
  }
  
  if (courtLevel === "tribunal") {
    if (courtType === "agricultural") return "tribunal_agricultural";
    if (courtType === "small_claims") return "tribunal_small_claims";
  }
  
  // Default format
  return "magistrates_all";
}

/**
 * Get the next sequence number for a case type and year
 */
async function getNextSequenceNumber(
  organisationId: string,
  courtLevel: string,
  courtType: string | undefined,
  year: number
): Promise<number> {
  // Query for the highest sequence number for this org/court/year
  const result = await db
    .select({
      maxNumber: sql<string>`MAX(SUBSTRING(${cases.caseNumber} FROM '[0-9]+'))`,
    })
    .from(cases)
    .where(
      and(
        eq(cases.organisationId, organisationId),
        eq(cases.courtLevel, courtLevel),
        courtType ? eq(cases.caseType, courtType) : sql`true`,
        sql`EXTRACT(YEAR FROM ${cases.filedDate}) = ${year}`
      )
    );

  const maxNumber = result[0]?.maxNumber;
  return maxNumber ? parseInt(maxNumber) + 1 : 1;
}

/**
 * Format a case number according to court rules
 */
function formatCaseNumber(
  config: CaseNumberConfig,
  sequence: number,
  year: number
): string {
  const paddedSequence = sequence.toString().padStart(config.padLength, "0");
  const yearStr = config.yearDigits === 2 
    ? year.toString().slice(-2)
    : year.toString();
  
  if (config.prefix) {
    return `${config.prefix} ${paddedSequence}${config.separator}${yearStr}`;
  } else {
    return `${paddedSequence}${config.separator}${yearStr}`;
  }
}

/**
 * Generate a case number for a new case
 * 
 * @param organisationId - The court organisation ID
 * @param courtLevel - Court level (high_court, magistrates, etc.)
 * @param courtType - Court type/division (criminal, civil, etc.)
 * @param year - Year for the case (defaults to current year)
 * @returns Formatted case number (e.g., "HAC 179/2024")
 */
export async function generateCaseNumber(
  organisationId: string,
  courtLevel: string,
  courtType?: string,
  year?: number
): Promise<string> {
  const caseYear = year || new Date().getFullYear();
  
  // Get the format configuration
  const formatKey = getFormatKey(courtLevel, courtType);
  const config = CASE_NUMBER_FORMATS[formatKey];
  
  if (!config) {
    throw new Error(`No case number format found for ${courtLevel}/${courtType}`);
  }
  
  // Get next sequence number
  const sequence = await getNextSequenceNumber(
    organisationId,
    courtLevel,
    courtType,
    caseYear
  );
  
  // Format and return
  return formatCaseNumber(config, sequence, caseYear);
}

