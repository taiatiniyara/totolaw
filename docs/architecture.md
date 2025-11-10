# Architecture

This document describes the technical architecture, design patterns, and technology stack of the Totolaw platform.

## System Overview

Totolaw is built as a modern, server-side rendered web application using the Next.js App Router architecture. The system follows a layered architecture pattern with clear separation of concerns.

```
┌─────────────────────────────────────────────────┐
│              Client Browser                     │
│  (React Components + Auth Client)               │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────────────┐
│           Next.js App Router                    │
│  ┌──────────────────────────────────────────┐  │
│  │   Server Components (RSC)                │  │
│  │   - Page rendering                       │  │
│  │   - Data fetching with org context       │  │
│  │   - Permission-based rendering           │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │   Client Components                      │  │
│  │   - Interactive UI                       │  │
│  │   - Form handling                        │  │
│  │   - Organization switcher                │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │   API Routes                             │  │
│  │   - /api/auth/* (Better Auth)            │  │
│  │   - /api/organization/* (Org switching)  │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │   Server Actions                         │  │
│  │   - Case management with permissions     │  │
│  │   - Organization switching               │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│          Business Logic Layer                   │
│  ┌──────────────────────────────────────────┐  │
│  │   Services                               │  │
│  │   - Tenant Service (org context)         │  │
│  │   - Authorization Service (RBAC)         │  │
│  │   - Email Service                        │  │
│  │   - UUID Service                         │  │
│  │   - Auth Service (Better Auth)           │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │   Utilities                              │  │
│  │   - Query helpers (org filtering)        │  │
│  │   - Permission guards                    │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│          Data Access Layer                      │
│  ┌──────────────────────────────────────────┐  │
│  │   Drizzle ORM                            │  │
│  │   - Query builder                        │  │
│  │   - Type-safe queries                    │  │
│  │   - Schema definitions                   │  │
│  │   - Organization-filtered queries        │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│          PostgreSQL Database                    │
│  - Multi-tenant data (organizationId)           │
│  - User accounts & sessions                     │
│  - Organizations & memberships                  │
│  - Roles, permissions, RBAC                     │
│  - Cases, hearings, evidence (multi-tenant)     │
│  - Audit logs                                   │
└─────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

**Framework:**
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5** - Type-safe JavaScript

**Styling:**
- **Tailwind CSS 4** - Utility-first CSS framework
- **tw-animate-css** - Tailwind animation utilities
- **PostCSS** - CSS processing

**UI Components:**
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Icon library
- **Vaul** - Drawer component
- **Sonner** - Toast notifications

**Component Library:**
- Alert Dialog
- Button
- Card
- Checkbox
- Dialog
- Dropdown Menu
- Input
- Label
- Select
- Sheet
- Spinner
- Textarea
- Toggle
- Tooltip

### Backend

**Framework:**
- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Type-safe server mutations

**Authentication:**
- **Better Auth 1.3** - Modern auth framework
- **Magic Link Plugin** - Passwordless authentication
- **Next.js Cookies** - Secure session management

**Database:**
- **PostgreSQL** - Relational database
- **Drizzle ORM 0.44** - Type-safe ORM
- **Drizzle Kit** - Schema migrations

**Email:**
- **Nodemailer 7** - Email sending library

**Utilities:**
- **class-variance-authority** - Component variants
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes

### Development Tools

**Code Quality:**
- **ESLint 9** - Linting
- **TypeScript** - Type checking
- **tsx** - TypeScript execution

**Build Tools:**
- **Next.js Compiler** - Rust-based bundler
- **Turbopack** - Fast bundler (optional)

**Deployment:**
- **PM2** - Production process manager

## Project Structure

```
totolaw/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   └── auth/           # Better Auth endpoints
│   │       └── [...all]/   
│   │           └── route.ts
│   ├── auth/               # Authentication pages
│   │   ├── actions.ts      # Server actions
│   │   ├── login/          # Login page
│   │   └── magic-link/     # Magic link verification
│   ├── dashboard/          # Dashboard pages
│   │   ├── actions.ts      # Server actions
│   │   ├── layout.tsx      # Dashboard layout
│   │   └── page.tsx        # Dashboard home
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── logo.tsx            # Logo component
│   └── submitButton.tsx    # Submit button
│
├── lib/                     # Shared utilities
│   ├── drizzle/            # Database layer
│   │   ├── schema/         # Database schemas
│   │   │   ├── auth-schema.ts    # Auth tables
│   │   │   ├── case-schema.ts    # Case tables
│   │   │   └── db-schema.ts      # Main schema
│   │   ├── config.ts       # Drizzle config
│   │   └── connection.ts   # DB connection
│   ├── services/           # Business logic
│   │   ├── email.service.ts
│   │   └── uuid.service.ts
│   ├── auth.ts             # Server auth config
│   ├── auth-client.ts      # Client auth config
│   └── utils.ts            # Utility functions
│
├── public/                  # Static assets
├── docs/                    # Documentation
├── components.json          # shadcn/ui config
├── next.config.ts          # Next.js config
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind config
├── postcss.config.mjs      # PostCSS config
├── eslint.config.mjs       # ESLint config
├── package.json            # Dependencies
└── .env.local              # Environment variables
```

## Design Patterns

### 1. Server Components First

Totolaw uses React Server Components (RSC) by default:

```typescript
// Server Component (default)
export default async function DashboardPage() {
  const data = await fetchData(); // Direct DB access
  return <div>{data}</div>;
}
```

Client Components only when needed:

```typescript
// Client Component (interactive)
"use client";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  // Interactive logic
}
```

**Benefits:**
- Reduced JavaScript bundle
- Direct database access
- Automatic code splitting
- Better performance

### 2. Server Actions with Permission Checks

Type-safe mutations using Server Actions with RBAC:

```typescript
// app/dashboard/cases/actions.ts
"use server";

