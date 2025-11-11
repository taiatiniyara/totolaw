# Development Guide

## Getting Started

### Prerequisites

- **Node.js:** v20.x or higher
- **PostgreSQL:** v14.x or higher
- **npm:** v10.x or higher
- **Git:** Latest version
- **Code Editor:** VS Code recommended

### Initial Setup

#### 1. Clone Repository

```bash
git clone https://github.com/taiatiniyara/totolaw.git
cd totolaw
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Setup Database

```bash
# Create PostgreSQL database
createdb totolaw

# Or using psql
psql -U postgres
CREATE DATABASE totolaw;
\q
```

#### 4. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local
```

**Development `.env.local`:**

```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3441

# Better Auth
BETTER_AUTH_URL=http://localhost:3441
BETTER_AUTH_SECRET=your-development-secret-min-32-chars

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/totolaw

# Email (Development - use Ethereal or Mailtrap)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ethereal-username
SMTP_PASS=your-ethereal-password
```

#### 5. Initialize Database

```bash
# Push schema to database
npm run db-push

# Verify with Drizzle Studio
npm run db-view
```

#### 6. Create Admin User

```bash
# Run setup script
npm run setup-admin
```

#### 7. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3441

### Development Tools

#### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Error Translator** - Better TS errors
- **Error Lens** - Inline error display
- **GitLens** - Git integration
- **Database Client** - PostgreSQL management

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Project Structure

### Key Directories

```
totolaw/
├── app/              # Next.js App Router
│   ├── api/         # API routes
│   ├── auth/        # Authentication pages
│   ├── dashboard/   # Main application
│   └── ...
├── components/      # React components
│   ├── ui/         # shadcn/ui components
│   ├── auth/       # Auth components
│   └── ...
├── lib/            # Core libraries
│   ├── drizzle/   # Database
│   ├── services/  # Business logic
│   └── ...
├── documentation/  # This documentation
└── ...
```

### File Naming Conventions

- **Pages:** `page.tsx` (Next.js convention)
- **Layouts:** `layout.tsx` (Next.js convention)
- **Components:** `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Utilities:** `kebab-case.ts` (e.g., `format-date.ts`)
- **Services:** `kebab-case.service.ts` (e.g., `email.service.ts`)
- **Actions:** `actions.ts` (Next.js convention)
- **Schemas:** `kebab-case-schema.ts` (e.g., `case-schema.ts`)

## Coding Standards

### TypeScript

#### Use Strict Types

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): User | null {
  // Implementation
}

// Bad
function getUser(id): any {
  // Implementation
}
```

#### Avoid `any`

```typescript
// Good
type UnknownObject = Record<string, unknown>;

// Acceptable when truly unknown
function parseJSON(str: string): unknown {
  return JSON.parse(str);
}

// Bad
function parseJSON(str: string): any {
  return JSON.parse(str);
}
```

#### Use Type Inference

```typescript
// Good
const user = await db.select().from(users);
// Type is inferred from Drizzle query

// Unnecessary
const user: User[] = await db.select().from(users);
```

### React Components

#### Server Components by Default

```typescript
// Good - Server Component
export default async function CasesPage() {
  const cases = await db.select().from(casesTable);
  
  return <div>{/* ... */}</div>;
}

// Use 'use client' only when needed
'use client';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### Component Structure

```typescript
// 1. Imports
import { db } from '@/lib/drizzle/connection';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface CaseCardProps {
  caseData: Case;
  onUpdate?: () => void;
}

