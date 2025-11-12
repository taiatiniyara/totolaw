# Case Number Generation System

## Overview

The Totolaw case number generation system automatically creates properly formatted case numbers according to Fiji court system conventions. Each court level and type has its own numbering format, ensuring consistency and compliance with established court practices.

## Purpose

- **Automatic Generation** - No manual case number entry needed
- **Format Compliance** - Matches official Fiji court numbering systems
- **Uniqueness** - Ensures no duplicate case numbers within a court/year
- **Sequence Management** - Maintains proper sequential numbering
- **Validation** - Validates case numbers against expected formats

## Case Number Formats

### High Court

#### Criminal Division
**Format:** `HAC XXX/YYYY`

**Example:** `HAC 179/2024`

**Components:**
- `HAC` - High Court Criminal prefix
- `XXX` - 3-digit sequence number (001-999)
- `/` - Separator
- `YYYY` - 4-digit year

#### Civil Division
**Format:** `HBC XXX/YYYY`

**Example:** `HBC 188/2023`

**Components:**
- `HBC` - High Court Civil prefix
- `XXX` - 3-digit sequence number
- `/` - Separator
- `YYYY` - 4-digit year

#### Appeals (High Court)
**Format:** `HAA XX/YYYY`

**Example:** `HAA 19/2025`

**Components:**
- `HAA` - High Court Appeal prefix
- `XX` - 2-digit sequence number
- `/` - Separator
- `YYYY` - 4-digit year

### Court of Appeal

**Format:** `ABU XXX/YY`

**Example:** `ABU 002/20`

**Components:**
- `ABU` - Court of Appeal prefix
- `XXX` - 3-digit sequence number
- `/` - Separator
- `YY` - 2-digit year

### Magistrates Courts

**Format:** `XXX/YY`

**Example:** `707/21` or `1314/25`

**Components:**
- `XXX` - Variable-length sequence number (no padding)
- `/` - Separator
- `YY` - 2-digit year

**Note:** Magistrates courts do not use a prefix.

### Tribunals

#### Agricultural Tribunal
**Format:** `C & ED XX/YYYY`

**Example:** `C & ED 03/2025`

**Components:**
- `C & ED` - Civil & Estates Division prefix
- `XX` - 2-digit sequence number
- `/` - Separator
- `YYYY` - 4-digit year

#### Small Claims Tribunal
**Format:** `SCT XXX/YY`

**Example:** `SCT 045/25`

**Components:**
- `SCT` - Small Claims Tribunal prefix
- `XXX` - 3-digit sequence number
- `/` - Separator
- `YY` - 2-digit year

## Implementation

### File Location

**Path:** `lib/utils/case-number.ts`

### Core Function

```typescript
export async function generateCaseNumber(
  organisationId: string,
  courtLevel: string,
  courtType?: string,
  year?: number
): Promise<string>
```

**Parameters:**
- `organisationId` - The court organisation ID
- `courtLevel` - Court level: "high_court", "magistrates", "court_of_appeal", "tribunal"
- `courtType` - Optional court type/division: "criminal", "civil", "appeal", "agricultural", "small_claims"
- `year` - Optional year (defaults to current year)

**Returns:** Formatted case number string

**Example Usage:**

```typescript
import { generateCaseNumber } from "@/lib/utils/case-number";

// Generate High Court Criminal case number
const caseNum = await generateCaseNumber(
  organisationId,
  "high_court",
  "criminal"
);
// Returns: "HAC 001/2025"

// Generate Court of Appeal case number
const appealNum = await generateCaseNumber(
  organisationId,
  "court_of_appeal"
);
// Returns: "ABU 001/25"

// Generate Magistrates case number
const magNum = await generateCaseNumber(
  organisationId,
  "magistrates"
);
// Returns: "1/25"
```

### Format Configuration

The system uses a configuration object to define formats:

