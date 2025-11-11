# Simplified System Admin Architecture

## Overview

The system admin architecture has been **significantly simplified** to improve maintainability and user journeys. The separate `system_admins` table has been removed, and all super admin functionality is now managed directly through the `user` table.

## What Changed

### Before (Complex Architecture)
- ❌ Separate `system_admins` table
- ❌ Complex sync between `system_admins` and `user` tables
- ❌ Two sources of truth for super admin status
- ❌ Auto-elevation logic on login
- ❌ Email-based pre-authorization system

### After (Simplified Architecture)
- ✅ Single `user` table with `is_super_admin` boolean
- ✅ Direct grant/revoke of super admin privileges
- ✅ Simple, clear permission model
- ✅ Reduced code complexity
- ✅ Easier to understand and maintain

## New Schema Structure

### User Table (Enhanced)
```sql
CREATE TABLE "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT false NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Multi-tenant RBAC
  current_organization_id TEXT,
  is_super_admin BOOLEAN DEFAULT false NOT NULL,
  
  -- Super admin metadata
  admin_notes TEXT,
  admin_added_by TEXT REFERENCES "user"(id),
  admin_added_at TIMESTAMP,
  last_login TIMESTAMP
);
```

### System Admin Audit Log (Updated)
```sql
CREATE TABLE system_admin_audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,  -- Changed from admin_id
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id TEXT,
  description TEXT NOT NULL,
  metadata TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## How It Works Now

### 1. Granting Super Admin Privileges

**Via CLI:**
```bash
npm run admin:add admin@example.com "Admin Name" "Optional notes"
```

**Via Service:**
```typescript
import { grantSuperAdmin, grantSuperAdminByEmail } from '@/lib/services/system-admin.service';

// Grant to existing user
await grantSuperAdmin(userId, grantedBy, "notes");

// Grant by email (creates user if doesn't exist)
await grantSuperAdminByEmail("admin@example.com", "Name", grantedBy, "notes");
```

### 2. Revoking Super Admin Privileges

**Via CLI:**
```bash
npm run admin:remove admin@example.com "Optional reason"
```

**Via Service:**
```typescript
import { revokeSuperAdmin } from '@/lib/services/system-admin.service';

await revokeSuperAdmin(userId, revokedBy, "reason");
```

### 3. Checking Super Admin Status

```typescript
import { isSuperAdmin, isSuperAdminByEmail } from '@/lib/services/system-admin.service';

// Check by user ID
const isAdmin = await isSuperAdmin(userId);

// Check by email
const isAdmin = await isSuperAdminByEmail("admin@example.com");
```

### 4. Listing Super Admins

```typescript
import { listSuperAdmins } from '@/lib/services/system-admin.service';

const admins = await listSuperAdmins();
// Returns: SuperAdminUser[]
```

## Migration Guide

### Running the Migration

1. **Backup your database** (important!)
```bash
pg_dump $DATABASE_URL > backup.sql
```

2. **Run the migration**
```bash
npm run db:migrate
# or apply manually:
psql $DATABASE_URL < migrations/002_simplify_system_admin.sql
```

3. **Verify migration**
```bash
npm run admin:list
```

### What the Migration Does

1. ✅ Migrates `system_admins` data to `user` table
2. ✅ Adds new columns to `user` table (`admin_notes`, `admin_added_by`, `admin_added_at`, `last_login`)
3. ✅ Updates `system_admin_audit_log` to reference `user.id` instead of `system_admins.id`
4. ✅ Drops the `system_admins` table
5. ✅ Creates helper SQL functions: `grant_super_admin()`, `revoke_super_admin()`, `list_super_admins()`

### After Migration

All existing system admins will:
- Have `is_super_admin = true` in the user table
- Retain their audit log history
- Keep their admin notes and metadata
- Continue to have full access

## Simplified API

### Core Functions

```typescript
// Check super admin status
isSuperAdmin(userId: string): Promise<boolean>
isSuperAdminByEmail(email: string): Promise<boolean>

// Get super admin details
getSuperAdminById(userId: string): Promise<SuperAdminUser | null>
getSuperAdminByEmail(email: string): Promise<SuperAdminUser | null>

// Manage super admin privileges
grantSuperAdmin(userId: string, grantedBy: string, notes?: string): Promise<void>
revokeSuperAdmin(userId: string, revokedBy: string, reason?: string): Promise<void>
grantSuperAdminByEmail(email: string, name: string, grantedBy: string, notes?: string): Promise<string>

// List and audit
listSuperAdmins(): Promise<SuperAdminUser[]>
getSystemAdminAuditLog(limit?: number, offset?: number, userId?: string): Promise<SystemAdminAuditLog[]>
logSystemAdminAction(...): Promise<void>
updateSuperAdminLastLogin(userId: string): Promise<void>
```

### TypeScript Interface

```typescript
export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  adminNotes?: string | null;
  adminAddedBy?: string | null;
  adminAddedAt?: Date | null;
  lastLogin?: Date | null;
}
```

## User Journeys (Simplified)

### Journey 1: Adding a New Super Admin

**Old Way:**
1. Add email to `system_admins` table
2. Wait for user to sign up
3. Auto-elevation on login
4. Link `system_admins.user_id` to `user.id`
5. Set `user.is_super_admin = true`

**New Way:**
1. Run `npm run admin:add admin@example.com "Name"`
2. Done! User is created with super admin privileges
3. User logs in and immediately has access

### Journey 2: Revoking Super Admin Access

**Old Way:**
1. Set `system_admins.is_active = false`
2. Set `user.is_super_admin = false`
3. Keep both records in sync

**New Way:**
1. Run `npm run admin:remove admin@example.com`
2. Done! `user.is_super_admin` is set to `false`

### Journey 3: Checking if User is Super Admin

**Old Way:**
```typescript
// Check system_admins table
const admin = await getSystemAdminByEmail(email);
const isActive = admin && admin.isActive;

