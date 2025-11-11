# API Documentation

## Overview

Totolaw provides both **API Routes** (REST-style endpoints) and **Server Actions** (Next.js server functions) for backend operations. Most mutations use Server Actions, while API routes handle authentication and specific data retrieval patterns.

## Base URL

- **Development:** `http://localhost:3441`
- **Production:** Your configured `NEXT_PUBLIC_APP_URL`

## Authentication

All API requests (except authentication endpoints) require a valid session cookie set by Better Auth.

### Session Cookie
- **Name:** Automatically managed by Better Auth
- **Type:** HTTP-only cookie
- **Expiration:** 7 days
- **Security:** Secure flag in production, SameSite=Lax

## API Routes

### Authentication

#### Initialize Magic Link Login

**Endpoint:** `POST /api/auth/magic-link/send`  
**Handler:** Better Auth (via `/api/auth/[...all]/route.ts`)

**Request:**
```json
{
  "email": "user@example.com",
  "callbackURL": "/dashboard"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link sent to your email"
}
```

**Errors:**
- `400` - Invalid email format
- `429` - Rate limit exceeded (5 requests per 15 minutes)
- `500` - Email delivery failed

#### Verify Magic Link

**Endpoint:** `GET /api/auth/magic-link/verify?token={token}`  
**Handler:** Better Auth

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | Yes | Magic link token from email |

**Response:**
- Redirects to callback URL on success
- Redirects to error page on failure

#### Get Session

**Endpoint:** `GET /api/auth/session`  
**Handler:** Better Auth

**Response:**
```json
{
  "session": {
    "id": "session-uuid",
    "userId": "user-uuid",
    "expiresAt": "2025-11-18T12:00:00Z"
  },
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "currentOrganisationId": "org-uuid",
    "isSuperAdmin": false
  }
}
```

#### Logout

**Endpoint:** `POST /api/auth/signout`  
**Handler:** Better Auth

**Response:**
```json
{
  "success": true
}
```

### Organisation Management

#### List User's Organisations

**Endpoint:** `GET /api/organization/list`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "organisations": [
      {
        "organisation": {
          "id": "org-uuid",
          "name": "Fiji High Court",
          "code": "FJ",
          "type": "country",
          "description": "Fiji judicial system",
          "isActive": true
        },
        "membership": {
          "id": "member-uuid",
          "isPrimary": true,
          "isActive": true,
          "joinedAt": "2025-01-01T00:00:00Z"
        }
      }
    ],
    "currentOrganisationId": "org-uuid"
  }
}
```

**Errors:**
- `401` - Unauthorized (no session)
- `500` - Server error

#### Switch Organisation Context

**Endpoint:** `POST /api/organization/switch`

**Authentication:** Required

**Request:**
```json
{
  "organisationId": "org-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "organisationId": "org-uuid"
  }
}
```

**Errors:**
- `400` - Missing organisationId
- `401` - Unauthorized
- `403` - User doesn't have access to organisation
- `500` - Server error

## Server Actions

Server Actions are the primary way to perform mutations and complex operations. They're defined with `'use server'` directive and can be called directly from client components.

### Authentication Actions

**File:** `app/auth/actions.ts`

#### Send Magic Link

```typescript
'use server';

export async function sendMagicLink(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}>;
```

**Usage:**
```typescript
<form action={sendMagicLink}>
  <input name="email" type="email" required />
  <button type="submit">Send Magic Link</button>
</form>
```

#### Logout

```typescript
'use server';

export async function logout(): Promise<void>;
```

**Usage:**
```typescript
import { logout } from '@/app/auth/actions';

<button onClick={() => logout()}>Logout</button>
```

### Dashboard Actions

**File:** `app/dashboard/actions.ts`

These actions handle the core case management operations. All actions:
- Require authentication
- Check organisation context
- Validate permissions
- Return structured responses

#### Response Format

```typescript
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Organisation Actions

**File:** `app/organisations/actions.ts`

#### Request to Join Organisation

```typescript
'use server';

export async function requestToJoinOrganisation(
  organisationId: string,
  message?: string
): Promise<ActionResponse<{ requestId: string }>>;
```

**Checks:**
- User is authenticated
- User not already a member
- No pending request exists
- Organisation is active

**Returns:**
```typescript
{
  success: true,
  data: { requestId: "request-uuid" }
}
```

#### Cancel Join Request

```typescript
'use server';

export async function cancelJoinRequest(
  requestId: string
): Promise<ActionResponse>;
```

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

### Error Types

#### Validation Errors
```json
{
  "success": false,
  "error": "Email is required"
}
```

#### Authentication Errors
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

#### Permission Errors
```json
{
  "success": false,
  "error": "You don't have permission to perform this action"
}
```

