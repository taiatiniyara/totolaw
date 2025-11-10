# Technical Implementation Roadmap

## 🎯 Overview

This document provides a detailed technical breakdown of implementation tasks, organized by feature area and priority. Use this alongside the Production Roadmap for comprehensive planning.

---

## Priority Legend

- 🔴 **P0 - Critical**: Must have for MVP
- 🟠 **P1 - High**: Important for launch
- 🟡 **P2 - Medium**: Nice to have
- 🟢 **P3 - Low**: Future enhancement

---

## 1. Multi-Tenant RBAC Implementation

### 1.1 Database Setup 🔴 P0

**Estimated Time**: 2-3 days

- [x] Create organization schema
- [x] Create RBAC schema
- [x] Update existing schemas with organizationId
- [ ] Push schema changes to database
  ```bash
  npm run db-push
  ```
- [ ] Run migration script
  ```bash
  psql $DATABASE_URL -f migrations/001_setup_multi_tenant_rbac.sql
  ```
- [ ] Verify database structure
  ```sql
  \dt -- list all tables
  SELECT * FROM organizations;
  SELECT * FROM roles;
  SELECT * FROM permissions;
  ```
- [ ] Create backup strategy
- [ ] Document rollback procedure

**Deliverables**:
- Database with all new tables
- Organizations created
- Roles and permissions configured
- Data migration completed

---

### 1.2 Service Layer Integration 🔴 P0

**Estimated Time**: 3-4 days

#### Tenant Service
- [x] Create tenant.service.ts
- [ ] Test getUserTenantContext()
- [ ] Test verifyUserOrganizationAccess()
- [ ] Test getUserOrganizations()
- [ ] Test switchUserOrganization()
- [ ] Add error handling
- [ ] Add logging
- [ ] Write unit tests

#### Authorization Service
- [x] Create authorization.service.ts
- [x] Fix TypeScript errors
- [ ] Test getUserPermissions()
- [ ] Test hasPermission()
- [ ] Test hasAnyPermission()
- [ ] Test hasAllPermissions()
- [ ] Test hasRole()
- [ ] Test assignRole()
- [ ] Test revokeRole()
- [ ] Add permission caching
- [ ] Write unit tests

**Deliverables**:
- Working tenant context extraction
- Permission checking functional
- Role assignment working
- Unit tests passing

---

### 1.3 Query Updates 🔴 P0

**Estimated Time**: 2-3 days

Update all database queries to include organization filter:

- [ ] Case queries
  ```typescript
  where: and(
    eq(cases.organizationId, context.organizationId),
    // ... other conditions
  )
  ```
- [ ] Evidence queries
- [ ] Hearing queries
- [ ] Trial queries
- [ ] Sentence queries
- [ ] Appeal queries
- [ ] Enforcement queries
- [ ] Template queries
- [ ] User queries (for admins)

**Testing**:
- [ ] Create test users in different orgs
- [ ] Verify data isolation
- [ ] Test cross-org access denial
- [ ] Performance test with filters

**Deliverables**:
- All queries use organization context
- Data isolation verified
- No cross-org data leaks

---

## 2. Core UI Components

### 2.1 Layout & Navigation 🔴 P0

**Estimated Time**: 3-4 days

#### Dashboard Layout
```tsx
// app/dashboard/layout.tsx
- [ ] Create sidebar navigation
- [ ] Add organization switcher
- [ ] Add user menu
- [ ] Add breadcrumbs
- [ ] Mobile responsive menu
- [ ] Loading states
```

**Components to Create**:
- `components/layout/sidebar.tsx`
- `components/layout/header.tsx`
- `components/organization-switcher.tsx`
- `components/user-menu.tsx`
- `components/breadcrumbs.tsx`

**Features**:
- [ ] Active route highlighting
- [ ] Collapsible sidebar
- [ ] Mobile hamburger menu
- [ ] Organization dropdown
- [ ] User profile dropdown

**Deliverables**:
- Professional dashboard layout
- Responsive navigation
- Organization switching UI

---

### 2.2 Permission Guards 🔴 P0

**Estimated Time**: 1-2 days

#### Protected Route Component
```tsx
// components/auth/protected-route.tsx
export async function ProtectedRoute({ 
  children, 
  requiredPermission 
}: Props) {
  const session = await auth.api.getSession();
  const context = await getUserTenantContext(session.user.id);
  const hasAccess = await hasPermission(
    session.user.id, 
    context.organizationId, 
    requiredPermission
  );
  
  if (!hasAccess) return <AccessDenied />;
  return children;
}
```

