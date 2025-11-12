# Organisation Hierarchy

## Overview

The Organisation Hierarchy system structures court organisations in a flexible, multi-level hierarchy. Courts can be organized by geography, jurisdiction, or function with support for parent-child relationships.

## Purpose

- **Hierarchical Structure** - Organize courts in parent-child relationships
- **Court Classification** - Define court levels, types, and jurisdictions
- **Multi-Tenant Support** - Isolate data by organisation
- **Jurisdiction Management** - Track geographic and subject matter jurisdiction
- **Code System** - Unique identification codes for each organisation
- **Flexible Types** - Support countries, court systems, individual courts, and tribunals

## Database Schema

### Table: `organisations`

```sql
CREATE TABLE organisations (
  id TEXT PRIMARY KEY,
  
  -- Basic Information
  name TEXT NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  
  -- Court-Specific Fields
  court_level VARCHAR(50),
  court_type VARCHAR(50),
  jurisdiction TEXT,
  
  -- Hierarchy
  parent_id TEXT REFERENCES organisations(id),
  
  -- Status & Settings
  is_active BOOLEAN DEFAULT true NOT NULL,
  settings TEXT,
  
  -- Audit
  created_by TEXT REFERENCES user(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX org_code_idx ON organisations(code);
CREATE INDEX org_parent_idx ON organisations(parent_id);
CREATE INDEX org_active_idx ON organisations(is_active);
CREATE INDEX org_court_level_idx ON organisations(court_level);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Unique identifier |
| `name` | TEXT | Full organisation name |
| `code` | VARCHAR(10) | Unique short code (e.g., "FJ-HC-SUVA") |
| `type` | VARCHAR(50) | Organisation type (see below) |
| `description` | TEXT | Optional description |
| `court_level` | VARCHAR(50) | Court hierarchy level (for courts) |
| `court_type` | VARCHAR(50) | Type of court jurisdiction |
| `jurisdiction` | TEXT | Geographic or subject matter jurisdiction |
| `parent_id` | TEXT | Parent organisation reference |
| `is_active` | BOOLEAN | Whether organisation is active |
| `settings` | TEXT | JSON settings (case number formats, etc.) |
| `created_by` | TEXT | User who created organisation |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Organisation Types

### Type Hierarchy

```
country
  └── court_system
        ├── court
        └── tribunal
```

| Type | Description | Example |
|------|-------------|---------|
| **country** | Top-level country/region | "Fiji" |
| **court_system** | National court system | "Fiji Judiciary" |
| **court** | Individual court | "Suva High Court" |
| **tribunal** | Specialized tribunal | "Employment Tribunal" |

## Court Levels

### Fiji Court Hierarchy

| Level | Description | Jurisdiction |
|-------|-------------|--------------|
| **court_of_appeal** | Court of Appeal | Final appellate authority |
| **high_court** | High Court | Superior court with original and appellate jurisdiction |
| **magistrates** | Magistrates Court | Lower courts handling summary matters |
| **tribunal** | Specialized Tribunals | Subject-specific matters |

### Court Level Examples

```typescript
// Court of Appeal
{
  type: "court",
  courtLevel: "court_of_appeal",
  name: "Fiji Court of Appeal",
  code: "FJ-COA",
}

// High Court
{
  type: "court",
  courtLevel: "high_court",
  name: "Suva High Court",
  code: "FJ-HC-SUVA",
}

// Magistrates Court
{
  type: "court",
  courtLevel: "magistrates",
  name: "Nadi Magistrates Court",
  code: "FJ-MC-NADI",
}

// Tribunal
{
  type: "tribunal",
  courtLevel: "tribunal",
  name: "Employment Tribunal",
  code: "FJ-ET",
}
```

## Court Types

### Jurisdiction Types

| Type | Description | Applicable To |
|------|-------------|---------------|
| **criminal** | Criminal matters | High Court, Magistrates |
| **civil** | Civil disputes | High Court, Magistrates |
| **family** | Family law matters | Magistrates |
| **agricultural** | Agricultural disputes | Tribunals |
| **small_claims** | Small claims | Tribunals |

### Mixed Jurisdiction

Many courts handle multiple types. Use `null` for `courtType` when the court has mixed jurisdiction, and specify type at the case level instead.

```typescript
// Mixed jurisdiction High Court
{
  courtLevel: "high_court",
  courtType: null, // Handles both criminal and civil
  name: "Suva High Court",
}

// Specialized Magistrates Court
{
  courtLevel: "magistrates",
  courtType: "family",
  name: "Suva Family Court",
}
```

## Geographic Jurisdiction

### Jurisdiction Field

The `jurisdiction` field specifies geographic or subject matter coverage:

```typescript
// Geographic jurisdiction
{
  name: "Suva High Court",
  jurisdiction: "Central Division - Suva, Nausori, Nasinu",
}

// Regional jurisdiction
{
  name: "Lautoka High Court",
  jurisdiction: "Western Division - Lautoka, Ba, Tavua",
}

// Subject matter jurisdiction
{
  name: "Agricultural Tribunal",
  jurisdiction: "Agricultural land disputes nationwide",
}
```

## Creating Organisations

### Create Organisation Action

**Server Action:**

```typescript
'use server';

