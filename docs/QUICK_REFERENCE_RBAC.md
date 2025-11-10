# Multi-Tenant RBAC Quick Reference

Quick reference for working with the multi-tenant and role-based access control system.

## 🔑 Key Concepts

| Concept | Description |
|---------|-------------|
| **Organization** | A tenant (country, region, court system) with isolated data |
| **Role** | A named set of permissions (Judge, Clerk, etc.) |
| **Permission** | A specific action on a resource (cases:create) |
| **User Role** | Assignment of a role to a user in an organization |
| **Tenant Context** | The current organization a user is working within |

## 📋 Common Code Patterns

### Get Tenant Context

```typescript
import { getUserTenantContext } from "@/lib/services/tenant.service";

const context = await getUserTenantContext(userId);
// Returns: { organizationId, userId, isSuperAdmin }
```

### Check Permission

```typescript
import { hasPermission } from "@/lib/services/authorization.service";

const canCreate = await hasPermission(
  userId,
  organizationId,
  "cases:create",
  isSuperAdmin
);
```

### Check Multiple Permissions (Any)

```typescript
import { hasAnyPermission } from "@/lib/services/authorization.service";

const canManage = await hasAnyPermission(
  userId,
  orgId,
  ["cases:create", "cases:update", "cases:delete"]
);
```

### Check Role

```typescript
import { hasRole } from "@/lib/services/authorization.service";

const isJudge = await hasRole(userId, orgId, "judge");
```

### Query with Organization Filter

```typescript
import { eq } from "drizzle-orm";

const cases = await db.query.cases.findMany({
  where: eq(cases.organizationId, context.organizationId)
});
```

### Protected Server Action

```typescript
"use server";

export async function myAction(data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const context = await getUserTenantContext(session.user.id);
  if (!context) return { error: "No organization" };

  const canDo = await hasPermission(
    session.user.id,
    context.organizationId,
    "resource:action",
    context.isSuperAdmin
  );
  if (!canDo) return { error: "Permission denied" };

  // Proceed with action
}
```

## 🎯 Standard Roles

| Role | Typical Use | Key Permissions |
|------|-------------|-----------------|
| **Judge** | Preside over cases | cases:*, verdicts:*, sentences:* |
| **Court Clerk** | Case administration | cases:create, cases:update, hearings:* |
| **Prosecutor** | File cases | cases:create, evidence:submit |
| **Defender** | Defend cases | cases:read-own, evidence:submit |
| **Administrator** | System admin | users:*, roles:*, settings:* |
| **Viewer** | Read-only | *:read permissions |

## 🔐 Standard Permissions

### Case Management
- `cases:create` - Create cases
- `cases:read` - View case details
- `cases:read-all` - View all cases
- `cases:read-own` - View only assigned cases
- `cases:update` - Edit cases
- `cases:delete` - Delete cases
- `cases:assign` - Assign to staff
- `cases:close` - Close cases

### Hearings
- `hearings:create` - Schedule hearings
- `hearings:read` - View hearings
- `hearings:update` - Modify hearings
- `hearings:reschedule` - Reschedule

### Evidence
- `evidence:submit` - Submit evidence
- `evidence:read` - View evidence
- `evidence:approve` - Approve evidence

### Verdicts & Sentences
- `verdicts:create` - Issue verdicts
- `sentences:create` - Issue sentences
- `verdicts:update` - Modify verdicts
- `sentences:update` - Modify sentences

### Administration
- `users:create` - Create users
- `users:read` - View users
- `users:update` - Edit users
- `roles:assign` - Assign roles
- `settings:update` - Change settings

## 🗄️ Database Tables

### Organizations
```typescript
organizations {
  id: string
  name: string          // "Fiji"
  code: string          // "FJ"
  type: string          // "country"
  parentId: string?     // Hierarchy
  isActive: boolean
}
```

### Organization Members
```typescript
organization_members {
  id: string
  organizationId: string
  userId: string
  isPrimary: boolean
  isActive: boolean
}
```

### Roles
```typescript
roles {
  id: string
  organizationId: string
  name: string          // "Judge"
  slug: string          // "judge"
  isSystem: boolean
  isActive: boolean
}
```

### Permissions
```typescript
permissions {
  id: string
  resource: string      // "cases"
  action: string        // "create"
  slug: string          // "cases:create"
  isSystem: boolean
}
```

### User Roles
```typescript
user_roles {
  id: string
  userId: string
  roleId: string
  organizationId: string
  isActive: boolean
  expiresAt: timestamp?
}
```

## 🛠️ Useful SQL Queries

