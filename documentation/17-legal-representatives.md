# Legal Representatives System

## Overview

The Legal Representatives system manages lawyers, law firms, and legal aid organizations within court organisations. It provides a centralized directory for tracking counsel representing parties in cases.

## Purpose

- **Directory Management** - Centralized database of legal representatives
- **Case Association** - Track which representatives are assigned to cases
- **Contact Information** - Store contact details for legal professionals
- **Practice Areas** - Categorize representatives by specialty
- **Organisation Scoped** - Each court maintains its own directory

## Database Schema

### Table: `legal_representatives`

```sql
CREATE TABLE legal_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user(id) ON DELETE SET NULL,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  firm_name VARCHAR(255),
  
  -- Contact Information
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  
  -- Professional Details
  practice_areas TEXT[],
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Audit
  created_by UUID REFERENCES user(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX legal_rep_org_idx ON legal_representatives(organisation_id);
CREATE INDEX legal_rep_user_idx ON legal_representatives(user_id);
CREATE INDEX legal_rep_active_idx ON legal_representatives(is_active);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `organisation_id` | UUID | Court organisation (multi-tenant isolation) |
| `user_id` | UUID | Optional link to user account (for registered lawyers) |
| `name` | VARCHAR | Representative's full name |
| `type` | VARCHAR | Type: "lawyer", "law_firm", "legal_aid", "prosecutor", "private_counsel" |
| `firm_name` | VARCHAR | Law firm name (if applicable) |
| `email` | VARCHAR | Contact email |
| `phone` | VARCHAR | Contact phone number |
| `address` | TEXT | Business address |
| `practice_areas` | TEXT[] | Array of practice specialties |
| `notes` | TEXT | Internal notes about representative |
| `is_active` | BOOLEAN | Active status |
| `created_by` | UUID | User who created the record |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Representative Types

### Types Supported

| Type | Description | Usage |
|------|-------------|-------|
| **lawyer** | Individual lawyer | Private practice or firm member |
| **law_firm** | Law firm entity | Firm-level representation |
| **legal_aid** | Legal aid officer | Government-provided counsel |
| **prosecutor** | Prosecuting counsel | State prosecutors, DPP |
| **private_counsel** | Private counsel | Independent barristers |

**Example:**

```typescript
// Individual lawyer
{
  name: "John Smith",
  type: "lawyer",
  firmName: "Smith & Associates",
  practiceAreas: ["Criminal Law", "Appeals"]
}

// Law firm
{
  name: "Smith & Associates",
  type: "law_firm",
  firmName: "Smith & Associates",
  practiceAreas: ["Criminal Law", "Civil Law", "Family Law"]
}

// Legal aid
{
  name: "Jane Doe",
  type: "legal_aid",
  firmName: "Legal Aid Commission",
  practiceAreas: ["Criminal Defence"]
}
```

## Practice Areas

Common practice areas in Fiji courts:

- **Criminal Law** - Criminal defence/prosecution
- **Civil Law** - General civil matters
- **Family Law** - Divorce, custody, maintenance
- **Land Law** - Land disputes, boundaries
- **Commercial Law** - Business disputes
- **Employment Law** - Employment disputes
- **Appeals** - Appellate work
- **Constitutional Law** - Constitutional matters
- **Tax Law** - Tax disputes
- **Immigration Law** - Immigration matters

**Stored as Array:**
```typescript
practiceAreas: ["Criminal Law", "Appeals", "Constitutional Law"]
```

## CRUD Operations

### Create Representative

**UI:** `/dashboard/settings/legal-representatives/new`

**Server Action:**

```typescript
'use server';

import { createLegalRepresentative } from "./actions";

