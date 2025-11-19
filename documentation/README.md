# Totolaw Technical Documentation

**Version:** 1.0.0  
**Last Updated:** November 2024

Welcome to the Totolaw technical documentation. This comprehensive guide covers all aspects of the system architecture, implementation, development workflows, and Fiji court system features.

## 📚 Documentation Index

### Core Documentation

1. **[System Overview](01-system-overview.md)**
   - Introduction and purpose
   - Key features and capabilities
   - Technology stack
   - System requirements

2. **[Architecture](02-architecture.md)**
   - System architecture overview
   - Multi-tenant design
   - Folder structure
   - Design patterns and principles

3. **[Database Schema](03-database-schema.md)**
   - Data models and relationships
   - Schema design
   - Migration strategy
   - Indexing strategy

4. **[Authentication & Authorization](04-auth-and-security.md)**
   - Magic link authentication flow
   - Role-Based Access Control (RBAC)
   - Permission system
   - Super admin privileges
   - Security best practices

5. **[API Documentation](05-api-documentation.md)**
   - API routes and endpoints
   - Request/response formats
   - Authentication requirements
   - Error handling
   - Fiji court system endpoints

6. **[User Management](06-user-management.md)**
   - User lifecycle
   - Organisation membership
   - Invitations and join requests
   - Role assignments
   - Judicial titles and designations

7. **[Case Management](07-case-management.md)**
   - Case lifecycle
   - Case parties (prosecution/defence, plaintiff/defendant)
   - Offences tracking
   - Court hierarchy integration
   - Case number generation

8. **[Deployment Guide](08-deployment.md)**
   - Environment setup
   - Configuration
   - Database migrations
   - Production deployment
   - Monitoring and maintenance

9. **[Development Guide](09-development-guide.md)**
   - Getting started
   - Coding standards
   - Best practices
   - Testing strategies
   - Contributing guidelines

10. **[Service Layer](10-services.md)**
    - Service architecture
    - Core services overview
    - Usage examples

### Court System Features

11. **[Transcription System](14-transcription-system.md)**
    - Manual transcription editor
    - Rich text editing features
    - Auto-save functionality
    - Keyboard shortcuts
    - Transcript management

12. **[Case Number Generation](15-case-number-generation.md)**
    - Case number formats (HAC, HBC, HAA, ABU, etc.)
    - Generation algorithms
    - Validation rules
    - Yearly sequence management

13. **[Calendar View Features](16-calendar-view.md)**
    - Hearing calendar display
    - Date navigation
    - Filtering by judge/courtroom
    - Action type color coding
    - Month/week/day views

14. **[Legal Representatives Management](17-legal-representatives.md)**
    - Legal representative directory
    - CRUD operations
    - Case associations
    - Practice areas tracking

15. **[Daily Cause Lists](18-daily-cause-lists.md)**
    - Cause list generation
    - Publication workflow
    - Hearing filtering
    - Courtroom scheduling

16. **[Hearing Management](19-hearing-management.md)**
    - Hearing action types (MENTION, TRIAL, etc.)
    - Bail tracking
    - Courtroom assignment
    - Transcript linking
    - Hearing outcomes

17. **[Courtroom Management](20-courtroom-management.md)**
    - Courtroom CRUD operations
    - Hearing assignments
    - Capacity management
    - Availability checking

18. **[Organisation Hierarchy](21-organisation-hierarchy.md)**
    - Court hierarchy structure
    - Court levels (High Court, Magistrates, etc.)
    - Court types (Criminal, Civil, etc.)
    - Jurisdiction management
    - Parent-child relationships

19. **[Evidence Management](22-evidence-management.md)**
    - Evidence upload and storage
    - File type validation (PDF, images, audio, video)
    - Case and hearing linking
    - Permission-based access
    - File preview components

20. **[Document Management](23-document-management.md)**
    - Document categories
    - Unified evidence/document model
    - Upload and organization
    - Browse and search workflows