**Components**:
- [ ] `<ProtectedRoute>` - Page-level protection
- [ ] `<PermissionGate>` - Component-level protection
- [ ] `<RoleGate>` - Role-based visibility
- [ ] `<AccessDenied>` - Error page
- [ ] `<NoOrganization>` - No org access page

**Deliverables**:
- Permission guards implemented
- Access denial handled gracefully
- User-friendly error messages

---

### 2.3 Form Components 🟠 P1

**Estimated Time**: 3-4 days

#### Base Form Components
- [ ] Input component with validation
- [ ] Select component
- [ ] Textarea component
- [ ] Date picker
- [ ] File upload component
- [ ] Checkbox/Radio components
- [ ] Form wrapper with error handling
- [ ] Submit button with loading state

#### Form Utilities
```typescript
// lib/utils/form-validation.ts
- [ ] Validation helpers
- [ ] Error message formatter
- [ ] Form state management
```

**Deliverables**:
- Reusable form components
- Consistent validation
- Good UX (loading, errors, success)

---

## 3. Case Management Features

### 3.1 Case List & Search 🔴 P0

**Estimated Time**: 3-4 days

#### Case List Page
```tsx
// app/dashboard/cases/page.tsx
- [ ] Table with cases
- [ ] Sorting by columns
- [ ] Filtering by status
- [ ] Search by title/ID
- [ ] Pagination
- [ ] Bulk actions (optional)
- [ ] Export to CSV (optional)
```

**Features**:
- [ ] Status badges with colors
- [ ] Assigned judge display
- [ ] Created date display
- [ ] Quick actions (view, edit)
- [ ] Empty state
- [ ] Loading skeleton

**Deliverables**:
- Functional case list
- Search working
- Good performance with many cases

---

### 3.2 Case Details 🔴 P0

**Estimated Time**: 2-3 days

#### Case Details Page
```tsx
// app/dashboard/cases/[id]/page.tsx
- [ ] Case header with status
- [ ] Case information section
- [ ] Parties involved
- [ ] Timeline of events
- [ ] Related records tabs
  - [ ] Hearings
  - [ ] Evidence
  - [ ] Verdicts
  - [ ] Sentences
- [ ] Action buttons
- [ ] Edit mode
```

**Deliverables**:
- Comprehensive case view
- All information accessible
- Easy navigation

---

### 3.3 Case Creation 🔴 P0

**Estimated Time**: 3-4 days

#### Create Case Form
```tsx
// app/dashboard/cases/new/page.tsx
- [ ] Multi-step wizard (optional)
- [ ] Case type selection
- [ ] Case title and description
- [ ] Defendant information
- [ ] Prosecutor assignment
- [ ] Judge assignment
- [ ] Initial evidence upload
- [ ] Form validation
- [ ] Save draft functionality
```

**Server Action**:
```typescript
// app/dashboard/cases/actions.ts
export async function createCase(data: CreateCaseData) {
  // 1. Check permission
  // 2. Get tenant context
  // 3. Validate data
  // 4. Create case with organizationId
  // 5. Create audit log
  // 6. Return success/error
}
```

**Deliverables**:
- Case creation working
- Validation in place
- Good UX with feedback

---

### 3.4 Hearings Management 🟠 P1

**Estimated Time**: 2-3 days

#### Hearing Components
- [ ] Hearing list for case
- [ ] Schedule hearing form
- [ ] Hearing details view
- [ ] Reschedule functionality
- [ ] Cancel hearing
- [ ] Mark attendance

**Features**:
- [ ] Date/time picker
- [ ] Judge assignment
- [ ] Location selection
- [ ] Notifications
- [ ] Calendar integration (optional)

**Deliverables**:
- Hearings manageable
- Scheduling intuitive
- Conflicts detected (optional)

---

### 3.5 Evidence Management 🟠 P1

**Estimated Time**: 4-5 days

#### File Upload System
```typescript
// lib/utils/file-upload.ts
- [ ] Choose storage solution
  - Option A: AWS S3
  - Option B: Local file system
  - Option C: Cloudinary/UploadThing
- [ ] Implement upload
- [ ] File type validation
- [ ] Size limits
- [ ] Virus scanning (optional)
- [ ] Generate thumbnails (images)
```