// 3. Component
export function CaseCard({ caseData, onUpdate }: CaseCardProps) {
  // 4. Hooks (if client component)
  
  // 5. Handlers
  
  // 6. Effects (if client component)
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 8. Sub-components (if small and related)
```

#### Props Destructuring

```typescript
// Good
export function UserCard({ name, email, role }: UserCardProps) {
  return <div>{name}</div>;
}

// Avoid
export function UserCard(props: UserCardProps) {
  return <div>{props.name}</div>;
}
```

### Server Actions

#### Structure

```typescript
'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createCase(formData: FormData) {
  // 1. Authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { success: false, error: 'No organisation context' };
  }

  // 3. Authorization
  const hasPermission = await checkPermission(/*...*/);
  if (!hasPermission) {
    return { success: false, error: 'Permission denied' };
  }

  // 4. Validation
  const title = formData.get('title') as string;
  if (!title) {
    return { success: false, error: 'Title is required' };
  }

  // 5. Business logic
  try {
    const caseId = generateUUID();
    await db.insert(cases).values({
      id: caseId,
      organisationId: context.organisationId,
      title,
      createdBy: session.user.id,
    });

    // 6. Cache revalidation
    revalidatePath('/dashboard/cases');

    // 7. Return success
    return { success: true, data: { caseId } };
  } catch (error) {
    console.error('Error creating case:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

### Database Queries

#### Use Drizzle ORM

```typescript
// Good - Type-safe query
import { db } from '@/lib/drizzle/connection';
import { cases } from '@/lib/drizzle/schema/case-schema';
import { eq, and, desc } from 'drizzle-orm';

const userCases = await db
  .select()
  .from(cases)
  .where(
    and(
      eq(cases.organisationId, organisationId),
      eq(cases.status, 'active')
    )
  )
  .orderBy(desc(cases.createdAt));

// Bad - Raw SQL (avoid unless necessary)
const userCases = await db.execute(sql`
  SELECT * FROM cases WHERE organisation_id = ${organisationId}
`);
```

#### Always Filter by Organisation

```typescript
// Good
const cases = await db
  .select()
  .from(casesTable)
  .where(eq(casesTable.organisationId, organisationId));

// Bad - Missing organisation filter
const cases = await db.select().from(casesTable);
```

#### Use Transactions for Multiple Operations

```typescript
await db.transaction(async (tx) => {
  const caseId = generateUUID();
  
  await tx.insert(cases).values({ id: caseId, /* ... */ });
  await tx.insert(hearings).values({ caseId, /* ... */ });
  
  // Both succeed or both roll back
});
```

### Error Handling

#### Structured Error Responses

```typescript
// Good
return {
  success: false,
  error: 'User not found'
};

// Bad
throw new Error('User not found');  // Unless you want to crash
```

#### Try-Catch Blocks

```typescript
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

### Styling

#### Use Tailwind CSS

```typescript
// Good
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <Button className="bg-blue-600 hover:bg-blue-700">Submit</Button>
</div>

// Use cn() for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === 'primary' && "primary-classes"
)}>
  Content
</div>
```

#### Component Variants with CVA

```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Imports

#### Path Aliases

```typescript
// Good - Use @ alias
import { Button } from '@/components/ui/button';
import { db } from '@/lib/drizzle/connection';

// Bad - Relative paths
import { Button } from '../../../components/ui/button';
```

#### Import Order

```typescript
// 1. React/Next imports
import { useState } from 'react';
import { redirect } from 'next/navigation';

// 2. Third-party imports
import { toast } from 'sonner';

// 3. Local imports (alphabetical)
import { Button } from '@/components/ui/button';
import { db } from '@/lib/drizzle/connection';
import { formatDate } from '@/lib/utils';

// 4. Types
import type { Case } from '@/lib/drizzle/schema/case-schema';
```

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/case-export

# Make changes
# Test locally

# Commit changes
git add .
git commit -m "Add case export functionality"

# Push to remote
git push origin feature/case-export

# Create Pull Request
```

### 2. Database Changes

```bash
# Modify schema in lib/drizzle/schema/*.ts

# Push changes to database
npm run db-push

# Verify in Drizzle Studio
npm run db-view

# Test application
npm run dev
```

### 3. Testing Changes

```bash
# Start dev server
npm run dev

