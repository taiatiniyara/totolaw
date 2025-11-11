/**
 * Notification Service
 * 
 * Central service for sending notifications via email and other channels
 */

import { sendEmail } from "./email.service";
import * as templates from "./email-templates.service";
import { db } from "../drizzle/connection";
import { eq, and } from "drizzle-orm";

/**
 * Send user invitation notification
 */
export async function notifyUserInvitation(
  email: string,
  organisationName: string,
  inviterName: string,
  token: string,
  expiryDays: number = 7
): Promise<void> {
  const template = templates.userInvitationTemplate(
    organisationName,
    inviterName,
    token,
    expiryDays
  );

  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send join request submitted confirmation (to user)
 */
export async function notifyJoinRequestSubmitted(
  email: string,
  userName: string,
  organisationName: string
): Promise<void> {
  const template = templates.joinRequestSubmittedTemplate(userName, organisationName);
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send join request notification to organization admins
 */
export async function notifyAdminsOfJoinRequest(
  organisationId: string,
  userName: string,
  userEmail: string,
  organisationName: string,
  message: string | undefined,
  requestId: string
): Promise<void> {
  // Get all admins for the organization
  // For now, we'll get users with users:manage permission
  // This is a simplified version - you may want to enhance this based on your RBAC system
  const admins = await getOrganisationAdmins(organisationId);

  if (admins.length === 0) {
    console.warn(`No admins found for organisation ${organisationId} to notify about join request`);
    return;
  }

  // Send email to each admin
  for (const admin of admins) {
    const template = templates.joinRequestReceivedTemplate(
      admin.name || "Administrator",
      userName,
      userEmail,
      organisationName,
      message,
      requestId
    );

    await sendEmail(admin.email, template.subject, template.paragraphs);
  }
}

/**
 * Send join request approved notification
 */
export async function notifyJoinRequestApproved(
  email: string,
  userName: string,
  organisationName: string
): Promise<void> {
  const template = templates.joinRequestApprovedTemplate(userName, organisationName);
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send join request rejected notification
 */
export async function notifyJoinRequestRejected(
  email: string,
  userName: string,
  organisationName: string,
  reason?: string
): Promise<void> {
  const template = templates.joinRequestRejectedTemplate(userName, organisationName, reason);
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send magic link email
 */
export async function notifyMagicLink(email: string, magicLink: string): Promise<void> {
  const template = templates.magicLinkTemplate(email, magicLink);
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send password reset email
 */
export async function notifyPasswordReset(
  email: string,
  userName: string,
  resetLink: string
): Promise<void> {
  const template = templates.passwordResetTemplate(userName, resetLink);
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send welcome email
 */
export async function notifyWelcome(
  email: string,
  userName: string,
  organisationName?: string
): Promise<void> {
  const template = templates.welcomeTemplate(userName, organisationName);
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send role changed notification
 */
export async function notifyRoleChanged(
  email: string,
  userName: string,
  organisationName: string,
  newRoles: string[],
  changedBy: string
): Promise<void> {
  const template = templates.roleChangedTemplate(
    userName,
    organisationName,
    newRoles,
    changedBy
  );
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send user removed notification
 */
export async function notifyUserRemoved(
  email: string,
  userName: string,
  organisationName: string,
  removedBy: string,
  reason?: string
): Promise<void> {
  const template = templates.userRemovedTemplate(
    userName,
    organisationName,
    removedBy,
    reason
  );
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send generic system notification
 */
export async function notifySystem(
  email: string,
  userName: string,
  title: string,
  message: string,
  actionText?: string,
  actionUrl?: string
): Promise<void> {
  const template = templates.systemNotificationTemplate(
    userName,
    title,
    message,
    actionText,
    actionUrl
  );
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send case assignment notification
 */
export async function notifyCaseAssigned(
  email: string,
  userName: string,
  caseNumber: string,
  caseTitle: string,
  assignedBy: string,
  caseId: string
): Promise<void> {
  const template = templates.caseAssignedTemplate(
    userName,
    caseNumber,
    caseTitle,
    assignedBy,
    caseId
  );
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Send hearing reminder notification
 */
export async function notifyHearingReminder(
  email: string,
  userName: string,
  caseNumber: string,
  hearingDate: string,
  hearingTime: string,
  location: string,
  hearingId: string
): Promise<void> {
  const template = templates.hearingReminderTemplate(
    userName,
    caseNumber,
    hearingDate,
    hearingTime,
    location,
    hearingId
  );
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Helper: Get organization admins
 * Returns users who have admin permissions in the organization
 */
async function getOrganisationAdmins(organisationId: string): Promise<Array<{ email: string; name: string | null }>> {
  // Get all active members of the organization
  const { user: userSchema } = await import("../drizzle/schema/auth-schema");
  const { organisationMembers: membersSchema } = await import("../drizzle/schema/organisation-schema");
  const { userPermissions, permissions } = await import("../drizzle/schema/rbac-schema");

  const members = await db
    .select({
      email: userSchema.email,
      name: userSchema.name,
      userId: userSchema.id,
    })
    .from(membersSchema)
    .innerJoin(userSchema, eq(membersSchema.userId, userSchema.id))
    .where(
      and(
        eq(membersSchema.organisationId, organisationId),
        eq(membersSchema.isActive, true)
      )
    );

  if (members.length === 0) {
    return [];
  }

  // Get users with users:manage permission (ability to manage users/invitations)
  const adminsWithPermission = await db
    .select({
      userId: userPermissions.userId,
      email: userSchema.email,
      name: userSchema.name,
    })
    .from(userPermissions)
    .innerJoin(userSchema, eq(userPermissions.userId, userSchema.id))
    .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
    .where(
      and(
        eq(userPermissions.organisationId, organisationId),
        eq(userPermissions.granted, true),
        eq(permissions.slug, "users:manage")
      )
    );

  // If we have specific admins, return them
  if (adminsWithPermission.length > 0) {
    return adminsWithPermission.map(a => ({
      email: a.email,
      name: a.name,
    }));
  }

  // Fallback: Return all members (or you could filter by specific role)
  // This ensures at least someone gets notified
  return members.map(m => ({
    email: m.email,
    name: m.name,
  }));
}

/**
 * Send super admin added notification
 */
export async function notifySuperAdminAdded(
  email: string,
  newAdminName: string,
  addedByName: string,
  notes?: string
): Promise<void> {
  const template = templates.superAdminAddedTemplate(
    newAdminName,
    email,
    addedByName,
    notes
  );
  await sendEmail(email, template.subject, template.paragraphs);
}

/**
 * Batch notification helper
 * Send the same notification to multiple recipients
 */
export async function notifyMultiple(
  emails: string[],
  subject: string,
  paragraphs: string[]
): Promise<void> {
  const promises = emails.map(email => sendEmail(email, subject, paragraphs));
  await Promise.allSettled(promises);
}