export async function createLegalRepresentative(data: {
  name: string;
  type: string;
  firmName?: string;
  email?: string;
  phone?: string;
  address?: string;
  practiceAreas?: string[];
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
  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    "settings:manage",
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { success: false, error: "Permission denied" };
  }

  // 4. Validate data
  if (!data.name || data.name.trim().length === 0) {
    return { success: false, error: "Name is required" };
  }

  if (!data.type) {
    return { success: false, error: "Type is required" };
  }

  // 5. Create representative
  const repId = crypto.randomUUID();

  const [newRep] = await db
    .insert(legalRepresentatives)
    .values({
      id: repId,
      organisationId: context.organisationId,
      name: data.name,
      type: data.type,
      firmName: data.firmName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      practiceAreas: data.practiceAreas || [],
      isActive: true,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/dashboard/settings/legal-representatives");

  return { success: true, data: newRep };
}
```

**Form Component:**

```tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { createLegalRepresentative } from "./actions";

export function CreateLegalRepForm() {
  const router = useRouter();
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);

  async function handleSubmit(formData: FormData) {
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      firmName: formData.get("firmName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      practiceAreas: practiceAreas,
    };

    const result = await createLegalRepresentative(data);

    if (result.success) {
      router.push("/dashboard/settings/legal-representatives");
    } else {
      alert(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormField
        label="Name"
        name="name"
        required
        placeholder="Full name of representative"
      />

      <FormField
        label="Type"
        name="type"
        type="select"
        required
        options={[
          { value: "lawyer", label: "Lawyer" },
          { value: "law_firm", label: "Law Firm" },
          { value: "legal_aid", label: "Legal Aid" },
          { value: "prosecutor", label: "Prosecutor" },
          { value: "private_counsel", label: "Private Counsel" },
        ]}
      />

      <FormField
        label="Firm Name"
        name="firmName"
        placeholder="Law firm or organization"
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="contact@example.com"
      />

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        placeholder="+679 1234567"
      />

      <FormField
        label="Address"
        name="address"
        type="textarea"
        placeholder="Business address"
      />

      {/* Practice Areas Multi-Select */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Practice Areas
        </label>
        <PracticeAreasSelector
          selected={practiceAreas}
          onChange={setPracticeAreas}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">Create Representative</Button>
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

### Read Representatives

**List All:**

```typescript
export async function getLegalRepresentatives(filters?: {
  type?: string;
  search?: string;
  isActive?: boolean;
}): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const conditions = [];

  // Filter by type
  if (filters?.type) {
    conditions.push(eq(legalRepresentatives.type, filters.type));
  }

  // Filter by active status
  if (filters?.isActive !== undefined) {
    conditions.push(eq(legalRepresentatives.isActive, filters.isActive));
  }

  // Search by name or firm
  if (filters?.search) {
    conditions.push(
      or(
        like(legalRepresentatives.name, `%${filters.search}%`),
        like(legalRepresentatives.firmName, `%${filters.search}%`)
      )
    );
  }

  const results = await db
    .select()
    .from(legalRepresentatives)
    .where(
      withOrgFilter(
        context.organisationId,
        legalRepresentatives,
        conditions.length > 0 ? conditions : undefined
      )
    )
    .orderBy(legalRepresentatives.name);

  return { success: true, data: results };
}
```

**Get by ID:**

```typescript
export async function getLegalRepresentativeById(
  repId: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const [rep] = await db
    .select()
    .from(legalRepresentatives)
    .where(
      withOrgFilter(context.organisationId, legalRepresentatives, [
        eq(legalRepresentatives.id, repId),
      ])
    )
    .limit(1);

  if (!rep) {
    return { success: false, error: "Legal representative not found" };
  }

  return { success: true, data: rep };
}
```

### Update Representative

```typescript
export async function updateLegalRepresentative(
  repId: string,
  data: Partial<{
    name: string;
    type: string;
    firmName: string;
    email: string;
    phone: string;
    address: string;
    practiceAreas: string[];
    isActive: boolean;
    notes: string;
  }>
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canUpdate = await hasPermission(
    session.user.id,
    context.organisationId,
    "settings:manage",
    context.isSuperAdmin
  );

  if (!canUpdate) {
    return { success: false, error: "Permission denied" };
  }

  // Verify exists and belongs to org
  const [existing] = await db
    .select()
    .from(legalRepresentatives)
    .where(
      withOrgFilter(context.organisationId, legalRepresentatives, [
        eq(legalRepresentatives.id, repId),
      ])
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: "Legal representative not found" };
  }

  // Update
  const [updated] = await db
    .update(legalRepresentatives)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      withOrgFilter(context.organisationId, legalRepresentatives, [
        eq(legalRepresentatives.id, repId),
      ])
    )
    .returning();

  revalidatePath("/dashboard/settings/legal-representatives");

  return { success: true, data: updated };
}
```

### Delete Representative

```typescript
export async function deleteLegalRepresentative(
  repId: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canDelete = await hasPermission(
    session.user.id,
    context.organisationId,
    "settings:manage",
    context.isSuperAdmin
  );

  if (!canDelete) {
    return { success: false, error: "Permission denied" };
  }

  // Verify exists
  const [existing] = await db
    .select()
    .from(legalRepresentatives)
    .where(
      withOrgFilter(context.organisationId, legalRepresentatives, [
        eq(legalRepresentatives.id, repId),
      ])
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: "Legal representative not found" };
  }

  // Check if used in cases
  // TODO: Prevent deletion if assigned to active cases

  // Delete
  await db
    .delete(legalRepresentatives)
    .where(
      withOrgFilter(context.organisationId, legalRepresentatives, [
        eq(legalRepresentatives.id, repId),
      ])
    );

  revalidatePath("/dashboard/settings/legal-representatives");

  return { success: true };
}
```

## UI Components

### Representatives List Page

**Location:** `/dashboard/settings/legal-representatives`

```tsx
import { getLegalRepresentatives } from "./actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LegalRepresentativesPage() {
  const result = await getLegalRepresentatives();

  if (!result.success) {
    return <ErrorState error={result.error} />;
  }

  const representatives = result.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Legal Representatives</h1>
          <p className="text-muted-foreground">
            Directory of lawyers, law firms, and legal aid organizations
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/settings/legal-representatives/new">
            Add Representative
          </Link>
        </Button>
      </div>

      {/* Representatives Grid */}
      {representatives.length > 0 ? (
        <div className="grid gap-4">
          {representatives.map((rep) => (
            <Card key={rep.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{rep.name}</CardTitle>
                    {rep.firmName && rep.firmName !== rep.name && (
                      <CardDescription>{rep.firmName}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {rep.type.replace("_", " ")}
                    </Badge>
                    <Badge variant={rep.isActive ? "default" : "secondary"}>
                      {rep.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Contact Info */}
                {rep.email && <p>Email: {rep.email}</p>}
                {rep.phone && <p>Phone: {rep.phone}</p>}

                {/* Practice Areas */}
                {rep.practiceAreas && rep.practiceAreas.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(rep.practiceAreas as string[]).map((area, idx) => (
                      <Badge key={idx} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/settings/legal-representatives/${rep.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No legal representatives yet"
          description="Add legal representatives to track counsel in cases"
        >
          <Button asChild>
            <Link href="/dashboard/settings/legal-representatives/new">
              Add Representative
            </Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
```

### Representative Card Component

```tsx
export function LegalRepCard({ representative }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{representative.name}</CardTitle>
            {representative.firmName && (
              <CardDescription>{representative.firmName}</CardDescription>
            )}
          </div>
          <Badge variant={representative.isActive ? "default" : "secondary"}>
            {representative.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {representative.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{representative.email}</span>
            </div>
          )}
          {representative.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{representative.phone}</span>
            </div>
          )}
          {representative.practiceAreas && representative.practiceAreas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {representative.practiceAreas.map((area, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Case Association

### Linking Representatives to Cases

Legal representatives are linked to cases through the case `parties` JSON field:

```typescript
// Case schema (simplified)
{
  id: "case-uuid",
  caseNumber: "HAC 179/2024",
  parties: {
    prosecution: {
      name: "Director of Public Prosecutions",
      legalRepId: "rep-uuid-1",  // Link to legal_representatives
      counsel: "John Smith",
    },
    defence: {
      name: "John Doe",
      legalRepId: "rep-uuid-2",  // Link to legal_representatives
      counsel: "Jane Williams",
    },
  },
}
```

### Fetching Representative for Case

```typescript
// Get case with representative details
const caseWithReps = await db
  .select({
    case: cases,
    prosecutionRep: legalRepresentatives,
    defenceRep: legalRepresentatives,
  })
  .from(cases)
  .leftJoin(
    legalRepresentatives as any,
    eq(
      sql`(${cases.parties}->>'prosecution'->>'legalRepId')::uuid`,
      legalRepresentatives.id
    )
  )
  .where(eq(cases.id, caseId));
```

### Displaying Representatives on Case Page

```tsx
export function CaseParties({ case }) {
  const parties = case.parties;

  return (
    <div className="space-y-4">
      {/* Prosecution */}
      {parties.prosecution && (
        <div>
          <h3 className="font-semibold">Prosecution</h3>
          <p>{parties.prosecution.name}</p>
          {parties.prosecution.counsel && (
            <p className="text-sm text-muted-foreground">
              Counsel: {parties.prosecution.counsel}
            </p>
          )}
        </div>
      )}

      {/* Defence */}
      {parties.defence && (
        <div>
          <h3 className="font-semibold">Defence</h3>
          <p>{parties.defence.name}</p>
          {parties.defence.counsel && (
            <p className="text-sm text-muted-foreground">
              Counsel: {parties.defence.counsel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

## Search and Filtering

### Search Representatives

```tsx
'use client';

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { getLegalRepresentatives } from "./actions";

export function RepresentativeSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function searchReps() {
      const result = await getLegalRepresentatives({ search });
      if (result.success) {
        setResults(result.data);
      }
    }

    const debounce = setTimeout(searchReps, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div>
      <Input
        placeholder="Search representatives..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Display results */}
    </div>
  );
}
```

### Filter by Type

```tsx
<Select value={type} onValueChange={setType}>
  <option value="">All Types</option>
  <option value="lawyer">Lawyer</option>
  <option value="law_firm">Law Firm</option>
  <option value="legal_aid">Legal Aid</option>
  <option value="prosecutor">Prosecutor</option>
  <option value="private_counsel">Private Counsel</option>
</Select>
```

### Filter by Practice Area

```tsx
<Select value={practiceArea} onValueChange={setPracticeArea}>
  <option value="">All Practice Areas</option>
  <option value="Criminal Law">Criminal Law</option>
  <option value="Civil Law">Civil Law</option>
  <option value="Family Law">Family Law</option>
  {/* ... more areas */}
</Select>
```

## Best Practices

### DO

✅ Validate email format if provided
✅ Allow multiple practice areas per representative
✅ Link representatives to user accounts (for registered lawyers)
✅ Maintain active/inactive status rather than deleting
✅ Check for case associations before deletion
✅ Use organisation-scoped queries for multi-tenancy

### DON'T

❌ Don't delete representatives with active case associations
❌ Don't allow duplicate emails within organisation
❌ Don't forget to set `organisationId` on creation
❌ Don't skip permission checks (settings:manage required)
❌ Don't expose representatives across organisations

## Future Enhancements

### Planned Features

1. **User Account Integration**
   - Allow lawyers to register and link accounts
   - Self-service profile management
   - Case notifications via email

2. **Case Statistics**
   - Track number of cases per representative
   - Win/loss records (if applicable)
   - Case duration averages

3. **Document Sharing**
   - Secure document portal for representatives
   - Case file access based on assignment

4. **Billing Integration**
   - Track time/billing for legal aid
   - Generate invoices

5. **Verification**
   - Bar admission verification
   - Practising certificate tracking
   - Professional indemnity insurance records

6. **Communication**
   - In-app messaging with court staff
   - Email notifications for hearing dates
   - SMS reminders

## Related Documentation

- [Database Schema - Legal Representatives](03-database-schema.md#legal_representatives)
- [Case Management - Parties](07-case-management.md#parties)
- [User Management](06-user-management.md)
- [API Documentation - Legal Representatives](05-api-documentation.md#legal-representatives)
