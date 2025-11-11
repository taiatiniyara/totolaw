# Totolaw Technical Documentation

**Version:** 0.1.0  
**Last Updated:** November 11, 2025

Welcome to the Totolaw technical documentation. This comprehensive guide covers all aspects of the system architecture, implementation, and development workflows.

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

6. **[User Management](06-user-management.md)**
   - User lifecycle
   - Organisation membership
   - Invitations and join requests
   - Role assignments

7. **[Case Management](07-case-management.md)**
   - Case lifecycle
   - Hearings and evidence
   - Document management
   - Search functionality

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

## 🎯 Quick Links

### For Developers
- [Getting Started](09-development-guide.md#getting-started)
- [Folder Structure](02-architecture.md#folder-structure)
- [Coding Standards](09-development-guide.md#coding-standards)

### For System Administrators
- [Deployment Guide](08-deployment.md)
- [Environment Configuration](08-deployment.md#environment-variables)
- [Database Migrations](08-deployment.md#database-migrations)

### For Architects
- [System Architecture](02-architecture.md)
- [Database Design](03-database-schema.md)
- [Security Model](04-auth-and-security.md)

## 🔍 Key Concepts

### Multi-Tenancy
Totolaw is built on a **multi-tenant architecture** where each court system (organisation) has complete data isolation while sharing the same application infrastructure.

### Role-Based Access Control
The system implements **granular RBAC** with organisation-scoped roles and permissions, allowing fine-grained control over user access.

### Super Admin Privileges
**System administrators** have omnipotent access across all organisations without requiring membership, enabling platform-wide management.

### Passwordless Authentication
Uses **magic link authentication** via email for secure, user-friendly access without password management overhead.

## 🛠️ Technology Stack Summary

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth with Magic Link
- **UI:** Tailwind CSS + shadcn/ui + Radix UI
- **Email:** Nodemailer
- **Icons:** Lucide React

## 📞 Support

For questions or issues:
- **Technical Issues:** See [Development Guide](09-development-guide.md#troubleshooting)
- **Deployment Help:** See [Deployment Guide](08-deployment.md#troubleshooting)
- **GitHub Issues:** https://github.com/taiatiniyara/totolaw/issues

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

---

**Made with ❤️ for Pacific Island Court Systems**
