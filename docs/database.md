# Database Documentation

This document describes the database schema, tables, relationships, and data management for the Totolaw platform.

## Overview

Totolaw uses **PostgreSQL** as its relational database, accessed through **Drizzle ORM** for type-safe queries and schema management.

### Database Connection

- **ORM**: Drizzle ORM v0.44+
- **Driver**: node-postgres (pg)
- **Migration Tool**: Drizzle Kit
- **Connection Pooling**: Enabled by default

## Schema Organisation

Schemas are organized by domain:

```
lib/drizzle/schema/
├── auth-schema.ts      # Authentication tables (Better Auth)
├── case-schema.ts      # Case management tables
└── db-schema.ts        # Main schema exports
```

---

## Authentication Schema

### `user` Table

Stores user account information.

**Schema:**
```typescript
{
  id: text (primary key)
  name: text (nullable)
  email: text (unique, not null)
  emailVerified: boolean (not null)
  image: text (nullable)
  createdAt: timestamp (not null)
  updatedAt: timestamp (not null)
}
```

**Indexes:**
- Primary key on `id`
- Unique index on `email`

**Example Data:**
```json
{
  "id": "usr_abc123def456",
  "name": "Maria Tuisawau",
  "email": "maria@totolaw.org",
  "emailVerified": true,
  "image": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

**Queries:**
```typescript
import { db } from "@/lib/drizzle/connection";
import { user } from "@/lib/drizzle/schema/auth-schema";
import { eq } from "drizzle-orm";

// Find by email
const foundUser = await db
  .select()
  .from(user)
  .where(eq(user.email, "maria@totolaw.org"));

// Update user
await db
  .update(user)
  .set({ name: "Maria T." })
  .where(eq(user.id, "usr_abc123"));
