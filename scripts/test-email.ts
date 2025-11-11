/**
 * Email Testing Utility
 * 
 * Run this script to test the email notification system
 * 
 * Usage:
 *   tsx scripts/test-email.ts <recipient-email> [template]
 * 
 * Examples:
 *   tsx scripts/test-email.ts admin@example.com
 *   tsx scripts/test-email.ts admin@example.com invitation
 *   tsx scripts/test-email.ts admin@example.com join-request
 */

import { sendEmail } from "../lib/services/email.service";
import * as templates from "../lib/services/email-templates.service";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Email Testing Utility

Usage:
  tsx scripts/test-email.ts <recipient-email> [template]

Available Templates:
  - invitation       : User invitation email
  - join-submitted   : Join request submitted confirmation
  - join-received    : Join request received (admin)
  - join-approved    : Join request approved
  - join-rejected    : Join request rejected
  - magic-link       : Magic link authentication
  - password-reset   : Password reset
  - welcome          : Welcome email
  - role-changed     : Role changed notification
  - user-removed     : User removed notification
  - super-admin      : Super admin added notification
  - case-assigned    : Case assignment
  - hearing-reminder : Hearing reminder
  - system           : System notification
  - all              : Send all templates

Examples:
  tsx scripts/test-email.ts admin@example.com
  tsx scripts/test-email.ts admin@example.com invitation
  tsx scripts/test-email.ts admin@example.com all
  `);
  process.exit(0);
}

const recipientEmail = args[0];
const templateType = args[1] || "invitation";

async function testEmail(template: string) {
  console.log(`\n📧 Testing ${template} template...`);
  console.log(`📮 Sending to: ${recipientEmail}`);

  try {
    let emailTemplate: { subject: string; paragraphs: string[] };

    switch (template) {
      case "invitation":
        emailTemplate = templates.userInvitationTemplate(
          "Supreme Court of Fiji",
          "John Admin",
          "test-token-123",
          7
        );
        break;

      case "join-submitted":
        emailTemplate = templates.joinRequestSubmittedTemplate(
          "Jane Doe",
          "High Court"
        );
        break;

      case "join-received":
        emailTemplate = templates.joinRequestReceivedTemplate(
          "Admin User",
          "Jane Doe",
          "jane@example.com",
          "High Court",
          "I am a qualified lawyer with 5 years of experience.",
          "request-123"
        );
        break;

      case "join-approved":
        emailTemplate = templates.joinRequestApprovedTemplate(
          "Jane Doe",
          "High Court"
        );
        break;

      case "join-rejected":
        emailTemplate = templates.joinRequestRejectedTemplate(
          "Jane Doe",
          "High Court",
          "Insufficient qualifications"
        );
        break;

      case "magic-link":
        emailTemplate = templates.magicLinkTemplate(
          recipientEmail,
          "https://example.com/auth/verify?token=test-123"
        );
        break;

      case "password-reset":
        emailTemplate = templates.passwordResetTemplate(
          "Test User",
          "https://example.com/auth/reset?token=test-123"
        );
        break;

      case "welcome":
        emailTemplate = templates.welcomeTemplate(
          "Test User",
          "Supreme Court"
        );
        break;

      case "role-changed":
        emailTemplate = templates.roleChangedTemplate(
          "Test User",
          "Supreme Court",
          ["Judge", "Senior Magistrate"],
          "Admin User"
        );
        break;

      case "user-removed":
        emailTemplate = templates.userRemovedTemplate(
          "Test User",
          "Supreme Court",
          "Admin User",
          "Contract ended"
        );
        break;

      case "super-admin":
        emailTemplate = templates.superAdminAddedTemplate(
          "Test User",
          recipientEmail,
          "Chief Administrator",
          "You have been granted super admin access to help manage the system."
        );
        break;

      case "case-assigned":
        emailTemplate = templates.caseAssignedTemplate(
          "Test User",
          "CR-2024-001",
          "State vs. Smith",
          "Admin User",
          "case-123"
        );
        break;

      case "hearing-reminder":
        emailTemplate = templates.hearingReminderTemplate(
          "Test User",
          "CR-2024-001",
          "January 15, 2025",
          "10:00 AM",
          "Courtroom 3, Supreme Court",
          "hearing-123"
        );
        break;

      case "system":
        emailTemplate = templates.systemNotificationTemplate(
          "Test User",
          "System Maintenance Notice",
          "The system will be under maintenance on Saturday from 2:00 AM to 4:00 AM. During this time, the platform will be unavailable.",
          "View Schedule",
          "https://example.com/maintenance"
        );
        break;

      default:
        console.error(`❌ Unknown template: ${template}`);
        return;
    }

    await sendEmail(
      recipientEmail,
      emailTemplate.subject,
      emailTemplate.paragraphs
    );

    console.log(`✅ ${template} email sent successfully!`);
    console.log(`📋 Subject: ${emailTemplate.subject}`);
  } catch (error) {
    console.error(`❌ Failed to send ${template} email:`, error);
  }
}

async function main() {
  console.log("\n🚀 Totolaw Email Testing Utility\n");
  console.log("=".repeat(50));

  // Check environment variables
  const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    console.error("\n❌ Missing required environment variables:");
    missingVars.forEach((v) => console.error(`   - ${v}`));
    console.error("\nPlease configure SMTP settings in your .env file");
    console.error("See .env.example for configuration examples\n");
    process.exit(1);
  }

  console.log("✅ SMTP Configuration:");
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log("=".repeat(50));

  if (templateType === "all") {
    const allTemplates = [
      "invitation",
      "join-submitted",
      "join-received",
      "join-approved",
      "join-rejected",
      "magic-link",
      "password-reset",
      "welcome",
      "role-changed",
      "user-removed",
      "super-admin",
      "case-assigned",
      "hearing-reminder",
      "system",
    ];

    console.log(`\n📨 Sending all ${allTemplates.length} templates to ${recipientEmail}...\n`);

    for (const template of allTemplates) {
      await testEmail(template);
      // Small delay between emails
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ All emails sent successfully!`);
    console.log(`📬 Check your inbox at: ${recipientEmail}`);
  } else {
    await testEmail(templateType);
    console.log("\n" + "=".repeat(50));
    console.log(`📬 Check your inbox at: ${recipientEmail}`);
  }

  console.log("\n💡 Tips:");
  console.log("   - Check spam folder if you don't see the email");
  console.log("   - For Gmail, enable 'Less secure app access' if needed");
  console.log("   - Check your SMTP provider dashboard for delivery status");
  console.log("   - Review console logs for any error messages\n");
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
