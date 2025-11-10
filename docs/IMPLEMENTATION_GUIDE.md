# Multi-Tenant & RBAC Implementation Guide

This guide will walk you through implementing the multi-tenant organizational and role-based access control architecture for scaling the Totolaw platform across Pacific Islands.

## 📋 Overview

The platform now supports:
- ✅ Multiple organizations (Fiji, Samoa, Tonga, Vanuatu, etc.)
- ✅ Organizational hierarchies (Country → Province → District)
- ✅ Role-based access control (Judge, Clerk, Prosecutor, etc.)
- ✅ Fine-grained permissions
- ✅ Complete data isolation between organizations
- ✅ Full audit trail

## 🗂️ New Files Created

### Database Schemas
1. **`lib/drizzle/schema/organization-schema.ts`** - Organization and membership tables
2. **`lib/drizzle/schema/rbac-schema.ts`** - Roles, permissions, and assignments
3. **Updated: `lib/drizzle/schema/auth-schema.ts`** - Added multi-tenant fields to user table
4. **Updated: `lib/drizzle/schema/db-schema.ts`** - Added organizationId to all data tables
5. **Updated: `lib/drizzle/schema/case-schema.ts`** - Added organizationId to proceeding templates

### Services
1. **`lib/services/tenant.service.ts`** - Tenant context and organization management
2. **`lib/services/authorization.service.ts`** - Permission checking and role management

### Documentation
1. **`docs/multi-tenant-rbac.md`** - Complete architecture documentation
2. **`docs/permissions-reference.md`** - Standard permissions and roles reference

### Migration
1. **`migrations/001_setup_multi_tenant_rbac.sql`** - Database setup script

## 🚀 Implementation Steps

### Step 1: Update Database Schema

First, push the new schema to your database:

```bash
# Review the schema changes
npm run db-push -- --dry-run

# Apply the changes
npm run db-push
```

### Step 2: Run Migration Script

Execute the migration script to set up organizations, roles, and permissions:

```bash
# Connect to your database and run:
psql $DATABASE_URL -f migrations/001_setup_multi_tenant_rbac.sql
```

Or if using a database client:

```sql
-- Copy and paste the contents of migrations/001_setup_multi_tenant_rbac.sql
-- and execute in your database
```

This will:
- Create Pacific Island organizations (Fiji, Samoa, Tonga, Vanuatu)
- Create all standard permissions
- Create standard roles for each organization
- Assign permissions to roles
- Migrate existing data to default organization (Fiji)

### Step 3: Update Drizzle Config

Ensure your Drizzle config includes all new schemas:

```typescript
// lib/drizzle/config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./lib/drizzle/schema/auth-schema.ts",
    "./lib/drizzle/schema/organization-schema.ts",
    "./lib/drizzle/schema/rbac-schema.ts",
    "./lib/drizzle/schema/db-schema.ts",
    "./lib/drizzle/schema/case-schema.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Step 4: Update Drizzle Connection

Add relations to your Drizzle connection:

```typescript
// lib/drizzle/connection.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./schema/auth-schema";
import * as organizationSchema from "./schema/organization-schema";
import * as rbacSchema from "./schema/rbac-schema";
import * as dbSchema from "./schema/db-schema";
import * as caseSchema from "./schema/case-schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

export const db = drizzle(client, {
  schema: {
    ...authSchema,
    ...organizationSchema,
    ...rbacSchema,
    ...dbSchema,
    ...caseSchema,
  },
});
```

### Step 5: Add Tenant Context to Protected Routes

Update your protected pages to include tenant context:

```typescript
// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get tenant context
  const context = await getUserTenantContext(session.user.id);
  
  if (!context) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">No Organization Access</h1>
        <p>Please contact your administrator to be added to an organization.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Current Organization: {context.organizationId}</p>
      {/* Your dashboard content */}
    </div>
  );
}
```

### Step 6: Add Permission Checks to Server Actions

Update your server actions to check permissions:

```typescript
// app/dashboard/cases/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { db } from "@/lib/drizzle/connection";
import { cases } from "@/lib/drizzle/schema/db-schema";
import { generateUUID } from "@/lib/services/uuid.service";
import { headers } from "next/headers";

export async function createCase(data: { title: string; type: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organization access" };
  }

  const canCreate = await hasPermission(
    session.user.id,
    context.organizationId,
    "cases:create",
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { error: "Permission denied: Cannot create cases" };
  }

  const caseId = generateUUID();
  await db.insert(cases).values({
    id: caseId,
    organizationId: context.organizationId,
    title: data.title,
    type: data.type,
    status: "open",
    filedBy: session.user.id,
  });

  return { success: true, caseId };
}
```

### Step 7: Create Organization Switcher Component

Create a UI component for users to switch between organizations:

```typescript
// components/organization-switcher.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Organization {
  id: string;
  name: string;
  code: string;
}

interface Props {
  currentOrgId: string;
  organizations: Organization[];
}

