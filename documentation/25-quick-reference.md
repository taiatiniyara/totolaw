# Quick Reference Guide

## Overview

This quick reference guide provides fast access to common tasks, keyboard shortcuts, and workflows in Totolaw. Designed for daily users who need quick reminders.

---

## Table of Contents

- [Common Tasks](#common-tasks)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Case Management](#case-management)
- [Hearing Management](#hearing-management)
- [Evidence & Documents](#evidence--documents)
- [Daily Workflows](#daily-workflows)
- [Tips & Tricks](#tips--tricks)

---

## Common Tasks

### Creating Records

| Task | Steps |
|------|-------|
| **New Case** | Dashboard → Cases → "Create Case" → Fill form → Submit |
| **Schedule Hearing** | Case Details → "Schedule Hearing" → Select date/time → Assign courtroom |
| **Upload Evidence** | Case Details → Evidence → "Upload" → Select file → Add description |
| **Add Legal Rep** | Dashboard → Settings → Legal Representatives → "Add Representative" |

### Quick Actions

| Action | Shortcut |
|--------|----------|
| Global Search | Click search bar (top) or press `/` |
| New Case | Dashboard → Cases → "Create Case" |
| Today's Hearings | Dashboard → Calendar → Today's date |
| View Cause List | Dashboard → Cause Lists → Select date |

### Navigation

```
Dashboard (Home)
  ├── Cases - View and manage all cases
  ├── Hearings - Schedule and view hearings
  ├── Calendar - Visual hearing schedule
  ├── Evidence - Browse all evidence files
  ├── Documents - Document management
  ├── Search - Global search
  ├── Settings
  │     ├── Courtrooms - Manage courtrooms
  │     ├── Legal Representatives - Rep directory
  │     └── Users - User management
  └── System Admin (Admin only)
        └── Organisations - Manage court hierarchy
```

---

## Keyboard Shortcuts

### Global Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Esc` | Close dialog/modal |
| `Ctrl + K` | Quick actions menu |

### Transcription Editor

| Key | Action |
|-----|--------|
| `Ctrl + B` | Bold text |
| `Ctrl + I` | Italic text |
| `Ctrl + U` | Underline text |
| `Ctrl + S` | Manual save (auto-saves every 5 seconds) |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Tab` | Indent |
| `Shift + Tab` | Outdent |

### Form Navigation

| Key | Action |
|-----|--------|
| `Tab` | Next field |
| `Shift + Tab` | Previous field |
| `Enter` | Submit form (when on button) |
| `Esc` | Cancel/Go back |

---

## Case Management

### Creating a Case

**Quick Steps:**
1. Dashboard → Cases → "Create Case"
2. Select **Court Level** (High Court, Magistrates, etc.)
3. Select **Case Type** (Criminal, Civil, etc.)
4. Fill in **Case Title**
5. Add **Parties** (Prosecution/Defence or Plaintiff/Defendant)
6. Enter **Filed Date**
7. Submit → Case number auto-generated

**Example Criminal Case:**
```
Court Level: High Court
Case Type: Criminal
Title: State v. John Doe - Armed Robbery
Parties:
  - Prosecution: Director of Public Prosecutions
  - Defence: John Doe
Offences: Armed Robbery, Theft
Filed Date: 15 Nov 2024
Generated Case Number: HAC 179/2024
```

### Case Statuses

| Status | Meaning | Next Steps |
|--------|---------|------------|
| **Open** | Newly filed | Assign judge, schedule first hearing |
| **Active** | Ongoing proceedings | Continue hearings, manage evidence |
| **Closed** | Case concluded | Archive, no further action |
| **Appealed** | Under appeal | Track appeal case separately |

### Common Case Actions

- **Assign Judge**: Case Details → "Assign Judge" → Select officer
- **Add Parties**: Case Details → Parties section → "Add Party"
- **Add Offences**: Case Details → Offences → "Add Offence"
- **View History**: Case Details → Activity tab

---

## Hearing Management

### Scheduling a Hearing

**Quick Steps:**
1. Case Details → "Schedule Hearing"
2. Select **Date & Time**
3. Choose **Action Type** (MENTION, TRIAL, etc.)
4. Set **Duration** (default 60 minutes)
5. Assign **Courtroom** (optional but recommended)
6. Assign **Judge/Magistrate**
7. Add any **Special Requirements**
8. Submit

### Hearing Action Types

| Type | Duration | Purpose |
|------|----------|---------|
| **MENTION** | 15-30 min | Routine case management |
| **HEARING** | 60 min | General hearing |
| **TRIAL** | 4-8 hours | Full trial proceeding |
| **BAIL HEARING** | 30-60 min | Bail application |
| **SENTENCING** | 30-60 min | Sentence delivery |
| **RULING** | 30 min | Judgment delivery |
| **PRE-TRIAL CONFERENCE** | 30-60 min | Pre-trial preparation |

### Recording Hearing Outcomes

1. Hearing Details → "Record Outcome"
2. Enter **Outcome** summary
3. Add any **Orders** issued
4. Record **Bail Decision** (if applicable)
5. Set **Next Hearing Date** (if needed)
6. Link **Transcript** (if available)
7. Update status to "COMPLETED"

---

## Evidence & Documents

### Uploading Evidence

**Quick Steps:**
1. Case Details → Evidence → "Upload Evidence"
2. Select **File** (max 50MB)
3. Add **Description** (important!)
4. Link to **Hearing** (optional)
5. Submit

**Supported Files:**
- Documents: PDF, Word, Excel, TXT
- Images: JPG, PNG, GIF
- Audio: MP3, WAV
- Video: MP4, MOV

### File Naming Best Practices

✅ **Good:**
- `Police_Report_HAC179_2024.pdf`
- `Witness_Statement_John_Doe.pdf`
- `Medical_Report_15Nov2024.pdf`

❌ **Bad:**
- `document.pdf`
- `file1.pdf`
- `untitled.jpg`

### Viewing Evidence

- **By Case**: Case Details → Evidence tab
- **All Evidence**: Dashboard → Evidence
- **Search**: Dashboard → Search → Enter filename

---

## Daily Workflows

### Morning Routine (Court Clerk)

1. **Check Today's Hearings**
   - Dashboard → Calendar → Today
   - Review scheduled hearings

2. **Generate Cause List**
   - Dashboard → Cause Lists → Create for Today
   - Review and publish

3. **Prepare Courtrooms**
   - Verify courtroom assignments
   - Check for conflicts

4. **Print Cause List**
   - Cause List → "Export PDF"
   - Print and distribute

### During Hearing (Court Clerk)

1. **Mark Hearing as In Progress**
   - Hearing Details → Update Status

2. **Take Notes**
   - Use Notes section for real-time notes

3. **Upload Evidence**
   - If evidence presented → Upload immediately

4. **Record Attendance**
   - Note parties present

### After Hearing (Court Clerk)

1. **Update Hearing Status**
   - Mark as "COMPLETED"

2. **Record Outcome**
   - Enter outcome summary
   - Add any orders

3. **Schedule Next Hearing** (if needed)
   - Set next hearing date

4. **Upload Transcript** (if available)
   - Link transcript to hearing

### End of Day

1. **Review Completed Hearings**
   - Ensure all outcomes recorded

2. **Upload Pending Documents**
   - Submit any pending evidence/documents

3. **Schedule Tomorrow's Hearings**
   - Review and confirm tomorrow's calendar

---

## Calendar Usage

### Views

| View | Purpose |
|------|---------|
| **Month** | Overview of hearings |
| **Week** | Detailed weekly schedule |
| **Day** | Hour-by-hour breakdown |

### Filtering

- **By Judge**: Select judge from dropdown
- **By Courtroom**: Select courtroom
- **By Action Type**: Filter by hearing type

### Color Coding

- 🔴 **Red** - TRIAL (important/long)
- 🔵 **Blue** - MENTION (routine)
- 🟣 **Purple** - SENTENCING (significant)
- ⚫ **Gray** - Other hearings

---

## Legal Representatives

### Adding a Representative

1. Dashboard → Settings → Legal Representatives
2. "Add Representative"
3. Enter:
   - Full Name
   - Firm Name
   - Email
   - Phone
   - Practice Areas
   - Bar Registration Number
4. Submit

### Linking to Case

1. Case Details → Legal Representatives
2. "Add Representative"
3. Select from directory
4. Specify role (Prosecution Counsel, Defence Counsel, etc.)

---

## Daily Cause Lists

### Creating a Cause List

1. Dashboard → Cause Lists
2. "Create Cause List"
3. Select:
   - Date
   - Court Level
   - Judge (optional)
   - Courtroom (optional)
4. Review auto-populated hearings
5. Publish

### Exporting

- **PDF**: Click "Export PDF" → Print/Save
- **Print**: Click "Print" → Print dialog

---

## Search Tips

### Search Syntax

| Query | Finds |
|-------|-------|
| `HAC 179` | Cases with case number containing "HAC 179" |
| `robbery` | Cases/evidence with "robbery" in title/description |
| `trial` | Hearings with "trial" action type |
| `court room 1` | Hearings in Court Room 1 |

### Advanced Search

1. Dashboard → Search
2. Use filters:
   - Case Type
   - Status
   - Date Range
   - Court Level

---

## Tips & Tricks

### Productivity Tips

✅ **Use Descriptions** - Always add descriptions to evidence for easy searching

✅ **Link to Hearings** - Link evidence to specific hearings for context

✅ **Consistent Naming** - Use consistent file naming conventions

✅ **Regular Updates** - Update case status regularly

✅ **Calendar Filters** - Use calendar filters to focus on your hearings

### Common Mistakes to Avoid

❌ Don't skip case number generation - let system auto-generate

❌ Don't forget to mark hearings as completed

❌ Don't upload evidence without descriptions

❌ Don't schedule hearings without checking courtroom availability

❌ Don't forget to link transcripts to hearings

### Time-Saving Features

⚡ **Quick Search** - Press `/` to instantly search

⚡ **Recent Cases** - Dashboard shows recent cases

⚡ **Calendar View** - Quickly see all hearings at a glance

⚡ **Cause List Auto-Generation** - Automatically populates from hearings

⚡ **Auto-Save Transcriptions** - Saves every 5 seconds

---

## Common Questions

### Q: How do I change a case number?

A: Case numbers are auto-generated and cannot be changed. They follow Fiji court system formats (HAC, HBC, etc.).

### Q: Can I reschedule a hearing?

A: Yes. Go to Hearing Details → Edit → Update date/time. Check courtroom availability first.

### Q: What if I upload the wrong evidence file?

A: Delete the file (Hearing Details → Evidence → Delete) and upload the correct one.

### Q: How do I assign multiple judges to a case?

A: You can only assign one primary judge. For multiple judges, use the Notes field to mention others.

### Q: Can I bulk upload evidence?

A: Not currently. Upload files one at a time with proper descriptions.

### Q: Where do I find transcripts?

A: Case Details → Transcripts tab, or Dashboard → Search → Enter case number

---

## Quick Command Reference

### URLs

| Page | URL |
|------|-----|
| Dashboard | `/dashboard` |
| Cases | `/dashboard/cases` |
| New Case | `/dashboard/cases/new` |
| Hearings | `/dashboard/hearings` |
| Calendar | `/dashboard/calendar` |
| Search | `/dashboard/search` |
| Evidence | `/dashboard/evidence` |
| Settings | `/dashboard/settings` |

### Status Options

**Case Status:**
- `open` - Newly filed
- `active` - Ongoing
- `closed` - Concluded
- `appealed` - Under appeal

**Hearing Status:**
- `SCHEDULED` - Future hearing
- `IN_PROGRESS` - Currently happening
- `COMPLETED` - Finished
- `CANCELLED` - Cancelled
- `POSTPONED` - Rescheduled

---

## Getting Help

### In-App Help

- **Help Icon** (?) - Context-sensitive help on each page
- **Dashboard → Help** - Access full help documentation

### Documentation

- **User Guides** - `/docs/getting-started`
- **FAQ** - `/docs/faq`
- **API Docs** - For developers

### Support

- **Email**: support@totolaw.com
- **System Admin**: Contact your organisation's system administrator

---

## Version Information

This quick reference is for **Totolaw v1.0** with Fiji Court System features.

Last Updated: November 2024

---

## Related Documentation

- [Getting Started Guide](getting-started/page.md)
- [Case Management](07-case-management.md)
- [Hearing Management](19-hearing-management.md)
- [Evidence Management](22-evidence-management.md)
- [Transcription System](14-transcription-system.md)
- [FAQ](faq/page.md)
