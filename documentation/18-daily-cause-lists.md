# Daily Cause Lists

## Overview

Daily Cause Lists are court schedules that display all hearings scheduled for a specific date. They serve as the official daily docket, showing case information, parties, legal representatives, times, and presiding officers. In Fiji courts, cause lists are a critical administrative tool for court staff, judicial officers, lawyers, and the public.

## Purpose

- **Official Schedule** - Legal document listing all court business for the day
- **Public Notice** - Published schedule for lawyers, parties, and public
- **Court Administration** - Helps court staff and judges manage daily caseload
- **Legal Compliance** - Required under court rules for public notification
- **Time Management** - Organizes hearings by courtroom and time slots

## Database Schema

### Table: `daily_cause_lists`

```sql
CREATE TABLE daily_cause_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  
  -- Date and Location
  list_date TIMESTAMP NOT NULL,
  court_room_id UUID REFERENCES court_rooms(id) ON DELETE SET NULL,
  
  -- Presiding Officer
  presiding_officer_id UUID REFERENCES user(id) ON DELETE SET NULL,
  presiding_officer_title VARCHAR(100),
  
  -- List Type and Status
  list_type VARCHAR(50) DEFAULT 'REGULAR',
  status VARCHAR(50) DEFAULT 'DRAFT',
  
  -- Notes
  notes TEXT,
  special_announcements TEXT,
  
  -- Publishing
  published_at TIMESTAMP,
  published_by UUID REFERENCES user(id),
  
  -- Audit
  created_by UUID REFERENCES user(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX cause_list_org_idx ON daily_cause_lists(organisation_id);
CREATE INDEX cause_list_date_idx ON daily_cause_lists(list_date);
CREATE INDEX cause_list_officer_idx ON daily_cause_lists(presiding_officer_id);
CREATE INDEX cause_list_status_idx ON daily_cause_lists(status);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `organisation_id` | UUID | Court organisation |
| `list_date` | TIMESTAMP | Date for this cause list |
| `court_room_id` | UUID | Optional specific courtroom |
| `presiding_officer_id` | UUID | Judge/Magistrate presiding |
| `presiding_officer_title` | VARCHAR | Title (e.g., "Justice", "Magistrate") |
| `list_type` | VARCHAR | Type: "REGULAR", "SPECIAL", "URGENT" |
| `status` | VARCHAR | Status: "DRAFT", "PUBLISHED", "ARCHIVED" |
| `notes` | TEXT | Internal notes |
| `special_announcements` | TEXT | Public announcements |
| `published_at` | TIMESTAMP | When list was published |
| `published_by` | UUID | Who published the list |
| `created_by` | UUID | Who created the list |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Relationships

**Hearings Association:**
Hearings are implicitly associated with cause lists through matching criteria:
- `hearing.scheduledDate` matches `cause_list.listDate`
- `hearing.courtRoomId` matches `cause_list.courtRoomId` (if specified)
- `hearing.judgeId` matches `cause_list.presidingOfficerId` (if specified)

**Note:** A junction table `cause_list_hearings` could be added for explicit many-to-many relationships.

## List Types

### Regular Lists

Standard daily court schedules:

```typescript
{
  listType: "REGULAR",
  listDate: new Date("2025-11-15"),
  courtRoomId: "court-room-1",
  presidingOfficerId: "judge-uuid",
}
```

### Special Lists

Special court sessions or extraordinary sittings:

```typescript
{
  listType: "SPECIAL",
  listDate: new Date("2025-11-15"),
  specialAnnouncements: "Special sitting for urgent bail applications",
}
```

### Urgent Lists

Emergency or urgent hearings:

```typescript
{
  listType: "URGENT",
  listDate: new Date("2025-11-15"),
  specialAnnouncements: "Urgent applications only - 9:00 AM",
}
```

## Status Workflow

### Draft → Published → Archived

```
┌────────────────┐
│     DRAFT      │  ← Initial creation, editable
└────────┬───────┘
         ↓
┌────────────────┐
│   PUBLISHED    │  ← Public visibility, read-only
└────────┬───────┘
         ↓
