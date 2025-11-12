# Case Management

## Overview

Totolaw provides comprehensive case management for tracking legal proceedings from initial filing through resolution and appeals. The system supports the complete case lifecycle with hearings, evidence, documents, verdicts, sentences, and appeals.

## Case Lifecycle

```
Filing
  ↓
Active Investigation
  ↓
Hearings Scheduled
  ↓
Evidence Collection
  ↓
Trial/Proceedings
  ↓
Verdict
  ↓
Sentencing (if guilty)
  ↓
Closed
  ↓
Appeal (optional)
  ↓
Final Resolution
```

## Case Structure

### Case Entity

**Core Information:**
- Case number (unique identifier)
- Title/description
- Case type (criminal, civil, family, etc.)
- Status (open, active, closed, etc.)
- Priority level
- Parties involved (plaintiff, defendant, attorneys)
- Assigned judge/magistrate
- Important dates (filed, hearing, verdict)

**Database Schema:**
```typescript
interface Case {
  id: string;                    // UUID
  organisationId: string;        // Organisation ownership
  
  // Case Identification (Fiji Court System)
  caseNumber: string;            // Auto-generated (e.g., "HAC 179/2024")
  courtLevel: string;            // high_court, magistrates, court_of_appeal, tribunal
  caseType?: string;             // criminal, civil, appeal, family (for high court)
  
  // Basic Information
  title: string;                 // Case title
  description: string;           // Case description
  status: string;                // open, active, pending, closed
  priority: string;              // low, medium, high, urgent
  
  // Parties (Enhanced JSON Structure)
  parties: {
    prosecution?: {
      name: string;              // e.g., "Director of Public Prosecutions"
      legalRepId?: string;       // FK to legal_representatives
      counsel?: string;          // Counsel name
    };
    defence?: {
      name: string;              // Accused/defendant name
      legalRepId?: string;       // FK to legal_representatives
      counsel?: string;          // Defence counsel name
    };
    plaintiff?: {                // For civil cases
      name: string;
      legalRepId?: string;
      counsel?: string;
    };
    defendant?: {                // For civil cases
      name: string;
      legalRepId?: string;
      counsel?: string;
    };
  };
  
  // Criminal Case Details
  offences?: string[];           // Array of offences charged
  
  // Assignment
  assignedJudgeId?: string;      // FK to user
  assignedClerkId?: string;      // FK to user
  
  // Dates
  filedDate: Date;
  hearingDate?: Date;
  closedDate?: Date;
  
  // Verdict & Sentencing
  verdict?: string;              // guilty, not_guilty, dismissed, etc.
  verdictDate?: Date;
  sentence?: string;             // Sentence details (if guilty)
  sentenceDate?: Date;
  
  // Metadata
  tags: string[];                // JSON array
  notes: string;
  
  // Audit
  createdBy: string;             // FK to user
  createdAt: Date;
  updatedAt: Date;
}
```

## Case Operations

### Creating a Case

**UI Location:** `/dashboard/cases/new`

