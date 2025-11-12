# Authentication & Authorization

## Overview

Totolaw implements a comprehensive security model with **passwordless authentication** via magic links and **granular role-based access control (RBAC)** with organisation-scoped permissions.

## Authentication

### Magic Link Authentication

Totolaw uses **Better Auth** with the magic link plugin for passwordless authentication. This provides a secure, user-friendly alternative to traditional passwords.

#### Benefits

- **Passwordless** - No passwords to remember or manage
- **Secure** - One-time-use tokens with expiration
- **Simple UX** - Single-click login from email
- **Email Verification** - Built-in email verification
- **Phishing Resistant** - Tokens expire and are single-use

#### How It Works

```
┌──────────────┐
│  1. User     │
│  enters      │──────┐
│  email       │      │
└──────────────┘      │
                      ▼
┌──────────────────────────────────┐
│  2. Server generates unique      │
│     magic link token             │
│     - Random secure token        │
│     - 15-minute expiration       │
│     - Stored in database         │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  3. Email sent with magic link   │
│     Link: /auth/magic-link?token=│
│     - Sends via configured SMTP  │
│     - Rate limited (5 per 15min) │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  4. User clicks link             │
│     - Opens in browser           │
│     - Token extracted from URL   │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  5. Server validates token       │
│     - Checks database            │
│     - Verifies not expired       │
│     - Verifies not already used  │
│     - Marks token as used        │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  6. Session created              │
│     - Session record in DB       │
│     - HTTP-only cookie set       │
│     - User redirected to app     │
└──────────────────────────────────┘
```

#### Configuration

**File:** `lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { sendEmail } from "@/lib/services/email.service";

export const auth = betterAuth({
  // Environment configuration
  secret: process.env.BETTER_AUTH_SECRET,  // Signing secret (required)
  url: process.env.BETTER_AUTH_URL,        // Base URL (e.g., http://localhost:3000)
  
  // Database configuration
  database: {
    // Drizzle ORM connection used automatically
  },
  
  // Session settings
  session: {
    updateAge: 24 * 60 * 60,        // 24 hours - refresh session every 24h
    expiresIn: 60 * 60 * 24 * 7,    // 7 days - session expires after 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,                // 5 minutes - cookie cache
    },
  },
  
  // Rate limiting
  rateLimit: {
    window: 15 * 60 * 1000,          // 15 minutes window
    max: 100,                         // 100 requests per window
    storage: "database",              // Store rate limits in DB
  },
  
  // Email settings
  emailAndPassword: {
    enabled: false,                   // Disable password authentication
  },
  
  // Plugins
  plugins: [
    magicLink({
      // Token expiration
      expiresIn: 15 * 60,             // 15 minutes
      
      // Send magic link email
      sendMagicLink: async ({ email, token, url }) => {
        await sendEmail({
          to: email,
          subject: "Your Login Link - Totolaw",
          html: `
            <h2>Login to Totolaw</h2>
            <p>You requested a magic login link.</p>
            <p>
              <a href="${url}" style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
              ">
                Click here to login
              </a>
            </p>
            <p>Or copy and paste this link:</p>
            <p style="color: #6b7280; font-size: 14px;">${url}</p>
            <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
              This link will expire in 15 minutes. If you didn't request this, please ignore this email.
            </p>
          `,
        });
      },
      
      // Rate limiting for magic links
      rateLimit: {
        window: 15 * 60 * 1000,       // 15 minutes
        max: 5,                        // 5 magic links per user per window
      },
    }),
  ],
  
  // Advanced options
  advanced: {
    cookiePrefix: "totolaw",          // Cookie name prefix
    generateId: () => crypto.randomUUID(), // ID generation function
  },
});
```

#### Environment Variables

**Required:**

```bash
# Better Auth configuration
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Email configuration (for magic links)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Totolaw <noreply@totolaw.com>"
```

### Session Management

#### Session Storage

Sessions are stored in the database with the following schema:

```sql
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Session Lifecycle

```
CREATE SESSION
    ↓
ACTIVE (7 days max)
    ↓
┌───────────────┐
│ Every 24h:    │
│ Update token  │
│ Refresh cookie│
└───────────────┘
    ↓
