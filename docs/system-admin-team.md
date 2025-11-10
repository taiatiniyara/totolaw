# System Admin Team Setup

This document describes how to set up and manage a team of super administrators who can configure the entire Totolaw platform using their own credentials.

## Overview

The **System Admin Team** feature allows authorized individuals to have platform-wide access for:
- Setting up organizations (countries, regions, courts)
- Creating and managing roles and permissions
- Configuring system-wide settings
- Managing other system administrators
- Viewing comprehensive audit logs

Unlike organization-specific administrators, system admins have **cross-organizational privileges** and can set up the entire multi-tenant infrastructure.

## Architecture

### Components

1. **System Admin Schema** (`lib/drizzle/schema/system-admin-schema.ts`)
   - `system_admins` table: Stores authorized admin emails
   - `system_admin_audit_log` table: Tracks all system-level actions

2. **System Admin Service** (`lib/services/system-admin.service.ts`)
   - Authorization checks
   - Admin management (add, remove, reactivate)
   - Auto-linking on login
   - Audit logging

3. **Super Admin Middleware** (`lib/middleware/super-admin.middleware.ts`)
   - Automatic elevation on login
   - Session management
   - Access control helpers

4. **Super Admin Dashboard** (`app/dashboard/system-admin/`)
   - System overview
   - Admin management
   - Organization management
   - Audit log viewer

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  1. Admin email added to system_admins table                │
│     (via migration or existing super admin)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Admin logs in with their email (magic link)             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Middleware checks if email is authorized                │
│     - Queries system_admins table                           │
│     - If found and active, proceeds to elevation            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. User account elevated to super admin                    │
│     - Links system_admin record to user account             │
│     - Sets user.isSuperAdmin = true                         │
│     - Updates lastLogin timestamp                           │
│     - Logs action to audit trail                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Admin gains full platform access                        │
│     - Bypasses organization restrictions                    │
│     - Access to /dashboard/system-admin                     │
│     - Can manage all organizations, roles, permissions      │
└─────────────────────────────────────────────────────────────┘
```

## Initial Setup

### Step 1: Run Database Migrations

First, ensure all migrations are applied to create the necessary tables:

```bash
# Generate migration (if schema changes were made)
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### Step 2: Add Initial System Admins

Edit the migration file `migrations/003_setup_system_admins.sql` and replace the placeholder emails with your actual super admin team:

```sql
INSERT INTO system_admins (id, email, name, is_active, added_at, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'chief-justice@courts.gov.fj', 'Chief Justice', true, NOW(), NOW(), NOW()),
  (gen_random_uuid()::text, 'senior-administrator@courts.gov.fj', 'Senior Admin', true, NOW(), NOW(), NOW()),
  (gen_random_uuid()::text, 'tech-lead@totolaw.org', 'Technical Lead', true, NOW(), NOW(), NOW());
```

### Step 3: Run the Setup Migration

```bash
# Apply the system admin setup migration
psql $DATABASE_URL -f migrations/003_setup_system_admins.sql
```

### Step 4: Share Login Link

Send your team members the login link:
```
https://your-domain.com/auth/login
```

They should use the **magic link** authentication with their registered email addresses.

### Step 5: Verify Setup

After team members log in, verify they have super admin access:

```sql
-- Check linked system admins
SELECT 
  sa.email,
  sa.name,
  sa.is_active,
  sa.last_login,
  u.is_super_admin,
  u.name as user_name
FROM system_admins sa
LEFT JOIN "user" u ON sa.user_id = u.id
ORDER BY sa.added_at;
```

## Managing System Admins

### Via UI (Recommended)

1. Log in as an existing super admin
2. Navigate to **Dashboard → System Admin → Administrators**
3. Use the interface to:
   - Add new admins
   - Deactivate admins
   - Reactivate admins
   - View login history

### Via Database Functions

The migration includes helper functions for admin management:

#### Add a New Admin

```sql
SELECT add_system_admin(
  'new-admin@example.com',
  'Admin Name',
  'Notes about this admin'
);
```

#### Remove/Deactivate an Admin

```sql
SELECT remove_system_admin('admin@example.com');
```

This will:
- Deactivate the system admin record
- Remove super admin flag from linked user
- Log the action to audit trail

#### Reactivate an Admin

```sql
SELECT reactivate_system_admin('admin@example.com');
```

#### List All Active Admins

```sql
SELECT * FROM list_system_admins();
```

### Via API/Service

You can also manage admins programmatically:

```typescript
import {
  addSystemAdmin,
  removeSystemAdmin,
  reactivateSystemAdmin,
  listSystemAdmins,
} from '@/lib/services/system-admin.service';

// Add new admin
const adminId = await addSystemAdmin(
  'new-admin@example.com',
  'Admin Name',
  addedByUserId,
  'Optional notes'
);

// Remove admin
await removeSystemAdmin(adminId, removedByUserId);

// Reactivate admin
await reactivateSystemAdmin(adminId, reactivatedByUserId);

// List all admins
const admins = await listSystemAdmins(includeInactive);
```

## Super Admin Capabilities

### What Super Admins Can Do

1. **Organization Management**
   - Create new organizations (countries, regions, courts)
   - Activate/deactivate organizations
   - Manage organizational hierarchies

2. **Role & Permission Management**
   - View all roles across all organizations
   - View all system permissions
   - Access RBAC configuration

3. **System Administration**
   - Add/remove other system admins
   - View system-wide statistics
   - Access comprehensive audit logs

4. **Bypass Restrictions**
   - Access data across all organizations
   - No organization membership required
   - Override permission checks

### What Super Admins Cannot Do

- Cannot be deleted (only deactivated)
- Actions are fully audited
- Cannot bypass audit logging

## Security Considerations

### Email-Based Authorization

- System admin status is tied to **email address**
- Email must exactly match registered address
- Email is case-insensitive
- No wildcards or domain-based authorization

### Authentication Flow

1. User logs in with magic link (email-based)
2. System checks if email is in `system_admins` table
3. If found and active, user is elevated
4. If not found, regular user flow continues

### Removing Admin Access

When a system admin is deactivated:
- Their `is_active` flag is set to `false`
- Their linked user's `is_super_admin` flag is removed
- They lose platform-wide access immediately
- Their user account remains (as regular user)

### Audit Trail

All system admin actions are logged:
- Who performed the action
- What was changed
- When it happened
- IP address and user agent
- Before/after values (when applicable)

Access audit logs:
```typescript
import { getSystemAdminAuditLog } from '@/lib/services/system-admin.service';

const logs = await getSystemAdminAuditLog(limit, offset, adminId);
```

## Best Practices

### 1. Principle of Least Privilege

- Only grant system admin access to trusted individuals
- Use organization-specific admins for day-to-day operations
- Reserve super admin for setup and configuration

### 2. Regular Audits

- Review active system admins monthly
- Check audit logs for unusual activity
- Remove admins who no longer need access

### 3. Documented Admins

- Use the `notes` field to document why each admin was added
- Include their role or department
- Document the date they should be reviewed

Example:
```sql
SELECT add_system_admin(
  'admin@example.com',
  'John Doe',
  'Added for initial system setup - Review 2025-12-31'
);
```

### 4. Onboarding Process

For new system admins:
1. Add their email to `system_admins` table
2. Send them the login link
3. Verify they can access the super admin dashboard
4. Brief them on their responsibilities
5. Share this documentation

### 5. Offboarding Process

When removing system admins:
1. Deactivate via UI or database function
2. Verify their super admin flag is removed
3. Document the reason in audit log
4. Notify team of the change

## Troubleshooting

### Admin Cannot Access Super Admin Dashboard

**Symptoms:** User logs in but doesn't see super admin menu/access

**Checks:**
1. Verify email is in `system_admins` table:
   ```sql
   SELECT * FROM system_admins WHERE email = 'admin@example.com';
   ```

2. Check if admin is active:
   ```sql
   SELECT is_active FROM system_admins WHERE email = 'admin@example.com';
   ```

3. Verify user's super admin flag:
   ```sql
   SELECT is_super_admin FROM "user" WHERE email = 'admin@example.com';
   ```

4. Check linking:
   ```sql
   SELECT sa.email, sa.user_id, u.id, u.is_super_admin
   FROM system_admins sa
   LEFT JOIN "user" u ON sa.user_id = u.id
   WHERE sa.email = 'admin@example.com';
   ```

**Solutions:**
- If not in table: Add them using `add_system_admin()`
- If inactive: Reactivate using `reactivate_system_admin()`
- If not linked: Have them log out and log back in
- If flag not set: Manually update or use reactivate function

### Admin Added But Not Elevated on Login

**Possible causes:**
1. Email mismatch (check for typos, spaces, case)
2. Middleware not running
3. Database connection issues

**Fix:**
```sql
-- Verify exact email match
SELECT email FROM system_admins WHERE LOWER(email) = LOWER('provided-email');

-- Manually link if needed
UPDATE system_admins 
SET user_id = 'user-id-here', last_login = NOW() 
WHERE email = 'admin@example.com';

UPDATE "user" 
SET is_super_admin = true 
WHERE id = 'user-id-here';
```