#### Not Found Errors
```json
{
  "success": false,
  "error": "Case not found"
}
```

## Rate Limiting

### Global Rate Limits
- **Window:** 15 minutes
- **Limit:** 100 requests per IP
- **Storage:** Database-backed

### Magic Link Rate Limits
- **Window:** 15 minutes
- **Limit:** 5 requests per email
- **Storage:** Database-backed

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699876543
```

## Request/Response Examples

### Create Case (Server Action Pattern)

**Action Definition:**
```typescript
// app/dashboard/cases/actions.ts
'use server';

export async function createCase(formData: FormData) {
  // 1. Validate session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Get tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { success: false, error: "No organisation context" };
  }

  // 3. Check permissions
  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    'cases:create',
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { success: false, error: "Permission denied" };
  }

  // 4. Extract and validate data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) {
    return { success: false, error: "Title is required" };
  }

  // 5. Create case
  const caseId = generateUUID();
  await db.insert(cases).values({
    id: caseId,
    organisationId: context.organisationId,
    title,
    description,
    status: 'open',
    createdBy: session.user.id,
  });

  // 6. Return success
  revalidatePath('/dashboard/cases');
  return {
    success: true,
    data: { caseId }
  };
}
```

**Client Usage:**
```typescript
'use client';

import { createCase } from './actions';
import { toast } from 'sonner';

export function CreateCaseForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createCase(formData);
    
    if (result.success) {
      toast.success('Case created successfully');
      router.push(`/dashboard/cases/${result.data.caseId}`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <textarea name="description" />
      <button type="submit">Create Case</button>
    </form>
  );
}
```

### Fetch Data (Server Component Pattern)

```typescript
// app/dashboard/cases/page.tsx
import { db } from '@/lib/drizzle/connection';
import { cases } from '@/lib/drizzle/schema/case-schema';
import { getUserTenantContext } from '@/lib/services/tenant.service';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

export default async function CasesPage() {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get tenant context
  const context = await getUserTenantContext(session.user.id);

  if (!context) {
    redirect('/dashboard/no-organisation');
  }

  // Fetch cases for organisation
  const casesData = await db
    .select()
    .from(cases)
    .where(eq(cases.organisationId, context.organisationId))
    .orderBy(cases.createdAt);

  return (
    <div>
      <h1>Cases</h1>
      {casesData.map(c => (
        <CaseCard key={c.id} case={c} />
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Always Validate Input

```typescript
if (!email || !email.includes('@')) {
  return { success: false, error: "Invalid email" };
}
```

### 2. Check Authentication

```typescript
const session = await auth.api.getSession({ headers: await headers() });
if (!session?.user) {
  return { success: false, error: "Unauthorized" };
}
```

### 3. Check Tenant Context

```typescript
const context = await getUserTenantContext(session.user.id);
if (!context) {
  return { success: false, error: "No organisation context" };
}
```

### 4. Verify Permissions

```typescript
const hasAccess = await hasPermission(
  userId,
  organisationId,
  'resource:action',
  isSuperAdmin
);

if (!hasAccess) {
  return { success: false, error: "Permission denied" };
}
```

### 5. Use Transactions for Multiple Operations

```typescript
await db.transaction(async (tx) => {
  await tx.insert(cases).values(caseData);
  await tx.insert(hearings).values(hearingData);
});
```

### 6. Revalidate Cache After Mutations

```typescript
import { revalidatePath } from 'next/cache';

await createCase(data);
revalidatePath('/dashboard/cases');
```

### 7. Handle Errors Gracefully

```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

### 8. Return Structured Responses

```typescript
// Good
return { success: true, data: { id: 'uuid' } };

// Bad
return 'uuid';
```

## Testing API Endpoints

### Using cURL

```bash
# Test organisation list
curl -X GET http://localhost:3441/api/organization/list \
  -H "Cookie: better-auth.session_token=..." \
  -H "Content-Type: application/json"

# Test organisation switch
curl -X POST http://localhost:3441/api/organization/switch \
  -H "Cookie: better-auth.session_token=..." \
  -H "Content-Type: application/json" \
  -d '{"organisationId": "org-uuid"}'
```

### Using Browser DevTools

```javascript
// In browser console (must be logged in)
fetch('/api/organization/list')
  .then(r => r.json())
  .then(console.log);
```

## Webhooks & Integrations

Currently, Totolaw doesn't expose webhooks, but the architecture supports future integration:

```typescript
// Future: Webhook endpoint
export async function POST(request: NextRequest) {
  const event = await request.json();
  
  // Verify webhook signature
  // Process event
  // Return response
}
```

---

**Next:** [User Management →](06-user-management.md)
