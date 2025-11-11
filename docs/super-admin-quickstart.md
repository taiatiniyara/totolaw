# Super Admin Quick Start Guide

## 🚀 First Time Setup (5 minutes)

### 1. Add Your Team Using CLI

Use the admin management CLI to add your team:

```bash
npm run admin:add your-email@example.com "Your Name"
```

Or add multiple admins:

```bash
npm run admin:add chief-justice@courts.gov.fj "Chief Justice"
npm run admin:add admin@courts.gov.fj "Senior Administrator"
npm run admin:add tech@totolaw.org "Technical Lead"
```

### 2. Verify Admins Were Added

```bash
npm run admin:list
```

### 3. Log In

Go to `/auth/login` and use magic link with your registered email.

### 4. Access Super Admin Dashboard

Navigate to `/dashboard/system-admin`

---

## 📋 Common Tasks

### Add a New System Admin

**Via UI:**
1. Go to `/dashboard/system-admin/admins`
2. Click "Add System Admin"
3. Enter email, name, and optional notes
4. Click "Add Admin"

**Via Database:**
```sql
SELECT add_system_admin('admin@example.com', 'Admin Name', 'Optional notes');
```

### Create a New Organization

**Via UI:**
1. Go to `/dashboard/system-admin/organizations`
2. Click "Add Organization"
3. Fill in details (name, code, type)
4. Submit

**Via Database:**
```sql
INSERT INTO organizations (id, name, code, type, description, is_active)
VALUES (gen_random_uuid()::text, 'Fiji', 'FJ', 'country', 'Republic of Fiji', true);
```

### Remove Admin Access

**Via UI:**
1. Go to `/dashboard/system-admin/admins`
2. Find the admin
3. Click "Deactivate"
4. Confirm

**Via Database:**
```sql
SELECT remove_system_admin('admin@example.com');
```

### View Audit Logs

**Via UI:**
1. Go to `/dashboard/system-admin/audit`
2. View recent actions
3. Filter by admin or date

**Via Database:**
```sql
SELECT * FROM system_admin_audit_log 
ORDER BY created_at DESC 
LIMIT 50;
```

---

## 🔍 Quick Checks

### Verify You're a Super Admin

```sql
SELECT email, is_super_admin FROM "user" WHERE email = 'your-email@example.com';
```

### List All System Admins

```sql
SELECT * FROM list_system_admins();
```

### Check Who's Logged In Recently

```sql
SELECT email, name, last_login 
FROM system_admins 
WHERE is_active = true 
ORDER BY last_login DESC;
```

---

## 🛠️ Troubleshooting

### Not seeing super admin menu?

1. Check email is registered:
```sql
SELECT * FROM system_admins WHERE email = 'your-email@example.com';
```

2. Check user flag:
```sql
SELECT is_super_admin FROM "user" WHERE email = 'your-email@example.com';
```

3. Log out and log back in

### Can't deactivate an admin?

Ensure you're logged in as a super admin and the admin exists.

### Lost all admin access?

Connect to database directly:
```sql
SELECT reactivate_system_admin('your-email@example.com');
UPDATE "user" SET is_super_admin = true WHERE email = 'your-email@example.com';
```

---

## 📚 Full Documentation

See [docs/system-admin-team.md](./system-admin-team.md) for complete documentation.

---

## 🔐 Security Reminders

- ✅ Only add trusted team members
- ✅ Use official email addresses
- ✅ Review admins regularly
- ✅ Document why each admin was added
- ✅ Remove access when no longer needed
- ✅ Monitor audit logs

---

## 📞 Support

For issues or questions:
1. Check full documentation
2. Review audit logs for errors
3. Verify database connectivity
4. Check user and system_admin tables
