# Fiji Court System - Schema Diagram

## Court Hierarchy Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      Fiji Court System                           │
│                     (Root Organisation)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────┬─────────────────┐
         │                 │                  │                 │
         ▼                 ▼                  ▼                 ▼
┌────────────────┐ ┌──────────────┐ ┌─────────────────┐ ┌──────────────┐
│ Court of Appeal│ │  High Court  │ │   Magistrates   │ │  Tribunals   │
│   (ABU XXX/YY) │ │              │ │                 │ │              │
└────────────────┘ └──────┬───────┘ └────────┬────────┘ └──────┬───────┘
                          │                   │                 │
                  ┌───────┴────────┐         │                 │
                  │                │         │                 │
                  ▼                ▼         ▼                 ▼
         ┌──────────────┐ ┌──────────────┐ Multiple      Agricultural
         │   Criminal   │ │    Civil     │ Locations:     & Small Claims
         │ (HAC XXX/YY) │ │(HBC XXX/YY)  │ - Suva
         └──────────────┘ └──────────────┘ - Nadi
                                            - Lautoka
                                            - Labasa
                                            - Nausori
```

## Case Flow Diagram

```
┌──────────────┐
│  Case Filed  │
│ (with proper │
│case number)  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Case Created                │
│                                     │
│  - Case Number: HAC 179/2024        │
│  - Court Level: high_court          │
│  - Division: criminal               │
│  - Parties: {prosecution, defense}  │
│  - Assigned Judge                   │
│  - Filed Date                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│       Hearings Scheduled             │
│                                      │
│  1. FIRST CALL                       │
│     - Initial appearance             │
│     - Bail consideration             │
│                                      │
│  2. MENTION (multiple)               │
│     - Case management                │
│     - Status updates                 │
│                                      │
│  3. PRE-TRIAL CONFERENCE             │
│     - Summary of facts               │
│     - Witness lists                  │
│                                      │
│  4. VOIR DIRE HEARING (if needed)    │
│     - Evidence admissibility         │
│                                      │
│  5. TRIAL                            │
│     - Opening statements             │
│     - Evidence presentation          │
│                                      │
│  6. CONTINUATION OF TRIAL (if needed)│
│     - Multi-day trials               │
│                                      │
│  7. RULING                           │
│     - Verdict delivered              │
│                                      │
│  8. SENTENCING (if guilty)           │
│     - Sentence handed down           │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│         Case Closed                  │
└──────────────┬───────────────────────┘
               │
               ▼ (optional)
┌──────────────────────────────────────┐
│          Appeal Filed                │
│                                      │
│  - Links to original case            │
│  - New case number (ABU/HAA)         │
│  - Goes to higher court              │
└──────────────────────────────────────┘
```

## Daily Cause List Structure

```
┌───────────────────────────────────────────────────────────────────┐
│         THE HIGH COURT OF FIJI AT SUVA                            │
│              CRIMINAL CAUSE LIST                                  │
│          TUESDAY 11th NOVEMBER, 2025                              │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│  BEFORE THE HON. MR. JUSTICE GOUNDAR                              │
│  IN HIGH COURT ROOM NO. 2 AT 9.30AM                               │
└───────────────────────────────────────────────────────────────────┘

    HEARING
    1. HAC 179/2024      State (DPP)  -vs-  Vilivo Ciri (LEGAL AID)
    
    MENTION
    2. HAC 124/2025      State (DPP)  -vs-  Watisoni Raruru (TUIFAGALELE LAWYERS)
    3. HAC 122/2024      State (DPP)  -vs-  ...

┌───────────────────────────────────────────────────────────────────┐
│  BEFORE THE HON. MADAM JUSTICE BULL                               │
│  IN HIGH COURT ROOM NO. 4 AT 9.30AM                               │
└───────────────────────────────────────────────────────────────────┘

    CONTINUATION OF TRIAL
    1. HAC 179/2024      State (DPP)  -vs-  ...
    
    PRE-TRIAL CONFERENCE & SUMMARY OF FACTS
    2. HAC 125/2024      State (DPP)  -vs-  ...

[Generated from: daily_cause_lists + hearings tables]
```

## Database Entity Relationships

```
┌──────────────┐
│     User     │──┐
└──────┬───────┘  │
       │          │ judicial_title
       │          │ designation
       │          │
       ▼          │
┌──────────────────────┐         ┌─────────────────┐
│   Organisation       │◄────────│   Court Rooms   │
│  (Court Hierarchy)   │         │                 │
│                      │         │ - name          │
│ - courtLevel         │         │ - code          │
│ - courtType          │         │ - capacity      │
│ - jurisdiction       │         └─────────────────┘
└──────┬───────────────┘
       │                          ┌─────────────────┐
       │                          │    Legal Reps   │
       │                          │                 │
       │                          │ - name          │
       │                          │ - firm          │
       │                          │ - practiceAreas │
       │                          └─────────────────┘
       │
       ▼
┌──────────────────────┐
│       Cases          │
│                      │
│ - caseNumber         │─┐
│ - courtLevel         │ │
│ - division           │ │
│ - parties (JSON)     │ │
│ - offences (JSON)    │ │
│ - assignedJudgeId    │ │
│ - filedDate          │ │
└──────┬───────────────┘ │
       │                 │
       │ 1:N             │
       ▼                 │
