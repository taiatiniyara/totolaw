# Service Layer Documentation

## Overview

The service layer contains business logic and reusable functions that power Totolaw's core functionality. Services are organized by domain and provide clean interfaces for complex operations.

## Service Architecture

```
Controllers (Server Actions/API Routes)
    ↓
Service Layer (Business Logic)
    ↓
Data Access Layer (Drizzle ORM)
    ↓
Database
```

## Core Services

### Authorization Service

**File:** `lib/services/authorization.service.ts`

Handles all RBAC operations including permission checks, role assignments, and permission grants.

#### Key Functions

##### `getUserPermissions()`

Get all permissions for a user in an organisation.

```typescript
async function getUserPermissions(
  userId: string,
  organisationId: string,
  isSuperAdmin: boolean = false
): Promise<UserPermissions>
```

**Returns:**
```typescript
{
  userId: string;
  organisationId: string;
  roles: string[];              // Role slugs
  permissions: string[];        // Permission slugs
  isSuperAdmin: boolean;
}
```

**Example:**
```typescript
const perms = await getUserPermissions(userId, orgId, false);
console.log(perms.permissions);  // ['cases:create', 'cases:read', ...]
```

##### `hasPermission()`

Check if user has a specific permission.

```typescript
async function hasPermission(
  userId: string,
  organisationId: string,
  permissionSlug: string,
  isSuperAdmin: boolean = false
): Promise<boolean>
```

**Example:**
```typescript
const canCreate = await hasPermission(userId, orgId, 'cases:create');
if (canCreate) {
  // Allow case creation
}
```

##### `hasAnyPermission()`

Check if user has at least one of the specified permissions.

```typescript
async function hasAnyPermission(
  userId: string,
  organisationId: string,
  permissionSlugs: string[],
  isSuperAdmin: boolean = false
): Promise<boolean>
```

**Example:**
```typescript
const canViewCaseData = await hasAnyPermission(
  userId,
  orgId,
  ['cases:read', 'cases:manage']
);
```

##### `hasAllPermissions()`

Check if user has all specified permissions.

```typescript
async function hasAllPermissions(
  userId: string,
  organisationId: string,
  permissionSlugs: string[],
  isSuperAdmin: boolean = false
): Promise<boolean>
```

##### `hasRole()`

Check if user has a specific role.

```typescript
async function hasRole(
  userId: string,
  organisationId: string,
  roleSlug: string,
  isSuperAdmin: boolean = false
): Promise<boolean>
```

**Example:**
```typescript
const isJudge = await hasRole(userId, orgId, 'judge');
```

##### `assignRole()`

Assign a role to a user.

```typescript
async function assignRole(
  userId: string,
  roleId: string,
  organisationId: string,
  assignedBy: string,
  scope?: string,
  expiresAt?: Date
): Promise<string>
```

**Returns:** User role assignment ID

**Example:**
```typescript
const assignmentId = await assignRole(
  newUserId,
  judgeRoleId,
  orgId,
  adminUserId
);
```

##### `revokeRole()`

Revoke a role assignment.

```typescript
async function revokeRole(
  userRoleId: string,
  revokedBy: string
): Promise<void>
```

##### `grantPermission()`

Grant a direct permission to a user.

```typescript
async function grantPermission(
  userId: string,
  permissionId: string,
  organisationId: string,
  assignedBy: string,
  conditions?: string,
  scope?: string,
  expiresAt?: Date
): Promise<string>
```

##### `denyPermission()`

Explicitly deny a permission (overrides role permissions).

```typescript
async function denyPermission(
  userId: string,
  permissionId: string,
  organisationId: string,
  assignedBy: string,
  expiresAt?: Date
): Promise<string>
```

---

### Tenant Service

**File:** `lib/services/tenant.service.ts`

Manages organisation context and multi-tenancy operations.

#### Key Functions

##### `getUserTenantContext()`

Get the user's current organisation context.

```typescript
async function getUserTenantContext(
  userId: string
): Promise<TenantContext | null>
```