export async function createCase(data: CreateCaseData) {
  const session = await auth.api.getSession();
  const context = await getUserTenantContext(session.user.id);
  
  // Check permission
  const canCreate = await hasPermission(
    session.user.id,
    context.organizationId,
    "cases:create"
  );
  
  if (!canCreate) {
    return { success: false, error: "Permission denied" };
  }
  
  // Create with organization context
  const caseId = await db.insert(cases).values({
    ...data,
    organizationId: context.organizationId
  });
  
  return { success: true, data: caseId };
}
```

**Benefits:**
- No API routes needed
- Type-safe
- Permission-checked at action level
- Organization context enforced
- Automatic revalidation

### 3. Colocation

Files are colocated with their features:

```
dashboard/
├── actions.ts    # Dashboard actions
├── layout.tsx    # Dashboard layout
└── page.tsx      # Dashboard page
```

**Benefits:**
- Easy to find related code
- Better organization
- Easier refactoring

### 4. Service Layer

Business logic isolated in services:

```typescript
// lib/services/tenant.service.ts
export async function getUserTenantContext(userId: string) {
  const user = await db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      memberships: {
        with: { organization: true }
      }
    }
  });
  
  return {
    organizationId: user.currentOrganizationId,
    userId: user.id,
    isSuperAdmin: user.isSuperAdmin
  };
}

// lib/services/authorization.service.ts
export async function hasPermission(
  userId: string,
  organizationId: string,
  permission: string
) {
  // Permission resolution logic
}
```

**Benefits:**
- Reusable logic
- Testable functions
- Clear boundaries
- Centralized RBAC logic

### 5. Schema-First Database

Database schema defined with Drizzle:

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  // ...
});
```

**Benefits:**
- Type-safe queries
- Auto-completion
- Migration generation
- Schema validation

## Data Flow

### Authentication Flow

```
User Input → Client Component → Auth Client
    ↓
Better Auth API → Server Action → Email Service
    ↓
SMTP Server → User Email → Magic Link
    ↓
Verification Page → Better Auth → Session Created
    ↓
Dashboard (Protected)
```

### Page Rendering Flow

```
Request → Next.js Router → Server Component
    ↓
Data Fetching (Drizzle ORM) → PostgreSQL
    ↓
Server-Side Rendering → HTML
    ↓
Hydration → Client Component (if needed)
    ↓
Response to Browser
```

### Form Submission Flow

```
Form Input → Client Component → Server Action
    ↓
Validation → Business Logic → Drizzle ORM
    ↓
Database Write → PostgreSQL
    ↓
Revalidation → Updated UI
```

## Database Schema

### Authentication Tables

**user** - User accounts
- id (primary key)
- email (unique)
- emailVerified
- name
- image
- createdAt / updatedAt

**session** - Active sessions
- id (primary key)
- userId (foreign key)
- expiresAt
- token
- ipAddress / userAgent