EXPIRED or LOGOUT
    ↓
DELETE SESSION
```

#### Session Validation

**Server-side (Server Actions/API Routes):**

```typescript
'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function protectedAction() {
  // Get session from request headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check authentication
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Access user data
  const userId = session.user.id;
  const userEmail = session.user.email;

  // Continue with authorized logic...
}
```

**Client-side (React Components):**

```typescript
'use client';

import { authClient } from "@/lib/auth-client";

export function ProtectedComponent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>Welcome, {session.user.email}!</p>
    </div>
  );
}
```

### Login Flow

#### 1. Login Page

**Location:** `app/auth/login/page.tsx`

```typescript
import { sendMagicLink } from '../actions';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Sign in to Totolaw</h1>
          <p className="text-muted-foreground">
            Enter your email to receive a magic link
          </p>
        </div>

        <form action={sendMagicLink} className="space-y-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="judge@court.gov.fj"
            required
            autoComplete="email"
          />

          <Button type="submit" className="w-full">
            Send Magic Link
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          We'll email you a magic link for a password-free sign in
        </p>
      </div>
    </div>
  );
}
```

#### 2. Send Magic Link Action

**Location:** `app/auth/actions.ts`

```typescript
'use server';

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function sendMagicLink(formData: FormData) {
  const email = formData.get("email") as string;
  
  await authClient.signIn.magicLink({
    email,
    callbackURL: "/dashboard",
  });
}
```

#### 3. Magic Link Verification
**Location:** `app/auth/magic-link/page.tsx`

Better Auth automatically validates the token and creates session.

#### 4. Redirect
User redirected to dashboard or intended page.

### Security Features

#### Rate Limiting
- **Global:** 100 requests per 15 minutes per IP
- **Magic Links:** 5 magic links per 15 minutes per email
- **Storage:** Database-backed (prevents distributed attack)

#### Token Security
- **Cryptographically Secure:** Uses secure random token generation
- **Time-Limited:** Tokens expire after configured duration
- **Single-Use:** Tokens invalidated after use

#### CSRF Protection
- Built-in CSRF token validation
- Double-submit cookie pattern
- SameSite cookie attribute

#### HTTPS Enforcement
- Required in production
- Secure cookie flags in production
- HSTS headers recommended

### Logout

```typescript
'use server';

export async function logout() {
  await authClient.signOut();
  redirect('/auth/login');
}
```

## Authorization

### Role-Based Access Control (RBAC)

Totolaw implements a sophisticated RBAC system with:
- **Organisation-scoped roles**
- **Granular permissions**
- **Permission inheritance**
- **Direct permission grants/denies**

### Architecture

```
User
  └─► UserRole (in Organisation)
        └─► Role
              └─► RolePermission
                    └─► Permission

User can also have:
  └─► UserPermission (direct grant/deny)
```

### Permission Model

#### Permission Format
Permissions follow the pattern: `resource:action`

**Examples:**
- `cases:create` - Create cases
- `cases:read` - View cases
- `cases:update` - Edit cases
- `cases:delete` - Delete cases
- `hearings:schedule` - Schedule hearings
- `users:manage` - Manage users
- `roles:assign` - Assign roles

#### Permission Evaluation Order

1. **Check if Super Admin** → Grant all permissions
2. **Check Direct Denies** → Explicit deny (highest priority)
3. **Check Direct Grants** → Explicit grant
4. **Check Role Permissions** → Permissions from assigned roles
5. **Default** → Deny (fail-safe)

```typescript
const hasPermission = async (userId, orgId, permission) => {
  // Super admins bypass all checks
  if (user.isSuperAdmin) return true;
  
  // Get direct permissions
  const directPerms = await getUserDirectPermissions(userId, orgId);
  
  // Explicit deny overrides everything
  if (directPerms.denies.includes(permission)) return false;
  
  // Explicit grant
  if (directPerms.grants.includes(permission)) return true;
  
  // Check role permissions
  const rolePerms = await getUserRolePermissions(userId, orgId);
  if (rolePerms.includes(permission)) return true;
  
  // Default deny
  return false;
};
```

### Super Admin Privileges

#### Super Admin Model
- **Field:** `user.isSuperAdmin` (boolean)
- **Scope:** Platform-wide, across all organisations
- **Access:** Omnipotent - full access without membership

#### Capabilities
- Access **all organisations** without membership
- **All permissions** automatically granted
- Bypass permission checks
- System-level administrative actions
- View and manage all data

#### Granting Super Admin

**Command Line:**
```bash
npm run setup-admin
```

**Programmatically:**
```typescript
import { grantSuperAdmin } from '@/lib/services/system-admin.service';

