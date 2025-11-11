# Super Admin Omnipotent Access

## Overview

System administrators (super admins) have been granted full omnipotent access to all data, permissions, and operations across the entire platform, regardless of organization membership. This document explains how this works.

## Key Features

### 1. **No Organization Membership Required**
- Super admins do NOT need to be members of any organization to access its data
- They can view, create, update, and delete records across ALL organizations
- They have access to all permissions without explicit role assignments

### 2. **Special Organization Context**
When a super admin logs in without selecting a specific organization, they receive a special organization context:

```typescript
{
  organizationId: "*",  // The asterisk means "all organizations"
  userId: "...",
  isSuperAdmin: true
}
```

### 3. **Automatic Bypassing of Filters**

All organization-based filtering is automatically bypassed for super admins:

- **Query filters**: The `withOrgFilter()` helper returns `undefined` or skips org conditions when `organizationId === "*"`
- **Validation**: The `validateOrgAccess()` function passes immediately for super admins
- **Access checks**: The `hasOrgAccess()` function always returns `true` for super admins

## Implementation Details

### Tenant Service (`lib/services/tenant.service.ts`)

#### `getUserTenantContext()`
- Returns `organizationId: "*"` for super admins without a selected organization
- This signals omnipotent access throughout the application

#### `getUserOrganizations()`
- Super admins get ALL active organizations in the system
- They can switch between organizations or use "*" for global access

#### `verifyUserOrganizationAccess()`
- Always returns `true` for super admins
- Bypasses membership checks entirely

### Query Helpers (`lib/utils/query-helpers.ts`)

#### `withOrgFilter()`
```typescript
// Super admin bypass
if (organizationId === "*") {
  // Return only additional conditions, skip org filter
  return additionalConditions ? and(...additionalConditions) : undefined;
}
```

#### `validateOrgAccess()`
```typescript
// Super admins bypass validation
if (organizationId === "*") {
  return; // Access granted
}
```

#### `hasOrgAccess()`
```typescript
// Super admins have access to all records
if (organizationId === "*") {
  return record != null;
}
```

### Authorization Service (`lib/services/authorization.service.ts`)

All permission checking functions automatically return `true` for super admins:
- `hasPermission()` - Always returns `true`
- `hasAnyPermission()` - Always returns `true`
- `hasAllPermissions()` - Always returns `true`
- `hasRole()` - Always returns `true`

## Usage Examples

### Example 1: Viewing All Cases Across Organizations

```typescript
const context = await getUserTenantContext(userId);
// Super admin gets: { organizationId: "*", userId: "...", isSuperAdmin: true }

const cases = await db
  .select()
  .from(casesTable)
  .where(withOrgFilter(context.organizationId, casesTable));
// Returns ALL cases from ALL organizations
```

### Example 2: Searching Globally

```typescript
const context = await getUserTenantContext(session.user.id);
const isSuperAdmin = context.organizationId === "*";

const results = await db
  .select()
  .from(cases)
  .where(
    isSuperAdmin
      ? sql`LOWER(${cases.title}) LIKE ${pattern}` // No org filter
      : sql`${cases.organizationId} = ${context.organizationId} AND LOWER(${cases.title}) LIKE ${pattern}`
  );
```

### Example 3: Validating Access to Records

```typescript
const caseRecord = await getCaseById(id);

// Regular users: throws error if wrong org
// Super admins: always passes
validateOrgAccess(context.organizationId, caseRecord, 'Case');
```

### Example 4: Creating Records in Specific Organizations

```typescript
// Super admins must specify which organization when creating
// The "*" context is for reading only
await db.insert(cases).values(
  withOrgId(targetOrganizationId, {
    title: "New Case",
    status: "active"
  })
);
// Note: Will throw error if using "*" as organizationId
```

## Organization Switcher

Super admins see a special option in the organization switcher:

```
┌─────────────────────────────────────┐
│ All Organizations (Super Admin) ✓  │  ← Special entry
├─────────────────────────────────────┤
│ Organization A                      │
│ Organization B                      │
│ Organization C                      │
└─────────────────────────────────────┘
```