**Server Action:**
```typescript
'use server';

import { db } from '@/lib/drizzle/connection';
import { cases } from '@/lib/drizzle/schema/db-schema';
import { generateCaseNumber } from '@/lib/utils/case-number';

export async function createCase(formData: FormData) {
  // 1. Authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { success: false, error: 'No organisation context' };
  }

  // 3. Permission check
  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:create',
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { success: false, error: 'Permission denied' };
  }

  // 4. Extract and validate data
  const title = formData.get('title') as string;
  const courtLevel = formData.get('courtLevel') as string;
  const caseType = formData.get('caseType') as string;
  const filedDate = new Date(formData.get('filedDate') as string);

  if (!title || !courtLevel || !filedDate) {
    return { success: false, error: 'Required fields missing' };
  }

  // 5. Auto-generate case number based on court level and type
  const year = filedDate.getFullYear();
  const caseNumber = await generateCaseNumber(
    context.organisationId,
    courtLevel,
    caseType,
    year
  );

  // 6. Build parties object
  const parties: any = {};
  
  // Criminal case parties
  if (courtLevel === 'high_court' && caseType === 'criminal') {
    parties.prosecution = {
      name: formData.get('prosecutionName') as string || 'Director of Public Prosecutions',
      legalRepId: formData.get('prosecutionLegalRepId') as string || null,
      counsel: formData.get('prosecutionCounsel') as string || null,
    };
    parties.defence = {
      name: formData.get('defenceName') as string,
      legalRepId: formData.get('defenceLegalRepId') as string || null,
      counsel: formData.get('defenceCounsel') as string || null,
    };
  }
  
  // Civil case parties
  if (caseType === 'civil') {
    parties.plaintiff = {
      name: formData.get('plaintiffName') as string,
      legalRepId: formData.get('plaintiffLegalRepId') as string || null,
      counsel: formData.get('plaintiffCounsel') as string || null,
    };
    parties.defendant = {
      name: formData.get('defendantName') as string,
      legalRepId: formData.get('defendantLegalRepId') as string || null,
      counsel: formData.get('defendantCounsel') as string || null,
    };
  }

  // 7. Extract offences (for criminal cases)
  const offencesStr = formData.get('offences') as string;
  const offences = offencesStr ? offencesStr.split(',').map(o => o.trim()) : [];

  // 8. Create case
  const caseId = crypto.randomUUID();
  
  await db.insert(cases).values({
    id: caseId,
    organisationId: context.organisationId,
    caseNumber,
    courtLevel,
    caseType: caseType || null,
    title,
    description: formData.get('description') as string || null,
    parties,
    offences: offences.length > 0 ? offences : null,
    status: 'open',
    priority: 'medium',
    filedDate,
    assignedJudgeId: formData.get('assignedJudgeId') as string || null,
    createdBy: session.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 9. Log action
  await logAuditAction({
    entityType: 'case',
    entityId: caseId,
    action: 'created',
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  // 10. Revalidate and return
  revalidatePath('/dashboard/cases');
  return {
    success: true,
    data: { caseId, caseNumber }
  };
}
```

### Viewing a Case

**UI Location:** `/dashboard/cases/[caseId]`

**Server Component:**
```typescript
export default async function CaseDetailsPage({
  params
}: {
  params: { caseId: string }
}) {
  // Authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    redirect('/dashboard/no-organisation');
  }

  // Fetch case
  const caseData = await db
    .select()
    .from(cases)
    .where(
      and(
        eq(cases.id, params.caseId),
        eq(cases.organisationId, context.organisationId)
      )
    )
    .limit(1);

  if (!caseData[0]) {
    notFound();
  }

  // Check permission
  const canView = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:read',
    context.isSuperAdmin
  );

  if (!canView) {
    redirect('/dashboard/access-denied');
  }

  // Fetch related data
  const hearings = await getHearingsForCase(params.caseId);
  const evidence = await getEvidenceForCase(params.caseId);
  const documents = await getDocumentsForCase(params.caseId);

  return (
    <div>
      <CaseHeader case={caseData[0]} />
      <CaseTimeline case={caseData[0]} />
      <HearingsList hearings={hearings} />
      <EvidenceList evidence={evidence} />
      <DocumentsList documents={documents} />
    </div>
  );
}
```

### Updating a Case

**Server Action:**
```typescript
'use server';

export async function updateCase(
  caseId: string,
  updates: Partial<Case>
) {
  // Authentication & authorization
  // ...

  // Update case
  await db
    .update(cases)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(cases.id, caseId),
        eq(cases.organisationId, context.organisationId)
      )
    );

  // Log action
  await logAuditAction({
    entityType: 'case',
    entityId: caseId,
    action: 'updated',
    changes: JSON.stringify(updates),
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}
```

### Closing a Case