# Test in browser
# Check console for errors
# Test different scenarios
# Verify permissions
```

### 4. Code Review Checklist

- [ ] Code follows TypeScript standards
- [ ] Components are properly typed
- [ ] Server actions check authentication
- [ ] Server actions check permissions
- [ ] Database queries filter by organisation
- [ ] Error handling is implemented
- [ ] No console errors in browser
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation, ARIA labels)

## Debugging

### Server-Side Debugging

```typescript
// Add console.logs in server components/actions
console.log('User context:', context);
console.log('Query result:', cases);

// Check terminal output
// Logs appear in terminal where `npm run dev` is running
```

### Client-Side Debugging

```typescript
'use client';

// Use browser console
console.log('Component state:', state);

// React DevTools
// Install React Developer Tools extension
```

### Database Debugging

```bash
# View database in Drizzle Studio
npm run db-view

# Or use psql
psql -U postgres -d totolaw

# View tables
\dt

# Query data
SELECT * FROM users LIMIT 10;
```

### Network Debugging

```typescript
// Check Network tab in browser DevTools
// View request/response
// Check headers
// Check payload
```

## Testing

### Manual Testing

1. **Authentication Flow**
   - Test login with magic link
   - Test logout
   - Test session expiration

2. **RBAC Testing**
   - Test with different roles
   - Test permission gates
   - Test super admin access

3. **Multi-Tenancy**
   - Create multiple organisations
   - Switch between organisations
   - Verify data isolation

4. **Case Management**
   - Create, read, update, delete cases
   - Add hearings, evidence, documents
   - Test search functionality

### Test Email Functionality

```bash
# Use test email service
npm run test-email

# Or use Ethereal Email (https://ethereal.email)
# Create account, use credentials in .env.local
```

## Common Tasks

### Adding a New Page

```bash
# Create page file
mkdir -p app/dashboard/reports
touch app/dashboard/reports/page.tsx
```

```typescript
// app/dashboard/reports/page.tsx
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Reports</h1>
      {/* Content */}
    </div>
  );
}
```

### Adding a New API Route

```bash
# Create route file
mkdir -p app/api/reports
touch app/api/reports/route.ts
```

```typescript
// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Logic here

  return NextResponse.json({ success: true, data: [] });
}
```

### Adding a New Service

```bash
# Create service file
touch lib/services/report.service.ts
```

```typescript
// lib/services/report.service.ts
import { db } from '../drizzle/connection';

export async function generateReport(organisationId: string) {
  // Service logic
  return reportData;
}
```

### Adding a New Component

```bash
# Create component
touch components/report-card.tsx
```

```typescript
// components/report-card.tsx
interface ReportCardProps {
  title: string;
  data: any[];
}

export function ReportCard({ title, data }: ReportCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{title}</h3>
      {/* Render data */}
    </div>
  );
}
```

### Adding a shadcn/ui Component

```bash
# Add component from shadcn/ui
npx shadcn-ui@latest add table

# Component added to components/ui/table.tsx
# Import and use:
import { Table } from '@/components/ui/table';
```

## Best Practices

### 1. Security First
- Always validate user input
- Always check authentication
- Always check permissions
- Always filter by organisation

### 2. Type Safety
- Use TypeScript strictly
- Avoid `any` type
- Define interfaces for props
- Use Drizzle type inference

### 3. Performance
- Use Server Components when possible
- Minimize client JavaScript
- Lazy load heavy components
- Paginate large datasets

### 4. Code Organization
- Keep components small and focused
- Extract reusable logic to services
- Use consistent file structure
- Document complex logic

### 5. Error Handling
- Handle all error cases
- Provide meaningful error messages
- Log errors for debugging
- Never expose sensitive info in errors

### 6. Accessibility
- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Test with screen readers

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3441
lsof -i :3441

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3442
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in .env.local
# Test connection
psql -U postgres -d totolaw
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Type Errors

```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# Check tsconfig.json
# Verify imports are correct
```

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Better Auth Docs](https://www.better-auth.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Learning Resources
- [Next.js Learn](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Server Components](https://react.dev/reference/rsc/server-components)

---

**Next:** [Service Layer Documentation →](10-services.md)