```

---

### `session` Table

Manages active user sessions.

**Schema:**
```typescript
{
  id: text (primary key)
  userId: text (foreign key -> user.id)
  expiresAt: timestamp (not null)
  token: text (not null)
  ipAddress: text (nullable)
  userAgent: text (nullable)
}
```

**Relationships:**
- Many-to-one with `user` table

**Indexes:**
- Primary key on `id`
- Index on `userId`
- Index on `token`

**Example Data:**
```json
{
  "id": "ses_xyz789abc012",
  "userId": "usr_abc123def456",
  "expiresAt": "2024-01-27T10:30:00Z",
  "token": "tok_secure_random_string",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

**Automatic Cleanup:**
Expired sessions are automatically cleaned up by Better Auth.

---

### `account` Table

Stores external OAuth provider accounts (future use).

**Schema:**
```typescript
{
  id: text (primary key)
  userId: text (foreign key -> user.id)
  accountId: text (not null)
  providerId: text (not null)
  accessToken: text (nullable)
  refreshToken: text (nullable)
  expiresAt: timestamp (nullable)
}
```

**Relationships:**
- Many-to-one with `user` table

**Note:** Currently unused as Totolaw uses magic link authentication only.

---

### `verification` Table

Stores magic link tokens for authentication.

**Schema:**
```typescript
{
  id: text (primary key)
  identifier: text (not null) // email address
  value: text (not null)      // token
  expiresAt: timestamp (not null)
  createdAt: timestamp (not null)
}
```

**Indexes:**
- Primary key on `id`
- Index on `identifier`
- Index on `value`

**Example Data:**
```json
{
  "id": "ver_token123",
  "identifier": "maria@totolaw.org",
  "value": "hashed_token_value",
  "expiresAt": "2024-01-15T10:45:00Z",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Lifecycle:**
1. Token created when magic link requested
2. Token verified when user clicks link
3. Token deleted after use or expiration

---

## Case Management Schema

### `proceeding_templates` Table

Defines workflow templates for legal proceedings.

**Schema:**
```typescript
{
  id: text (primary key)
  name: varchar(100) (not null)
  description: text (nullable)
  steps: json (not null)        // Array of ProceedingStep objects
  createdBy: text (foreign key -> user.id)
  createdAt: timestamp (not null, default now)
}
```

**Step Object Structure:**
```typescript
interface ProceedingStep {
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
}
```

**Relationships:**
- Many-to-one with `user` table (creator)
- One-to-many with `proceeding_steps` table

**Example Data:**
```json
{
  "id": "tpl_criminal_001",
  "name": "Criminal Proceedings",
  "description": "Standard workflow for criminal cases",
  "steps": [
    {
      "title": "Investigation",
      "description": "Initial investigation phase",
      "order": 1,
      "isRequired": true
    },
    {
      "title": "Arrest",
      "description": "Suspect arrest and booking",
      "order": 2,
      "isRequired": true
    },
    {
      "title": "Trial",
      "description": "Court trial proceedings",
      "order": 3,
      "isRequired": true
    }
  ],
  "createdBy": "usr_abc123",
  "createdAt": "2024-01-10T09:00:00Z"
}
```

**Queries:**
```typescript
import { proceedingTemplates } from "@/lib/drizzle/schema/case-schema";

// Get all templates
const templates = await db
  .select()
  .from(proceedingTemplates)
  .orderBy(proceedingTemplates.name);

// Create template
await db.insert(proceedingTemplates).values({
  id: generateUUID(),
  name: "Civil Proceedings",
  description: "Civil case workflow",
  steps: [
    { title: "Filing", order: 1, isRequired: true },
    { title: "Discovery", order: 2, isRequired: false },
    { title: "Trial", order: 3, isRequired: true },
  ],
  createdBy: userId,
});
```

---

### `proceeding_steps` Table

Detailed workflow steps (alternative to JSON storage).

**Schema:**
```typescript
{
  id: text (primary key)
  templateId: text (foreign key -> proceeding_templates.id, not null)
  title: text (not null)
  description: text (nullable)
  order: integer (not null)
  isRequired: boolean (default true)
  createdBy: text (foreign key -> user.id)
  createdAt: timestamp (not null, default now)
}
```

**Relationships:**
- Many-to-one with `proceeding_templates` table
- Many-to-one with `user` table (creator)

**Indexes:**
- Primary key on `id`
- Index on `templateId`
- Index on `order`

**Example Data:**
```json
{
  "id": "stp_inv_001",
  "templateId": "tpl_criminal_001",
  "title": "Investigation",
  "description": "Initial investigation phase",
  "order": 1,
  "isRequired": true,
  "createdBy": "usr_abc123",
  "createdAt": "2024-01-10T09:00:00Z"
}
```

**Queries:**
```typescript
import { proceedingSteps } from "@/lib/drizzle/schema/case-schema";

// Get steps for a template
const steps = await db
  .select()
  .from(proceedingSteps)
  .where(eq(proceedingSteps.templateId, "tpl_criminal_001"))
  .orderBy(proceedingSteps.order);

// Join with template
const templatesWithSteps = await db
  .select()
  .from(proceedingTemplates)
  .leftJoin(
    proceedingSteps,
    eq(proceedingTemplates.id, proceedingSteps.templateId)
  );
```

---

## Entity Relationships

```
user (1) ----< (many) session
user (1) ----< (many) account
user (1) ----< (many) proceeding_templates
user (1) ----< (many) proceeding_steps

proceeding_templates (1) ----< (many) proceeding_steps
```

### ER Diagram

```
┌─────────────┐
│    user     │
│─────────────│
│ id (PK)     │
│ email       │
│ name        │
│ ...         │
└──────┬──────┘
       │
       │ (1:many)
       │
       ├──────────────────────────┐
       │                          │
       ▼                          ▼
┌─────────────┐        ┌──────────────────────┐
│   session   │        │ proceeding_templates │
│─────────────│        │──────────────────────│
│ id (PK)     │        │ id (PK)              │
│ userId (FK) │        │ name                 │
│ token       │        │ steps (JSON)         │
│ expiresAt   │        │ createdBy (FK)       │
└─────────────┘        └──────────┬───────────┘
                                  │
                                  │ (1:many)
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │  proceeding_steps    │
                       │──────────────────────│
                       │ id (PK)              │
                       │ templateId (FK)      │
                       │ title                │
                       │ order                │
                       └──────────────────────┘
```

---

## Database Configuration

### Connection

**File:** `lib/drizzle/connection.ts`

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

**Environment Variable:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/totolaw
```

### Drizzle Config

**File:** `lib/drizzle/config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/drizzle/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## Migrations

### Generate Migration

```bash
# Generate migration from schema changes
drizzle-kit generate:pg
```

### Push Schema (Development)

```bash
# Direct schema push (no migration files)
npm run db-push
```

This command:
1. Generates Better Auth schema
2. Moves auth schema to correct location
3. Pushes all schemas to database

### Apply Migration (Production)

```bash
# Apply generated migrations
drizzle-kit push:pg
```

---

## Data Management

### Seeding Data

Create seed script `scripts/seed.ts`:

```typescript
import { db } from "@/lib/drizzle/connection";
import { proceedingTemplates } from "@/lib/drizzle/schema/case-schema";
import { generateUUID } from "@/lib/services/uuid.service";

async function seed() {
  // Seed proceeding templates
  await db.insert(proceedingTemplates).values([
    {
      id: generateUUID(),
      name: "Criminal Proceedings",
      steps: [
        { title: "Investigation", order: 1, isRequired: true },
        { title: "Arrest", order: 2, isRequired: true },
        { title: "Trial", order: 3, isRequired: true },
      ],
    },
    {
      id: generateUUID(),
      name: "Civil Proceedings",
      steps: [
        { title: "Filing", order: 1, isRequired: true },
        { title: "Discovery", order: 2, isRequired: false },
        { title: "Trial", order: 3, isRequired: true },
      ],
    },
  ]);
  
  console.log("Seed completed!");
}

seed().catch(console.error);
```

Run:
```bash
tsx scripts/seed.ts
```

---

### Backup

#### Manual Backup

```bash
# Backup database
pg_dump -U totolaw_user totolaw > backup.sql

# Backup with compression
pg_dump -U totolaw_user totolaw | gzip > backup.sql.gz
```

#### Automated Backup Script

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/totolaw"

pg_dump -U totolaw_user totolaw | gzip > $BACKUP_DIR/totolaw_$DATE.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

---

### Restore

```bash
# Restore from backup
psql -U totolaw_user totolaw < backup.sql

# Restore from compressed backup
gunzip < backup.sql.gz | psql -U totolaw_user totolaw
```

---

## Query Examples

### Authentication Queries

#### Find User by Email
```typescript
const user = await db
  .select()
  .from(userTable)
  .where(eq(userTable.email, email))
  .limit(1);
```

#### Get Active Sessions
```typescript
const sessions = await db
  .select()
  .from(sessionTable)
  .where(gt(sessionTable.expiresAt, new Date()));
```

#### Clean Expired Sessions
```typescript
await db
  .delete(sessionTable)
  .where(lte(sessionTable.expiresAt, new Date()));
```

---

### Case Management Queries

#### Get All Templates
```typescript
const templates = await db
  .select()
  .from(proceedingTemplates)
  .orderBy(proceedingTemplates.name);
```

#### Get Template with Steps
```typescript
const template = await db
  .select()
  .from(proceedingTemplates)
  .leftJoin(
    proceedingSteps,
    eq(proceedingTemplates.id, proceedingSteps.templateId)
  )
  .where(eq(proceedingTemplates.id, templateId));
```

#### Create Template with Steps
```typescript
// Using JSON approach
await db.insert(proceedingTemplates).values({
  id: generateUUID(),
  name: "New Template",
  steps: [
    { title: "Step 1", order: 1, isRequired: true },
    { title: "Step 2", order: 2, isRequired: false },
  ],
  createdBy: userId,
});

// Using separate steps table
const [template] = await db
  .insert(proceedingTemplates)
  .values({
    id: generateUUID(),
    name: "New Template",
    steps: [],
    createdBy: userId,
  })
  .returning();

await db.insert(proceedingSteps).values([
  {
    id: generateUUID(),
    templateId: template.id,
    title: "Step 1",
    order: 1,
    isRequired: true,
  },
  {
    id: generateUUID(),
    templateId: template.id,
    title: "Step 2",
    order: 2,
    isRequired: false,
  },
]);
```

---

## Performance Optimization

### Indexes

**Current Indexes:**
- `user.email` (unique)
- `session.userId`
- `session.token`
- `verification.identifier`
- `proceeding_steps.templateId`

**Future Indexes:**
Consider adding indexes for:
- Frequently queried columns
- Foreign keys
- Columns used in WHERE clauses
- Columns used in ORDER BY

### Query Optimization

**Best Practices:**

1. **Use Select Specific Columns**
```typescript
// Good ✅
await db
  .select({ id: user.id, email: user.email })
  .from(user);

// Avoid ❌
await db.select().from(user);
```

2. **Use Limits**
```typescript
await db
  .select()
  .from(user)
  .limit(100);
```

3. **Use Prepared Statements**
```typescript
const getUserByEmail = db
  .select()
  .from(user)
  .where(eq(user.email, sql.placeholder("email")))
  .prepare();

await getUserByEmail.execute({ email: "user@example.com" });
```

---

## Data Validation

### Schema Validation

Use Drizzle's built-in validation:

```typescript
import { z } from "zod";

const proceedingStepSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  order: z.number().int().positive(),
  isRequired: z.boolean(),
});

const proceedingTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  steps: z.array(proceedingStepSchema),
});
```

### Input Sanitization

Always sanitize user input:

```typescript
import { sql } from "drizzle-orm";

// Use parameterized queries (automatic with Drizzle)
await db
  .select()
  .from(user)
  .where(eq(user.email, userInput)); // Safe ✅

// Never use raw SQL with user input
// await db.execute(sql`SELECT * FROM user WHERE email = '${userInput}'`); // Unsafe ❌
```

---

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to database

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check PostgreSQL is running: `sudo systemctl status postgresql`
3. Test connection: `psql -U totolaw_user -d totolaw`
4. Check firewall rules

### Migration Issues

**Problem:** Schema push fails

**Solutions:**
1. Check for syntax errors in schema files
2. Verify database permissions
3. Drop and recreate database (development only)
4. Review migration logs

### Performance Issues

**Problem:** Slow queries

**Solutions:**
1. Add appropriate indexes
2. Use EXPLAIN to analyze queries
3. Optimize N+1 queries with joins
4. Enable connection pooling
5. Add query caching

---

## Security Best Practices

1. **Never log sensitive data**
   - Don't log passwords, tokens, or session data
   - Sanitize logs before storing

2. **Use parameterized queries**
   - Always use Drizzle's query builder
   - Never concatenate user input into SQL

3. **Encrypt sensitive data**
   - Use PostgreSQL encryption for sensitive columns
   - Consider row-level security

4. **Limit database access**
   - Use principle of least privilege
   - Separate read/write users if needed

5. **Regular backups**
   - Automate daily backups
   - Test restore procedures
   - Store backups securely

---

## Future Schema Extensions

Planned tables for future releases:

- `cases` - Case management
- `documents` - Document storage metadata
- `roles` - User role definitions
- `permissions` - Access control
- `audit_logs` - Activity tracking
- `notifications` - User notifications
- `calendar_events` - Court dates and events

---

**Complete database documentation for Totolaw 🗄️**
