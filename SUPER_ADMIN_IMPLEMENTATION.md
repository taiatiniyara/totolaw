# System Admin Omnipotent Access - Implementation Summary

## Date: November 11, 2025

## Objective
Grant system administrators full omnipotent access to all permissions, tables, and CRUD operations across all organizations, even if they are not members of any organization.

## Changes Made

### 1. **Tenant Service** (`lib/services/tenant.service.ts`)

#### `getUserTenantContext()`
- Modified to return special `organizationId: "*"` for super admins
- This signals omnipotent access throughout the application
- Super admins without a selected organization get the "*" context
- Super admins can still switch to specific organizations if desired

#### `getUserOrganizations()`
- Enhanced to return ALL active organizations for super admins
- Super admins see every organization in the system, not just their memberships
- Returns data in the same format as regular membership queries

#### `verifyUserOrganizationAccess()`
- Already had super admin bypass, but now documented and verified

**Key Code:**
```typescript
// Super admins get special context with "*" organization ID
if (userRecord.isSuperAdmin) {
  return {
    organizationId: userRecord.currentOrganizationId || "*",
    userId: userRecord.id,
    isSuperAdmin: true,
  };
}
```

### 2. **Query Helpers** (`lib/utils/query-helpers.ts`)

#### `withOrgFilter()`
- Added super admin bypass: when `organizationId === "*"`, skips organization filtering
- Returns only additional conditions or undefined for super admins
- Regular users continue to have strict org filtering

#### `withOrgId()`
- Added validation: super admins cannot use "*" for insert operations
- Forces super admins to specify a target organization when creating records
- Prevents orphaned or incorrectly scoped records

#### `validateOrgAccess()`
- Added super admin bypass: when `organizationId === "*"`, validation passes immediately
- Super admins can access any record regardless of organization

#### `hasOrgAccess()`
- Added super admin bypass: when `organizationId === "*"`, always returns true
- Super admins have access to all non-null records

**Key Code:**
```typescript
export function withOrgFilter<T extends PgTable>(
  organizationId: string,
  table: T,
  additionalConditions?: SQL[]
): SQL | undefined {
  // Super admin bypass: "*" means access to all organizations
  if (organizationId === "*") {
    if (!additionalConditions || additionalConditions.length === 0) {
      return undefined;
    }
    return and(...additionalConditions);
  }
  // ... normal filtering for regular users
}
```

### 3. **Dashboard Actions** (`app/dashboard/actions.ts`)

#### `getUpcomingHearings()`
- Added support for super admin context
- Now includes `organizationId` in results for display purposes
- Super admins see hearings from ALL organizations

#### `getRecentCases()`
- Added support for super admin context
- Now includes `organizationId` in results for display purposes
- Super admins see cases from ALL organizations

**Key Changes:**
- Uses `withOrgFilter()` which automatically handles super admin bypass
- Includes `organizationId` field in select statements for transparency

### 4. **Search Actions** (`app/dashboard/search/actions.ts`)

#### `globalSearch()`
- Added super admin detection: `isSuperAdmin = context.organizationId === "*"`
- Modified SQL queries to conditionally include or exclude org filtering
- Super admins search across ALL organizations
- Regular users still restricted to their organization

**Key Code:**
```typescript
const isSuperAdmin = context.organizationId === "*";

const casesResults = await db
  .select({...})
  .from(cases)
  .where(
    isSuperAdmin
      ? sql`(LOWER(${cases.title}) LIKE ${searchPattern})`
      : sql`${cases.organizationId} = ${context.organizationId} AND ...`
  );
```

### 5. **Dashboard Layout** (`app/dashboard/layout.tsx`)

#### Organization Switcher Enhancement
- Added special "All Organizations (Super Admin)" option for super admins
- This option appears when super admin has `organizationId === "*"`
- Allows super admins to explicitly see they're in omnipotent mode

**Key Code:**
```typescript
if (isSuperAdmin && currentOrganizationId === "*") {
  organizations = [
    {
      id: "*",
      name: "All Organizations (Super Admin)",
      code: "*",
      type: "system",
      isPrimary: true,
    },
    ...organizations,
  ];
}
```

### 6. **Super Admin Helper Utilities** (NEW FILE: `lib/utils/super-admin-helpers.ts`)

Created centralized utility functions for super admin checks:

- `isCurrentUserSuperAdmin()` - Check if current session is super admin
- `isUserSuperAdmin(userId)` - Check if a specific user is super admin
- `isSuperAdminContext(orgId)` - Check if organization ID is "*"
- `requireSuperAdmin()` - Throw error if not super admin
- `getSessionWithSuperAdminStatus()` - Get session with super admin flag
- `shouldBypassOrgCheck()` - Determine if org check should be bypassed