### List User Organizations
```sql
SELECT o.name, o.code, om.is_primary
FROM organization_members om
JOIN organizations o ON om.organization_id = o.id
WHERE om.user_id = 'USER_ID' AND om.is_active = true;
```

### List User Roles
```sql
SELECT r.name, o.name as organization
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
JOIN organizations o ON ur.organization_id = o.id
WHERE ur.user_id = 'USER_ID' AND ur.is_active = true;
```

### List Role Permissions
```sql
SELECT p.slug, p.description
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = 'ROLE_ID';
```

### Count Cases by Organization
```sql
SELECT o.name, COUNT(c.id) as case_count
FROM organizations o
LEFT JOIN cases c ON o.id = c.organization_id
GROUP BY o.name;
```

## 🚀 Common Tasks

### Add User to Organization
```typescript
import { db } from "@/lib/drizzle/connection";
import { organizationMembers } from "@/lib/drizzle/schema/organization-schema";
import { generateUUID } from "@/lib/services/uuid.service";

await db.insert(organizationMembers).values({
  id: generateUUID(),
  userId: "user-id",
  organizationId: "org-id",
  isPrimary: true,
  isActive: true,
});
```

### Assign Role to User
```typescript
import { assignRole } from "@/lib/services/authorization.service";

await assignRole(
  "user-id",
  "role-id",
  "org-id",
  "admin-user-id"
);
```

### Switch Organization
```typescript
import { switchUserOrganization } from "@/lib/services/tenant.service";

await switchUserOrganization("user-id", "new-org-id");
```

### Get User Permissions
```typescript
import { getUserPermissions } from "@/lib/services/authorization.service";

const perms = await getUserPermissions(userId, orgId, isSuperAdmin);
// Returns: { roles: string[], permissions: string[] }
```

## 🎨 UI Components Needed

- [ ] Organization Switcher
- [ ] Role Management Panel
- [ ] User Invitation Form
- [ ] Permission Matrix View
- [ ] Access Denied Page
- [ ] Organization Settings

## ⚠️ Common Pitfalls

1. **Forgetting Organization Filter**
   ```typescript
   // ❌ Wrong
   const cases = await db.query.cases.findMany();
   
   // ✅ Correct
   const cases = await db.query.cases.findMany({
     where: eq(cases.organizationId, context.organizationId)
   });
   ```

2. **Not Checking Tenant Context**
   ```typescript
   // ❌ Wrong
   const canCreate = await hasPermission(userId, hardcodedOrgId, "cases:create");
   
   // ✅ Correct
   const context = await getUserTenantContext(userId);
   const canCreate = await hasPermission(userId, context.organizationId, "cases:create");
   ```

3. **Missing Permission Checks**
   ```typescript
   // ❌ Wrong
   export async function deleteCase(caseId: string) {
     await db.delete(cases).where(eq(cases.id, caseId));
   }
   
   // ✅ Correct
   export async function deleteCase(caseId: string) {
     const canDelete = await hasPermission(userId, orgId, "cases:delete");
     if (!canDelete) return { error: "Permission denied" };
     await db.delete(cases).where(eq(cases.id, caseId));
   }
   ```

## 📊 Monitoring

### Check Permission Usage
```sql
-- Most used permissions
SELECT p.slug, COUNT(*) as usage_count
FROM rbac_audit_log ral
JOIN permissions p ON ral.entity_id = p.id
WHERE ral.entity_type = 'permission'
GROUP BY p.slug
ORDER BY usage_count DESC;
```

### Recent Role Assignments
```sql
SELECT u.name, r.name, o.name, ur.assigned_at
FROM user_roles ur
JOIN "user" u ON ur.user_id = u.id
JOIN roles r ON ur.role_id = r.id
JOIN organizations o ON ur.organization_id = o.id
ORDER BY ur.assigned_at DESC
LIMIT 10;
```

## 🔗 Related Files

- `lib/services/tenant.service.ts` - Tenant operations
- `lib/services/authorization.service.ts` - Permission checking
- `lib/drizzle/schema/organization-schema.ts` - Org tables
- `lib/drizzle/schema/rbac-schema.ts` - RBAC tables
- `docs/multi-tenant-rbac.md` - Full documentation
- `docs/permissions-reference.md` - All permissions
- `migrations/001_setup_multi_tenant_rbac.sql` - Setup script

## 📖 Further Reading

1. Multi-Tenant RBAC Documentation (`docs/multi-tenant-rbac.md`)
2. Permissions Reference (`docs/permissions-reference.md`)
3. Implementation Guide (`docs/IMPLEMENTATION_GUIDE.md`)
4. Architecture Overview (`docs/architecture.md`)

---

**Quick Reference v1.0 | Last Updated: November 2025**
