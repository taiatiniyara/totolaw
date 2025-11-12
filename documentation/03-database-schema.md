# Database Schema

## Overview

Totolaw uses PostgreSQL as its primary database, with Drizzle ORM providing type-safe database access. The schema is designed around multi-tenancy, with organisation-level isolation for all tenant-specific data.

## Schema Organization

The database schema is organized into the following modules:

1. **Authentication Schema** - User accounts and sessions
2. **Organisation Schema** - Organisations, memberships, invitations, join requests
3. **RBAC Schema** - Roles, permissions, and assignments
4. **Case Schema** - Legal cases and related entities
5. **Transcript Schema** - Court proceeding transcriptions
6. **System Admin Schema** - System-level audit logging

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │◄─────────────────┐
└──────┬──────┘                  │
       │                         │
       │ 1:N                     │ 1:N
       ▼                         │
┌──────────────────┐             │
│ OrganisationMember│             │
└──────┬───────────┘             │
       │ N:1                     │
       ▼                         │
┌──────────────┐                 │
│ Organisation │                 │
└──────┬───────┘                 │
       │                         │
       │ 1:N                     │
       ▼                         │
┌──────────────┐                 │
│    Role      │                 │
└──────┬───────┘                 │
       │                         │
       │ N:M (via UserRole)      │
       └─────────────────────────┘

┌──────────────┐     N:M     ┌──────────────┐
│     Role     │◄───────────►│  Permission  │
└──────────────┘             └──────────────┘
     (via RolePermission)

┌──────────────┐     1:N     ┌──────────────┐
│ Organisation │────────────►│    Case      │
└──────────────┘             └──────┬───────┘
                                    │ 1:N
                                    ▼
                             ┌──────────────┐
                             │   Hearing    │
                             └──────┬───────┘
                                    │ 1:N
                                    ▼
                             ┌──────────────┐
                             │   Evidence   │
                             └──────────────┘
