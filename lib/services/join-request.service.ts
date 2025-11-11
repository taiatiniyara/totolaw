/**
 * Organisation Join Request Service
 * 
 * Handles user-initiated requests to join organisations
 */

import { db } from "../drizzle/connection";
import { 
  organisationJoinRequests,
  organisations,
  organisationMembers
} from "../drizzle/schema/organisation-schema";
import { user } from "../drizzle/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { generateUUID } from "./uuid.service";
import { sendEmail } from "./email.service";

export interface JoinRequestData {
  id: string;
  organisationId: string;
  organisationName: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: string;
  message?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
}

/**
 * Create a join request
 */
export async function createJoinRequest(
  userId: string,
  organisationId: string,
  message?: string
): Promise<JoinRequestData> {
  // Check if organisation exists and is active
  const org = await db
    .select()
    .from(organisations)
    .where(and(
      eq(organisations.id, organisationId),
      eq(organisations.isActive, true)
    ))
    .limit(1);
  
  if (org.length === 0) {
    throw new Error("Organisation not found or inactive");
  }

  // Check if user exists
  const requestingUser = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (requestingUser.length === 0) {
    throw new Error("User not found");
  }

  // Check if user is already a member
  const existingMembership = await db
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, userId),
        eq(organisationMembers.organisationId, organisationId),
        eq(organisationMembers.isActive, true)
      )
    )
    .limit(1);

  if (existingMembership.length > 0) {
    throw new Error("You are already a member of this organisation");
  }

  // Check if there's already a pending request
  const existingRequest = await db
    .select()
    .from(organisationJoinRequests)
    .where(
      and(
        eq(organisationJoinRequests.userId, userId),
        eq(organisationJoinRequests.organisationId, organisationId),
        eq(organisationJoinRequests.status, "pending")
      )
    )
    .limit(1);

  if (existingRequest.length > 0) {
    throw new Error("You already have a pending request for this organisation");
  }

  // Create the request
  const requestId = generateUUID();
  await db.insert(organisationJoinRequests).values({
    id: requestId,
    organisationId,
    userId,
    status: "pending",
    message,
  });

  // Notify organisation admins
  await notifyOrganisationAdmins(
    organisationId,
    requestingUser[0].name || requestingUser[0].email,
    requestingUser[0].email,
    org[0].name
  );

  return {
    id: requestId,
    organisationId,
    organisationName: org[0].name,
    userId,
    userEmail: requestingUser[0].email,
    userName: requestingUser[0].name,
    status: "pending",
    message,
    createdAt: new Date(),
  };
}

/**
 * Notify organisation admins about new join request
 */
async function notifyOrganisationAdmins(
  organisationId: string,
  userName: string,
  userEmail: string,
  organisationName: string
): Promise<void> {
  // Get all organisation admins (users with users:manage permission)
  // For now, we'll skip this and add it later when we have a proper way to query admins
  // This is a placeholder for future enhancement
  console.log(`New join request from ${userName} (${userEmail}) for ${organisationName}`);
}

/**
 * Get join request by ID
 */
export async function getJoinRequestById(requestId: string): Promise<any> {
  const reviewer = alias(user, "reviewer");
  
  const result = await db
    .select({
      request: organisationJoinRequests,
      organisation: organisations,
      user: user,
      reviewer: reviewer,
    })
    .from(organisationJoinRequests)
    .innerJoin(organisations, eq(organisationJoinRequests.organisationId, organisations.id))
    .innerJoin(user, eq(organisationJoinRequests.userId, user.id))
    .leftJoin(
      reviewer,
      eq(organisationJoinRequests.reviewedBy, reviewer.id)
    )
    .where(eq(organisationJoinRequests.id, requestId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const r = result[0];
  return {
    ...r.request,
    organisation: r.organisation,
    user: r.user,
    reviewer: r.reviewer,
  };
}

/**
 * Approve a join request
 */
export async function approveJoinRequest(
  requestId: string,
  reviewerId: string,
  roleIds: string[] = []
): Promise<void> {
  const request = await getJoinRequestById(requestId);

  if (!request) {
    throw new Error("Join request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Request has already been processed");
  }

  // Add user to organisation
  const membershipId = generateUUID();
  const existingMembership = await db
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, request.userId),
        eq(organisationMembers.organisationId, request.organisationId)
      )
    )
    .limit(1);

  if (existingMembership.length === 0) {
    await db.insert(organisationMembers).values({
      id: membershipId,
      organisationId: request.organisationId,
      userId: request.userId,
      isPrimary: false,
      isActive: true,
      addedBy: reviewerId,
    });
  } else {
    // Reactivate if inactive
    await db
      .update(organisationMembers)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(organisationMembers.id, existingMembership[0].id));
  }

  // Assign roles if specified
  if (roleIds.length > 0) {
    const { userRoles } = await import("../drizzle/schema/rbac-schema");
    
    for (const roleId of roleIds) {
      const existingRole = await db
        .select()
        .from(userRoles)
        .where(
          and(
            eq(userRoles.userId, request.userId),
            eq(userRoles.roleId, roleId),
            eq(userRoles.organisationId, request.organisationId)
          )
        )
        .limit(1);

      if (existingRole.length === 0) {
        const userRoleId = generateUUID();
        await db.insert(userRoles).values({
          id: userRoleId,
          userId: request.userId,
          roleId,
          organisationId: request.organisationId,
          isActive: true,
          assignedBy: reviewerId,
        });
      }
    }
  }

  // Update request status
  await db
    .update(organisationJoinRequests)
    .set({
      status: "approved",
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(organisationJoinRequests.id, requestId));

  // Send approval email to user
  await sendApprovalEmail(
    request.user.email,
    request.user.name,
    request.organisation.name
  );
}