### Multiple Super Admins With Same Email

**Prevention:** Email column has UNIQUE constraint

**If it happens:**
```sql
-- Find duplicates
SELECT email, COUNT(*) 
FROM system_admins 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Remove duplicates (keep most recent)
DELETE FROM system_admins 
WHERE id NOT IN (
  SELECT MAX(id) FROM system_admins GROUP BY email
);
```

## Environment-Specific Setup

### Development

```bash
# Add test admins
psql $DATABASE_URL -c "
SELECT add_system_admin('dev@localhost', 'Dev Admin', 'Development only');
"
```

### Staging

Use real emails but mark them:
```sql
SELECT add_system_admin(
  'staging-admin@example.com',
  'Staging Admin',
  'STAGING ENVIRONMENT - For testing only'
);
```

### Production

1. Use official email addresses
2. Document each admin thoroughly
3. Implement regular review process
4. Set up alerts for admin actions

## Advanced: Programmatic Admin Elevation

For automated setups or scripts:

```typescript
import { checkAndElevateSuperAdmin } from '@/lib/services/system-admin.service';

// During authentication flow
const wasElevated = await checkAndElevateSuperAdmin(email, userId);

if (wasElevated) {
  console.log('User elevated to super admin');
}
```

## Migration from Existing Setup

If you already have users who should be super admins:

```sql
-- Find existing super admin users
SELECT id, email, name, is_super_admin FROM "user" WHERE is_super_admin = true;

-- Add them to system_admins table
INSERT INTO system_admins (id, email, name, user_id, is_active, added_at, created_at, updated_at)
SELECT 
  gen_random_uuid()::text,
  email,
  name,
  id,
  true,
  NOW(),
  NOW(),
  NOW()
FROM "user" 
WHERE is_super_admin = true
ON CONFLICT (email) DO NOTHING;
```

## Monitoring & Alerts

### Key Metrics to Track

1. **Active System Admins Count**
   ```sql
   SELECT COUNT(*) FROM system_admins WHERE is_active = true;
   ```

2. **Recent Admin Actions**
   ```sql
   SELECT * FROM system_admin_audit_log 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

3. **Admins Not Yet Linked**
   ```sql
   SELECT email, name, added_at 
   FROM system_admins 
   WHERE user_id IS NULL AND is_active = true;
   ```

4. **Last Login Times**
   ```sql
   SELECT email, name, last_login 
   FROM system_admins 
   WHERE is_active = true 
   ORDER BY last_login DESC NULLS LAST;
   ```

### Recommended Alerts

- Alert when new system admin is added
- Alert when admin is deactivated
- Alert when admin hasn't logged in for 90+ days
- Alert on failed super admin access attempts

## API Reference

See the full service API in `lib/services/system-admin.service.ts`:

- `isAuthorizedSystemAdmin(email)` - Check if email is authorized
- `getSystemAdminByEmail(email)` - Get admin record by email
- `getSystemAdminByUserId(userId)` - Get admin record by user ID
- `linkSystemAdminToUser(email, userId)` - Link admin to user account
- `addSystemAdmin(email, name, addedBy, notes)` - Add new admin
- `removeSystemAdmin(adminId, removedBy)` - Deactivate admin
- `reactivateSystemAdmin(adminId, reactivatedBy)` - Reactivate admin
- `listSystemAdmins(includeInactive)` - List all admins
- `getSystemAdminAuditLog(limit, offset, adminId)` - Get audit logs
- `logSystemAdminAction(...)` - Log admin action
- `checkAndElevateSuperAdmin(email, userId)` - Auto-elevation check

## FAQ

**Q: Can I use Gmail or personal emails for system admins?**  
A: Yes, but official organizational emails are recommended for accountability.

**Q: How many system admins should I have?**  
A: Start with 2-3 for redundancy. Avoid having too many.

**Q: Can system admins see all case data?**  
A: Yes, super admins bypass organization restrictions.

**Q: What happens if all system admins are deactivated?**  
A: You'll need database access to reactivate one. Keep at least 2 active.

**Q: Can I automate system admin management via API?**  
A: Yes, but it requires super admin authentication. See service functions.

**Q: How do I revoke access immediately?**  
A: Deactivate via UI or run `SELECT remove_system_admin('email')`.

**Q: Is system admin the same as organization admin?**  
A: No. System admins have platform-wide access. Organization admins are limited to their organization.

---

**Built for secure, multi-tenant Pacific Island court systems** 🌴