#### Evidence Components
- [ ] Evidence submission form
- [ ] Evidence list view
- [ ] Evidence detail/preview
- [ ] Download functionality
- [ ] Evidence approval (judges)

**Deliverables**:
- File uploads working
- Evidence manageable
- Secure file access

---

## 4. Judicial Features

### 4.1 Verdicts & Sentences 🟠 P1

**Estimated Time**: 3-4 days

#### Verdict Form (Judges Only)
```tsx
// app/dashboard/cases/[id]/verdict/page.tsx
- [ ] Verdict type selection
- [ ] Verdict description
- [ ] Date of verdict
- [ ] Judge signature
- [ ] Permission check (judge role)
```

#### Sentence Form
- [ ] Sentence type
- [ ] Duration (if applicable)
- [ ] Fine amount (if applicable)
- [ ] Conditions
- [ ] Effective date

**Deliverables**:
- Judges can issue verdicts
- Sentences can be recorded
- Audit trail captured

---

### 4.2 Appeals 🟡 P2

**Estimated Time**: 2-3 days

#### Appeal Components
- [ ] File appeal form
- [ ] Appeal grounds selection
- [ ] Supporting documents
- [ ] Appeal status tracking
- [ ] Appeal decision recording

**Deliverables**:
- Appeal filing functional
- Appeals trackable
- Status updates working

---

## 5. User Management

### 5.1 User Administration 🟠 P1

**Estimated Time**: 4-5 days

#### User List (Admin Only)
```tsx
// app/admin/users/page.tsx
- [ ] User table
- [ ] Search users
- [ ] Filter by role/org
- [ ] View user details
- [ ] Edit user
- [ ] Deactivate user
```

#### User Invitation
```tsx
// app/admin/users/invite/page.tsx
- [ ] Invitation form
- [ ] Email input
- [ ] Organization selection
- [ ] Role pre-assignment
- [ ] Send invitation
- [ ] Track invitation status
```

#### Organization Management API
```typescript
// app/api/organization/switch/route.ts
- [x] Create switch endpoint
- [ ] Add organization list endpoint
- [ ] Add member list endpoint
- [ ] Add invite endpoint
```

**Deliverables**:
- User management functional
- Invitations working
- Role assignments easy

---

### 5.2 Role Management 🟡 P2

**Estimated Time**: 3-4 days

#### Role Assignment Interface
- [ ] Role list for organization
- [ ] Assign role to user
- [ ] Set role expiration
- [ ] Set role scope
- [ ] Revoke role
- [ ] View role history

#### Permission Matrix (Optional)
- [ ] Visual permission grid
- [ ] Role comparison
- [ ] Permission assignment

**Deliverables**:
- Roles easily assignable
- Permission visibility
- Audit trail maintained

---

## 6. Reporting & Analytics

### 6.1 Dashboard Statistics 🟠 P1

**Estimated Time**: 2-3 days

#### Dashboard Widgets
```tsx
// app/dashboard/page.tsx
- [ ] Total cases card
- [ ] Active cases card
- [ ] Pending hearings card
- [ ] Recent activity feed
- [ ] Case status chart
- [ ] Monthly trends graph
```

**Deliverables**:
- Informative dashboard
- Real-time statistics
- Visual charts

---

### 6.2 Reports 🟡 P2

**Estimated Time**: 4-5 days

#### Report Types
- [ ] Case summary report
- [ ] Hearing calendar report
- [ ] Judge workload report
- [ ] Performance metrics
- [ ] Custom date range

#### Export Functionality
```typescript
// lib/utils/export.ts
- [ ] Export to PDF
- [ ] Export to Excel
- [ ] Export to CSV
- [ ] Email reports
```

**Deliverables**:
- Multiple report types
- Export functionality
- Scheduled reports (optional)

---

### 6.3 Audit Logs 🟠 P1

**Estimated Time**: 2-3 days

#### Audit Log Viewer
```tsx
// app/admin/audit/page.tsx
- [ ] Audit log table
- [ ] Filter by user/date/action
- [ ] Search functionality
- [ ] Detail view
- [ ] Export audit logs
```

**Deliverables**:
- Audit trail viewable
- Compliance ready
- Searchable and exportable

---

## 7. Testing

