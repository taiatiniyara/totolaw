# Hearing Management

## Overview

The Hearing Management system schedules, tracks, and manages court hearings throughout the case lifecycle. Enhanced for Fiji courts with specific hearing action types, bail tracking, courtroom assignments, and transcript linking.

## Purpose

- **Scheduling** - Schedule hearings with dates, times, and courtrooms
- **Action Types** - Track specific types of court proceedings
- **Courtroom Management** - Assign hearings to specific courtrooms
- **Judicial Assignment** - Assign judges/magistrates to hearings
- **Bail Tracking** - Monitor bail status and conditions
- **Transcript Linking** - Connect hearings to transcripts
- **Notifications** - Notify parties of scheduled hearings

## Database Schema

### Table: `hearings`

```sql
CREATE TABLE hearings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  
  -- Scheduling
  scheduled_date TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 60,
  
  -- Action Type (Fiji Court System)
  action_type VARCHAR(50) NOT NULL,
  
  -- Location & Assignment
  court_room_id UUID REFERENCES court_rooms(id) ON DELETE SET NULL,
  judge_id UUID REFERENCES user(id) ON DELETE SET NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  
  -- Bail Information
  bail_status VARCHAR(50),
  bail_amount DECIMAL(12,2),
  bail_conditions TEXT,
  
  -- Outcome
  outcome TEXT,
  orders TEXT,
  next_hearing_date TIMESTAMP,
  
  -- Transcript
  transcript_id UUID REFERENCES transcripts(id) ON DELETE SET NULL,
  
  -- Notes
  notes TEXT,
  special_requirements TEXT,
  
  -- Audit
  created_by UUID REFERENCES user(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX hearing_org_idx ON hearings(organisation_id);
CREATE INDEX hearing_case_idx ON hearings(case_id);
CREATE INDEX hearing_date_idx ON hearings(scheduled_date);
CREATE INDEX hearing_court_room_idx ON hearings(court_room_id);
CREATE INDEX hearing_judge_idx ON hearings(judge_id);
CREATE INDEX hearing_action_type_idx ON hearings(action_type);
CREATE INDEX hearing_status_idx ON hearings(status);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `organisation_id` | UUID | Court organisation |
| `case_id` | UUID | Associated case |
| `scheduled_date` | TIMESTAMP | Date and time of hearing |
| `duration` | INTEGER | Duration in minutes (default 60) |
| `action_type` | VARCHAR | Type of hearing action (see below) |
| `court_room_id` | UUID | Assigned courtroom |
| `judge_id` | UUID | Presiding judge/magistrate |
| `status` | VARCHAR | Status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED |
| `bail_status` | VARCHAR | Bail status: GRANTED, DENIED, REVOKED, VARIED |
| `bail_amount` | DECIMAL | Bail amount (if granted) |
| `bail_conditions` | TEXT | Bail conditions |
| `outcome` | TEXT | Hearing outcome summary |
| `orders` | TEXT | Court orders issued |
| `next_hearing_date` | TIMESTAMP | Next scheduled hearing date |
| `transcript_id` | UUID | Link to transcript |
| `notes` | TEXT | Internal notes |
| `special_requirements` | TEXT | Special requirements (interpreter, accessibility, etc.) |
| `created_by` | UUID | User who created hearing |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Action Types

### Fiji Court Hearing Types

| Action Type | Description | Typical Duration |
|-------------|-------------|------------------|
| **MENTION** | Routine case management hearing | 15-30 minutes |
| **HEARING** | General hearing (unspecified type) | 60 minutes |
| **TRIAL** | Full trial proceeding | 4-8 hours |
| **CONTINUATION OF TRIAL** | Multi-day trial continuation | 4-8 hours |
| **VOIR DIRE HEARING** | Admissibility hearing | 1-2 hours |
| **PRE-TRIAL CONFERENCE** | Pre-trial preparation meeting | 30-60 minutes |
| **RULING** | Delivery of judgment/ruling | 30 minutes |
| **FIRST CALL** | Initial case appearance | 15 minutes |
| **BAIL HEARING** | Bail application hearing | 30-60 minutes |
| **SENTENCING** | Sentence delivery | 30-60 minutes |
| **CASE MANAGEMENT** | Case status and scheduling | 15-30 minutes |

### Usage Examples

```typescript
// MENTION - Routine case management
{
  actionType: "MENTION",
  duration: 15,
  notes: "Status update and next steps",
}

