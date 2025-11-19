# Totolaw Scripts

This directory contains utility scripts for system administration, testing, and setup.

## Available Scripts

### 1. System Admin Setup (`setup-admin.ts`)
Create the initial system administrator for your Totolaw instance.

### 2. Seed Fiji Courts (`seed-fiji-courts.ts`)
Seed the database with Fiji court hierarchy, courtrooms, and legal representatives.

### 3. Email Testing (`test-email.ts`)
Test the email notification system and verify SMTP configuration.

### 4. Clear Rate Limit (`clear-rate-limit.ts`)
Clear rate limit entries for troubleshooting login issues.

### 5. Seed Managed Lists (`seed-managed-lists.ts`)
Initialize or reset system-level managed lists (court levels, case statuses, offense types, etc.).

---

The `setup-admin.ts` script provides an interactive way to create the initial super administrator for your Totolaw instance.

### Prerequisites

- Database connection configured in environment variables
- Node.js and npm installed
- Project dependencies installed (`npm install`)
- Database schema already pushed (`npm run db-push`)

### Usage

Run the setup script to create your first system administrator:

```bash
npm run setup-admin
```

The script will interactively prompt you for:
1. **Email address** - The admin's email for magic link authentication
2. **Full name** - The admin's display name

**Example session:**
```
🛡️  Initial System Administrator Setup

This will create the first super admin for your Totolaw instance.

Enter admin email address: admin@courts.gov.fj
Enter admin full name: Chief Justice

✅ Super admin created successfully!
📧 Email: admin@courts.gov.fj
👤 Name: Chief Justice

📝 Next steps:
1. The admin can now log in at /auth/login
2. They will receive a magic link at their email address
3. After login, they will have full system access
```

### What It Does

The script will:
1. **Check for existing user** - If the email already exists, it updates them to super admin
2. **Create new user** - If the email is new, it creates a new user with super admin privileges
3. **Set permissions** - Marks the user with `is_super_admin = true`
4. **Add metadata** - Records when and why the admin was added

### After Setup

Once the initial admin is created:
- They can log in at `/auth/login` using their email
- They'll receive a magic link for authentication
- They'll have full system access to manage the entire system

### Security Notes

- ⚠️ **Run only once**: This is for initial setup only
- ⚠️ **Super admin power**: This user will have complete system access

### Adding More Admins

After the initial setup, additional super admins can be managed via the UI at `/dashboard/system-admin`

---

## Seed Fiji Courts Script

The `seed-fiji-courts.ts` script seeds your database with the complete Fiji court system hierarchy.

### Usage

```bash
tsx scripts/seed-fiji-courts.ts
```

### What It Seeds

1. **Court Organisations**
   - Fiji Court System (root)
   - Court of Appeal
   - High Court (Criminal & Civil Divisions)
   - Magistrates' Courts (Suva, Nadi, Lautoka, Labasa, Nausori)
   - Tribunals (Agricultural, Small Claims)

2. **Courtrooms**
   - HIGH COURT ROOM NO. 1, 2, 4, 10, 13

3. **Legal Representatives**
   - Director of Public Prosecutions
   - Legal Aid Commission
   - Attorney General's Office
   - Common law firms

### When to Use

- Initial system setup for Fiji courts
- Development/testing environment setup
- After database reset

---

## Seed Managed Lists Script

The `seed-managed-lists.ts` script initializes or updates system-level managed lists with default values.

### Usage

```bash
npm run seed:managed-lists
```

Or manually:
```bash
source .env.local && npx tsx scripts/seed-managed-lists.ts
```

### What It Seeds

This script creates or updates the following system-level managed lists:

1. **Court Levels** - High Court, Magistrates Court, Court of Appeal, Tribunal
2. **Case Types** - Criminal, Civil, Family, Appeal, Agricultural, Small Claims
3. **Case Statuses** - Pending, Active, In Progress, Closed, Archived, Appealed, Dismissed
4. **Hearing Action Types** - Mention, Trial, Bail Hearing, Sentencing, etc.
5. **Offense Types** - Common criminal offenses in Fiji
6. **Bail Decisions** - Not decided, Granted, Denied, Continued
7. **Sentence Types** - Imprisonment, Fine, Community Service, etc.
8. **Appeal Types** - Criminal Appeal, Civil Appeal, Bail Application, etc.

