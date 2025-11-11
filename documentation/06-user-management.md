# User Management

## Overview

Totolaw provides comprehensive user management with two primary workflows:
1. **Admin-Initiated Invitations** - Administrators invite users with pre-assigned roles
2. **User-Initiated Join Requests** - Users browse and request to join organisations

Both workflows include email notifications and approval mechanisms.

## User Lifecycle

```
New User
    ↓
┌───────────────────────────────────────┐
│  Registration via Magic Link          │
│  (Invitation or Self-Registration)    │
└───────────┬───────────────────────────┘
            ↓
    ┌───────────────┐
    │  Active User  │
    └───────┬───────┘
            │
    ┌───────┴────────────┐
    ↓                    ↓
Organisation         Add to More
Membership          Organisations
    ↓                    ↓
Role Assignment     Switch Context
    ↓                    ↓
Permission Access   Multi-Org Access
```

## User Registration

### Initial User Creation

Users are created when they:
1. Accept an organisation invitation
2. Complete magic link authentication

**Database Record:**
```typescript
{
  id: "uuid",
  email: "user@example.com",
  name: "John Doe",
  emailVerified: true,
  currentOrganisationId: "org-uuid",
  isSuperAdmin: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### First-Time Login

1. User receives magic link (via invitation or direct login)
2. Clicks magic link
3. Better Auth creates/updates user record
4. Session created
5. Redirected to dashboard or invitation acceptance

## Organisation Membership

### Membership States

| State | Description |
|-------|-------------|
| **Active** | User has full access to organisation |
| **Inactive** | User removed from organisation |
| **Pending Invitation** | Invitation sent, not yet accepted |
| **Pending Request** | Join request submitted, awaiting approval |

### Primary Organisation

Each user has a **primary organisation** (if they belong to multiple):
- Set by `isPrimary` flag on `organisation_members`
- Used as default context on login
- Can be changed by user

### Multi-Organisation Membership

Users can belong to multiple organisations:

```typescript
// User's organisations
const orgs = await getUserOrganisations(userId);

orgs.forEach(({ organisation, membership }) => {
  console.log(organisation.name);
  console.log('Primary:', membership.isPrimary);
  console.log('Joined:', membership.joinedAt);
});
```

## Admin-Initiated Invitations

### Invitation Flow

```
┌──────────────────┐
│ 1. Admin creates │
│    invitation    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 2. Email sent    │
│    with token    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 3. User clicks   │
│    magic link    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 4. User accepts  │
│    invitation    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 5. Membership    │
│    created       │
└──────────────────┘
```

### Creating an Invitation

**UI Location:** `/dashboard/users` (Admin panel)

**Server Action:**
```typescript
'use server';

import { createInvitation } from '@/lib/services/invitation.service';

export async function inviteUser(formData: FormData) {
  // 1. Check authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Get tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { success: false, error: 'No organisation context' };
  }

  // 3. Check permission
  const canInvite = await hasPermission(
    session.user.id,
    context.organisationId,
    'users:invite',
    context.isSuperAdmin
  );

  if (!canInvite) {
    return { success: false, error: 'Permission denied' };
  }

  // 4. Extract data
  const email = formData.get('email') as string;
  const roleId = formData.get('roleId') as string;

  // 5. Validate
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid email required' };
  }

  // 6. Check for existing invitation or membership
  const existing = await checkExistingInvitation(email, context.organisationId);
  if (existing) {
    return { success: false, error: 'User already invited or member' };
  }

  // 7. Create invitation
  const invitationId = await createInvitation(
    context.organisationId,
    email,
    session.user.id,
    roleId
  );

  // 8. Send email notification
  // (Handled by createInvitation service)

  return {
    success: true,
    data: { invitationId }
  };
}
```

### Invitation Email

**Subject:** "Invitation to join [Organisation Name] on Totolaw"

**Content:**
```
Hello,

You've been invited to join [Organisation Name] on Totolaw by [Inviter Name].

Click the link below to accept the invitation:
[Accept Invitation Link]

This invitation expires in 7 days.

If you didn't expect this invitation, you can safely ignore this email.
```

### Accepting an Invitation

**URL:** `/auth/accept-invitation?token={token}`

**Flow:**
1. User clicks invitation link
2. If not logged in: magic link authentication
3. If logged in: validate token and create membership
4. Assign pre-selected role (if specified)
5. Set as primary organisation (if user's first org)
6. Redirect to dashboard

**Code:**
```typescript
// app/auth/accept-invitation/page.tsx
export default async function AcceptInvitationPage({
  searchParams
}: {
  searchParams: { token: string }
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    // Redirect to login, preserve token
    redirect(`/auth/login?redirect=/auth/accept-invitation?token=${searchParams.token}`);
  }

  // Accept invitation
  const result = await acceptInvitation(searchParams.token, session.user.id);

  if (!result.success) {
    return <ErrorPage message={result.error} />;
  }

  // Redirect to organisation dashboard
  redirect('/dashboard');
}
```

### Managing Invitations

**View Pending Invitations:**
```typescript
import { getPendingInvitations } from '@/lib/services/invitation.service';

