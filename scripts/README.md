# Admin Management Scripts

This directory contains CLI tools for managing the Totolaw system.

## System Admin CLI

The `manage-admins.ts` script provides command-line tools for managing super administrators.

### Prerequisites

- Database connection configured in environment variables
- Node.js and npm installed
- Project dependencies installed (`npm install`)

### Commands

#### List All Admins

```bash
npm run admin:list
```

Shows all system admins with their status, email, name, and last login.

**Example output:**
```
📋 System Administrators

✅ Active 🔗 Linked
  Email: admin@example.com
  Name: John Doe
  Last Login: 11/10/2025

⏳ Pending ❌ Inactive
  Email: pending@example.com
  Name: Jane Smith
  Last Login: Never
```

#### Add New Admin

```bash
npm run admin:add email@example.com "Admin Name"
```

Adds a new system administrator. They will be automatically elevated to super admin when they log in.

**Example:**
```bash
npm run admin:add chief-justice@courts.gov.fj "Chief Justice"
```

#### Remove/Deactivate Admin

```bash
npm run admin:remove email@example.com
```

Deactivates a system admin and removes their super admin privileges immediately.

**Example:**
```bash
npm run admin:remove old-admin@example.com
```

#### Reactivate Admin

```bash
npm run admin:activate email@example.com
```

Reactivates a previously deactivated admin and restores their super admin privileges.

**Example:**
```bash
npm run admin:activate returning-admin@example.com
```

#### View Audit Log

```bash
npm run admin:audit
```

Shows the last 20 audit log entries for system admin actions.

**Example output:**
```
📜 System Admin Audit Log (Last 20 entries)

[11/10/2025, 10:30:00 AM] created
  New system admin added: admin@example.com
  Entity: system_admin (abc-123-def)
  IP: 192.168.1.1

[11/10/2025, 10:25:00 AM] login
  System admin admin@example.com logged in
  Entity: system_admin (abc-123-def)
```

### Usage Examples

#### Setup Initial Admins

```bash
# Add multiple admins
npm run admin:add cj@courts.gov.fj "Chief Justice"
npm run admin:add admin@courts.gov.fj "Senior Administrator"
npm run admin:add tech@totolaw.org "Technical Lead"

# Verify they were added
npm run admin:list
```

#### Remove Admin Access

```bash
# Deactivate an admin
npm run admin:remove former-admin@example.com

# Check the audit log
npm run admin:audit
```

#### Restore Admin Access

```bash
# Reactivate an admin
npm run admin:activate returning-admin@example.com

# Verify they're active
npm run admin:list
```

### Direct Script Execution

You can also run the script directly with tsx:

```bash
# List admins
tsx scripts/manage-admins.ts list

# Add admin with notes
tsx scripts/manage-admins.ts add email@example.com "Name"

# Remove admin
tsx scripts/manage-admins.ts remove email@example.com
```

### Error Handling

The script will exit with error messages for common issues:

- **Email already exists**: Can't add duplicate admin
- **Admin not found**: Can't remove/activate non-existent admin
- **Missing parameters**: Required parameters not provided

**Example errors:**
```
❌ Error: admin@example.com is already registered as a system admin
❌ Error: System admin notfound@example.com not found
❌ Error: Email and name are required
```

### Security Notes

- ⚠️ **Database access required**: Script needs database credentials
- ⚠️ **No confirmation prompts**: Actions are immediate
- ⚠️ **Audit logged**: All actions are logged in the database
- ⚠️ **Use with care**: This modifies production data

### Troubleshooting

#### Script won't run

**Check:**
1. Environment variables are set
2. Database is accessible
3. Dependencies are installed (`npm install`)

```bash
# Test database connection
npm run admin:list
```

#### Can't add admin

**Common causes:**
- Email already exists (check with `npm run admin:list`)
- Invalid email format
- Database connection issues

#### Admin not elevated after adding

**Solution:**
Admin must log in first. The auto-elevation happens during login.

```bash
# Verify admin was added
npm run admin:list

# Check if email matches exactly (case-insensitive)
```

### Integration with Other Tools

#### Use in CI/CD

```bash
# In your deployment script
npm run admin:add deploy-admin@example.com "Deploy Admin"
```

#### Use in Setup Scripts

```bash
#!/bin/bash
# setup-admins.sh

npm run admin:add admin1@example.com "Admin One"
npm run admin:add admin2@example.com "Admin Two"
npm run admin:list
```

#### Use with Docker

```bash
# In Dockerfile or docker-compose
docker exec totolaw npm run admin:add admin@example.com "Admin"
```

### Related Documentation

- [System Admin Team Guide](../docs/system-admin-team.md)
- [Super Admin Quick Start](../docs/super-admin-quickstart.md)
- [Multi-Tenant RBAC](../docs/multi-tenant-rbac.md)

### Support

For issues or questions:
1. Check the [System Admin documentation](../docs/system-admin-team.md)
2. Review the audit log: `npm run admin:audit`
3. Verify database connectivity
4. Check environment variables

---

**Totolaw System Administration Tools** 🛠️
