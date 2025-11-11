# Totolaw Scripts

This directory contains utility scripts for system administration and testing.

## Available Scripts

### 1. System Admin Setup (`setup-admin.ts`)

Create the initial system administrator for your Totolaw instance.

### 2. Email Testing (`test-email.ts`)

Test the email notification system and verify SMTP configuration.

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

### Error Handling

The script validates input and provides clear error messages:
- **Invalid email**: Must be a valid email format
- **Invalid name**: Must be at least 2 characters
- **Database errors**: Connection or query issues

### Security Notes

- ⚠️ **Run only once**: This is for initial setup only
- ⚠️ **Database access required**: Needs valid database connection
- ⚠️ **Super admin power**: This user will have complete system access

### Adding More Admins

After the initial setup, additional super admins can be managed via the UI at `/dashboard/system-admin`

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
