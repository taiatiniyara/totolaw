# API Documentation

## Overview

Totolaw provides both **API Routes** (REST-style endpoints) and **Server Actions** (Next.js server functions) for backend operations. Most mutations use Server Actions, while API routes handle authentication and specific data retrieval patterns.

## Base URL

- **Development:** `http://localhost:3441`
- **Production:** Your configured `NEXT_PUBLIC_APP_URL`

## Authentication

All API requests (except authentication endpoints) require a valid session cookie set by Better Auth.

### Session Cookie
- **Name:** Automatically managed by Better Auth
- **Type:** HTTP-only cookie
- **Expiration:** 7 days
- **Security:** Secure flag in production, SameSite=Lax

## API Routes

### Authentication

#### Initialize Magic Link Login

**Endpoint:** `POST /api/auth/magic-link/send`  
**Handler:** Better Auth (via `/api/auth/[...all]/route.ts`)

**Request:**
```json
{
  "email": "user@example.com",
  "callbackURL": "/dashboard"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link sent to your email"
}
```

**Errors:**
- `400` - Invalid email format
- `429` - Rate limit exceeded (5 requests per 15 minutes)
- `500` - Email delivery failed

#### Verify Magic Link

**Endpoint:** `GET /api/auth/magic-link/verify?token={token}`  
**Handler:** Better Auth

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | Yes | Magic link token from email |

**Response:**
- Redirects to callback URL on success
- Redirects to error page on failure

#### Get Session

**Endpoint:** `GET /api/auth/session`  
**Handler:** Better Auth

**Response:**
```json
{
  "session": {
    "id": "session-uuid",
    "userId": "user-uuid",
    "expiresAt": "2025-11-18T12:00:00Z"
  },
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "currentOrganisationId": "org-uuid",
    "isSuperAdmin": false
  }
}
```

#### Logout

**Endpoint:** `POST /api/auth/signout`  
**Handler:** Better Auth

**Response:**
```json
{
  "success": true
}
```

### Organisation Management

#### List User's Organisations

**Endpoint:** `GET /api/organization/list`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "organisations": [
      {
        "organisation": {
          "id": "org-uuid",
          "name": "Fiji High Court",
          "code": "FJ",
          "type": "country",
          "description": "Fiji judicial system",
          "isActive": true
        },
        "membership": {
          "id": "member-uuid",
          "isPrimary": true,
          "isActive": true,
          "joinedAt": "2025-01-01T00:00:00Z"
        }
      }
    ],
    "currentOrganisationId": "org-uuid"
  }
}
```

**Errors:**
- `401` - Unauthorized (no session)
- `500` - Server error

#### Switch Organisation Context

**Endpoint:** `POST /api/organization/switch`

**Authentication:** Required

**Request:**
```json
{
  "organisationId": "org-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "organisationId": "org-uuid"
  }
}
```

**Errors:**
- `400` - Missing organisationId
- `401` - Unauthorized
- `403` - User doesn't have access to organisation
- `500` - Server error

## Server Actions

Server Actions are the primary way to perform mutations and complex operations. They're defined with `'use server'` directive and can be called directly from client components.

### Authentication Actions

**File:** `app/auth/actions.ts`

#### Send Magic Link

```typescript
'use server';

export async function sendMagicLink(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}>;
```

**Usage:**
```typescript
<form action={sendMagicLink}>
  <input name="email" type="email" required />
  <button type="submit">Send Magic Link</button>
</form>
```

#### Logout

```typescript
'use server';

export async function logout(): Promise<void>;
```

**Usage:**
```typescript
import { logout } from '@/app/auth/actions';

<button onClick={() => logout()}>Logout</button>
```

### Dashboard Actions

**File:** `app/dashboard/actions.ts`

These actions handle the core case management operations. All actions:
- Require authentication
- Check organisation context
- Validate permissions
- Return structured responses

#### Response Format

```typescript
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Organisation Actions

**File:** `app/organisations/actions.ts`

#### Request to Join Organisation

```typescript
'use server';

export async function requestToJoinOrganisation(
  organisationId: string,
  message?: string
): Promise<ActionResponse<{ requestId: string }>>;
```

**Checks:**
- User is authenticated
- User not already a member
- No pending request exists
- Organisation is active

**Returns:**
```typescript
{
  success: true,
  data: { requestId: "request-uuid" }
}
```

#### Cancel Join Request

```typescript
'use server';

export async function cancelJoinRequest(
  requestId: string
): Promise<ActionResponse>;
```

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

### Error Types

#### Validation Errors
```json
{
  "success": false,
  "error": "Email is required"
}
```

