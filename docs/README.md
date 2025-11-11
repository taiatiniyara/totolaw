# Totolaw Documentation

Welcome to the Totolaw documentation. 

**Totolaw** is derived from the Fijian word **"Totolo"** which means **"fast"** or **"quick"**. This platform embodies that spirit by helping the Pacific achieve more efficient execution of justice.

This comprehensive guide covers installation, usage, and administration of the case management platform for Pacific Island court systems.

## 📚 Quick Navigation

### 🚀 Getting Started
- **[Getting Started Guide](./getting-started.md)** - Installation, setup, and first steps
- **[Deployment Guide](./deployment.md)** - Production deployment on VPS with PM2

### 🔐 Authentication & Security
- **[Authentication](./authentication.md)** - Passwordless magic link authentication
- **[Multi-Tenant RBAC](./multi-tenant-rbac.md)** - Role-based access control system
- **[Permissions Reference](./permissions-reference.md)** - Complete permissions guide

### 👑 System Administration
- **[System Admin Guide](./system-admin-guide.md)** - Complete super admin management guide (⭐ Key Document)
- **[Organization Management](./organization-management.md)** - Creating and managing organizations

### 🏗️ Technical Documentation
- **[Architecture](./architecture.md)** - Technical architecture and design patterns
- **[Database](./database.md)** - Database schema and relationships
- **[API Documentation](./api.md)** - API routes and server actions

### 📝 Feature Documentation
- **[Court Transcription](./court-transcription.md)** - Manual transcription features
- **[Manual Transcription](./manual-transcription.md)** - Detailed manual transcription guide

### 🔧 Troubleshooting
- **[Troubleshooting Guide](./troubleshooting.md)** - Common issues and solutions

---

## 💡 Key Concepts

### System Administrators (Super Admins)
System administrators have **omnipotent access** to the entire platform:
- Access all organizations without membership
- Bypass all organization-based restrictions  
- View, create, update, and delete data across all organizations
- Have all permissions automatically
- Marked with `organizationId: "*"` for global access

[Learn more →](./system-admin-guide.md)

### Organizations
Independent legal entities (courts, tribunals) with complete data isolation:
- Each organization has its own users, roles, and data
- Users can belong to multiple organizations
- Organization switcher allows context switching
- Super admins see all organizations

[Learn more →](./organization-management.md)

### Roles & Permissions
Granular access control within each organization:
- 8 standard roles (Judge, Magistrate, Clerk, etc.)
- Resource-based permissions (cases:create, hearings:read, etc.)
- Role-permission mappings
- User-role assignments

[Learn more →](./multi-tenant-rbac.md)

---

## 🎯 Quick Start Guides

### For System Administrators
1. **[System Admin Guide](./system-admin-guide.md)** - Complete management guide
2. **[Create Your First Organization](./organization-management.md)** - Add courts/tribunals
3. **[Multi-Tenant RBAC](./multi-tenant-rbac.md)** - Role-based access control

### For Developers
1. **[Getting Started](./getting-started.md)** - Development environment setup
2. **[Architecture Overview](./architecture.md)** - Understanding the codebase
3. **[API Documentation](./api.md)** - Server actions and services

### For DevOps
1. **[Deployment Guide](./deployment.md)** - VPS deployment with PM2
2. **[Database Setup](./database.md)** - PostgreSQL configuration
3. **[Authentication Setup](./authentication.md)** - Magic link configuration

---

## 🏗️ Architecture Highlights

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth with magic links (passwordless)
- **UI:** Tailwind CSS + shadcn/ui components
- **Multi-Tenancy:** Organization-based data isolation
- **RBAC:** Granular role and permission system
- **Deployment:** PM2 on Ubuntu VPS

---

## 📊 Feature Overview

### Core Features
- ✅ **Case Management** - Comprehensive case tracking and workflows
- ✅ **Hearing Management** - Schedule and manage court hearings
- ✅ **Evidence Management** - Upload and organize case evidence
- ✅ **Document Management** - Centralized document hub
- ✅ **User Management** - Role-based access control
- ✅ **Search** - Global search across cases, hearings, evidence
- ✅ **Court Transcription** - Manual transcription tools for hearings

### Admin Features
- ✅ **Organization Management** - Create/manage organizations
- ✅ **Role Management** - View and configure roles/permissions
- ✅ **User Administration** - Manage users across all organizations
- ✅ **Audit Logging** - Track all system admin actions
- ✅ **Super Admin Dashboard** - System-wide overview and controls

---

## 🔒 Security Features

- Passwordless authentication (magic links)
- Organization-based data isolation
- Role-based access control (RBAC)
- Super admin audit logging
- Rate limiting
- CSRF protection
- Secure session management

---

## 📚 Scripts & Tools

### Admin Management (CLI)
```bash
npm run admin:list      # List all super admins
npm run admin:add       # Add new super admin
npm run admin:remove    # Remove super admin privileges
npm run admin:audit     # View audit log
```

[Full admin guide →](./system-admin-guide.md)

---

## 🆘 Getting Help

**Common Issues:**
- [Troubleshooting Guide](./troubleshooting.md) - Solutions to common problems
- [System Admin Guide](./system-admin-guide.md#troubleshooting) - Admin-specific help

**Resources:**
- Main README: [/README.md](../README.md)
- Scripts README: [/scripts/README.md](../scripts/README.md)
- GitHub Repository: [taiatiniyara/totolaw](https://github.com/taiatiniyara/totolaw)

---

## 📝 Documentation Standards

All documentation follows these principles:
- ✅ Up-to-date with current codebase
- ✅ Practical examples and code snippets
- ✅ Clear navigation and cross-linking
- ✅ Troubleshooting sections
- ✅ Security considerations

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Made with ❤️ for Pacific Island Court Systems**
