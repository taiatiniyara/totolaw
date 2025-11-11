# Fiji Court System - Implementation Summary

## What Was Done

Based on analysis of actual Fiji court file samples, the Totolaw system has been redesigned to support Fiji court procedures. This implementation maintains backward compatibility while adding comprehensive court-specific features.

## Key Files Modified/Created

### 1. Database Schema Updates

**Modified:**
- `/lib/drizzle/schema/db-schema.ts` - Enhanced cases, hearings, appeals tables; added court rooms, legal representatives, daily cause lists
- `/lib/drizzle/schema/auth-schema.ts` - Added judicial title and designation fields
- `/lib/drizzle/schema/organisation-schema.ts` - Added court hierarchy fields

**New Tables:**
- `court_rooms` - Physical courtroom tracking
- `legal_representatives` - Lawyers and law firms directory
- `daily_cause_lists` - Court schedule management

### 2. Migration

**Created:**
- `/migrations/004_fiji_court_system_support.sql` - Complete migration script with data transformation

**Features:**
- Backward compatible data migration
- Adds all new columns with sensible defaults
- Creates helper views for common queries
- Extensive comments for documentation

### 3. Documentation

**Created:**
- `/documentation/11-fiji-court-system-redesign.md` - Comprehensive redesign documentation
  - Analysis of court file samples
  - Detailed schema changes
  - Workflow examples
  - API changes
  - UI requirements

**This Document:** Implementation summary and quick reference

### 4. Utilities

**Created:**
- `/lib/utils/case-number.ts` - Case number generation utilities
  - Supports all Fiji court number formats
  - Auto-increments sequence numbers
  - Validates case numbers
  - Parsing and formatting functions

### 5. Seed Scripts

**Created:**
- `/scripts/seed-fiji-courts.ts` - Seed court hierarchy
  - Creates court organisations (Court of Appeal, High Court, Magistrates, Tribunals)
  - Seeds courtrooms
  - Populates legal representatives directory

## Court Hierarchy Created

```
Fiji Court System
├── Court of Appeal
├── High Court - Criminal Division
├── High Court - Civil Division
├── Suva Magistrates Court
├── Nadi Magistrates Court
├── Lautoka Magistrates Court
├── Labasa Magistrates Court
├── Nausori Magistrates Court
├── Agricultural Tribunal
└── Small Claims Tribunal
```

## Case Number Formats Supported

| Court | Format | Example |
|-------|--------|---------|
| High Court Criminal | HAC XXX/YYYY | HAC 179/2024 |
| High Court Civil | HBC XXX/YYYY | HBC 188/2023 |
| High Court Appeal | HAA XX/YYYY | HAA 19/2025 |
| Court of Appeal | ABU XXX/YY | ABU 002/20 |
| Magistrates | X+/YY | 707/21, 1314/25 |
| Agricultural Tribunal | C & ED XX/YYYY | C & ED 03/2025 |

## Hearing Action Types

Based on Fiji court cause lists:
- **MENTION** - Routine case management
- **HEARING** - Substantial hearing
- **TRIAL** - Full trial proceeding
- **CONTINUATION OF TRIAL** - Multi-day trial
- **VOIR DIRE HEARING** - Evidence admissibility
- **PRE-TRIAL CONFERENCE** - Pre-trial preparation
- **BAIL HEARING** - Bail consideration
- **RULING** - Decision delivery
- **FIRST CALL** - Initial appearance
- **SENTENCING** - Sentence delivery

## Enhanced Features

### Cases
✅ Court-specific case numbering (auto-generated)
✅ Court level and division tracking
✅ Multiple parties with legal representation
✅ Offences tracking for criminal cases
✅ Enhanced party structure (prosecution, defense, plaintiff, defendant, appellant, respondent)

### Hearings
✅ Action type classification
✅ Courtroom assignments
✅ Time slot management
✅ Bail consideration tracking
✅ Outcome and next action recording
✅ Minutes and notes

### Appeals
✅ Link to original lower court case
✅ Appeal case creation
✅ Grounds and decision tracking
✅ Appellant/respondent counsel tracking

### Court Management
✅ Courtroom inventory
✅ Legal representatives directory
✅ Daily cause list generation
✅ Judicial designation support

## Next Steps to Deploy

### 1. Run Migration
```bash
# Push schema changes
npm run db-push

# Or manually run migration
psql $DATABASE_URL < migrations/004_fiji_court_system_support.sql
```

### 2. Seed Court Data
```bash
# Run seed script
npx ts-node scripts/seed-fiji-courts.ts
```