**Server Action:**
```typescript
'use server';

export async function closeCase(
  caseId: string,
  closureNotes?: string
) {
  // Authentication & authorization
  // ...

  // Check permission
  const canClose = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:close',
    context.isSuperAdmin
  );

  if (!canClose) {
    return { success: false, error: 'Permission denied' };
  }

  // Close case
  await db
    .update(cases)
    .set({
      status: 'closed',
      closedDate: new Date(),
      notes: closureNotes,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(cases.id, caseId),
        eq(cases.organisationId, context.organisationId)
      )
    );

  // Log action
  await logAuditAction({
    entityType: 'case',
    entityId: caseId,
    action: 'closed',
    description: 'Case closed',
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}
```

## Hearings Management

### Hearing Structure

```typescript
interface Hearing {
  id: string;
  caseId: string;                // FK to case
  organisationId: string;
  
  // Schedule
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;              // minutes
  location: string;              // courtroom
  
  // Type
  hearingType: string;           // preliminary, trial, sentencing, appeal
  status: string;                // scheduled, in-progress, completed, cancelled
  
  // Participants
  judgeId?: string;
  attendees: string[];           // JSON array of user IDs
  
  // Results
  outcome?: string;
  minutes?: string;              // hearing minutes/notes
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Scheduling a Hearing

**Server Action:**
```typescript
'use server';

