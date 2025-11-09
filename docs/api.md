# API Documentation

This document describes the API routes, services, and data structures used in the Totolaw platform.

## API Routes

Totolaw uses Next.js App Router with built-in API routes and Server Actions.

### Authentication API

All authentication endpoints are provided by Better Auth and mounted at `/api/auth/*`.

#### Base URL

```
/api/auth/[...all]
```

This catch-all route handles all Better Auth operations.

---

### Magic Link Authentication

#### Request Magic Link

**Endpoint:** `POST /api/auth/sign-in/magic-link`

Sends a magic link to the user's email address.

**Request Body:**
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

**Error Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again in 15 minutes."
}
```

**Rate Limiting:**
- Window: 15 minutes
- Max requests: 5 per email address

**Example:**
```typescript
import { authClient } from "@/lib/auth-client";

await authClient.signIn.magicLink({
  email: "user@example.com",
  callbackURL: "/dashboard",
});
```

---

#### Verify Magic Link

**Endpoint:** `GET /api/auth/magic-link/verify`

Verifies the magic link token and creates a session.

**Query Parameters:**
- `token` (required): The magic link token from email

**Response:**
- Redirects to callback URL on success
- Redirects to login page with error on failure

**Example URL:**
```
https://totolaw.org/api/auth/magic-link/verify?token=abc123xyz...
```

---

#### Get Session

**Endpoint:** `GET /api/auth/get-session`

Retrieves the current user's session.

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "emailVerified": true,
      "image": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T12:30:00.000Z"
    },
    "session": {
      "id": "session_456",
      "userId": "user_123",
      "expiresAt": "2024-01-22T12:30:00.000Z",
      "token": "...",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  }
}
```

**No Session Response:**
```json
{
  "data": null
}
```

**Example:**
```typescript
const session = await authClient.getSession();
if (session?.data?.user) {
  console.log("User:", session.data.user.email);
}
```

---

#### Sign Out

**Endpoint:** `POST /api/auth/sign-out`

Signs out the current user and destroys the session.

**Response:**
```json
{
  "success": true
}
```

**Example:**
```typescript
await authClient.signOut();
// User is now logged out
```

---

## Server Actions

Server Actions provide type-safe, serverless function calls from client components.

### Authentication Actions

Located in `app/auth/actions.ts`

Currently, authentication is handled by Better Auth client. Custom actions can be added here.

---

### Dashboard Actions

Located in `app/dashboard/actions.ts`

#### logoutAction

Logs out the current user and redirects to login page.

**Implementation:**
```typescript
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/auth/login");
}
```

**Usage:**
```typescript
import { logoutAction } from "./actions";

async function handleLogout() {
  await logoutAction();
}
```

---

## Services

### Email Service

Located in `lib/services/email.service.ts`

#### sendEmail

Sends an email using the configured SMTP service.

**Function Signature:**
```typescript
async function sendEmail(
  to: string,
  subject: string,
  messages: string[]
): Promise<void>
```

**Parameters:**
- `to` - Recipient email address
- `subject` - Email subject line
- `messages` - Array of HTML message lines (joined with `<br><br>`)

**Example:**
```typescript
import { sendEmail } from "@/lib/services/email.service";

await sendEmail(
  "user@example.com",
  "Welcome to Totolaw",
  [
    "Bula vinaka!",
    "Welcome to the Totolaw platform.",
    "Get started by logging in with your magic link.",
  ]
);
```

**Configuration:**
Uses environment variables:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

**Error Handling:**
Throws error if SMTP configuration is missing or email fails to send.

---

### UUID Service

Located in `lib/services/uuid.service.ts`

#### generateUUID

Generates a cryptographically secure UUID.

**Function Signature:**
```typescript
function generateUUID(): string
```

**Returns:** A UUID string (e.g., `"550e8400-e29b-41d4-a716-446655440000"`)