21. **[Search Functionality](24-search-functionality.md)**
    - Global search across entities
    - Case, hearing, and evidence search
    - Debounced search interface
    - Advanced filtering

### User Guides & Reference

22. **[Quick Reference Guide](25-quick-reference.md)** ⭐
    - Common tasks and workflows
    - Keyboard shortcuts
    - Daily operations
    - Navigation guide
    - Tips and tricks

23. **[Testing Strategy](26-testing-strategy.md)**
    - Unit testing with Vitest
    - Integration testing
    - End-to-end testing with Playwright
    - Test organization
    - CI/CD integration

24. **[Troubleshooting Guide](27-troubleshooting.md)** 🔧
    - Common issues and solutions
    - Error messages
    - Authentication problems
    - Database issues
    - Performance optimization

## 🎯 Quick Links

### For End Users
- ⭐ **[Quick Reference Guide](25-quick-reference.md)** - Daily tasks and shortcuts
- 🔧 **[Troubleshooting Guide](27-troubleshooting.md)** - Common issues and solutions
- **[Getting Started](getting-started/page.md)** - First steps with Totolaw
- **[FAQ](faq/page.md)** - Frequently asked questions

### For Court Staff
- **[Case Management](07-case-management.md)** - Creating and managing cases
- **[Hearing Management](19-hearing-management.md)** - Scheduling and tracking hearings
- **[Evidence Management](22-evidence-management.md)** - Uploading and organizing evidence
- **[Calendar View](16-calendar-view.md)** - Using the hearing calendar
- **[Daily Cause Lists](18-daily-cause-lists.md)** - Generating cause lists
- **[Legal Representatives](17-legal-representatives.md)** - Managing legal representatives

