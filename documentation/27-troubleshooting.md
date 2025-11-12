# Troubleshooting Guide

## Overview

This guide helps users and administrators diagnose and resolve common issues in Totolaw. Includes error messages, resolution steps, and preventive measures.

---

## Table of Contents

- [Authentication Issues](#authentication-issues)
- [Case Management Issues](#case-management-issues)
- [Hearing & Calendar Issues](#hearing--calendar-issues)
- [Evidence Upload Issues](#evidence-upload-issues)
- [Search Issues](#search-issues)
- [Database Issues](#database-issues)
- [Performance Issues](#performance-issues)
- [Email Issues](#email-issues)
- [Permission Issues](#permission-issues)
- [System Admin Issues](#system-admin-issues)

---

## Authentication Issues

### Cannot Login - Magic Link Not Working

**Symptoms:**
- Magic link email not received
- Link says "Invalid or expired"
- Redirects to login page after clicking link

**Causes:**
1. Email not configured correctly
2. Link expired (10-minute timeout)
3. Email went to spam folder
4. User not registered in system

**Resolution Steps:**

1. **Check Email Configuration**
   ```bash
   # Test email sending
   npm run test-email
   ```
   
   Verify `.env` settings:
   ```env
   BETTER_AUTH_URL=http://localhost:3441
   BETTER_AUTH_SECRET=<your-secret>
   EMAIL_SERVER=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-email>
   EMAIL_PASS=<app-password>
   EMAIL_FROM=noreply@court.gov.fj
   ```

2. **Check Spam Folder**
   - Look for emails from `noreply@court.gov.fj`
   - Add sender to safe senders list

3. **Verify User Exists**
   ```sql
   SELECT * FROM "user" WHERE email = 'user@example.com';
   ```

4. **Request New Magic Link**
   - Link expires after 10 minutes
   - Request a fresh link if expired

5. **Clear Browser Cache**
   - Clear cookies and cache
   - Try incognito/private browsing

**Prevention:**
- Use system admin to invite users properly
- Configure email server before deployment
- Test email delivery in staging environment

---

### Session Expired Error

**Symptoms:**
- Logged out unexpectedly
- "Session expired, please login again" message
- Redirected to login page during work

**Causes:**
- Session timeout (default: 7 days)
- Browser cookies cleared
- Server restart

**Resolution:**
- Login again with magic link
- Session will last 7 days by default
- Keep "Remember me" checked

**Prevention:**
- Don't clear browser cookies frequently
- Use dedicated browser profile for work

---

### Access Denied to Page

**Symptoms:**
- "Access Denied" page displayed
- Redirected from dashboard section
- "You don't have permission" message

**Causes:**
- Insufficient permissions for requested page
- Role doesn't have required permission
- Not assigned to any organisation

**Resolution:**

1. **Check Your Roles**
   - Dashboard → User Status
   - View your assigned roles

2. **Contact System Admin**
   - Request appropriate role assignment
   - Provide details of what you need access to

3. **Verify Organisation Membership**
   - Ensure you're assigned to an organisation
   - Check Dashboard → No Organisation page

**Common Permission Requirements:**
| Page | Required Permission |
|------|---------------------|
| Cases | `case:read` |
| Create Case | `case:create` |
| Edit Case | `case:update` |
| Delete Case | `case:delete` |
| Hearings | `hearing:read` |
| Evidence | `evidence:read` |
| Users | `user:manage` |
| System Admin | `organisation:manage` |

---

## Case Management Issues

### Case Number Not Generating

**Symptoms:**
- Case created without case number
- Case number shows as null
- Error when creating case

**Causes:**
- Court level or case type not selected
- Database sequence issue
- Year not properly set

**Resolution:**

1. **Ensure Required Fields Selected**
   - Court Level: HIGH_COURT, MAGISTRATES_COURT, etc.
   - Case Type: CRIMINAL, CIVIL, etc.
   - Filed Date: Must have a year

2. **Check Database Sequence**
   ```sql
   -- Check last case number for HAC 2024
   SELECT "caseNumber" FROM cases 
   WHERE "caseNumber" LIKE 'HAC%2024' 
   ORDER BY id DESC LIMIT 1;
   
   -- If gaps exist, case number generator will find next available
   ```

3. **Manual Case Number Assignment** (Admin only)
   ```sql
   -- Only if absolutely necessary
   UPDATE cases 
   SET "caseNumber" = 'HAC 123/2024' 
   WHERE id = <case_id>;
   ```

**Prevention:**
- Always select court level and case type
- Don't manually modify case numbers
- Let system auto-generate numbers

---

### Cannot Update Case - Save Button Disabled

**Symptoms:**
- Save button grayed out
- No changes being saved
- Form appears locked

**Causes:**
- Form validation errors
- Missing required fields
- Insufficient permissions
- Case marked as closed

**Resolution:**

1. **Check Form Validation**
   - Look for red error messages
   - Ensure all required fields filled
   - Check date formats (YYYY-MM-DD)

2. **Verify Permissions**
   - Need `case:update` permission
   - Check your role assignments

3. **Case Status Check**
   - Closed cases may have restricted editing
   - Reopen case if needed

**Prevention:**
- Fill all required fields before saving
- Check permission requirements before editing
- Keep cases in "Active" status during proceedings

---

### Parties or Offences Not Displaying

**Symptoms:**
- Case parties section empty
- Offences not showing
- Data appears lost

**Causes:**
- Data not linked to case properly
- Organisation filter excluding data
- Database query issue

**Resolution:**

1. **Verify Data Exists**
   ```sql
   -- Check parties
   SELECT * FROM case_parties WHERE "caseId" = <case_id>;
   
   -- Check offences
   SELECT * FROM case_offences WHERE "caseId" = <case_id>;
   ```

2. **Re-add Missing Data**
   - Case Details → Parties → Add Party
   - Case Details → Offences → Add Offence

3. **Check Organisation Scope**
   - Ensure case belongs to your organisation
   - Super admin can see all organisations

**Prevention:**
- Add parties and offences during case creation
- Don't delete parties/offences unless certain
- Use "Edit" instead of deleting and re-creating

---

## Hearing & Calendar Issues

### Hearing Not Appearing on Calendar

**Symptoms:**
- Scheduled hearing missing from calendar
- Calendar shows wrong date
- Hearing exists in case but not in calendar view

**Causes:**
- Date format incorrect
- Calendar filter excluding hearing
- Hearing marked as cancelled
- Wrong organisation

**Resolution:**

1. **Check Hearing Details**
   - Verify hearing date and time
   - Ensure status is "SCHEDULED" not "CANCELLED"
   - Check hearing belongs to your organisation

2. **Verify Calendar Filters**
   - Clear all filters (judge, courtroom, action type)
   - Check date range includes hearing date
   - Try "All Hearings" view

3. **Refresh Calendar**
   - Reload page (F5 or Ctrl+R)
   - Clear browser cache
   - Try different browser

**Prevention:**
- Use correct date format when scheduling
- Don't apply too many calendar filters
- Verify hearing after creation

---

### Courtroom Conflict Error

**Symptoms:**
- "Courtroom already booked" error
- Cannot save hearing with selected courtroom
- Double-booking warning

**Causes:**
- Another hearing scheduled same time/courtroom
- Time slots overlapping
- Courtroom not available

**Resolution:**

1. **Check Courtroom Schedule**
   - Dashboard → Calendar
   - Filter by specific courtroom
   - View schedule for selected date

2. **Choose Alternative**
   - Select different courtroom
   - Change hearing time
   - Reschedule conflicting hearing

3. **Override Conflict** (Admin only)
   - If absolutely necessary
   - Document reason for override
   - Notify affected parties

**Prevention:**
- Check calendar before scheduling
- Use calendar filtering by courtroom
- Allow buffer time between hearings
- Consider courtroom capacity

---

### Cannot Schedule Hearing - Save Fails

**Symptoms:**
- Hearing form won't submit
- Error message on save
- Redirects back to form

**Causes:**
- Required fields missing
- Invalid date/time
- Judge not assigned
- Courtroom conflict

**Resolution:**

1. **Validate Required Fields**
   - Date (cannot be past date)
   - Time (valid 24-hour format)
   - Action Type (MENTION, TRIAL, etc.)
   - Duration (minimum 15 minutes)

2. **Check Date/Time Format**
   - Date: YYYY-MM-DD (e.g., 2024-12-01)
   - Time: HH:MM (e.g., 09:00)
   - Future date required

3. **Assign Judge**
   - Select judge from dropdown
   - Ensure judge assigned to organisation

**Prevention:**
- Use date picker instead of typing
- Fill all required fields before submitting
- Check courtroom availability first

---

## Evidence Upload Issues

### File Upload Fails

**Symptoms:**
- "Upload failed" error
- File not appearing in evidence list
- Progress bar stuck at 0%

**Causes:**
- File too large (>50MB)
- Unsupported file type
- Insufficient storage space
- Network timeout
- Missing permissions

**Resolution:**

1. **Check File Size**
   - Maximum: 50MB per file
   - Compress large files
   - Split into multiple files if needed

2. **Verify File Type**
   
   **Supported Types:**
   - Documents: PDF, DOC, DOCX, XLS, XLSX, TXT
   - Images: JPG, JPEG, PNG, GIF
   - Audio: MP3, WAV
   - Video: MP4, MOV

3. **Check Permissions**
   - Need `evidence:create` permission
   - Verify you can access case

4. **Check Storage Space**
   ```bash
   # Check disk space
   df -h /public/uploads/evidence
   ```

5. **Retry Upload**
   - Refresh page
   - Clear browser cache
   - Try different browser
   - Check network connection

**Prevention:**
- Compress files before uploading
- Use supported file formats
- Check file size before upload
- Ensure stable internet connection

---

### Uploaded Evidence Not Visible

**Symptoms:**
- Evidence uploaded but not showing
- File link broken
- Cannot preview file

**Causes:**
- File upload incomplete
- File path incorrect in database
- Permissions issue
- File deleted from storage

**Resolution:**

1. **Verify File Exists**
   ```bash
   # Check if file exists
   ls -la /public/uploads/evidence/
   ```

2. **Check Database Record**
   ```sql
   SELECT * FROM evidence WHERE "caseId" = <case_id>;
   ```

3. **Check File Path**
   - Path should be `/uploads/evidence/TIMESTAMP_filename.ext`
   - Ensure no spaces or special characters

4. **Re-upload File**
   - If file missing, upload again
   - Add clear description

**Prevention:**
- Wait for upload confirmation
- Don't navigate away during upload
- Use auto-save browsers
- Check evidence list after upload

---

### Cannot Delete Evidence

**Symptoms:**
- Delete button disabled
- "Cannot delete evidence" error
- File remains after delete

**Causes:**
- Insufficient permissions
- Evidence linked to hearing
- File already deleted
- Database constraint

**Resolution:**

1. **Check Permissions**
   - Need `evidence:delete` permission
   - Only creator or admin can delete

2. **Unlink from Hearing**
   - If evidence linked to hearing, unlink first
   - Or delete entire hearing

3. **Force Delete** (Admin only)
   ```sql
   -- Check references
   SELECT * FROM evidence WHERE id = <evidence_id>;
   
   -- Delete (admin only)
   DELETE FROM evidence WHERE id = <evidence_id>;
   ```

**Prevention:**
- Be careful when uploading
- Verify file before uploading
- Use descriptive names
- Don't delete unless absolutely necessary

---

## Search Issues

### Search Returns No Results

**Symptoms:**
- Search shows "No results found"
- Expected cases/hearings not appearing
- Search seems broken

**Causes:**
- Typo in search query
- Organisation filter excluding results
- Record doesn't match search term
- Case number format incorrect

**Resolution:**

1. **Verify Search Term**
   - Check spelling
   - Try partial search (e.g., "HAC" instead of full number)
   - Use broader terms

2. **Check Organisation Scope**
   - Regular users only see their organisation
   - Super admin can see all organisations

3. **Try Alternative Searches**
   - Search by case title instead of number
   - Search by party name
   - Use different keywords

4. **Browse Directly**
   - Dashboard → Cases → Browse all
   - Use filters instead of search

**Prevention:**
- Use clear, descriptive case titles
- Add detailed descriptions to evidence
- Use consistent naming conventions

---

### Search Results Cut Off

**Symptoms:**
- Only 10 results showing
- "More results" not displayed
- Missing expected results

**Causes:**
- Result limit (10 per category)
- Pagination needed
- Scores too low (relevance)

**Resolution:**

1. **Use More Specific Query**
   - Narrow down search terms
   - Use case number if known
   - Add filters

2. **Browse Category Directly**
   - Dashboard → Cases (all cases)
   - Dashboard → Evidence (all evidence)
   - Use built-in filters

**Note:** Search returns maximum 10 results per category (cases, hearings, evidence) for performance.

---

## Database Issues

### Database Connection Error

**Symptoms:**
- "Cannot connect to database" error
- Pages not loading
- Data not saving

**Causes:**
- PostgreSQL not running
- Connection string incorrect
- Database server down
- Network issue

**Resolution:**

1. **Check PostgreSQL Service**
   ```bash
   # Check if PostgreSQL running
   sudo systemctl status postgresql
   
   # Start if not running
   sudo systemctl start postgresql
   ```

2. **Verify Connection String**
   ```env
   # .env
   DATABASE_URL=postgresql://user:password@localhost:5432/totolaw
   ```

3. **Test Connection**
   ```bash
   # Test direct connection
   psql -U postgres -d totolaw
   ```

4. **Restart Application**
   ```bash
   npm run dev
   # or
   pm2 restart totolaw
   ```

**Prevention:**
- Ensure PostgreSQL starts on boot
- Monitor database service
- Use connection pooling
- Regular database backups

---

### Migration Errors

**Symptoms:**
- "Migration failed" error
- Database schema out of date
- Missing tables or columns

**Causes:**
- Incomplete migration
- Schema drift
- Manual database changes
- Migration conflict

**Resolution:**

1. **Check Current Schema**
   ```bash
   npm run db-view
   # Opens Drizzle Studio
   ```

2. **Run Migrations**
   ```bash
   # Push schema changes
   npm run db-push
   ```

3. **Reset Database** (Development only)
   ```bash
   # Drop and recreate (CAUTION)
   psql -U postgres
   DROP DATABASE totolaw;
   CREATE DATABASE totolaw;
   
   # Run migrations
   npm run db-push
   
   # Seed data if needed
   npm run setup-admin
   ```

4. **Check Migration History**
   ```sql
   SELECT * FROM drizzle_migrations;
   ```

**Prevention:**
- Always use migrations for schema changes
- Don't manually alter schema
- Test migrations in development first
- Keep migrations in version control

---

## Performance Issues

### Slow Page Load Times

**Symptoms:**
- Pages take >5 seconds to load
- Loading spinners persist
- Browser becomes unresponsive

**Causes:**
- Large dataset queries
- Missing database indexes
- Too many records displayed
- Network latency

**Resolution:**

1. **Add Pagination**
   - Limit results to 20-50 per page
   - Use "Load More" or pagination controls

2. **Optimize Queries**
   ```typescript
   // Add limit and offset
   const cases = await db.select()
     .from(cases)
     .where(eq(cases.organisationId, orgId))
     .limit(20)
     .offset(page * 20);
   ```

3. **Add Database Indexes**
   ```sql
   -- Add indexes to frequently queried columns
   CREATE INDEX idx_cases_organisation ON cases("organisationId");
   CREATE INDEX idx_cases_status ON cases(status);
   CREATE INDEX idx_hearings_date ON hearings(date);
   ```

4. **Clear Browser Cache**
   - Ctrl+Shift+Delete
   - Clear cached images and files

**Prevention:**
- Use pagination for large lists
- Add indexes to foreign keys
- Limit search results
- Use caching for static data

---

### High Memory Usage

**Symptoms:**
- Server running out of memory
- Application crashes
- OOM (Out of Memory) errors

**Causes:**
- Large file uploads
- Memory leaks
- Too many concurrent users
- Large dataset processing

**Resolution:**

1. **Restart Application**
   ```bash
   pm2 restart totolaw
   ```

2. **Monitor Memory**
   ```bash
   pm2 monit
   ```

3. **Increase Memory Limit**
   ```bash
   # In PM2 ecosystem file
   node_args: '--max-old-space-size=4096'
   ```

4. **Check for Memory Leaks**
   - Review recent code changes
   - Check for unclosed connections
   - Monitor memory over time

**Prevention:**
- Limit file upload sizes
- Use streaming for large files
- Close database connections
- Implement caching
- Use pagination

---

## Email Issues

### Magic Link Emails Not Sending

**Symptoms:**
- No email received after login attempt
- "Email sent" message but nothing arrives
- Email goes to spam

**Causes:**
- SMTP configuration incorrect
- Email server down
- Blocked by firewall
- Invalid sender address
- Rate limiting

**Resolution:**

1. **Test Email Configuration**
   ```bash
   npm run test-email
   ```

2. **Check SMTP Settings**
   ```env
   EMAIL_SERVER=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=app-password-here
   EMAIL_FROM=noreply@court.gov.fj
   ```

3. **Gmail App Password** (if using Gmail)
   - Enable 2FA on Google account
   - Generate app-specific password
   - Use app password in EMAIL_PASS

4. **Check Spam Folder**
   - Emails may be flagged as spam
   - Add sender to safe list

5. **Check Server Logs**
   ```bash
   pm2 logs totolaw
   # Look for email-related errors
   ```

**Prevention:**
- Use dedicated email service (SendGrid, AWS SES)
- Configure SPF and DKIM records
- Test email in staging first
- Monitor email delivery rates

---

### Invitation Emails Not Received

**Symptoms:**
- User invited but no email
- Join link not working
- Email shows in sent but not received

**Causes:**
- Same as magic link issues
- User email incorrect
- Invitation expired
- Already accepted

**Resolution:**

1. **Verify User Email**
   ```sql
   SELECT email FROM "user" WHERE id = <user_id>;
   ```

2. **Check Invitation Status**
   ```sql
   SELECT * FROM organisation_join_requests 
   WHERE email = 'user@example.com';
   ```

3. **Resend Invitation**
   - Dashboard → Settings → Users
   - Find user → "Resend Invitation"

4. **Manual User Activation** (Admin)
   ```sql
   UPDATE "user" 
   SET "emailVerified" = NOW() 
   WHERE email = 'user@example.com';
   ```

---

## Permission Issues

### User Cannot Access Feature

**Symptoms:**
- "Access Denied" page
- Feature grayed out
- Redirect to dashboard

**Causes:**
- Missing permission
- Wrong role assigned
- Organisation not set
- Permission check failing

**Resolution:**

1. **Check User Roles**
   ```sql
   SELECT r.name, p.resource, p.action
   FROM user_roles ur
   JOIN roles r ON ur."roleId" = r.id
   JOIN role_permissions rp ON r.id = rp."roleId"
   JOIN permissions p ON rp."permissionId" = p.id
   WHERE ur."userId" = <user_id>;
   ```

2. **Assign Correct Role**
   - Dashboard → Settings → Users
   - Select user → "Manage Roles"
   - Add required role (JUDGE, CLERK, REGISTRY)

3. **Verify Organisation Assignment**
   ```sql
   SELECT * FROM organisation_members 
   WHERE "userId" = <user_id>;
   ```

**Permission Reference:**
| Resource | Actions | Roles |
|----------|---------|-------|
| case | create, read, update, delete | CLERK, JUDGE, REGISTRY |
| hearing | create, read, update, delete | CLERK, JUDGE |
| evidence | create, read, delete | CLERK, REGISTRY |
| user | manage | SYSTEM_ADMIN |
| organisation | manage | SYSTEM_ADMIN |

---

### Role Assignment Not Working

**Symptoms:**
- Role assigned but permissions not applied
- User still sees "Access Denied"
- Changes not taking effect

**Causes:**
- Session not refreshed
- Cache issue
- Database constraint
- Multiple organisations

**Resolution:**

1. **Logout and Login**
   - User must logout and login again
   - Session needs refresh for new permissions

2. **Clear Cache**
   - Clear browser cache
   - Restart browser

3. **Verify Role Assignment**
   ```sql
   SELECT * FROM user_roles 
   WHERE "userId" = <user_id> 
   AND "organisationId" = <org_id>;
   ```

**Prevention:**
- Inform users to logout/login after role changes
- Use session refresh mechanism
- Check role assignments in system admin

---

## System Admin Issues

### Cannot Create Organisation

**Symptoms:**
- Organisation creation fails
- Error saving organisation
- Form validation errors

**Causes:**
- Duplicate name
- Missing required fields
- Invalid court level
- Parent organisation issue

**Resolution:**

1. **Check Required Fields**
   - Name (unique)
   - Court Level
   - Court Type
   - Jurisdiction

2. **Verify Uniqueness**
   ```sql
   SELECT name FROM organisations 
   WHERE name ILIKE '%search-term%';
   ```

3. **Set Parent Organisation** (if sub-court)
   - Select parent from dropdown
   - Ensure parent exists

**Prevention:**
- Use clear, unique organisation names
- Follow naming convention
- Verify parent-child relationships

---

### User Cannot Join Organisation

**Symptoms:**
- Join request fails
- "Already a member" error
- Request not appearing

**Causes:**
- Already member of organisation
- Pending request exists
- Organisation not accepting members
- System admin approval required

**Resolution:**

1. **Check Existing Membership**
   ```sql
   SELECT * FROM organisation_members 
   WHERE "userId" = <user_id> 
   AND "organisationId" = <org_id>;
   ```

2. **Check Pending Requests**
   ```sql
   SELECT * FROM organisation_join_requests 
   WHERE "userId" = <user_id> 
   AND "organisationId" = <org_id> 
   AND status = 'PENDING';
   ```

3. **Approve Request** (Admin)
   - System Admin → Organisations
   - Select organisation → Join Requests
   - Approve pending request

4. **Direct Assignment** (Admin)
   ```sql
   INSERT INTO organisation_members 
   ("userId", "organisationId", role) 
   VALUES (<user_id>, <org_id>, 'MEMBER');
   ```

---

## Common Error Messages

### "Something went wrong"

**Generic error - check logs for details**

Resolution:
```bash
# Check application logs
pm2 logs totolaw --lines 50

# Check for specific error messages
grep -i "error" logs/error.log
```

---

### "Unauthorized"

**User not authenticated**

Resolution:
- Login again with magic link
- Check session hasn't expired
- Clear cookies and retry

---

### "Forbidden"

**User authenticated but lacks permission**

Resolution:
- Check required permissions for action
- Contact admin for role assignment
- Verify organisation membership

---

### "Not Found"

**Resource doesn't exist or user lacks access**

Resolution:
- Verify resource ID correct
- Check if resource belongs to your organisation
- Ensure resource wasn't deleted

---

### "Bad Request"

**Invalid data submitted**

Resolution:
- Check form validation errors
- Verify required fields filled
- Check data format (dates, numbers)
- Review API request if using programmatically

---

## Getting Help

### Support Channels

1. **System Administrator**
   - First point of contact for permissions
   - Can assign roles and troubleshoot access

2. **Technical Support**
   - Email: support@totolaw.com
   - Include error messages and steps to reproduce

3. **Documentation**
   - Check related documentation
   - Review user guides and FAQs

### Reporting Issues

When reporting issues, include:

1. **What you were trying to do**
   - Step-by-step description

2. **What happened instead**
   - Error messages (copy exact text)
   - Screenshots if applicable

3. **Your context**
   - User role
   - Organisation
   - Browser and version
   - Date and time of issue

4. **Steps to reproduce**
   - Detailed steps to recreate issue

---

## Related Documentation

- [Quick Reference Guide](25-quick-reference.md)
- [Getting Started](getting-started/page.md)
- [FAQ](faq/page.md)
- [Authentication](04-auth-and-security.md)
- [User Management](06-user-management.md)
- [Case Management](07-case-management.md)
