# Email Notification System - Deployment Checklist

Use this checklist to deploy the email notification system to your Totolaw instance.

## Pre-Deployment ✅

- [ ] Review the [complete documentation](docs/email-notifications.md)
- [ ] Review the [quick setup guide](docs/email-quick-setup.md)
- [ ] Understand your SMTP provider options

## SMTP Provider Setup 📧

### Option 1: Gmail (Development/Testing)
- [ ] Create/use a Google account for sending emails
- [ ] Enable 2-Factor Authentication
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Note down the 16-character password

### Option 2: SendGrid (Production - Recommended)
- [ ] Sign up at https://sendgrid.com
- [ ] Verify your sender email/domain
- [ ] Create API Key with "Mail Send" permission
- [ ] Note down the API key

### Option 3: AWS SES (Enterprise)
- [ ] Set up AWS account
- [ ] Verify domain in AWS SES
- [ ] Create SMTP credentials
- [ ] Move out of sandbox mode (if needed)

### Option 4: Other Provider
- [ ] Obtain SMTP host, port, username, password
- [ ] Verify SSL/TLS support
- [ ] Check rate limits and quotas

## Environment Configuration 🔧

- [ ] Copy `.env.example` to `.env` (if not exists)
- [ ] Add SMTP credentials to `.env`:
  ```env
  SMTP_HOST=your-smtp-host
  SMTP_PORT=465
  SMTP_USER=your-username
  SMTP_PASS=your-password
  NEXT_PUBLIC_APP_URL=https://your-domain.com
  ```
- [ ] Verify environment variables are set:
  ```bash
  echo $SMTP_HOST
  echo $SMTP_PORT
  echo $SMTP_USER
  ```
- [ ] **NEVER commit `.env` to git!**

## Testing Phase 🧪

### Local Testing
- [ ] Start development server: `npm run dev`
- [ ] Test individual template:
  ```bash
  npm run test-email your-email@example.com invitation
  ```
- [ ] Test all templates:
  ```bash
  npm run test-email your-email@example.com all
  ```
- [ ] Verify emails arrive in inbox (check spam folder)
- [ ] Verify email formatting looks professional
- [ ] Test on mobile device

### Integration Testing
- [ ] Create a test organization
- [ ] Invite a test user - verify invitation email
- [ ] Submit a join request - verify confirmation email
- [ ] Approve a join request - verify approval email
- [ ] Reject a join request - verify rejection email
- [ ] Test role change notification
- [ ] Test all automated flows

## Production Deployment 🚀

### Build & Deploy
- [ ] Ensure SMTP credentials are in production `.env`
- [ ] Build the application: `npm run build`
- [ ] Verify no build errors
- [ ] Deploy to production server
- [ ] Restart application server

### Production Verification
- [ ] Test email sending in production
- [ ] Verify production URL in emails is correct
- [ ] Check email links work correctly
- [ ] Verify SSL certificates on email links
- [ ] Test invitation flow end-to-end
- [ ] Test join request flow end-to-end

## DNS & Email Authentication (Production Only) 🔒

### SPF Record
- [ ] Add SPF record to DNS:
  ```
  v=spf1 include:_spf.example.com ~all
  ```
  (Replace with your SMTP provider's SPF)

### DKIM Record
- [ ] Generate DKIM keys with your SMTP provider
- [ ] Add DKIM TXT records to DNS
- [ ] Verify DKIM setup with provider

### DMARC Record
- [ ] Add DMARC record to DNS:
  ```
  v=DMARC1; p=quarantine; rua=mailto:postmaster@yourdomain.com
  ```

### Verification
- [ ] Test email authentication at https://mxtoolbox.com/emailhealth
- [ ] Send test email and check headers
- [ ] Verify emails don't go to spam

## Monitoring Setup 📊

### SMTP Provider Dashboard
- [ ] Set up account with your SMTP provider
- [ ] Enable delivery notifications
- [ ] Set up bounce handling
- [ ] Configure suppression lists
- [ ] Monitor sending limits/quotas

### Application Monitoring
- [ ] Review application logs for email errors
- [ ] Set up log aggregation (optional)
- [ ] Configure error alerting (optional)
- [ ] Monitor email sending frequency

## Security Checklist 🔐

- [ ] SMTP credentials stored in `.env` only
- [ ] `.env` file NOT committed to git
- [ ] `.env` file NOT accessible via web
- [ ] Using secure SMTP port (465 or 587)
- [ ] Email links use HTTPS in production
- [ ] Token expiration times configured
- [ ] Rate limiting considered (via SMTP provider)

## User Communication 📢

- [ ] Inform users that emails are now enabled
- [ ] Update documentation with email examples
- [ ] Add support contact for email issues
- [ ] Document how to whitelist sender address
- [ ] Provide instructions for checking spam folder

## Post-Deployment Verification ✅

### Day 1
- [ ] Monitor first batch of invitation emails
- [ ] Check delivery rates in SMTP dashboard
- [ ] Verify no emails bouncing
- [ ] Test from multiple email providers (Gmail, Outlook, etc.)
- [ ] Confirm users receiving and able to act on emails

### Week 1
- [ ] Review email delivery statistics
- [ ] Check bounce rates (<5% is good)
- [ ] Monitor spam complaints (<0.1% is good)
- [ ] Verify all email flows working
- [ ] Collect user feedback on email quality

### Month 1
- [ ] Review overall email performance
- [ ] Optimize templates based on feedback
- [ ] Check sender reputation score
- [ ] Verify SMTP costs within budget
- [ ] Plan for any needed improvements

## Troubleshooting Resources 🆘

- [ ] Bookmark [email documentation](docs/email-notifications.md)
- [ ] Bookmark [troubleshooting guide](docs/troubleshooting.md)
- [ ] Save SMTP provider support contact
- [ ] Document common issues and solutions
- [ ] Create internal runbook for email issues

## Rollback Plan 🔄

If issues occur:
- [ ] Have previous deployment ready
- [ ] Document how to disable email notifications
- [ ] Plan for manual user communication
- [ ] Know how to revert environment variables
- [ ] Have SMTP provider support number ready

## Success Criteria 🎯

Email system is successfully deployed when:
- [x] All invitations send automatically
- [x] Join requests notify admins
- [x] Approval/rejection emails work
- [x] Emails arrive within 1 minute
- [x] Emails don't go to spam
- [x] Email links work correctly
- [x] Mobile formatting looks good
- [x] No errors in logs
- [x] Users can complete email flows
- [x] Delivery rate >95%

## Notes & Issues 📝

Document any issues or observations during deployment:

```
Date: _______________
Issue: _______________
Resolution: _______________

Date: _______________
Issue: _______________
Resolution: _______________
```

## Support Contacts 📞

- **SMTP Provider Support:** _______________
- **System Administrator:** _______________
- **Development Team:** _______________
- **Emergency Contact:** _______________

---

## Quick Reference 🚀

### Test Email
```bash
npm run test-email your-email@example.com
```

### Check Logs
```bash
# Development
npm run dev

# Production
pm2 logs totolaw
```

### Common Commands
```bash
# Verify environment
echo $SMTP_HOST

# Restart app
pm2 restart totolaw

# View SMTP dashboard
# (Visit your provider's website)
```

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Sign-off:** _______________  

---

**🎉 Ready to send beautiful notifications!**