// Also check user table
const user = await getUserByEmail(email);
const isSuperAdmin = user && user.isSuperAdmin;

// Need both checks to be sure
const hasAccess = isActive && isSuperAdmin;
```

**New Way:**
```typescript
// Single source of truth
const isSuperAdmin = await isSuperAdminByEmail(email);
// Done!
```

## Benefits of Simplification

### 1. **Single Source of Truth**
- No more sync issues between tables
- One query to check super admin status
- Clearer code, fewer bugs

### 2. **Reduced Complexity**
- Removed ~200 lines of sync logic
- No auto-elevation middleware needed
- Simpler authentication flow

### 3. **Better Performance**
- Fewer database queries
- No JOIN operations needed
- Faster permission checks

### 4. **Easier to Maintain**
- Less code to understand
- Clear API surface
- Better developer experience

### 5. **Improved User Experience**
- Instant access after grant
- No waiting for "elevation"
- Clear admin management

## Updated CLI Commands

```bash
# List all super admins
npm run admin:list

# Grant super admin to user (creates if doesn't exist)
npm run admin:add admin@example.com "Admin Name" "Optional notes"

# Revoke super admin from user
npm run admin:remove admin@example.com "Optional reason"

# View audit log
npm run admin:audit

# Show help
npm run admin:help
```

## SQL Helper Functions

The migration creates convenient SQL functions:

```sql
-- Grant super admin privileges
SELECT grant_super_admin(
  'user-id-here',
  'granted-by-user-id',
  'optional notes'
);

-- Revoke super admin privileges
SELECT revoke_super_admin(
  'user-id-here',
  'revoked-by-user-id',
  'optional reason'
);

-- List all super admins
SELECT * FROM list_super_admins();
```

## Backward Compatibility

### Code That Needs Updating

If you have code that references the old `system_admins` table, update it:

**Before:**
```typescript
import { systemAdmins } from '@/lib/drizzle/schema/system-admin-schema';
```

**After:**
```typescript
import { user } from '@/lib/drizzle/schema/auth-schema';
// Use user.isSuperAdmin field
```

### Service Function Changes

**Removed Functions:**
- `isAuthorizedSystemAdmin()`
- `getSystemAdminByEmail()` (use `getSuperAdminByEmail()`)
- `getSystemAdminByUserId()` (use `getSuperAdminById()`)
- `linkSystemAdminToUser()`
- `addSystemAdmin()` (use `grantSuperAdminByEmail()`)
- `removeSystemAdmin()` (use `revokeSuperAdmin()`)
- `reactivateSystemAdmin()` (use `grantSuperAdmin()`)
- `checkAndElevateSuperAdmin()`

**New/Updated Functions:**
- `isSuperAdmin()` - Check by user ID
- `isSuperAdminByEmail()` - Check by email
- `getSuperAdminById()` - Get super admin details
- `getSuperAdminByEmail()` - Get super admin by email
- `grantSuperAdmin()` - Grant to existing user
- `revokeSuperAdmin()` - Revoke from user
- `grantSuperAdminByEmail()` - Grant or create user
- `listSuperAdmins()` - List all super admins

## Testing the Migration

### 1. Before Migration

```bash
# Count system admins
psql $DATABASE_URL -c "SELECT COUNT(*) FROM system_admins WHERE is_active = true;"
```

### 2. After Migration

```bash
# Count super admins
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"user\" WHERE is_super_admin = true;"

# Verify table is gone
psql $DATABASE_URL -c "SELECT * FROM system_admins;" # Should fail

# Test CLI
npm run admin:list
```

### 3. Verify Audit Log

```bash
npm run admin:audit
```

## Rollback Plan

If you need to rollback:

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

However, the migration is designed to be safe and preserve all data.

## Support

If you encounter issues:

1. Check migration output for errors
2. Verify all super admins are still present: `npm run admin:list`
3. Check audit log for any issues: `npm run admin:audit`
4. Review documentation: `docs/simplified-admin-architecture.md`

## Summary

The simplified architecture provides:
- ✅ **Clearer code** - Single source of truth
- ✅ **Better performance** - Fewer queries, no JOINs
- ✅ **Easier maintenance** - Less code to manage
- ✅ **Improved UX** - Instant access, no elevation delay
- ✅ **Same security** - All audit logging preserved
- ✅ **Same functionality** - All features retained

The migration is **safe**, **tested**, and **preserves all existing data**.

---

**Questions?** See the updated documentation in `docs/` or run `npm run admin:help`
