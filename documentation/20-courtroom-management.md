# Courtroom Management

## Overview

The Courtroom Management system tracks physical courtrooms within court organisations. Each courtroom can be assigned to hearings, monitored for capacity, and managed at different court hierarchy levels.

## Purpose

- **Physical Tracking** - Maintain registry of physical courtrooms
- **Capacity Management** - Track seating and space capacity
- **Hearing Assignment** - Link hearings to specific courtrooms
- **Scheduling** - Manage courtroom availability and bookings
- **Hierarchy Support** - Courtrooms at different court levels (High Court, Magistrates, etc.)
- **Active Status** - Enable/disable courtrooms as needed

## Database Schema

### Table: `court_rooms`

```sql
CREATE TABLE court_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  
  -- Identification
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  
  -- Hierarchy
  court_level VARCHAR(50) NOT NULL,
  
  -- Physical Details
  location TEXT,
  capacity INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX courtroom_org_idx ON court_rooms(organisation_id);
CREATE INDEX courtroom_code_idx ON court_rooms(code);
CREATE INDEX courtroom_active_idx ON court_rooms(is_active);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `organisation_id` | UUID | Court organisation |
| `name` | VARCHAR(100) | Full courtroom name |
| `code` | VARCHAR(20) | Short code identifier |
| `court_level` | VARCHAR(50) | Court hierarchy level |
| `location` | TEXT | Physical location/building |
| `capacity` | INTEGER | Seating capacity |
| `is_active` | BOOLEAN | Whether courtroom is active |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Court Levels

### Fiji Court Hierarchy

| Level | Description | Example Courtroom Names |
|-------|-------------|-------------------------|
| **high_court** | High Court of Fiji | "HIGH COURT ROOM NO. 1", "HC LAUTOKA 1" |
| **magistrates** | Magistrates Court | "MAGISTRATE COURT ROOM 3", "MC SUVA 2" |
| **court_of_appeal** | Court of Appeal | "COURT OF APPEAL CHAMBER", "COA ROOM 1" |
| **tribunal** | Special Tribunals | "EMPLOYMENT TRIBUNAL", "FAMILY TRIBUNAL 1" |

### Naming Conventions

```typescript
// High Court
{
  name: "HIGH COURT ROOM NO. 1",
  code: "HC-01",
  courtLevel: "high_court",
}

// Magistrates Court
{
  name: "MAGISTRATE COURT ROOM 3",
  code: "MC-03",
  courtLevel: "magistrates",
}

// Court of Appeal
{
  name: "COURT OF APPEAL CHAMBER",
  code: "COA-01",
  courtLevel: "court_of_appeal",
}

// Tribunal
{
  name: "EMPLOYMENT TRIBUNAL",
  code: "ET-01",
  courtLevel: "tribunal",
}
```

## Creating Courtrooms

### Create Courtroom Action

**Server Action:**

```typescript
'use server';

import { db } from '@/lib/drizzle/connection';
import { courtRooms } from '@/lib/drizzle/schema/db-schema';
import { getUserTenantContext } from '@/lib/services/tenant.service';
import { hasPermission } from '@/lib/services/authorization.service';
import { withOrgId } from '@/lib/utils/query-helpers';

