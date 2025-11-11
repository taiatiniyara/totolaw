# Multi-Tenant & Role-Based Access Control Architecture

**Totolaw** is derived from the Fijian word **"Totolo"** which means **"fast"** or **"quick"**. This platform embodies that spirit by helping the Pacific achieve more efficient execution of justice.

This document describes the multi-tenant organisation and role-based access control (RBAC) architecture that enables the Totolaw platform to scale across multiple Pacific Islands.

## Overview

The platform now supports multi-tenancy with organisation-based isolation and comprehensive role-based access control. This architecture allows:

- **Multiple Organisations**: Support for Fiji, Samoa, Tonga, Vanuatu, and other Pacific Island nations
- **Organisational Hierarchies**: Countries → Provinces → Districts → Courts
- **Role-Based Access**: Judges, Clerks, Prosecutors, Defenders, Administrators, etc.
- **Permission Granularity**: Fine-grained control over what users can do
- **Data Isolation**: Complete separation of data between organisations
- **Audit Trail**: Full tracking of permission and role changes

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                │
│  - isSuperAdmin: Platform-level access                     │
│  - currentOrganisationId: Active context                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼─────────┐
│  Organisations   │    │  Organisation     │
│  - Countries     │◄───┤  Members          │
│  - Provinces     │    │  - isPrimary      │
│  - Districts     │    │  - isActive       │
└───────┬──────────┘    └──────────────────┘
        │
        │ organisationId (tenant isolation)
        │
        ├──────────────┬──────────────┬──────────────┐
        │              │              │              │
┌───────▼─────┐  ┌────▼────┐  ┌──────▼──────┐  ┌───▼────┐
│   Cases     │  │  Roles  │  │ Permissions │  │  ...   │
│   Evidence  │  │         │  │             │  │  All   │
│   Hearings  │  └────┬────┘  └──────┬──────┘  │  Data  │
│   Trials    │       │              │         └────────┘
│   Appeals   │       └──────┬───────┘
└─────────────┘              │
                   ┌─────────▼──────────┐
                   │   User Roles       │
                   │   - Assignments    │
                   │   - Scoped access  │
                   │   - Expiration     │
                   └────────────────────┘
