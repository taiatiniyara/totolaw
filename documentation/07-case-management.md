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
  caseNumber: string;            // Display number (e.g., "CR-2025-001")
  title: string;                 // Case title
  description: string;           // Case description
  caseType: string;              // criminal, civil, family, etc.
  status: string;                // open, active, pending, closed
  priority: string;              // low, medium, high, urgent
  
  // Parties
  plaintiffName: string;
  plaintiffContact: string;
  defendantName: string;
  defendantContact: string;
  prosecutorId?: string;         // FK to user
  defenseAttorneyId?: string;    // FK to user
  
  // Assignment
  assignedJudgeId?: string;      // FK to user
  assignedClerkId?: string;      // FK to user
  
  // Dates
  filedDate: Date;
  hearingDate?: Date;
  closedDate?: Date;
  
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
import { cases } from '@/lib/drizzle/schema/case-schema';
import { generateUUID } from '@/lib/services/uuid.service';

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
  const caseType = formData.get('caseType') as string;
  const plaintiffName = formData.get('plaintiffName') as string;
  const defendantName = formData.get('defendantName') as string;

  if (!title || !caseType || !plaintiffName || !defendantName) {
    return { success: false, error: 'Required fields missing' };
  }

  // 5. Generate case number
  const caseNumber = await generateCaseNumber(context.organisationId, caseType);

  // 6. Create case
  const caseId = generateUUID();
  
  await db.insert(cases).values({
    id: caseId,
    organisationId: context.organisationId,
    caseNumber,
    title,
    caseType,
    status: 'open',
    priority: 'medium',
    plaintiffName,
    defendantName,
    filedDate: new Date(),
    createdBy: session.user.id,
  });

  // 7. Log action
  await logAuditAction({
    entityType: 'case',
    entityId: caseId,
    action: 'created',
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  // 8. Revalidate and return
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

---

**Next:** [Deployment Guide →](08-deployment.md)