```typescript
interface CaseNumberConfig {
  prefix: string;          // Court prefix (e.g., "HAC")
  padLength: number;       // Number of digits for sequence
  yearDigits: 2 | 4;      // Year format (2 or 4 digits)
  separator: string;       // Separator character (usually "/")
}

const CASE_NUMBER_FORMATS: Record<string, CaseNumberConfig> = {
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
  // ... more formats
};
```

### Sequence Management

The system queries the database to find the highest sequence number for each court/type/year combination:

```typescript
async function getNextSequenceNumber(
  organisationId: string,
  courtLevel: string,
  courtType: string | undefined,
  year: number
): Promise<number> {
  // Query for max sequence number
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
```

**Behavior:**
- Finds the highest existing case number for the court/year
- Returns `1` if no cases exist
- Returns `max + 1` to get the next sequential number
- Scoped to organisation for multi-tenancy

### Number Formatting

```typescript
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
```

**Features:**
- Pads sequence numbers with leading zeros
- Handles 2-digit or 4-digit years
- Includes or excludes prefix as needed
- Adds space after prefix (except magistrates)

## Utility Functions

### Parse Case Number

Extract components from a case number string:

```typescript
export function parseCaseNumber(caseNumber: string): {
  prefix?: string;
  sequence: number;
  year: number;
} | null
```

**Example:**

```typescript
const parsed = parseCaseNumber("HAC 179/2024");
// Returns: { prefix: "HAC", sequence: 179, year: 2024 }

const parsed2 = parseCaseNumber("707/21");
// Returns: { sequence: 707, year: 21 }
```

**Use Cases:**
- Extracting year from case number
- Getting sequence number for display
- Analyzing case number patterns

### Validate Case Number

Check if a case number matches expected format:

```typescript
export function validateCaseNumber(
  caseNumber: string,
  courtLevel: string,
  courtType?: string
): boolean
```

**Example:**

```typescript
// Valid format
const valid = validateCaseNumber("HAC 179/2024", "high_court", "criminal");
// Returns: true

// Invalid prefix
const invalid = validateCaseNumber("HBC 179/2024", "high_court", "criminal");
// Returns: false (should be HAC for criminal)

// Wrong court level
const wrong = validateCaseNumber("HAC 179/2024", "magistrates");
// Returns: false (magistrates don't use HAC prefix)
```

**Use Cases:**
- Validating manual entry (if ever needed)
- Data integrity checks
- Migration validation

### Get Format Description

Get a human-readable format description:

```typescript
export function getCaseNumberFormat(
  courtLevel: string,
  courtType?: string
): string
```

**Example:**

```typescript
const format = getCaseNumberFormat("high_court", "criminal");
// Returns: "HAC XXX/YYYY"

const format2 = getCaseNumberFormat("magistrates");
// Returns: "X/YY"
```

**Use Cases:**
- Displaying expected format to users
- Form placeholder text
- Help documentation

## Integration with Case Creation

### Server Action

In `app/dashboard/cases/actions.ts`:

```typescript
export async function createCase(formData: FormData): Promise<ActionResult> {
  // ... auth and validation ...
  
  const courtLevel = formData.get("courtLevel") as string;
  const courtType = formData.get("caseType") as string | undefined;
  const filedDate = new Date(formData.get("filedDate") as string);
  const year = filedDate.getFullYear();
  
  // Generate case number
  const caseNumber = await generateCaseNumber(
    context.organisationId,
    courtLevel,
    courtType,
    year
  );
  
  // Create case with generated number
  await db.insert(cases).values({
    id: generateUUID(),
    organisationId: context.organisationId,
    caseNumber,
    courtLevel,
    caseType,
    filedDate,
    // ... other fields ...
  });
  
  return { success: true, data: { caseNumber } };
}
```

### UI Form

Case creation forms do NOT include a case number field:

