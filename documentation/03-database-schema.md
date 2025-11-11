# Database Schema

## Overview

Totolaw uses PostgreSQL as its primary database, with Drizzle ORM providing type-safe database access. The schema is designed around multi-tenancy, with organisation-level isolation for all tenant-specific data.

## Schema Organization

The database schema is organized into the following modules:

1. **Authentication Schema** - User accounts and sessions
2. **Organisation Schema** - Organisations, memberships, invitations, join requests
3. **RBAC Schema** - Roles, permissions, and assignments
4. **Case Schema** - Legal cases and related entities
5. **Transcript Schema** - Court proceeding transcriptions
6. **System Admin Schema** - System-level audit logging

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │◄─────────────────┐
└──────┬──────┘                  │
       │                         │
       │ 1:N                     │ 1:N
       ▼                         │
┌──────────────────┐             │
│ OrganisationMember│             │
└──────┬───────────┘             │
       │ N:1                     │
       ▼                         │
┌──────────────┐                 │
│ Organisation │                 │
└──────┬───────┘                 │
       │                         │
       │ 1:N                     │
       ▼                         │
┌──────────────┐                 │
│    Role      │                 │
└──────┬───────┘                 │
       │                         │
       │ N:M (via UserRole)      │
       └─────────────────────────┘

┌──────────────┐     N:M     ┌──────────────┐
│     Role     │◄───────────►│  Permission  │
└──────────────┘             └──────────────┘
     (via RolePermission)

┌──────────────┐     1:N     ┌──────────────┐
│ Organisation │────────────►│    Case      │
└──────────────┘             └──────┬───────┘
                                    │ 1:N
                                    ▼
                             ┌──────────────┐
                             │   Hearing    │
                             └──────┬───────┘
                                    │ 1:N
                                    ▼
                             ┌──────────────┐
                             │   Evidence   │
                             └──────────────┘
```

## Core Tables

### Authentication Tables

#### `user`
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| name | text | User's full name |
| email | text | Email address (unique) |
| emailVerified | boolean | Email verification status |
| image | text | Profile image URL |
| currentOrganisationId | text | User's active organisation |
| isSuperAdmin | boolean | System administrator flag |
| adminNotes | text | Notes about admin status |
| adminAddedBy | text | FK to user who granted admin |
| adminAddedAt | timestamp | When admin access was granted |
| lastLogin | timestamp | Last login timestamp |
| createdAt | timestamp | Account creation time |
| updatedAt | timestamp | Last update time |

**Indexes:**
- Unique on `email`
- Index on `currentOrganisationId`

#### `session`
Manages user sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| userId | text | FK to user |
| token | text | Session token (unique) |
| expiresAt | timestamp | Session expiration |
| ipAddress | text | IP address of session |
| userAgent | text | Browser user agent |
| createdAt | timestamp | Session creation |
| updatedAt | timestamp | Last update |

**Indexes:**
- Unique on `token`
- Index on `userId`

#### `account`
OAuth and authentication provider data (used by Better Auth).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| userId | text | FK to user |
| accountId | text | Provider account ID |
| providerId | text | Provider identifier |
| accessToken | text | OAuth access token |
| refreshToken | text | OAuth refresh token |
| idToken | text | OAuth ID token |
| accessTokenExpiresAt | timestamp | Token expiration |
| refreshTokenExpiresAt | timestamp | Refresh token expiration |
| scope | text | OAuth scope |
| password | text | Hashed password (if applicable) |
| createdAt | timestamp | Account link time |
| updatedAt | timestamp | Last update |

#### `verification`
Email verification and magic link tokens.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| identifier | text | Email or identifier |
| value | text | Verification token |
| expiresAt | timestamp | Token expiration |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

#### `rate_limit`
Rate limiting tracking (prevents abuse).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| key | text | Rate limit key (IP, email, etc.) |
| count | integer | Request count |
| lastRequest | bigint | Timestamp of last request |

### Organisation Tables

#### `organisations`
Court systems and organisational entities.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| name | text | Organisation name (e.g., "Fiji High Court") |
| code | varchar(10) | Organisation code (e.g., "FJ") |
| type | varchar(50) | Type: "country", "province", "district" |
| description | text | Organisation description |
| parentId | text | FK to parent organisation (hierarchy) |
| isActive | boolean | Active status |
| settings | text | JSON settings |
| createdBy | text | FK to user who created |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Indexes:**
- Unique on `code`
- Index on `parentId`
- Index on `isActive`

#### `organisation_members`
User membership in organisations.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| userId | text | FK to user |
| isPrimary | boolean | User's primary organisation |
| isActive | boolean | Active membership |
| joinedAt | timestamp | Join date |
| leftAt | timestamp | Leave date (if applicable) |
| addedBy | text | FK to user who added |
| createdAt | timestamp | Record creation |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(organisationId, userId)`