// TRIAL - Full trial
{
  actionType: "TRIAL",
  duration: 480,  // 8 hours
  specialRequirements: "Witness list: 5 prosecution, 2 defence",
}

// BAIL HEARING - Bail application
{
  actionType: "BAIL HEARING",
  duration: 60,
  bailStatus: "PENDING",
}

// SENTENCING - Sentence delivery
{
  actionType: "SENTENCING",
  duration: 45,
  notes: "Pre-sentence report available",
}
```

## Hearing Status

### Status Workflow

```
SCHEDULED
    ↓
IN_PROGRESS
    ↓
┌───┴───┐
↓       ↓
COMPLETED  POSTPONED
           ↓
        RESCHEDULED
```

**Status Types:**

| Status | Description | Editable | Next Actions |
|--------|-------------|----------|--------------|
| **SCHEDULED** | Future hearing | ✅ Yes | Start, Cancel, Postpone |
| **IN_PROGRESS** | Currently happening | ❌ No | Complete |
| **COMPLETED** | Finished | ❌ No | View outcome |
| **CANCELLED** | Cancelled | ❌ No | None |
| **POSTPONED** | Postponed to later date | ✅ Yes | Reschedule |

## Creating Hearings

### Schedule Hearing

**Server Action:**

```typescript
'use server';

import { db } from '@/lib/drizzle/connection';
import { hearings } from '@/lib/drizzle/schema/db-schema';