export async function createCourtRoom(data: {
  name: string;
  code: string;
  courtLevel: string;
  location?: string;
  capacity?: number;
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
  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    'settings:manage',
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { success: false, error: 'Permission denied' };
  }

  // 4. Validate code uniqueness
  const [existing] = await db
    .select()
    .from(courtRooms)
    .where(
      and(
        eq(courtRooms.organisationId, context.organisationId),
        eq(courtRooms.code, data.code)
      )
    )
    .limit(1);

  if (existing) {
    return { success: false, error: 'Courtroom code already exists' };
  }

  // 5. Create courtroom
  const roomId = crypto.randomUUID();

  const [newRoom] = await db
    .insert(courtRooms)
    .values(
      withOrgId(context.organisationId, {
        id: roomId,
        name: data.name,
        code: data.code,
        courtLevel: data.courtLevel,
        location: data.location || null,
        capacity: data.capacity || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    )
    .returning();

  revalidatePath('/dashboard/settings/courtrooms');

  return { success: true, data: newRoom };
}
```

### Create Courtroom Form

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { createCourtRoom } from './actions';

export function CreateCourtRoomForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      courtLevel: formData.get('courtLevel') as string,
      location: formData.get('location') as string || undefined,
      capacity: parseInt(formData.get('capacity') as string) || undefined,
    };

    const result = await createCourtRoom(data);

    if (result.success) {
      router.push('/dashboard/settings/courtrooms');
    } else {
      alert(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormField
        label="Courtroom Name"
        name="name"
        placeholder="e.g., HIGH COURT ROOM NO. 1"
        required
        hint="Full official courtroom name"
      />

      <FormField
        label="Code"
        name="code"
        placeholder="e.g., HC-01"
        required
        hint="Short unique identifier"
      />

      <FormField
        label="Court Level"
        name="courtLevel"
        type="select"
        required
        options={[
          { value: 'high_court', label: 'High Court' },
          { value: 'magistrates', label: 'Magistrates Court' },
          { value: 'court_of_appeal', label: 'Court of Appeal' },
          { value: 'tribunal', label: 'Tribunal' },
        ]}
      />

      <FormField
        label="Location"
        name="location"
        placeholder="e.g., Ground Floor, Suva Courts Complex"
        hint="Building and floor details"
      />

      <FormField
        label="Capacity"
        name="capacity"
        type="number"
        placeholder="e.g., 50"
        min="1"
        hint="Maximum seating capacity"
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Courtroom'}
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

## Retrieving Courtrooms

### Get All Courtrooms

**Server Action:**

```typescript
'use server';

export async function getCourtRooms(filters?: {
  courtLevel?: string;
  isActive?: boolean;
}): Promise<ActionResult<CourtRoom[]>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const conditions = [];

  if (filters?.courtLevel) {
    conditions.push(eq(courtRooms.courtLevel, filters.courtLevel));
  }

  if (filters?.isActive !== undefined) {
    conditions.push(eq(courtRooms.isActive, filters.isActive));
  }

  const results = await db
    .select()
    .from(courtRooms)
    .where(
      withOrgFilter(
        context.organisationId,
        courtRooms,
        conditions.length > 0 ? conditions : undefined
      )
    )
    .orderBy(courtRooms.name);

  return { success: true, data: results };
}
```

### Get Courtroom by ID

```typescript
'use server';

export async function getCourtRoomById(
  roomId: string
): Promise<ActionResult<CourtRoom>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const [room] = await db
    .select()
    .from(courtRooms)
    .where(
      withOrgFilter(context.organisationId, courtRooms, [
        eq(courtRooms.id, roomId),
      ])
    )
    .limit(1);

  if (!room) {
    return { success: false, error: 'Courtroom not found' };
  }

  return { success: true, data: room };
}
```

### Courtroom List Page

```tsx
export default async function CourtRoomsPage() {
  const result = await getCourtRooms({ isActive: true });

  if (!result.success) {
    return <ErrorPage error={result.error} />;
  }

  const courtRooms = result.data;

  // Group by court level
  const grouped = courtRooms.reduce((acc, room) => {
    const level = room.courtLevel;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(room);
    return acc;
  }, {} as Record<string, CourtRoom[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courtrooms</h1>
        <Button asChild>
          <Link href="/dashboard/settings/courtrooms/new">
            Add Courtroom
          </Link>
        </Button>
      </div>

      {Object.entries(grouped).map(([level, rooms]) => (
        <div key={level} className="space-y-3">
          <h2 className="text-lg font-semibold capitalize">
            {level.replace('_', ' ')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <CourtRoomCard key={room.id} courtRoom={room} />
            ))}
          </div>
        </div>
      ))}

      {courtRooms.length === 0 && (
        <EmptyState
          title="No courtrooms"
          description="Create your first courtroom to start scheduling hearings."
          action={{
            label: 'Add Courtroom',
            href: '/dashboard/settings/courtrooms/new',
          }}
        />
      )}
    </div>
  );
}
```

### Courtroom Card Component

```tsx
function CourtRoomCard({ courtRoom }: { courtRoom: CourtRoom }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{courtRoom.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Code: {courtRoom.code}
            </p>
          </div>
          {courtRoom.isActive ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {courtRoom.location && (
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm">{courtRoom.location}</p>
            </div>
          )}

          {courtRoom.capacity && (
            <div>
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="text-sm">{courtRoom.capacity} persons</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/settings/courtrooms/${courtRoom.id}`}>
              View
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/settings/courtrooms/${courtRoom.id}/edit`}>
              Edit
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Updating Courtrooms

### Update Courtroom Action

```typescript
'use server';

export async function updateCourtRoom(
  roomId: string,
  data: Partial<{
    name: string;
    code: string;
    courtLevel: string;
    location: string;
    capacity: number;
    isActive: boolean;
  }>
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canUpdate = await hasPermission(
    session.user.id,
    context.organisationId,
    'settings:manage',
    context.isSuperAdmin
  );

  if (!canUpdate) {
    return { success: false, error: 'Permission denied' };
  }

  // Verify exists
  const [existing] = await db
    .select()
    .from(courtRooms)
    .where(
      withOrgFilter(context.organisationId, courtRooms, [
        eq(courtRooms.id, roomId),
      ])
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Courtroom not found' };
  }

  // If code is being changed, check uniqueness
  if (data.code && data.code !== existing.code) {
    const [duplicate] = await db
      .select()
      .from(courtRooms)
      .where(
        and(
          eq(courtRooms.organisationId, context.organisationId),
          eq(courtRooms.code, data.code),
          ne(courtRooms.id, roomId)
        )
      )
      .limit(1);

    if (duplicate) {
      return { success: false, error: 'Courtroom code already exists' };
    }
  }

  // Update
  const [updated] = await db
    .update(courtRooms)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, courtRooms, [
        eq(courtRooms.id, roomId),
      ])
    )
    .returning();

  revalidatePath('/dashboard/settings/courtrooms');

  return { success: true, data: updated };
}
```

### Update Form Component

```tsx
'use client';

export function UpdateCourtRoomForm({
  courtRoom,
}: {
  courtRoom: CourtRoom;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      courtLevel: formData.get('courtLevel') as string,
      location: formData.get('location') as string || undefined,
      capacity: parseInt(formData.get('capacity') as string) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const result = await updateCourtRoom(courtRoom.id, data);

    if (result.success) {
      router.push('/dashboard/settings/courtrooms');
    } else {
      alert(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormField
        label="Courtroom Name"
        name="name"
        defaultValue={courtRoom.name}
        required
      />

      <FormField
        label="Code"
        name="code"
        defaultValue={courtRoom.code}
        required
      />

      <FormField
        label="Court Level"
        name="courtLevel"
        type="select"
        defaultValue={courtRoom.courtLevel}
        required
        options={[
          { value: 'high_court', label: 'High Court' },
          { value: 'magistrates', label: 'Magistrates Court' },
          { value: 'court_of_appeal', label: 'Court of Appeal' },
          { value: 'tribunal', label: 'Tribunal' },
        ]}
      />

      <FormField
        label="Location"
        name="location"
        defaultValue={courtRoom.location || ''}
      />

      <FormField
        label="Capacity"
        name="capacity"
        type="number"
        defaultValue={courtRoom.capacity?.toString() || ''}
        min="1"
      />

      <FormField
        label="Status"
        name="isActive"
        type="select"
        defaultValue={courtRoom.isActive ? 'true' : 'false'}
        required
        options={[
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ]}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Courtroom'}
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

## Deleting Courtrooms

### Delete Courtroom Action

```typescript
'use server';

export async function deleteCourtRoom(roomId: string): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canDelete = await hasPermission(
    session.user.id,
    context.organisationId,
    'settings:manage',
    context.isSuperAdmin
  );

  if (!canDelete) {
    return { success: false, error: 'Permission denied' };
  }

  // Check if courtroom has scheduled hearings
  const [hasHearings] = await db
    .select({ count: count() })
    .from(hearings)
    .where(
      and(
        eq(hearings.courtRoomId, roomId),
        eq(hearings.status, 'SCHEDULED')
      )
    );

  if (hasHearings.count > 0) {
    return {
      success: false,
      error: `Cannot delete courtroom with ${hasHearings.count} scheduled hearings`,
    };
  }

  // Delete courtroom
  await db
    .delete(courtRooms)
    .where(
      withOrgFilter(context.organisationId, courtRooms, [
        eq(courtRooms.id, roomId),
      ])
    );

  revalidatePath('/dashboard/settings/courtrooms');

  return { success: true };
}
```

## Courtroom Availability

### Checking Availability

```typescript
'use server';

export async function checkCourtRoomAvailability(
  courtRoomId: string,
  startTime: Date,
  duration: number // minutes
): Promise<ActionResult<{ available: boolean; conflicts?: Hearing[] }>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const endTime = new Date(startTime.getTime() + duration * 60000);

  // Find overlapping hearings
  const conflicts = await db
    .select()
    .from(hearings)
    .where(
      withOrgFilter(context.organisationId, hearings, [
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
            gt(
              sql`${hearings.scheduledDate} + (${hearings.duration} * INTERVAL '1 minute')`,
              startTime
            ),
            lte(
              sql`${hearings.scheduledDate} + (${hearings.duration} * INTERVAL '1 minute')`,
              endTime
            )
          ),
          // Hearing spans this entire time
          and(
            lte(hearings.scheduledDate, startTime),
            gte(
              sql`${hearings.scheduledDate} + (${hearings.duration} * INTERVAL '1 minute')`,
              endTime
            )
          )
        ),
      ])
    );

  return {
    success: true,
    data: {
      available: conflicts.length === 0,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
    },
  };
}
```

### Availability Display Component

```tsx
'use client';