#### Authentication Errors
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

#### Permission Errors
```json
{
  "success": false,
  "error": "You don't have permission to perform this action"
}
```

#### Not Found Errors
```json
{
  "success": false,
  "error": "Case not found"
}
```

## Rate Limiting

### Global Rate Limits
- **Window:** 15 minutes
- **Limit:** 100 requests per IP
- **Storage:** Database-backed

### Magic Link Rate Limits
- **Window:** 15 minutes
- **Limit:** 5 requests per email
- **Storage:** Database-backed

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699876543
```

## Request/Response Examples

### Create Case (Server Action Pattern)

**Action Definition:**
```typescript
// app/dashboard/cases/actions.ts
'use server';

export async function createCase(formData: FormData) {
  // 1. Validate session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Get tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { success: false, error: "No organisation context" };
  }

  // 3. Check permissions
  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:create',
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { success: false, error: "Permission denied" };
  }

  // 4. Extract and validate data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) {
    return { success: false, error: "Title is required" };
  }

  // 5. Create case
  const caseId = generateUUID();
  await db.insert(cases).values({
    id: caseId,
    organisationId: context.organisationId,
    title,
    description,
    status: 'open',
    createdBy: session.user.id,
  });

  // 6. Return success
  revalidatePath('/dashboard/cases');
  return {
    success: true,
    data: { caseId }
  };
}
```

**Client Usage:**
```typescript
'use client';

import { createCase } from './actions';
import { toast } from 'sonner';

export function CreateCaseForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createCase(formData);
    
    if (result.success) {
      toast.success('Case created successfully');
      router.push(`/dashboard/cases/${result.data.caseId}`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <textarea name="description" />
      <button type="submit">Create Case</button>
    </form>
  );
}
```

### Fetch Data (Server Component Pattern)

```typescript
// app/dashboard/cases/page.tsx
import { db } from '@/lib/drizzle/connection';
import { cases } from '@/lib/drizzle/schema/case-schema';
import { getUserTenantContext } from '@/lib/services/tenant.service';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