### 3. Update Application Code

**Case Creation:**
```typescript
import { generateCaseNumber } from "@/lib/utils/case-number";

const caseNumber = await generateCaseNumber(
  organisationId,
  "high_court",
  "criminal",
  2025
); // Returns: "HAC 001/2025"

await db.insert(cases).values({
  id: generateUUID(),
  organisationId,
  caseNumber,
  courtLevel: "high_court",
  division: "criminal",
  parties: {
    prosecution: [{ name: "State", counsel: "DPP" }],
    defense: [{ name: "John Doe", counsel: "LEGAL AID" }]
  },
  offences: ["Rape", "Assault"],
  // ... other fields
});
```

**Hearing Scheduling:**
```typescript
await db.insert(hearings).values({
  id: generateUUID(),
  caseId,
  organisationId,
  scheduledDate: new Date("2025-11-11"),
  scheduledTime: "9:30AM",
  actionType: "MENTION",
  status: "scheduled",
  courtRoomId,
  judgeId,
  bailConsidered: false,
});
```

### 4. Build UI Components

**Required New Pages:**
1. Court room management (`/dashboard/settings/courtrooms`)
2. Legal representatives directory (`/dashboard/settings/legal-representatives`)
3. Daily cause list generator (`/dashboard/hearings/cause-lists`)
4. Enhanced case form with new fields
5. Enhanced hearing scheduler with action types

**Components to Update:**
- Case creation form
- Hearing scheduling form
- Case detail view
- Calendar/schedule views

### 5. Generate Daily Cause Lists

**Workflow:**
```typescript
// 1. Create cause list
const causeList = await createDailyCauseList({
  listDate: new Date("2025-11-11"),
  courtLevel: "high_court",
  presidingOfficerId: judgeId,
  presidingOfficerTitle: "HON. MR. JUSTICE GOUNDAR",
  courtRoomId,
  sessionTime: "9:30AM",
});

// 2. Link hearings to cause list
// 3. Generate PDF in Fiji format
// 4. Publish
```

## Testing Checklist

- [ ] Migration runs successfully
- [ ] Seed script creates court hierarchy
- [ ] Case numbers generate correctly for each court type
- [ ] Case numbers auto-increment within year
- [ ] Hearings can be scheduled with action types
- [ ] Court rooms can be assigned to hearings
- [ ] Legal representatives can be tracked
- [ ] Appeals link to original cases
- [ ] Daily cause lists can be created
- [ ] Queries/views return correct data

## Backward Compatibility

✅ All existing cases automatically migrated
✅ Old fields preserved where possible
✅ Default values set for new required fields
✅ Existing workflows continue to work
✅ Gradual adoption of new features possible

## Performance Considerations

**Indexes Added:**
- Case number (for quick lookup)
- Court level (for filtering)
- Scheduled date (for calendar views)
- Action type (for cause list generation)
- All foreign keys indexed

**Views Created:**
- `v_upcoming_hearings` - Pre-joined hearing data
- `v_active_cases` - Cases with next hearing dates

## Known Limitations

1. **Case number uniqueness** - Enforced at application level, not database constraint
2. **Courtroom conflicts** - Checked in application logic, not database constraints
3. **PDF generation** - Needs separate implementation for cause list PDFs
4. **Multi-language** - Currently English only, needs i18n for Fijian/Hindi

## Future Enhancements

**Phase 2:**
- Electronic filing system
- Public access portal for cause lists
- SMS/email notifications
- Court analytics dashboard
- Mobile app for lawyers

**Phase 3:**
- Integration with government systems
- Automated case law research
- AI-powered transcription
- Video conferencing integration

## Support & References

**Documentation:**
- Full redesign doc: `/documentation/11-fiji-court-system-redesign.md`
- Database schema: `/documentation/03-database-schema.md`
- Case management: `/documentation/07-case-management.md`

**Code Examples:**
- Case number generation: `/lib/utils/case-number.ts`
- Seed script: `/scripts/seed-fiji-courts.ts`
- Schema definitions: `/lib/drizzle/schema/db-schema.ts`

**Court File Samples:**
- Reference files in `/court-file-samples/` directory
- Daily cause lists show actual format requirements
- Ruling document shows case structure

## Questions or Issues?

If you encounter any issues:
1. Check migration ran successfully
2. Verify seed data was created
3. Check indexes were created
4. Review error logs
5. Consult documentation files

---

**Implementation Date:** November 11, 2025  
**Status:** ✅ Schema Ready - Needs UI Implementation  
**Backward Compatible:** Yes  
**Breaking Changes:** None