```tsx
// app/dashboard/cases/new/page.tsx

<form action={createCase}>
  {/* No case number input - auto-generated */}
  
  <FormField
    label="Court Level"
    name="courtLevel"
    type="select"
    required
    options={[
      { value: "high_court", label: "High Court" },
      { value: "magistrates", label: "Magistrates Court" },
      { value: "court_of_appeal", label: "Court of Appeal" },
      { value: "tribunal", label: "Tribunal" },
    ]}
  />
  
  <FormField
    label="Court Type"
    name="caseType"
    type="select"
    helpText="Division (for High Court)"
    options={[
      { value: "criminal", label: "Criminal" },
      { value: "civil", label: "Civil" },
    ]}
  />
  
  <FormField
    label="Filed Date"
    name="filedDate"
    type="date"
    required
  />
  
  {/* Other fields... */}
  
  <Button type="submit">Create Case</Button>
</form>
```

**Benefits:**
- No manual entry errors
- Guaranteed unique numbers
- Automatic format compliance
- Simpler user interface

## Sequence Number Management

### Annual Reset

Sequence numbers reset each year:

- `HAC 179/2024` ← Last case of 2024
- `HAC 001/2025` ← First case of 2025

This is handled automatically by including the year in the query.

### Cross-Court Independence

Each court level maintains independent sequences:

```
High Court Criminal: HAC 001/2025, HAC 002/2025, ...
High Court Civil:    HBC 001/2025, HBC 002/2025, ...
Magistrates:         1/25, 2/25, ...
```

### Organisation Isolation

Each organisation maintains its own sequences:

```
Suva High Court:     HAC 001/2025, HAC 002/2025, ...
Nadi High Court:     HAC 001/2025, HAC 002/2025, ...
```

This is enforced by including `organisationId` in the query.

### Concurrency Handling

**Race Condition Risk:**
Two simultaneous case creations could theoretically get the same sequence number.

**Mitigation:**
1. Database transaction isolation
2. Unique constraint on `(organisationId, caseNumber)`
3. Retry logic in case of conflict

**Recommended Enhancement:**
```typescript
// Future: Add database-level sequence generation
CREATE SEQUENCE IF NOT EXISTS case_seq_hac_2025_org1;

// Generate using sequence
SELECT nextval('case_seq_hac_2025_org1');
```

## Error Handling

### Invalid Court Configuration

```typescript
try {
  const caseNum = await generateCaseNumber(orgId, "unknown_court", "invalid");
} catch (error) {
  // Error: No case number format found for unknown_court/invalid
}
```

### Database Errors

```typescript
try {
  const caseNum = await generateCaseNumber(orgId, "high_court", "criminal");
} catch (error) {
  // Handle database connection or query errors
  console.error("Failed to generate case number:", error);
  return { success: false, error: "Failed to generate case number" };
}
```

### Duplicate Prevention

The database schema prevents duplicates:

```sql
CREATE UNIQUE INDEX cases_org_number_unique 
  ON cases(organisation_id, case_number);
```

If a duplicate somehow occurs:
```typescript
// PostgreSQL will raise an error
// Error: duplicate key value violates unique constraint "cases_org_number_unique"
```

## Testing

### Unit Tests

```typescript
import { parseCaseNumber, validateCaseNumber, getCaseNumberFormat } from "@/lib/utils/case-number";

describe("parseCaseNumber", () => {
  it("should parse High Court Criminal format", () => {
    const result = parseCaseNumber("HAC 179/2024");
    expect(result).toEqual({
      prefix: "HAC",
      sequence: 179,
      year: 2024,
    });
  });
  
  it("should parse Magistrates format", () => {
    const result = parseCaseNumber("707/21");
    expect(result).toEqual({
      sequence: 707,
      year: 21,
    });
  });
  
  it("should return null for invalid format", () => {
    const result = parseCaseNumber("INVALID");
    expect(result).toBeNull();
  });
});

describe("validateCaseNumber", () => {
  it("should validate correct High Court Criminal number", () => {
    const valid = validateCaseNumber("HAC 179/2024", "high_court", "criminal");
    expect(valid).toBe(true);
  });
  
  it("should reject wrong prefix", () => {
    const valid = validateCaseNumber("HBC 179/2024", "high_court", "criminal");
    expect(valid).toBe(false);
  });
});

describe("getCaseNumberFormat", () => {
  it("should return correct format description", () => {
    const format = getCaseNumberFormat("high_court", "criminal");
    expect(format).toBe("HAC XXX/YYYY");
  });
});
```

