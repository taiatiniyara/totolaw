# Deployment Guide

## Overview

This guide covers deploying Totolaw to production environments. The application is designed to run on Linux servers with PostgreSQL database.

## Prerequisites

### System Requirements

- **Operating System:** Linux (Ubuntu 20.04+ recommended)
- **Node.js:** v20.x or higher
- **PostgreSQL:** v14.x or higher
- **RAM:** Minimum 2GB, recommended 4GB+
- **Storage:** Minimum 10GB for database and application
- **Domain:** Registered domain with SSL certificate

### Software Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Certbot (SSL certificates)
sudo apt install -y certbot python3-certbot-nginx
```

## Environment Setup

### 1. Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE totolaw;
CREATE USER totolaw_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE totolaw TO totolaw_user;

# Exit psql
\q
```

### 2. Environment Variables

Create `.env.local` file in project root:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Better Auth
BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=your-very-long-random-secret-min-32-chars

# Database
DATABASE_URL=postgresql://totolaw_user:your_secure_password@localhost:5432/totolaw

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Optional: Email From
EMAIL_FROM=Totolaw <noreply@your-domain.com>
```

### Generating Secure Secrets

```bash
# Generate BETTER_AUTH_SECRET (32+ characters)
openssl rand -base64 32
```

### Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| NODE_ENV | Yes | Set to `production` |
| NEXT_PUBLIC_APP_URL | Yes | Public URL of your application |
| BETTER_AUTH_URL | Yes | Same as NEXT_PUBLIC_APP_URL |
| BETTER_AUTH_SECRET | Yes | Secret key for auth (32+ chars) |
| DATABASE_URL | Yes | PostgreSQL connection string |
| SMTP_HOST | Yes | SMTP server hostname |
| SMTP_PORT | Yes | SMTP port (465 or 587) |
| SMTP_SECURE | Yes | Use SSL/TLS (true for port 465) |
| SMTP_USER | Yes | SMTP username/email |
| SMTP_PASS | Yes | SMTP password/app password |
| EMAIL_FROM | No | From address (default: SMTP_USER) |

## Application Deployment

### 1. Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/taiatiniyara/totolaw.git
cd totolaw

# Set ownership
sudo chown -R $USER:$USER /var/www/totolaw
```

### 2. Install Dependencies

```bash
# Install packages
npm install

# Verify installation
npm list
```

### 3. Database Migrations

```bash
# Push schema to database
npm run db-push

# Verify database connection
npm run db-view  # Opens Drizzle Studio (Ctrl+C to exit)
```

### 4. Build Application

```bash
# Build Next.js application
npm run build

# Verify build
ls -la .next
```

### 5. Create System Admin

```bash
# Run admin setup script
npm run setup-admin

# Follow prompts to create admin user
```

### 6. Test Email Configuration

```bash
# Test email sending
npm run test-email

# Enter email address to receive test email
```

## Process Management with PM2

### 1. Create PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'totolaw',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/totolaw',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3440
    },
    error_file: '/var/log/totolaw/error.log',
    out_file: '/var/log/totolaw/out.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 2. Start Application with PM2

```bash
# Create log directory
sudo mkdir -p /var/log/totolaw
sudo chown -R $USER:$USER /var/log/totolaw

# Start application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs totolaw

# Monitor
pm2 monit
```

### 3. PM2 Startup Script

```bash
# Generate startup script
pm2 startup

# Copy and run the command it outputs (will use sudo)

# Save PM2 process list
pm2 save

# Test reboot persistence
sudo reboot
# After reboot, check: pm2 status
```

### PM2 Commands Reference

```bash
# Start/Stop/Restart
pm2 start totolaw
pm2 stop totolaw
pm2 restart totolaw

# Reload (zero-downtime restart)
pm2 reload totolaw

# Delete from PM2
pm2 delete totolaw

# View logs
pm2 logs totolaw
pm2 logs totolaw --lines 100

# Monitor resources
pm2 monit

# List processes
pm2 list

# Process info
pm2 info totolaw
```

## Nginx Configuration

### 1. Create Nginx Configuration