When "All Organizations" is selected, the context uses `organizationId: "*"` for omnipotent access.

## Security Considerations

### 1. **Super Admin Flag**
- The `isSuperAdmin` flag in the `users` table is the source of truth
- Only users in the `system_admins` table can have this flag set
- Regular users cannot elevate themselves

### 2. **Automatic Elevation**
- Super admin status is automatically granted on login
- See `lib/services/system-admin.service.ts` and `lib/middleware/super-admin.middleware.ts`

### 3. **Audit Logging**
- All super admin actions should be logged (implement as needed)
- Consider adding audit trails for sensitive operations

### 4. **Insert Operations**
- Super admins MUST specify a valid `organizationId` when creating records
- The "*" context only works for queries, not inserts
- This prevents accidental creation of orphaned records

## Helper Utilities

Use the centralized super admin helpers from `lib/utils/super-admin-helpers.ts`:

```typescript
import { 
  isCurrentUserSuperAdmin,
  isUserSuperAdmin,
  isSuperAdminContext,
  requireSuperAdmin,
  shouldBypassOrgCheck 
} from "@/lib/utils/super-admin-helpers";

// Check if current session is super admin
const isSuperAdmin = await isCurrentUserSuperAdmin();

// Check if organization ID represents omnipotent access
if (isSuperAdminContext(organizationId)) {
  // Handle super admin case
}

// Require super admin or throw error
await requireSuperAdmin();
```

## Testing Super Admin Access

### Test Checklist

- [ ] Super admin can view cases from all organizations
- [ ] Super admin can view hearings from all organizations  
- [ ] Super admin can view evidence from all organizations
- [ ] Super admin can search globally across all organizations
- [ ] Super admin can switch between specific organizations
- [ ] Super admin can access data without being an org member
- [ ] Super admin has all permissions regardless of roles
- [ ] Regular users still have proper org-based restrictions
- [ ] Super admin cannot use "*" for insert operations

## Migration Notes

If you need to manually grant super admin status to a user:

```sql
-- Add to system admins table
INSERT INTO system_admins (id, email, name, is_active, added_by)
VALUES (gen_random_uuid(), 'admin@example.com', 'Admin User', true, 'system');

-- Update user's super admin flag
UPDATE users 
SET is_super_admin = true, updated_at = NOW()
WHERE email = 'admin@example.com';
```

Or use the management scripts:
```bash
npm run admin:add admin@example.com "Admin User"
```

## Troubleshooting

### Issue: Super admin still seeing "Organization context not found" error

**Solution**: Check that `getUserTenantContext()` is returning `organizationId: "*"` for the super admin user.

### Issue: Super admin only seeing data from one organization

**Solution**: Ensure the super admin's `currentOrganizationId` is `null` in the database, or they've selected "All Organizations" in the switcher.

### Issue: Super admin cannot create records

**Solution**: When creating records, super admins must specify a target `organizationId` (cannot use "*").

## Related Files

- `lib/services/tenant.service.ts` - Organization context management
- `lib/utils/query-helpers.ts` - Query filtering utilities
- `lib/services/authorization.service.ts` - Permission checking
- `lib/utils/super-admin-helpers.ts` - Super admin utility functions
- `lib/middleware/super-admin.middleware.ts` - Session middleware
- `app/dashboard/layout.tsx` - Organization switcher UI
- `app/dashboard/actions.ts` - Dashboard data access
- `app/dashboard/search/actions.ts` - Global search

## Summary

Super admins have been granted complete omnipotent access to the system:

✅ Access all organizations without membership  
✅ Bypass all organization-based filters  
✅ Have all permissions automatically  
✅ Can switch between orgs or use global "*" context  
✅ See all data in searches and queries  
✅ Validated at every authorization checkpoint  

The implementation uses a special `organizationId: "*"` context that signals to all query helpers, validators, and permission checks to bypass restrictions for super admins.
