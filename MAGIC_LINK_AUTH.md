# Magic Link Authentication & System Admin Integration - Complete

## Overview

The Totolaw application now uses **exclusively magic link authentication** with integrated system admin auto-elevation. When authorized users log in, they are automatically granted super admin privileges.

## Authentication Flow

```
1. User visits /auth/login
   ↓
2. User enters email address
   ↓
3. System sends magic link to email
   ↓
4. User clicks link in email
   ↓
5. Better Auth verifies token and creates session
   ↓
6. System checks if email is in system_admins table
   ↓
7. If authorized:
   - Links system_admin record to user account
   - Sets user.isSuperAdmin = true
   - Updates lastLogin timestamp
   - Logs action to audit trail
   ↓
8. User redirected to dashboard
   ↓
9. Dashboard shows Super Admin nav link if user.isSuperAdmin = true
```

## Key Features

### ✅ Magic Link Only
- No password authentication
- No OAuth providers
- Secure, time-limited one-time links
- Email-based verification

### ✅ Automatic Super Admin Elevation
- Checks system_admins table on login
- Elevates automatically if email matches
- No manual flag setting required
- Immediate access grant

### ✅ Seamless Integration
- Works with existing RBAC system
- Super admins bypass organization restrictions
- Super admins see additional nav menu item
- Full audit trail maintained

## Components Modified

### 1. Authentication Route (`app/api/auth/[...all]/route.ts`)
```typescript
// Wraps Better Auth handler
// After magic link verification, checks and elevates super admins
export async function GET(request: NextRequest) {
  const response = await originalGET(request);
  
  if (url.pathname.includes("/magic-link/verify")) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (session?.user?.email && session?.user?.id) {
      await checkAndElevateSuperAdmin(session.user.email, session.user.id);
    }
  }
  
  return response;
}
```

### 2. Dashboard Layout (`app/dashboard/layout.tsx`)
```typescript
// Checks user.isSuperAdmin flag
// Shows Super Admin nav link if true
const userData = await db.select().from(user).where(eq(user.id, session.user.id));
isSuperAdmin = userData[0]?.isSuperAdmin || false;

{isSuperAdmin && (
  <NavLink href="/dashboard/system-admin" icon={Shield}>
    Super Admin
  </NavLink>
)}
```

### 3. Login Page (`app/auth/login/page.tsx`)
```typescript
// Simplified to magic link only
// Clear messaging about no passwords
Enter your email to receive a secure magic login link
No passwords required - we'll send you a one-time login link
```

### 4. User Status Page (`app/dashboard/user-status/page.tsx`)
- Shows current authentication status
- Displays super admin flag value
- Shows system admin record if exists
- Lists available permissions
- Provides troubleshooting info

## Testing the Integration

### 1. Test Regular User Login
```bash
# User NOT in system_admins table
1. Go to /auth/login
2. Enter email: user@example.com
3. Click magic link
4. Check /dashboard/user-status
   - isSuperAdmin should be FALSE
   - No system admin record
   - No Super Admin nav link
```

### 2. Test System Admin Login
```bash
# User IN system_admins table
1. Add admin: npm run admin:add admin@example.com "Admin Name"
2. Go to /auth/login
3. Enter email: admin@example.com
4. Click magic link
5. Check /dashboard/user-status
   - isSuperAdmin should be TRUE
   - System admin record exists and linked
   - Super Admin nav link visible
6. Navigate to /dashboard/system-admin
   - Should have full access
```

### 3. Verify Auto-Elevation
```bash
# Test the automatic elevation
1. Add new admin via CLI
2. Log in with that email
3. Should be automatically elevated
4. Check audit log: npm run admin:audit
   - Should show login and elevation action
```

## Database Schema

### User Table (Existing)
```sql
user {
  id: text
  email: text
  name: text
  is_super_admin: boolean  -- Auto-set by system admin service
  ...
}
```

### System Admins Table
```sql
system_admins {
  id: text
  email: text
  name: text
  user_id: text          -- Linked on first login
  is_active: boolean
  last_login: timestamp  -- Updated on each login
  ...
}
```

## Security Features

### 1. Email-Based Authorization
- Only exact email matches are authorized
- Case-insensitive matching
- No wildcards or domain-based auth

### 2. Time-Limited Tokens
- Magic links expire after short period
- Rate limited (5 requests per 15 minutes)
- One-time use only

### 3. Audit Trail
- All elevations logged
- All system admin actions logged
- IP address and user agent captured

### 4. Revocation
- Deactivating admin removes super admin flag immediately
- User loses access on next page load
- Cannot be bypassed

## Super Admin Capabilities

When `user.isSuperAdmin = true`:

### ✅ Platform-Wide Access
- View and manage all organizations
- No organization membership required
- Bypass tenant restrictions

