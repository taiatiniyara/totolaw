# Magic Link Authentication Setup

This application uses **Better Auth** with **Magic Links** for passwordless authentication.

## Features

- 🔐 Passwordless authentication via email magic links
- ✉️ Email verification through magic links
- 🚀 Simple and secure login flow
- 🔄 Automatic session management
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui components

## How It Works

1. User enters their email address on the login page
2. System sends a magic link to the user's email
3. User clicks the link in their email
4. User is automatically logged in and redirected to the dashboard

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `BETTER_AUTH_URL`: Your application URL (e.g., http://localhost:3224)
- `BETTER_AUTH_SECRET`: A secret key for Better Auth (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL`: Public URL for client-side auth
- `DATABASE_URL`: PostgreSQL database connection string
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (usually 465 for SSL)
- `SMTP_USER`: SMTP username/email
- `SMTP_PASS`: SMTP password

### 2. Database Setup

Run the database migration to create necessary tables:

```bash
npm run db-push
```

This will:
- Generate the Better Auth schema
- Push it to your database
- Create tables for users, sessions, accounts, and verifications

### 3. SMTP Configuration

You'll need an SMTP server to send magic link emails. Options include:

- **Gmail**: Use app-specific passwords
- **SendGrid**: Free tier available
- **Mailgun**: Free tier available
- **Amazon SES**: Pay as you go
- **Your own SMTP server**

### 4. Run the Application

```bash
npm run dev
```

Visit http://localhost:3224/auth/login to test the magic link authentication.

## File Structure

```
app/
  auth/
    login/
      page.tsx              # Magic link login form
    register/
      page.tsx              # Redirects to login (magic links only)
    magic-link/
      page.tsx              # Handles magic link verification
  dashboard/
    page.tsx                # Protected dashboard page
    layout.tsx              # Dashboard layout
  api/
    auth/
      [...all].ts           # Better Auth API routes

lib/
  auth.ts                   # Better Auth server configuration
  auth-client.ts            # Better Auth client configuration
  services/
    email.service.ts        # Email sending service
  drizzle/
    schema/
      auth-schema.ts        # Database schema for auth tables
```

## Usage

### Login Flow

1. Navigate to `/auth/login`
2. Enter your email address
3. Click "Send Magic Link"
4. Check your email for the magic link
5. Click the link to be automatically logged in
6. You'll be redirected to `/dashboard`

### Logout

Click the "Logout" button in the dashboard to end your session.

## Security Features

- ✅ Rate limiting on magic link requests (5 requests per 15 minutes)
- ✅ Token expiration for magic links
- ✅ Secure session management
- ✅ CSRF protection via Better Auth
- ✅ HTTP-only cookies

## Customization

### Email Template

Edit the email template in `lib/auth.ts`:

```typescript
sendMagicLink: async ({ email, token, url }) => {
  await sendEmail(email, "Your Magic Login Link", [
    `Your custom message here`,
    `<a href="${url}">Login Link</a>`,
  ]);
}
```

### Rate Limiting

Adjust rate limits in `lib/auth.ts`:

```typescript
rateLimit: {
  window: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each email to 5 requests per window
}
```

### Redirect URL

Change the redirect URL after login in `app/auth/login/page.tsx`:

```typescript
callbackURL: "/your-custom-redirect"
```

## Troubleshooting

### Magic link emails not sending

1. Verify SMTP credentials in `.env.local`
2. Check spam/junk folder
3. Review server logs for email errors
4. Test SMTP connection independently

### Magic link not working

1. Check that the link hasn't expired
2. Verify `BETTER_AUTH_URL` matches your application URL
3. Clear browser cookies and try again
4. Check browser console for errors

### Session not persisting

1. Ensure cookies are enabled in the browser
2. Verify `BETTER_AUTH_SECRET` is set correctly
3. Check that your domain allows cookies

## Production Deployment

Before deploying to production:

1. ✅ Generate a strong `BETTER_AUTH_SECRET`
2. ✅ Use HTTPS for `BETTER_AUTH_URL`
3. ✅ Set up a reliable SMTP provider
4. ✅ Configure proper database backups
5. ✅ Review rate limiting settings
6. ✅ Test the complete authentication flow

## Support

For more information about Better Auth, visit:
- [Better Auth Documentation](https://www.better-auth.com)
- [Magic Link Plugin](https://www.better-auth.com/docs/plugins/magic-link)
