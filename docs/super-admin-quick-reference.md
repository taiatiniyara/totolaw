# Super Admin Quick Reference

## TL;DR

System admins now have **omnipotent access** to ALL data, permissions, and operations across ALL organizations without needing to be members.

## The Magic: `organizationId: "*"`

When a super admin's organization context is `"*"`, they have access to everything.

## Quick Usage Examples

### Check if User is Super Admin

```typescript
import { isCurrentUserSuperAdmin } from "@/lib/utils/super-admin-helpers";

const isSuperAdmin = await isCurrentUserSuperAdmin();
```

### Check if Context is Omnipotent

```typescript
import { isSuperAdminContext } from "@/lib/utils/super-admin-helpers";

const context = await getUserTenantContext(userId);
if (isSuperAdminContext(context.organizationId)) {
  // This is a super admin with full access
}
```

### Query Data (Automatic Bypass)

```typescript
import { withOrgFilter } from "@/lib/utils/query-helpers";

const context = await getUserTenantContext(userId);

// Super admins: returns ALL cases
// Regular users: returns only their org's cases
const cases = await db
  .select()
  .from(casesTable)
  .where(withOrgFilter(context.organizationId, casesTable));
```

### Validate Access (Automatic Bypass)

```typescript
import { validateOrgAccess } from "@/lib/utils/query-helpers";

const caseRecord = await getCaseById(id);

// Super admins: always passes
// Regular users: throws error if wrong org
validateOrgAccess(context.organizationId, caseRecord, 'Case');
```

### Conditional Logic Based on Super Admin

```typescript
const context = await getUserTenantContext(userId);
const isSuperAdmin = context.organizationId === "*";

if (isSuperAdmin) {
  // Show/query ALL organizations
  const query = sql`SELECT * FROM cases`;
} else {
  // Filter by organization
  const query = sql`SELECT * FROM cases WHERE organization_id = ${context.organizationId}`;
}
```

## Important Rules

### ✅ DO:
- Use `withOrgFilter()` for SELECT queries - it handles super admins automatically
- Use `validateOrgAccess()` for access checks - it handles super admins automatically
- Check `organizationId === "*"` to detect super admin context
- Include `organizationId` in SELECT results for transparency

### ❌ DON'T:
- Don't use `"*"` for INSERT/UPDATE/DELETE operations
- Don't hardcode super admin checks - use helper functions
- Don't forget to include organization context in responses

## Common Patterns

### Pattern 1: Simple Query with Org Filter

```typescript
const context = await getUserTenantContext(session.user.id);

const results = await db
  .select()
  .from(table)
  .where(withOrgFilter(context.organizationId, table));
// Super admins get ALL records, regular users get filtered records
```

### Pattern 2: Query with Additional Conditions

```typescript
const context = await getUserTenantContext(session.user.id);

const results = await db
  .select()
  .from(cases)
  .where(withOrgFilter(context.organizationId, cases, [
    eq(cases.status, 'active'),
    gte(cases.createdAt, startDate)
  ]));
// Combines org filter with other conditions
```

### Pattern 3: Custom SQL with Super Admin Check

```typescript
const context = await getUserTenantContext(session.user.id);
const isSuperAdmin = context.organizationId === "*";

const results = await db
  .select()
  .from(table)
  .where(
    isSuperAdmin
      ? sql`status = 'active'`  // No org filter
      : sql`organization_id = ${context.organizationId} AND status = 'active'`
  );
```

### Pattern 4: Validation Before Operation

```typescript
const context = await getUserTenantContext(session.user.id);
const record = await getRecordById(id);

// Throws error for regular users if wrong org
// Passes for super admins regardless of org
validateOrgAccess(context.organizationId, record, 'Record');

// Proceed with operation
await updateRecord(record);
```

## Helper Functions Reference

| Function | Purpose | Returns |
|----------|---------|---------|
| `isCurrentUserSuperAdmin()` | Check current session | `Promise<boolean>` |
| `isUserSuperAdmin(userId)` | Check specific user | `Promise<boolean>` |
| `isSuperAdminContext(orgId)` | Check if org ID is "*" | `boolean` |
| `requireSuperAdmin()` | Throw if not super admin | `Promise<void>` |
| `shouldBypassOrgCheck(orgId, isSA)` | Should bypass check? | `boolean` |

Import from: `@/lib/utils/super-admin-helpers`

## Authorization Service

All permission checks automatically return `true` for super admins:

```typescript
import { hasPermission } from "@/lib/services/authorization.service";

// Always returns true for super admins
const canEdit = await hasPermission(userId, orgId, 'cases.edit', isSuperAdmin);
```

## Debugging Tips

### Check Context in Console

```typescript
const context = await getUserTenantContext(userId);
console.log('Context:', context);
// Super admin: { organizationId: "*", userId: "...", isSuperAdmin: true }
// Regular user: { organizationId: "org-123", userId: "...", isSuperAdmin: false }
```

### Verify Query Filter

```typescript
const filter = withOrgFilter(context.organizationId, table);
console.log('Filter:', filter);
// Super admin: undefined or just additional conditions
// Regular user: full org filter condition
```

## Testing

### Test as Super Admin
1. Login as super admin
2. Check organization switcher shows "All Organizations (Super Admin)"
3. Navigate to any page
4. Verify you see data from multiple organizations
5. Search globally and see cross-org results

### Test as Regular User
1. Login as regular user
2. Check organization switcher shows only your orgs
3. Navigate to same pages
4. Verify you only see your organization's data
5. Search and see only your org's results

## Full Documentation

See `/docs/super-admin-access.md` for complete details.

## Summary

🎯 **Key Concept**: `organizationId: "*"` = omnipotent access

🔧 **Key Functions**: 
- `withOrgFilter()` - Auto-bypasses for "*"
- `validateOrgAccess()` - Auto-passes for "*"
- `isSuperAdminContext()` - Checks for "*"

🚀 **Result**: Super admins can access everything, everywhere, all at once!
