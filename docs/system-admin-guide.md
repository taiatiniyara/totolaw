# System Administrator Guide

Complete guide for managing super administrators in the Totolaw platform.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Managing Super Admins](#managing-super-admins)
- [Super Admin Capabilities](#super-admin-capabilities)
- [Query Helpers](#query-helpers)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Overview

System administrators (super admins) have **omnipotent access** to the entire platform:

- ✅ Access all organisations without membership
- ✅ Bypass all organisation-based filters
- ✅ Have all permissions automatically
- ✅ View, create, update, and delete data across all organisations
- ✅ Manage other system administrators

### The Magic: `organisationId: "*"`

When a super admin's organisation context is `"*"`, they have access to everything. This special value signals to all query helpers, validators, and permission checks to bypass restrictions.

## Quick Start

### 1. Add Super Admins (CLI)

```bash
# Add a new super admin
npm run admin:add admin@example.com "Admin Name"

# List all super admins
npm run admin:list

# Remove super admin privileges
npm run admin:remove admin@example.com

# View audit log
npm run admin:audit
```

### 2. Add Super Admins (Service)

```typescript
import { grantSuperAdminByEmail } from '@/lib/services/system-admin.service';

// Grant super admin (creates user if doesn't exist)
await grantSuperAdminByEmail(
  "admin@example.com", 
  "Admin Name",
  grantedByUserId, 
  "Optional notes"
);
```

### 3. Login & Access

1. User logs in with magic link at `/auth/login`
2. Automatically gains super admin access
3. Navigate to `/dashboard/system-admin` for admin dashboard
4. Use organisation switcher to select "All Organisations (Super Admin)"

## How It Works

### Architecture

Super admin privileges are managed directly in the `user` table using the `is_super_admin` field:

```sql
CREATE TABLE "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  -- ... other fields ...
  
  -- Super admin fields
  is_super_admin BOOLEAN DEFAULT false NOT NULL,
  admin_notes TEXT,
  admin_added_by TEXT REFERENCES "user"(id),
  admin_added_at TIMESTAMP,
  last_login TIMESTAMP
);
```

### User Journey

```
┌─────────────────────────────────────────────┐
│ 1. Grant super admin privileges             │
│    npm run admin:add email "Name"           │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 2. User logs in with magic link             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 3. Middleware checks is_super_admin flag    │
│    Updates last_login timestamp             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 4. User gains full platform access          │
│    organisationId: "*" in context           │
└─────────────────────────────────────────────┘
```

### Organisation Context

```typescript
// Super admin context (global access)
{
  organisationId: "*",
  userId: "user-123",
  isSuperAdmin: true
}

// Regular user context (organisation-scoped)
{
  organisationId: "org-456",
  userId: "user-789",
  isSuperAdmin: false
}
```

## Managing Super Admins

### Via CLI (Recommended)

```bash
# Grant super admin privileges
npm run admin:add admin@example.com "Admin Name" "Optional notes"

# Revoke super admin privileges
npm run admin:remove admin@example.com "Optional reason"

# List all super admins
npm run admin:list

# View audit log
npm run admin:audit
```

### Via Service Layer

```typescript
import {
  grantSuperAdmin,
  grantSuperAdminByEmail,
  revokeSuperAdmin,
  isSuperAdmin,
  listSuperAdmins
} from '@/lib/services/system-admin.service';

// Grant to existing user
await grantSuperAdmin(userId, grantedByUserId, "notes");

// Grant by email (creates user if needed)
await grantSuperAdminByEmail(
  "admin@example.com",
  "Admin Name",
  grantedByUserId,
  "notes"
);

// Revoke privileges
await revokeSuperAdmin(userId, revokedByUserId, "reason");

// Check if user is super admin
const isAdmin = await isSuperAdmin(userId);

// List all super admins
const admins = await listSuperAdmins();
```

### Via UI

1. Log in as existing super admin
2. Navigate to **Dashboard → System Admin → Administrators**
3. Use the interface to add, remove, or manage admins

## Super Admin Capabilities

### What Super Admins Can Do

#### 1. Organisation Management
- Create new organisations (courts, tribunals)
- View all organisations without membership
- Activate/deactivate organisations
- Manage organisational hierarchies

#### 2. Data Access
- View all cases across all organisations
- View all hearings across all organisations
- View all evidence and documents
- Search globally across organisations

#### 3. System Administration
- Add/remove other system admins
- View system-wide statistics
- Access comprehensive audit logs
- Manage roles and permissions

#### 4. Bypass Restrictions
- Access data without organisation membership
- Override all permission checks
- Create records in any organisation
- No organisation-based filtering

### What Super Admins Cannot Do

- Cannot use `"*"` for INSERT operations (must specify target organisationId)
- Actions are fully audited (cannot bypass logging)
- Cannot delete themselves (only deactivate)

## Query Helpers

### Checking Super Admin Status

```typescript
import {
  isCurrentUserSuperAdmin,
  isSuperAdminContext,
  requireSuperAdmin
} from "@/lib/utils/super-admin-helpers";

// Check if current session is super admin
const isSuperAdmin = await isCurrentUserSuperAdmin();

// Check if organisation ID represents omnipotent access
if (isSuperAdminContext(organisationId)) {
  // Handle super admin case
}

// Require super admin or throw error
await requireSuperAdmin();
```

### Query Filtering (Automatic Bypass)

```typescript
import { withOrgFilter } from "@/lib/utils/query-helpers";

const context = await getUserTenantContext(userId);

// Super admins: returns ALL cases
// Regular users: returns only their org's cases
const cases = await db
  .select()
  .from(casesTable)
  .where(withOrgFilter(context.organisationId, casesTable));
```

### Access Validation (Automatic Bypass)

```typescript
import { validateOrgAccess } from "@/lib/utils/query-helpers";

const caseRecord = await getCaseById(id);

// Super admins: always passes
// Regular users: throws error if wrong org
validateOrgAccess(context.organisationId, caseRecord, 'Case');
```

### Custom Queries with Super Admin Check

```typescript
const context = await getUserTenantContext(userId);
const isSuperAdmin = context.organisationId === "*";

const results = await db
  .select()
  .from(cases)
  .where(
    isSuperAdmin
      ? sql`status = 'active'`  // No org filter
      : sql`organisation_id = ${context.organisationId} AND status = 'active'`
  );
```

## Security

### Authorization

All permission checks automatically return `true` for super admins:

```typescript
import { hasPermission } from "@/lib/services/authorization.service";

// Always returns true for super admins
const canEdit = await hasPermission(
  userId, 
  organisationId, 
  'cases.edit', 
  isSuperAdmin
);
```

### Audit Logging

All super admin actions are logged to `system_admin_audit_log`:

```typescript
import { getSystemAdminAuditLog } from '@/lib/services/system-admin.service';

const logs = await getSystemAdminAuditLog(limit, offset, adminId);
```

Audit log includes:
- User who performed the action
- Action type and description
- Entity type and ID affected
- Timestamp
- IP address and user agent
- Additional metadata

### Best Practices

#### 1. Principle of Least Privilege
- Only grant super admin to trusted individuals
- Use organisation-specific admins for day-to-day operations
- Reserve super admin for setup and configuration

#### 2. Regular Audits
- Review active super admins monthly
- Check audit logs for unusual activity
- Remove admins who no longer need access

#### 3. Documentation
- Use the `notes` field to document why each admin was added
- Include their role or department
- Document review dates

#### 4. Onboarding Process
1. Add admin email with documentation
2. Send them login link
3. Verify access to super admin dashboard
4. Brief on responsibilities
5. Share this documentation

#### 5. Offboarding Process
1. Revoke privileges via CLI or UI
2. Verify super admin flag is removed
3. Document reason in audit log
4. Notify team of change

## Troubleshooting

### Admin Cannot Access Super Admin Dashboard

**Symptoms:** User logs in but doesn't see super admin access

**Checks:**

1. Verify super admin status:
```typescript
const isAdmin = await isSuperAdmin(userId);
```

2. Check database:
```sql
SELECT email, is_super_admin, admin_added_at 
FROM "user" 
WHERE email = 'admin@example.com';
```

**Solutions:**
- Grant super admin: `npm run admin:add email "Name"`
- Check for typos in email
- Have user log out and log back in

### Super Admin Only Sees One Organisation's Data

**Symptoms:** Super admin sees filtered data instead of all data

**Checks:**

1. Verify organisation context:
```typescript
const context = await getUserTenantContext(userId);
console.log('Context:', context);
// Should show: { organisationId: "*", ... }
```

2. Check organisation switcher selection

**Solutions:**
- Select "All Organisations (Super Admin)" in switcher
- Clear `current_organisation_id` in database:
```sql
UPDATE "user" 
SET current_organisation_id = NULL 
WHERE email = 'admin@example.com';
```

### Super Admin Cannot Create Records

**Symptoms:** Error when trying to insert data

**Cause:** Using `"*"` as organisationId for inserts

**Solution:** Must specify target organisation:
```typescript
// ❌ Wrong
await db.insert(cases).values(
  withOrgId("*", { title: "New Case" })
);

// ✅ Correct
await db.insert(cases).values(
  withOrgId(targetOrganisationId, { title: "New Case" })
);
```

### Query Not Bypassing Organisation Filter

**Symptoms:** Super admin still sees filtered results

**Solution:** Use query helpers that support super admin bypass:

```typescript
// ❌ Manual filter (doesn't bypass)
.where(eq(table.organisationId, context.organisationId))

// ✅ Helper function (bypasses for super admins)
.where(withOrgFilter(context.organisationId, table))
```

## Quick Reference

### Helper Functions

| Function | Purpose | Import From |
|----------|---------|-------------|
| `isCurrentUserSuperAdmin()` | Check current session | `@/lib/utils/super-admin-helpers` |
| `isUserSuperAdmin(userId)` | Check specific user | `@/lib/utils/super-admin-helpers` |
| `isSuperAdminContext(orgId)` | Check if org ID is "*" | `@/lib/utils/super-admin-helpers` |
| `requireSuperAdmin()` | Throw if not super admin | `@/lib/utils/super-admin-helpers` |
| `withOrgFilter()` | Query filter with bypass | `@/lib/utils/query-helpers` |
| `validateOrgAccess()` | Validation with bypass | `@/lib/utils/query-helpers` |
| `hasOrgAccess()` | Access check with bypass | `@/lib/utils/query-helpers` |

### Service Functions

| Function | Purpose | Import From |
|----------|---------|-------------|
| `grantSuperAdmin()` | Grant to existing user | `@/lib/services/system-admin.service` |
| `grantSuperAdminByEmail()` | Grant by email | `@/lib/services/system-admin.service` |
| `revokeSuperAdmin()` | Revoke privileges | `@/lib/services/system-admin.service` |
| `isSuperAdmin()` | Check status | `@/lib/services/system-admin.service` |
| `listSuperAdmins()` | List all admins | `@/lib/services/system-admin.service` |
| `getSystemAdminAuditLog()` | Get audit logs | `@/lib/services/system-admin.service` |

### Common Patterns

#### Pattern 1: Simple Query
```typescript
const context = await getUserTenantContext(session.user.id);
const results = await db.select().from(table)
  .where(withOrgFilter(context.organisationId, table));
```

#### Pattern 2: With Additional Conditions
```typescript
const results = await db.select().from(cases)
  .where(withOrgFilter(context.organisationId, cases, [
    eq(cases.status, 'active')
  ]));
```

#### Pattern 3: Custom SQL
```typescript
const isSuperAdmin = context.organisationId === "*";
const results = await db.select().from(table)
  .where(isSuperAdmin 
    ? sql`status = 'active'`
    : sql`organisation_id = ${context.organisationId} AND status = 'active'`
  );
```

#### Pattern 4: Validation
```typescript
const record = await getRecordById(id);
validateOrgAccess(context.organisationId, record, 'Record');
```

## Related Files

- `lib/services/system-admin.service.ts` - Admin management service
- `lib/services/tenant.service.ts` - Organisation context
- `lib/utils/query-helpers.ts` - Query filtering utilities
- `lib/utils/super-admin-helpers.ts` - Super admin utilities
- `lib/middleware/super-admin.middleware.ts` - Session middleware
- `lib/drizzle/schema/auth-schema.ts` - User schema
- `lib/drizzle/schema/system-admin-schema.ts` - Audit log schema
- `app/dashboard/system-admin/*` - Admin UI
- `scripts/manage-admins.ts` - CLI tool

---

**Made with ❤️ for Pacific Island Court Systems**
