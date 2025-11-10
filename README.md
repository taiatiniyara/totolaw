# Totolaw

**Case Management Platform for Pacific Island Court Systems**

Totolaw is a modern, secure web application designed to streamline court case management for Pacific Island judicial systems. Built with Next.js and featuring passwordless authentication, Totolaw provides an efficient platform for managing legal proceedings, cases, and court workflows.

## 🌴 About

Totolaw ("toto" meaning "write/record" in many Pacific languages) is purpose-built to serve the unique needs of Pacific Island court systems, providing:

- **Multi-Tenant Architecture** - Separate organizations for each court system (Fiji, Samoa, Tonga, Vanuatu)
- **Role-Based Access Control** - Granular permissions for judges, magistrates, clerks, prosecutors, and administrators
- **Secure Authentication** - Passwordless magic link authentication for easy, secure access
- **Case Management** - Comprehensive tracking of legal cases, hearings, evidence, and proceedings
- **Data Isolation** - Each organization's data is completely isolated and secure
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

Comprehensive documentation is available in the `/docs` folder:

- [Getting Started](./docs/getting-started.md) - Installation and setup guide
- [Authentication](./docs/authentication.md) - Magic link authentication setup
- [Architecture](./docs/architecture.md) - Technical architecture and design
- [API Documentation](./docs/api.md) - API routes and services
- [Deployment](./docs/deployment.md) - Production deployment guide
- [Database Schema](./docs/database.md) - Database structure and migrations

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
- 🏢 Organization-based isolation (Fiji, Samoa, Tonga, Vanuatu)
- 🔐 Role-based access control with 8 standard roles per organization
- 👥 Users can belong to multiple organizations
- 🔄 Easy organization switching
- 📝 Complete audit trail for compliance

### Authentication & Security
- 🔐 Passwordless magic link authentication
- ✉️ Email-based verification
- 🛡️ CSRF protection and rate limiting
- 🔒 Data isolation enforced at database level
- 📊 Permission-based UI rendering

### Case Management
- 📁 Comprehensive case lifecycle tracking
- ⚖️ Hearings, evidence, verdicts, sentences, and appeals
- 🔄 Case status tracking and workflows
- 👨‍⚖️ Judge and attorney assignments
- 📄 Document and evidence management
- 🔍 Global search across cases, hearings, and evidence

### User Experience
- 🎨 Modern, responsive dashboard with statistics
- 🚀 Fast page loads with Next.js 16
- 📱 Mobile-friendly interface
- ♿ Accessible UI components
- 🌐 Organization switcher in navigation
- 📊 Real-time search with debouncing

## 🔧 Configuration

Key configuration files:

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `lib/drizzle/config.ts` - Database configuration
- `lib/auth.ts` - Authentication configuration

## 📦 Scripts

```bash
npm run dev        # Start development server (port 3441)
npm run build      # Build for production
npm start          # Start production server (port 3440)
npm run lint       # Run ESLint
npm run db-push    # Push database schema changes
npm run deploy     # Build and deploy with PM2
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