await grantSuperAdmin({
  email: 'admin@example.com',
  grantedBy: currentUserId,
  notes: 'Platform administrator',
});
```

#### Revoking Super Admin

```typescript
import { revokeSuperAdmin } from '@/lib/services/system-admin.service';

await revokeSuperAdmin(userId, revokedBy);
```

### Authorization Service

**File:** `lib/services/authorization.service.ts`

#### Get User Permissions

```typescript
import { getUserPermissions } from '@/lib/services/authorization.service';

const userPerms = await getUserPermissions(userId, organisationId, isSuperAdmin);

// Returns:
{
  userId: "...",
  organisationId: "...",
  roles: ["judge", "admin"],
  permissions: ["cases:read", "cases:create", ...],
  isSuperAdmin: false
}
```

#### Check Permission

```typescript
import { hasPermission } from '@/lib/services/authorization.service';

const canCreate = await hasPermission(
  userId, 
  organisationId, 
  'cases:create',
  isSuperAdmin
);

if (canCreate) {
  // Allow action
}
```

#### Check Multiple Permissions

```typescript
import { 
  hasAnyPermission, 
  hasAllPermissions 
} from '@/lib/services/authorization.service';

// User needs ANY of these permissions
const canAccess = await hasAnyPermission(
  userId,
  organisationId,
  ['cases:read', 'hearings:read']
);

// User needs ALL of these permissions
const canManage = await hasAllPermissions(
  userId,
  organisationId,
  ['users:read', 'users:manage', 'roles:assign']
);
```

#### Check Role

```typescript
import { hasRole, hasAnyRole } from '@/lib/services/authorization.service';

const isJudge = await hasRole(userId, organisationId, 'judge');

const isStaff = await hasAnyRole(
  userId, 
  organisationId, 
  ['clerk', 'administrator']
);
```

### Tenant Context Service

**File:** `lib/services/tenant.service.ts`

#### Get User's Organisation Context

```typescript
import { getUserTenantContext } from '@/lib/services/tenant.service';

const context = await getUserTenantContext(userId);

// Returns:
{
  organisationId: "org-uuid",
  userId: "user-uuid",
  isSuperAdmin: false
}
```

#### Verify Organisation Access

```typescript
import { verifyUserOrganisationAccess } from '@/lib/services/tenant.service';

const hasAccess = await verifyUserOrganisationAccess(userId, organisationId);

if (!hasAccess) {
  throw new Error("Access denied");
}
```

#### Get User's Organisations

```typescript
import { getUserOrganisations } from '@/lib/services/tenant.service';

const orgs = await getUserOrganisations(userId);

// Returns array of:
[
  {
    organisation: { id, name, code, ... },
    membership: { isPrimary, isActive, joinedAt, ... }
  }
]
```

#### Switch Organisation

```typescript
import { switchUserOrganisation } from '@/lib/services/tenant.service';

const success = await switchUserOrganisation(userId, newOrganisationId);
```

### UI Protection

#### Permission Gate Component

**File:** `components/auth/permission-gate.tsx`

```typescript
import { PermissionGate } from '@/components/auth/permission-gate';

<PermissionGate permission="cases:create">
  <CreateCaseButton />
