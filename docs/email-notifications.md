# Email Notification System

## Overview

The Totolaw platform includes a comprehensive email notification system that sends automated emails for important events such as user invitations, organization join requests, role changes, case assignments, and more.

## Architecture

The notification system consists of three main layers:

### 1. Email Service (`lib/services/email.service.ts`)
- Low-level email sending using Nodemailer
- SMTP configuration and transporter setup
- HTML email template wrapper

### 2. Email Templates (`lib/services/email-templates.service.ts`)
- Pre-designed email templates for all notification types
- Consistent styling and branding
- Reusable template functions

### 3. Notification Service (`lib/services/notification.service.ts`)
- High-level notification API
- Business logic for determining recipients
- Integration with other services

## Setup

### 1. Install Dependencies

The required packages are already included in `package.json`:

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### 2. Configure SMTP Settings

Add the following environment variables to your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

See `.env.example` for detailed configuration examples for different email providers.

### 3. SMTP Provider Setup

#### Gmail Setup (Recommended for Development)

1. Enable 2-Factor Authentication in your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this 16-character password as `SMTP_PASS`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

#### SendGrid Setup (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key with "Mail Send" permissions
3. Configure:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=465
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### AWS SES Setup (Enterprise)

1. Verify your domain in AWS SES
2. Create SMTP credentials
3. Configure:

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=465
SMTP_USER=your-aws-smtp-username
SMTP_PASS=your-aws-smtp-password
```

## Available Notifications

### User Management

#### 1. User Invitation
**Trigger:** When an admin invites a new user to join an organization

```typescript
import { notifyUserInvitation } from "@/lib/services/notification.service";

await notifyUserInvitation(
  email,
  organisationName,
  inviterName,
  invitationToken,
  expiryDays
);
```

#### 2. Join Request Submitted
**Trigger:** When a user submits a request to join an organization

```typescript
import { notifyJoinRequestSubmitted } from "@/lib/services/notification.service";

await notifyJoinRequestSubmitted(
  userEmail,
  userName,
  organisationName
);
```

#### 3. Join Request Notification (to Admins)
**Trigger:** When a new join request is created

```typescript
import { notifyAdminsOfJoinRequest } from "@/lib/services/notification.service";

await notifyAdminsOfJoinRequest(
  organisationId,
  userName,
  userEmail,
  organisationName,
  message,
  requestId
);
```

#### 4. Join Request Approved
**Trigger:** When an admin approves a join request

```typescript
import { notifyJoinRequestApproved } from "@/lib/services/notification.service";

await notifyJoinRequestApproved(
  userEmail,
  userName,
  organisationName
);
```

#### 5. Join Request Rejected
**Trigger:** When an admin rejects a join request

```typescript
import { notifyJoinRequestRejected } from "@/lib/services/notification.service";

await notifyJoinRequestRejected(
  userEmail,
  userName,
  organisationName,
  reason
);
```

#### 6. Role Changed
**Trigger:** When a user's role is updated

```typescript
import { notifyRoleChanged } from "@/lib/services/notification.service";

await notifyRoleChanged(
  userEmail,
  userName,
  organisationName,
  ["Judge", "Administrator"],
  changedByName
);
```

#### 7. User Removed
**Trigger:** When a user is removed from an organization

```typescript
import { notifyUserRemoved } from "@/lib/services/notification.service";

await notifyUserRemoved(
  userEmail,
  userName,
  organisationName,
  removedByName,
  reason
);
```

### Authentication

#### 8. Magic Link
**Trigger:** When a user requests a magic link to log in

```typescript
import { notifyMagicLink } from "@/lib/services/notification.service";

await notifyMagicLink(email, magicLinkUrl);
```

#### 9. Password Reset
**Trigger:** When a user requests a password reset

```typescript
import { notifyPasswordReset } from "@/lib/services/notification.service";

await notifyPasswordReset(email, userName, resetLink);
```

#### 10. Welcome Email
**Trigger:** When a new user account is created

```typescript
import { notifyWelcome } from "@/lib/services/notification.service";

await notifyWelcome(email, userName, organisationName);
```

### Case Management

#### 11. Case Assignment
**Trigger:** When a user is assigned to a case

```typescript
import { notifyCaseAssigned } from "@/lib/services/notification.service";

await notifyCaseAssigned(
  userEmail,
  userName,
  caseNumber,
  caseTitle,
  assignedByName,
  caseId
);
```

#### 12. Hearing Reminder
**Trigger:** Before a scheduled hearing (via scheduled job)

```typescript
import { notifyHearingReminder } from "@/lib/services/notification.service";

await notifyHearingReminder(
  userEmail,
  userName,
  caseNumber,
  hearingDate,
  hearingTime,
  location,
  hearingId
);
```

### Generic Notifications

#### 13. System Notification
**Trigger:** For custom system-wide notifications

```typescript
import { notifySystem } from "@/lib/services/notification.service";

await notifySystem(
  userEmail,
  userName,
  "System Maintenance Scheduled",
  "The system will be under maintenance on...",
  "View Details",
  "https://example.com/maintenance"
);
```

## Email Template Customization

### Modifying Templates

Email templates are located in `lib/services/email-templates.service.ts`. Each template function returns an object with:

```typescript
interface EmailTemplate {
  subject: string;
  paragraphs: string[];
}
```

### Template Styling

Templates use inline CSS for maximum email client compatibility. Key style elements:

- **Primary Color:** `#7c3aed` (Purple)
- **Success Color:** `#10b981` (Green)
- **Warning Color:** `#f59e0b` (Orange)
- **Error Color:** `#ef4444` (Red)

