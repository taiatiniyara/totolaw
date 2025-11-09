# Troubleshooting Guide

Common issues and solutions for the Totolaw platform.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Authentication Issues](#authentication-issues)
- [Database Issues](#database-issues)
- [Email Issues](#email-issues)
- [Development Issues](#development-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### Node.js Version Mismatch

**Problem:** `Error: The engine "node" is incompatible with this module`

**Solution:**
```bash
# Check Node.js version
node --version

# Should be v20 or higher
# Install correct version:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### npm Install Fails

**Problem:** `npm ERR! code ERESOLVE` or dependency conflicts

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Permission Errors

**Problem:** `EACCES: permission denied`

**Solution:**
```bash
# Fix npm permissions (don't use sudo with npm)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then reinstall
npm install
```

---

## Authentication Issues

### Magic Links Not Sending

**Problem:** Magic link emails are not arriving

**Diagnostic Steps:**
1. Check server logs for email errors
2. Verify SMTP configuration
3. Check spam/junk folder
4. Test SMTP connection

**Solutions:**

**1. Verify SMTP Configuration:**
```bash
# Check .env.local
cat .env.local | grep SMTP

# Should show:
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

**2. Test SMTP Connection:**
Create `test-email.ts`:
```typescript
import { sendEmail } from "./lib/services/email.service";

sendEmail(
  "your-email@example.com",
  "Test Email",
  ["This is a test email"]
)
  .then(() => console.log("Email sent successfully"))
  .catch((error) => console.error("Error:", error));
```

Run:
```bash
tsx test-email.ts
```

**3. Gmail-Specific Issues:**

- Enable 2-Factor Authentication
- Generate App Password (not regular password)
- Use these settings:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=465
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=16-character-app-password
  ```

### Magic Link Token Invalid

**Problem:** "Invalid or expired token" error

**Causes:**
- Token expired (15 minute limit)
- Token already used
- URL mismatch in configuration

**Solutions:**

**1. Check Token Expiration:**
Tokens expire after 15 minutes. Request a new magic link.

**2. Verify URL Configuration:**
```bash
# Both should match your actual URL
echo $BETTER_AUTH_URL
echo $NEXT_PUBLIC_APP_URL

# Update .env.local if needed
BETTER_AUTH_URL=http://localhost:3441
NEXT_PUBLIC_APP_URL=http://localhost:3441
```

**3. Clear Browser Cookies:**
```bash
# In browser console:
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

### Session Not Persisting

**Problem:** User gets logged out immediately after login

**Solutions:**

**1. Check Cookies Enabled:**
Ensure browser allows cookies for your domain.

**2. Verify BETTER_AUTH_SECRET:**
```bash
# Generate new secret
openssl rand -base64 32

# Update .env.local
BETTER_AUTH_SECRET=new-secret-here
```

**3. Check HTTPS in Production:**
Secure cookies require HTTPS in production.

---

## Database Issues

### Cannot Connect to Database

**Problem:** `Error: connect ECONNREFUSED` or `password authentication failed`

**Solutions:**

**1. Verify PostgreSQL is Running:**
```bash
sudo systemctl status postgresql

# If not running:
sudo systemctl start postgresql
```

**2. Test Database Connection:**
```bash
psql -U totolaw_user -d totolaw -h localhost

# If connection fails, check:
# - Username is correct
# - Password is correct
# - Database exists
```

**3. Verify DATABASE_URL:**
```env
# Format:
DATABASE_URL=postgresql://username:password@host:port/database

# Example:
DATABASE_URL=postgresql://totolaw_user:password123@localhost:5432/totolaw
```

**4. Check pg_hba.conf:**
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add or verify line:
local   totolaw         totolaw_user                          md5

# Restart PostgreSQL:
sudo systemctl restart postgresql
```

### Database Migration Fails

**Problem:** `npm run db-push` fails with errors

**Solutions:**

**1. Check Schema Syntax:**
Review schema files for TypeScript errors:
```bash
npm run lint
```

**2. Check Database Permissions:**
```sql
-- Connect as postgres user
sudo -u postgres psql

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE totolaw TO totolaw_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO totolaw_user;
```

**3. Drop and Recreate (Development Only):**
```bash
# WARNING: This deletes all data
dropdb -U postgres totolaw
createdb -U postgres totolaw
npm run db-push
```

### Slow Database Queries

**Problem:** Application is slow, database queries taking too long

**Solutions:**

**1. Add Indexes:**
```sql
-- Common indexes
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_session_user_id ON session("userId");
CREATE INDEX idx_session_token ON session(token);
```

**2. Analyze Slow Queries:**
```sql
-- Enable slow query logging
ALTER DATABASE totolaw SET log_min_duration_statement = 1000;

-- View slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

**3. Optimize Queries:**
```typescript
// Bad: N+1 query problem
const templates = await db.select().from(proceedingTemplates);
for (const template of templates) {
  const steps = await db
    .select()
    .from(proceedingSteps)
    .where(eq(proceedingSteps.templateId, template.id));
}

// Good: Use join
const templatesWithSteps = await db
  .select()
  .from(proceedingTemplates)
  .leftJoin(
    proceedingSteps,
    eq(proceedingTemplates.id, proceedingSteps.templateId)
  );
```

---

## Email Issues

### Gmail "Less Secure Apps" Error

**Problem:** Gmail rejects login

**Solution:**
Gmail no longer supports "less secure apps." Use App Passwords:

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Use the 16-character password

### SendGrid Rate Limits

**Problem:** Emails stop sending after certain volume

**Solution:**
```typescript
// Implement queue system
// Use Bull or similar job queue
import Queue from 'bull';

const emailQueue = new Queue('emails');

emailQueue.process(async (job) => {
  await sendEmail(job.data.to, job.data.subject, job.data.messages);
});

// Add to queue instead of sending directly
emailQueue.add({ to, subject, messages });
```

### Email Delivery Issues

**Problem:** Emails marked as spam

**Solutions:**

1. **Configure SPF Record:**
```dns
TXT @ "v=spf1 include:_spf.google.com ~all"
```

2. **Configure DKIM:**
Follow your SMTP provider's DKIM setup guide

3. **Configure DMARC:**
```dns
TXT _dmarc "v=DMARC1; p=none; rua=mailto:admin@totolaw.org"
```

4. **Use Dedicated IP (SendGrid, etc.):**
Purchase dedicated IP address for better reputation

---

## Development Issues

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3441`

**Solutions:**

**1. Kill Process Using Port:**
```bash
# Find process
lsof -ti:3441

# Kill process
kill -9 $(lsof -ti:3441)
```

**2. Use Different Port:**
```json
// package.json
"scripts": {
  "dev": "next dev -p 3442"
}
```

### Hot Reload Not Working

**Problem:** Changes not reflected automatically

**Solutions:**

**1. Check File Watcher Limits:**
```bash
# Increase file watcher limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**2. Clear Next.js Cache:**
```bash
rm -rf .next
npm run dev
```

### TypeScript Errors

**Problem:** Type errors in development

**Solutions:**

**1. Restart TypeScript Server:**
In VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

**2. Update Types:**
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

**3. Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

## Deployment Issues

### PM2 Process Crashes

**Problem:** Application keeps restarting or crashing

**Solutions:**

**1. Check Logs:**
```bash
pm2 logs totolaw --lines 100
```

**2. Increase Memory Limit:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'totolaw',
    max_memory_restart: '2G', // Increase from 1G
  }]
};
```

**3. Check Error Logs:**
```bash
tail -f /var/log/totolaw/error.log
```

### Nginx 502 Bad Gateway

**Problem:** Nginx shows 502 error

**Solutions:**

**1. Check Application is Running:**
```bash
pm2 status
pm2 restart totolaw
```

**2. Verify Port Configuration:**
```nginx
# /etc/nginx/sites-available/totolaw
upstream totolaw_app {
    server 127.0.0.1:3440; # Match PM2 port
}
```

**3. Check Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

**Problem:** HTTPS not working or certificate expired

**Solutions:**

**1. Renew Certificate:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

**2. Check Certificate Status:**
```bash
sudo certbot certificates
```

**3. Test Auto-Renewal:**
```bash
sudo certbot renew --dry-run
```

---

## Performance Issues

### Slow Page Load Times

**Problem:** Application loads slowly

**Solutions:**

**1. Enable Production Mode:**
```bash
NODE_ENV=production npm start
```

**2. Build Optimization:**
```bash
npm run build
# Check for warnings about large bundles
```

**3. Enable Nginx Caching:**
```nginx
# Add to Nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=totolaw_cache:10m;

location / {
    proxy_cache totolaw_cache;
    proxy_cache_valid 200 10m;
}
```

### High Memory Usage

**Problem:** Server running out of memory

**Solutions:**

**1. Monitor Memory:**
```bash
pm2 monit
free -h
```

**2. Optimize Database Queries:**
Use select specific columns, add limits, use indexes

**3. Enable Clustering:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
  }]
};
```

### Database Connection Pool Exhausted

**Problem:** `Too many clients` error

**Solutions:**

**1. Increase Pool Size:**
```typescript
// lib/drizzle/connection.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increase from default 10
});
```

**2. Close Connections:**
Ensure connections are properly closed after use

**3. Optimize Queries:**
Reduce number of concurrent database operations

---

## Getting More Help

If your issue isn't covered here:

1. **Check Logs:**
   - Application: `pm2 logs totolaw`
   - Nginx: `/var/log/nginx/totolaw.error.log`
   - PostgreSQL: `/var/log/postgresql/postgresql-14-main.log`

2. **Enable Debug Mode:**
   ```env
   NODE_ENV=development
   DEBUG=*
   ```

3. **Search GitHub Issues:**
   - [Totolaw Issues](https://github.com/taiatiniyara/totolaw/issues)
   - [Better Auth Issues](https://github.com/better-auth/better-auth/issues)
   - [Next.js Issues](https://github.com/vercel/next.js/issues)

4. **Contact Support:**
   - Email: support@totolaw.org
   - Include: error logs, configuration (redact secrets), steps to reproduce

---

**Troubleshooting guide for Totolaw 🔧**
