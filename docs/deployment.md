# Deployment Guide

This guide covers deploying Totolaw to production environments, including server setup, configuration, and maintenance procedures.

## Prerequisites

Before deploying to production, ensure you have:

- A Linux server (Ubuntu 20.04+ recommended)
- Node.js 20+ installed
- PostgreSQL 14+ installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- SMTP service for email
- SSH access to the server

## Deployment Options

### Option 1: Traditional VPS Deployment

Recommended for self-hosted solutions with full control.

### Option 2: Vercel Deployment

Quick deployment with automatic scaling (see Vercel section below).

### Option 3: Docker Deployment

Containerized deployment for easy scaling (see Docker section below).

---

## VPS Deployment (Recommended)

### Step 1: Server Setup

#### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Install PM2

```bash
sudo npm install -g pm2
```

#### Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Database Setup

#### Create Database User

```bash
sudo -u postgres psql

-- In PostgreSQL prompt:
CREATE DATABASE totolaw;
CREATE USER totolaw_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE totolaw TO totolaw_user;
\q
```

#### Configure PostgreSQL for Remote Access (if needed)

Edit `/etc/postgresql/14/main/postgresql.conf`:

```conf
listen_addresses = 'localhost'
```

Edit `/etc/postgresql/14/main/pg_hba.conf`:

```conf
local   totolaw         totolaw_user                          md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

### Step 3: Application Deployment

#### Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/taiatiniyara/totolaw.git
sudo chown -R $USER:$USER totolaw
cd totolaw
```

#### Install Dependencies

```bash
npm install --production
```

#### Configure Environment

Create `.env.local`:

```bash
nano .env.local
```

Add production configuration:

```env
# Application URLs
BETTER_AUTH_URL=https://totolaw.org
NEXT_PUBLIC_APP_URL=https://totolaw.org

# Authentication
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Database
DATABASE_URL=postgresql://totolaw_user:your_secure_password@localhost:5432/totolaw

# SMTP Configuration (Production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=465
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# Optional: Node Environment
NODE_ENV=production
```

#### Initialize Database

```bash
npm run db-push
```

#### Build Application

```bash
npm run build
```

### Step 4: PM2 Configuration

#### Create PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'totolaw',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/totolaw',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3440
    },
    error_file: '/var/log/totolaw/error.log',
    out_file: '/var/log/totolaw/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
};
```

#### Create Log Directory

```bash
sudo mkdir -p /var/log/totolaw
sudo chown -R $USER:$USER /var/log/totolaw
```

#### Start Application

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Follow the instructions from `pm2 startup` to enable PM2 on system boot.

### Step 5: Nginx Configuration

#### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/totolaw
```

Add configuration:

```nginx
upstream totolaw_app {
    server 127.0.0.1:3440;
    keepalive 64;
}

server {
    listen 80;
    server_name totolaw.org www.totolaw.org;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name totolaw.org www.totolaw.org;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/totolaw.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/totolaw.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logging
    access_log /var/log/nginx/totolaw.access.log;
    error_log /var/log/nginx/totolaw.error.log;

    # Client body size
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://totolaw_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://totolaw_app;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # Public assets
    location /public/ {
        proxy_pass http://totolaw_app;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }
}
```

#### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/totolaw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

#### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### Obtain Certificate

```bash
sudo certbot --nginx -d totolaw.org -d www.totolaw.org
```

Follow the prompts and choose to redirect HTTP to HTTPS.

#### Auto-renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

### Step 7: Firewall Configuration

```bash
# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

### Step 8: Monitoring and Logging

#### View PM2 Logs

```bash
pm2 logs totolaw
pm2 logs totolaw --lines 100
```

#### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/totolaw.access.log
sudo tail -f /var/log/nginx/totolaw.error.log
```

#### PM2 Monitoring

```bash
pm2 monit
pm2 status
```

---

## Vercel Deployment

For quick, managed deployment:

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub:

```bash
git push origin main
```

### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `totolaw` repository

### Step 3: Configure Environment Variables

Add in Vercel dashboard:

```env
BETTER_AUTH_URL=https://your-project.vercel.app
BETTER_AUTH_SECRET=<your-secret>
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
DATABASE_URL=<your-postgres-url>
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=465
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-key>
```

### Step 4: Deploy

Click "Deploy" and Vercel will:
- Build your application
- Deploy to edge network
- Provide preview URLs
- Auto-deploy on git push