**Returns:**
```typescript
{
  organisationId: string;  // "*" for super admin without context
  userId: string;
  isSuperAdmin: boolean;
}
```

**Example:**
```typescript
const context = await getUserTenantContext(session.user.id);
if (!context) {
  redirect('/dashboard/no-organisation');
}

// Use context.organisationId in queries
const cases = await db
  .select()
  .from(casesTable)
  .where(eq(casesTable.organisationId, context.organisationId));
```

##### `verifyUserOrganisationAccess()`

Check if user has access to an organisation.

```typescript
async function verifyUserOrganisationAccess(
  userId: string,
  organisationId: string
): Promise<boolean>
```

**Example:**
```typescript
const hasAccess = await verifyUserOrganisationAccess(userId, requestedOrgId);
if (!hasAccess) {
  throw new Error('Access denied');
}
```

##### `getUserOrganisations()`

Get all organisations a user can access.

```typescript
async function getUserOrganisations(userId: string): Promise<Array<{
  organisation: Organisation;
  membership: OrganisationMember;
}>>
```

**Example:**
```typescript
const orgs = await getUserOrganisations(userId);

orgs.forEach(({ organisation, membership }) => {
  console.log(organisation.name, membership.isPrimary);
});
```

##### `switchUserOrganisation()`

Switch user's active organisation.

```typescript
async function switchUserOrganisation(
  userId: string,
  organisationId: string
): Promise<boolean>
```

**Example:**
```typescript
const switched = await switchUserOrganisation(userId, newOrgId);
if (switched) {
  revalidatePath('/dashboard');
}
```

##### `getOrganisationById()`

Get organisation details.

```typescript
async function getOrganisationById(
  organisationId: string
): Promise<Organisation | undefined>
```

##### `isOrganisationActive()`

Check if organisation is active.

```typescript
async function isOrganisationActive(
  organisationId: string
): Promise<boolean>
```

---

### Email Service

**File:** `lib/services/email.service.ts`

Handles email sending via SMTP.

#### Key Functions

##### `sendEmail()`

Send an email.

```typescript
async function sendEmail(
  to: string,
  subject: string,
  bodyLines: string[]
): Promise<void>
```

**Example:**
```typescript
await sendEmail(
  'user@example.com',
  'Welcome to Totolaw',
  [
    'Hello,',
    'Welcome to Totolaw!',
    '<a href="https://example.com">Get Started</a>'
  ]
);
```

**Configuration:**
- Uses `SMTP_*` environment variables
- Supports HTML content
- Automatic error handling and logging

---

### Email Templates Service

**File:** `lib/services/email-templates.service.ts`

Provides pre-built email templates.

#### Key Functions

##### `sendInvitationEmail()`

Send organisation invitation email.

```typescript
async function sendInvitationEmail(
  email: string,
  organisationName: string,
  invitedBy: string,
  acceptUrl: string
): Promise<void>
```

##### `sendJoinRequestNotificationEmail()`

Notify admins of join request.

```typescript
async function sendJoinRequestNotificationEmail(
  adminEmail: string,
  userName: string,
  organisationName: string,
  reviewUrl: string
): Promise<void>
```

##### `sendJoinRequestApprovedEmail()`

Notify user of approved join request.

```typescript
async function sendJoinRequestApprovedEmail(
  userEmail: string,
  organisationName: string,
  dashboardUrl: string
): Promise<void>
```

##### `sendJoinRequestRejectedEmail()`

Notify user of rejected join request.

```typescript
async function sendJoinRequestRejectedEmail(
  userEmail: string,
  organisationName: string,
  reason?: string
): Promise<void>
```

---

### Invitation Service

**File:** `lib/services/invitation.service.ts`

Manages organisation invitations.

#### Key Functions

##### `createInvitation()`

Create a new invitation.

```typescript
async function createInvitation(
  organisationId: string,
  email: string,
  invitedBy: string,
  roleId?: string
): Promise<string>
```

**Returns:** Invitation ID

**Example:**
```typescript
const invitationId = await createInvitation(
  orgId,
  'newuser@example.com',
  adminUserId,
  clerkRoleId
);
```