/**
 * Reject a join request
 */
export async function rejectJoinRequest(
  requestId: string,
  reviewerId: string,
  reason?: string
): Promise<void> {
  const request = await getJoinRequestById(requestId);

  if (!request) {
    throw new Error("Join request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Request has already been processed");
  }

  // Update request status
  await db
    .update(organisationJoinRequests)
    .set({
      status: "rejected",
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      rejectionReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(organisationJoinRequests.id, requestId));

  // Send rejection email to user
  await sendRejectionEmail(
    request.user.email,
    request.user.name,
    request.organisation.name,
    reason
  );
}

/**
 * Send approval email
 */
async function sendApprovalEmail(
  email: string,
  userName: string,
  organisationName: string
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const loginUrl = `${baseUrl}/auth/login`;

  const paragraphs = [
    `Great news, ${userName}!`,
    `Your request to join <strong>${organisationName}</strong> has been <strong>approved</strong>.`,
    `You can now log in and access the organisation's resources:`,
    `<a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Log In</a>`,
    `Welcome to ${organisationName}!`,
  ];

  await sendEmail(
    email,
    `Your request to join ${organisationName} has been approved`,
    paragraphs
  );
}

/**
 * Send rejection email
 */
async function sendRejectionEmail(
  email: string,
  userName: string,
  organisationName: string,
  reason?: string
): Promise<void> {
  const paragraphs = [
    `Hello ${userName},`,
    `We regret to inform you that your request to join <strong>${organisationName}</strong> has been declined.`,
  ];

  if (reason) {
    paragraphs.push(`<p><strong>Reason:</strong> ${reason}</p>`);
  }

  paragraphs.push(
    `If you have any questions or would like to discuss this further, please contact the organisation administrators.`,
    `Thank you for your interest in ${organisationName}.`
  );

  await sendEmail(
    email,
    `Your request to join ${organisationName}`,
    paragraphs
  );
}

/**
 * List join requests for an organisation
 */
export async function listJoinRequestsForOrganisation(
  organisationId: string,
  status?: string
): Promise<any[]> {
  const reviewer = alias(user, "reviewer");
  
  const baseQuery = db
    .select({
      request: organisationJoinRequests,
      user: user,
      reviewer: reviewer,
    })
    .from(organisationJoinRequests)
    .innerJoin(user, eq(organisationJoinRequests.userId, user.id))
    .leftJoin(
      reviewer,
      eq(organisationJoinRequests.reviewedBy, reviewer.id)
    );

  const results = status
    ? await baseQuery.where(
        and(
          eq(organisationJoinRequests.organisationId, organisationId),
          eq(organisationJoinRequests.status, status)
        )
      )
    : await baseQuery.where(eq(organisationJoinRequests.organisationId, organisationId));

  return results.map((r) => ({
    ...r.request,
    userName: r.user.name,
    userEmail: r.user.email,
    reviewerName: r.reviewer?.name || null,
    reviewerEmail: r.reviewer?.email || null,
  }));
}

/**
 * List all join requests (for system admins)
 */
export async function listAllJoinRequests(status?: string): Promise<any[]> {
  const reviewer = alias(user, "reviewer");
  
  const baseQuery = db
    .select({
      request: organisationJoinRequests,
      organisation: organisations,
      user: user,
      reviewer: reviewer,
    })
    .from(organisationJoinRequests)
    .innerJoin(organisations, eq(organisationJoinRequests.organisationId, organisations.id))
    .innerJoin(user, eq(organisationJoinRequests.userId, user.id))
    .leftJoin(
      reviewer,
      eq(organisationJoinRequests.reviewedBy, reviewer.id)
    );

  const results = status
    ? await baseQuery.where(eq(organisationJoinRequests.status, status))
    : await baseQuery;

  return results.map((r) => ({
    ...r.request,
    organisationName: r.organisation.name,
    organisationCode: r.organisation.code,
    userName: r.user.name,
    userEmail: r.user.email,
    reviewerName: r.reviewer?.name || null,
    reviewerEmail: r.reviewer?.email || null,
  }));
}

/**
 * Get user's join requests
 */
export async function getUserJoinRequests(userId: string): Promise<any[]> {
  const results = await db
    .select({
      request: organisationJoinRequests,
      organisation: organisations,
      reviewer: user,
    })
    .from(organisationJoinRequests)
    .innerJoin(organisations, eq(organisationJoinRequests.organisationId, organisations.id))
    .leftJoin(user, eq(organisationJoinRequests.reviewedBy, user.id))
    .where(eq(organisationJoinRequests.userId, userId));

  return results.map((r) => ({
    ...r.request,
    organisationName: r.organisation.name,
    organisationCode: r.organisation.code,
    reviewerName: r.reviewer?.name || null,
  }));
}

/**
 * Cancel a join request (by the user who created it)
 */
export async function cancelJoinRequest(requestId: string, userId: string): Promise<void> {
  const request = await db
    .select()
    .from(organisationJoinRequests)
    .where(eq(organisationJoinRequests.id, requestId))
    .limit(1);

  if (request.length === 0) {
    throw new Error("Request not found");
  }

  if (request[0].userId !== userId) {
    throw new Error("Unauthorized: You can only cancel your own requests");
  }

  if (request[0].status !== "pending") {
    throw new Error("Can only cancel pending requests");
  }

  await db
    .delete(organisationJoinRequests)
    .where(eq(organisationJoinRequests.id, requestId));
}
