# Fiji Court System Support - Schema Redesign

## Overview

This document describes the schema redesign to support Fiji court system procedures based on analysis of actual court file samples. The redesign maintains backward compatibility while adding new features specific to how courts operate in Fiji.

## Key Findings from Court Files Analysis

### Court Hierarchy
1. **Court of Appeal** - Highest court (ABU case numbers)
2. **High Court** - Criminal (HAC) and Civil (HBC) divisions
3. **Magistrates' Courts** - By location (Suva, Nadi, Lautoka, Nausori)
4. **Specialized Tribunals** - Agricultural Tribunal, Small Claims Tribunal (SCT)

### Hearing Types/Actions
From the daily cause lists, we identified these standard hearing actions:
- **MENTION** - Routine case management hearing
- **HEARING** - Substantial hearing on matters
- **TRIAL** - Full trial proceeding
- **CONTINUATION OF TRIAL** - Multi-day trial continuation
- **VOIR DIRE HEARING** - Admissibility of evidence hearing
- **PRE-TRIAL CONFERENCE & SUMMARY OF FACTS** - Pre-trial preparation
- **MENTION & BAIL HEARING** - Combined mention and bail consideration
- **RULING** - Judge delivering ruling/decision
- **FIRST CALL** - Initial appearance
- **SECURITY FOR COST** - Appeal-related cost security

### Case Numbering System
Different courts use different case number formats:
- High Court Criminal: `HAC 179/2024`
- High Court Appeal: `HAA 19/2025`
- High Court Civil: `HBC 188/2023`
- Court of Appeal: `ABU 002/20`
- Magistrates: `707/21`, `1314/25`
- Tribunal: `C & ED 03/2025`

### Court Session Structure
- Daily cause lists organized by Judge/Magistrate
- Specific courtroom assignments (e.g., "HIGH COURT ROOM NO. 2")
- Time slots: 9:00AM, 9:30AM, 10:00AM, 11:00AM, etc.
- Cases grouped by action type within each session
- Legal representation clearly noted (Legal Aid, specific law firms)

## Schema Changes

### 1. User Table Extensions

**New Columns:**
```typescript
judicialTitle: text        // "Justice", "Resident Magistrate", "Magistrate"
designation: text          // "Judge", "Magistrate", "Registrar", "Prosecutor"
```

**Purpose:**
- Track judicial officers and their proper titles
- Support proper formatting in cause lists (e.g., "THE HON. MR. JUSTICE GOUNDAR")
- Differentiate between judges, magistrates, and other court personnel

### 2. Organisation Table Extensions

**New Columns:**
```typescript
courtLevel: varchar(50)    // "court_of_appeal", "high_court", "magistrates", "tribunal"
courtType: varchar(50)     // "criminal", "civil", "family", "agricultural"
jurisdiction: text         // Geographic or subject matter jurisdiction
```

**Purpose:**
- Support court hierarchy within organisation structure
- Enable proper case routing to appropriate court level
- Track jurisdiction boundaries

**Example Organisations:**
```javascript
{
  name: "Fiji Court of Appeal",
  code: "FJ-COA",
  type: "court",
  courtLevel: "court_of_appeal"
}

{
  name: "Suva High Court - Criminal Division",
  code: "FJ-HC-SUVA-CRIM",
  type: "court",
  courtLevel: "high_court",
  courtType: "criminal",
  parentId: "[FijiCourtSystemId]"
}

{
  name: "Nadi Magistrates Court",
  code: "FJ-MC-NADI",
  type: "court",
  courtLevel: "magistrates",
  jurisdiction: "Nadi District"
}
```

### 3. Cases Table Redesign

**Enhanced Columns:**
```typescript
caseNumber: varchar(50)    // e.g., "HAC 179/2024", "ABU 002/20"
courtLevel: varchar(50)    // Court level handling this case
division: varchar(50)      // "criminal", "civil" for high court
parties: json              // Complex party structure with counsel
assignedJudgeId: text      // Presiding judge
assignedClerkId: text      // Assigned clerk
filedDate: timestamp       // When case was filed
firstHearingDate: timestamp
closedDate: timestamp
offences: json            // Array of offences for criminal cases
notes: text
updatedAt: timestamp
```

**Parties Structure:**
The `parties` JSON field supports all case types:

```typescript
{
  // Criminal cases
  prosecution: [
    { name: "DPP", counsel: null },
    { name: "State", counsel: null }
  ],
  defense: [
    { 
      name: "Vilivo Ciri", 
      counsel: "LEGAL AID" 
    },
    { 
      name: "Abdul Imraan", 
      counsel: "TIRATH SHARMA LAWYERS" 
    }
  ],
  
  // Civil cases
  plaintiff: [
    { name: "Ramesh Kumar", counsel: "MISHRA PRAKASH & ASSOCIATES" }
  ],
  defendant: [
    { name: "Anjila Wati", counsel: "LEGAL AID COMMISSION" }
  ],
  
  // Appeal cases
  appellant: [
    { name: "Sarendra Singh", counsel: "SEN LAWYERS" }
  ],
  respondent: [
    { name: "I-TAUKEI LAND TRUST BOARD", counsel: "TLTB LEGAL" }
  ]
}
```

### 4. New Table: Court Rooms

**Purpose:** Track physical courtrooms and their assignments

```typescript
{
  id: text
  organisationId: text      // Which court/building
  name: varchar(100)        // "HIGH COURT ROOM NO. 2"
  code: varchar(20)         // "HC-2", "MC-1"
  courtLevel: varchar(50)   // high_court, magistrates
  location: text            // Building/floor details
  capacity: integer
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Example Records:**
```javascript
{
  name: "HIGH COURT ROOM NO. 2",
  code: "HC-2",
  courtLevel: "high_court",
  organisationId: "[SuvaHighCourtId]",
  capacity: 50
}