**Example:**
```typescript
import { generateUUID } from "@/lib/services/uuid.service";

const id = generateUUID();
console.log(id); // "550e8400-e29b-41d4-a716-446655440000"
```

**Implementation:**
Uses Node.js `crypto.randomUUID()` for secure random ID generation.

---

## Database Access

### Drizzle ORM

All database access uses Drizzle ORM for type safety and query building.

#### Connection

Located in `lib/drizzle/connection.ts`

**Usage:**
```typescript
import { db } from "@/lib/drizzle/connection";

// db is a Drizzle instance ready to use
const users = await db.select().from(userTable);
```

**Configuration:**
Uses `DATABASE_URL` environment variable.

---

### Schemas

#### Auth Schema

Located in `lib/drizzle/schema/auth-schema.ts`

Defines tables for Better Auth:

**Tables:**
- `user` - User accounts
- `session` - Active sessions
- `account` - External OAuth accounts
- `verification` - Magic link tokens

**User Table:**
```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});
```

**Query Examples:**
```typescript
import { db } from "@/lib/drizzle/connection";
import { user } from "@/lib/drizzle/schema/auth-schema";

// Find user by email
const foundUser = await db
  .select()
  .from(user)
  .where(eq(user.email, "user@example.com"))
  .limit(1);

// Create user
const newUser = await db
  .insert(user)
  .values({
    id: generateUUID(),
    email: "user@example.com",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  .returning();
```

---

#### Case Schema

Located in `lib/drizzle/schema/case-schema.ts`

Defines tables for case management:

**Proceeding Templates Table:**
```typescript
export const proceedingTemplates = pgTable("proceeding_templates", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  steps: json("steps").$type<ProceedingStep[]>().notNull(),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Proceeding Steps Table:**
```typescript
export const proceedingSteps = pgTable("proceeding_steps", {
  id: text("id").primaryKey(),
  templateId: text("template_id").references(() => proceedingTemplates.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  isRequired: boolean("is_required").default(true),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Types:**
```typescript
interface ProceedingStep {
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
}

type ProceedingTemplate = typeof proceedingTemplates.$inferSelect;
type NewProceedingTemplate = typeof proceedingTemplates.$inferInsert;
```

**Query Examples:**
```typescript
import { proceedingTemplates } from "@/lib/drizzle/schema/case-schema";

// Get all templates
const templates = await db.select().from(proceedingTemplates);

// Get template by ID
const template = await db
  .select()
  .from(proceedingTemplates)
  .where(eq(proceedingTemplates.id, "template_123"))
  .limit(1);

// Create template
const newTemplate = await db
  .insert(proceedingTemplates)
  .values({
    id: generateUUID(),
    name: "Criminal Proceedings",
    description: "Standard criminal case workflow",
    steps: [
      { title: "Investigation", order: 1, isRequired: true },
      { title: "Arrest", order: 2, isRequired: true },
      { title: "Trial", order: 3, isRequired: true },
    ],
    createdBy: userId,
  })
  .returning();
```

---

## Data Types

### User

```typescript
interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Session

```typescript
interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
}
```

### Proceeding Template

```typescript
interface ProceedingTemplate {
  id: string;
  name: string;
  description: string | null;
  steps: ProceedingStep[];
  createdBy: string | null;
  createdAt: Date;
}

interface ProceedingStep {
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
}
```

---

## Error Handling

### API Error Responses

All API endpoints return errors in a consistent format:

```typescript
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE" // Optional
}
```

### Common Error Codes

- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INVALID_TOKEN` - Magic link token invalid or expired
- `UNAUTHORIZED` - No valid session
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `SERVER_ERROR` - Internal server error

### Error Handling Example

```typescript
try {
  await authClient.signIn.magicLink({
    email: "user@example.com",
    callbackURL: "/dashboard",
  });
} catch (error) {
  if (error.message.includes("rate limit")) {
    console.error("Too many requests. Please wait.");
  } else {
    console.error("Login failed:", error.message);
  }
}
```

---

## Rate Limiting

### Magic Link Requests

- **Window**: 15 minutes (900,000ms)
- **Maximum**: 5 requests per email
- **Reset**: After window expires

### Implementation

Configured in `lib/auth.ts`:

```typescript
magicLink({
  rateLimit: {
    window: 15 * 60 * 1000,
    max: 5,
  },
})
```

---

## Authentication Flow

### Complete Flow Diagram

```
1. User enters email
   ↓
2. POST /api/auth/sign-in/magic-link
   ↓
3. Server generates token
   ↓
4. Email sent with magic link
   ↓
5. User clicks link
   ↓
6. GET /api/auth/magic-link/verify?token=...
   ↓
7. Token validated
   ↓
8. Session created
   ↓
9. Redirect to /dashboard
   ↓
10. GET /api/auth/get-session (automatic)
   ↓
11. User authenticated
```

---

## Security

### CSRF Protection

All state-changing operations (POST, PUT, DELETE) include CSRF protection via Better Auth.

### Session Security

- HTTP-only cookies
- Secure flag (HTTPS only)
- SameSite attribute
- Automatic expiration

### Token Security

- Cryptographically secure random tokens
- Single-use tokens
- Time-limited (15 minutes)
- Stored hashed in database

---

## Best Practices

### Client-Side API Calls

Use the auth client for all authentication operations:

```typescript
import { authClient } from "@/lib/auth-client";

// Good ✅
await authClient.signIn.magicLink({ email, callbackURL });

// Bad ❌ - Don't make raw fetch calls
fetch("/api/auth/sign-in/magic-link", { ... });
```

### Server-Side Data Fetching

Use Server Components and direct database access:

```typescript
// app/dashboard/page.tsx
import { db } from "@/lib/drizzle/connection";
import { proceedingTemplates } from "@/lib/drizzle/schema/case-schema";

export default async function DashboardPage() {
  // Direct database access in Server Component
  const templates = await db.select().from(proceedingTemplates);
  
  return <div>{/* Render templates */}</div>;
}
```

### Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await someOperation();
  toast.success("Operation successful");
} catch (error) {
  console.error("Operation failed:", error);
  toast.error("Something went wrong. Please try again.");
}
```

### Type Safety

Use TypeScript types for all API interactions:

```typescript
// Good ✅
const template: ProceedingTemplate = await fetchTemplate();