### Integration Tests

```typescript
describe("generateCaseNumber", () => {
  it("should generate sequential numbers", async () => {
    const num1 = await generateCaseNumber(orgId, "high_court", "criminal", 2025);
    expect(num1).toMatch(/^HAC \d{3}\/2025$/);
    
    const num2 = await generateCaseNumber(orgId, "high_court", "criminal", 2025);
    expect(num2).toMatch(/^HAC \d{3}\/2025$/);
    
    // Second number should be higher than first
    const seq1 = parseInt(num1.split(" ")[1].split("/")[0]);
    const seq2 = parseInt(num2.split(" ")[1].split("/")[0]);
    expect(seq2).toBe(seq1 + 1);
  });
  
  it("should reset sequence for new year", async () => {
    await generateCaseNumber(orgId, "high_court", "criminal", 2024);
    const num2025 = await generateCaseNumber(orgId, "high_court", "criminal", 2025);
    
    // Should start from 001 for new year
    expect(num2025).toBe("HAC 001/2025");
  });
});
```

## Examples

### All Court Formats

```typescript
import { CASE_NUMBER_EXAMPLES } from "@/lib/utils/case-number";

console.log(CASE_NUMBER_EXAMPLES);
// {
//   high_court_criminal: "HAC 179/2024",
//   high_court_civil: "HBC 188/2023",
//   high_court_appeal: "HAA 19/2025",
//   court_of_appeal: "ABU 002/20",
//   magistrates: "707/21",
//   tribunal_agricultural: "C & ED 03/2025",
// }
```

### Creating Cases with Auto-Generated Numbers

```typescript
// 1. High Court Criminal Case
const criminalCase = await createCase({
  title: "State vs John Doe",
  courtLevel: "high_court",
  caseType: "criminal",
  filedDate: new Date("2025-11-15"),
  // caseNumber generated automatically: "HAC 001/2025"
});

// 2. Magistrates Court Case
const magCase = await createCase({
  title: "Minor Theft Case",
  courtLevel: "magistrates",
  filedDate: new Date("2025-11-15"),
  // caseNumber generated automatically: "1/25"
});

// 3. Appeal Case
const appeal = await createCase({
  title: "Appeal - State vs John Doe",
  courtLevel: "high_court",
  caseType: "appeal",
  filedDate: new Date("2025-11-15"),
  // caseNumber generated automatically: "HAA 01/2025"
});
```

## Best Practices

### DO

✅ Always use `generateCaseNumber()` for new cases
✅ Include the filed date year in generation
✅ Validate court level and type before generation
✅ Handle errors gracefully with user-friendly messages
✅ Test case number generation in your test suite

### DON'T

❌ Don't allow manual case number entry
❌ Don't skip case number generation
❌ Don't reuse case numbers across years
❌ Don't share sequences across different court levels
❌ Don't modify the format configuration without court approval

## Future Enhancements

### Planned Improvements

1. **Database Sequences**
   - Use PostgreSQL sequences for better concurrency
   - Eliminate race conditions completely
   - Improve performance

2. **Format Customization**
   - Allow organisations to customize formats
   - Store format config in database
   - UI for format configuration

3. **Number Reservation**
   - Reserve numbers before case creation
   - Release unused reservations
   - Prevent gaps in sequence

4. **Audit Trail**
   - Log all case number generations
   - Track who generated which numbers
   - Monitor for anomalies

5. **Migration Tools**
   - Import existing case numbers
   - Validate imported numbers
   - Set sequence starting points

## Related Documentation

- [Database Schema - Cases Table](03-database-schema.md#cases)
- [Case Management](07-case-management.md)
- [API Documentation - Create Case](05-api-documentation.md#create-case)
- [Fiji Court System Redesign](11-fiji-court-system-redesign.md)