### ✅ User Management
- Add/remove system admins
- Manage organization members
- Assign roles across organizations

### ✅ System Configuration
- Create organizations
- View all roles and permissions
- Access system settings

### ✅ Audit & Monitoring
- View comprehensive audit logs
- Track all system admin actions
- Monitor user activity

## Usage Examples

### Check Current Status
```typescript
// In any server component
import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/connection";
import { user } from "@/lib/drizzle/schema/auth-schema";
import { eq } from "drizzle-orm";

const session = await auth.api.getSession({ headers: await headers() });
const userData = await db.select().from(user).where(eq(user.id, session.user.id));
const isSuperAdmin = userData[0]?.isSuperAdmin || false;

if (isSuperAdmin) {
  // Show super admin features
}
```

### Protect Super Admin Routes
```typescript
// In super admin pages
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";

export default async function SuperAdminPage() {
  await requireSuperAdmin(); // Throws error if not super admin
  
  return <div>Super Admin Content</div>;
}
```

### Check Without Throwing
```typescript
import { isSuperAdmin } from "@/lib/middleware/super-admin.middleware";

const isAdmin = await isSuperAdmin();
if (!isAdmin) {
  redirect("/dashboard/access-denied");
}
```

## Troubleshooting

### User Not Elevated After Login

**Check:**
1. Verify email in system_admins:
   ```bash
   npm run admin:list
   ```

2. Check is_active flag:
   ```sql
   SELECT * FROM system_admins WHERE email = 'user@example.com';
   ```

3. Verify user flag:
   ```sql
   SELECT email, is_super_admin FROM "user" WHERE email = 'user@example.com';
   ```

**Solution:**
- Log out and log back in
- Check /dashboard/user-status
- Verify magic link clicked (not expired)

### Super Admin Nav Not Showing

**Check:**
1. User flag is true:
   ```sql
   SELECT is_super_admin FROM "user" WHERE id = 'user-id';
   ```

2. Session is fresh:
   - Log out and back in
   - Clear browser cookies

3. Layout is loading flag:
   - Check dashboard layout code
   - Verify database query runs

### Magic Link Not Working

**Check:**
1. Email service configured:
   ```bash
   # Check .env
   grep SMTP .env
   ```

2. Better Auth configured:
   ```bash
   # Check .env
   grep BETTER_AUTH .env
   ```

3. Token not expired:
   - Magic links expire quickly
   - Request new link if needed

## Management Commands

```bash
# List all system admins
npm run admin:list

# Add new system admin
npm run admin:add email@example.com "Admin Name"

# Deactivate system admin
npm run admin:remove email@example.com

# Reactivate system admin
npm run admin:activate email@example.com

# View audit log
npm run admin:audit

# Verify setup
./scripts/verify-setup.sh
```

## API Endpoints

### Authentication
- `POST /api/auth/magic-link` - Send magic link email
- `GET /api/auth/magic-link/verify` - Verify token and create session
- `POST /api/auth/logout` - End session

### Session
- `GET /api/auth/session` - Get current session
- Session includes user data with `isSuperAdmin` flag

## Configuration

### Environment Variables Required
```bash
# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=your-secret-key

# Email (for magic links)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@yourdomain.com
```

### Better Auth Config (`lib/auth.ts`)
```typescript
export const auth = betterAuth({
  secret: authSecret,
  url: authUrl,
  database: drizzleAdapter(db, {...}),
  session: {
    updateAge: 24 * 60 * 60,  // 24 hours
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
  },
  plugins: [
    magicLink({...}),
    nextCookies(),
  ],
});
```

## Best Practices

### 1. Regular Users
- Log in with magic link
- Check /dashboard/user-status if unsure of permissions
- Contact system admin for access issues

### 2. System Admins
- Keep email address secure
- Log out when finished
- Review audit logs regularly
- Document actions taken

### 3. Super Admin Team
- Maintain 2-3 active admins minimum
- Review admin list monthly
- Deactivate former team members promptly
- Use notes field to document admins

## Migration Path

If you have existing users who should be system admins:

```sql
-- Add them to system_admins table
INSERT INTO system_admins (id, email, name, user_id, is_active)
SELECT 
  gen_random_uuid()::text,
  email,
  name,
  id,
  true
FROM "user"
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com'
);

-- Set their super admin flag
UPDATE "user"
SET is_super_admin = true
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com'
);
```

## Documentation Links

- [System Admin Team Guide](./system-admin-team.md)
- [Super Admin Quick Start](./super-admin-quickstart.md)
- [Multi-Tenant RBAC](./multi-tenant-rbac.md)
- [Authentication Guide](./authentication.md)

---

**Built for secure, passwordless Pacific Island court systems** 🌴

*Last Updated: November 10, 2025*