export function OrganizationSwitcher({ currentOrgId, organizations }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitch = async (orgId: string) => {
    setIsLoading(true);
    const response = await fetch("/api/organization/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId }),
    });

    if (response.ok) {
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <Select value={currentOrgId} onValueChange={handleSwitch} disabled={isLoading}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name} ({org.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Step 8: Create Organization Switch API Route

```typescript
// app/api/organization/switch/route.ts
import { auth } from "@/lib/auth";
import { switchUserOrganization } from "@/lib/services/tenant.service";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organizationId } = await request.json();

  if (!organizationId) {
    return NextResponse.json(
      { error: "Organization ID required" },
      { status: 400 }
    );
  }

  const success = await switchUserOrganization(
    session.user.id,
    organizationId
  );

  if (!success) {
    return NextResponse.json(
      { error: "Access denied to this organization" },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true });
}
```

### Step 9: Update Queries to Include Organization Filter

Update all data queries to filter by organization:

```typescript
// Example: Fetching cases
import { eq } from "drizzle-orm";

const userCases = await db.query.cases.findMany({
  where: eq(cases.organizationId, context.organizationId),
  orderBy: (cases, { desc }) => [desc(cases.createdAt)],
});
```

### Step 10: Add User to Organization

Create functionality to add users to organizations:

```typescript
// app/admin/users/actions.ts
"use server";

import { db } from "@/lib/drizzle/connection";
import { organizationMembers } from "@/lib/drizzle/schema/organization-schema";
import { generateUUID } from "@/lib/services/uuid.service";

export async function addUserToOrganization(
  userId: string,
  organizationId: string,
  addedBy: string
) {
  await db.insert(organizationMembers).values({
    id: generateUUID(),
    userId,
    organizationId,
    isPrimary: false,
    isActive: true,
    addedBy,
  });

  return { success: true };
}
```

## 🧪 Testing the Implementation

### 1. Verify Organizations

```typescript
// Test script: test-setup.ts
import { db } from "./lib/drizzle/connection";
import { organizations } from "./lib/drizzle/schema/organization-schema";

const orgs = await db.select().from(organizations);
console.log("Organizations:", orgs);
```

### 2. Verify Permissions

```typescript
import { permissions } from "./lib/drizzle/schema/rbac-schema";

const perms = await db.select().from(permissions);
console.log(`Total permissions: ${perms.length}`);
```

### 3. Test Permission Checking

```typescript
import { hasPermission } from "./lib/services/authorization.service";

const canCreate = await hasPermission(userId, orgId, "cases:create");
console.log("Can create cases:", canCreate);
```

## 📊 Sample Workflows

### Creating an Organization

```typescript
import { db } from "@/lib/drizzle/connection";
import { organizations } from "@/lib/drizzle/schema/organization-schema";
import { generateUUID } from "@/lib/services/uuid.service";

const newOrgId = generateUUID();
await db.insert(organizations).values({
  id: newOrgId,
  name: "Solomon Islands",
  code: "SB",
  type: "country",
  description: "Solomon Islands Court System",
  isActive: true,
});
```

### Assigning a Role

```typescript
import { assignRole } from "@/lib/services/authorization.service";

await assignRole(
  userId,
  judgeRoleId,
  organizationId,
  adminUserId
);
```

### Checking Multiple Permissions

```typescript
import { hasAnyPermission } from "@/lib/services/authorization.service";

const canManageCases = await hasAnyPermission(
  userId,
  orgId,
  ["cases:create", "cases:update", "cases:delete"]
);
```

## 🔍 Debugging Tips

### Check User's Organizations

```sql
SELECT o.name, om.is_primary, om.is_active
FROM organization_members om
JOIN organizations o ON om.organization_id = o.id
WHERE om.user_id = 'USER_ID';
```

### Check User's Roles

```sql
SELECT o.name, r.name, ur.is_active
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
JOIN organizations o ON ur.organization_id = o.id
WHERE ur.user_id = 'USER_ID';
```

### Check Role Permissions

```sql
SELECT p.slug, p.description
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = 'ROLE_ID';
```

## 🛡️ Security Checklist

- [ ] All data tables have `organizationId` foreign key
- [ ] All queries include organization filter
- [ ] Permission checks at route level
- [ ] Permission checks in server actions
- [ ] Tenant context validated before data access
- [ ] Audit logging enabled for sensitive operations
- [ ] Super admin access controlled and monitored
- [ ] Role assignments require proper permissions

## 📚 Documentation

Refer to these documents for more details:

1. **`docs/multi-tenant-rbac.md`** - Complete architecture guide
2. **`docs/permissions-reference.md`** - All permissions and roles
3. **`docs/architecture.md`** - Overall system architecture

## 🚦 Next Steps

After implementation:

1. **Create Admin UI**: Build interfaces for managing organizations, roles, and permissions
2. **Add Invitation System**: Implement organization invitation workflow
3. **Create Reports**: Add organization-level reporting
4. **Set Up Monitoring**: Monitor permission checks and access patterns
5. **Train Users**: Educate administrators on role management
6. **Onboard Islands**: Add additional Pacific Island organizations

## 🆘 Support

If you encounter issues:

1. Check database migrations completed successfully
2. Verify all schema files are imported in Drizzle config
3. Ensure environment variables are set correctly
4. Review audit logs for permission denied errors
5. Test with super admin account first

## 📞 Contact

For questions about the multi-tenant architecture, refer to the documentation or reach out to the development team.

---

**Built for Pacific Island Courts 🌴⚖️**