┌────────────────┐
│    ARCHIVED    │  ← Historical record
└────────────────┘
```

### Status Meanings

| Status | Description | Editable | Public |
|--------|-------------|----------|--------|
| **DRAFT** | Work in progress | ✅ Yes | ❌ No |
| **PUBLISHED** | Official list | ❌ No | ✅ Yes |
| **ARCHIVED** | Historical | ❌ No | ✅ Yes |

## Generation Process

### Automatic Generation

Generate cause list from scheduled hearings:

```typescript
'use server';

export async function generateDailyCauseList(params: {
  date: Date;
  courtRoomId?: string;
  judgeId?: string;
}): Promise<ActionResult> {
  // 1. Check authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Get tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context?.organisationId) {
    return { success: false, error: "No organisation context" };
  }

  // 3. Check permission
  const canGenerate = await hasPermission(
    session.user.id,
    context.organisationId,
    "hearings:read",
    context.isSuperAdmin
  );

  if (!canGenerate) {
    return { success: false, error: "Permission denied" };
  }

  // 4. Query hearings for the date
  const conditions = [
    sql`DATE(${hearings.scheduledDate}) = DATE(${params.date})`,
  ];

  if (params.courtRoomId) {
    conditions.push(eq(hearings.courtRoomId, params.courtRoomId));
  }

  if (params.judgeId) {
    conditions.push(eq(hearings.judgeId, params.judgeId));
  }

  const scheduledHearings = await db
    .select({
      hearing: hearings,
      case: cases,
      courtRoom: courtRooms,
      judge: user,
    })
    .from(hearings)
    .leftJoin(cases, eq(hearings.caseId, cases.id))
    .leftJoin(courtRooms, eq(hearings.courtRoomId, courtRooms.id))
    .leftJoin(user, eq(hearings.judgeId, user.id))
    .where(
      withOrgFilter(
        context.organisationId,
        hearings,
        conditions.length > 0 ? and(...conditions) : undefined
      )
    )
    .orderBy(hearings.scheduledDate, courtRooms.name);

  // 5. Get presiding officer details
  let presidingOfficerId = params.judgeId;
  let presidingOfficerTitle = null;

  if (presidingOfficerId) {
    const [judge] = await db
      .select()
      .from(user)
      .where(eq(user.id, presidingOfficerId))
      .limit(1);

    if (judge) {
      presidingOfficerTitle = judge.judicialTitle;
    }
  }

  // 6. Create cause list
  const causeListId = crypto.randomUUID();

  const [causeList] = await db
    .insert(dailyCauseLists)
    .values({
      id: causeListId,
      organisationId: context.organisationId,
      listDate: params.date,
      courtRoomId: params.courtRoomId || null,
      presidingOfficerId: presidingOfficerId || null,
      presidingOfficerTitle: presidingOfficerTitle,
      listType: "REGULAR",
      status: "DRAFT",
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/dashboard/settings/cause-lists");

  return {
    success: true,
    data: {
      causeList,
      hearingCount: scheduledHearings.length,
    },
  };
}
```

### Manual Creation

Create empty cause list and add hearings manually:

```typescript
export async function createEmptyCauseList(params: {
  date: Date;
  courtRoomId?: string;
  judgeId?: string;
  listType?: string;
}): Promise<ActionResult> {
  // Similar to generation, but without querying hearings
  const causeListId = crypto.randomUUID();

  const [causeList] = await db
    .insert(dailyCauseLists)
    .values({
      id: causeListId,
      organisationId: context.organisationId,
      listDate: params.date,
      courtRoomId: params.courtRoomId || null,
      presidingOfficerId: params.judgeId || null,
      listType: params.listType || "REGULAR",
      status: "DRAFT",
      createdBy: session.user.id,
    })
    .returning();

  return { success: true, data: causeList };
}
```

## Publishing

### Publish Cause List

Make list publicly visible:

```typescript
export async function publishDailyCauseList(
  causeListId: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canPublish = await hasPermission(
    session.user.id,
    context.organisationId,
    "hearings:manage",
    context.isSuperAdmin
  );

  if (!canPublish) {
    return { success: false, error: "Permission denied" };
  }

  // Get cause list
  const [causeList] = await db
    .select()
    .from(dailyCauseLists)
    .where(
      withOrgFilter(context.organisationId, dailyCauseLists, [
        eq(dailyCauseLists.id, causeListId),
      ])
    )
    .limit(1);

  if (!causeList) {
    return { success: false, error: "Cause list not found" };
  }

  if (causeList.status === "PUBLISHED") {
    return { success: false, error: "Cause list already published" };
  }

  // Validate has hearings
  const hearingsCount = await getHearingsForCauseList(causeListId);

  if (hearingsCount === 0) {
    return {
      success: false,
      error: "Cannot publish empty cause list",
    };
  }

  // Update to published
  const [updated] = await db
    .update(dailyCauseLists)
    .set({
      status: "PUBLISHED",
      publishedAt: new Date(),
      publishedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, dailyCauseLists, [
        eq(dailyCauseLists.id, causeListId),
      ])
    )
    .returning();

  // Send notifications (optional)
  await notifyStakeholders(updated);

  revalidatePath("/dashboard/settings/cause-lists");

  return { success: true, data: updated };
}
```

### Unpublish (Revert to Draft)

```typescript
export async function unpublishDailyCauseList(
  causeListId: string
): Promise<ActionResult> {
  // Check permissions
  // Update status back to DRAFT
  // Remove publishedAt and publishedBy

  const [updated] = await db
    .update(dailyCauseLists)
    .set({
      status: "DRAFT",
      publishedAt: null,
      publishedBy: null,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, dailyCauseLists, [
        eq(dailyCauseLists.id, causeListId),
      ])
    )
    .returning();

  return { success: true, data: updated };
}
```

## Viewing Cause Lists

### List All Cause Lists

```typescript
export async function getDailyCauseLists(params?: {
  date?: Date;
  courtRoomId?: string;
  status?: string;
  limit?: number;
}): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const conditions = [];

  if (params?.date) {
    conditions.push(
      sql`DATE(${dailyCauseLists.listDate}) = DATE(${params.date})`
    );
  }

  if (params?.courtRoomId) {
    conditions.push(eq(dailyCauseLists.courtRoomId, params.courtRoomId));
  }

  if (params?.status) {
    conditions.push(eq(dailyCauseLists.status, params.status));
  }

  const results = await db
    .select({
      causeList: dailyCauseLists,
      courtRoom: courtRooms,
      presidingOfficer: user,
    })
    .from(dailyCauseLists)
    .leftJoin(courtRooms, eq(dailyCauseLists.courtRoomId, courtRooms.id))
    .leftJoin(user, eq(dailyCauseLists.presidingOfficerId, user.id))
    .where(
      withOrgFilter(
        context.organisationId,
        dailyCauseLists,
        conditions.length > 0 ? and(...conditions) : undefined
      )
    )
    .orderBy(desc(dailyCauseLists.listDate))
    .limit(params?.limit || 20);

  return { success: true, data: results };
}
```

### Get Single Cause List with Hearings

```typescript
export async function getCauseListById(
  causeListId: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Get cause list
  const [causeList] = await db
    .select({
      causeList: dailyCauseLists,
      courtRoom: courtRooms,
      presidingOfficer: user,
    })
    .from(dailyCauseLists)
    .leftJoin(courtRooms, eq(dailyCauseLists.courtRoomId, courtRooms.id))
    .leftJoin(user, eq(dailyCauseLists.presidingOfficerId, user.id))
    .where(
      withOrgFilter(context.organisationId, dailyCauseLists, [
        eq(dailyCauseLists.id, causeListId),
      ])
    )
    .limit(1);

  if (!causeList) {
    return { success: false, error: "Cause list not found" };
  }

  // Get hearings
  const hearingsConditions = [
    sql`DATE(${hearings.scheduledDate}) = DATE(${causeList.causeList.listDate})`,
  ];

  if (causeList.causeList.courtRoomId) {
    hearingsConditions.push(
      eq(hearings.courtRoomId, causeList.causeList.courtRoomId)
    );
  }

  if (causeList.causeList.presidingOfficerId) {
    hearingsConditions.push(
      eq(hearings.judgeId, causeList.causeList.presidingOfficerId)
    );
  }

  const hearingsList = await db
    .select({
      hearing: hearings,
      case: cases,
      courtRoom: courtRooms,
    })
    .from(hearings)
    .leftJoin(cases, eq(hearings.caseId, cases.id))
    .leftJoin(courtRooms, eq(hearings.courtRoomId, courtRooms.id))
    .where(
      withOrgFilter(
        context.organisationId,
        hearings,
        and(...hearingsConditions)
      )
    )
    .orderBy(hearings.scheduledDate);

  return {
    success: true,
    data: {
      ...causeList,
      hearings: hearingsList,
    },
  };
}
```

## UI Components

### Cause Lists Management Page

**Location:** `/dashboard/settings/cause-lists`

```tsx
import { getDailyCauseLists } from "./actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CauseListsPage() {
  const result = await getDailyCauseLists({ limit: 20 });
  const causeLists = result.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Cause Lists</h1>
          <p className="text-muted-foreground">
            Generate and manage daily court schedules
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/settings/cause-lists/new">
            Generate Cause List
          </Link>
        </Button>
      </div>

      {/* Cause Lists Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {causeLists.map(({ causeList, courtRoom, presidingOfficer }) => (
          <Card key={causeList.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">
                  {format(new Date(causeList.listDate), "EEEE, MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {courtRoom ? courtRoom.name : "All Courtrooms"}
                </p>
              </div>
              <Badge
                variant={
                  causeList.status === "PUBLISHED"
                    ? "default"
                    : "secondary"
                }
              >
                {causeList.status}
              </Badge>
            </div>

            {presidingOfficer && (
              <p className="text-sm mb-4">
                <span className="text-muted-foreground">Presiding: </span>
                {presidingOfficer.judicialTitle} {presidingOfficer.name}
              </p>
            )}

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/dashboard/settings/cause-lists/${causeList.id}`}>
                  View
                </Link>
              </Button>
              {causeList.status === "DRAFT" && (
                <Button asChild size="sm" className="flex-1">
                  <Link
                    href={`/dashboard/settings/cause-lists/${causeList.id}/edit`}
                  >
                    Edit
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Cause List Detail View

```tsx
import { getCauseListById } from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publishDailyCauseList } from "../actions";

export default async function CauseListDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getCauseListById(params.id);

  if (!result.success) {
    return <ErrorPage error={result.error} />;
  }

  const { causeList, courtRoom, presidingOfficer, hearings } = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Cause List</h1>
          <p className="text-muted-foreground">
            {format(new Date(causeList.listDate), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          {causeList.status === "DRAFT" && (
            <form action={publishDailyCauseList.bind(null, causeList.id)}>
              <Button type="submit">Publish</Button>
            </form>
          )}
          <Button variant="outline">Print</Button>
        </div>
      </div>

      {/* Court Details */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Courtroom</p>
            <p className="font-medium">
              {courtRoom ? courtRoom.name : "All Courtrooms"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Presiding Officer</p>
            <p className="font-medium">
              {presidingOfficer
                ? `${presidingOfficer.judicialTitle} ${presidingOfficer.name}`
                : "Not assigned"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={causeList.status === "PUBLISHED" ? "default" : "secondary"}>
              {causeList.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hearings</p>
            <p className="font-medium">{hearings.length}</p>
          </div>
        </div>

        {causeList.specialAnnouncements && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-1">Special Announcements</p>
            <p className="text-sm">{causeList.specialAnnouncements}</p>
          </div>
        )}
      </Card>

      {/* Hearings List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Hearings</CardTitle>
        </CardHeader>
        <CardContent>
          {hearings.length > 0 ? (
            <div className="space-y-4">
              {hearings.map(({ hearing, case: caseData, courtRoom }) => (
                <div key={hearing.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{caseData.caseNumber}</h4>
                      <p className="text-sm text-muted-foreground">
                        {caseData.title}
                      </p>
                    </div>
                    <Badge variant="outline">{hearing.actionType}</Badge>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                    <span>
                      {format(new Date(hearing.scheduledDate), "h:mm a")}
                    </span>
                    {courtRoom && <span>{courtRoom.name}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hearings scheduled
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## PDF Generation

### Generate Printable PDF

```typescript
import { jsPDF } from "jspdf";

export function generateCauseListPDF(causeListData: {
  causeList: DailyCauseList;
  courtRoom?: CourtRoom;
  presidingOfficer?: User;
  hearings: Hearing[];
}) {
  const doc = new jsPDF();
  const { causeList, courtRoom, presidingOfficer, hearings } = causeListData;

  // Header
  doc.setFontSize(16);
  doc.text("DAILY CAUSE LIST", 105, 20, { align: "center" });

  // Date
  doc.setFontSize(12);
  doc.text(
    format(new Date(causeList.listDate), "EEEE, MMMM d, yyyy"),
    105,
    30,
    { align: "center" }
  );

  // Court details
  doc.setFontSize(10);
  let y = 45;
  doc.text(`Courtroom: ${courtRoom?.name || "All Courtrooms"}`, 20, y);
  y += 7;
  
  if (presidingOfficer) {
    doc.text(
      `Presiding: ${presidingOfficer.judicialTitle} ${presidingOfficer.name}`,
      20,
      y
    );
    y += 7;
  }

  // Table header
  y += 10;
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text("Time", 20, y);
  doc.text("Case Number", 45, y);
  doc.text("Title", 80, y);
  doc.text("Type", 150, y);
  doc.text("Court", 175, y);

  // Line under header
  y += 2;
  doc.line(20, y, 190, y);

  // Hearings
  doc.setFont(undefined, "normal");
  hearings.forEach((hearing) => {
    y += 7;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }

    doc.text(format(new Date(hearing.scheduledDate), "h:mm a"), 20, y);
    doc.text(hearing.case.caseNumber, 45, y);
    doc.text(hearing.case.title.substring(0, 30), 80, y);
    doc.text(hearing.actionType, 150, y);
    doc.text(hearing.courtRoom?.code || "", 175, y);
  });

  // Footer
  doc.setFontSize(8);
  doc.text(
    `Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`,
    105,
    290,
    { align: "center" }
  );

  return doc;
}

// Usage
export async function downloadCauseListPDF(causeListId: string) {
  const result = await getCauseListById(causeListId);
  if (!result.success) throw new Error(result.error);

  const pdf = generateCauseListPDF(result.data);
  pdf.save(`cause-list-${format(new Date(result.data.causeList.listDate), "yyyy-MM-dd")}.pdf`);
}
```

## Public Access

### Public Cause List View

Allow public access to published cause lists:

```typescript
// app/public/cause-lists/[date]/page.tsx

export default async function PublicCauseListPage({
  params,
}: {
  params: { date: string };
}) {
  // No authentication required for published lists
  const result = await getPublicCauseLists(new Date(params.date));

  // Display public-facing cause list
  // Hide sensitive information
  // Show only published lists
}
```

### API Endpoint for Public Access

```typescript
// app/api/public/cause-lists/[date]/route.ts

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const causeLists = await db
    .select()
    .from(dailyCauseLists)
    .where(
      and(
        eq(dailyCauseLists.status, "PUBLISHED"),
        sql`DATE(${dailyCauseLists.listDate}) = ${params.date}`
      )
    );

  return Response.json(causeLists);
}
```

## Best Practices

### DO

✅ Generate cause lists at least 24 hours in advance
✅ Publish only validated and complete lists
✅ Include presiding officer information
✅ Sort hearings by time and courtroom
✅ Include special announcements when needed
✅ Archive old cause lists for historical reference
✅ Generate PDF for printing and distribution

### DON'T

❌ Don't publish cause lists with no hearings
❌ Don't modify published lists (unpublish first)
❌ Don't forget to notify stakeholders when publishing
❌ Don't expose draft lists to public
❌ Don't delete cause lists (archive instead)

## Future Enhancements

### Planned Features

1. **Junction Table**
   - Explicit many-to-many relationship between cause lists and hearings
   - Track which hearings appear on which lists
   - Support for hearing appearing on multiple lists

2. **Email Notifications**
   - Notify lawyers when cause list is published
   - Notify parties of hearing dates
   - Reminder emails 24 hours before hearing

3. **SMS Notifications**
   - Text message reminders
   - Urgent hearing notifications

4. **QR Code Access**
   - Generate QR codes for each cause list
   - Quick mobile access for public
   - Post in court buildings

5. **Template Customization**
   - Custom PDF templates per court
   - Configurable headers and formatting
   - Organization branding

6. **Auto-Publishing**
   - Schedule automatic publication
   - Daily generation at specified time
   - Email distribution list

7. **Conflict Detection**
   - Detect scheduling conflicts
   - Warn about double-bookings
   - Suggest alternative times

8. **Statistics**
   - Track published lists per month
   - Average hearings per list
   - Utilization reports

## Related Documentation

- [Hearing Management](10-hearing-management.md)
- [Calendar View](16-calendar-view.md)
- [Courtroom Management](19-courtroom-management.md)
- [User Management - Judicial Titles](06-user-management.md#judicial-titles-and-designations)
- [Database Schema - Daily Cause Lists](03-database-schema.md#daily_cause_lists)