```

## Database Schema

### 1. Organisations

Organisations represent countries, regions, or court systems in the Pacific Islands.

**Table: `organisations`**

```typescript
{
  id: string (PK)
  name: string                // "Fiji", "Samoa", "Tonga"
  code: string (unique)       // "FJ", "WS", "TO"
  type: string                // "country", "province", "district"
  description: string
  parentId: string (FK)       // Hierarchical structure
  isActive: boolean
  settings: string (JSON)     // Org-specific configuration
  createdBy: string (FK)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Hierarchical Example:**
```
Fiji (FJ)
  ├── Central Division (FJ-C)
  │   ├── Suva Magistrate Court (FJ-C-SMC)
  │   └── Nausori Magistrate Court (FJ-C-NMC)
  ├── Western Division (FJ-W)
  │   └── Lautoka High Court (FJ-W-LHC)
  └── Northern Division (FJ-N)
```

### 2. Organisation Memberships

Tracks which users belong to which organisations.

**Table: `organisation_members`**

```typescript
{
  id: string (PK)
  organisationId: string (FK)
  userId: string (FK)
  isPrimary: boolean          // User's default organisation
  isActive: boolean
  joinedAt: timestamp
  leftAt: timestamp
  addedBy: string (FK)
}
```

**Features:**
- Users can belong to multiple organisations
- One organisation marked as primary
- Support for deactivation without deletion
- Audit trail of who added the user

### 3. Organisation Invitations

Manage invitations to join organisations.

**Table: `organisation_invitations`**

```typescript
{
  id: string (PK)
  organisationId: string (FK)
  email: string
  roleId: string (FK)         // Optional: pre-assign role
  token: string (unique)
  status: string              // pending, accepted, expired, revoked
  invitedBy: string (FK)
  acceptedBy: string (FK)
  expiresAt: timestamp
  acceptedAt: timestamp
  revokedAt: timestamp
}
```

## Role-Based Access Control (RBAC)

### 1. Roles

Roles are organisation-specific and define a set of permissions.

**Table: `roles`**

```typescript
{
  id: string (PK)
  organisationId: string (FK)
  name: string                // "Judge", "Senior Clerk"
  slug: string                // "judge", "senior-clerk"
  description: string
  isSystem: boolean           // Protected from deletion
  isActive: boolean
}
```

**Example Roles for Pacific Island Court Systems:**

| Role | Slug | Permissions |
|------|------|-------------|
| Super Admin | `super-admin` | All permissions |
| Chief Justice | `chief-justice` | All court operations |
| Judge | `judge` | Case management, hearings, verdicts |
| Senior Magistrate | `senior-magistrate` | Case assignment, case management |
| Magistrate | `magistrate` | Case review, hearings |
| Court Clerk | `court-clerk` | Case creation, document filing |
| Senior Clerk | `senior-clerk` | User management, clerk supervision |
| Prosecutor | `prosecutor` | Case filing, evidence submission |
| Public Defender | `public-defender` | Case access, evidence review |
| Police Officer | `police-officer` | Evidence submission, case updates |
| Administrator | `administrator` | System configuration, user management |
| Viewer | `viewer` | Read-only access |

### 2. Permissions

Permissions define specific actions on resources.

**Table: `permissions`**

```typescript
{
  id: string (PK)
  resource: string            // "cases", "hearings", "users"
  action: string              // "create", "read", "update", "delete"
  slug: string (unique)       // "cases:create", "hearings:read"
  description: string
  isSystem: boolean
}
```

**Permission Naming Convention:** `resource:action`

**Example Permissions:**

| Resource | Action | Slug | Description |
|----------|--------|------|-------------|
| cases | create | `cases:create` | Create new cases |
| cases | read | `cases:read` | View case details |
| cases | update | `cases:update` | Edit case information |
| cases | delete | `cases:delete` | Delete cases |
| cases | assign | `cases:assign` | Assign cases to judges |
| hearings | create | `hearings:create` | Schedule hearings |
| hearings | read | `hearings:read` | View hearing details |
| hearings | update | `hearings:update` | Modify hearings |
| verdicts | create | `verdicts:create` | Issue verdicts |
| sentences | create | `sentences:create` | Issue sentences |
| evidence | submit | `evidence:submit` | Submit evidence |
| evidence | view | `evidence:view` | View evidence |
| users | create | `users:create` | Create user accounts |
| users | manage | `users:manage` | Manage users |
| roles | assign | `roles:assign` | Assign roles to users |
| reports | view | `reports:view` | View reports |
| audit | view | `audit:view` | View audit logs |
| settings | manage | `settings:manage` | Manage system settings |

### 3. Role-Permission Mapping

Links roles to their permissions.

**Table: `role_permissions`**

```typescript
{
  id: string (PK)
  roleId: string (FK)
  permissionId: string (FK)
  conditions: string (JSON)   // Conditional permissions
  createdBy: string (FK)
}
```

### 4. User Role Assignments

Assigns roles to users within organisations.

**Table: `user_roles`**

```typescript
{
  id: string (PK)
  userId: string (FK)
  roleId: string (FK)
  organisationId: string (FK)
  scope: string (JSON)        // Scoped access (e.g., specific divisions)
  isActive: boolean
  assignedBy: string (FK)
  assignedAt: timestamp
  expiresAt: timestamp        // Optional: temporary roles
  revokedAt: timestamp
  revokedBy: string (FK)
}
```

**Features:**
- Users can have multiple roles per organisation
- Roles can be scoped (e.g., Judge only for Criminal Division)
- Support for temporary role assignments
- Full audit trail

### 5. Direct User Permissions

Override role permissions for specific users.

**Table: `user_permissions`**

```typescript
{
  id: string (PK)
  userId: string (FK)
  permissionId: string (FK)
  organisationId: string (FK)
  granted: boolean            // true = grant, false = explicit deny
  conditions: string (JSON)
  scope: string (JSON)
  assignedBy: string (FK)
  expiresAt: timestamp
  revokedAt: timestamp
}
```

**Features:**
- **Grants**: Give specific permissions outside of roles
- **Denies**: Explicitly deny permissions (overrides role permissions)
- **Conditions**: Apply permissions only under certain conditions
- **Scoped**: Limit permissions to specific contexts

### 6. RBAC Audit Log

Track all role and permission changes.

**Table: `rbac_audit_log`**

```typescript
{
  id: string (PK)
  organisationId: string (FK)
  entityType: string          // "role", "permission", "user_role"
  entityId: string
  action: string              // "created", "updated", "assigned", "revoked"
  performedBy: string (FK)
  targetUserId: string (FK)
  changes: string (JSON)      // Before/after values
  metadata: string (JSON)
  ipAddress: string
  userAgent: string
  createdAt: timestamp
}
```

## Data Isolation

### Tenant Isolation Strategy

Every data table includes an `organisationId` foreign key to ensure complete data separation:

```typescript
// Example: Cases table with tenant isolation
{
  id: string (PK)
  organisationId: string (FK)  // 👈 Tenant isolation
  title: string
  status: string
  // ... other fields
}
```

**Enforced at Multiple Levels:**

1. **Database Level**: Foreign key constraints
2. **Query Level**: All queries include organisation filter
3. **Service Level**: Tenant context validation
4. **API Level**: Middleware validates organisation access

### Updated Tables with Tenant Isolation

All application tables now include `organisationId`:

- ✅ `cases` - Case records
- ✅ `evidence` - Evidence submissions
- ✅ `hearings` - Hearing schedules
- ✅ `pleas` - Defendant pleas
- ✅ `trials` - Trial records
- ✅ `sentences` - Sentencing records
- ✅ `appeals` - Appeal records
- ✅ `enforcement` - Enforcement actions
- ✅ `managed_lists` - Custom lists
- ✅ `proceeding_templates` - Workflow templates
- ✅ `proceeding_steps` - Workflow steps

## Services

### Tenant Service

**File: `lib/services/tenant.service.ts`**

Manages organisation context and user memberships.

**Key Functions:**

```typescript
// Get user's current organisation context
getUserTenantContext(userId: string): Promise<TenantContext | null>

// Verify user has access to organisation
verifyUserOrganisationAccess(userId: string, organisationId: string): Promise<boolean>

// Get all organisations user belongs to
getUserOrganisations(userId: string): Promise<Organisation[]>

// Switch user's active organisation
switchUserOrganisation(userId: string, organisationId: string): Promise<boolean>

// Check if organisation is active
isOrganisationActive(organisationId: string): Promise<boolean>
```

**Example Usage:**

```typescript
import { getUserTenantContext } from '@/lib/services/tenant.service';

// Get user's organisation context
const context = await getUserTenantContext(userId);
if (!context) {
  throw new Error("User has no organisation access");
}

// Use context for queries
const cases = await db.query.cases.findMany({
  where: eq(cases.organisationId, context.organisationId)
});
```

### Authorization Service

**File: `lib/services/authorization.service.ts`**

Handles permission checking and role management.

**Key Functions:**

```typescript
// Get all permissions for user
getUserPermissions(userId: string, organisationId: string): Promise<UserPermissions>

// Check specific permission
hasPermission(userId: string, organisationId: string, permissionSlug: string): Promise<boolean>

// Check any of multiple permissions
hasAnyPermission(userId: string, organisationId: string, permissionSlugs: string[]): Promise<boolean>

// Check all permissions
hasAllPermissions(userId: string, organisationId: string, permissionSlugs: string[]): Promise<boolean>

// Check role membership
hasRole(userId: string, organisationId: string, roleSlug: string): Promise<boolean>

// Assign role to user
assignRole(userId: string, roleId: string, organisationId: string, assignedBy: string): Promise<string>

// Revoke role from user
revokeRole(userRoleId: string, revokedBy: string): Promise<void>

// Grant direct permission
grantPermission(userId: string, permissionId: string, organisationId: string, assignedBy: string): Promise<string>

// Deny permission (explicit deny)
denyPermission(userId: string, permissionId: string, organisationId: string, assignedBy: string): Promise<string>
```

**Permission Resolution Logic:**

```
1. Check if user is super admin → Grant all permissions
2. Get user's active roles in organisation
3. Get permissions from those roles
4. Get direct user permissions (grants)
5. Get direct user permission denies
6. Result = (Role Permissions + Direct Grants) - Explicit Denies
```

**Example Usage:**

```typescript
import { hasPermission, hasRole } from '@/lib/services/authorization.service';

// Check if user can create cases
const canCreate = await hasPermission(userId, organisationId, 'cases:create');
if (!canCreate) {
  return { error: "Unauthorized" };
}

// Check if user is a judge
const isJudge = await hasRole(userId, organisationId, 'judge');
if (isJudge) {
  // Allow verdict submission
}
```

## Implementation Guide

### 1. Setup Organisations

```typescript
import { db } from '@/lib/drizzle/connection';
import { organisations } from '@/lib/drizzle/schema/organisation-schema';
import { generateUUID } from '@/lib/services/uuid.service';

// Create Fiji organisation
const fijiId = generateUUID();
await db.insert(organisations).values({
  id: fijiId,
  name: 'Fiji',
  code: 'FJ',
  type: 'country',
  description: 'Republic of Fiji Court System',
  isActive: true,
});

// Create Samoa organisation
const samoaId = generateUUID();
await db.insert(organisations).values({
  id: samoaId,
  name: 'Samoa',
  code: 'WS',
  type: 'country',
  description: 'Independent State of Samoa Court System',
  isActive: true,
});
```

### 2. Create Roles

```typescript
import { roles } from '@/lib/drizzle/schema/rbac-schema';

// Create Judge role for Fiji
const judgeRoleId = generateUUID();
await db.insert(roles).values({
  id: judgeRoleId,
  organisationId: fijiId,
  name: 'Judge',
  slug: 'judge',
  description: 'Presiding judge with full case authority',
  isSystem: true,
  isActive: true,
});
```

### 3. Create Permissions

```typescript
import { permissions } from '@/lib/drizzle/schema/rbac-schema';

// Create case permissions
const permissionData = [
  { resource: 'cases', action: 'create', slug: 'cases:create' },
  { resource: 'cases', action: 'read', slug: 'cases:read' },
  { resource: 'cases', action: 'update', slug: 'cases:update' },
  { resource: 'cases', action: 'delete', slug: 'cases:delete' },
  { resource: 'cases', action: 'assign', slug: 'cases:assign' },
];

for (const perm of permissionData) {
  await db.insert(permissions).values({
    id: generateUUID(),
    resource: perm.resource,
    action: perm.action,
    slug: perm.slug,
    isSystem: true,
  });
}
```

### 4. Link Roles to Permissions

```typescript
import { rolePermissions } from '@/lib/drizzle/schema/rbac-schema';

// Give judge role all case permissions
const casePermissions = await db.query.permissions.findMany({
  where: like(permissions.slug, 'cases:%')
});

for (const perm of casePermissions) {
  await db.insert(rolePermissions).values({
    id: generateUUID(),
    roleId: judgeRoleId,
    permissionId: perm.id,
  });
}
```

### 5. Add Users to Organisation

```typescript
import { organisationMembers } from '@/lib/drizzle/schema/organisation-schema';

// Add user to Fiji organisation
await db.insert(organisationMembers).values({
  id: generateUUID(),
  organisationId: fijiId,
  userId: someUserId,
  isPrimary: true,
  isActive: true,
});
```

### 6. Assign Role to User

```typescript
import { assignRole } from '@/lib/services/authorization.service';

// Assign judge role to user in Fiji
await assignRole(
  userId,
  judgeRoleId,
  fijiId,
  adminUserId
);
```

### 7. Protect Routes with Permissions

```typescript
// app/dashboard/cases/create/page.tsx
import { auth } from '@/lib/auth';
import { getUserTenantContext } from '@/lib/services/tenant.service';
import { hasPermission } from '@/lib/services/authorization.service';
import { redirect } from 'next/navigation';

export default async function CreateCasePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect('/auth/login');
  }

  // Get tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return <div>No organisation access</div>;
  }

  // Check permission
  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:create',
    context.isSuperAdmin
  );

  if (!canCreate) {
    return <div>Unauthorized: Cannot create cases</div>;
  }

  return <CreateCaseForm />;
}
```

### 8. Server Actions with Permission Checks

```typescript
// app/dashboard/cases/actions.ts
"use server";

import { auth } from '@/lib/auth';
import { getUserTenantContext } from '@/lib/services/tenant.service';
import { hasPermission } from '@/lib/services/authorization.service';
import { db } from '@/lib/drizzle/connection';
import { cases } from '@/lib/drizzle/schema/db-schema';
import { generateUUID } from '@/lib/services/uuid.service';

export async function createCase(data: { title: string; type: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation access" };
  }

  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:create',
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { error: "Permission denied" };
  }

  const caseId = generateUUID();
  await db.insert(cases).values({
    id: caseId,
    organisationId: context.organisationId, // 👈 Tenant isolation
    title: data.title,
    type: data.type,
    status: 'open',
    filedBy: session.user.id,
  });

  return { success: true, caseId };
}
```

## Migration Strategy

### Phase 1: Database Migration

```bash
# Push schema changes to database
npm run db-push
```

### Phase 2: Data Migration

Create migration script to:

1. Create initial organisations
2. Assign existing users to organisations
3. Create default roles
4. Create permissions
5. Link roles to permissions
6. Assign roles to existing users
7. Populate organisationId in existing data

### Phase 3: Code Updates

1. Update all queries to include organisation context
2. Add permission checks to routes and actions
3. Update UI to show current organisation
4. Add organisation switcher component
5. Update forms to include organisation context

## Security Considerations

### 1. Defense in Depth

- **Database**: Foreign key constraints
- **Query**: Organisation filters in all queries
- **Service**: Tenant validation
- **API**: Permission middleware
- **UI**: Component-level checks

### 2. Super Admin Access

Super admins bypass organisation and permission checks:

```typescript
// Check in user table
isSuperAdmin: boolean = true
```

**Use sparingly** for platform administration only.

### 3. Explicit Denies

User permissions support explicit denies that override role permissions:

```typescript
// Deny a permission
granted: false  // Explicit deny
```

### 4. Audit Trail

All role and permission changes are logged:

```typescript
rbac_audit_log {
  action: "assigned" | "revoked" | "created" | "deleted"
  performedBy: userId
  targetUserId: userId
  changes: JSON
}
```

## User Onboarding & Role Assignment

Totolaw provides two mechanisms for adding users to organisations and assigning roles:

### Admin-Initiated Invitations

**Process:**
1. Admin navigates to `/dashboard/users/invite`
2. Enters user email and selects roles to assign
3. *(Super admin only)* Can grant direct permissions
4. User receives invitation email with secure token
5. User accepts invitation and account is created/linked
6. Roles are automatically assigned upon acceptance
7. User gains immediate access to organisation

**Benefits:**
- Full admin control over user access
- Pre-assign roles before user joins
- Direct permission grants (super admin)
- Ideal for onboarding known staff members

**Implementation:**
```typescript
// Invite user with roles
await inviteUser(
  'user@example.com',
  [judgeRoleId, viewerRoleId],  // Multiple roles
  []                             // Direct permissions (super admin only)
);
```

### User-Initiated Join Requests

**Process:**
1. User navigates to `/organisations/join`
2. Searches/browses available organisations
3. Submits join request with optional message
4. Admin receives notification at `/dashboard/users/requests`
5. Admin reviews request and user details
6. Admin approves (assigns roles) or rejects (with reason)
7. User receives notification and gains access if approved

**Benefits:**
- Self-service discovery mechanism
- Reduces admin workload
- Approval workflow maintains control
- Ideal for open registration with review

**Implementation:**
```typescript
// User submits request
await requestToJoinOrganisation(
  organisationId,
  "I'm a registered lawyer with 5 years experience"
);

// Admin approves with roles
await approveJoinRequestAction(
  requestId,
  [lawyerRoleId, caseViewerRoleId]
);
```

### When to Use Each Method

| Scenario | Use Invitations | Use Join Requests |
|----------|----------------|-------------------|
| **Onboarding staff** | ✅ Yes | ❌ No |
| **Known users** | ✅ Yes | ⚠️ Optional |
| **Self-service access** | ❌ No | ✅ Yes |
| **Open registration** | ❌ No | ✅ Yes |
| **Pre-assign specific roles** | ✅ Yes | ⚠️ During approval |
| **Grant direct permissions** | ✅ Yes (super admin) | ❌ No |

### Role Assignment Best Practices

**Multiple Roles:**
```typescript
// Users can have multiple roles in an organisation
await assignRoles(userId, organisationId, [
  judgeRoleId,      // Primary role
  viewerRoleId,     // Additional access
  reporterRoleId    // Reporting capability
]);
```

**Scoped Roles:**
```typescript
// Limit role to specific division/context
await assignRole(userId, judgeRoleId, orgId, adminId, {
  scope: JSON.stringify({ 
    division: 'criminal',
    location: 'suva-court'
  })
});
```

**Temporary Roles:**
```typescript
// Assign role with expiration
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 90);  // 90 days

await assignRole(userId, roleId, orgId, adminId, undefined, expiresAt);
```

**Direct Permissions (Super Admin Only):**
```typescript
// Grant specific permission outside of roles
await grantPermission(
  userId,
  organisationId,
  'cases:delete',  // Permission slug
  true,            // Grant (false = deny)
  adminId
);
```

## Best Practices

### 1. Always Use Context

```typescript
// ✅ Good: Get context first
const context = await getUserTenantContext(userId);
const cases = await db.query.cases.findMany({
  where: eq(cases.organisationId, context.organisationId)
});

// ❌ Bad: Hardcoded organisation
const cases = await db.query.cases.findMany({
  where: eq(cases.organisationId, 'some-org-id')
});
```

### 2. Check Permissions Early

```typescript
// ✅ Good: Check at the start
async function updateCase(caseId: string) {
  const canUpdate = await hasPermission(userId, orgId, 'cases:update');
  if (!canUpdate) return { error: "Unauthorized" };
  
  // ... proceed with update
}
```

### 3. Use Slugs for Permissions

```typescript
// ✅ Good: Use slug for checks
await hasPermission(userId, orgId, 'cases:create');

// ❌ Bad: Use ID
await hasPermission(userId, orgId, permissionId);
```

### 4. Leverage Invitations for Onboarding

```typescript
// ✅ Good: Invite with roles pre-assigned
await inviteUser(email, [adminRoleId, managerRoleId]);

// User automatically gets roles when accepting
```

### 5. Use Join Requests for Discovery

```typescript
// ✅ Good: Allow users to discover and request access
// They browse /organisations/join
// Admins review at /dashboard/users/requests
```

## Future Enhancements

1. **Row-Level Security (RLS)**: Implement PostgreSQL RLS policies
2. **Dynamic Permissions**: Condition-based permissions (e.g., "own cases only")
3. **Permission Inheritance**: Child organisations inherit parent permissions
4. **Time-Based Access**: Schedule role activation/deactivation
5. **Multi-Factor Authorization**: Require approval for sensitive actions
6. **Permission Bundles**: Pre-defined permission sets for common scenarios
7. **Delegation**: Users can delegate permissions temporarily
8. **API Rate Limiting**: Per-organisation and per-role rate limits

## Support Matrix

### Supported Pacific Islands (Initial)

- 🇫🇯 Fiji
- 🇼🇸 Samoa  
- 🇹🇴 Tonga
- 🇻🇺 Vanuatu
- 🇰🇮 Kiribati
- 🇫🇲 Micronesia
- 🇵🇼 Palau
- 🇲🇭 Marshall Islands
- 🇸🇧 Solomon Islands
- 🇹🇻 Tuvalu

### Ready for Expansion

The architecture supports unlimited organisations, making it easy to onboard new Pacific Island nations or expand to other regions.

---

**Built for Pacific Island Unity 🌴**