### For Developers
- **[Getting Started](09-development-guide.md#getting-started)** - Development setup
- **[Folder Structure](02-architecture.md#folder-structure)** - Code organization
- **[Coding Standards](09-development-guide.md#coding-standards)** - Code style guide
- **[API Documentation](05-api-documentation.md)** - API reference
- **[Testing Strategy](26-testing-strategy.md)** - Writing tests

### For System Administrators
- **[Deployment Guide](08-deployment.md)** - Production deployment
- **[Environment Configuration](08-deployment.md#environment-variables)** - Environment setup
- **[Database Migrations](08-deployment.md#database-migrations)** - Schema management
- **[User Management](06-user-management.md)** - Managing users and roles
- **[Organisation Hierarchy](21-organisation-hierarchy.md)** - Court structure setup

### For Architects
- **[System Architecture](02-architecture.md)** - System design overview
- **[Database Design](03-database-schema.md)** - Data models and relationships
- **[Security Model](04-auth-and-security.md)** - Authentication and authorization
- **[Organisation Hierarchy](21-organisation-hierarchy.md)** - Court system architecture

## 🔍 Key Concepts

### Multi-Tenancy
Totolaw is built on a **multi-tenant architecture** where each court system (organisation) has complete data isolation while sharing the same application infrastructure. Each court maintains its own cases, hearings, and evidence while benefiting from shared infrastructure.

### Court System Support
Built for **Pacific Island court systems** with comprehensive support for:
- Court hierarchy (High Court, Magistrates Court, Court of Appeal)
- Case number formats (HAC, HBC, HAA, ABU, etc.)
- Judicial titles (Justice, Magistrate, Resident Magistrate)
- Court divisions and case types
- Daily cause lists and hearing management
- Legal representatives tracking

### Role-Based Access Control
The system implements **granular RBAC** with organisation-scoped roles and permissions:
- **Judges** - Preside over cases and hearings
- **Clerks** - Manage cases, schedule hearings, upload evidence
- **Registry** - Administrative support and document management
- **System Admin** - Platform-wide management across all courts

### Super Admin Privileges
**System administrators** have omnipotent access across all organisations without requiring membership, enabling platform-wide management and court hierarchy setup.

### Passwordless Authentication
Uses **magic link authentication** via email for secure, user-friendly access without password management overhead. Users receive a one-time login link via email for secure access.

## 🛠️ Technology Stack Summary

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth with Magic Link
- **UI:** Tailwind CSS + shadcn/ui + Radix UI
- **Email:** Nodemailer
- **Icons:** Lucide React

## � Documentation Organization

### By User Type

**👤 End Users (Judges, Clerks, Registry)**
- Start with: [Quick Reference Guide](25-quick-reference.md)
- Common tasks: [Case Management](07-case-management.md), [Hearing Management](19-hearing-management.md)
- Need help: [Troubleshooting Guide](27-troubleshooting.md), [FAQ](faq/page.md)

**👨‍💻 Developers**
- Start with: [Development Guide](09-development-guide.md)
- Architecture: [System Architecture](02-architecture.md), [Database Schema](03-database-schema.md)
- APIs: [API Documentation](05-api-documentation.md)
- Testing: [Testing Strategy](26-testing-strategy.md)

**🔧 System Administrators**
- Start with: [Deployment Guide](08-deployment.md)
- Configuration: [Authentication](04-auth-and-security.md), [User Management](06-user-management.md)
- Maintenance: [Troubleshooting Guide](27-troubleshooting.md)
- Setup: [Organisation Hierarchy](21-organisation-hierarchy.md)

**🏗️ Architects & Decision Makers**
- Start with: [System Overview](01-system-overview.md)
- Implementation: [Fiji Court System Redesign](11-fiji-court-system-redesign.md)
- Design: [Architecture](02-architecture.md), [Fiji System Diagrams](13-fiji-system-diagrams.md)

---

## 📞 Support

For questions or issues:
- **User Questions:** See [Quick Reference](25-quick-reference.md) and [Troubleshooting Guide](27-troubleshooting.md)
- **Technical Issues:** See [Development Guide](09-development-guide.md) and [Testing Strategy](26-testing-strategy.md)
- **Deployment Help:** See [Deployment Guide](08-deployment.md)
- **Email Support:** support@totolaw.com

## 📝 Document Conventions

Throughout this documentation:
- `Code snippets` are shown in monospace
- **Important concepts** are bolded
- File paths use `/root/project/path` format
- Command examples use `$` prefix for shell commands

## 🔄 Keeping Documentation Updated

This documentation should be updated whenever:
- New features are added
- Architecture changes are made
- API endpoints are modified
- Database schema is updated
- Deployment procedures change
- User workflows are updated
- Troubleshooting steps are added

---

## 📋 Documentation Checklist

When adding new features, ensure documentation is updated:

- [ ] Update relevant technical documentation (Architecture, API, Database)
- [ ] Add user-facing documentation (Quick Reference, User Guides)
- [ ] Update troubleshooting guide with potential issues
- [ ] Add examples and code snippets
- [ ] Update this README if new documentation files are added
- [ ] Test all documentation links
- [ ] Update "Last Updated" date

---

## 🎓 Learning Path

### New to Totolaw?
1. Read [System Overview](01-system-overview.md)
2. Review [Organisation Hierarchy](21-organisation-hierarchy.md)
3. Follow [Getting Started](getting-started/page.md)
4. Bookmark [Quick Reference Guide](25-quick-reference.md)

### Setting Up Development?
1. Read [Development Guide](09-development-guide.md)
2. Review [Architecture](02-architecture.md) and [Database Schema](03-database-schema.md)
3. Set up environment following [Deployment Guide](08-deployment.md)
4. Review [Testing Strategy](26-testing-strategy.md)

### Deploying to Production?
1. Read [Deployment Guide](08-deployment.md)
2. Configure [Authentication & Security](04-auth-and-security.md)
3. Set up [Organisation Hierarchy](21-organisation-hierarchy.md)
4. Review [User Management](06-user-management.md)
5. Keep [Troubleshooting Guide](27-troubleshooting.md) handy

---

**Made with ❤️ for Pacific Island Court Systems**

*Empowering justice through technology*