```

## Core Tables

### Authentication Tables

#### `user`
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| name | text | User's full name |
| email | text | Email address (unique) |
| emailVerified | boolean | Email verification status |
| image | text | Profile image URL |
| currentOrganisationId | text | User's active organisation |
| isSuperAdmin | boolean | System administrator flag |
| adminNotes | text | Notes about admin status |
| adminAddedBy | text | FK to user who granted admin |
| adminAddedAt | timestamp | When admin access was granted |
| lastLogin | timestamp | Last login timestamp |
| judicialTitle | text | Judicial title (e.g., "Justice", "Resident Magistrate") |
| designation | text | Role designation (e.g., "Judge", "Magistrate", "Prosecutor") |
| createdAt | timestamp | Account creation time |
| updatedAt | timestamp | Last update time |

**Judicial Fields Usage:**
- `judicialTitle` - Used in cause list generation and formal court documents (e.g., "THE HON. MR. JUSTICE GOUNDAR")
- `designation` - General role classification for assignment purposes (e.g., assigning judges to cases)

**Common Judicial Titles:**
- "Justice" - High Court and Court of Appeal judges
- "Resident Magistrate" - Senior magistrates
- "Magistrate" - Magistrates court officials
- "Chief Registrar" - Court administrative head
- null - Non-judicial users

**Common Designations:**
- "Judge" - Judicial officer in higher courts
- "Magistrate" - Judicial officer in magistrates courts
- "Registrar" - Court administrator
- "Prosecutor" - Prosecution counsel
- "Defense Attorney" - Defense counsel
- "Clerk" - Court clerk
- null - Administrative or other roles

**Indexes:**
- Unique on `email`
- Index on `currentOrganisationId`

#### `session`
Manages user sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| userId | text | FK to user |
| token | text | Session token (unique) |
| expiresAt | timestamp | Session expiration |
| ipAddress | text | IP address of session |
| userAgent | text | Browser user agent |
| createdAt | timestamp | Session creation |
| updatedAt | timestamp | Last update |

**Indexes:**
- Unique on `token`
- Index on `userId`

#### `account`
OAuth and authentication provider data (used by Better Auth).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| userId | text | FK to user |
| accountId | text | Provider account ID |
| providerId | text | Provider identifier |
| accessToken | text | OAuth access token |
| refreshToken | text | OAuth refresh token |
| idToken | text | OAuth ID token |
| accessTokenExpiresAt | timestamp | Token expiration |
| refreshTokenExpiresAt | timestamp | Refresh token expiration |
| scope | text | OAuth scope |
| password | text | Hashed password (if applicable) |
| createdAt | timestamp | Account link time |
| updatedAt | timestamp | Last update |

#### `verification`
Email verification and magic link tokens.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| identifier | text | Email or identifier |
| value | text | Verification token |
| expiresAt | timestamp | Token expiration |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

#### `rate_limit`
Rate limiting tracking (prevents abuse).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| key | text | Rate limit key (IP, email, etc.) |
| count | integer | Request count |
| lastRequest | bigint | Timestamp of last request |

### Organisation Tables

#### `organisations`
Court systems and organisational entities with court hierarchy support.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| name | text | Organisation name (e.g., "Fiji High Court - Criminal Division") |
| code | varchar(10) | Organisation code (e.g., "FJ-HC-CRIM") |
| type | varchar(50) | Type: "country", "court_system", "court", "tribunal" |
| courtLevel | varchar(50) | Court level: "court_of_appeal", "high_court", "magistrates", "tribunal" |
| courtType | varchar(50) | Court type: "criminal", "civil", "family", "agricultural", "small_claims" |
| jurisdiction | text | Geographic or subject matter jurisdiction |
| description | text | Organisation description |
| parentId | text | FK to parent organisation (hierarchy) |
| isActive | boolean | Active status |
| settings | text | JSON settings (case number formats, etc.) |
| createdBy | text | FK to user who created |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Court Hierarchy Example:**
```
Fiji Court System (country, parent=null)
  ├── Court of Appeal (court_of_appeal, parent=Fiji)
  ├── High Court - Criminal Division (high_court, criminal, parent=Fiji)
  ├── High Court - Civil Division (high_court, civil, parent=Fiji)
  ├── Suva Magistrates Court (magistrates, parent=Fiji)
  ├── Nadi Magistrates Court (magistrates, parent=Fiji)
  └── Agricultural Tribunal (tribunal, agricultural, parent=Fiji)
```

**Court Levels:**
- `court_of_appeal` - Highest appellate court
- `high_court` - Superior court with original and appellate jurisdiction
- `magistrates` - Lower courts handling minor matters
- `tribunal` - Specialized courts (agricultural, small claims, etc.)

**Court Types (for high courts and tribunals):**
- `criminal` - Criminal matters
- `civil` - Civil disputes
- `family` - Family law matters
- `agricultural` - Land and agricultural disputes
- `small_claims` - Small monetary claims
- null - Not applicable or mixed jurisdiction

**Indexes:**
- Unique on `code`
- Index on `parentId`
- Index on `isActive`
- Index on `courtLevel`

#### `organisation_members`
User membership in organisations.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| userId | text | FK to user |
| isPrimary | boolean | User's primary organisation |
| isActive | boolean | Active membership |
| joinedAt | timestamp | Join date |
| leftAt | timestamp | Leave date (if applicable) |
| addedBy | text | FK to user who added |
| createdAt | timestamp | Record creation |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(organisationId, userId)`

**Indexes:**
- Index on `organisationId`
- Index on `userId`
- Composite index on `(userId, isPrimary)`
- Index on `isActive`

#### `organisation_invitations`
Admin-initiated user invitations.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| email | text | Invitee email address |
| roleId | text | Pre-assigned role (optional) |
| token | text | Unique invitation token |
| status | varchar(20) | Status: "pending", "accepted", "expired", "revoked" |
| invitedBy | text | FK to user who invited |
| acceptedBy | text | FK to user who accepted |
| expiresAt | timestamp | Invitation expiration |
| acceptedAt | timestamp | Acceptance timestamp |
| revokedAt | timestamp | Revocation timestamp |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Indexes:**
- Unique on `token`
- Index on `organisationId`
- Index on `email`
- Index on `status`