**Indexes:**
- Index on `organisationId`
- Index on `userId`
- Composite index on `(userId, isPrimary)`
- Index on `isActive`

#### `organisation_invitations`
Admin-initiated user invitations.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| email | text | Invitee email address |
| roleId | text | Pre-assigned role (optional) |
| token | text | Unique invitation token |
| status | varchar(20) | Status: "pending", "accepted", "expired", "revoked" |
| invitedBy | text | FK to user who invited |
| acceptedBy | text | FK to user who accepted |
| expiresAt | timestamp | Invitation expiration |
| acceptedAt | timestamp | Acceptance timestamp |
| revokedAt | timestamp | Revocation timestamp |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Indexes:**
- Unique on `token`
- Index on `organisationId`
- Index on `email`
- Index on `status`

#### `organisation_join_requests`
User-initiated organisation join requests.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| userId | text | FK to requesting user |
| status | varchar(20) | Status: "pending", "approved", "rejected" |
| message | text | Optional message from user |
| reviewedBy | text | FK to reviewing admin |
| reviewedAt | timestamp | Review timestamp |
| rejectionReason | text | Reason for rejection |
| createdAt | timestamp | Request time |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(userId, organisationId)` to prevent duplicate pending requests

**Indexes:**
- Index on `organisationId`
- Index on `userId`
- Index on `status`

### RBAC Tables

#### `roles`
Organisation-specific roles.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| name | varchar(100) | Role display name |
| slug | varchar(100) | Role identifier (e.g., "judge") |
| description | text | Role description |
| isSystem | boolean | System role (cannot delete) |
| isActive | boolean | Active status |
| createdBy | text | FK to creator |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(organisationId, slug)`

**Indexes:**
- Index on `organisationId`
- Index on `slug`
- Index on `isSystem`
- Index on `isActive`

#### `permissions`
System-wide permissions (resource:action format).

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| resource | varchar(100) | Resource (e.g., "cases") |
| action | varchar(50) | Action (e.g., "create", "read") |
| slug | varchar(150) | Full permission slug (e.g., "cases:create") |
| description | text | Permission description |
| isSystem | boolean | System permission |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Indexes:**
- Unique on `slug`
- Index on `resource`
- Index on `action`
- Index on `isSystem`

#### `role_permissions`
Maps permissions to roles.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| roleId | text | FK to role |
| permissionId | text | FK to permission |
| conditions | text | JSON conditional rules |
| createdBy | text | FK to creator |
| createdAt | timestamp | Creation time |

**Constraints:**
- Unique constraint on `(roleId, permissionId)`

**Indexes:**
- Index on `roleId`
- Index on `permissionId`

#### `user_roles`
Assigns roles to users in organisations.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| userId | text | FK to user |
| roleId | text | FK to role |
| organisationId | text | FK to organisation |
| scope | text | JSON scope restrictions |
| isActive | boolean | Active assignment |
| assignedBy | text | FK to assigner |
| assignedAt | timestamp | Assignment time |
| expiresAt | timestamp | Optional expiration |
| revokedAt | timestamp | Revocation time |
| revokedBy | text | FK to revoker |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Constraints:**
- Unique constraint on `(userId, roleId, organisationId)`

**Indexes:**
- Index on `userId`
- Index on `roleId`
- Index on `organisationId`
- Index on `isActive`
- Composite index on `(userId, organisationId)`

#### `user_permissions`
Direct permission grants/denies to users.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| userId | text | FK to user |
| permissionId | text | FK to permission |
| organisationId | text | FK to organisation |
| granted | boolean | True = grant, False = deny |
| conditions | text | JSON conditional rules |
| scope | text | JSON scope restrictions |
| assignedBy | text | FK to assigner |
| assignedAt | timestamp | Assignment time |
| expiresAt | timestamp | Optional expiration |
| revokedAt | timestamp | Revocation time |
| revokedBy | text | FK to revoker |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update |

**Indexes:**
- Index on `userId`
- Index on `permissionId`
- Index on `organisationId`
- Index on `granted`
- Composite index on `(userId, organisationId)`