These provide consistent super admin checking across the application.

### 7. **Documentation** (NEW FILE: `docs/super-admin-access.md`)

Created comprehensive documentation covering:
- Overview of omnipotent access
- Implementation details
- Usage examples
- Security considerations
- Helper utilities
- Testing checklist
- Troubleshooting guide

### 8. **README Updates** (`README.md`)

- Added reference to super admin access documentation
- Added bullet point highlighting omnipotent access feature

## How It Works

### The "*" Convention
The implementation uses `organizationId: "*"` as a special sentinel value that signals omnipotent access:

1. **Set at login**: When a super admin logs in, `getUserTenantContext()` returns `"*"` if no specific org is selected
2. **Checked everywhere**: All query helpers, validators, and actions check for `"*"`
3. **Bypasses filters**: When `"*"` is detected, organization filters are skipped
4. **Safe for queries**: Only works for SELECT queries, not INSERT/UPDATE/DELETE (must specify real org)

### Authorization Flow

```
User Login
    ↓
Check isSuperAdmin flag
    ↓
If TRUE → Set organizationId = "*"
    ↓
Query Data
    ↓
withOrgFilter() sees "*" → Skip org filtering
    ↓
Return ALL data from ALL organizations
```

### Regular Users vs Super Admins

**Regular User:**
```typescript
context = { organizationId: "org-123", isSuperAdmin: false }
withOrgFilter("org-123", table) → eq(table.organizationId, "org-123")
// Only sees data from org-123
```

**Super Admin:**
```typescript
context = { organizationId: "*", isSuperAdmin: true }
withOrgFilter("*", table) → undefined (no filter)
// Sees ALL data from ALL organizations
```

## Benefits

1. ✅ **No Membership Required** - Super admins don't need to be added to every organization
2. ✅ **Full Visibility** - Can see and manage all data across the system
3. ✅ **Easy Switching** - Can switch to specific orgs for focused work
4. ✅ **Backwards Compatible** - Regular users unaffected, all existing code works
5. ✅ **Type Safe** - TypeScript ensures correct implementation
6. ✅ **Secure** - Only users in `system_admins` table can have this access
7. ✅ **Auditable** - All actions can be tracked with super admin context

## Testing Recommendations

To verify the implementation:

1. **Create a super admin user** using the admin scripts
2. **Login as super admin** and verify organizationId is "*"
3. **Check dashboard** - should see data from all orgs
4. **Perform search** - should find results across all orgs
5. **Switch organizations** - should be able to see all orgs in switcher
6. **Try CRUD operations** - should work on any org's data
7. **Login as regular user** - verify they still only see their org

## Files Modified

1. `lib/services/tenant.service.ts` - Organization context and access
2. `lib/utils/query-helpers.ts` - Query filtering utilities
3. `app/dashboard/actions.ts` - Dashboard data fetching
4. `app/dashboard/search/actions.ts` - Global search functionality
5. `app/dashboard/layout.tsx` - Organization switcher UI
6. `README.md` - Documentation reference

## Files Created

1. `lib/utils/super-admin-helpers.ts` - Centralized utility functions
2. `docs/super-admin-access.md` - Comprehensive documentation
3. `SUPER_ADMIN_IMPLEMENTATION.md` - This summary document

## Security Notes

- ⚠️ Super admin status is controlled by the `isSuperAdmin` flag in the database
- ⚠️ Only users in the `system_admins` table can have this flag
- ⚠️ The flag is set automatically during login via `checkAndElevateSuperAdmin()`
- ⚠️ Regular users cannot self-elevate to super admin
- ⚠️ Consider implementing audit logging for super admin actions

## Next Steps (Optional Enhancements)

1. **Audit Logging** - Log all super admin queries with organizationId
2. **Activity Tracking** - Dashboard showing super admin activity
3. **Granular Controls** - Allow limiting super admin access to specific operations
4. **UI Indicators** - Show visual badges when viewing cross-org data
5. **Report Generation** - Tools for super admins to generate cross-org reports

## Conclusion

System administrators now have complete omnipotent access to all data and operations across all organizations. The implementation:

- Uses the special `"*"` organization ID convention
- Bypasses all organization-based filtering and validation
- Maintains backward compatibility with existing code
- Provides centralized utilities for consistency
- Is fully documented for future maintenance

Super admins can now effectively manage the entire system without being constrained by organization membership.