// Bad ❌
const template: any = await fetchTemplate();
```

---

## Testing

### Testing API Routes

```typescript
// Example test
describe("Magic Link API", () => {
  it("should send magic link", async () => {
    const response = await fetch("/api/auth/sign-in/magic-link", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        callbackURL: "/dashboard",
      }),
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

### Testing Services

```typescript
import { sendEmail } from "@/lib/services/email.service";

describe("Email Service", () => {
  it("should send email", async () => {
    await sendEmail(
      "test@example.com",
      "Test",
      ["Test message"]
    );
    // Verify email was sent
  });
});
```

---

## API Reference Summary

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-in/magic-link` | Request magic link |
| GET | `/api/auth/magic-link/verify` | Verify magic link |
| GET | `/api/auth/get-session` | Get current session |
| POST | `/api/auth/sign-out` | Sign out user |

### Server Actions

| Function | Location | Description |
|----------|----------|-------------|
| `logoutAction` | `app/dashboard/actions.ts` | Logout and redirect |

### Services

| Function | Location | Description |
|----------|----------|-------------|
| `sendEmail` | `lib/services/email.service.ts` | Send email via SMTP |
| `generateUUID` | `lib/services/uuid.service.ts` | Generate secure UUID |

---

## Future API Endpoints

Planned endpoints for future releases:

- Case management APIs
- User role management
- Document upload/management
- Search and filtering
- Reporting and analytics
- Audit logging
- Notification system

---

**Complete API documentation for building on Totolaw 📚**
