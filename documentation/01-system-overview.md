# System Overview

## Introduction

**Totolaw** is a modern case management platform designed specifically for Pacific Island court systems. The name derives from the Fijian word "Totolo" meaning "fast" or "quick," reflecting the platform's mission to accelerate justice delivery across Pacific Island nations.

## Purpose and Vision

### Mission
To streamline legal proceedings and case management for Pacific Island judicial systems through modern, secure, and user-friendly technology.

### Target Users
- **Judges & Magistrates:** Preside over cases, review evidence, issue verdicts
- **Court Clerks:** Manage case records, schedule hearings, maintain documentation
- **Prosecutors & Defense Attorneys:** Access case information and submit evidence
- **Court Administrators:** Manage users, roles, and organisational settings
- **System Administrators:** Platform-wide management and maintenance

## Key Features

### 1. Multi-Tenant Architecture
- **Organisation Isolation:** Each court system (Fiji, Samoa, Tonga, Vanuatu, etc.) operates independently
- **Data Segregation:** Complete data isolation between organisations
- **Shared Infrastructure:** Efficient resource utilization across all tenants
- **Hierarchical Support:** Organisations can have parent-child relationships (country → province → district)

### 2. Role-Based Access Control (RBAC)
- **Granular Permissions:** Fine-grained control over actions and resources
- **Organisation-Scoped Roles:** Roles are specific to each organisation
- **Permission Inheritance:** Users inherit permissions from assigned roles
- **Direct Permission Grants:** Individual permission grants and denies
- **Audit Trail:** Complete logging of role and permission changes

### 3. Secure Authentication
- **Passwordless Login:** Magic link authentication via email
- **No Password Management:** Eliminates password-related security risks
- **Session Management:** Secure session handling with configurable expiration
- **Rate Limiting:** Protection against brute force attacks
- **CSRF Protection:** Built-in security against cross-site attacks

### 4. Case Management
- **Full Lifecycle Tracking:** From filing to resolution and appeals
- **Hearing Management:** Schedule and track court hearings
- **Evidence Management:** Secure storage and organization of evidence
- **Document Management:** Upload and manage case-related documents
- **Verdict & Sentencing:** Record outcomes and sentences
- **Appeals Process:** Track appeal submissions and outcomes

### 5. User Management
- **Admin Invitations:** Administrators invite users with pre-assigned roles
- **User Join Requests:** Users can browse and request to join organisations
- **Approval Workflow:** Admin review and approval of join requests
- **Email Notifications:** Automated notifications for all user actions
- **Multi-Organisation Membership:** Users can belong to multiple organisations

### 6. Search & Discovery
- **Global Search:** Search across cases, hearings, evidence, and documents
- **Filtered Search:** Filter by status, date, type, and other criteria
- **Quick Access:** Fast navigation to relevant information
- **Real-time Results:** Debounced search with instant feedback

### 7. Transcription Services
- **Manual Transcription:** Court officers can manually transcribe proceedings
- **Transcript Management:** Store and retrieve hearing transcripts
- **Future Integration:** Architecture supports automated transcription services

### 8. Reporting & Analytics
- **Dashboard Statistics:** Key metrics on cases, hearings, and activity
- **Calendar View:** Visual representation of upcoming hearings
- **Status Tracking:** Monitor case progress and bottlenecks

## Technology Stack

### Frontend
- **Next.js 16:** React framework with App Router for optimal performance
- **React 19:** Latest React features for modern UI development
- **TypeScript:** Type-safe development across the entire application
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development
- **shadcn/ui:** High-quality, accessible UI component library
- **Radix UI:** Unstyled, accessible component primitives
- **Lucide React:** Beautiful, consistent icon system

### Backend
- **Next.js API Routes:** Server-side API endpoints
- **Better Auth:** Modern authentication library with plugin support
- **Drizzle ORM:** Type-safe SQL database toolkit
- **PostgreSQL:** Robust, scalable relational database
- **Nodemailer:** Email sending for notifications and magic links

### Development Tools
- **ESLint:** Code linting and quality checks
- **Drizzle Kit:** Database migration and studio tools
- **tsx:** TypeScript execution for scripts
- **PM2:** Production process management

## System Requirements

### Production Environment
- **Node.js:** v20 or higher
- **PostgreSQL:** v14 or higher
- **RAM:** Minimum 2GB, recommended 4GB+
- **Storage:** Minimum 10GB for database and uploads
- **Network:** HTTPS required for production

### Development Environment
- **Node.js:** v20 or higher
- **PostgreSQL:** v14 or higher
- **Package Manager:** npm v10 or higher
- **OS:** Linux, macOS, or Windows with WSL2

## Deployment Architecture

### Recommended Setup
```
┌─────────────────┐
│  Load Balancer  │  (Nginx/Cloudflare)
└────────┬────────┘
         │
    ┌────┴────┐
    │ Next.js │  (PM2 Cluster Mode)
    │  App    │
    └────┬────┘
         │
    ┌────┴────────┐
    │ PostgreSQL  │  (Primary + Replica)
    │  Database   │
    └─────────────┘
```

### Ports
- **Development:** 3441
- **Production:** 3440 (behind reverse proxy)

## Browser Support

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions
- **Mobile:** iOS Safari 14+, Chrome Mobile latest

## Accessibility

- **WCAG 2.1:** Level AA compliance target
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Readers:** Compatible with NVDA, JAWS, VoiceOver
- **Color Contrast:** Meets WCAG contrast requirements

## Localization

Currently available in English, with architecture supporting future internationalization:
- i18n-ready component structure
- Centralized text management capability
- Date/time formatting considerations

## Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **API Response Time:** < 200ms (p95)
- **Database Query Time:** < 100ms (p95)

## Scalability

The system is designed to scale:
- **Horizontal Scaling:** Next.js app can run in cluster mode
- **Database Scaling:** PostgreSQL read replicas supported
- **Caching:** Ready for Redis integration
- **CDN:** Static assets can be served via CDN

## Security Features

- **Data Encryption:** SSL/TLS for data in transit
- **Input Validation:** Comprehensive input sanitization
- **SQL Injection Prevention:** Parameterized queries via ORM
- **XSS Protection:** React's built-in XSS protection
- **CSRF Protection:** Token-based CSRF prevention
- **Rate Limiting:** Request throttling at multiple levels
- **Audit Logging:** Complete audit trail for compliance

## Compliance & Standards

- **Data Protection:** Designed with data privacy principles
- **Audit Requirements:** Complete audit trail for legal compliance
- **Records Retention:** Configurable retention policies
- **Access Logging:** All data access is logged

## Future Roadmap

Planned enhancements:
- **Mobile Apps:** Native iOS and Android applications
- **AI Integration:** Automated transcription and case analysis
- **Advanced Analytics:** Predictive analytics and insights
- **Document Generation:** Automated legal document creation
- **E-Filing:** Electronic case filing interface
- **Public Portal:** Case status lookup for public
- **Integration APIs:** Third-party system integrations

---

**Next:** [Architecture Overview →](02-architecture.md)
