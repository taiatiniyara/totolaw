# Totolaw - Quick Reference

One-page reference for common commands and configurations.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/taiatiniyara/totolaw.git
cd totolaw
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Setup database
npm run db-push

# Run development
npm run dev
# Visit http://localhost:3441
```

## 📝 Essential Environment Variables

```env
# Application
BETTER_AUTH_URL=http://localhost:3441
BETTER_AUTH_SECRET=<openssl rand -base64 32>
NEXT_PUBLIC_APP_URL=http://localhost:3441

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/totolaw

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🛠️ Common Commands

### Development
```bash
npm run dev          # Start dev server (port 3441)
npm run build        # Build for production
npm start            # Start production (port 3440)
npm run lint         # Run linter
```

### Database
```bash
npm run db-push      # Push schema changes
drizzle-kit generate # Generate migrations
drizzle-kit push     # Apply migrations
```

### Deployment
```bash
npm run deploy       # Build and deploy with PM2
pm2 start totolaw    # Start with PM2
pm2 restart totolaw  # Restart
pm2 logs totolaw     # View logs
pm2 status           # Check status
```

## 📁 Project Structure

```
totolaw/
├── app/                  # Next.js App Router
│   ├── api/auth/        # Auth API routes
│   ├── auth/            # Auth pages
│   └── dashboard/       # Dashboard
├── components/          # React components
│   └── ui/             # UI components
├── lib/                 # Utilities
│   ├── drizzle/        # Database ORM
│   ├── services/       # Services
│   ├── auth.ts         # Auth config
│   └── auth-client.ts  # Client auth
├── docs/               # Documentation
└── public/             # Static files
```

## 🔐 Authentication Flow

1. User enters email → Magic link sent
2. User clicks link → Token verified
3. Session created → Redirect to dashboard

## 🗄️ Database Tables

### Authentication
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts
- `verification` - Magic link tokens

### Application
- `proceeding_templates` - Workflow templates
- `proceeding_steps` - Workflow steps

## 🌐 API Endpoints

```
POST   /api/auth/sign-in/magic-link  # Request magic link
GET    /api/auth/magic-link/verify   # Verify token
GET    /api/auth/get-session         # Get session
POST   /api/auth/sign-out            # Sign out
```

## 🐛 Quick Troubleshooting

### Magic links not sending?
```bash
# Check SMTP config
cat .env.local | grep SMTP

# Test email service
tsx test-email.ts
```

### Database connection failed?
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U totolaw_user -d totolaw
```

### Port in use?
```bash
# Kill process on port 3441
kill -9 $(lsof -ti:3441)
```

### Build errors?
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📦 Key Dependencies

```json
{
  "next": "16.0.1",
  "react": "19.2.0",
  "better-auth": "^1.3.34",
  "drizzle-orm": "^0.44.7",
  "pg": "^8.16.3",
  "nodemailer": "^7.0.10",
  "tailwindcss": "^4"
}
```

## 🔒 Security Checklist

- [ ] Strong `BETTER_AUTH_SECRET`
- [ ] HTTPS in production
- [ ] Secure database password
- [ ] SMTP credentials secured
- [ ] Firewall configured
- [ ] Regular backups enabled
- [ ] SSL certificate valid
- [ ] Rate limiting configured

## 📊 Production Deployment

### VPS Quick Deploy
```bash
# Server setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql nginx

# Application
cd /var/www
git clone https://github.com/taiatiniyara/totolaw.git
cd totolaw
npm install --production
npm run build

# PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Nginx + SSL
sudo certbot --nginx -d totolaw.org
```

### Vercel Quick Deploy
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

## 📚 Documentation Links

- [Getting Started](./docs/getting-started.md)
- [Authentication](./docs/authentication.md)
- [Architecture](./docs/architecture.md)
- [API Docs](./docs/api.md)
- [Database](./docs/database.md)
- [Deployment](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🆘 Support

- 📖 Documentation: `/docs`
- 🐛 Issues: [GitHub Issues](https://github.com/taiatiniyara/totolaw/issues)
- 📧 Email: support@totolaw.org

## 🎯 Next Steps After Setup

1. ✅ Test magic link authentication
2. ✅ Create test user account
3. ✅ Explore dashboard
4. ✅ Review documentation
5. ✅ Configure production environment
6. ✅ Setup monitoring
7. ✅ Enable backups

---

**Quick reference for Totolaw platform ⚡**
