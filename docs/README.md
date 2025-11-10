# Documentation Index

Welcome to the Totolaw documentation. This index provides an overview of all available documentation.

## 📚 Documentation Contents

### Getting Started
- [Getting Started Guide](./getting-started.md) - Installation, setup, and first steps
  - Prerequisites
  - Installation steps
  - Environment configuration
  - Database setup
  - Running the application

### Core Documentation

- [Authentication](./authentication.md) - Magic link authentication system
  - How magic links work
  - Security features
  - Email configuration
  - SMTP providers
  - Troubleshooting

- [Architecture](./architecture.md) - Technical architecture and design
  - System overview
  - Technology stack
  - Design patterns
  - Data flow
  - Security architecture

- [API Documentation](./api.md) - API routes and services
  - Authentication endpoints
  - Server actions
  - Services
  - Data types
  - Error handling

- [Database](./database.md) - Database schema and management
  - Schema organization
  - Table structures
  - Relationships
  - Queries
  - Migrations

- [Deployment](./deployment.md) - Production deployment guide
  - VPS deployment
  - Vercel deployment
  - Docker deployment
  - Post-deployment checklist
  - Maintenance procedures

### Multi-Tenant & Access Control 🆕

- [Multi-Tenant RBAC Summary](./MULTI_TENANT_SUMMARY.md) - **START HERE** for overview
  - What has been created
  - Key features and benefits
  - Quick implementation overview
  
- [Multi-Tenant RBAC Architecture](./multi-tenant-rbac.md) - Complete architecture guide
  - Organization structure
  - Role-based access control
  - Data isolation
  - Security considerations
  
- [Permissions Reference](./permissions-reference.md) - Standard permissions and roles
  - All permissions defined
  - Standard role definitions
  - Usage examples
  
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Step-by-step setup
  - Database migration
  - Code integration
  - Testing procedures
  
- [Quick Reference](./QUICK_REFERENCE_RBAC.md) - Code patterns and SQL queries
  - Common patterns
  - SQL queries
  - Troubleshooting tips

## 🎯 Quick Links

### For Developers
- [Tech Stack](./architecture.md#technology-stack)
- [Project Structure](./architecture.md#project-structure)
- [API Reference](./api.md#api-reference-summary)
- [Database Schema](./database.md#schema-organization)

### For DevOps
- [Deployment Options](./deployment.md#deployment-options)
- [Server Setup](./deployment.md#vps-deployment-recommended)
- [Monitoring](./deployment.md#monitoring-and-logging)
- [Backups](./deployment.md#backups)

### For System Administrators
- [Environment Variables](./getting-started.md#set-up-environment-variables)
- [Database Configuration](./database.md#database-configuration)
- [Security Checklist](./deployment.md#security-checklist)
- [Troubleshooting](./getting-started.md#troubleshooting)

## 📖 Documentation by Topic

### Installation & Setup
1. [Prerequisites](./getting-started.md#prerequisites)
2. [Installation Steps](./getting-started.md#installation-steps)
3. [Environment Configuration](./getting-started.md#set-up-environment-variables)
4. [Database Setup](./getting-started.md#set-up-postgresql-database)

### Authentication
1. [Magic Link Overview](./authentication.md#overview)
2. [Configuration](./authentication.md#configuration)
3. [Authentication Flow](./authentication.md#authentication-flow)
4. [Email Service](./authentication.md#email-service)
5. [Security Features](./authentication.md#security-features)

### Development
1. [Tech Stack](./architecture.md#technology-stack)
2. [Project Structure](./architecture.md#project-structure)
3. [Design Patterns](./architecture.md#design-patterns)
4. [Development Workflow](./architecture.md#development-workflow)

### Database
1. [Schema Overview](./database.md#overview)
2. [Authentication Tables](./database.md#authentication-schema)
3. [Case Management Tables](./database.md#case-management-schema)
4. [Migrations](./database.md#migrations)
5. [Query Examples](./database.md#query-examples)

### API
1. [Authentication Endpoints](./api.md#authentication-api)
2. [Server Actions](./api.md#server-actions)
3. [Services](./api.md#services)
4. [Error Handling](./api.md#error-handling)

### Deployment
1. [VPS Deployment](./deployment.md#vps-deployment-recommended)
2. [Vercel Deployment](./deployment.md#vercel-deployment)
3. [Docker Deployment](./deployment.md#docker-deployment)
4. [Post-Deployment](./deployment.md#post-deployment)
5. [Maintenance](./deployment.md#maintenance)

## 🔍 Common Tasks

### Setting Up Development Environment
1. [Clone and install](./getting-started.md#clone-the-repository)
2. [Configure environment](./getting-started.md#set-up-environment-variables)
3. [Setup database](./getting-started.md#set-up-postgresql-database)
4. [Run development server](./getting-started.md#run-the-development-server)

### Deploying to Production
1. [Choose deployment method](./deployment.md#deployment-options)
2. [Setup server](./deployment.md#server-setup)
3. [Configure database](./deployment.md#database-setup)
4. [Deploy application](./deployment.md#application-deployment)
5. [Setup SSL](./deployment.md#ssl-certificate-lets-encrypt)

### Working with Database
1. [Understanding schema](./database.md#schema-organization)
2. [Making queries](./database.md#query-examples)
3. [Running migrations](./database.md#migrations)
4. [Backing up data](./database.md#backup)

### Configuring Authentication
1. [Setup SMTP](./authentication.md#smtp-providers)
2. [Configure Better Auth](./authentication.md#better-auth-setup)
3. [Customize email template](./authentication.md#email-templates)
4. [Test authentication](./authentication.md#troubleshooting)

## 🛠️ Troubleshooting Guides

- [Getting Started Issues](./getting-started.md#troubleshooting)
- [Authentication Problems](./authentication.md#troubleshooting)
- [Deployment Issues](./deployment.md#troubleshooting)
- [Database Problems](./database.md#troubleshooting)

## 📊 Reference Materials

### Configuration Files
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `lib/drizzle/config.ts` - Database configuration
- `lib/auth.ts` - Authentication configuration

### Environment Variables
See [Getting Started - Environment Variables](./getting-started.md#set-up-environment-variables)

### API Reference
See [API Documentation - Reference Summary](./api.md#api-reference-summary)

### Database Schema
See [Database - Schema Organization](./database.md#schema-organization)

## 🤝 Contributing

Interested in contributing to Totolaw? Here's how to get started:

1. Read the [Architecture Guide](./architecture.md)
2. Set up your [Development Environment](./getting-started.md)
3. Understand the [API Structure](./api.md)
4. Review the [Database Schema](./database.md)
5. Fork the repository and make your changes
6. Submit a pull request

## 📞 Support

Need help? Here are your options:

- 📖 Check the documentation (you're here!)
- 🐛 [Report issues on GitHub](https://github.com/taiatiniyara/totolaw/issues)
- 📧 Email support: support@totolaw.org
- 💬 Community discussions (coming soon)

## 🔄 Documentation Updates

This documentation is regularly updated. Last update: November 2025

Found an error or want to improve the docs? Submit a pull request!

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 2024 | Initial comprehensive documentation |

---

**Complete documentation for the Totolaw platform 📚**