**account** - External accounts
- id (primary key)
- userId (foreign key)
- providerId
- accessToken / refreshToken

**verification** - Magic link tokens
- id (primary key)
- identifier (email)
- value (token)
- expiresAt

### Application Tables

**proceeding_templates** - Legal proceeding workflows
- id (primary key)
- name
- description
- steps (JSON array)
- createdBy / createdAt

**proceeding_steps** - Individual workflow steps
- id (primary key)
- templateId (foreign key)
- title / description
- order
- isRequired
- createdBy / createdAt

## Security Architecture

### Authentication Security

1. **Magic Link Tokens**
   - Cryptographically secure random tokens
   - Single-use only
   - Time-limited (15 minutes)
   - Stored hashed in database

2. **Session Management**
   - HTTP-only cookies
   - Secure flag (HTTPS only)
   - SameSite protection
   - Automatic expiration

3. **Rate Limiting**
   - 5 requests per 15 minutes per email
   - Prevents brute force attacks
   - IP-based tracking

### Data Security

1. **Database**
   - Parameterized queries (SQL injection protection)
   - Connection pooling
   - SSL/TLS encryption

2. **API Security**
   - CSRF protection
   - Origin validation
   - Request validation

3. **Environment Variables**
   - Secrets not in code
   - `.env.local` for local dev
   - Server-side only access

## Performance Optimizations

### Next.js Optimizations

1. **Server Components**
   - Zero JavaScript by default
   - Streaming SSR
   - Automatic code splitting

2. **Image Optimization**
   - Next.js Image component
   - Lazy loading
   - WebP conversion

3. **Font Optimization**
   - Automatic font optimization
   - Subset loading
   - Self-hosting

### Database Optimizations

1. **Connection Pooling**
   - Reuse connections
   - Configurable pool size
   - Automatic cleanup

2. **Query Optimization**
   - Indexed columns
   - Efficient joins
   - Query planning

3. **Caching**
   - Next.js data cache
   - Revalidation strategies
   - CDN caching

## Scalability Considerations

### Horizontal Scaling

- Stateless Next.js instances
- External session storage
- Load balancer ready
- CDN for static assets

### Database Scaling

- Read replicas for queries
- Connection pooling
- Query optimization
- Prepared statements

### Email Scaling

- Queue-based sending
- Multiple SMTP providers
- Retry logic
- Rate limiting

## Monitoring & Observability

### Application Monitoring

- Error logging
- Performance metrics
- User analytics
- Server logs

### Database Monitoring

- Query performance
- Connection pool stats
- Slow query log
- Index usage

### Email Monitoring

- Delivery rates
- Bounce tracking
- SMTP health
- Rate limit monitoring

## Development Workflow

### Local Development

```bash
npm run dev     # Start dev server
npm run lint    # Check code quality
npm run build   # Test production build
```

### Database Workflow

```bash
# Make schema changes
vim lib/drizzle/schema/*.ts

# Push changes to database
npm run db-push

# Generate migrations (if needed)
drizzle-kit generate:pg
```

### Component Development

```bash
# Add new shadcn/ui component
npx shadcn-ui@latest add [component]

# Custom components in components/
```

## Deployment Architecture

### Production Setup

```
Internet
    ↓
Load Balancer (SSL/TLS)
    ↓
Next.js Server (PM2)
    ↓
PostgreSQL Database
    ↓
SMTP Service
```

### Environment Separation

- **Development**: localhost:3441
- **Staging**: staging.totolaw.org
- **Production**: totolaw.org

## Best Practices

### Code Organization

- Use Server Components by default
- Client Components only for interactivity
- Colocate related files
- Keep components small and focused

### Type Safety

- Define types for all data
- Use TypeScript strict mode
- Validate inputs
- Type-safe database queries

### Error Handling

- Use try-catch blocks
- Show user-friendly errors
- Log errors for debugging
- Graceful degradation

### Testing Strategy

- Unit tests for utilities
- Integration tests for API
- E2E tests for critical flows
- Manual testing for UX

## Future Enhancements

### Planned Features

- Multi-tenant support
- Role-based access control
- Document management
- Calendar integration
- Notification system
- Audit logging

### Technical Improvements

- GraphQL API layer
- Real-time updates (WebSockets)
- Advanced caching
- Search functionality
- Export/import tools
- Mobile apps

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Built with modern architecture for Pacific Island Court Systems 🏗️**
