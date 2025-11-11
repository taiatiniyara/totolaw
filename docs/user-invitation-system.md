# User Invitation System

## Overview

The Totolaw platform now includes a comprehensive user invitation system that allows system administrators to invite users to any organisation with custom roles and permissions.

## Key Features

### For Regular Administrators
- **Invite Users to Their Organisation**: Administrators with `users:manage` permission can invite new users to their organisation
- **Role Assignment**: Select one or multiple roles to assign to the invited user
- **Email Notifications**: Invited users automatically receive an email with a secure invitation link
- **Invitation Management**: View, track, and revoke pending invitations

### For System Administrators (Super Admins)
- **Cross-Organisation Invitations**: Invite users to any organisation in the system
- **Custom Role Assignment**: Assign any combination of roles from the target organisation
- **Direct Permission Grants**: Grant specific permissions beyond role-based permissions
- **Full Visibility**: View and manage all invitations across all organisations

## How It Works

### 1. Creating an Invitation

**Path**: `/dashboard/users/invite`

**Process**:
1. Administrator enters the user's email address
2. Super admins select the target organisation
3. Select one or more roles to assign
4. (Super admins only) Optionally grant additional permissions
5. Click "Send Invitation"
6. User receives an email with a secure invitation link

**Server Action**: `inviteUser()` or `createSystemAdminInvitation()`

### 2. Accepting an Invitation

**Path**: `/auth/accept-invitation?token=<TOKEN>`

**Process**:
1. User clicks the invitation link in their email
2. System validates the invitation token
3. User enters their full name
4. User clicks "Accept Invitation"
5. System creates/links user account
6. User is added to the organisation
7. Assigned roles are activated
8. User is redirected to login page

**Key Features**:
- Automatic account creation if user doesn't exist
- Account linking if user already has an account
- Automatic organisation membership creation
- Role and permission assignment
- Invitation marked as "accepted"

### 3. Managing Invitations

**Path**: `/dashboard/users/invitations`

**Features**:
- View all pending, accepted, expired, and revoked invitations
- See invitation status at a glance
- Revoke pending invitations
- Track when invitations were sent and accepted
- (Super admins) View invitations across all organisations

## Database Schema

### `organisation_invitations` Table