Create `/etc/nginx/sites-available/totolaw`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    return 301 https://$host$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (Certbot will add these)
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logs
    access_log /var/log/nginx/totolaw_access.log;
    error_log /var/log/nginx/totolaw_error.log;

    # Max upload size
    client_max_body_size 100M;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3440;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3440;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public files caching
    location /public {
        proxy_pass http://localhost:3440;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

### 2. Enable Site and Test

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/totolaw /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

### 3. SSL Certificate with Let's Encrypt

```bash
# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts and choose redirect option

# Test auto-renewal
sudo certbot renew --dry-run

# Auto-renewal is configured via cron/systemd timer
```

## Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

## Database Maintenance

### Backup Database

```bash
# Create backup directory
sudo mkdir -p /var/backups/totolaw

# Backup script
pg_dump -U totolaw_user -h localhost totolaw | gzip > /var/backups/totolaw/backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Verify backup
ls -lh /var/backups/totolaw/
```

### Automated Backups

Create `/usr/local/bin/backup-totolaw.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/totolaw"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql.gz"
DAYS_TO_KEEP=30

# Create backup
pg_dump -U totolaw_user -h localhost totolaw | gzip > $BACKUP_FILE

# Remove old backups
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +$DAYS_TO_KEEP -delete

# Log
echo "$(date): Backup completed: $BACKUP_FILE" >> /var/log/totolaw/backup.log
```

Make executable and schedule:

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-totolaw.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e

# Add line:
0 2 * * * /usr/local/bin/backup-totolaw.sh
```

### Restore Database

```bash
# Stop application
pm2 stop totolaw

# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE totolaw;"
sudo -u postgres psql -c "CREATE DATABASE totolaw OWNER totolaw_user;"

# Restore from backup
gunzip -c /var/backups/totolaw/backup-YYYYMMDD-HHMMSS.sql.gz | \
  psql -U totolaw_user -h localhost totolaw

# Start application
pm2 start totolaw
```

## Monitoring & Logging

### Application Logs

```bash
# PM2 logs
pm2 logs totolaw --lines 100

# Error logs only
pm2 logs totolaw --err

# Follow logs
pm2 logs totolaw --lines 0

# Log files location
ls -lh /var/log/totolaw/
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/totolaw_access.log

# Error logs
sudo tail -f /var/log/nginx/totolaw_error.log
```

### Database Logs

```bash
# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### System Monitoring

```bash
# Check system resources
htop

# Check disk space
df -h

# Check memory
free -h

# Check PM2 metrics
pm2 monit
```

## Updates & Maintenance

### Application Updates

```bash
# Navigate to application directory
cd /var/www/totolaw

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations if needed
npm run db-push

# Rebuild application
npm run build

# Reload PM2 (zero-downtime)
pm2 reload totolaw

# Or restart
pm2 restart totolaw
```

### Database Migrations

```bash
# Check current schema
npm run db-view

# Apply new migrations
npm run db-push

# Verify changes
npm run db-view
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs totolaw --err

# Check environment variables
cat .env.local

# Test build
npm run build

# Check port availability
sudo lsof -i :3440
```

### Database Connection Issues

```bash
# Test database connection
psql -U totolaw_user -h localhost -d totolaw

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Email Not Sending

```bash
# Test email configuration
npm run test-email

# Check SMTP settings in .env.local
# Verify SMTP credentials
# Check firewall allows outbound SMTP port
```

### SSL Certificate Issues

```bash
# Test SSL
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

### High Memory Usage

```bash
# Check PM2 memory usage
pm2 list

# Restart PM2 process
pm2 restart totolaw

# Reduce PM2 instances
# Edit ecosystem.config.js, set instances to 2
pm2 reload ecosystem.config.js
```

## Security Best Practices

### 1. Keep System Updated

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
npm audit
npm audit fix
```

### 2. Secure PostgreSQL

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Ensure localhost only
# local   all             all                                     md5
# host    all             all             127.0.0.1/32            md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3. Firewall Rules

```bash
# Only allow necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 4. Secure Environment Variables

```bash
# Restrict .env.local permissions
chmod 600 .env.local

# Never commit .env.local to git
# Verify: git status
```

### 5. Enable Fail2Ban

```bash
# Install fail2ban
sudo apt install fail2ban

# Configure for Nginx
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Add:
[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

# Restart
sudo systemctl restart fail2ban
```

## Performance Optimization

### 1. Enable Gzip Compression

Already enabled in Next.js by default.

### 2. Database Optimization

```sql
-- Add indexes for common queries
-- (Already in schema, verify):
\d+ organisations
\d+ cases
```

### 3. PM2 Cluster Mode

Already configured in ecosystem.config.js with `instances: 'max'`.

### 4. CDN for Static Assets

Consider using a CDN like Cloudflare for static assets:
- `/_next/static/*`
- `/public/*`

## Monitoring Setup (Optional)

### PM2 Plus (Monitoring)

```bash
# Sign up at https://app.pm2.io
# Link PM2
pm2 link <secret_key> <public_key>

# Monitor metrics, logs, and performance
```

---

**Next:** [Development Guide →](09-development-guide.md)
