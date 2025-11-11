/**
 * Email Template Service
 * 
 * Centralized email templates for all notification types
 */

const APP_NAME = "Totolaw";
const APP_COLOR = "#7c3aed"; // Purple theme

interface EmailTemplate {
  subject: string;
  paragraphs: string[];
}

/**
 * Base URL for the application
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Create a styled button link
 */
function createButton(text: string, url: string, color: string = APP_COLOR): string {
  return `<a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: ${color}; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0; font-weight: 500;">${text}</a>`;
}

/**
 * Create a code block for URLs or codes
 */
function createCodeBlock(text: string): string {
  return `<code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: block; margin: 8px 0; color: #1f2937; font-size: 14px; word-break: break-all;">${text}</code>`;
}

/**
 * User Invitation Email
 */
export function userInvitationTemplate(
  organisationName: string,
  inviterName: string,
  token: string,
  expiryDays: number = 7
): EmailTemplate {
  const invitationUrl = `${getBaseUrl()}/auth/accept-invitation?token=${token}`;

  return {
    subject: `You're invited to join ${organisationName} on ${APP_NAME}`,
    paragraphs: [
      `Hello!`,
      `You have been invited by <strong>${inviterName}</strong> to join <strong>${organisationName}</strong> on ${APP_NAME}.`,
      `${APP_NAME} is a comprehensive legal case management platform designed for courts and legal professionals.`,
      `To accept this invitation and create your account, click the button below:`,
      createButton("Accept Invitation", invitationUrl),
      `Or copy and paste this link into your browser:`,
      createCodeBlock(invitationUrl),
      `<strong>⏰ Important:</strong> This invitation will expire in ${expiryDays} days.`,
      `If you did not expect this invitation, you can safely ignore this email.`,
    ],
  };
}

/**
 * Organization Join Request Submitted (to User)
 */
export function joinRequestSubmittedTemplate(
  userName: string,
  organisationName: string
): EmailTemplate {
  return {
    subject: `Your request to join ${organisationName} has been submitted`,
    paragraphs: [
      `Hello ${userName}!`,
      `Your request to join <strong>${organisationName}</strong> has been successfully submitted.`,
      `The organisation administrators have been notified and will review your request shortly.`,
      `You will receive an email notification once your request has been reviewed.`,
      `You can check the status of your request by logging into your dashboard:`,
      createButton("View Dashboard", `${getBaseUrl()}/dashboard`),
      `Thank you for your patience!`,
    ],
  };
}

/**
 * Organization Join Request Received (to Admins)
 */
export function joinRequestReceivedTemplate(
  adminName: string,
  userName: string,
  userEmail: string,
  organisationName: string,
  message: string | undefined,
  requestId: string
): EmailTemplate {
  const reviewUrl = `${getBaseUrl()}/dashboard/users?tab=join-requests`;

  const paragraphs = [
    `Hello ${adminName}!`,
    `A new user has requested to join <strong>${organisationName}</strong>.`,
    `<div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid ${APP_COLOR};">
      <p style="margin: 4px 0;"><strong>Name:</strong> ${userName}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${userEmail}</p>
    </div>`,
  ];

  if (message) {
    paragraphs.push(
      `<strong>Message from user:</strong>`,
      `<div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 8px 0; font-style: italic;">
        ${message}
      </div>`
    );
  }

  paragraphs.push(
    `Please review this request and approve or decline it:`,
    createButton("Review Request", reviewUrl),
    `You can review all pending requests in your dashboard under the "Users" section.`
  );

  return {
    subject: `New join request for ${organisationName}`,
    paragraphs,
  };
}

/**
 * Organization Join Request Approved
 */
export function joinRequestApprovedTemplate(
  userName: string,
  organisationName: string
): EmailTemplate {
  const loginUrl = `${getBaseUrl()}/auth/login`;

  return {
    subject: `Your request to join ${organisationName} has been approved! 🎉`,
    paragraphs: [
      `Great news, ${userName}!`,
      `Your request to join <strong>${organisationName}</strong> has been <strong style="color: #10b981;">approved</strong>.`,
      `You now have access to the organisation's resources and can start collaborating with your team.`,
      `Click the button below to log in and get started:`,
      createButton("Log In", loginUrl, "#10b981"),
      `Welcome to ${organisationName}! 🎊`,
    ],
  };
}

/**
 * Organization Join Request Rejected
 */
export function joinRequestRejectedTemplate(
  userName: string,
  organisationName: string,
  reason?: string
): EmailTemplate {
  const paragraphs = [
    `Hello ${userName},`,
    `We regret to inform you that your request to join <strong>${organisationName}</strong> has been declined.`,
  ];

  if (reason) {
    paragraphs.push(
      `<strong>Reason provided:</strong>`,
      `<div style="background-color: #fef2f2; padding: 12px; border-radius: 6px; margin: 8px 0; border-left: 4px solid #ef4444;">
        ${reason}
      </div>`
    );
  }

  paragraphs.push(
    `If you have any questions or would like to discuss this further, please contact the organisation administrators.`,
    `Thank you for your interest in ${organisationName}.`
  );

  return {
    subject: `Update on your request to join ${organisationName}`,
    paragraphs,
  };
}