### Adding a New Template

1. Create a new template function in `email-templates.service.ts`:

```typescript
export function myCustomTemplate(
  userName: string,
  customData: string
): EmailTemplate {
  return {
    subject: `Custom notification for ${userName}`,
    paragraphs: [
      `Hello ${userName}!`,
      `Your custom message here: ${customData}`,
      createButton("Take Action", "https://example.com/action"),
    ],
  };
}
```

2. Add a corresponding notification function in `notification.service.ts`:

```typescript
export async function notifyCustomEvent(
  email: string,
  userName: string,
  customData: string
): Promise<void> {
  const template = templates.myCustomTemplate(userName, customData);
  await sendEmail(email, template.subject, template.paragraphs);
}
```

3. Use it in your application:

```typescript
import { notifyCustomEvent } from "@/lib/services/notification.service";

await notifyCustomEvent(user.email, user.name, "Important data");
```

## Testing Emails

### Local Testing with Mailhog

For local development, you can use [Mailhog](https://github.com/mailhog/MailHog) to capture emails:

1. Install Mailhog:
```bash
# macOS
brew install mailhog

# Linux
wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64
chmod +x MailHog_linux_amd64
```

2. Start Mailhog:
```bash
mailhog
```

3. Configure your `.env`:
```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test
```

4. View emails at: http://localhost:8025

### Testing with Gmail

For testing with Gmail, create a separate test account to avoid issues with your primary email.

## Error Handling

The email service includes built-in error handling:

```typescript
try {
  await notifyUserInvitation(email, org, inviter, token);
} catch (error) {
  console.error("Failed to send invitation email:", error);
  // Email failure should not block the main operation
  // The invitation is still created even if email fails
}
```

**Important:** Email sending failures are logged but do not throw errors to prevent disrupting critical operations like user registration or invitation creation.

## Monitoring

### Email Delivery Monitoring

To monitor email delivery:

1. **SMTP Logs:** Check your SMTP provider's dashboard
2. **Application Logs:** Check console logs for errors
3. **User Feedback:** Users can report non-receipt of emails

### Common Issues

#### Emails Not Sending

1. **Check SMTP credentials:**
   ```bash
   # Test SMTP connection
   node -e "require('./lib/services/email.service').sendEmail('test@example.com', 'Test', ['Test email']).then(console.log)"
   ```

2. **Verify environment variables:**
   ```bash
   echo $SMTP_HOST
   echo $SMTP_PORT
   echo $SMTP_USER
   ```

3. **Check firewall/network:**
   - Port 465 (SSL) or 587 (TLS) must be open
   - Some hosting providers block outbound SMTP

#### Emails Going to Spam

1. **Use a verified domain** (not Gmail for production)
2. **Configure SPF, DKIM, and DMARC** records
3. **Use a reputable SMTP provider** (SendGrid, AWS SES)
4. **Keep email content professional** (avoid spam triggers)

#### Slow Email Delivery

1. **Use async sending:**
   ```typescript
   // Don't await if immediate delivery isn't critical
   notifyUserInvitation(email, org, inviter, token).catch(console.error);
   ```

2. **Implement a job queue** for bulk emails (future enhancement)

## Best Practices

### 1. Don't Block on Email Sending

```typescript
// ❌ Bad: Blocking operation
await notifyUserInvitation(email, org, inviter, token);
await createInvitation(...);

// ✅ Good: Non-blocking
const invitationPromise = notifyUserInvitation(email, org, inviter, token);
await createInvitation(...);
await invitationPromise.catch(console.error);
```

### 2. Provide Alternative Actions

Always include alternative ways to complete actions:
- Magic links should have manual login option
- Invitations should show token that can be entered manually
- Include support contact information

### 3. Email Content Guidelines

- **Be concise:** Get to the point quickly
- **Clear CTAs:** Use prominent buttons for primary actions
- **Professional tone:** Maintain consistent voice
- **Mobile-friendly:** Use responsive inline styles
- **Accessible:** Include text alternatives for links

### 4. Privacy & Security

- **Never include passwords** in emails
- **Use secure tokens** for sensitive actions
- **Set expiration times** for action links
- **Include security notices** about not sharing links

## Future Enhancements

Potential improvements to consider:

1. **Email Queue System:** Use Bull or Bee-Queue for reliable delivery
2. **Email Templates UI:** Admin interface to customize templates
3. **Notification Preferences:** User settings for email frequency
4. **Email Analytics:** Track open rates and click rates
5. **Multi-language Support:** Internationalization of email content
6. **SMS Notifications:** Extend to SMS using Twilio
7. **In-app Notifications:** Real-time notifications in the UI
8. **Digest Emails:** Daily/weekly summary emails

## Related Documentation

- [User Invitation System](./user-invitation-system.md)
- [Organization Management](./organization-management.md)
- [Authentication](./authentication.md)
- [Troubleshooting](./troubleshooting.md)

## Support

For issues or questions about the email notification system:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Review SMTP provider documentation
3. Contact the development team
