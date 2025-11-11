# Totolaw Features Overview

**Totolaw** is derived from the Fijian word **"Totolo"** which means **"fast"** or **"quick"**. This comprehensive case management platform is purpose-built for Pacific Island court systems.

This document provides a complete overview of all features available in Totolaw.

## Table of Contents

- [Authentication & Security](#authentication--security)
- [Multi-Tenant Architecture](#multi-tenant-architecture)
- [Organisation Management](#organisation-management)
- [User Management](#user-management)
- [Role-Based Access Control](#role-based-access-control)
- [Case Management](#case-management)
- [Hearing Management](#hearing-management)
- [Evidence & Document Management](#evidence--document-management)
- [Court Transcription](#court-transcription)
- [Search & Discovery](#search--discovery)
- [Dashboard & Analytics](#dashboard--analytics)
- [System Administration](#system-administration)

---

## Authentication & Security

### Passwordless Authentication
- 🔐 Magic link authentication via email
- ✉️ Secure token-based login system
- ⏰ Configurable session expiration
- 🔒 CSRF protection built-in
- 🚫 Rate limiting on authentication endpoints
- 📧 Email verification required

### Session Management
- 🎫 Better Auth integration
- 🔄 Automatic session refresh
- 🚪 Secure logout functionality
- 📱 Device tracking and management
- ⚡ Fast session validation

### Security Features
- 🛡️ Data encryption at rest and in transit
- 🔐 Environment variable protection
- 🚨 Audit logging for all critical actions
- 👁️ IP address and user agent tracking
- 🔒 Permission-based access control

**Paths:**
- Login: `/auth/login`
- Magic Link: `/auth/magic-link`
- Accept Invitation: `/auth/accept-invitation`

---

## Multi-Tenant Architecture

### Complete Data Isolation
- 🏢 Organisation-based data separation
- 🔒 Foreign key constraints at database level
- 🛡️ Query-level organisation filtering
- 🎯 Service-level tenant validation
- 🚪 API middleware for access control

### Hierarchical Organisations
- 📊 Support for parent-child relationships
- 🌳 Multi-level hierarchies (Country → Province → Court)
- 🔄 Inherit settings from parent (optional)
- 📍 Location-based organisation structure

### Organisation Features
- ✅ Active/inactive status control
- ⚙️ Per-organisation settings (JSON)
- 🎨 Custom branding support
- 📧 Organisation-specific email templates
- 🌐 Multi-language support (planned)

**Supported Structures:**
```
Fiji
  ├── Central Division
  │   ├── Suva High Court
  │   └── Suva Magistrate Court
  ├── Western Division
  └── Northern Division
```

---

## Organisation Management

### Creating Organisations
- ➕ System admin can create new organisations
- 📝 Required: Name, Code, Type
- 🏷️ Unique organisation codes
- 📖 Optional description and parent
- 🎯 Auto-generate standard roles

### Organisation Types
- ⚖️ Court - Judicial systems
- 📋 Tribunal - Specialized tribunals
- 🏛️ Commission - Legal commissions
- 📑 Registry - Court registries
- 🏢 Department - Government departments
- 🔧 Other - Custom types

### Organisation Administration
- ✏️ Edit organisation details
- 🔄 Activate/deactivate organisations
- 👥 View organisation members
- 📊 Organisation statistics
- 🔍 Organisation search

**Paths:**
- List Organisations: `/dashboard/system-admin/organisations`
- Create Organisation: `/dashboard/system-admin/organisations/new`
- Edit Organisation: `/dashboard/system-admin/organisations/[id]/edit`

---

## User Management

### Admin-Initiated Invitations

**Features:**
- 📧 Email-based invitation system
- 🎫 Secure token generation
- ⏰ 7-day expiration (configurable)
- 👥 Multiple role assignment
- 🔐 Direct permission grants (super admin)
- ✉️ Automated email notifications
- 📊 Invitation tracking and management

**Workflow:**
1. Admin invites user with email
2. User receives invitation link
3. User accepts and provides name
4. Account created/linked automatically
5. Roles assigned immediately
6. User redirected to login

**Paths:**
- Invite User: `/dashboard/users/invite`
- Manage Invitations: `/dashboard/users/invitations`

### User-Initiated Join Requests

**Features:**
- 🔍 Browse available organisations
- 🔎 Search organisations by name
- 📝 Submit requests with optional message
- ✅ Admin approval workflow
- ❌ Rejection with reason
- 🔄 Cancel pending requests
- 📊 Request status tracking
- ✉️ Email notifications

**Status Indicators:**
- 🟢 Member - Already member
- 🟡 Pending - Awaiting review
- 🔴 Rejected - Request denied
- ⚪ Available - Can request

**Workflow:**
1. User browses organisations
2. Submits join request
3. Admin receives notification
4. Admin reviews and approves/rejects
5. User receives decision notification
6. If approved, gains immediate access

**Paths:**
- Browse Organisations: `/organisations/join`
- Review Requests: `/dashboard/users/requests`

### User Profile Management
- 👤 View user profile
- ✏️ Update user details
- 🏢 View organisation memberships
- 🎭 View assigned roles
- 📊 User activity history
- 🔒 Permission overview

**Paths:**
- User List: `/dashboard/users`
- User Details: `/dashboard/users/[id]`
- User Status: `/dashboard/user-status`

---

## Role-Based Access Control

### Standard Roles

Pre-configured roles per organisation:

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **Judge** | Judicial officer | Full case access, verdicts, sentences |
| **Magistrate** | Lower court judge | Limited case types, minor offenses |
| **Court Clerk** | Administrative staff | Case management, scheduling |
| **Court Administrator** | Senior admin | User management, system settings |
| **Registrar** | Registry officer | Record keeping, documentation |
| **Prosecutor** | State attorney | Case filing, prosecution |
| **Legal Officer** | Legal counsel | Case viewing, advisory |
| **Public User** | Limited access | View public information only |

### Permission System

**Categories:**
- 📁 Cases: `cases:create`, `cases:read`, `cases:update`, `cases:delete`, `cases:assign`
- 📅 Hearings: `hearings:create`, `hearings:read`, `hearings:update`, `hearings:delete`
- 📄 Evidence: `evidence:submit`, `evidence:view`, `evidence:manage`
- 👥 Users: `users:create`, `users:read`, `users:manage`, `users:delete`
- 🎭 Roles: `roles:assign`, `roles:revoke`, `roles:manage`
- ⚖️ Verdicts: `verdicts:create`, `verdicts:update`
- 📋 Sentences: `sentences:create`, `sentences:update`
- 📊 Reports: `reports:view`, `reports:generate`
- 🔍 Audit: `audit:view`
- ⚙️ Settings: `settings:manage`

### Role Assignment Features
- 👥 Multiple roles per user
- 🎯 Scoped role assignments
- ⏰ Temporary role grants
- 🔐 Direct permission overrides
- ❌ Explicit permission denials
- 📊 Role audit trail

### Super Admin Access
- 🌐 Omnipotent access to all organisations
- 🔓 Bypass permission checks
- 👑 Cross-organisation management
- 🎯 Direct permission grants
- 🛠️ System administration dashboard

**Path:** `/dashboard/system-admin`

---

## Case Management

### Case Creation & Tracking
- ➕ Create new cases
- 📝 Case types: Criminal, Civil, Family, Land, etc.
- 📊 Case status tracking
- 👨‍⚖️ Judge and attorney assignments
- 📅 Filing date and case number
- 📖 Case description and notes
- 🏷️ Custom tags and categorization

### Case Lifecycle
- 📝 **Filed** - Initial submission
- 🔍 **Under Investigation** - Active investigation
- ⚖️ **In Progress** - Active proceedings
- ⏸️ **Suspended** - Temporarily paused
- ✅ **Closed** - Completed
- 🔄 **Appealed** - Under appeal

### Case Details
- 📋 Full case information
- 👥 Parties involved (plaintiff, defendant, attorneys)
- 📅 Important dates and deadlines
- 📄 Related documents and evidence
- 🎤 Hearing records
- ⚖️ Verdicts and judgments
- 📜 Sentences and orders
- 📊 Case timeline

### Case Operations
- ✏️ Edit case details
- 🔄 Update case status
- 👨‍⚖️ Reassign judge/attorney
- 📎 Link related cases
- 🗑️ Archive/delete cases
- 📤 Export case information

**Paths:**
- Case List: `/dashboard/cases`
- Create Case: `/dashboard/cases/new`
- Case Details: `/dashboard/cases/[id]`

---

## Hearing Management

### Scheduling Hearings
- 📅 Create new hearings
- ⏰ Date and time selection
- 📍 Location/courtroom assignment
- 👨‍⚖️ Judge assignment
- 📝 Hearing type (preliminary, trial, sentencing, etc.)
- 🔄 Recurring hearings support
- ⏰ Duration estimation

### Hearing Details
- 📋 Hearing information
- 🔗 Linked case details
- 👥 Attendees and participants
- 📝 Hearing notes
- 📄 Documents and exhibits
- 🎤 Transcription records
- ✅ Completion status

### Calendar View
- 📅 Visual calendar interface
- 🔍 Filter by date range
- 🏷️ Color-coded by type
- 👨‍⚖️ Filter by judge
- 📍 Filter by location
- 📊 Upcoming hearings widget

### Hearing Operations
- ✏️ Edit hearing details
- 🔄 Reschedule hearings
- ❌ Cancel hearings
- ✅ Mark as completed
- 📋 Add hearing notes
- 🎤 Attach transcriptions

**Paths:**
- Hearing List: `/dashboard/hearings`
- Create Hearing: `/dashboard/hearings/new`
- Hearing Details: `/dashboard/hearings/[id]`
- Calendar View: `/dashboard/hearings/calendar`

---

## Evidence & Document Management

### Evidence Upload
- 📤 Upload evidence files
- 📁 Multiple file formats supported
- 🔗 Link evidence to cases
- 🏷️ Evidence categorization
- 📝 Evidence description
- 👮 Chain of custody tracking
- ⏰ Submission date tracking

### Supported File Types
- 📄 Documents: PDF, DOC, DOCX
- 🖼️ Images: JPG, PNG, GIF
- 🎥 Videos: MP4, AVI, MOV
- 🎵 Audio: MP3, WAV, M4A
- 📊 Spreadsheets: XLS, XLSX, CSV
- 📁 Archives: ZIP, RAR

### Evidence Management
- 📋 Evidence list view
- 🔍 Search evidence
- 🏷️ Filter by type
- 📅 Filter by date
- 🔗 View linked cases
- 📥 Download files
- 🗑️ Delete evidence (with permissions)

### File Security
- 🔒 Secure file storage
- 🔐 Access control per file
- 📊 Download tracking
- 🛡️ Virus scanning (planned)
- 💾 Automatic backups

**Paths:**
- Evidence List: `/dashboard/evidence`
- Upload Evidence: `/dashboard/evidence/upload`
- Evidence Details: `/dashboard/evidence/[id]`

---

## Court Transcription

### Manual Transcription
- ✍️ Manual transcription editor
- 💬 Speaker identification
- ⏰ Timestamp tracking
- 📝 Rich text formatting
- 💾 Auto-save functionality
- 📋 Copy/paste support

### Transcription Viewer
- 📖 Read-only transcription view
- 🔍 Search within transcripts
- 👥 Speaker highlighting
- ⏰ Timeline navigation
- 📤 Export transcripts
- 🖨️ Print formatting

### Features
- 🎤 Link to hearings
- 📅 Session date tracking
- 👨‍⚖️ Judge and clerk identification
- 🏷️ Transcript versioning
- ✅ Approval workflow
- 🔒 Access control

**Paths:**
- Transcripts: `/dashboard/hearings/transcripts`
- Edit Transcript: `/dashboard/hearings/[id]/transcript`

---

## Search & Discovery

### Global Search
- 🔍 Search across all data types
- ⚡ Real-time search with debouncing
- 📊 Categorized results
- 🎯 Relevance ranking

### Searchable Entities
- 📁 Cases (title, number, description)
- 📅 Hearings (case title, location, notes)
- 📄 Evidence (filename, description)
- 👥 Users (name, email) - admin only
- 🏢 Organisations - admin only

### Search Features
- 🔎 Partial text matching
- 📊 Result count per category
- 🔗 Quick navigation to results
- 📅 Recent searches (planned)
- 🏷️ Advanced filters (planned)

### Search Results Display
- 📋 Grouped by entity type
- ⏰ Relative timestamps
- 🏷️ Status badges
- 📄 Preview snippets
- 🔗 Direct links to details

**Path:** `/dashboard/search`

---

## Dashboard & Analytics

### Dashboard Overview
- 📊 Key statistics widgets
- 📈 Quick metrics
- 🎯 At-a-glance status
- 🔄 Real-time updates

### Statistics Displayed
- 📁 Total active cases
- 📅 Upcoming hearings
- 📄 Recent evidence submissions
- 👥 Organisation members
- 📊 Cases by type
- ⚖️ Cases by status

### Upcoming Hearings Widget
- 📅 Next 5 upcoming hearings
- ⏰ Date and time display
- 📍 Location information
- 🔗 Quick links to details
- 🚫 Empty state handling

### Recent Activity
- 📝 Latest case updates
- 📅 Recent hearings
- 📤 New evidence uploads
- 👥 New user additions
- 🔄 Organisation changes

### Quick Actions
- ➕ Create new case
- 📅 Schedule hearing
- 📤 Upload evidence
- 👥 Invite user
- 🔍 Global search

**Path:** `/dashboard`

---

## System Administration

### Super Admin Dashboard
- 🛠️ Centralised administration
- 🏢 Organisation management
- 👥 Cross-organisation user management
- 🎭 Global role management
- 📊 System-wide statistics
- 📜 Audit log access

### System Admin Features
- ✅ Create/edit/deactivate organisations
- 👑 Grant super admin status
- 🌐 Access any organisation without membership
- 🎯 Assign users to any organisation
- 🔐 Grant direct permissions
- 📊 View system-wide analytics
- 📜 Review audit trails

### Admin Scripts
- 🔧 `npm run setup-admin` - Interactive admin setup
- 📊 View all super admins
- ➕ Add new super admin
- ❌ Remove super admin status
- 📜 View audit logs

### System Settings
- ⚙️ Global configuration
- 📧 Email settings
- 🔒 Security policies
- ⏰ Session timeout
- 📝 Default roles and permissions
- 🎨 Branding configuration

**Paths:**
- System Admin: `/dashboard/system-admin`
- Organisations: `/dashboard/system-admin/organisations`
- Access Logs: `/dashboard/system-admin/audit`

---

## Built-in Help & Documentation

### In-App Help
- ❓ Help section in dashboard
- 📖 Getting started guide
- 📚 Feature documentation
- ❔ FAQ section
- 🎯 Context-sensitive help

### Help Topics
- 🚀 Getting Started
- 📁 Managing Cases
- 📅 Scheduling Hearings
- 📄 Handling Evidence
- 👥 User Management
- 🔐 Permissions Guide

**Path:** `/dashboard/help`

---

## Technical Features

### Performance
- ⚡ Server-side rendering (SSR)
- 🚀 Static site generation (SSG) where applicable
- 📦 Code splitting and lazy loading
- 🗜️ Image optimization
- 💾 Efficient database queries

### UI/UX
- 📱 Fully responsive design
- 🎨 Modern, clean interface
- ♿ Accessibility (WCAG compliant)
- 🌓 System theme support
- 🎯 Intuitive navigation
- ⌨️ Keyboard shortcuts

### Developer Features
- 📝 TypeScript throughout
- 🔧 Drizzle ORM
- 🎨 Tailwind CSS
- 🧩 shadcn/ui components
- 📊 Better Auth
- 🔄 Server actions

---

## Upcoming Features

### Planned Enhancements
- 📱 Mobile applications (iOS/Android)
- 🌐 Multi-language support
- 📊 Advanced analytics and reporting
- 📧 SMS notifications
- 🤖 AI-powered transcription
- 📄 Document generation (judgments, orders)
- 🔔 Real-time notifications
- 💬 In-app messaging
- 📅 Automated reminders
- 🔗 Integration with external systems

### Future Integrations
- 📧 Advanced email providers
- ☁️ Cloud storage (AWS S3, Google Cloud)
- 🔐 OAuth providers (Google, Microsoft)
- 📊 Business intelligence tools
- 🖨️ Printing services
- 📱 SMS gateways

---

## Support & Resources

### Documentation
- 📖 [Getting Started](./getting-started.md)
- 🏗️ [Architecture](./architecture.md)
- 🔐 [Authentication](./authentication.md)
- 🏢 [Organisation Management](./organization-management.md)
- 👥 [User Invitation System](./user-invitation-system.md)
- 🎭 [Multi-Tenant RBAC](./multi-tenant-rbac.md)
- 📊 [Database Schema](./database.md)
- 🚀 [Deployment](./deployment.md)

### Getting Help
- 📧 Email: support@totolaw.org
- 🐛 GitHub Issues
- 📖 Documentation
- 💬 Community support

---

**Built with ❤️ for Pacific Island Court Systems 🌴**