export async function scheduleHearing(
  caseId: string,
  hearingData: HearingInput
) {
  // Authentication & authorization
  // ...

  // Check permission
  const canSchedule = await hasPermission(
    session.user.id,
    context.organisationId,
    'hearings:schedule',
    context.isSuperAdmin
  );

  if (!canSchedule) {
    return { success: false, error: 'Permission denied' };
  }

  // Validate date/time
  const scheduledDate = new Date(hearingData.date);
  if (scheduledDate < new Date()) {
    return { success: false, error: 'Cannot schedule in the past' };
  }

  // Check for conflicts
  const conflicts = await checkHearingConflicts(
    hearingData.judgeId,
    scheduledDate,
    hearingData.time
  );

  if (conflicts.length > 0) {
    return { 
      success: false, 
      error: 'Judge has conflicting hearing at this time' 
    };
  }

  // Create hearing
  const hearingId = generateUUID();
  
  await db.insert(hearings).values({
    id: hearingId,
    caseId,
    organisationId: context.organisationId,
    scheduledDate,
    scheduledTime: hearingData.time,
    duration: hearingData.duration || 60,
    location: hearingData.location,
    hearingType: hearingData.type,
    status: 'scheduled',
    judgeId: hearingData.judgeId,
    createdBy: session.user.id,
  });

  // Send notifications
  await notifyHearingParticipants(hearingId, caseId);

  // Log action
  await logAuditAction({
    entityType: 'hearing',
    entityId: hearingId,
    action: 'scheduled',
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true, data: { hearingId } };
}
```

### Calendar View

**UI Location:** `/dashboard/hearings/calendar`

Displays upcoming hearings in calendar format:
- Monthly view with hearing dots
- Daily view with time slots
- Filter by judge, courtroom, case type
- Click to view hearing details

## Evidence Management

### Evidence Structure

```typescript
interface Evidence {
  id: string;
  caseId: string;
  hearingId?: string;            // Optional: linked to hearing
  organisationId: string;
  
  // Details
  evidenceNumber: string;        // E-001, E-002, etc.
  title: string;
  description: string;
  evidenceType: string;          // document, physical, digital, testimony
  
  // Storage
  location?: string;             // physical location
  fileUrl?: string;              // digital file
  fileType?: string;
  fileSize?: number;
  
  // Chain of custody
  collectedBy: string;           // FK to user
  collectedDate: Date;
  submittedBy: string;           // FK to user
  submittedDate: Date;
  
  // Status
  status: string;                // pending, admitted, rejected
  admittedBy?: string;
  admittedDate?: Date;
  
  // Metadata
  tags: string[];
  notes: string;
  
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Submitting Evidence

**Server Action:**
```typescript
'use server';

export async function submitEvidence(
  caseId: string,
  formData: FormData
) {
  // Authentication & authorization
  // ...

  // Extract data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const evidenceType = formData.get('evidenceType') as string;
  const file = formData.get('file') as File;

  // Validate
  if (!title || !evidenceType) {
    return { success: false, error: 'Required fields missing' };
  }

  // Generate evidence number
  const evidenceNumber = await generateEvidenceNumber(caseId);

  // Upload file (if provided)
  let fileUrl, fileType, fileSize;
  if (file && file.size > 0) {
    const uploadResult = await uploadFile(file, caseId);
    fileUrl = uploadResult.url;
    fileType = file.type;
    fileSize = file.size;
  }

  // Create evidence record
  const evidenceId = generateUUID();
  
  await db.insert(evidence).values({
    id: evidenceId,
    caseId,
    organisationId: context.organisationId,
    evidenceNumber,
    title,
    description,
    evidenceType,
    fileUrl,
    fileType,
    fileSize,
    status: 'pending',
    submittedBy: session.user.id,
    submittedDate: new Date(),
    createdBy: session.user.id,
  });

  // Log action
  await logAuditAction({
    entityType: 'evidence',
    entityId: evidenceId,
    action: 'submitted',
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true, data: { evidenceId } };
}
```

### Chain of Custody

Track evidence handling:
```typescript
interface EvidenceLog {
  id: string;
  evidenceId: string;
  action: string;               // collected, transferred, examined, admitted
  performedBy: string;
  timestamp: Date;
  location?: string;
  notes?: string;
}
```

## Document Management

### Document Structure

```typescript
interface Document {
  id: string;
  caseId: string;
  organisationId: string;
  
  // Details
  title: string;
  documentType: string;         // pleading, motion, order, brief, etc.
  description?: string;
  
  // File
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  
  // Status
  status: string;               // draft, filed, approved, rejected
  
  // Metadata
  filedDate?: Date;
  filedBy?: string;
  
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Uploading Documents

**Server Action:**
```typescript
'use server';

export async function uploadDocument(
  caseId: string,
  formData: FormData
) {
  // Authentication & authorization
  // ...

  // Extract file
  const file = formData.get('file') as File;
  const documentType = formData.get('documentType') as string;
  const title = formData.get('title') as string;

  // Validate
  if (!file || !documentType || !title) {
    return { success: false, error: 'Required fields missing' };
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Invalid file type' };
  }

  // Upload file
  const uploadResult = await uploadFile(file, caseId);

  // Create document record
  const documentId = generateUUID();
  
  await db.insert(documents).values({
    id: documentId,
    caseId,
    organisationId: context.organisationId,
    title,
    documentType,
    fileUrl: uploadResult.url,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    status: 'filed',
    filedDate: new Date(),
    filedBy: session.user.id,
    createdBy: session.user.id,
  });

  // Log action
  await logAuditAction({
    entityType: 'document',
    entityId: documentId,
    action: 'uploaded',
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true, data: { documentId } };
}
```

## Search Functionality

### Global Case Search

**UI Location:** `/dashboard/search`

**Search Query:**
```typescript
export async function searchCases(
  query: string,
  filters?: SearchFilters
) {
  // Authentication & context
  // ...

  const results = await db
    .select()
    .from(cases)
    .where(
      and(
        eq(cases.organisationId, context.organisationId),
        or(
          like(cases.caseNumber, `%${query}%`),
          like(cases.title, `%${query}%`),
          like(cases.plaintiffName, `%${query}%`),
          like(cases.defendantName, `%${query}%`)
        ),
        // Apply filters
        filters?.status ? eq(cases.status, filters.status) : undefined,
        filters?.caseType ? eq(cases.caseType, filters.caseType) : undefined
      )
    )
    .orderBy(desc(cases.filedDate));

  return results;
}
```

### Search Features

- **Full-text search** across case details
- **Filters:** Status, type, date range, assigned judge
- **Sorting:** By date, case number, priority
- **Pagination:** For large result sets
- **Saved searches:** Store frequent search queries

## Case Statistics

### Dashboard Statistics

**UI Location:** `/dashboard` (homepage)

**Metrics:**
- Total cases
- Cases by status (open, active, closed)
- Cases by type
- Upcoming hearings
- Pending evidence reviews
- Recent activity

**Query:**
```typescript
export async function getCaseStatistics(organisationId: string) {
  const stats = await db
    .select({
      status: cases.status,
      count: count(cases.id)
    })
    .from(cases)
    .where(eq(cases.organisationId, organisationId))
    .groupBy(cases.status);

  return stats;
}
```

## Case Timeline

Visual representation of case events:
- Case filed
- Hearings scheduled/completed
- Evidence submitted
- Documents filed
- Verdicts issued
- Sentences handed down
- Appeals filed

**Component:**
```typescript
export function CaseTimeline({ caseId }: { caseId: string }) {
  const events = await getCaseEvents(caseId);

  return (
    <div className="timeline">
      {events.map(event => (
        <TimelineEvent key={event.id} event={event} />
      ))}
    </div>
  );
}
```

## Reports & Export

### Generate Case Report

Export case details as PDF or CSV:
- Case summary
- All hearings
- Evidence list
- Document list
- Timeline of events

### Bulk Export

Export multiple cases:
- Filter by criteria
- Select fields to include
- Choose format (PDF, CSV, Excel)
- Download archive

## Parties Management

### Parties Structure

Cases support different party structures based on case type:

#### Criminal Cases

```typescript
parties: {
  prosecution: {
    name: "Director of Public Prosecutions",
    legalRepId: "rep-uuid-1",     // Link to legal_representatives
    counsel: "John Smith",         // Prosecuting counsel name
  },
  defence: {
    name: "John Doe",              // Accused name
    legalRepId: "rep-uuid-2",
    counsel: "Jane Williams",      // Defence counsel name
  }
}
```

#### Civil Cases

```typescript
parties: {
  plaintiff: {
    name: "Jane Smith",
    legalRepId: "rep-uuid-1",
    counsel: "Robert Jones",
  },
  defendant: {
    name: "ABC Corporation Ltd",
    legalRepId: "rep-uuid-2",
    counsel: "Sarah Brown",
  }
}
```

### Managing Parties

**Update Case Parties:**

```typescript
'use server';

export async function updateCaseParties(
  caseId: string,
  parties: CaseParties
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canUpdate = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:update',
    context.isSuperAdmin
  );

  if (!canUpdate) {
    return { success: false, error: 'Permission denied' };
  }

  // Update parties
  await db
    .update(cases)
    .set({
      parties,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, cases, [
        eq(cases.id, caseId),
      ])
    );

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}
```

### Displaying Parties

**UI Component:**

```tsx
export function CaseParties({ caseData }: { caseData: Case }) {
  const { parties } = caseData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Prosecution (Criminal) */}
          {parties.prosecution && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">
                Prosecution
              </h4>
              <p className="font-medium">{parties.prosecution.name}</p>
              {parties.prosecution.counsel && (
                <p className="text-sm text-muted-foreground">
                  Counsel: {parties.prosecution.counsel}
                </p>
              )}
            </div>
          )}

          {/* Defence (Criminal) */}
          {parties.defence && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">
                Defence
              </h4>
              <p className="font-medium">{parties.defence.name}</p>
              {parties.defence.counsel && (
                <p className="text-sm text-muted-foreground">
                  Counsel: {parties.defence.counsel}
                </p>
              )}
            </div>
          )}

          {/* Plaintiff (Civil) */}
          {parties.plaintiff && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">
                Plaintiff
              </h4>
              <p className="font-medium">{parties.plaintiff.name}</p>
              {parties.plaintiff.counsel && (
                <p className="text-sm text-muted-foreground">
                  Counsel: {parties.plaintiff.counsel}
                </p>
              )}
            </div>
          )}

          {/* Defendant (Civil) */}
          {parties.defendant && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">
                Defendant
              </h4>
              <p className="font-medium">{parties.defendant.name}</p>
              {parties.defendant.counsel && (
                <p className="text-sm text-muted-foreground">
                  Counsel: {parties.defendant.counsel}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Linking Legal Representatives

When creating or editing parties, link to legal representatives:

```tsx
<FormField
  label="Defence Counsel"
  name="defenceLegalRepId"
  type="select"
  options={legalReps.map(rep => ({
    value: rep.id,
    label: `${rep.name}${rep.firmName ? ` (${rep.firmName})` : ''}`,
  }))}
  helpText="Select from registered legal representatives"
/>
```

## Offences Tracking

### Offences Field

Criminal cases can track multiple offences charged:

```typescript
offences: [
  "Murder contrary to Section 237 of the Crimes Act 2009",
  "Unlawful Possession of Illicit Drugs contrary to Section 5(a) of the Illicit Drugs Control Act 2004",
  "Assault Causing Actual Bodily Harm contrary to Section 275 of the Crimes Act 2009"
]
```

### Adding Offences

**Server Action:**

```typescript
'use server';

export async function addOffence(
  caseId: string,
  offence: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Get current offences
  const [caseData] = await db
    .select()
    .from(cases)
    .where(
      withOrgFilter(context.organisationId, cases, [
        eq(cases.id, caseId),
      ])
    )
    .limit(1);

  if (!caseData) {
    return { success: false, error: 'Case not found' };
  }

  // Add new offence
  const currentOffences = (caseData.offences as string[]) || [];
  const updatedOffences = [...currentOffences, offence];

  await db
    .update(cases)
    .set({
      offences: updatedOffences,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, cases, [
        eq(cases.id, caseId),
      ])
    );

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}
```

### Displaying Offences

```tsx
export function CaseOffences({ offences }: { offences: string[] }) {
  if (!offences || offences.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offences Charged</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2">
          {offences.map((offence, index) => (
            <li key={index} className="text-sm">
              {offence}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
```

### Common Fiji Offences

**Criminal Offences:**
- Murder (Section 237, Crimes Act 2009)
- Manslaughter (Section 239, Crimes Act 2009)
- Rape (Section 207, Crimes Act 2009)
- Aggravated Robbery (Section 311, Crimes Act 2009)
- Theft (Section 291, Crimes Act 2009)
- Assault Causing Actual Bodily Harm (Section 275, Crimes Act 2009)
- Unlawful Possession of Illicit Drugs (Illicit Drugs Control Act 2004)
- Money Laundering (Financial Transactions Reporting Act 2004)

## Court Hierarchy Integration

### Court Levels

Cases are categorized by court level:

| Level | Code | Description |
|-------|------|-------------|
| **High Court** | `high_court` | Superior court for serious matters |
| **Magistrates Court** | `magistrates` | Lower court for minor matters |
| **Court of Appeal** | `court_of_appeal` | Appellate court |
| **Tribunal** | `tribunal` | Specialized tribunals |

### Court Types (High Court)

High Court cases are further divided:

| Type | Code | Description |
|------|------|-------------|
| **Criminal** | `criminal` | Criminal prosecutions |
| **Civil** | `civil` | Civil disputes |
| **Appeal** | `appeal` | Appeals from lower courts |
| **Family** | `family` | Family law matters |

### Case Number Formats by Court

Cases are automatically assigned numbers based on court level:

```typescript
// High Court Criminal
"HAC 179/2024"  // High Court Criminal

// High Court Civil
"HBC 188/2023"  // High Court Civil

// High Court Appeal
"HAA 19/2025"   // High Court Appeal

// Court of Appeal
"ABU 002/20"    // Court of Appeal

// Magistrates Court
"707/21"        // No prefix

// Tribunal
"C & ED 03/2025"  // Agricultural Tribunal
"SCT 045/25"      // Small Claims Tribunal
```

See: [Case Number Generation Documentation](15-case-number-generation.md)

### Filtering by Court Level

```typescript
export async function getCasesByCourtLevel(
  courtLevel: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const results = await db
    .select()
    .from(cases)
    .where(
      withOrgFilter(context.organisationId, cases, [
        eq(cases.courtLevel, courtLevel),
      ])
    )
    .orderBy(desc(cases.filedDate));

  return { success: true, data: results };
}
```

### Court Hierarchy UI

Display cases organized by court level:

```tsx
export function CasesByCourtLevel() {
  const [courtLevel, setCourtLevel] = useState('high_court');
  const [cases, setCases] = useState([]);

  useEffect(() => {
    async function fetchCases() {
      const result = await getCasesByCourtLevel(courtLevel);
      if (result.success) {
        setCases(result.data);
      }
    }
    fetchCases();
  }, [courtLevel]);

  return (
    <div>
      <Tabs value={courtLevel} onValueChange={setCourtLevel}>
        <TabsList>
          <TabsTrigger value="high_court">High Court</TabsTrigger>
          <TabsTrigger value="magistrates">Magistrates</TabsTrigger>
          <TabsTrigger value="court_of_appeal">Court of Appeal</TabsTrigger>
          <TabsTrigger value="tribunal">Tribunal</TabsTrigger>
        </TabsList>
        
        <TabsContent value={courtLevel}>
          <CasesList cases={cases} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Case Number Generation

### Automatic Generation

Case numbers are automatically generated when creating a case:

```typescript
import { generateCaseNumber } from '@/lib/utils/case-number';

// Generate High Court Criminal case number
const caseNumber = await generateCaseNumber(
  organisationId,
  'high_court',
  'criminal',
  2025
);
// Returns: "HAC 001/2025"

// Generate Magistrates case number
const magNumber = await generateCaseNumber(
  organisationId,
  'magistrates',
  undefined,
  2025
);
// Returns: "1/25"
```

### Sequential Numbering

Case numbers are sequential within each court/type/year:

```
HAC 001/2025  ← First High Court Criminal case of 2025
HAC 002/2025  ← Second
HAC 003/2025  ← Third
...
```

### Validation

Validate case number format:

```typescript
import { validateCaseNumber } from '@/lib/utils/case-number';

const isValid = validateCaseNumber(
  "HAC 179/2024",
  "high_court",
  "criminal"
);
// Returns: true

const isInvalid = validateCaseNumber(
  "HBC 179/2024",  // Wrong prefix
  "high_court",
  "criminal"
);
// Returns: false
```

### Parsing Case Numbers

Extract components from case numbers:

```typescript
import { parseCaseNumber } from '@/lib/utils/case-number';

const parsed = parseCaseNumber("HAC 179/2024");
// Returns: {
//   prefix: "HAC",
//   sequence: 179,
//   year: 2024
// }
```

## Best Practices

### 1. Always Filter by Organisation
```typescript
.where(
  and(
    eq(cases.id, caseId),
    eq(cases.organisationId, context.organisationId)
  )
)
```

### 2. Check Permissions Before Actions
```typescript
const canEdit = await hasPermission(
  userId,
  organisationId,
  'cases:update',
  isSuperAdmin
);
```

### 3. Maintain Audit Trail
Log all significant actions on cases.

### 4. Validate File Uploads
Check file types and sizes before accepting.

### 5. Handle Concurrent Updates
Use optimistic locking or version fields.

### 6. Revalidate Cache
After mutations, revalidate affected paths.

### 7. Auto-Generate Case Numbers
Never allow manual case number entry - always use `generateCaseNumber()`.

### 8. Link Legal Representatives
Use `legalRepId` to link parties to the legal representatives directory.

### 9. Track Offences Properly
For criminal cases, always specify the full offence details including relevant sections.

### 10. Respect Court Hierarchy
Ensure cases are filed at the appropriate court level based on jurisdiction.

## Related Documentation

- [Case Number Generation](15-case-number-generation.md)
- [Legal Representatives System](17-legal-representatives.md)
- [Daily Cause Lists](18-daily-cause-lists.md)
- [Hearing Management](10-hearing-management.md)
- [Database Schema - Cases](03-database-schema.md#cases)

---

**Next:** [Deployment Guide →](08-deployment.md)