{
  name: "COURT NO. 1",
  code: "MC-1",
  courtLevel: "magistrates",
  organisationId: "[NadiMagistratesId]",
  capacity: 30
}
```

### 5. Hearings Table Enhancement

**Enhanced Structure:**
```typescript
{
  // Schedule
  scheduledDate: timestamp   // Date of hearing
  scheduledTime: varchar(10) // "9:30AM", "10:00AM"
  estimatedDuration: integer // Minutes
  
  // Location
  courtRoomId: text          // Reference to courtroom
  location: text             // Fallback text description
  
  // Action Type - Key Addition
  actionType: varchar(50)    // MENTION, HEARING, TRIAL, etc.
  status: varchar(50)        // scheduled, in_progress, completed, adjourned
  
  // Personnel
  judgeId: text
  magistrateId: text         // For magistrates courts
  clerkId: text
  
  // Outcomes
  outcome: text
  nextActionRequired: text
  
  // Bail-related
  bailConsidered: boolean
  bailDecision: varchar(50)  // granted, denied, continued
  bailAmount: integer
  bailConditions: text
  
  // Documentation
  minutes: text
  notes: text
  
  // Audit
  createdBy: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Supported Action Types:**
- `MENTION` - Routine case management
- `HEARING` - Substantial hearing
- `TRIAL` - Full trial
- `CONTINUATION OF TRIAL` - Multi-day trial
- `VOIR DIRE HEARING` - Evidence admissibility
- `PRE-TRIAL CONFERENCE` - Pre-trial preparation
- `BAIL HEARING` - Bail consideration
- `RULING` - Decision delivery
- `FIRST CALL` - Initial appearance
- `SENTENCING` - Sentence delivery

### 6. Appeals Table Redesign

**Enhanced Structure:**
```typescript
{
  originalCaseId: text       // Link to lower court case
  appealCaseId: text         // New appeal case (if created)
  appealType: varchar(50)    // criminal_appeal, civil_appeal, bail_application
  grounds: text              // Grounds for appeal
  status: varchar(50)        // pending, admitted, dismissed, allowed, withdrawn
  
  // Parties
  appellantId: text
  appellantCounsel: text
  respondentCounsel: text
  
  // Dates
  filedDate: timestamp
  hearingDate: timestamp
  decisionDate: timestamp
  
  // Outcome
  decision: text
  orders: text
  
  // Audit
  filedBy: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Purpose:**
- Better tracking of appeal relationships to original cases
- Support security for cost hearings
- Track appeal outcomes and orders

### 7. New Table: Legal Representatives

**Purpose:** Manage lawyers, law firms, and legal aid

```typescript
{
  id: text
  organisationId: text
  
  // Representative details
  name: text                 // Lawyer or firm name
  type: varchar(50)          // "individual", "law_firm", "legal_aid"
  firmName: text             // If individual, their firm
  
  // Contact
  email: text
  phone: text
  address: text
  
  // Specialization
  practiceAreas: json        // ["criminal", "civil", "family"]
  
  // System linkage
  userId: text               // If they have system account
  
  // Status
  isActive: boolean
  notes: text
  
  // Audit
  createdBy: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Common Entries:**
- LEGAL AID COMMISSION
- DPP (Director of Public Prosecutions)
- Individual law firms (MISHRA PRAKASH & ASSOCIATES, SEN LAWYERS, etc.)
- Individual lawyers

### 8. New Table: Daily Cause Lists

**Purpose:** Generate and manage daily court schedules/cause lists

```typescript
{
  id: text
  organisationId: text
  
  // Schedule
  listDate: timestamp        // Date for this cause list
  courtLevel: varchar(50)    // high_court, magistrates, etc.
  
  // Presiding officer
  presidingOfficerId: text   // Judge/Magistrate user ID
  presidingOfficerTitle: varchar(100) // "HON. MR. JUSTICE GOUNDAR"
  
  // Location
  courtRoomId: text
  sessionTime: varchar(20)   // "9:30AM"
  
  // Status
  status: varchar(50)        // draft, published, completed
  publishedAt: timestamp
  
  // Metadata
  notes: text
  
  // Audit
  createdBy: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Workflow:**
1. Court administrator creates daily cause list for a date
2. Assigns presiding officer and courtroom
3. Links hearings to the cause list
4. Publishes cause list (makes it visible)
5. Cause list generates formatted PDF matching Fiji format

## Database Views

### v_upcoming_hearings
Combines hearings with case and judge details for easy querying:

```sql
SELECT 
  h.id AS hearing_id,
  h.scheduled_date,
  h.scheduled_time,
  h.action_type,
  h.status,
  c.case_number,
  c.title AS case_title,
  j.name AS judge_name,
  j.judicial_title,
  cr.name AS courtroom_name
FROM hearings h
JOIN cases c ON h.case_id = c.id
LEFT JOIN user j ON h.judge_id = j.id
LEFT JOIN court_rooms cr ON h.court_room_id = cr.id
WHERE h.status IN ('scheduled', 'in_progress')
  AND h.scheduled_date >= CURRENT_DATE
```

### v_active_cases
Shows active cases with their next hearing date:

```sql
SELECT 
  c.id,
  c.case_number,
  c.title,
  c.court_level,
  c.status,
  j.name AS assigned_judge_name,
  (SELECT scheduled_date 
   FROM hearings 
   WHERE case_id = c.id 
     AND status = 'scheduled'
     AND scheduled_date >= CURRENT_DATE
   ORDER BY scheduled_date 
   LIMIT 1) AS next_hearing_date
FROM cases c
LEFT JOIN user j ON c.assigned_judge_id = j.id
WHERE c.status IN ('open', 'active')
```

## Workflow Changes

### 1. Case Filing Workflow

**Before:**
```javascript
createCase({
  title: "State vs John Doe",
  type: "criminal",
  status: "open"
})
```

**After:**
```javascript
createCase({
  caseNumber: generateCaseNumber("HAC", 2025), // "HAC 001/2025"
  title: "State vs Vilivo Ciri",
  type: "criminal",
  courtLevel: "high_court",
  division: "criminal",
  status: "open",
  parties: {
    prosecution: [{ name: "State", counsel: "DPP" }],
    defense: [{ name: "Vilivo Ciri", counsel: "LEGAL AID" }]
  },
  offences: ["Rape", "Assault"],
  filedDate: new Date(),
  organisationId: highCourtId
})
```

### 2. Hearing Scheduling Workflow

**Before:**
```javascript
scheduleHearing({
  caseId: "...",
  date: new Date(),
  location: "Courtroom 1",
  judgeId: "..."
})
```

**After:**
```javascript
scheduleHearing({
  caseId: "...",
  scheduledDate: new Date("2025-11-11"),
  scheduledTime: "9:30AM",
  estimatedDuration: 60,
  courtRoomId: "...",
  actionType: "MENTION",
  status: "scheduled",
  judgeId: "...",
  bailConsidered: false
})
```

### 3. Daily Cause List Generation Workflow

**New Feature:**
```javascript
// 1. Create cause list for a date
const causeList = createDailyCauseList({
  listDate: new Date("2025-11-11"),
  courtLevel: "high_court",
  presidingOfficerId: judgeId,
  presidingOfficerTitle: "HON. MR. JUSTICE GOUNDAR",
  courtRoomId: "...",
  sessionTime: "9:30AM",
  status: "draft"
});

// 2. Query hearings for that date/judge/courtroom
const hearings = getHearingsByCriteria({
  date: new Date("2025-11-11"),
  judgeId: judgeId,
  courtRoomId: "..."
});

// 3. Generate PDF in Fiji format
const pdf = generateCauseListPDF(causeList, hearings);

// 4. Publish
publishCauseList(causeList.id);
```

### 4. Appeal Filing Workflow

**New Enhanced Workflow:**
```javascript
fileAppeal({
  originalCaseId: "...",          // HAC 179/2024
  appealType: "criminal_appeal",
  grounds: "Errors in law and fact...",
  status: "pending",
  appellantId: "...",
  appellantCounsel: "SEN LAWYERS",
  filedDate: new Date(),
  // Creates new appeal case: HAA 001/2025
})
```

## Case Number Generation

### Function: generateCaseNumber()

```typescript
function generateCaseNumber(
  courtLevel: string,
  courtType: string,
  year: number,
  organisationId: string
): string {
  // Get sequence number for this org/year/type
  const sequence = getNextSequenceNumber(organisationId, year, courtType);
  
  const prefix = getCasePrefix(courtLevel, courtType);
  const shortYear = year.toString().slice(-2);
  
  return `${prefix} ${sequence}/${shortYear}`;
}

function getCasePrefix(courtLevel: string, courtType: string): string {
  const prefixes = {
    "high_court_criminal": "HAC",
    "high_court_civil": "HBC",
    "high_court_appeal": "HAA",
    "court_of_appeal": "ABU",
    "tribunal_agricultural": "C & ED"
  };
  
  return prefixes[`${courtLevel}_${courtType}`] || "CASE";
}
```

**Examples:**
- High Court Criminal: `HAC 179/2024`
- High Court Civil: `HBC 188/2023`
- High Court Appeal: `HAA 19/2025`
- Court of Appeal: `ABU 002/20`
- Agricultural Tribunal: `C & ED 03/2025`

## Migration Path

### Step 1: Run Migration
```bash
npm run db-push
# Or manually:
psql $DATABASE_URL < migrations/004_fiji_court_system_support.sql
```

### Step 2: Seed Court Hierarchy
```typescript
// Seed court organisations
await seedCourtOrganisations();

// Creates:
// - Fiji Court System (parent)
// - Court of Appeal
// - High Court - Criminal Division
// - High Court - Civil Division
// - Magistrates Courts (Suva, Nadi, Lautoka, etc.)
// - Tribunals
```

### Step 3: Seed Court Rooms
```typescript
await seedCourtRooms();

// Creates courtrooms for each court location
```

### Step 4: Seed Legal Representatives
```typescript
await seedCommonLegalRepresentatives();

// Creates:
// - DPP
// - Legal Aid Commission
// - Common law firms
```

### Step 5: Update Existing Cases
```typescript
// Migrate existing cases to new format
await migrateCasesToNewFormat();
```

## API Changes

### New Endpoints

```typescript
// Court Rooms
GET    /api/courtrooms
POST   /api/courtrooms
GET    /api/courtrooms/:id
PATCH  /api/courtrooms/:id

// Legal Representatives
GET    /api/legal-representatives
POST   /api/legal-representatives
GET    /api/legal-representatives/:id
PATCH  /api/legal-representatives/:id

// Daily Cause Lists
GET    /api/cause-lists
POST   /api/cause-lists
GET    /api/cause-lists/:id
PATCH  /api/cause-lists/:id
GET    /api/cause-lists/:id/pdf          // Generate PDF
POST   /api/cause-lists/:id/publish      // Publish list

// Enhanced Hearing Endpoints
GET    /api/hearings?actionType=MENTION
GET    /api/hearings?date=2025-11-11&judgeId=...
```

### Updated Endpoints

```typescript
// Cases - Enhanced with new fields
POST   /api/cases
{
  caseNumber: "HAC 001/2025",
  courtLevel: "high_court",
  division: "criminal",
  parties: { ... },
  offences: ["..."],
  assignedJudgeId: "..."
}

// Hearings - Enhanced with action types
POST   /api/hearings
{
  scheduledDate: "2025-11-11",
  scheduledTime: "9:30AM",
  actionType: "MENTION",
  courtRoomId: "...",
  bailConsidered: true
}
```

## UI Changes

### New Pages/Components

1. **Court Room Management** - `/dashboard/settings/courtrooms`
   - List courtrooms
   - Add/edit courtrooms
   - Assign to court locations

2. **Legal Representatives** - `/dashboard/settings/legal-representatives`
   - Directory of lawyers and firms
   - Track practice areas
   - Link to user accounts

3. **Daily Cause List Generator** - `/dashboard/hearings/cause-lists`
   - Create daily cause lists
   - Assign hearings to lists
   - Generate PDF in Fiji format
   - Publish/distribute

4. **Enhanced Hearing Scheduler** - `/dashboard/hearings/schedule`
   - Select action type (MENTION, TRIAL, etc.)
   - Choose courtroom from list
   - Set time slots
   - Consider bail options

5. **Appeal Management** - `/dashboard/appeals`
   - Link to original case
   - Track appeal status
   - Manage appellant/respondent counsel
   - Record decisions and orders

### Updated Components

1. **Case Form** - Add fields for:
   - Case number (auto-generated)
   - Court level selection
   - Division (if high court)
   - Multiple parties with counsel
   - Offences (for criminal)

2. **Hearing Form** - Add fields for:
   - Action type dropdown
   - Courtroom selection
   - Time slot selection
   - Bail consideration fields

3. **Case Detail Page** - Show:
   - Formatted case number
   - All parties with counsel
   - Court level and division
   - Offences list
   - Appeal status

## Reports & Exports

### New Reports

1. **Daily Cause List PDF** - Matches Fiji court format
   - Header with court name and date
   - Presiding officer title
   - Courtroom and time
   - Cases grouped by action type
   - Parties and counsel clearly shown

2. **Court Statistics Dashboard**
   - Cases by court level
   - Hearings by action type
   - Judge/magistrate workload
   - Pending vs completed by court

3. **Appeal Tracking Report**
   - Appeals by status
   - Link to original cases
   - Time from filing to decision
   - Success rates

## Testing Considerations

### Test Data

Create realistic test data matching Fiji patterns:

```typescript
// Test case numbers
const testCases = [
  { number: "HAC 179/2024", type: "high_court_criminal" },
  { number: "HBC 188/2023", type: "high_court_civil" },
  { number: "ABU 002/20", type: "court_of_appeal" }
];

// Test parties
const testParties = {
  prosecution: [{ name: "State", counsel: "DPP" }],
  defense: [{ name: "John Doe", counsel: "LEGAL AID" }]
};

// Test hearing actions
const testActions = [
  "MENTION",
  "TRIAL",
  "CONTINUATION OF TRIAL",
  "RULING"
];
```

### Integration Tests

1. Case creation with proper numbering
2. Hearing scheduling with court rooms
3. Daily cause list generation
4. Appeal filing linked to original case
5. PDF generation matching Fiji format

## Future Enhancements

### Phase 2 Considerations

1. **Electronic Filing System**
   - Online case submission
   - Document uploads
   - Filing fee calculation

2. **Public Access Portal**
   - Published cause lists
   - Case search
   - Hearing results

3. **Notification System**
   - SMS/email reminders for hearings
   - Cause list publication alerts
   - Ruling notifications

4. **Court Analytics**
   - Case backlog analysis
   - Judge performance metrics
   - Court utilization rates

5. **Mobile App**
   - Cause list viewer
   - Hearing reminders
   - Case status lookup

## Summary

This redesign comprehensively adapts the Totolaw system to support Fiji court procedures while maintaining backward compatibility. Key improvements include:

✅ Court hierarchy support (Appeal, High Court, Magistrates, Tribunals)
✅ Proper case numbering per court type
✅ Hearing action types matching Fiji practices
✅ Legal representative tracking
✅ Daily cause list generation
✅ Enhanced party and counsel tracking
✅ Courtroom management
✅ Appeal linkage to original cases
✅ Bail tracking
✅ Judicial designation support

The system is now ready to accurately model and support the complete workflow of Fiji courts from case filing through appeals.
