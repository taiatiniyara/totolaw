# Getting Started with Totolaw

**Totolaw** is derived from the Fijian word **"Totolo"** which means **"fast"** or **"quick"**. This platform embodies that spirit by helping the Pacific achieve more efficient execution of justice.

This guide will help you set up and run Totolaw on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** for version control
- An **SMTP email service** for magic link authentication

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/taiatiniyara/totolaw.git
cd totolaw
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16
- Better Auth
- Drizzle ORM
- Tailwind CSS
- shadcn/ui components
- And all other dependencies

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure the following variables:

```env
# Application URL
BETTER_AUTH_URL=http://localhost:3441
NEXT_PUBLIC_APP_URL=http://localhost:3441

# Authentication Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-generated-secret-key-here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/totolaw

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

#### Generating BETTER_AUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `BETTER_AUTH_SECRET` value.

### 4. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE totolaw;

# Create user (optional)
CREATE USER totolaw_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE totolaw TO totolaw_user;

# Exit psql
\q
```

Update your `DATABASE_URL` in `.env.local` to match your database configuration.

### 5. Initialize the Database Schema

Run the database migration to create all required tables:

```bash
npm run db-push
```

This command will:
1. Generate the Better Auth schema
2. Create authentication tables (users, sessions, accounts, verifications)
3. Create application tables (cases, proceedings, templates)
4. Push all changes to your PostgreSQL database

### 6. Configure Email Service

Totolaw uses SMTP to send magic link authentication emails. Here are some popular options:

#### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Use these settings:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

#### Other Email Services

- **SendGrid**: Free tier available, great for production
- **Mailgun**: Reliable with pay-as-you-go pricing
- **Amazon SES**: Cost-effective for high volume
- **Resend**: Modern email API with generous free tier

Update your `.env.local` with the appropriate SMTP credentials for your chosen service.

### 7. Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Web Interface**: [http://localhost:3441](http://localhost:3441)
- **Development Port**: 3441

### 8. Test the Application

1. Open [http://localhost:3441](http://localhost:3441) in your browser
2. You'll be redirected to the login page
3. Enter your email address
4. Check your email for the magic link
5. Click the link to log in
6. You'll be redirected to the dashboard

## Development Workflow

### Project Structure

```
totolaw/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and services
│   ├── drizzle/          # Database ORM
│   ├── services/         # Business logic services
│   ├── auth.ts           # Auth configuration
│   └── auth-client.ts    # Client-side auth
├── docs/                  # Documentation
├── public/               # Static assets
└── package.json          # Dependencies
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 3441

# Building
npm run build        # Build for production
npm start           # Start production server on port 3440

# Database
npm run db-push     # Push schema changes to database

# Code Quality
npm run lint        # Run ESLint

# Deployment
npm run deploy      # Build and deploy with PM2
```

### Making Changes

1. **Component Development**
   - Components are in `components/`
   - UI components use shadcn/ui in `components/ui/`

2. **Adding Pages**
   - Create new pages in `app/` using the App Router
   - Use Server Components by default
   - Add `"use client"` for client-side interactivity

3. **Database Changes**
   - Edit schemas in `lib/drizzle/schema/`
   - Run `npm run db-push` to apply changes

4. **Styling**
   - Uses Tailwind CSS
   - Global styles in `app/globals.css`
   - Configure Tailwind in `tailwind.config.ts`

## Troubleshooting

### Database Connection Issues

If you see "Database connection failed":

1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify DATABASE_URL in `.env.local`
3. Test connection: `psql -U username -d totolaw`

### Email Not Sending

If magic links aren't arriving:

1. Check SMTP credentials in `.env.local`
2. Verify email isn't in spam folder
3. Check terminal logs for email errors
4. Test SMTP connection independently

### Port Already in Use

If port 3441 is occupied:

```bash
# Find and kill the process
lsof -ti:3441 | xargs kill -9

# Or change the port in package.json
"dev": "next dev -p YOUR_PORT"
```

### Build Errors

If you encounter TypeScript or build errors:

1. Clear Next.js cache: `rm -rf .next`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`
4. Try building again: `npm run build`

## Next Steps

Once you have Totolaw running:

1. 🎯 Check [Development Summary](../DEVELOPMENT_SUMMARY.md) for all available features
2. 📖 Read the [Authentication Guide](./authentication.md)
3. 🏗️ Learn about the [Architecture](./architecture.md)
4. � Understand [Multi-Tenant RBAC](./multi-tenant-rbac.md)
5. 📚 Explore the [API Documentation](./api.md)
6. 🗄️ Review the [Database Schema](./database.md)
7. 🚀 Prepare for [Deployment](./deployment.md)

## Available Features

All core features are implemented and ready to use:
- ✅ Multi-tenant organizations with data isolation
- ✅ Role-based access control (RBAC)
- ✅ Case management (CRUD operations)
- ✅ Hearing management with calendar
- ✅ Evidence upload and file management
- ✅ User management and role assignments
- ✅ Global search functionality
- ✅ Organization switching
- ✅ Dashboard with statistics

## Getting Help

If you encounter issues:

- Check the [Documentation](./README.md)
- Review [Common Issues](./troubleshooting.md)
- Open an issue on [GitHub](https://github.com/taiatiniyara/totolaw/issues)
- Contact support: support@totolaw.org

---

**Welcome to Totolaw! 🌴**
