# Email Notification System - Quick Setup Guide

This is a quick reference for setting up the email notification system. For complete documentation, see [email-notifications.md](./email-notifications.md).

## ⚡ Quick Start (5 minutes)

### 1. Gmail Setup (Easiest for Testing)

1. **Enable 2FA** on your Google Account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Create password for "Mail"
   - Copy the 16-character password

3. **Update `.env`**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Test**:
```bash
npm run dev
# Try creating a user invitation from the dashboard
```

### 2. Production Setup (SendGrid)

1. **Sign up** at https://sendgrid.com/
2. **Create API Key** with "Mail Send" permission
3. **Update `.env`**:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=465
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📧 What Gets Emailed Automatically

The system automatically sends emails for:

✅ **User invitations** - When admins invite users  
✅ **Join request submitted** - Confirmation to user  
✅ **Join request received** - Notification to admins  
✅ **Join request approved** - Approval notification  
✅ **Join request rejected** - Rejection notification  

All of these work out-of-the-box once SMTP is configured!

## 🎨 Email Preview

All emails include:
- Professional design with your brand colors
- Clear call-to-action buttons
- Mobile-responsive layout
- Security notices
- Fallback text links

## 🔍 Troubleshooting

### Emails not sending?

1. **Check environment variables**:
```bash
echo $SMTP_HOST
echo $SMTP_USER
```

2. **Check logs**:
```bash
npm run dev
# Look for email-related errors in console
```

3. **Test SMTP connection**:
```bash
node -e "require('./lib/services/email.service').sendEmail('test@example.com', 'Test', ['Test']).then(console.log)"
```

### Emails going to spam?

- For production, use SendGrid/AWS SES (not Gmail)
- Configure SPF/DKIM records for your domain
- Use a professional email address

## 🚀 Next Steps

1. ✅ Configure SMTP settings
2. ✅ Test user invitation flow
3. ✅ Test join request flow
4. ✅ Review email templates in dashboard
5. ✅ Set up production email provider

## 📚 Additional Resources

- [Complete Documentation](./email-notifications.md)
- [Environment Variables](./.env.example)
- [User Invitation System](./user-invitation-system.md)
- [Troubleshooting Guide](./troubleshooting.md)

## 💡 Pro Tips

- **Development**: Use Gmail or Mailhog
- **Production**: Use SendGrid or AWS SES
- **Never commit** your `.env` file to git
- **Test all email flows** before going live
- **Monitor email delivery** via your SMTP provider dashboard

---

**Need help?** See the [complete documentation](./email-notifications.md) or [troubleshooting guide](./troubleshooting.md).