### When to Use

- **Initial setup**: After running migrations to populate default lists
- **Updates**: When new list items are added to the system
- **Reset**: To restore system defaults if lists were modified
- **Development**: To ensure test environments have consistent data

### Safe to Re-run

This script is safe to run multiple times:
- Existing lists will be updated with latest items
- No data loss - only system lists are affected
- Organization-specific customizations are preserved

### Example Output

```
🌱 Seeding managed lists...

Seeding: Court Levels (court_levels)
  ✓ Created with 4 items

Seeding: Case Types (case_types)
  ✓ Created with 6 items

Seeding: Case Statuses (case_statuses)
  ✓ Created with 7 items

Seeding: Hearing Action Types (action_types)
  ✓ Created with 12 items

Seeding: Common Offense Types (offense_types)
  ✓ Created with 10 items

Seeding: Bail Decisions (bail_decisions)
  ✓ Created with 4 items

Seeding: Sentence Types (sentence_types)
  ✓ Created with 6 items

Seeding: Appeal Types (appeal_types)
  ✓ Created with 4 items

✅ Successfully seeded all managed lists!

✨ Done!
```

### Integration with System

These managed lists are used throughout the application:
- Case creation forms use court levels and case types
- Hearing forms use action types
- Criminal cases use offense types
- Status dropdowns use case statuses

See `documentation/28-managed-lists.md` for complete usage documentation.

---

## Clear Rate Limit Script

The `clear-rate-limit.ts` script clears all rate limit entries from the database.

### Usage

```bash
tsx scripts/clear-rate-limit.ts
```

### When to Use

- User locked out due to too many failed login attempts
- Testing authentication flows
- Troubleshooting login issues

---

## Email Testing Script

The `test-email.ts` script allows you to test the email notification system and verify your SMTP configuration.

### Prerequisites

- SMTP settings configured in `.env` file
- Valid email credentials
- Project dependencies installed

### Usage

**Test a single template:**
```bash
tsx scripts/test-email.ts your-email@example.com invitation
```

**Test all templates:**
```bash
tsx scripts/test-email.ts your-email@example.com all
```

**View available templates:**
```bash
tsx scripts/test-email.ts
```

### Available Templates

- `invitation` - User invitation email
- `join-submitted` - Join request confirmation
- `join-received` - Admin notification for join requests
- `join-approved` - Join request approved
- `join-rejected` - Join request rejected
- `magic-link` - Magic link authentication
- `password-reset` - Password reset
- `welcome` - Welcome email
- `role-changed` - Role update notification
- `user-removed` - User removal notification
- `case-assigned` - Case assignment
- `hearing-reminder` - Hearing reminder
- `system` - System notification

### Example Session

```
🚀 Totolaw Email Testing Utility

==================================================
✅ SMTP Configuration:
   Host: smtp.gmail.com
   Port: 465
   User: admin@example.com
==================================================

📧 Testing invitation template...
📮 Sending to: test@example.com
✅ invitation email sent successfully!
📋 Subject: You're invited to join Supreme Court of Fiji on Totolaw

==================================================
📬 Check your inbox at: test@example.com

💡 Tips:
   - Check spam folder if you don't see the email
   - For Gmail, enable 'Less secure app access' if needed
   - Check your SMTP provider dashboard for delivery status
   - Review console logs for any error messages
```

### Troubleshooting

If emails aren't sending:

1. **Verify environment variables:**
   ```bash
   echo $SMTP_HOST
   echo $SMTP_USER
   ```

2. **Check credentials:** Make sure SMTP credentials are correct

3. **Test connection:** Try sending a test email

4. **Check firewall:** Ensure ports 465 (SSL) or 587 (TLS) are open

5. **Review logs:** Check console output for error messages

### SMTP Configuration

See `.env.example` for complete SMTP configuration examples for:
- Gmail
- SendGrid
- AWS SES
- Mailgun
- Other providers

---

**Totolaw System Administration Scripts** 🛡️  
**Made with ❤️ for Pacific Island Court Systems** 🌴