##### `acceptInvitation()`

Accept an invitation.

```typescript
async function acceptInvitation(
  token: string,
  userId: string
): Promise<{
  success: boolean;
  organisationId?: string;
  error?: string;
}>
```

##### `revokeInvitation()`

Revoke a pending invitation.

```typescript
async function revokeInvitation(
  invitationId: string,
  revokedBy: string
): Promise<void>
```

##### `getInvitationByToken()`

Get invitation details by token.

```typescript
async function getInvitationByToken(
  token: string
): Promise<OrganisationInvitation | null>
```

##### `getPendingInvitations()`

Get all pending invitations for an organisation.

```typescript
async function getPendingInvitations(
  organisationId: string
): Promise<OrganisationInvitation[]>
```

---

### Join Request Service

**File:** `lib/services/join-request.service.ts`

Manages user-initiated join requests.

#### Key Functions

##### `createJoinRequest()`

Create a join request.

```typescript
async function createJoinRequest(
  userId: string,
  organisationId: string,
  message?: string
): Promise<string>
```

**Returns:** Join request ID

##### `approveJoinRequest()`

Approve a join request.

```typescript
async function approveJoinRequest(
  requestId: string,
  reviewedBy: string,
  roleId?: string
): Promise<void>
```

##### `rejectJoinRequest()`

Reject a join request.

```typescript
async function rejectJoinRequest(
  requestId: string,
  reviewedBy: string,
  reason?: string
): Promise<void>
```

##### `getPendingJoinRequests()`

Get pending join requests for an organisation.

```typescript
async function getPendingJoinRequests(
  organisationId: string
): Promise<OrganisationJoinRequest[]>
```

##### `getUserJoinRequest()`

Get user's join request for an organisation.

```typescript
async function getUserJoinRequest(
  userId: string,
  organisationId: string
): Promise<OrganisationJoinRequest | null>
```

---

### System Admin Service

**File:** `lib/services/system-admin.service.ts`

Manages system administrators and system-level operations.

#### Key Functions

##### `grantSuperAdmin()`

Grant super admin privileges.

```typescript
async function grantSuperAdmin(params: {
  email?: string;
  userId?: string;
  grantedBy: string;
  notes?: string;
}): Promise<void>
```

**Example:**
```typescript
await grantSuperAdmin({
  email: 'admin@example.com',
  grantedBy: currentAdminId,
  notes: 'Platform administrator'
});
```

##### `revokeSuperAdmin()`

Revoke super admin privileges.

```typescript
async function revokeSuperAdmin(
  userId: string,
  revokedBy: string
): Promise<void>
```

##### `isSuperAdmin()`

Check if user is super admin.

```typescript
async function isSuperAdmin(userId: string): Promise<boolean>
```

##### `listSuperAdmins()`

Get all super admins.

```typescript
async function listSuperAdmins(): Promise<Array<{
  id: string;
  email: string;
  name: string;
  adminAddedBy: string | null;
  adminAddedAt: Date | null;
}>>
```

##### `logSystemAdminAction()`

Log a system admin action for audit.

```typescript
async function logSystemAdminAction(params: {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
}): Promise<void>
```

##### `updateSuperAdminLastLogin()`

Update last login timestamp.

```typescript
async function updateSuperAdminLastLogin(
  userId: string
): Promise<void>
```

---

### Notification Service

**File:** `lib/services/notification.service.ts`

Sends various system notifications.

#### Key Functions

##### `notifyAdminsOfJoinRequest()`

Notify organisation admins of new join request.

```typescript
async function notifyAdminsOfJoinRequest(
  organisationId: string,
  userName: string,
  userEmail: string
): Promise<void>
```

##### `notifyUserOfInvitation()`

Notify user of organisation invitation.

```typescript
async function notifyUserOfInvitation(
  invitation: OrganisationInvitation,
  organisationName: string,
  inviterName: string
): Promise<void>
```

##### `notifyUserOfJoinRequestStatus()`

Notify user of join request approval/rejection.

