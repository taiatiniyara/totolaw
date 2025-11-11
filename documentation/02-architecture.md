# Architecture

## System Architecture Overview

Totolaw follows a **monolithic architecture** with clear separation of concerns, built on Next.js 16 with the App Router pattern. The system is designed for multi-tenancy with organisation-level data isolation.

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Client Browser                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │  React Components (UI Layer)                       │  │
│  │  - Pages, Layouts, Components                      │  │
│  │  - Client-side interactions                        │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP/HTTPS
┌───────────────────────┴──────────────────────────────────┐
│                Next.js Application Server                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  App Router (Server Components)                    │  │
│  │  - Server-side rendering                           │  │
│  │  - Data fetching                                   │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  API Routes                                        │  │
│  │  - /api/auth                                       │  │
│  │  - /api/organization                               │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Service Layer                                     │  │
│  │  - Authorization Service                           │  │
│  │  - Tenant Service                                  │  │
│  │  - Email Service                                   │  │
│  │  - Invitation Service                              │  │
│  │  - Join Request Service                            │  │
│  │  - System Admin Service                            │  │
│  │  - Transcript Service                              │  │
│  │  - Notification Service                            │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Data Access Layer (Drizzle ORM)                   │  │
│  │  - Schema definitions                              │  │
│  │  - Query builders                                  │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────┴──────────────────────────────────┐
│              PostgreSQL Database                          │
│  - User data                                              │
│  - Organisation data                                      │
│  - Cases, hearings, evidence                              │
│  - RBAC data (roles, permissions)                         │
│  - Audit logs                                             │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              External Services                             │
│  - SMTP Server (Email delivery)                           │
└───────────────────────────────────────────────────────────┘
```

## Architectural Patterns

### 1. Multi-Tenant Design

**Strategy:** Shared Database with Tenant Isolation

Every table that contains tenant-specific data includes an `organisationId` column. All queries are automatically scoped to the user's current organisation context.

**Key Features:**
- Single database instance
- Organisation-level data isolation
- Row-level security via application logic
- Super admins can access all organisations

### 2. Service Layer Pattern

Business logic is encapsulated in service modules:
- **Separation of Concerns:** UI logic separated from business logic
- **Reusability:** Services can be used across multiple routes
- **Testability:** Services can be unit tested independently
- **Maintainability:** Centralized business rules

### 3. Server Components First

Leverages Next.js 16 App Router features:
- **Server Components:** Default rendering strategy
- **Client Components:** Only when interactivity needed
- **Server Actions:** For form submissions and mutations
- **Streaming:** Progressive rendering for better UX

### 4. Repository Pattern (via Drizzle ORM)

Data access abstracted through Drizzle ORM:
- **Type Safety:** Full TypeScript support
- **Query Building:** Composable, type-safe queries
- **Migration Management:** Version-controlled schema changes
- **Connection Pooling:** Efficient database connections

## Folder Structure

```
/root/totolaw/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   └── [...all]/route.ts # Better Auth handler
│   │   └── organization/         # Organization APIs
│   │       ├── list/route.ts     # List user's organisations
│   │       └── switch/route.ts   # Switch organisation context
│   ├── auth/                     # Auth-related pages
│   │   ├── actions.ts            # Auth server actions
│   │   ├── login/                # Login page
│   │   ├── magic-link/           # Magic link verification
│   │   └── accept-invitation/    # Invitation acceptance
│   ├── dashboard/                # Main app dashboard
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── actions.ts            # Dashboard actions
│   │   ├── cases/                # Case management
│   │   ├── hearings/             # Hearing management
│   │   ├── evidence/             # Evidence management
│   │   ├── documents/            # Document management
│   │   ├── users/                # User management
│   │   ├── settings/             # Organisation settings
│   │   ├── system-admin/         # System admin panel
│   │   ├── search/               # Global search
│   │   ├── help/                 # Help pages
│   │   ├── access-denied/        # Access denied page
│   │   ├── no-organisation/      # No org page
│   │   └── user-status/          # User status page
│   ├── organisations/            # Organisation browsing
│   │   ├── page.tsx              # List organisations
│   │   ├── actions.ts            # Organisation actions
│   │   └── join/                 # Join request flow
│   ├── docs/                     # User documentation
│   │   ├── page.tsx              # Docs home
│   │   ├── getting-started/      # Getting started guide
│   │   ├── cases/                # Case docs
│   │   ├── hearings/             # Hearing docs
│   │   ├── evidence/             # Evidence docs
│   │   └── faq/                  # FAQ
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...                   # Other UI components
│   ├── auth/                     # Auth components
│   │   ├── permission-gate.tsx   # Permission checking
│   │   ├── role-gate.tsx         # Role checking
│   │   ├── protected-route.tsx   # Route protection
│   │   └── manage-user-roles-dialog.tsx
│   ├── common/                   # Shared components
│   │   ├── page-header.tsx
│   │   ├── empty-state.tsx
│   │   ├── data-row.tsx
│   │   ├── info-card.tsx
│   │   └── ...
│   ├── forms/                    # Form components
│   │   ├── form-field.tsx
│   │   └── form-actions.tsx
│   ├── calendar-view.tsx         # Calendar component
│   ├── organisation-switcher.tsx # Org switcher
│   ├── organisation-hierarchy.tsx
│   ├── transcript-viewer.tsx
│   ├── manual-transcription-editor.tsx
│   └── ...                       # Other components
│
├── lib/                          # Core libraries
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Client-side auth
│   ├── utils.ts                  # Utility functions
│   │
│   ├── drizzle/                  # Database layer
│   │   ├── config.ts             # Drizzle config
│   │   ├── connection.ts         # DB connection
│   │   └── schema/               # Database schemas
│   │       ├── auth-schema.ts    # Auth tables
│   │       ├── organisation-schema.ts
│   │       ├── rbac-schema.ts    # Roles & permissions
│   │       ├── case-schema.ts    # Case management
│   │       ├── transcript-schema.ts
│   │       ├── system-admin-schema.ts
│   │       └── db-schema.ts      # Schema exports
│   │
│   ├── services/                 # Business logic services
│   │   ├── authorization.service.ts
│   │   ├── tenant.service.ts
│   │   ├── email.service.ts
│   │   ├── email-templates.service.ts
│   │   ├── invitation.service.ts
│   │   ├── join-request.service.ts
│   │   ├── system-admin.service.ts
│   │   ├── transcript.service.ts
│   │   ├── notification.service.ts
│   │   └── uuid.service.ts
│   │
│   ├── middleware/               # Middleware functions
│   │   └── super-admin.middleware.ts
│   │
│   └── utils/                    # Utility modules
│
├── migrations/                   # Database migrations
│   ├── 002_simplify_system_admin.sql
│   └── 003_add_organisation_join_requests.sql
│
├── scripts/                      # Utility scripts
│   ├── setup-admin.ts            # Admin management CLI
│   ├── test-email.ts             # Email testing
│   └── README.md
│
├── public/                       # Static assets
│   └── ...
│
├── documentation/                # Technical documentation
│   └── ...                       # (This documentation)
│
├── components.json               # shadcn/ui config
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── postcss.config.mjs            # PostCSS config
├── eslint.config.mjs             # ESLint config
├── package.json                  # Dependencies
└── .env.local                    # Environment variables
```

## Design Patterns

### 1. Component Composition

```typescript
// Compound component pattern
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### 2. Server Actions