/**
 * Magic Link Email
 */
export function magicLinkTemplate(email: string, magicLink: string): EmailTemplate {
  return {
    subject: `Your ${APP_NAME} login link`,
    paragraphs: [
      `Hello!`,
      `You requested a magic link to log in to <strong>${APP_NAME}</strong>.`,
      `Click the button below to log in:`,
      createButton("Log In", magicLink),
      `Or copy and paste this link into your browser:`,
      createCodeBlock(magicLink),
      `<strong>⏰ Important:</strong> This link will expire in 10 minutes and can only be used once.`,
      `If you didn't request this link, you can safely ignore this email.`,
      `For security reasons, never share this link with anyone.`,
    ],
  };
}

/**
 * Password Reset Email
 */
export function passwordResetTemplate(userName: string, resetLink: string): EmailTemplate {
  return {
    subject: `Reset your ${APP_NAME} password`,
    paragraphs: [
      `Hello ${userName}!`,
      `We received a request to reset your password for your <strong>${APP_NAME}</strong> account.`,
      `Click the button below to reset your password:`,
      createButton("Reset Password", resetLink),
      `Or copy and paste this link into your browser:`,
      createCodeBlock(resetLink),
      `<strong>⏰ Important:</strong> This link will expire in 1 hour for security reasons.`,
      `If you didn't request a password reset, please ignore this email and your password will remain unchanged.`,
      `For security, this link can only be used once.`,
    ],
  };
}

/**
 * Account Created Welcome Email
 */
export function welcomeTemplate(userName: string, organisationName?: string): EmailTemplate {
  const loginUrl = `${getBaseUrl()}/auth/login`;
  const docsUrl = `${getBaseUrl()}/docs/getting-started`;

  const paragraphs = [
    `Welcome to ${APP_NAME}, ${userName}! 🎉`,
    `Your account has been successfully created.`,
  ];

  if (organisationName) {
    paragraphs.push(
      `You're now a member of <strong>${organisationName}</strong> and can start using the platform.`
    );
  }

  paragraphs.push(
    `${APP_NAME} helps you manage legal cases, documents, evidence, hearings, and transcriptions all in one place.`,
    `<strong>Get started:</strong>`,
    `<ul style="line-height: 1.8;">
      <li>Log in to your account</li>
      <li>Complete your profile</li>
      <li>Explore the dashboard</li>
      <li>Check out our documentation</li>
    </ul>`,
    createButton("Log In", loginUrl),
    `<a href="${docsUrl}" style="color: ${APP_COLOR}; text-decoration: none;">📚 View Documentation</a>`,
    `If you need any help, our support team is here to assist you.`
  );

  return {
    subject: `Welcome to ${APP_NAME}! 🎉`,
    paragraphs,
  };
}

/**
 * User Role Changed
 */
export function roleChangedTemplate(
  userName: string,
  organisationName: string,
  newRoles: string[],
  changedBy: string
): EmailTemplate {
  const dashboardUrl = `${getBaseUrl()}/dashboard`;

  return {
    subject: `Your role in ${organisationName} has been updated`,
    paragraphs: [
      `Hello ${userName}!`,
      `Your roles in <strong>${organisationName}</strong> have been updated by ${changedBy}.`,
      `<strong>Your new role(s):</strong>`,
      `<ul style="line-height: 1.8;">
        ${newRoles.map(role => `<li>${role}</li>`).join('')}
      </ul>`,
      `These changes are effective immediately and may affect your access to certain features.`,
      createButton("View Dashboard", dashboardUrl),
      `If you have questions about your new role, please contact your organisation administrator.`,
    ],
  };
}

/**
 * User Removed from Organization
 */
export function userRemovedTemplate(
  userName: string,
  organisationName: string,
  removedBy: string,
  reason?: string
): EmailTemplate {
  const contactUrl = `${getBaseUrl()}/docs/faq`;

  const paragraphs = [
    `Hello ${userName},`,
    `Your access to <strong>${organisationName}</strong> has been removed by ${removedBy}.`,
  ];

  if (reason) {
    paragraphs.push(
      `<strong>Reason:</strong>`,
      `<div style="background-color: #fef2f2; padding: 12px; border-radius: 6px; margin: 8px 0;">
        ${reason}
      </div>`
    );
  }

  paragraphs.push(
    `You will no longer be able to access ${organisationName}'s resources on ${APP_NAME}.`,
    `If you believe this is an error or have questions, please contact the organisation administrator.`,
    `<a href="${contactUrl}" style="color: ${APP_COLOR}; text-decoration: none;">Need Help?</a>`
  );

  return {
    subject: `Access to ${organisationName} has been removed`,
    paragraphs,
  };
}