export async function scheduleHearing(data: {
  caseId: string;
  scheduledDate: Date;
  actionType: string;
  courtRoomId?: string;
  judgeId?: string;
  duration?: number;
  specialRequirements?: string;
}): Promise<ActionResult> {
  // 1. Authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context?.organisationId) {
    return { success: false, error: 'No organisation context' };
  }

  // 3. Permission check
  const canSchedule = await hasPermission(
    session.user.id,
    context.organisationId,
    'hearings:create',
    context.isSuperAdmin
  );

  if (!canSchedule) {
    return { success: false, error: 'Permission denied' };
  }

  // 4. Validate scheduled date
  if (data.scheduledDate < new Date()) {
    return { success: false, error: 'Cannot schedule in the past' };
  }

  // 5. Check for conflicts (if judge assigned)
  if (data.judgeId) {
    const conflicts = await checkJudgeConflicts(
      data.judgeId,
      data.scheduledDate,
      data.duration || 60
    );

    if (conflicts.length > 0) {
      return {
        success: false,
        error: 'Judge has conflicting hearing at this time',
      };
    }
  }

  // 6. Check courtroom availability
  if (data.courtRoomId) {
    const isAvailable = await checkCourtRoomAvailability(
      data.courtRoomId,
      data.scheduledDate,
      data.duration || 60
    );

    if (!isAvailable) {
      return {
        success: false,
        error: 'Courtroom not available at this time',
      };
    }
  }

  // 7. Create hearing
  const hearingId = crypto.randomUUID();

  const [hearing] = await db
    .insert(hearings)
    .values({
      id: hearingId,
      organisationId: context.organisationId,
      caseId: data.caseId,
      scheduledDate: data.scheduledDate,
      actionType: data.actionType,
      courtRoomId: data.courtRoomId || null,
      judgeId: data.judgeId || null,
      duration: data.duration || 60,
      status: 'SCHEDULED',
      specialRequirements: data.specialRequirements || null,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // 8. Send notifications
  await notifyHearingParticipants(hearingId);

  // 9. Log action
  await logAuditAction({
    entityType: 'hearing',
    entityId: hearingId,
    action: 'scheduled',
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  revalidatePath(`/dashboard/cases/${data.caseId}`);
  revalidatePath('/dashboard/hearings');

  return { success: true, data: hearing };
}
```

### Form Component

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { scheduleHearing } from './actions';

export function ScheduleHearingForm({ 
  caseId, 
  courtRooms, 
  judges 
}: { 
  caseId: string;
  courtRooms: CourtRoom[];
  judges: User[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = {
      caseId,
      scheduledDate: new Date(formData.get('scheduledDate') as string),
      actionType: formData.get('actionType') as string,
      courtRoomId: formData.get('courtRoomId') as string || undefined,
      judgeId: formData.get('judgeId') as string || undefined,
      duration: parseInt(formData.get('duration') as string) || 60,
      specialRequirements: formData.get('specialRequirements') as string || undefined,
    };

    const result = await scheduleHearing(data);

    if (result.success) {
      router.push(`/dashboard/cases/${caseId}`);
    } else {
      alert(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormField
        label="Scheduled Date & Time"
        name="scheduledDate"
        type="datetime-local"
        required
        min={new Date().toISOString().slice(0, 16)}
      />

      <FormField
        label="Action Type"
        name="actionType"
        type="select"
        required
        options={[
          { value: 'MENTION', label: 'Mention' },
          { value: 'HEARING', label: 'Hearing' },
          { value: 'TRIAL', label: 'Trial' },
          { value: 'CONTINUATION OF TRIAL', label: 'Continuation of Trial' },
          { value: 'VOIR DIRE HEARING', label: 'Voir Dire Hearing' },
          { value: 'PRE-TRIAL CONFERENCE', label: 'Pre-Trial Conference' },
          { value: 'RULING', label: 'Ruling' },
          { value: 'FIRST CALL', label: 'First Call' },
          { value: 'BAIL HEARING', label: 'Bail Hearing' },
          { value: 'SENTENCING', label: 'Sentencing' },
          { value: 'CASE MANAGEMENT', label: 'Case Management' },
        ]}
      />

      <FormField
        label="Duration (minutes)"
        name="duration"
        type="number"
        defaultValue="60"
        min="15"
        step="15"
      />

      <FormField
        label="Courtroom"
        name="courtRoomId"
        type="select"
        placeholder="Select courtroom"
        options={courtRooms.map(cr => ({
          value: cr.id,
          label: `${cr.name} - ${cr.code}`,
        }))}
      />

      <FormField
        label="Presiding Judge/Magistrate"
        name="judgeId"
        type="select"
        placeholder="Select judicial officer"
        options={judges.map(j => ({
          value: j.id,
          label: `${j.judicialTitle} ${j.name}`,
        }))}
      />

      <FormField
        label="Special Requirements"
        name="specialRequirements"
        type="textarea"
        placeholder="Interpreter, accessibility needs, witness list, etc."
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Hearing'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

## Bail Management

### Bail Status Types

| Status | Description |
|--------|-------------|
| **PENDING** | Bail application pending |
| **GRANTED** | Bail granted with conditions |
| **DENIED** | Bail application denied |
| **REVOKED** | Previously granted bail revoked |
| **VARIED** | Bail conditions modified |
| **SURRENDERED** | Accused surrendered to custody |

### Recording Bail Decision

```typescript
'use server';

export async function recordBailDecision(
  hearingId: string,
  data: {
    bailStatus: string;
    bailAmount?: number;
    bailConditions?: string;
    notes?: string;
  }
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canUpdate = await hasPermission(
    session.user.id,
    context.organisationId,
    'hearings:update',
    context.isSuperAdmin
  );

  if (!canUpdate) {
    return { success: false, error: 'Permission denied' };
  }

  // Update hearing with bail information
  const [updated] = await db
    .update(hearings)
    .set({
      bailStatus: data.bailStatus,
      bailAmount: data.bailAmount || null,
      bailConditions: data.bailConditions || null,
      notes: data.notes || null,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.id, hearingId),
      ])
    )
    .returning();

  // Log bail decision
  await logAuditAction({
    entityType: 'hearing',
    entityId: hearingId,
    action: 'bail_decision',
    description: `Bail ${data.bailStatus.toLowerCase()}`,
    performedBy: session.user.id,
    organisationId: context.organisationId,
  });

  revalidatePath(`/dashboard/hearings/${hearingId}`);

  return { success: true, data: updated };
}
```

### Bail Display Component

```tsx
export function BailInformation({ hearing }: { hearing: Hearing }) {
  if (!hearing.bailStatus) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bail Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={
              hearing.bailStatus === 'GRANTED' ? 'default' :
              hearing.bailStatus === 'DENIED' ? 'destructive' :
              hearing.bailStatus === 'REVOKED' ? 'destructive' :
              'secondary'
            }>
              {hearing.bailStatus}
            </Badge>
          </div>

          {hearing.bailAmount && (
            <div>
              <p className="text-sm text-muted-foreground">Bail Amount</p>
              <p className="font-medium">
                FJD {hearing.bailAmount.toLocaleString()}
              </p>
            </div>
          )}

          {hearing.bailConditions && (
            <div>
              <p className="text-sm text-muted-foreground">Conditions</p>
              <p className="text-sm whitespace-pre-wrap">
                {hearing.bailConditions}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Courtroom Assignment

### Assigning Courtroom

```typescript
'use server';

export async function assignCourtroom(
  hearingId: string,
  courtRoomId: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check availability
  const [hearing] = await db
    .select()
    .from(hearings)
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.id, hearingId),
      ])
    )
    .limit(1);

  if (!hearing) {
    return { success: false, error: 'Hearing not found' };
  }

  const isAvailable = await checkCourtRoomAvailability(
    courtRoomId,
    hearing.scheduledDate,
    hearing.duration
  );

  if (!isAvailable) {
    return {
      success: false,
      error: 'Courtroom not available at this time',
    };
  }

  // Assign courtroom
  await db
    .update(hearings)
    .set({
      courtRoomId,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.id, hearingId),
      ])
    );

  revalidatePath(`/dashboard/hearings/${hearingId}`);

  return { success: true };
}
```

### Checking Availability

```typescript
async function checkCourtRoomAvailability(
  courtRoomId: string,
  scheduledDate: Date,
  duration: number
): Promise<boolean> {
  const startTime = scheduledDate;
  const endTime = new Date(scheduledDate.getTime() + duration * 60000);

  // Check for overlapping hearings
  const conflicts = await db
    .select()
    .from(hearings)
    .where(
      and(
        eq(hearings.courtRoomId, courtRoomId),
        eq(hearings.status, 'SCHEDULED'),
        or(
          // Hearing starts during this time
          and(
            gte(hearings.scheduledDate, startTime),
            lt(hearings.scheduledDate, endTime)
          ),
          // Hearing ends during this time
          and(
            gt(sql`${hearings.scheduledDate} + (${hearings.duration} * INTERVAL '1 minute')`, startTime),
            lte(sql`${hearings.scheduledDate} + (${hearings.duration} * INTERVAL '1 minute')`, endTime)
          ),
          // Hearing spans this entire time
          and(
            lte(hearings.scheduledDate, startTime),
            gte(sql`${hearings.scheduledDate} + (${hearings.duration} * INTERVAL '1 minute')`, endTime)
          )
        )
      )
    );

  return conflicts.length === 0;
}
```

## Transcript Linking

### Linking Transcript to Hearing

```typescript
'use server';

export async function linkTranscript(
  hearingId: string,
  transcriptId: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Verify both exist and belong to org
  const [hearing] = await db
    .select()
    .from(hearings)
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.id, hearingId),
      ])
    )
    .limit(1);

  if (!hearing) {
    return { success: false, error: 'Hearing not found' };
  }

  const [transcript] = await db
    .select()
    .from(transcripts)
    .where(
      withOrgFilter(context.organisationId, transcripts, [
        eq(transcripts.id, transcriptId),
      ])
    )
    .limit(1);

  if (!transcript) {
    return { success: false, error: 'Transcript not found' };
  }

  // Link transcript to hearing
  await db
    .update(hearings)
    .set({
      transcriptId,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.id, hearingId),
      ])
    );

  // Also update transcript with hearing reference
  await db
    .update(transcripts)
    .set({
      hearingId,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, transcripts, [
        eq(transcripts.id, transcriptId),
      ])
    );

  revalidatePath(`/dashboard/hearings/${hearingId}`);

  return { success: true };
}
```

### Displaying Transcript Link

```tsx
export function HearingTranscript({ hearing }: { hearing: Hearing }) {
  if (!hearing.transcriptId) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">
            No transcript available
          </p>
          <div className="mt-4 flex justify-center">
            <Button asChild variant="outline">
              <Link href={`/dashboard/transcripts/new?hearingId=${hearing.id}`}>
                Create Transcript
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hearing Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href={`/dashboard/transcripts/${hearing.transcriptId}`}>
            View Transcript
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Hearing Outcomes

### Recording Outcome

```typescript
'use server';

export async function recordHearingOutcome(
  hearingId: string,
  data: {
    outcome: string;
    orders?: string;
    nextHearingDate?: Date;
    notes?: string;
  }
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canUpdate = await hasPermission(
    session.user.id,
    context.organisationId,
    'hearings:update',
    context.isSuperAdmin
  );

  if (!canUpdate) {
    return { success: false, error: 'Permission denied' };
  }

  // Update hearing
  const [updated] = await db
    .update(hearings)
    .set({
      outcome: data.outcome,
      orders: data.orders || null,
      nextHearingDate: data.nextHearingDate || null,
      notes: data.notes || null,
      status: 'COMPLETED',
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.id, hearingId),
      ])
    )
    .returning();

  // If next hearing scheduled, create it
  if (data.nextHearingDate) {
    await scheduleHearing({
      caseId: updated.caseId,
      scheduledDate: data.nextHearingDate,
      actionType: 'MENTION',
      courtRoomId: updated.courtRoomId || undefined,
      judgeId: updated.judgeId || undefined,
    });
  }

  revalidatePath(`/dashboard/hearings/${hearingId}`);

  return { success: true, data: updated };
}
```

## Viewing Hearings

### Hearing Detail Page

```tsx
export default async function HearingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getHearingById(params.id);

  if (!result.success) {
    return <ErrorPage error={result.error} />;
  }

  const { hearing, case: caseData, courtRoom, judge } = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{hearing.actionType}</h1>
          <p className="text-muted-foreground">
            {format(new Date(hearing.scheduledDate), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
          </p>
        </div>
        <Badge variant={
          hearing.status === 'SCHEDULED' ? 'default' :
          hearing.status === 'COMPLETED' ? 'secondary' :
          hearing.status === 'CANCELLED' ? 'destructive' :
          'outline'
        }>
          {hearing.status}
        </Badge>
      </div>

      {/* Hearing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Hearing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Case</p>
              <Link href={`/dashboard/cases/${caseData.id}`}>
                <p className="font-medium hover:underline">
                  {caseData.caseNumber}
                </p>
                <p className="text-sm">{caseData.title}</p>
              </Link>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Action Type</p>
              <p className="font-medium">{hearing.actionType}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{hearing.duration} minutes</p>
            </div>

            {courtRoom && (
              <div>
                <p className="text-sm text-muted-foreground">Courtroom</p>
                <p className="font-medium">{courtRoom.name}</p>
                <p className="text-sm">{courtRoom.code}</p>
              </div>
            )}

            {judge && (
              <div>
                <p className="text-sm text-muted-foreground">Presiding Officer</p>
                <p className="font-medium">
                  {judge.judicialTitle} {judge.name}
                </p>
              </div>
            )}
          </div>

          {hearing.specialRequirements && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Special Requirements</p>
              <p className="text-sm">{hearing.specialRequirements}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bail Information */}
      {hearing.bailStatus && <BailInformation hearing={hearing} />}

      {/* Transcript */}
      <HearingTranscript hearing={hearing} />

      {/* Outcome (if completed) */}
      {hearing.status === 'COMPLETED' && hearing.outcome && (
        <Card>
          <CardHeader>
            <CardTitle>Outcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{hearing.outcome}</p>
            
            {hearing.orders && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Orders</p>
                <p className="text-sm whitespace-pre-wrap">{hearing.orders}</p>
              </div>
            )}

            {hearing.nextHearingDate && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Next Hearing</p>
                <p className="text-sm">
                  {format(new Date(hearing.nextHearingDate), 'MMMM d, yyyy \'at\' h:mm a')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Best Practices

### DO

✅ Validate scheduled dates are in the future
✅ Check for judge/courtroom conflicts
✅ Set appropriate duration for action type
✅ Link transcripts after hearing completion
✅ Record bail decisions promptly
✅ Notify all parties of scheduled hearings
✅ Track next hearing dates

### DON'T

❌ Don't schedule in the past
❌ Don't double-book judges or courtrooms
❌ Don't forget to update hearing status
❌ Don't skip bail condition documentation
❌ Don't lose transcript links
❌ Don't forget special requirements

## Related Documentation

- [Calendar View](16-calendar-view.md)
- [Daily Cause Lists](18-daily-cause-lists.md)
- [Courtroom Management](19-courtroom-management.md)
- [Transcription System](14-transcription-system.md)
- [Case Management](07-case-management.md)
- [Database Schema - Hearings](03-database-schema.md#hearings)
