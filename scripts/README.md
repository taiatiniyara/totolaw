# Initial System Admin Setup

This directory contains the setup script for creating the first system administrator.

## Setup Script

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

**Totolaw System Administration Setup** 🛡️  
**Made with ❤️ for Pacific Island Court Systems** 🌴