</PermissionGate>
```

**With fallback:**
```typescript
<PermissionGate 
  permission="cases:create"
  fallback={<p>You don't have permission to create cases.</p>}
>
  <CreateCaseForm />
</PermissionGate>
```

#### Role Gate Component

**File:** `components/auth/role-gate.tsx`

```typescript
import { RoleGate } from '@/components/auth/role-gate';

<RoleGate roles={['judge', 'magistrate']}>
  <JudgePanel />
</RoleGate>
```

#### Protected Route Component

**File:** `components/auth/protected-route.tsx`

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route';

<ProtectedRoute 
  requireAuth={true}
  requiredPermissions={['cases:read']}
>
  <CaseDetails caseId={id} />
</ProtectedRoute>
```

### Middleware Protection

#### Super Admin Middleware

**File:** `lib/middleware/super-admin.middleware.ts`

```typescript
import { requireSuperAdmin } from '@/lib/middleware/super-admin.middleware';

export async function serverAction() {
  const admin = await requireSuperAdmin();
  // Only super admins reach here
}
```

**Check super admin status:**
```typescript
import { isSuperAdmin } from '@/lib/middleware/super-admin.middleware';

const isAdmin = await isSuperAdmin();
```

### Role Assignment

#### Assign Role to User

```typescript
import { assignRole } from '@/lib/services/authorization.service';

await assignRole(
  userId,           // User to assign role to
  roleId,           // Role ID
  organisationId,   // Organisation context
  assignedBy,       // User performing assignment
  scope,            // Optional: JSON scope restrictions
  expiresAt         // Optional: Expiration date
);
```

#### Revoke Role

```typescript
import { revokeRole } from '@/lib/services/authorization.service';

await revokeRole(userRoleId, revokedBy);
```

### Direct Permission Management

#### Grant Permission

```typescript
import { grantPermission } from '@/lib/services/authorization.service';

await grantPermission(
  userId,
  permissionId,
  organisationId,
  assignedBy,
  conditions,   // Optional: JSON conditions
  scope,        // Optional: JSON scope
  expiresAt     // Optional: Expiration
);
```

#### Deny Permission

```typescript
import { denyPermission } from '@/lib/services/authorization.service';

await denyPermission(
  userId,
  permissionId,
  organisationId,
  assignedBy,
  expiresAt
);
```

### Audit Logging

All RBAC changes are logged to `rbac_audit_log`:
- Role assignments/revocations
- Permission grants/denies
- Role modifications
- Permission changes

**Audit Log Entry:**
```typescript
{
  id: "uuid",
  organisationId: "org-uuid",
  entityType: "user_role",
  entityId: "role-assignment-uuid",
  action: "assigned",
  performedBy: "admin-user-uuid",
  targetUserId: "target-user-uuid",
  changes: JSON.stringify({ before: null, after: role }),
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  createdAt: timestamp
}
```

### Best Practices

#### 1. Always Check Authentication First
```typescript
const session = await auth.api.getSession({ headers: await headers() });
if (!session?.user) {
  redirect('/auth/login');
}
```

#### 2. Get Tenant Context Early
```typescript
const context = await getUserTenantContext(session.user.id);
if (!context) {
  redirect('/dashboard/no-organisation');
}
```

#### 3. Check Permissions Before Actions
```typescript
const canDelete = await hasPermission(
  userId, 
  organisationId, 
  'cases:delete',
  isSuperAdmin
);

if (!canDelete) {
  throw new Error("Permission denied");
}
```

#### 4. Use Permission Gates in UI
```typescript
<PermissionGate permission="cases:update">
  <EditButton />
</PermissionGate>
```

#### 5. Log Administrative Actions
```typescript
// Automatically logged by service layer
await assignRole(userId, roleId, orgId, assignedBy);
```

### Security Considerations

#### Defense in Depth
- **UI Layer:** Permission gates hide unauthorized UI
- **API Layer:** Server actions check permissions
- **Service Layer:** Authorization service enforces rules
- **Database Layer:** Organisation filtering in queries

#### Principle of Least Privilege
- Users granted minimum required permissions
- Temporary roles expire automatically
- Explicit denies override grants

#### Separation of Duties
- Role assignment requires specific permission
- Audit trail for compliance
- Multiple roles for checks and balances

#### Fail-Safe Defaults
- Default action is "deny"
- Missing permissions = no access
- Expired permissions automatically inactive

---

**Next:** [API Documentation →](05-api-documentation.md)
