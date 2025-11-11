# Quick Start: Simplified Super Admin System

## What Changed?

The `system_admins` table has been removed. Super admin privileges are now managed directly in the `user` table using the `is_super_admin` field.

## Quick Commands

```bash
# List all super admins
npm run admin:list

# Grant super admin to user (creates if doesn't exist)
npm run admin:add admin@example.com "Admin Name"

# Revoke super admin from user
npm run admin:remove admin@example.com

# View audit log
npm run admin:audit
```

## Migration Steps

### 1. Backup (Important!)
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 2. Apply Migration
```bash
# Option A: Using npm script (if configured)
npm run db:migrate

# Option B: Direct SQL
psql $DATABASE_URL < migrations/002_simplify_system_admin.sql
```

### 3. Verify
```bash
# Check table is gone (should error)
psql $DATABASE_URL -c "SELECT * FROM system_admins;"

# List super admins
npm run admin:list
```

## Code Examples

### Grant Super Admin
```typescript
import { grantSuperAdmin, grantSuperAdminByEmail } from '@/lib/services/system-admin.service';

// To existing user
await grantSuperAdmin(userId, grantedBy, "notes");

// By email (creates user if needed)
await grantSuperAdminByEmail("admin@example.com", "Name", grantedBy, "notes");
```

### Revoke Super Admin
```typescript
import { revokeSuperAdmin } from '@/lib/services/system-admin.service';

await revokeSuperAdmin(userId, revokedBy, "reason");
```

### Check Super Admin
```typescript
import { isSuperAdmin, isSuperAdminByEmail } from '@/lib/services/system-admin.service';

const isAdmin = await isSuperAdmin(userId);
const isAdmin = await isSuperAdminByEmail("admin@example.com");
```

### List Super Admins
```typescript
import { listSuperAdmins } from '@/lib/services/system-admin.service';

const admins = await listSuperAdmins();
```

## SQL Helper Functions

```sql
-- Grant super admin
SELECT grant_super_admin('user-id', 'granted-by-id', 'notes');

-- Revoke super admin
SELECT revoke_super_admin('user-id', 'revoked-by-id', 'reason');

-- List super admins
SELECT * FROM list_super_admins();
```

## Troubleshooting

### Problem: Migration fails

**Solution:** Check database connection and permissions
```bash
psql $DATABASE_URL -c "SELECT version();"
```

### Problem: Can't find super admins after migration

**Solution:** Check user table
```sql
SELECT id, email, name, is_super_admin FROM "user" WHERE is_super_admin = true;
```

### Problem: Old code references system_admins

**Solution:** Update imports
```typescript
// OLD - Don't use
import { systemAdmins } from '@/lib/drizzle/schema/system-admin-schema';

// NEW - Use this
import { user } from '@/lib/drizzle/schema/auth-schema';
// Check user.isSuperAdmin field
```

## Key Files

- **Migration:** `/migrations/002_simplify_system_admin.sql`
- **Service:** `/lib/services/system-admin.service.ts`
- **Schema:** `/lib/drizzle/schema/auth-schema.ts`
- **Middleware:** `/lib/middleware/super-admin.middleware.ts`
- **CLI Tool:** `/scripts/manage-admins.ts`
- **Docs:** `/docs/simplified-admin-architecture.md`
- **Summary:** `/IMPLEMENTATION_SUMMARY.md`

## Benefits

✅ **Simpler** - One table, one source of truth  
✅ **Faster** - Fewer queries, no JOINs  
✅ **Clearer** - Direct grant/revoke model  
✅ **Safer** - All data preserved during migration  
✅ **Better UX** - Instant access, no delays  

## Full Documentation

For detailed information, see:
- `/docs/simplified-admin-architecture.md` - Complete guide
- `/IMPLEMENTATION_SUMMARY.md` - Implementation details

---

**Questions?** Run `npm run admin:help`