```typescript
// app/dashboard/actions.ts
'use server';

export async function createCase(formData: FormData) {
  // Validation
  // Authentication check
  // Tenant context
  // Database operation
  // Return result
}
```

### 3. Service Injection

```typescript
// Service usage in server components/actions
import { getUserPermissions } from '@/lib/services/authorization.service';
import { getUserTenantContext } from '@/lib/services/tenant.service';

const context = await getUserTenantContext(userId);
const permissions = await getUserPermissions(userId, context.organisationId);
```

### 4. Type-Safe Database Queries

```typescript
// Using Drizzle ORM
const cases = await db
  .select()
  .from(casesTable)
  .where(
    and(
      eq(casesTable.organisationId, orgId),
      eq(casesTable.status, 'active')
    )
  );
```

## Data Flow

### 1. User Request Flow

```
User Action
    ↓
Client Component (if interactive)
    ↓
Server Action / API Route
    ↓
Authentication Check (Better Auth)
    ↓
Tenant Context Resolution (tenant.service.ts)
    ↓
Authorization Check (authorization.service.ts)
    ↓
Service Layer (business logic)
    ↓
Data Access Layer (Drizzle ORM)
    ↓
PostgreSQL Database
    ↓
Response back up the chain
```

### 2. Authentication Flow

```
1. User enters email → login form
2. Server generates magic link → Better Auth
3. Email sent → email.service.ts → SMTP
4. User clicks link → magic-link callback
5. Token validated → Better Auth
6. Session created → cookies set
7. User redirected → dashboard
```

### 3. Authorization Flow

```
1. User accesses protected resource
2. Session validated → Better Auth
3. User context loaded → tenant.service.ts
4. Permissions fetched → authorization.service.ts
5. Permission check → hasPermission()
6. Grant or deny access
```

## Security Architecture

### Layers of Security

1. **Transport Layer:** HTTPS/TLS encryption
2. **Authentication Layer:** Magic link + session tokens
3. **Authorization Layer:** RBAC + permissions
4. **Data Layer:** Organisation-scoped queries
5. **Input Layer:** Validation and sanitization
6. **Audit Layer:** Complete activity logging

### Defense in Depth

```
Public Internet
    ↓ [Firewall]
Load Balancer / Reverse Proxy
    ↓ [SSL/TLS]
Next.js Application
    ↓ [Authentication]
    ↓ [Authorization]
    ↓ [Input Validation]
    ↓ [Tenant Filtering]
Database
    ↓ [Audit Logging]
```

## Scalability Considerations

### Horizontal Scaling
- Next.js app can run in PM2 cluster mode
- Stateless architecture (session in cookies/DB)
- Database connection pooling

### Vertical Scaling
- Efficient queries with indexes
- Pagination for large datasets
- Lazy loading and code splitting

### Caching Strategy
- Server components cache by default
- `revalidatePath()` for cache invalidation
- Future: Redis for session/query caching

## Performance Optimization

1. **Server Components:** Reduce client JavaScript
2. **Streaming:** Progressive page rendering
3. **Database Indexes:** Fast query performance
4. **Pagination:** Limit data transferred
5. **Code Splitting:** Dynamic imports
6. **Image Optimization:** Next.js Image component

## Monitoring & Observability

### Logging
- **Application Logs:** Console logs (production: file/service)
- **Audit Logs:** Database-stored audit trail
- **Error Logs:** Uncaught exceptions logged

### Metrics (Future)
- Response times
- Database query performance
- Error rates
- User activity

### Health Checks
- Database connectivity
- Email service status
- Application uptime

---

**Next:** [Database Schema →](03-database-schema.md)