#### `organisation_join_requests`
User-initiated organisation join requests.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| userId | text | FK to requesting user |
| status | varchar(20) | Status: "pending", "approved", "rejected" |
| message | text | Optional message from user |
| reviewedBy | text | FK to reviewing admin |
| reviewedAt | timestamp | Review timestamp |
| rejectionReason | text | Reason for rejection |
| createdAt | timestamp | Request time |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(userId, organisationId)` to prevent duplicate pending requests

**Indexes:**
- Index on `organisationId`
- Index on `userId`
- Index on `status`

### RBAC Tables

#### `roles`
Organisation-specific roles.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| name | varchar(100) | Role display name |
| slug | varchar(100) | Role identifier (e.g., "judge") |
| description | text | Role description |
| isSystem | boolean | System role (cannot delete) |
| isActive | boolean | Active status |
| createdBy | text | FK to creator |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(organisationId, slug)`

**Indexes:**
- Index on `organisationId`
- Index on `slug`
- Index on `isSystem`
- Index on `isActive`

#### `permissions`
System-wide permissions (resource:action format).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| resource | varchar(100) | Resource (e.g., "cases") |
| action | varchar(50) | Action (e.g., "create", "read") |
| slug | varchar(150) | Full permission slug (e.g., "cases:create") |
| description | text | Permission description |
| isSystem | boolean | System permission |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Indexes:**
- Unique on `slug`
- Index on `resource`
- Index on `action`
- Index on `isSystem`

#### `role_permissions`
Maps permissions to roles.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| roleId | text | FK to role |
| permissionId | text | FK to permission |
| conditions | text | JSON conditional rules |
| createdBy | text | FK to creator |
| createdAt | timestamp | Creation time |

**Constraints:**
- Unique constraint on `(roleId, permissionId)`

**Indexes:**
- Index on `roleId`
- Index on `permissionId`