import { db } from '@/lib/drizzle/connection';
import { organisations } from '@/lib/drizzle/schema/organisation-schema';
import { auth } from '@/lib/auth';

export async function createOrganisation(data: {
  name: string;
  code: string;
  type: string;
  courtLevel?: string;
  courtType?: string;
  jurisdiction?: string;
  description?: string;
  parentId?: string;
}): Promise<ActionResult> {
  // 1. Authentication (Super Admin only)
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Check if user is Super Admin
  const isSuperAdmin = await checkSuperAdmin(session.user.id);
  if (!isSuperAdmin) {
    return { success: false, error: 'Only Super Admins can create organisations' };
  }

  // 2. Validate code uniqueness
  const [existing] = await db
    .select()
    .from(organisations)
    .where(eq(organisations.code, data.code))
    .limit(1);

  if (existing) {
    return { success: false, error: 'Organisation code already exists' };
  }

  // 3. Validate parent exists (if specified)
  if (data.parentId) {
    const [parent] = await db
      .select()
      .from(organisations)
      .where(eq(organisations.id, data.parentId))
      .limit(1);

    if (!parent) {
      return { success: false, error: 'Parent organisation not found' };
    }
  }

  // 4. Create organisation
  const orgId = crypto.randomUUID();

  const [newOrg] = await db
    .insert(organisations)
    .values({
      id: orgId,
      name: data.name,
      code: data.code,
      type: data.type,
      courtLevel: data.courtLevel || null,
      courtType: data.courtType || null,
      jurisdiction: data.jurisdiction || null,
      description: data.description || null,
      parentId: data.parentId || null,
      isActive: true,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath('/dashboard/system-admin/organisations');

  return { success: true, data: newOrg };
}
```

### Organisation Form Component

```tsx
'use client';

export function CreateOrganisationForm({ parents }: { parents: Organisation[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('court');

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      type: formData.get('type') as string,
      courtLevel: formData.get('courtLevel') as string || undefined,
      courtType: formData.get('courtType') as string || undefined,
      jurisdiction: formData.get('jurisdiction') as string || undefined,
      description: formData.get('description') as string || undefined,
      parentId: formData.get('parentId') as string || undefined,
    };

    const result = await createOrganisation(data);

    if (result.success) {
      router.push('/dashboard/system-admin/organisations');
    } else {
      alert(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormField
        label="Organisation Name"
        name="name"
        placeholder="e.g., Suva High Court"
        required
      />

      <FormField
        label="Code"
        name="code"
        placeholder="e.g., FJ-HC-SUVA"
        required
        hint="Unique identifier (max 10 characters)"
      />

      <FormField
        label="Type"
        name="type"
        type="select"
        required
        onChange={(e) => setType(e.target.value)}
        options={[
          { value: 'country', label: 'Country' },
          { value: 'court_system', label: 'Court System' },
          { value: 'court', label: 'Court' },
          { value: 'tribunal', label: 'Tribunal' },
        ]}
      />

      {(type === 'court' || type === 'tribunal') && (
        <>
          <FormField
            label="Court Level"
            name="courtLevel"
            type="select"
            required
            options={[
              { value: 'court_of_appeal', label: 'Court of Appeal' },
              { value: 'high_court', label: 'High Court' },
              { value: 'magistrates', label: 'Magistrates Court' },
              { value: 'tribunal', label: 'Tribunal' },
            ]}
          />

          <FormField
            label="Court Type"
            name="courtType"
            type="select"
            placeholder="Select type (optional for mixed jurisdiction)"
            options={[
              { value: 'criminal', label: 'Criminal' },
              { value: 'civil', label: 'Civil' },
              { value: 'family', label: 'Family' },
              { value: 'agricultural', label: 'Agricultural' },
              { value: 'small_claims', label: 'Small Claims' },
            ]}
          />

          <FormField
            label="Jurisdiction"
            name="jurisdiction"
            placeholder="e.g., Central Division - Suva, Nausori, Nasinu"
            hint="Geographic or subject matter jurisdiction"
          />
        </>
      )}

      <FormField
        label="Parent Organisation"
        name="parentId"
        type="select"
        placeholder="Select parent (optional)"
        options={parents.map(p => ({
          value: p.id,
          label: `${p.name} (${p.code})`,
        }))}
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        placeholder="Optional description"
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Organisation'}
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

## Viewing Hierarchy

### Get Organisation Tree

```typescript
'use server';

export async function getOrganisationTree(): Promise<ActionResult<OrganisationNode[]>> {
  // Get all organisations
  const orgs = await db
    .select()
    .from(organisations)
    .where(eq(organisations.isActive, true))
    .orderBy(organisations.name);

  // Build tree structure
  const orgMap = new Map<string, OrganisationNode>();
  const roots: OrganisationNode[] = [];

  // Create nodes
  orgs.forEach(org => {
    orgMap.set(org.id, {
      ...org,
      children: [],
    });
  });

  // Build hierarchy
  orgs.forEach(org => {
    const node = orgMap.get(org.id)!;
    
    if (org.parentId) {
      const parent = orgMap.get(org.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node); // Parent not found, treat as root
      }
    } else {
      roots.push(node);
    }
  });

  return { success: true, data: roots };
}
```

### Organisation Tree Component

```tsx
'use client';

interface OrganisationNode extends Organisation {
  children: OrganisationNode[];
}

export function OrganisationTree({ tree }: { tree: OrganisationNode[] }) {
  return (
    <div className="space-y-2">
      {tree.map(node => (
        <OrganisationTreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  );
}

function OrganisationTreeNode({
  node,
  level,
}: {
  node: OrganisationNode;
  level: number;
}) {
  const [expanded, setExpanded] = useState(level < 2); // Auto-expand first 2 levels

  return (
    <div>
      <div
        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => setExpanded(!expanded)}
      >
        {node.children.length > 0 && (
          <span className="text-muted-foreground">
            {expanded ? '▼' : '▶'}
          </span>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{node.name}</span>
            <Badge variant="outline" className="text-xs">
              {node.code}
            </Badge>
            {node.courtLevel && (
              <Badge variant="secondary" className="text-xs">
                {node.courtLevel.replace('_', ' ')}
              </Badge>
            )}
          </div>
          
          {node.jurisdiction && (
            <p className="text-sm text-muted-foreground mt-1">
              {node.jurisdiction}
            </p>
          )}
        </div>

        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/system-admin/organisations/${node.id}`}>
            View
          </Link>
        </Button>
      </div>

      {expanded && node.children.length > 0 && (
        <div className="mt-1">
          {node.children.map(child => (
            <OrganisationTreeNode
              key={child.id}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Organisation Settings

### Settings Structure

The `settings` field stores JSON configuration:

```typescript
interface OrganisationSettings {
  // Case number formats
  caseNumberFormats?: {
    high_court_criminal?: string;
    high_court_civil?: string;
    magistrates?: string;
  };
  
  // Default values
  defaults?: {
    hearingDuration?: number;
    courtLevel?: string;
  };
  
  // Feature flags
  features?: {
    transcription?: boolean;
    evidenceUpload?: boolean;
    publicCauseLists?: boolean;
  };
  
  // Custom fields
  customFields?: {
    [key: string]: any;
  };
}
```

### Update Settings

```typescript
'use server';

export async function updateOrganisationSettings(
  orgId: string,
  settings: OrganisationSettings
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Super Admin check
  const isSuperAdmin = await checkSuperAdmin(session.user.id);
  if (!isSuperAdmin) {
    return { success: false, error: 'Permission denied' };
  }

  await db
    .update(organisations)
    .set({
      settings: JSON.stringify(settings),
      updatedAt: new Date(),
    })
    .where(eq(organisations.id, orgId));

  revalidatePath(`/dashboard/system-admin/organisations/${orgId}`);

  return { success: true };
}
```

## Organisation Membership

### Adding Members

Users are linked to organisations via the `organisation_members` table:

```typescript
'use server';

export async function addOrganisationMember(
  organisationId: string,
  userId: string,
  isPrimary: boolean = false
): Promise<ActionResult> {
  // Check if already member
  const [existing] = await db
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.organisationId, organisationId),
        eq(organisationMembers.userId, userId)
      )
    )
    .limit(1);

  if (existing) {
    return { success: false, error: 'User is already a member' };
  }

  // Add membership
  const memberId = crypto.randomUUID();

  await db.insert(organisationMembers).values({
    id: memberId,
    organisationId,
    userId,
    isPrimary,
    isActive: true,
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true };
}
```

## Code Conventions

### Code Format

Organisation codes follow this pattern:

```
{COUNTRY}-{LEVEL}-{LOCATION}

Examples:
FJ-COA          (Fiji Court of Appeal)
FJ-HC-SUVA      (Fiji High Court - Suva)
FJ-HC-LAUTOKA   (Fiji High Court - Lautoka)
FJ-MC-NADI      (Fiji Magistrates Court - Nadi)
FJ-ET           (Fiji Employment Tribunal)
```

### Code Components

| Component | Description | Example |
|-----------|-------------|---------|
| Country | 2-letter country code | FJ (Fiji) |
| Level | Court level abbreviation | HC (High Court), MC (Magistrates Court), COA (Court of Appeal) |
| Location | City/region | SUVA, LAUTOKA, NADI |

## Best Practices

### DO

✅ Use descriptive organisation names
✅ Follow code conventions consistently
✅ Specify jurisdiction for courts
✅ Maintain proper parent-child relationships
✅ Use null for mixed jurisdiction court types
✅ Document hierarchy changes

### DON'T

❌ Don't reuse codes from deleted organisations
❌ Don't create circular parent relationships
❌ Don't delete organisations with active data
❌ Don't forget to set isActive=false instead
❌ Don't use special characters in codes
❌ Don't skip court level for court organisations

## Related Documentation

- [Courtroom Management](20-courtroom-management.md)
- [Case Management](07-case-management.md)
- [User Management](06-user-management.md)
- [Database Schema - Organisations](03-database-schema.md#organisations)
- [System Admin Guide](10-services.md)