const invitations = await getPendingInvitations(organisationId);
```

**Revoke Invitation:**
```typescript
import { revokeInvitation } from '@/lib/services/invitation.service';

await revokeInvitation(invitationId, revokedBy);
```

## User-Initiated Join Requests

### Join Request Flow

```
┌──────────────────┐
│ 1. User browses  │
│    organisations │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 2. User submits  │
│    join request  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 3. Admins        │
│    notified      │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 4. Admin reviews │
│    and approves  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 5. User notified │
│    & membership  │
│    created       │
└──────────────────┘
```

### Browse Organisations

**UI Location:** `/organisations`

**Features:**
- List all active organisations
- Show organisation details
- Display membership status
- Request to join button

**Code:**
```typescript
// app/organisations/page.tsx
export default async function OrganisationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get all organisations
  const allOrgs = await db
    .select()
    .from(organisations)
    .where(eq(organisations.isActive, true));

  // Get user's memberships
  const userMemberships = await db
    .select()
    .from(organisationMembers)
    .where(eq(organisationMembers.userId, session.user.id));

  // Get user's pending requests
  const pendingRequests = await db
    .select()
    .from(organisationJoinRequests)
    .where(
      and(
        eq(organisationJoinRequests.userId, session.user.id),
        eq(organisationJoinRequests.status, 'pending')
      )
    );

  return (
    <div>
      {allOrgs.map(org => (
        <OrganisationCard
          key={org.id}
          organisation={org}
          isMember={userMemberships.some(m => m.organisationId === org.id)}
          hasPendingRequest={pendingRequests.some(r => r.organisationId === org.id)}
        />
      ))}
    </div>
  );
}
```

### Submitting a Join Request

**Server Action:**
```typescript
'use server';

import { createJoinRequest } from '@/lib/services/join-request.service';

export async function requestToJoinOrganisation(
  organisationId: string,
  message?: string
) {
  // 1. Check authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Check if already member
  const existing = await db
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, session.user.id),
        eq(organisationMembers.organisationId, organisationId)
      )
    );

  if (existing.length > 0) {
    return { success: false, error: 'Already a member' };
  }

  // 3. Check for pending request
  const pendingRequest = await getUserJoinRequest(
    session.user.id,
    organisationId
  );

  if (pendingRequest && pendingRequest.status === 'pending') {
    return { success: false, error: 'Request already pending' };
  }

  // 4. Create join request
  const requestId = await createJoinRequest(
    session.user.id,
    organisationId,
    message
  );

  // 5. Notify admins
  // (Handled by createJoinRequest service)

  return {
    success: true,
    data: { requestId }
  };
}
```

### Admin Notification Email

**Subject:** "New join request for [Organisation Name]"

**Content:**
```
Hello,

[User Name] ([User Email]) has requested to join [Organisation Name].