┌──────────────────────┐ │
│      Hearings        │ │
│                      │ │
│ - scheduledDate      │ │
│ - scheduledTime      │ │
│ - actionType         │ │
│ - courtRoomId        │ │
│ - judgeId            │ │
│ - bailConsidered     │ │
│ - bailDecision       │ │
│ - outcome            │ │
└──────────────────────┘ │
                         │
       ┌─────────────────┘
       │
       ▼
┌──────────────────────┐
│       Appeals        │
│                      │
│ - originalCaseId     │
│ - appealCaseId       │
│ - appealType         │
│ - grounds            │
│ - appellantCounsel   │
│ - respondentCounsel  │
│ - decision           │
└──────────────────────┘

┌──────────────────────┐
│  Daily Cause Lists   │
│                      │
│ - listDate           │
│ - courtLevel         │
│ - presidingOfficerId │
│ - courtRoomId        │
│ - sessionTime        │
│ - status             │
└──────────────────────┘
```

## Case Number Generation Flow

```
User Creates Case
       ▼
┌─────────────────────────────────────┐
│  generateCaseNumber()               │
│                                     │
│  Input:                             │
│  - organisationId                   │
│  - courtLevel: "high_court"         │
│  - courtType: "criminal"            │
│  - year: 2025                       │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│  Get Format Config                  │
│  "high_court_criminal" →            │
│  {                                  │
│    prefix: "HAC",                   │
│    padLength: 3,                    │
│    yearDigits: 4,                   │
│    separator: "/"                   │
│  }                                  │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│  Get Next Sequence Number           │
│                                     │
│  Query: SELECT MAX(sequence)        │
│  FROM cases                         │
│  WHERE org = X                      │
│    AND courtLevel = "high_court"    │
│    AND division = "criminal"        │
│    AND YEAR(filedDate) = 2025       │
│                                     │
│  Result: 178 → Next: 179            │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│  Format Case Number                 │
│                                     │
│  "HAC" + " " +                      │
│  "179".padStart(3) + "/" +          │
│  "2025"                             │
│                                     │
│  Result: "HAC 179/2025"             │
└─────────────────────────────────────┘
```

## Hearing Action Type Workflow

```
Case Status:  [OPEN] → [ACTIVE] → [IN TRIAL] → [CLOSED]
                │          │           │           │
Hearing Types:  │          │           │           │
                │          │           │           │
FIRST CALL ─────┘          │           │           │
(Initial appearance)       │           │           │
                           │           │           │
MENTION ───────────────────┴───────────┤           │
(Case management)                      │           │
                                       │           │
PRE-TRIAL CONFERENCE ──────────────────┘           │
(Summary of facts)                                 │
                                                   │
VOIR DIRE HEARING ─────────────────────────────────┤
(Evidence admissibility)                           │
                                                   │
TRIAL ─────────────────────────────────────────────┤
(Main hearing)                                     │
                                                   │
CONTINUATION OF TRIAL ─────────────────────────────┤
(Multi-day)                                        │
                                                   │
RULING ────────────────────────────────────────────┤
(Verdict)                                          │
                                                   │
SENTENCING ────────────────────────────────────────┘
(If guilty)

[Case Closed]
     │
     ▼
APPEAL (optional)
```

## Party Structure in Cases

```
Criminal Case:
{
  parties: {
    prosecution: [
      { name: "State", counsel: "DPP" }
    ],
    defense: [
      { name: "Vilivo Ciri", counsel: "LEGAL AID" },
      { name: "Abdul Imraan", counsel: "TIRATH SHARMA LAWYERS" }
    ]
  }
}

Civil Case:
{
  parties: {
    plaintiff: [
      { name: "Ramesh Kumar", counsel: "MISHRA PRAKASH & ASSOCIATES" }
    ],
    defendant: [
      { name: "Anjila Wati", counsel: "LEGAL AID COMMISSION" },
      { name: "Ashika Nand", counsel: null }
    ]
  }
}

Appeal Case:
{
  parties: {
    appellant: [
      { name: "Sarendra Singh", counsel: "SEN LAWYERS" }
    ],
    respondent: [
      { name: "I-TAUKEI LAND TRUST BOARD", counsel: "TLTB LEGAL" },
      { name: "FIJI PINE LIMITED", counsel: "EZER LAW CHAMBERS" }
    ]
  }
}
```

## Indexes for Performance

```
Cases:
├── case_number_idx (for lookup)
├── case_court_level_idx (for filtering by court)
├── case_filed_date_idx (for date queries)
├── case_assigned_judge_idx (for judge workload)
└── case_org_idx (for multi-tenancy)

Hearings:
├── hearing_date_idx (for calendar views)
├── hearing_status_idx (for filtering)
├── hearing_action_type_idx (for cause lists)
├── hearing_courtroom_idx (for room scheduling)
├── hearing_judge_idx (for judge schedules)
└── hearing_case_idx (for case timeline)

Court Rooms:
├── courtroom_code_idx (for quick lookup)
├── courtroom_active_idx (for available rooms)
└── courtroom_org_idx (for court filtering)
```

---

**Legend:**
- `─`, `│`, `┌`, `└`, `┬`, `├` : Diagram connectors
- `▼`, `►` : Flow direction
- `1:N` : One-to-many relationship
- `N:M` : Many-to-many relationship