### 7.1 Unit Tests 🔴 P0

**Estimated Time**: 5-6 days

#### Service Tests
```typescript
// __tests__/services/tenant.service.test.ts
- [ ] Test getUserTenantContext()
- [ ] Test verifyUserOrganizationAccess()
- [ ] Test getUserOrganizations()
- [ ] Test switchUserOrganization()

// __tests__/services/authorization.service.test.ts
- [ ] Test getUserPermissions()
- [ ] Test hasPermission()
- [ ] Test assignRole()
- [ ] Test revokeRole()
```

#### Model Tests
- [ ] Test case creation
- [ ] Test data validation
- [ ] Test relationships

**Target**: 80% code coverage

**Deliverables**:
- Comprehensive unit tests
- High code coverage
- All critical paths tested

---

### 7.2 Integration Tests 🟠 P1

**Estimated Time**: 4-5 days

#### Test Scenarios
```typescript
// __tests__/integration/auth.test.ts
- [ ] User registration flow
- [ ] Magic link flow
- [ ] Session management

// __tests__/integration/cases.test.ts
- [ ] Create case
- [ ] Update case
- [ ] Assign case
- [ ] Add evidence
- [ ] Issue verdict

// __tests__/integration/rbac.test.ts
- [ ] Role assignment
- [ ] Permission checks
- [ ] Data isolation
- [ ] Organization switching
```

**Deliverables**:
- Integration tests passing
- Critical flows tested
- Cross-feature testing

---

### 7.3 E2E Tests 🟠 P1

**Estimated Time**: 4-5 days

#### Setup E2E Framework
```bash
npm install -D @playwright/test
# or
npm install -D cypress
```

#### Test Scenarios
```typescript
// e2e/case-management.spec.ts
- [ ] Login as judge
- [ ] Create new case
- [ ] Schedule hearing
- [ ] Upload evidence
- [ ] Issue verdict
- [ ] Logout
```

**Deliverables**:
- E2E tests running
- Key user journeys tested
- Visual regression testing (optional)

---

## 8. Performance & Optimization

### 8.1 Database Optimization 🟠 P1

**Estimated Time**: 2-3 days

#### Query Optimization
```sql
-- Add missing indexes
- [ ] CREATE INDEX idx_cases_org_status ON cases(organization_id, status);
- [ ] CREATE INDEX idx_hearings_date ON hearings(date);
- [ ] CREATE INDEX idx_evidence_case ON evidence(case_id);
- [ ] ANALYZE; -- Update statistics
```

#### Connection Pooling
```typescript
// lib/drizzle/connection.ts
- [ ] Configure pool size
- [ ] Set connection timeout
- [ ] Add connection retry logic
```

#### Query Caching
```typescript
// lib/cache/query-cache.ts
- [ ] Implement Redis caching
- [ ] Cache permission lookups
- [ ] Cache organization data
- [ ] Set TTL appropriately
```

**Deliverables**:
- Optimized queries
- Fast permission checks
- Reduced database load

---

### 8.2 Application Performance 🟠 P1

**Estimated Time**: 3-4 days

#### Code Optimization
```typescript
// Next.js optimizations
- [ ] Implement React Server Components
- [ ] Use dynamic imports
- [ ] Add loading.tsx files
- [ ] Optimize images
- [ ] Code splitting
- [ ] Tree shaking
```

#### Caching Strategy
```typescript
// app/api/[...]/route.ts
- [ ] Add HTTP caching headers
- [ ] Implement SWR/React Query
- [ ] Add service worker (optional)
```

**Deliverables**:
- Fast page loads (<2s)
- Optimized bundle size
- Good Core Web Vitals

---

## 9. Security

### 9.1 Security Hardening 🔴 P0

**Estimated Time**: 3-4 days

#### Security Checklist
```typescript
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection (tokens)
- [ ] Rate limiting
  ```typescript
  // middleware.ts
  import rateLimit from 'express-rate-limit';
  ```
- [ ] File upload security
  - [ ] Type validation
  - [ ] Size limits
  - [ ] Virus scanning
- [ ] Secure headers
  ```typescript
  // next.config.ts
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    // ...
  }
  ```
- [ ] Environment variable protection
- [ ] Secrets management
- [ ] Authentication security
  - [ ] Password hashing (if using)
  - [ ] Session security
  - [ ] Magic link token security
```