### Step 5: Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3440
ENV PORT 3440
CMD ["node", "server.js"]
```

### docker-compose.yml

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3440:3440"
    environment:
      - BETTER_AUTH_URL=https://totolaw.org
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - NEXT_PUBLIC_APP_URL=https://totolaw.org
      - DATABASE_URL=postgresql://totolaw:password@db:5432/totolaw
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=totolaw
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=totolaw
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Post-Deployment

### Initial Verification

1. ✅ Access application at your domain
2. ✅ Test magic link authentication
3. ✅ Verify email sending works
4. ✅ Check database connectivity
5. ✅ Test all major features
6. ✅ Review error logs

### Security Checklist

- [ ] HTTPS enabled and enforced
- [ ] Strong `BETTER_AUTH_SECRET` set
- [ ] Database password is secure
- [ ] Firewall configured
- [ ] Regular backups enabled
- [ ] Security headers configured
- [ ] SMTP credentials secured
- [ ] SSH key-based authentication
- [ ] Fail2ban installed (optional)
- [ ] Regular security updates scheduled

### Performance Optimization

- [ ] Enable Nginx gzip compression
- [ ] Configure CDN (Cloudflare, etc.)
- [ ] Set up database connection pooling
- [ ] Enable Next.js caching
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Enable HTTP/2

### Monitoring Setup

- [ ] Application uptime monitoring
- [ ] Error tracking (Sentry, etc.)
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] SSL certificate expiry alerts
- [ ] Disk space monitoring
- [ ] Email delivery monitoring

---

## Maintenance

### Updates

#### Application Updates

```bash
cd /var/www/totolaw
git pull origin main
npm install
npm run build
pm2 restart totolaw
```

#### Database Migrations

```bash
npm run db-push
```

### Backups

#### Database Backup

Create backup script `/usr/local/bin/backup-totolaw.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/totolaw"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U totolaw_user totolaw | gzip > $BACKUP_DIR/totolaw_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

Make executable and schedule:

```bash
sudo chmod +x /usr/local/bin/backup-totolaw.sh
sudo crontab -e
```

Add daily backup at 2 AM:

```cron
0 2 * * * /usr/local/bin/backup-totolaw.sh
```

#### File Backup

```bash
# Backup application files
tar -czf /var/backups/totolaw/totolaw_files_$(date +%Y%m%d).tar.gz /var/www/totolaw
```

### Rollback Procedure

```bash
# Stop application
pm2 stop totolaw

# Restore database
gunzip < /var/backups/totolaw/totolaw_YYYYMMDD.sql.gz | psql -U totolaw_user totolaw

# Restore files
cd /var/www
sudo rm -rf totolaw
sudo tar -xzf /var/backups/totolaw/totolaw_files_YYYYMMDD.tar.gz

# Restart
pm2 start totolaw
```

---

## Troubleshooting

### Application Won't Start

Check PM2 logs:
```bash
pm2 logs totolaw --lines 50
```

Common issues:
- Port 3440 already in use
- Missing environment variables
- Database connection failed
- Build artifacts missing

### Database Connection Issues

Test connection:
```bash
psql -U totolaw_user -d totolaw -h localhost
```

Check PostgreSQL status:
```bash
sudo systemctl status postgresql
```

### Email Not Sending

Verify SMTP settings in `.env.local`
Check application logs for email errors
Test SMTP connection with a script

### SSL Certificate Issues

Renew certificate:
```bash
sudo certbot renew
sudo systemctl reload nginx
```

Check certificate status:
```bash
sudo certbot certificates
```

### High Memory Usage

Restart PM2:
```bash
pm2 restart totolaw
```

Adjust PM2 memory limits in `ecosystem.config.js`

---

## Performance Tuning

### PostgreSQL Tuning

Edit `/etc/postgresql/14/main/postgresql.conf`:

```conf
# Memory
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB

# Connections
max_connections = 100

# Checkpoints
checkpoint_completion_target = 0.9
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### PM2 Clustering

Adjust instances in `ecosystem.config.js`:

```javascript
instances: 'max', // Use all CPU cores
// or
instances: 4, // Specific number
```

### Nginx Caching

Add to Nginx config:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=totolaw_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache totolaw_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_bypass $http_cache_control;
    # ... other settings
}
```

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database properly set up and migrated
- [ ] HTTPS enabled and enforced
- [ ] Email sending tested
- [ ] Backups configured and tested
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] Performance optimizations applied
- [ ] Security headers configured
- [ ] Firewall rules set
- [ ] DNS properly configured
- [ ] SSL certificate valid
- [ ] Application tested end-to-end
- [ ] Documentation updated
- [ ] Team trained on deployment process

---

**Your Totolaw instance is now ready for production! 🚀**