export function CourtRoomAvailabilityChecker({
  courtRoomId,
}: {
  courtRoomId: string;
}) {
  const [date, setDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState(60);
  const [result, setResult] = useState<{ available: boolean; conflicts?: Hearing[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkAvailability() {
    if (!date) return;

    setLoading(true);
    const response = await checkCourtRoomAvailability(courtRoomId, date, duration);

    if (response.success) {
      setResult(response.data);
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              onChange={(e) => setDate(new Date(e.target.value))}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="15"
              step="15"
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          <Button onClick={checkAvailability} disabled={!date || loading}>
            {loading ? 'Checking...' : 'Check Availability'}
          </Button>

          {result && (
            <div className="mt-4">
              {result.available ? (
                <Alert>
                  <AlertDescription>
                    ✅ Courtroom is available at this time
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    ❌ Courtroom has {result.conflicts?.length} conflicting hearings
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Courtroom Statistics

### Get Usage Statistics

```typescript
'use server';

export async function getCourtRoomStatistics(
  courtRoomId: string,
  startDate: Date,
  endDate: Date
): Promise<ActionResult<CourtRoomStats>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Total hearings
  const [total] = await db
    .select({ count: count() })
    .from(hearings)
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.courtRoomId, courtRoomId),
        gte(hearings.scheduledDate, startDate),
        lte(hearings.scheduledDate, endDate),
      ])
    );

  // By status
  const byStatus = await db
    .select({
      status: hearings.status,
      count: count(),
    })
    .from(hearings)
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.courtRoomId, courtRoomId),
        gte(hearings.scheduledDate, startDate),
        lte(hearings.scheduledDate, endDate),
      ])
    )
    .groupBy(hearings.status);

  // By action type
  const byActionType = await db
    .select({
      actionType: hearings.actionType,
      count: count(),
    })
    .from(hearings)
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.courtRoomId, courtRoomId),
        gte(hearings.scheduledDate, startDate),
        lte(hearings.scheduledDate, endDate),
      ])
    )
    .groupBy(hearings.actionType)
    .orderBy(desc(count()));

  // Total duration
  const [durationSum] = await db
    .select({
      totalMinutes: sum(hearings.duration),
    })
    .from(hearings)
    .where(
      withOrgFilter(context.organisationId, hearings, [
        eq(hearings.courtRoomId, courtRoomId),
        gte(hearings.scheduledDate, startDate),
        lte(hearings.scheduledDate, endDate),
      ])
    );

  return {
    success: true,
    data: {
      totalHearings: total.count,
      byStatus,
      byActionType,
      totalHours: Math.round((durationSum.totalMinutes || 0) / 60),
    },
  };
}
```

## Best Practices

### DO

✅ Use descriptive courtroom names
✅ Assign unique codes for easy reference
✅ Set realistic capacity limits
✅ Check availability before scheduling
✅ Mark inactive courtrooms instead of deleting
✅ Organize by court level hierarchy
✅ Include location/building details

### DON'T

❌ Don't delete courtrooms with scheduled hearings
❌ Don't reuse codes from deleted courtrooms
❌ Don't schedule beyond capacity
❌ Don't forget to update location changes
❌ Don't leave active courtrooms without capacity
❌ Don't use inconsistent naming conventions

## Related Documentation

- [Hearing Management](19-hearing-management.md)
- [Daily Cause Lists](18-daily-cause-lists.md)
- [Calendar View](16-calendar-view.md)
- [Organisation Hierarchy](21-organisation-hierarchy.md)
- [Database Schema - Court Rooms](03-database-schema.md#court_rooms)