**Deliverables**:
- Security audit passed
- Vulnerabilities patched
- Security headers configured

---

### 9.2 Compliance 🟡 P2

**Estimated Time**: 2-3 days

#### Legal & Compliance
- [ ] GDPR compliance check
- [ ] Data retention policy
- [ ] Right to deletion
- [ ] Data export for users
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Cookie consent

**Deliverables**:
- Compliance requirements met
- Legal pages published
- User consent captured

---

## 10. DevOps & Deployment

### 10.1 CI/CD Pipeline 🔴 P0

**Estimated Time**: 2-3 days

#### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
- [ ] Lint on push
- [ ] Run tests on PR
- [ ] Build verification
- [ ] Type checking
- [ ] Security scanning

# .github/workflows/deploy.yml
- [ ] Deploy to staging on merge to develop
- [ ] Deploy to production on merge to main
- [ ] Run database migrations
- [ ] Health check after deployment
- [ ] Rollback on failure
```

**Deliverables**:
- Automated testing
- Automated deployment
- Rollback capability

---

### 10.2 Infrastructure Setup 🔴 P0

**Estimated Time**: 3-4 days

#### Production Server
```bash
# VPS Setup
- [ ] Provision server (DigitalOcean/AWS/Hetzner)
- [ ] Install Node.js
- [ ] Install PostgreSQL
- [ ] Install Redis
- [ ] Install nginx
- [ ] Configure firewall
- [ ] Setup SSH keys
- [ ] Install PM2
```

#### Database Setup
```bash
# PostgreSQL production
- [ ] Create production database
- [ ] Configure connection pooling
- [ ] Setup automated backups
- [ ] Configure replication (optional)
```

#### SSL & Domain
```bash
# Domain configuration
- [ ] Register domain
- [ ] Configure DNS
- [ ] Install certbot
- [ ] Generate SSL certificate
- [ ] Auto-renewal setup
```

**Deliverables**:
- Production infrastructure ready
- SSL configured
- Automated backups

---

### 10.3 Monitoring 🟠 P1

**Estimated Time**: 2-3 days

#### Application Monitoring
```typescript
// Sentry setup
- [ ] Install @sentry/nextjs
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Alert configuration

// LogRocket (optional)
- [ ] Install logrocket
- [ ] Session replay
- [ ] Performance monitoring
```

#### Server Monitoring
```bash
# PM2 monitoring
- [ ] pm2 install pm2-server-monit
- [ ] Configure alerts
- [ ] CPU/Memory monitoring

# Uptime monitoring
- [ ] Setup UptimeRobot/Pingdom
- [ ] Configure alerts
```

**Deliverables**:
- Error tracking active
- Performance monitoring
- Uptime monitoring
- Alert system configured

---

## 11. Documentation

### 11.1 Technical Documentation 🟠 P1

**Estimated Time**: 3-4 days

- [x] Architecture documentation
- [x] Multi-tenant RBAC docs
- [x] API documentation
- [ ] Database schema docs (update)
- [ ] Deployment guide
- [ ] Environment setup guide
- [ ] Troubleshooting guide

---

### 11.2 User Documentation 🟠 P1

**Estimated Time**: 4-5 days

- [ ] User manual
- [ ] Admin guide
- [ ] Quick start guide
- [ ] Video tutorials
- [ ] FAQs
- [ ] Training materials

**Deliverables**:
- Comprehensive user docs
- Admin procedures documented
- Training materials ready

---

## Summary

### Total Estimated Time: 12-16 weeks

#### Critical Path (P0):
1. Multi-tenant RBAC (2 weeks)
2. Core UI (2 weeks)
3. Case Management (2 weeks)
4. Testing & Security (2 weeks)
5. Deployment (1 week)

**Minimum: 9 weeks**

#### With High Priority (P0 + P1):
Add 3-4 weeks for:
- User management
- Reporting
- Advanced features
- Polish

**Recommended: 12-13 weeks**

#### Full Feature Set (P0 + P1 + P2):
Add 3-4 more weeks for:
- Role management UI
- Advanced reports
- Appeals
- Compliance features

**Complete: 15-16 weeks**

---

**Document Version**: 1.0
**Last Updated**: November 2025

---

This technical roadmap should be used alongside the Production Roadmap for complete project planning. Regular reviews and adjustments will be needed based on actual implementation progress.
