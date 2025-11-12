/**
 * Case Number Format Utilities (Client-Safe)
 * 
 * Pure functions for case number formatting that can be used in client components
 */

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
 * Get the case number format description for display
 */
export function getCaseNumberFormat(courtLevel: string, courtType?: string): string {
  const formatKey = getFormatKey(courtLevel, courtType);
  const config = CASE_NUMBER_FORMATS[formatKey];
  
  if (!config) return "Unknown format";
  
  const seqPlaceholder = "X".repeat(config.padLength);
  const yearPlaceholder = config.yearDigits === 2 ? "YY" : "YYYY";
  
  if (config.prefix) {
    return `${config.prefix} ${seqPlaceholder}${config.separator}${yearPlaceholder}`;
  } else {
    return `${seqPlaceholder}${config.separator}${yearPlaceholder}`;
  }
}

/**
 * Parse a case number to extract its components
 */
export function parseCaseNumber(caseNumber: string): {
  prefix?: string;
  sequence: number;
  year: number;
} | null {
  // Try different patterns
  
  // Pattern 1: "HAC 179/2024" or "C & ED 03/2025"
  const pattern1 = /^([A-Z &]+)\s+(\d+)\/(\d{2,4})$/;
  const match1 = caseNumber.match(pattern1);
  if (match1) {
    return {
      prefix: match1[1],
      sequence: parseInt(match1[2]),
      year: parseInt(match1[3]),
    };
  }
  
  // Pattern 2: "707/21" (no prefix)
  const pattern2 = /^(\d+)\/(\d{2,4})$/;
  const match2 = caseNumber.match(pattern2);
  if (match2) {
    return {
      sequence: parseInt(match2[1]),
      year: parseInt(match2[2]),
    };
  }
  
  return null;
}

/**
 * Validate a case number format
 */
export function validateCaseNumber(
  caseNumber: string,
  courtLevel: string,
  courtType?: string
): boolean {
  const parsed = parseCaseNumber(caseNumber);
  if (!parsed) return false;
  
  const formatKey = getFormatKey(courtLevel, courtType);
  const config = CASE_NUMBER_FORMATS[formatKey];
  
  if (!config) return false;
  
  // Check prefix matches
  if (config.prefix && parsed.prefix !== config.prefix) {
    return false;
  }
  
  // Check if no prefix expected
  if (!config.prefix && parsed.prefix) {
    return false;
  }
  
  return true;
}

/**
 * Examples for testing/documentation
 */
export const CASE_NUMBER_EXAMPLES = {
  high_court_criminal: "HAC 179/2024",
  high_court_civil: "HBC 188/2023",
  high_court_appeal: "HAA 19/2025",
  court_of_appeal: "ABU 002/20",
  magistrates: "707/21",
  tribunal_agricultural: "C & ED 03/2025",
};