#### `rbac_audit_log`
Audit trail for RBAC changes.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| entityType | varchar(50) | Type: "role", "permission", "user_role", etc. |
| entityId | text | ID of affected entity |
| action | varchar(50) | Action: "created", "updated", "deleted", etc. |
| performedBy | text | FK to user who performed action |
| targetUserId | text | FK to affected user |
| changes | text | JSON before/after values |
| metadata | text | JSON additional context |
| ipAddress | text | IP address |
| userAgent | text | Browser user agent |
| createdAt | timestamp | Action time |

**Indexes:**
- Index on `organisationId`
- Composite index on `(entityType, entityId)`
- Index on `performedBy`
- Index on `targetUserId`
- Index on `createdAt`

### Case Management Tables

*(Note: Full case schema tables are defined but not detailed here for brevity. Key tables include:)*

- `cases` - Legal case records
- `hearings` - Court hearing schedules
- `evidence` - Evidence items
- `documents` - Case documents
- `verdicts` - Case outcomes
- `sentences` - Sentencing information
- `appeals` - Appeal records

All case-related tables include `organisationId` for tenant isolation.

### Transcript Tables

#### `proceeding_templates`
Templates for court proceedings.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| name | varchar(100) | Template name |
| description | text | Template description |
| steps | json | Array of proceeding steps |
| createdBy | text | FK to creator |
| createdAt | timestamp | Creation time |

#### `proceeding_steps`
Individual steps in proceeding templates.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| organisationId | text | FK to organisation |
| templateId | text | FK to template |
| title | text | Step title |
| description | text | Step description |
| order | integer | Step sequence number |
| isRequired | boolean | Required step flag |
| createdBy | text | FK to creator |
| createdAt | timestamp | Creation time |

### System Admin Tables

#### `system_admin_audit_log`
System-level administrative actions.

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (UUID) |
| userId | text | FK to admin user |
| action | varchar(100) | Action performed |
| entityType | varchar(50) | Entity type affected |
| entityId | text | Entity ID |
| description | text | Action description |
| metadata | text | JSON additional details |
| ipAddress | text | IP address |
| userAgent | text | Browser user agent |
| createdAt | timestamp | Action time |

**Indexes:**
- Index on `userId`
- Index on `action`
- Composite index on `(entityType, entityId)`
- Index on `createdAt`

## Data Types

### UUID Generation
All primary keys use UUIDs generated by the `uuid.service.ts`:
```typescript
import { v7 as uuidv7 } from 'uuid';
export const generateUUID = () => uuidv7();
```

### JSON Fields
Several fields store JSON data as text:
- `organisations.settings` - Organisation configuration
- `roles.scope`, `permissions.conditions` - Access control rules
- `*_audit_log.changes`, `*.metadata` - Structured metadata

### Timestamps
All tables include:
- `createdAt` - Set on insert
- `updatedAt` - Auto-updated on modification (via `$onUpdate`)

## Indexing Strategy

### Primary Indexes
- All primary keys have implicit unique indexes
- Foreign keys have explicit indexes for join performance

### Composite Indexes
- `(userId, organisationId)` - User-organisation queries
- `(entityType, entityId)` - Audit log lookups

### Unique Constraints
- Prevent duplicate data (e.g., one pending join request per user-org pair)
- Enforce business rules at database level

## Migration Strategy

### Migration Files
Located in `/migrations/` directory:
- SQL files with incremental numbers
- `002_simplify_system_admin.sql`
- `003_add_organisation_join_requests.sql`

### Applying Migrations
```bash
npm run db-push  # Push schema changes
npm run db-view  # View database in Drizzle Studio
```

### Migration Best Practices
1. Never modify existing migrations
2. Create new migration files for changes
3. Test migrations on staging first
4. Backup database before production migrations

## Data Integrity

### Foreign Key Cascades
- `ON DELETE CASCADE` - Child records deleted with parent
- `ON DELETE SET NULL` - FK set to null on parent deletion

### Soft Deletes
Many tables use status flags instead of hard deletes:
- `isActive` boolean fields
- `revokedAt` timestamps
- Preserves audit trail and historical data

### Constraints
- Unique constraints enforce business rules
- Check constraints could be added for validation
- NOT NULL constraints prevent incomplete data

## Performance Considerations

### Query Optimization
- Indexes on frequently queried columns
- Composite indexes for common join patterns
- Pagination for large result sets

### Connection Pooling
Drizzle ORM manages connection pool:
```typescript
// lib/drizzle/connection.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

### Monitoring
- Slow query logging
- Connection pool metrics
- Index usage statistics

---

**Next:** [Authentication & Authorization →](04-auth-and-security.md)