#### `user_roles`
Assigns roles to users in organisations.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| userId | text | FK to user |
| roleId | text | FK to role |
| organisationId | text | FK to organisation |
| scope | text | JSON scope restrictions |
| isActive | boolean | Active assignment |
| assignedBy | text | FK to assigner |
| assignedAt | timestamp | Assignment time |
| expiresAt | timestamp | Optional expiration |
| revokedAt | timestamp | Revocation time |
| revokedBy | text | FK to revoker |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(userId, roleId, organisationId)`

**Indexes:**
- Index on `userId`
- Index on `roleId`
- Index on `organisationId`
- Index on `isActive`
- Composite index on `(userId, organisationId)`

#### `user_permissions`
Direct permission grants/denies to users.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| userId | text | FK to user |
| permissionId | text | FK to permission |
| organisationId | text | FK to organisation |
| granted | boolean | True = grant, False = deny |
| conditions | text | JSON conditional rules |
| scope | text | JSON scope restrictions |
| assignedBy | text | FK to assigner |
| assignedAt | timestamp | Assignment time |
| expiresAt | timestamp | Optional expiration |
| revokedAt | timestamp | Revocation time |
| revokedBy | text | FK to revoker |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Indexes:**
- Index on `userId`
- Index on `permissionId`
- Index on `organisationId`
- Index on `granted`
- Composite index on `(userId, organisationId)`

#### `rbac_audit_log`
Audit trail for RBAC changes.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| entityType | varchar(50) | Type: "role", "permission", "user_role", etc. |
| entityId | text | ID of affected entity |
| action | varchar(50) | Action: "created", "updated", "deleted", etc. |
| performedBy | text | FK to user who performed action |
| targetUserId | text | FK to affected user |
| changes | text | JSON before/after values |
| metadata | text | JSON additional context |
| ipAddress | text | IP address |
| userAgent | text | Browser user agent |
| createdAt | timestamp | Action time |

**Indexes:**
- Index on `organisationId`
- Composite index on `(entityType, entityId)`
- Index on `performedBy`
- Index on `targetUserId`
- Index on `createdAt`

### Case Management Tables

#### `cases`
Legal case records with Fiji court system support.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| caseNumber | varchar(50) | Auto-generated case number (e.g., "HAC 179/2024") |
| title | text | Case title |
| type | varchar(50) | Case type: "criminal", "civil", "appeal", etc. |
| courtLevel | varchar(50) | Court level: "high_court", "magistrates", "court_of_appeal", "tribunal" |
| caseType | varchar(50) | Division for high court: "criminal", "civil" |
| status | varchar(50) | Status: "open", "active", "closed", "appealed" |
| parties | json | Parties structure (see below) |
| assignedJudgeId | text | FK to assigned judge |
| assignedClerkId | text | FK to assigned clerk |
| filedDate | timestamp | Date case was filed |
| firstHearingDate | timestamp | Date of first hearing |
| closedDate | timestamp | Date case was closed |
| offences | json | Array of offences (for criminal cases) |
| notes | text | Additional notes |
| filedBy | text | FK to user who filed |
| createdAt | timestamp | Record creation time |
| updatedAt | timestamp | Last update time |

**Parties JSON Structure:**
```json
{
  "prosecution": [
    { "name": "State", "counsel": "DPP" }
  ],
  "defense": [
    { "name": "John Doe", "counsel": "LEGAL AID COMMISSION" }
  ],
  "plaintiff": [
    { "name": "Jane Smith", "counsel": "MISHRA PRAKASH & ASSOCIATES" }
  ],
  "defendant": [
    { "name": "ABC Company", "counsel": "SEN LAWYERS" }
  ],
  "appellant": [
    { "name": "Appellant Name", "counsel": "Counsel Name" }
  ],
  "respondent": [
    { "name": "Respondent Name", "counsel": "Counsel Name" }
  ]
}
```

**Indexes:**
- Index on `organisationId`
- Index on `status`
- Index on `caseNumber`
- Index on `courtLevel`
- Index on `assignedJudgeId`
- Index on `filedDate`

#### `hearings`
Court hearing schedules with Fiji action types.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| caseId | text | FK to case |
| scheduledDate | timestamp | Hearing date |
| scheduledTime | varchar(10) | Time in format "9:30AM" |
| estimatedDuration | integer | Duration in minutes |
| courtRoomId | text | FK to courtroom |
| location | text | Location (fallback if courtroom not tracked) |
| actionType | varchar(50) | Hearing action type (see below) |
| status | varchar(50) | Status: "scheduled", "in_progress", "completed", "adjourned", "cancelled" |
| judgeId | text | FK to presiding judge |
| magistrateId | text | FK to magistrate (for magistrates courts) |
| clerkId | text | FK to court clerk |
| outcome | text | Brief outcome description |
| nextActionRequired | text | Next action needed |
| bailConsidered | boolean | Whether bail was considered |
| bailDecision | varchar(50) | Bail decision: "granted", "denied", "continued" |
| bailAmount | integer | Bail amount (if granted) |
| bailConditions | text | Bail conditions |
| minutes | text | Hearing minutes |
| notes | text | Additional notes |
| createdBy | text | FK to user who created |
| createdAt | timestamp | Record creation |
| updatedAt | timestamp | Last update |

**Action Types (Fiji Court System):**
- `MENTION` - Routine case management hearing
- `HEARING` - General hearing on matters
- `TRIAL` - Full trial proceeding
- `CONTINUATION OF TRIAL` - Multi-day trial continuation
- `VOIR DIRE HEARING` - Evidence admissibility hearing
- `PRE-TRIAL CONFERENCE` - Pre-trial preparation
- `BAIL HEARING` - Bail consideration
- `RULING` - Judge delivering ruling/decision
- `FIRST CALL` - Initial appearance
- `SENTENCING` - Sentence delivery

**Indexes:**
- Index on `organisationId`
- Index on `caseId`
- Index on `judgeId`
- Index on `scheduledDate`
- Index on `status`
- Index on `actionType`
- Index on `courtRoomId`

#### `court_rooms`
Physical courtroom tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| name | varchar(100) | Courtroom name (e.g., "HIGH COURT ROOM NO. 2") |
| code | varchar(20) | Short code (e.g., "HC-2") |
| courtLevel | varchar(50) | Court level: "high_court", "magistrates", etc. |
| location | text | Physical location details |
| capacity | integer | Seating capacity |
| isActive | boolean | Active status |
| createdAt | timestamp | Record creation |
| updatedAt | timestamp | Last update |

**Indexes:**
- Index on `organisationId`
- Index on `code`
- Index on `isActive`

#### `legal_representatives`
Lawyers, law firms, and legal aid tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| name | text | Lawyer or firm name |
| type | varchar(50) | Type: "individual", "law_firm", "legal_aid", "government" |
| firmName | text | Law firm name (if individual lawyer) |
| email | text | Contact email |
| phone | text | Contact phone |
| address | text | Physical address |
| practiceAreas | json | Array of practice areas (e.g., ["criminal", "civil"]) |
| userId | text | FK to linked user account (optional) |
| isActive | boolean | Active status |
| notes | text | Additional notes |
| createdBy | text | FK to user who created |
| createdAt | timestamp | Record creation |
| updatedAt | timestamp | Last update |

**Indexes:**
- Index on `organisationId`
- Index on `userId`
- Index on `isActive`

#### `daily_cause_lists`
Daily court schedules (Fiji format).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| listDate | timestamp | Date for this cause list |
| courtLevel | varchar(50) | Court level |
| presidingOfficerId | text | FK to presiding judge/magistrate |
| presidingOfficerTitle | varchar(100) | Full title (e.g., "HON. MR. JUSTICE GOUNDAR") |
| courtRoomId | text | FK to courtroom |
| sessionTime | varchar(20) | Session time (e.g., "9:30AM") |
| status | varchar(50) | Status: "draft", "published", "completed" |
| publishedAt | timestamp | When published |
| notes | text | Additional notes |
| createdBy | text | FK to creator |
| createdAt | timestamp | Record creation |
| updatedAt | timestamp | Last update |

**Indexes:**
- Index on `organisationId`
- Index on `listDate`
- Index on `presidingOfficerId`
- Index on `status`

**Note:** Hearings are linked to cause lists via the hearing's `courtRoomId`, `judgeId`, and `scheduledDate` matching the cause list criteria.

#### `evidence`
Evidence items for cases.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| caseId | text | FK to case |
| hearingId | text | FK to hearing (optional) |
| fileName | text | Original filename |
| fileSize | integer | File size in bytes |
| fileType | varchar(100) | MIME type |
| filePath | text | Storage path |
| description | text | Evidence description |
| submittedBy | text | FK to user who submitted |
| createdAt | timestamp | Submission time |

**Indexes:**
- Index on `organisationId`
- Index on `caseId`
- Index on `hearingId`
- Index on `submittedBy`

#### `pleas`
Plea records (guilty, not guilty, etc.).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| caseId | text | FK to case |
| defendantId | text | FK to defendant user |
| pleaType | varchar(20) | Plea type: "guilty", "not_guilty", etc. |
| createdAt | timestamp | Plea date |

**Indexes:**
- Index on `organisationId`
- Index on `caseId`

#### `trials`
Trial records and outcomes.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| caseId | text | FK to case |
| judgeId | text | FK to presiding judge |
| verdict | varchar(20) | Verdict: "guilty", "not_guilty", etc. |
| createdAt | timestamp | Trial completion date |

**Indexes:**
- Index on `organisationId`
- Index on `caseId`
- Index on `judgeId`

#### `sentences`
Sentencing information.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| caseId | text | FK to case |
| sentenceType | varchar(50) | Type of sentence |
| duration | integer | Duration in months/years (if applicable) |
| createdAt | timestamp | Sentencing date |

**Indexes:**
- Index on `organisationId`
- Index on `caseId`

#### `appeals`
Appeal records with enhanced linking.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| originalCaseId | text | FK to lower court case |
| appealCaseId | text | FK to appeal case (if created as new case) |
| appealType | varchar(50) | Type: "criminal_appeal", "civil_appeal", "bail_application" |
| grounds | text | Grounds for appeal |
| status | varchar(50) | Status: "pending", "admitted", "dismissed", "allowed", "withdrawn" |
| appellantId | text | FK to appellant user |
| appellantCounsel | text | Appellant's counsel |
| respondentCounsel | text | Respondent's counsel |
| filedDate | timestamp | Filing date |
| hearingDate | timestamp | Appeal hearing date |
| decisionDate | timestamp | Decision date |
| decision | text | Appeal decision |
| orders | text | Court orders |
| filedBy | text | FK to user who filed |
| createdAt | timestamp | Record creation |
| updatedAt | timestamp | Last update |

**Indexes:**
- Index on `organisationId`
- Index on `originalCaseId`
- Index on `appealCaseId`
- Index on `status`
- Index on `filedBy`

#### `enforcement`
Sentence enforcement tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| caseId | text | FK to case |
| officerId | text | FK to enforcement officer |
| action | varchar(50) | Enforcement action taken |
| notes | text | Additional notes |
| createdAt | timestamp | Action date |

**Indexes:**
- Index on `organisationId`
- Index on `caseId`
- Index on `officerId`

#### `managed_lists`
Custom managed lists for organisations.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| name | varchar(100) | List name |
| description | text | List description |
| list | json | Array of list items (id, name, details) |
| createdBy | text | FK to creator |
| createdAt | timestamp | Creation time |

**Indexes:**
- Index on `organisationId`

All case-related tables include `organisationId` for tenant isolation.

### Transcript Tables

The transcription system supports manual and automated transcription of court proceedings.

#### `transcripts`
Main transcript records.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| caseId | text | FK to case |
| hearingId | text | FK to hearing |
| organisationId | text | FK to organisation |
| title | text | Transcript title |
| status | varchar(50) | Status: "draft", "in-progress", "completed", "reviewed" |
| recordingUrl | text | Optional URL to audio/video recording |
| transcriptionService | varchar(50) | Service used: "manual", "automated", "hybrid" |
| startedAt | timestamp | When transcription started |
| completedAt | timestamp | When completed |
| createdBy | text | FK to user who created |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Status Values:**
- `draft` - Newly created, not started
- `in-progress` - Currently being transcribed
- `completed` - Transcription finished
- `reviewed` - Reviewed and approved by supervisor

**Indexes:**
- Index on `organisationId`
- Index on `caseId`
- Index on `hearingId`
- Index on `status`
- Index on `createdBy`

#### `transcript_speakers`
Speakers in court proceedings.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| transcriptId | text | FK to transcript |
| organisationId | text | FK to organisation |
| name | text | Speaker name (e.g., "Judge Smith", "Witness A") |
| role | varchar(50) | Speaker role (see below) |
| userId | text | FK to user (optional, if speaker has system account) |
| metadata | json | Additional speaker data |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Speaker Roles:**
- `judge` - Presiding judge or magistrate
- `prosecutor` - Prosecution counsel
- `defense` - Defense attorney
- `witness` - Witness giving testimony
- `defendant` - Defendant speaking
- `clerk` - Court clerk
- `interpreter` - Court interpreter
- `other` - Other participants

**Indexes:**
- Index on `transcriptId`
- Index on `organisationId`
- Index on `userId`

#### `transcript_segments`
Individual transcript segments (statements).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| transcriptId | text | FK to transcript |
| speakerId | text | FK to speaker |
| organisationId | text | FK to organisation |
| startTime | integer | Start time in milliseconds |
| endTime | integer | End time in milliseconds (optional) |
| text | text | Transcript text |
| confidence | numeric | Confidence score (for automated transcription, 0-1) |
| metadata | json | Additional data (notes, corrections, timestamp string) |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Metadata Structure (Manual Transcription):**
```json
{
  "notes": "Witness had strong accent",
  "timestamp": "10:35",
  "manualEntry": true,
  "corrections": []
}
```

**Indexes:**
- Index on `transcriptId`
- Index on `speakerId`
- Index on `organisationId`
- Index on `startTime`

#### `transcript_annotations`
Annotations, highlights, and comments on transcripts.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| transcriptId | text | FK to transcript |
| segmentId | text | FK to specific segment (optional) |
| organisationId | text | FK to organisation |
| type | varchar(50) | Annotation type (see below) |
| content | text | Annotation content/comment |
| color | varchar(20) | Highlight color (for highlights) |
| createdBy | text | FK to user who created |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Annotation Types:**
- `highlight` - Important text highlight
- `comment` - Comment or note
- `correction` - Error correction
- `clarification` - Clarification note
- `redaction` - Text redaction marker

**Indexes:**
- Index on `transcriptId`
- Index on `segmentId`
- Index on `organisationId`
- Index on `createdBy`
- Index on `type`

### System Admin Tables

#### `system_admin_audit_log`
System-level administrative actions.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| userId | text | FK to admin user |
| action | varchar(100) | Action performed |
| entityType | varchar(50) | Entity type affected |
| entityId | text | Entity ID |
| description | text | Action description |
| metadata | text | JSON additional details |
| ipAddress | text | IP address |
| userAgent | text | Browser user agent |
| createdAt | timestamp | Action time |

**Indexes:**
- Index on `userId`
- Index on `action`
- Composite index on `(entityType, entityId)`
- Index on `createdAt`

## Data Types

### UUID Generation
All primary keys use UUIDs generated by the `uuid.service.ts`:
```typescript
import { v7 as uuidv7 } from 'uuid';
export const generateUUID = () => uuidv7();
```

### JSON Fields
Several fields store JSON data as text:
- `organisations.settings` - Organisation configuration
- `roles.scope`, `permissions.conditions` - Access control rules
- `*_audit_log.changes`, `*.metadata` - Structured metadata

### Timestamps
All tables include:
- `createdAt` - Set on insert
- `updatedAt` - Auto-updated on modification (via `$onUpdate`)

## Indexing Strategy

### Primary Indexes
- All primary keys have implicit unique indexes
- Foreign keys have explicit indexes for join performance

### Composite Indexes
- `(userId, organisationId)` - User-organisation queries
- `(entityType, entityId)` - Audit log lookups

### Unique Constraints
- Prevent duplicate data (e.g., one pending join request per user-org pair)
- Enforce business rules at database level

## Migration Strategy

### Migration Files
Located in `/migrations/` directory:
- SQL files with incremental numbers
- `002_simplify_system_admin.sql`
- `003_add_organisation_join_requests.sql`

### Applying Migrations
```bash
npm run db-push  # Push schema changes
npm run db-view  # View database in Drizzle Studio
```

### Migration Best Practices
1. Never modify existing migrations
2. Create new migration files for changes
3. Test migrations on staging first
4. Backup database before production migrations

## Data Integrity

### Foreign Key Cascades
- `ON DELETE CASCADE` - Child records deleted with parent
- `ON DELETE SET NULL` - FK set to null on parent deletion

### Soft Deletes
Many tables use status flags instead of hard deletes:
- `isActive` boolean fields
- `revokedAt` timestamps
- Preserves audit trail and historical data

### Constraints
- Unique constraints enforce business rules
- Check constraints could be added for validation
- NOT NULL constraints prevent incomplete data

## Performance Considerations

### Query Optimization
- Indexes on frequently queried columns
- Composite indexes for common join patterns
- Pagination for large result sets

### Connection Pooling
Drizzle ORM manages connection pool:
```typescript
// lib/drizzle/connection.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

### Monitoring
- Slow query logging
- Connection pool metrics
- Index usage statistics

---

**Next:** [Authentication & Authorization →](04-auth-and-security.md)