export default async function CasesPage() {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get tenant context
  const context = await getUserTenantContext(session.user.id);

  if (!context) {
    redirect('/dashboard/no-organisation');
  }

  // Fetch cases for organisation
  const casesData = await db
    .select()
    .from(cases)
    .where(eq(cases.organisationId, context.organisationId))
    .orderBy(cases.createdAt);

  return (
    <div>
      <h1>Cases</h1>
      {casesData.map(c => (
        <CaseCard key={c.id} case={c} />
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Always Validate Input

```typescript
if (!email || !email.includes('@')) {
  return { success: false, error: "Invalid email" };
}
```

### 2. Check Authentication

```typescript
const session = await auth.api.getSession({ headers: await headers() });
if (!session?.user) {
  return { success: false, error: "Unauthorized" };
}
```

### 3. Check Tenant Context

```typescript
const context = await getUserTenantContext(session.user.id);
if (!context) {
  return { success: false, error: "No organisation context" };
}
```

### 4. Verify Permissions

```typescript
const hasAccess = await hasPermission(
  userId,
  organisationId,
  'resource:action',
  isSuperAdmin
);

if (!hasAccess) {
  return { success: false, error: "Permission denied" };
}
```

### 5. Use Transactions for Multiple Operations

```typescript
await db.transaction(async (tx) => {
  await tx.insert(cases).values(caseData);
  await tx.insert(hearings).values(hearingData);
});
```

### 6. Revalidate Cache After Mutations

```typescript
import { revalidatePath } from 'next/cache';

await createCase(data);
revalidatePath('/dashboard/cases');
```

### 7. Handle Errors Gracefully

```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

### 8. Return Structured Responses

```typescript
// Good
return { success: true, data: { id: 'uuid' } };

// Bad
return 'uuid';
```

## Testing API Endpoints

### Using cURL

```bash
# Test organisation list
curl -X GET http://localhost:3441/api/organization/list \
  -H "Cookie: better-auth.session_token=..." \
  -H "Content-Type: application/json"

# Test organisation switch
curl -X POST http://localhost:3441/api/organization/switch \
  -H "Cookie: better-auth.session_token=..." \
  -H "Content-Type: application/json" \
  -d '{"organisationId": "org-uuid"}'
```

### Using Browser DevTools

```javascript
// In browser console (must be logged in)
fetch('/api/organization/list')
  .then(r => r.json())
  .then(console.log);
```

## Server Action Endpoints

The following sections document all available server actions grouped by domain.

### Case Management Actions

**File:** `app/dashboard/cases/actions.ts`

#### Get Cases

```typescript
export async function getCases(filters?: {
  status?: string;
  assignedJudge?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<Case[]>>;
```

**Filters:**
- `status` - Filter by case status (open, active, closed, appealed)
- `assignedJudge` - Filter by assigned judge ID
- `search` - Search case titles and numbers
- `limit` - Maximum results to return
- `offset` - Pagination offset

**Returns:**
```typescript
{
  success: true,
  data: [
    {
      id: "case-uuid",
      caseNumber: "HAC 179/2024",
      title: "State vs John Doe",
      type: "criminal",
      courtLevel: "high_court",
      status: "open",
      parties: { prosecution: [...], defense: [...] },
      filedDate: "2024-11-01T00:00:00Z",
      // ... other fields
    }
  ]
}
```

#### Get Case by ID

```typescript
export async function getCaseById(caseId: string): Promise<ActionResult<Case>>;
```

#### Create Case

```typescript
export async function createCase(formData: FormData): Promise<ActionResult<{ caseId: string }>>;
```

**Required FormData Fields:**
- `title` - Case title
- `type` - Case type (criminal, civil, appeal)
- `courtLevel` - Court level (high_court, magistrates, court_of_appeal, tribunal)
- `status` - Initial status (usually "open")
- `filedDate` - Date case was filed

**Optional Fields:**
- `caseType` - Division for high court (criminal, civil)
- `assignedJudgeId` - Assigned judge
- `assignedClerkId` - Assigned clerk
- `description` - Case description
- `parties` - JSON string of parties
- `offences` - JSON array of offences (for criminal cases)
- `notes` - Additional notes

**Note:** Case number is auto-generated based on court level and type.

#### Update Case

```typescript
export async function updateCase(
  caseId: string,
  formData: FormData
): Promise<ActionResult>;
```

#### Delete Case

```typescript
export async function deleteCase(caseId: string): Promise<ActionResult>;
```

**Permission Required:** `cases:delete`

### Hearing Management Actions

**File:** `app/dashboard/hearings/actions.ts`

#### Get Hearings

```typescript
export async function getHearings(options?: {
  limit?: number;
  upcoming?: boolean;
  caseId?: string;
}): Promise<ActionResult<HearingWithCase[]>>;
```

**Returns hearings with joined case information:**
```typescript
{
  success: true,
  data: [
    {
      id: "hearing-uuid",
      caseId: "case-uuid",
      caseTitle: "State vs John Doe",
      date: "2025-11-15T09:30:00Z",
      scheduledTime: "9:30AM",
      actionType: "MENTION",
      status: "scheduled",
      location: "HIGH COURT ROOM NO. 2",
      judgeId: "judge-uuid",
      bailDecision: null,
      createdAt: "2025-11-10T00:00:00Z"
    }
  ]
}
```

#### Get Hearing by ID

```typescript
export async function getHearingById(hearingId: string): Promise<ActionResult<Hearing>>;
```

#### Create Hearing

```typescript
export async function createHearing(formData: FormData): Promise<ActionResult<{ hearingId: string }>>;
```

**Required FormData Fields:**
- `caseId` - Associated case ID
- `scheduledDate` - Hearing date (ISO format)
- `actionType` - Type of hearing action

**Supported Action Types:**
- `MENTION` - Routine case management
- `HEARING` - General hearing
- `TRIAL` - Main trial
- `CONTINUATION OF TRIAL` - Multi-day trial
- `VOIR DIRE HEARING` - Evidence admissibility
- `PRE-TRIAL CONFERENCE` - Pre-trial preparation
- `BAIL HEARING` - Bail consideration
- `RULING` - Decision delivery
- `FIRST CALL` - Initial appearance
- `SENTENCING` - Sentence delivery

**Optional Fields:**
- `scheduledTime` - Time in format "HH:MMAM/PM"
- `estimatedDuration` - Duration in minutes
- `courtRoomId` - Assigned courtroom
- `location` - Location description (fallback)
- `judgeId` - Presiding judge
- `magistrateId` - Magistrate (for magistrates courts)
- `bailConsidered` - Boolean
- `notes` - Additional notes

#### Update Hearing

```typescript
export async function updateHearing(
  hearingId: string,
  formData: FormData
): Promise<ActionResult>;
```

#### Delete Hearing

```typescript
export async function deleteHearing(hearingId: string): Promise<ActionResult>;
```

### Courtroom Management Actions

**File:** `app/dashboard/settings/courtrooms/actions.ts`

#### Get Courtrooms

```typescript
export async function getCourtRooms(filters?: {
  courtLevel?: string;
  isActive?: boolean;
}): Promise<ActionResult<CourtRoom[]>>;
```

**Returns:**
```typescript
{
  success: true,
  data: [
    {
      id: "room-uuid",
      organisationId: "org-uuid",
      name: "HIGH COURT ROOM NO. 2",
      code: "HC-2",
      courtLevel: "high_court",
      location: "Building A, Floor 2",
      capacity: 50,
      isActive: true,
      createdAt: "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Courtroom by ID

```typescript
export async function getCourtRoomById(roomId: string): Promise<ActionResult<CourtRoom>>;
```

#### Create Courtroom

```typescript
export async function createCourtRoom(formData: FormData): Promise<ActionResult<{ roomId: string }>>;
```

**Required FormData Fields:**
- `name` - Courtroom name (e.g., "HIGH COURT ROOM NO. 2")
- `code` - Short code (e.g., "HC-2")
- `courtLevel` - Court level (high_court, magistrates, etc.)

**Optional Fields:**
- `location` - Physical location description
- `capacity` - Seating capacity
- `isActive` - Active status (defaults to true)

#### Update Courtroom

```typescript
export async function updateCourtRoom(
  roomId: string,
  formData: FormData
): Promise<ActionResult>;
```

#### Delete Courtroom

```typescript
export async function deleteCourtRoom(roomId: string): Promise<ActionResult>;
```

### Legal Representatives Actions

**File:** `app/dashboard/settings/legal-representatives/actions.ts`

#### Get Legal Representatives

```typescript
export async function getLegalRepresentatives(filters?: {
  type?: string;
  search?: string;
  isActive?: boolean;
}): Promise<ActionResult<LegalRepresentative[]>>;
```

**Filter Types:**
- `individual` - Individual lawyer
- `law_firm` - Law firm
- `legal_aid` - Legal Aid Commission
- `government` - Government counsel (DPP, etc.)

**Returns:**
```typescript
{
  success: true,
  data: [
    {
      id: "rep-uuid",
      organisationId: "org-uuid",
      name: "LEGAL AID COMMISSION",
      type: "legal_aid",
      firmName: null,
      email: "legal.aid@fiji.gov.fj",
      phone: "+679 123 4567",
      address: "Suva, Fiji",
      practiceAreas: ["criminal", "civil", "family"],
      userId: null,
      isActive: true,
      notes: null,
      createdAt: "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Legal Representative by ID

```typescript
export async function getLegalRepresentativeById(repId: string): Promise<ActionResult<LegalRepresentative>>;
```

#### Create Legal Representative

```typescript
export async function createLegalRepresentative(formData: FormData): Promise<ActionResult<{ repId: string }>>;
```

**Required FormData Fields:**
- `name` - Lawyer or firm name
- `type` - Type (individual, law_firm, legal_aid, government)

**Optional Fields:**
- `firmName` - Law firm name (if individual)
- `email` - Contact email
- `phone` - Contact phone
- `address` - Physical address
- `practiceAreas` - JSON array of practice areas
- `userId` - Linked user account ID
- `notes` - Additional notes

#### Update Legal Representative

```typescript
export async function updateLegalRepresentative(
  repId: string,
  formData: FormData
): Promise<ActionResult>;
```

#### Delete Legal Representative

```typescript
export async function deleteLegalRepresentative(repId: string): Promise<ActionResult>;
```

### Transcript Management Actions

**File:** `app/dashboard/hearings/transcripts/actions.ts`

#### Create Transcript

```typescript
export async function createTranscript(data: {
  caseId: string;
  hearingId: string;
  title: string;
  recordingUrl?: string;
}): Promise<{ success?: boolean; transcript?: Transcript; error?: string }>;
```

**Returns:**
```typescript
{
  success: true,
  transcript: {
    id: "transcript-uuid",
    caseId: "case-uuid",
    hearingId: "hearing-uuid",
    title: "Hearing Transcript - Nov 15, 2025",
    status: "draft",
    recordingUrl: "https://...",
    createdAt: "2025-11-15T00:00:00Z"
  }
}
```

#### Get Transcript Details

```typescript
export async function getTranscriptDetails(transcriptId: string): Promise<{
  success?: boolean;
  transcript?: Transcript;
  speakers?: TranscriptSpeaker[];
  segments?: TranscriptSegment[];
  error?: string;
}>;
```

#### Update Transcript Status

```typescript
export async function updateTranscriptStatus(
  transcriptId: string,
  status: string
): Promise<{ success?: boolean; error?: string }>;
```

**Status Values:**
- `draft` - Initial state
- `in-progress` - Transcription in progress
- `completed` - Transcription finished
- `reviewed` - Reviewed and approved

#### Add Speaker

```typescript
export async function addSpeaker(data: {
  transcriptId: string;
  name: string;
  role: string;
}): Promise<{ success?: boolean; speaker?: TranscriptSpeaker; error?: string }>;
```

**Common Roles:**
- `judge` - Presiding judge
- `prosecutor` - Prosecution counsel
- `defense` - Defense counsel
- `witness` - Witness
- `defendant` - Defendant
- `clerk` - Court clerk
- `other` - Other participant

#### Save Manual Transcript Entries

```typescript
export async function saveManualTranscriptEntries(data: {
  transcriptId: string;
  entries: Array<{
    id: string;
    speakerId: string;
    text: string;
    timestamp: string;
    notes?: string;
  }>;
}): Promise<{ success?: boolean; error?: string }>;
```

**Purpose:** Saves manually typed transcript entries from the ManualTranscriptionEditor component.

#### Auto-Save Manual Transcript

```typescript
export async function autoSaveManualTranscript(data: {
  transcriptId: string;
  entries: Array<{
    id: string;
    speakerId: string;
    text: string;
    timestamp: string;
    notes?: string;
  }>;
}): Promise<{ success?: boolean; error?: string }>;
```

**Purpose:** Auto-save functionality that triggers every 5 seconds during manual transcription.

### Evidence Management Actions

**File:** `app/dashboard/evidence/actions.ts`

#### Get Evidence

```typescript
export async function getEvidence(filters?: {
  caseId?: string;
  type?: string;
  search?: string;
}): Promise<ActionResult<Evidence[]>>;
```

#### Create Evidence

```typescript
export async function createEvidence(formData: FormData): Promise<ActionResult<{ evidenceId: string }>>;
```

#### Update Evidence

```typescript
export async function updateEvidence(
  evidenceId: string,
  formData: FormData
): Promise<ActionResult>;
```

#### Delete Evidence

```typescript
export async function deleteEvidence(evidenceId: string): Promise<ActionResult>;
```

### User Management Actions

**File:** `app/dashboard/users/actions.ts`

#### Get Organisation Members

```typescript
export async function getOrganisationMembers(): Promise<ActionResult<MemberWithUser[]>>;
```

#### Invite User to Organisation

```typescript
export async function inviteUserToOrganisation(
  email: string,
  roleId: string
): Promise<ActionResult<{ invitationId: string }>>;
```

#### Revoke Invitation

```typescript
export async function revokeInvitation(invitationId: string): Promise<ActionResult>;
```

#### Update Member Role

```typescript
export async function updateMemberRole(
  memberId: string,
  roleId: string
): Promise<ActionResult>;
```

#### Remove Member

```typescript
export async function removeMemberFromOrganisation(memberId: string): Promise<ActionResult>;
```

### Join Request Actions

**File:** `app/dashboard/users/requests/actions.ts`

#### Get Join Requests

```typescript
export async function getJoinRequests(filters?: {
  status?: string;
}): Promise<ActionResult<JoinRequest[]>>;
```

#### Approve Join Request

```typescript
export async function approveJoinRequest(
  requestId: string,
  roleId: string
): Promise<ActionResult>;
```

#### Reject Join Request

```typescript
export async function rejectJoinRequest(requestId: string): Promise<ActionResult>;
```

### Search Actions

**File:** `app/dashboard/search/actions.ts`

#### Global Search

```typescript
export async function globalSearch(query: string): Promise<ActionResult<{
  cases: Case[];
  hearings: Hearing[];
  evidence: Evidence[];
}>>;
```

**Returns:** Combined results from cases, hearings, and evidence matching the search query.

### System Admin Actions

**File:** `app/dashboard/system-admin/actions.ts`

**Note:** These actions are restricted to system administrators only.

#### Grant System Admin

```typescript
export async function grantSystemAdmin(userId: string): Promise<ActionResult>;
```

#### Revoke System Admin

```typescript
export async function revokeSystemAdmin(userId: string): Promise<ActionResult>;
```

#### Get All Users (System Admin)

```typescript
export async function getAllUsers(): Promise<ActionResult<User[]>>;
```

#### Get All Organisations (System Admin)

```typescript
export async function getAllOrganisations(): Promise<ActionResult<Organisation[]>>;
```

## Webhooks & Integrations

Currently, Totolaw doesn't expose webhooks, but the architecture supports future integration:

```typescript
// Future: Webhook endpoint
export async function POST(request: NextRequest) {
  const event = await request.json();
  
  // Verify webhook signature
  // Process event
  // Return response
}
```

---

**Next:** [User Management →](06-user-management.md)