```typescript
async function notifyUserOfJoinRequestStatus(
  userEmail: string,
  organisationName: string,
  approved: boolean,
  reason?: string
): Promise<void>
```

---

### Transcript Service

**File:** `lib/services/transcript.service.ts`

Manages court transcription services.

#### Key Functions

##### `createTranscript()`

Create a new transcript.

```typescript
async function createTranscript(
  hearingId: string,
  organisationId: string,
  createdBy: string
): Promise<string>
```

##### `updateTranscript()`

Update transcript content.

```typescript
async function updateTranscript(
  transcriptId: string,
  content: string,
  updatedBy: string
): Promise<void>
```

##### `getTranscript()`

Get transcript by ID.

```typescript
async function getTranscript(
  transcriptId: string
): Promise<Transcript | null>
```

##### `getHearingTranscripts()`

Get all transcripts for a hearing.

```typescript
async function getHearingTranscripts(
  hearingId: string
): Promise<Transcript[]>
```

---

### UUID Service

**File:** `lib/services/uuid.service.ts`

Generates UUIDs for database records.

#### Key Functions

##### `generateUUID()`

Generate a new UUID v7.

```typescript
function generateUUID(): string
```

**Example:**
```typescript
import { generateUUID } from '@/lib/services/uuid.service';

const caseId = generateUUID();
await db.insert(cases).values({
  id: caseId,
  // ...
});
```

**Note:** Uses UUID v7 which is time-sortable and database-friendly.

---

## Service Usage Patterns

### Pattern 1: Authentication Check

```typescript
'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function myAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }
  
  // Continue...
}
```

### Pattern 2: Tenant Context

```typescript
import { getUserTenantContext } from '@/lib/services/tenant.service';

const context = await getUserTenantContext(session.user.id);

if (!context) {
  return { success: false, error: 'No organisation context' };
}

// Use context.organisationId in queries
```

### Pattern 3: Permission Check

```typescript
import { hasPermission } from '@/lib/services/authorization.service';

const canPerformAction = await hasPermission(
  session.user.id,
  context.organisationId,
  'resource:action',
  context.isSuperAdmin
);

if (!canPerformAction) {
  return { success: false, error: 'Permission denied' };
}
```

### Pattern 4: Database Operation

```typescript
import { db } from '@/lib/drizzle/connection';
import { generateUUID } from '@/lib/services/uuid.service';

const id = generateUUID();

await db.insert(table).values({
  id,
  organisationId: context.organisationId,
  createdBy: session.user.id,
  // ...
});
```

### Pattern 5: Email Notification

```typescript
import { sendEmail } from '@/lib/services/email.service';

await sendEmail(
  user.email,
  'Action Completed',
  [
    `Hello ${user.name},`,
    'Your action has been completed successfully.',
    `<a href="${url}">View Details</a>`
  ]
);
```

## Error Handling in Services

Services should throw errors for exceptional cases:

```typescript
export async function criticalOperation() {
  if (!validCondition) {
    throw new Error('Critical validation failed');
  }
  
  // Operation
}
```

Callers handle errors:

```typescript
try {
  await criticalOperation();
  return { success: true };
} catch (error) {
  console.error('Operation failed:', error);
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error' 
  };
}
```

## Best Practices

### 1. Keep Services Focused
Each service should handle one domain area.

### 2. Make Services Reusable
Design functions to be called from multiple places.

### 3. Return Structured Data
Return typed objects, not primitives.

### 4. Handle Errors Gracefully
Catch and log errors, return meaningful messages.

### 5. Document Complex Logic
Add JSDoc comments for complex functions.

### 6. Validate Inputs
Check all inputs before processing.

### 7. Use Transactions
For operations affecting multiple tables.

---

This completes the comprehensive documentation for the Totolaw system! The documentation now covers:

1. ✅ System Overview
2. ✅ Architecture
3. ✅ Database Schema
4. ✅ Authentication & Authorization
5. ✅ API Documentation
6. ✅ Deployment Guide
7. ✅ Development Guide
8. ✅ Service Layer Documentation

All documentation is now available in the `/documentation` directory.