Message from user:
[User's message, if provided]

Review and respond to this request:
[Review URL]
```

### Reviewing Join Requests

**UI Location:** `/dashboard/users/join-requests` (Admin panel)

**View Pending Requests:**
```typescript
import { getPendingJoinRequests } from '@/lib/services/join-request.service';

const requests = await getPendingJoinRequests(organisationId);
```

**Approve Request:**
```typescript
'use server';

import { approveJoinRequest } from '@/lib/services/join-request.service';

export async function approveRequest(
  requestId: string,
  roleId?: string
) {
  // Check authentication & permissions
  // ...

  await approveJoinRequest(requestId, session.user.id, roleId);

  // User notified via email
  // Membership created
  // Role assigned (if specified)

  revalidatePath('/dashboard/users/join-requests');
  return { success: true };
}
```

**Reject Request:**
```typescript
'use server';

import { rejectJoinRequest } from '@/lib/services/join-request.service';

export async function rejectRequest(
  requestId: string,
  reason?: string
) {
  // Check authentication & permissions
  // ...

  await rejectJoinRequest(requestId, session.user.id, reason);

  // User notified via email with reason

  revalidatePath('/dashboard/users/join-requests');
  return { success: true };
}
```

### User Notification Emails

**Approval Email:**
```
Subject: Your request to join [Organisation Name] has been approved

Hello,

Your request to join [Organisation Name] has been approved!

You can now access the organisation dashboard:
[Dashboard Link]

Welcome to the team!
```

**Rejection Email:**
```
Subject: Your request to join [Organisation Name]

Hello,

Your request to join [Organisation Name] has been reviewed.

Unfortunately, your request was not approved at this time.

Reason: [Admin's reason, if provided]

If you have questions, please contact the organisation administrators.
```

## Role Assignment

### Assigning Roles to Users

**UI Location:** `/dashboard/users/[userId]/roles`

**Server Action:**
```typescript
'use server';

import { assignRole } from '@/lib/services/authorization.service';

export async function assignUserRole(
  userId: string,
  roleId: string
) {
  // Check authentication & permissions
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);
  
  const canAssignRoles = await hasPermission(
    session.user.id,
    context.organisationId,
    'roles:assign',
    context.isSuperAdmin
  );

  if (!canAssignRoles) {
    return { success: false, error: 'Permission denied' };
  }

  // Assign role
  const assignmentId = await assignRole(
    userId,
    roleId,
    context.organisationId,
    session.user.id
  );

  // Audit log created automatically

  revalidatePath(`/dashboard/users/${userId}`);
  return { success: true, data: { assignmentId } };
}
```

### Revoking Roles

```typescript
'use server';

import { revokeRole } from '@/lib/services/authorization.service';

export async function revokeUserRole(userRoleId: string) {
  // Check authentication & permissions
  // ...

  await revokeRole(userRoleId, session.user.id);

  // Audit log created automatically

  revalidatePath('/dashboard/users');
  return { success: true };
}
```

### Managing User Roles UI

**Component:** `components/auth/manage-user-roles-dialog.tsx`

Features:
- Display current roles
- Add new roles
- Remove roles
- Show role permissions
- Audit trail

## User Profile Management

### Viewing User Profile

**UI Location:** `/dashboard/users/[userId]`

**Information Displayed:**
- Basic info (name, email)
- Organisation memberships
- Assigned roles
- Permissions (computed)
- Last login
- Account status

### Editing User Profile

Users can edit their own profile:
- Name
- Profile picture (if enabled)
- Preferences

Admins can also:
- Assign/revoke roles
- Add to organisations
- Activate/deactivate account

## User Status Management

### Active Users

Normal state with full access based on roles/permissions.

### Inactive Users

**Deactivation:**
```typescript
await db
  .update(organisationMembers)
  .set({
    isActive: false,
    leftAt: new Date(),
    updatedAt: new Date()
  })
  .where(eq(organisationMembers.id, membershipId));
```

**Effects:**
- Cannot access organisation
- Sessions remain valid but access denied
- Can be reactivated by admin

### Removing Users from Organisation

**Soft Delete:**
- Set `isActive = false` on membership
- Set `leftAt` timestamp
- Preserve audit trail

**Complete Removal (Rare):**
- Delete membership record
- Cascading deletes remove related data
- Use with caution

## Multi-Organisation Switching

### Organisation Switcher Component

**Location:** `components/organisation-switcher.tsx`

**Features:**
- Dropdown menu of user's organisations
- Current organisation highlighted
- Switch organisation action
- Organisation details on hover

**Code:**
```typescript
'use client';

import { useRouter } from 'next/navigation';

export function OrganisationSwitcher({ organisations, currentOrgId }) {
  const router = useRouter();

  async function switchOrg(orgId: string) {
    const response = await fetch('/api/organization/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organisationId: orgId })
    });

    if (response.ok) {
      router.refresh();  // Refresh server components
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {organisations.find(o => o.organisation.id === currentOrgId)?.organisation.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {organisations.map(({ organisation }) => (
          <DropdownMenuItem
            key={organisation.id}
            onClick={() => switchOrg(organisation.id)}
          >
            {organisation.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Switching Context

When user switches organisation:
1. `currentOrganisationId` updated in user record
2. Page refreshed with new context
3. All queries now filtered by new org
4. Permissions recalculated for new org

## User Search and Filtering

### Search Users

```typescript
// Search by email, name
const users = await db
  .select()
  .from(user)
  .where(
    or(
      like(user.email, `%${query}%`),
      like(user.name, `%${query}%`)
    )
  );
```

### Filter by Role

```typescript
// Get users with specific role
const usersWithRole = await db
  .select({
    user: user,
    userRole: userRoles
  })
  .from(userRoles)
  .innerJoin(user, eq(user.id, userRoles.userId))
  .where(
    and(
      eq(userRoles.organisationId, organisationId),
      eq(userRoles.roleId, roleId),
      eq(userRoles.isActive, true)
    )
  );
```

## Bulk Operations

### Bulk Invitation

```typescript
async function bulkInvite(emails: string[], roleId?: string) {
  for (const email of emails) {
    await createInvitation(
      organisationId,
      email,
      invitedBy,
      roleId
    );
  }
}
```

### Bulk Role Assignment

```typescript
async function bulkAssignRole(userIds: string[], roleId: string) {
  for (const userId of userIds) {
    await assignRole(
      userId,
      roleId,
      organisationId,
      assignedBy
    );
  }
}
```

## Best Practices

### 1. Always Validate Emails
```typescript
if (!email || !email.includes('@')) {
  return { success: false, error: 'Valid email required' };
}
```

### 2. Check Existing State
Before creating invitation/request, check if user is already member.

### 3. Send Notifications
Always notify users of status changes.

### 4. Maintain Audit Trail
All user management actions should be logged.

### 5. Handle Edge Cases
- User already member
- Duplicate invitations
- Expired invitations
- Multiple pending requests

### 6. Graceful Error Handling
Provide clear error messages to users.

---

**Next:** [Case Management →](07-case-management.md)