/**
 * System Notification (Generic)
 */
export function systemNotificationTemplate(
  userName: string,
  title: string,
  message: string,
  actionText?: string,
  actionUrl?: string
): EmailTemplate {
  const paragraphs = [
    `Hello ${userName}!`,
    `<strong>${title}</strong>`,
    message,
  ];

  if (actionText && actionUrl) {
    paragraphs.push(createButton(actionText, actionUrl));
  }

  return {
    subject: title,
    paragraphs,
  };
}

/**
 * Case Assignment Notification
 */
export function caseAssignedTemplate(
  userName: string,
  caseNumber: string,
  caseTitle: string,
  assignedBy: string,
  caseId: string
): EmailTemplate {
  const caseUrl = `${getBaseUrl()}/dashboard/cases/${caseId}`;

  return {
    subject: `You've been assigned to case ${caseNumber}`,
    paragraphs: [
      `Hello ${userName}!`,
      `You have been assigned to a new case by ${assignedBy}.`,
      `<div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid ${APP_COLOR};">
        <p style="margin: 4px 0;"><strong>Case Number:</strong> ${caseNumber}</p>
        <p style="margin: 4px 0;"><strong>Title:</strong> ${caseTitle}</p>
      </div>`,
      `Click the button below to view the case details:`,
      createButton("View Case", caseUrl),
      `You can access all your assigned cases from your dashboard.`,
    ],
  };
}

/**
 * Hearing Reminder
 */
export function hearingReminderTemplate(
  userName: string,
  caseNumber: string,
  hearingDate: string,
  hearingTime: string,
  location: string,
  hearingId: string
): EmailTemplate {
  const hearingUrl = `${getBaseUrl()}/dashboard/hearings/${hearingId}`;

  return {
    subject: `Reminder: Hearing for case ${caseNumber} on ${hearingDate}`,
    paragraphs: [
      `Hello ${userName}!`,
      `This is a reminder about an upcoming hearing:`,
      `<div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 4px 0;"><strong>Case:</strong> ${caseNumber}</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${hearingDate}</p>
        <p style="margin: 4px 0;"><strong>Time:</strong> ${hearingTime}</p>
        <p style="margin: 4px 0;"><strong>Location:</strong> ${location}</p>
      </div>`,
      `Make sure to review the case details and prepare any necessary documents.`,
      createButton("View Hearing Details", hearingUrl, "#f59e0b"),
      `See you there!`,
    ],
  };
}

/**
 * Super Admin Added Notification
 */
export function superAdminAddedTemplate(
  newAdminName: string,
  newAdminEmail: string,
  addedByName: string,
  notes?: string
): EmailTemplate {
  const loginUrl = `${getBaseUrl()}/auth/login`;
  const dashboardUrl = `${getBaseUrl()}/dashboard/system-admin`;

  const paragraphs = [
    `Hello ${newAdminName}! 🎉`,
    `You have been granted <strong style="color: #7c3aed;">Super Administrator</strong> privileges on ${APP_NAME} by ${addedByName}.`,
    `<div style="background-color: #f5f3ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #7c3aed;">
      <p style="margin: 4px 0;"><strong>🛡️ Super Admin Privileges</strong></p>
      <p style="margin: 8px 0; font-size: 14px;">As a super admin, you now have full system access including:</p>
      <ul style="margin: 8px 0; padding-left: 20px; font-size: 14px;">
        <li>Manage all organizations</li>
        <li>Manage system administrators</li>
        <li>Access system-wide settings</li>
        <li>View audit logs</li>
        <li>Create and manage users across all organizations</li>
      </ul>
    </div>`,
  ];

  if (notes) {
    paragraphs.push(
      `<strong>Note from ${addedByName}:</strong>`,
      `<div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 8px 0; font-style: italic;">
        ${notes}
      </div>`
    );
  }

  paragraphs.push(
    `To get started, log in to your account:`,
    createButton("Log In to Dashboard", loginUrl, "#7c3aed"),
    `<div style="background-color: #fef3c7; padding: 12px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 14px;"><strong>⚠️ Important:</strong> With great power comes great responsibility. Please use your super admin privileges carefully and in accordance with your organization's policies.</p>
    </div>`,
    `If you have any questions or need assistance, please contact the system administrator team.`,
    `<a href="${dashboardUrl}" style="color: ${APP_COLOR}; text-decoration: none;">📊 Access System Admin Dashboard</a>`
  );

  return {
    subject: `🛡️ You've been granted Super Admin access to ${APP_NAME}`,
    paragraphs,
  };
}
