# Totolaw

**Case Management Platform for Pacific Island Court Systems**

Totolaw is a modern, secure web application designed to streamline court case management for Pacific Island judicial systems. Built with Next.js and featuring passwordless authentication, Totolaw provides an efficient platform for managing legal proceedings, cases, and court workflows.

## 🌴 About

**Totolaw** is derived from the Fijian word **"Totolo"** which means **"fast"** or **"quick"**. This platform embodies that spirit by helping Pacific Island nations achieve more efficient execution of justice.

Purpose-built to serve the unique needs of Pacific Island court systems, Totolaw provides:

- **Multi-Tenant Architecture** - Separate organisations for each court system
- **Court Hierarchy Support** - Court of Appeal, High Court, Magistrates Courts, and Tribunals
- **Role-Based Access Control** - Granular permissions for judges, magistrates, clerks, and administrators
- **Secure Authentication** - Passwordless magic link authentication for easy, secure access
- **Comprehensive Case Management** - Full lifecycle tracking with parties, offences, and legal representatives
- **Hearing Management** - Daily cause lists, courtroom scheduling, and action type tracking
- **Evidence & Document Management** - Secure storage and organization of case materials
- **Data Isolation** - Each organisation's data is completely isolated and secure
- **User-Friendly Interface** - Modern, responsive dashboard built with shadcn/ui components
- **Scalable Architecture** - Built on Next.js 16 with PostgreSQL for reliability

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
npm run db-push

# Run development server
npm run dev
```

Visit [http://localhost:3441](http://localhost:3441) to access the application.

## 📚 Documentation

User-friendly documentation is available within the application:

- Visit `/docs` in the app for comprehensive guides
- Access help from the dashboard sidebar
- Getting Started guide at `/docs/getting-started`
- Feature-specific guides for Cases, Hearings, and Evidence
- FAQ at `/docs/faq`

For administrators:
- Use `npm run setup-admin` to manage system administrators
- Check the migration scripts in `/migrations` for database schema details

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth with Magic Link plugin
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Email:** Nodemailer
- **Icons:** Lucide React

## ✨ Key Features

### Multi-Tenant & RBAC
- 🏢 Organisation-based isolation for court systems
- 🔐 Role-based access control with granular permissions
- 👥 Users can belong to multiple organisations
- 🔄 Easy organisation switching
- 📝 Complete audit trail for compliance
- 🛡️ **System admins have omnipotent access** - Full access to all organisations without membership

### Court System Support
- ⚖️ Court hierarchy (Court of Appeal, High Court, Magistrates, Tribunals)
- 📋 Case number generation (HAC, HBC, HAA, ABU formats)
- 🏛️ Courtroom management and scheduling
- 👨‍⚖️ Judicial titles and designations
- 📅 Daily cause lists with PDF export
- 👔 Legal representatives directory

### Authentication & Security
- 🔐 Passwordless magic link authentication
- ✉️ Email-based verification
- 🛡️ CSRF protection and rate limiting
- 🔒 Data isolation enforced at database level
- 📊 Permission-based UI rendering

### Case Management
- 📁 Comprehensive case lifecycle tracking
- 👥 Case parties (prosecution/defense, plaintiff/defendant)
- ⚖️ Hearings, evidence, verdicts, sentences, and appeals
- 🔄 Case status tracking and workflows
- 👨‍⚖️ Judge and clerk assignments
- 📄 Document and evidence management
- 🔍 Global search across cases, hearings, and evidence
- 📝 Court transcription editor
- 📅 Calendar view for upcoming hearings

### Hearing Management
- 📋 Multiple action types (MENTION, TRIAL, HEARING, etc.)
- 🏛️ Courtroom assignment
- ⚖️ Bail tracking and conditions
- 📝 Minutes and outcomes
- 🔗 Transcript linking

### User Management
- 👥 **Admin-Initiated Invitations** - Admins invite users via email with role assignment
- 🚪 **User-Initiated Join Requests** - Users browse and request to join organisations
- ✅ Approval workflow with role assignment
- ✉️ Email notifications for all actions
- 📋 Management dashboards
- 🔐 Secure token-based system

### User Experience
- 🎨 Modern, responsive dashboard with statistics
- 🚀 Fast page loads with Next.js 16
- 📱 Mobile-friendly interface
- ♿ Accessible UI components
- 🌐 Organisation switcher in navigation
- 📊 Real-time search with debouncing
- 💬 Help documentation built into dashboard

## 🔧 Configuration

Key configuration files:

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `lib/drizzle/config.ts` - Database configuration
- `lib/auth.ts` - Authentication configuration

## 📦 Scripts

```bash
# Development
npm run dev          # Start development server (port 3441)
npm run build        # Build for production
npm start            # Start production server (port 3440)
npm run lint         # Run ESLint

# Database
npm run db-push      # Push database schema changes
npm run db-view      # Open Drizzle Studio to view/edit database

# Utilities
npm run setup-admin  # Interactive admin setup script
npm run deploy       # Build and deploy with PM2

# Additional scripts in /scripts directory:
tsx scripts/seed-fiji-courts.ts     # Seed Fiji court system
tsx scripts/test-email.ts <email>   # Test email notifications
tsx scripts/clear-rate-limit.ts     # Clear rate limits
```

## 🌐 Environment Variables

Required environment variables (see `.env.example`):

```env
BETTER_AUTH_URL=http://localhost:3441
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3441
DATABASE_URL=postgresql://user:password@host:port/database
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

## 🤝 Contributing

We welcome contributions to improve Totolaw! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or contributions:

- 📧 Email: support@totolaw.org
- 🐛 Issues: [GitHub Issues](https://github.com/taiatiniyara/totolaw/issues)
- 📖 Docs: [Documentation](./docs)

## 🙏 Acknowledgments

Built with support for Pacific Island judicial systems and their communities. Special thanks to all contributors and the Pacific legal community for their guidance.

---

**Made with ❤️ for Pacific Island Court Systems**