```typescript
{
  id: string              // Primary key
  organisationId: string  // Target organisation
  email: string           // Invitee email
  roleId: string          // Optional: pre-assigned role (backward compatibility)
  token: string           // Secure invitation token (unique)
  status: string          // "pending", "accepted", "expired", "revoked"
  invitedBy: string       // User who created the invitation
  acceptedBy: string      // User who accepted (null until accepted)
  expiresAt: timestamp    // Invitation expiry (default: 7 days)
  acceptedAt: timestamp   // When invitation was accepted
  revokedAt: timestamp    // When invitation was revoked
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Service Layer

### `lib/services/invitation.service.ts`

**Key Functions**:

- `createInvitation()` - Create a new invitation
- `getInvitationByToken()` - Retrieve invitation details
- `acceptInvitation()` - Accept invitation and create/link user
- `revokeInvitation()` - Cancel a pending invitation
- `listInvitationsForOrganisation()` - Get invitations for specific org
- `listAllInvitations()` - Get all invitations (super admin only)
- `createSystemAdminInvitation()` - Super admin invitation with full control
- `acceptSystemAdminInvitation()` - Accept with multiple roles/permissions

## Server Actions

### Regular User Actions (`app/dashboard/users/actions.ts`)

- `inviteUser(email, roleIds, permissionIds)` - Create invitation
- `getInvitations(status?)` - List invitations
- `revokeUserInvitation(invitationId)` - Revoke invitation
- `getAvailablePermissions()` - Get all permissions (super admin only)

### System Admin Actions (`app/dashboard/system-admin/actions.ts`)

- `createSystemAdminInvitation(email, organisationId, roleIds, permissionIds)` - Create cross-org invitation with full control

### Invitation Acceptance Actions (`app/auth/accept-invitation/actions.ts`)

- `getInvitationDetails(token)` - Get invitation info for display
- `acceptInvitationAction(token, userName)` - Process invitation acceptance

## Email Notifications

Invitation emails include:
- Invitation from the administrator's name
- Target organisation name
- Secure, unique invitation link
- Expiry information (7 days default)
- Instructions for acceptance

**Email Service**: Uses existing `lib/services/email.service.ts`

## Security Features

1. **Secure Tokens**: 32-byte cryptographically secure random tokens
2. **Expiration**: Invitations expire after 7 days (configurable)
3. **One-Time Use**: Tokens are invalidated after acceptance
4. **Permission Checks**: All actions require proper permissions
5. **Revocation**: Administrators can revoke pending invitations
6. **Duplicate Prevention**: Prevents multiple invitations to same user/org

## Permissions Required

- **Invite Users**: `users:manage`
- **View Invitations**: `users:read`
- **Revoke Invitations**: `users:manage`
- **System Admin Invitations**: Super admin status

## UI Components

### Invitation Form
- **Path**: `/dashboard/users/invite`
- **Component**: `invite-user-form.tsx`
- Email input
- Organisation selector (super admin)
- Multi-select role checkboxes
- Optional permission selection (super admin)
- Real-time validation

### Invitation Acceptance
- **Path**: `/auth/accept-invitation`
- **Component**: `accept-invitation-client.tsx`
- Token validation
- Organisation and inviter details
- Name input
- Accept/decline actions

### Invitation Management
- **Path**: `/dashboard/users/invitations`
- **Component**: `invitations-client.tsx`
- Summary cards (pending, accepted, expired, revoked)
- Invitation lists with status badges
- Revoke functionality
- Time-based filtering

## Usage Examples

### Regular Administrator

```typescript
// Invite a user with roles
const result = await inviteUser(
  "user@example.com",
  ["role-id-1", "role-id-2"],
  []
);
```

### System Administrator

```typescript
// Invite user to specific org with custom permissions
const result = await createSystemAdminInvitation(
  "admin@example.com",
  "org-id-123",
  ["judge-role-id", "clerk-role-id"],
  ["cases:create", "hearings:manage"]
);
```

### Accepting Invitation

Users simply:
1. Click link in email
2. Enter their name
3. Click "Accept Invitation"
4. Log in with magic link

## System Admin Capabilities

Super admins can:
- ✅ Invite users to ANY organisation
- ✅ Assign ANY roles from the target organisation
- ✅ Grant specific permissions directly
- ✅ View ALL invitations system-wide
- ✅ Manage invitations across organisations
- ✅ Create users with full permissions from the start

## Organisation Join Requests

In addition to admin-initiated invitations, users can also request to join organisations through a self-service flow.

### For Users

**Path**: `/organisations/join`

**Features**:
- Browse available organisations
- Search organisations by name
- View current membership and request status
- Submit join requests with optional message
- Cancel pending requests
- See rejection reasons (if applicable)

**Status Indicators**:
- 🟢 **Member** - Already a member of the organisation
- 🟡 **Pending** - Join request awaiting review
- 🔴 **Rejected** - Previous request was rejected
- ⚪ **Available** - Can submit a join request

### For Administrators

**Path**: `/dashboard/users/requests`

**Features**:
- Review pending join requests
- View user details and optional message
- Approve requests and assign roles
- Reject requests with optional reason
- Track approval history
- (Super admins) View requests across all organisations

**Approval Process**:
1. Admin reviews request details
2. Optionally assigns roles during approval
3. User receives notification email
4. User is added to organisation
5. Roles are activated

**Rejection Process**:
1. Admin reviews request
2. Optionally provides rejection reason
3. User receives notification email
4. Request marked as rejected
5. User can submit new request later

### Database Schema

**`organisation_join_requests` Table**:

```typescript
{
  id: string              // Primary key
  organisationId: string  // Target organisation
  userId: string          // Requesting user
  status: string          // "pending", "approved", "rejected"
  message: string         // Optional user message
  rejectionReason: string // Optional admin reason for rejection
  reviewedBy: string      // Admin who reviewed
  reviewedAt: timestamp   // When reviewed
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Service Layer

**`lib/services/join-request.service.ts`**:

- `createJoinRequest()` - Submit new join request
- `approveJoinRequest()` - Approve and add user to org
- `rejectJoinRequest()` - Reject with optional reason
- `cancelJoinRequest()` - User cancels own request
- `listJoinRequestsForOrganisation()` - Get requests for org
- `getUserJoinRequests()` - Get user's own requests

### Server Actions

**User Actions** (`app/organisations/join/actions.ts`):
- `requestToJoinOrganisation(orgId, message)` - Submit request
- `getMyJoinRequests()` - View own requests
- `cancelMyJoinRequest(requestId)` - Cancel pending request

**Admin Actions** (`app/dashboard/users/requests/actions.ts`):
- `getOrganisationJoinRequests(status?)` - List requests
- `approveJoinRequestAction(requestId, roleIds)` - Approve with roles
- `rejectJoinRequestAction(requestId, reason)` - Reject with reason

### Email Notifications

**Request Submitted**:
- Notifies organisation admins
- Includes user details and message
- Link to review page

**Request Approved**:
- Notifies user of approval
- Includes organisation name
- Link to dashboard

**Request Rejected**:
- Notifies user of rejection
- Includes optional reason
- User can submit new request

### Security Features

1. **Duplicate Prevention**: One pending request per user/org
2. **Permission Checks**: Requires `users:read` to view, `users:manage` to approve/reject
3. **Audit Trail**: Tracks who reviewed and when
4. **Email Validation**: Requires authenticated user
5. **Rate Limiting**: Prevents spam requests (TODO)

### Usage Examples

**User Requesting**:
```typescript
// Browse and request
const result = await requestToJoinOrganisation(
  "org-id-123",
  "I'm a registered lawyer interested in family law cases"
);
```

**Admin Approving**:
```typescript
// Approve with role assignment
const result = await approveJoinRequestAction(
  "request-id-456",
  ["lawyer-role-id", "viewer-role-id"]
);
```

**Admin Rejecting**:
```typescript
// Reject with reason
const result = await rejectJoinRequestAction(
  "request-id-456",
  "We only accept lawyers registered with the bar association"
);
```

## Future Enhancements

Potential improvements:
- Bulk invitations (CSV upload)
- Custom invitation messages
- Invitation templates
- Reminder emails for pending invitations
- Invitation analytics and reporting
- Custom expiry periods per invitation
- Auto-revoke expired invitations (scheduled task)
- Rate limiting for join requests
- Approval workflows (multiple approvers)
- Auto-approval rules based on email domain

## Troubleshooting

### Invitation Not Received
- Check spam/junk folder
- Verify SMTP configuration in environment variables
- Check email service logs

### Token Invalid/Expired
- Invitation may have expired (7 days)
- Invitation may have been revoked
- Token may have been used already

### Cannot Accept Invitation
- Check if user already has account and is already a member
- Verify token is complete and not truncated
- Check database connection

## Environment Variables Required

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=your-smtp-password
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Testing

To test the invitation flow:

1. **As Admin**:
   ```
   - Navigate to /dashboard/users/invite
   - Enter test email
   - Select roles
   - Send invitation
   ```

2. **Check Email**:
   ```
   - Verify email received
   - Check invitation link format
   - Confirm details are correct
   ```

3. **Accept Invitation**:
   ```
   - Click invitation link
   - Enter name
   - Accept invitation
   - Verify redirect to login
   ```

4. **Verify**:
   ```
   - Check user created in database
   - Verify organisation membership
   - Confirm role assignments
   - Test user can log in
   ```

## Summary

The user invitation system provides a complete, secure, and user-friendly way for administrators (especially system admins) to invite users to organisations with precise control over roles and permissions. The system handles the entire lifecycle from invitation creation through acceptance, with proper security, validation, and audit trails throughout.
