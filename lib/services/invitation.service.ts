/**
 * User Invitation Service
 * 
 * Handles user invitations to organisations with role assignments
 */

import { db } from "../drizzle/connection";
import { 
  organisationInvitations, 
  organisations,
  organisationMembers
} from "../drizzle/schema/organisation-schema";
import { user } from "../drizzle/schema/auth-schema";
import { roles, userRoles, permissions, userPermissions } from "../drizzle/schema/rbac-schema";
import { eq, and } from "drizzle-orm";
import { generateUUID } from "./uuid.service";
import { notifyUserInvitation } from "./notification.service";
import crypto from "crypto";

export interface InvitationData {
  id: string;
  organisationId: string;
  organisationName: string;
  email: string;
  roleIds: string[];
  permissionIds: string[];
  token: string;
  status: string;
  invitedBy: string;
  invitedByName: string;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Create a new user invitation
 */
export async function createInvitation(
  email: string,
  organisationId: string,
  invitedBy: string,
  roleIds: string[] = [],
  permissionIds: string[] = [],
  expiresInDays: number = 7
): Promise<InvitationData> {
  // Check if organisation exists
  const org = await db
    .select()
    .from(organisations)
    .where(eq(organisations.id, organisationId))
    .limit(1);
  
  if (org.length === 0) {
    throw new Error("Organisation not found");
  }

  // Check if user already has a pending invitation
  const existingInvitation = await db
    .select()
    .from(organisationInvitations)
    .where(
      and(
        eq(organisationInvitations.email, email.toLowerCase()),
        eq(organisationInvitations.organisationId, organisationId),
        eq(organisationInvitations.status, "pending")
      )
    )
    .limit(1);

  if (existingInvitation.length > 0) {
    throw new Error("User already has a pending invitation to this organisation");
  }

  // Check if user is already a member
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email.toLowerCase()))
    .limit(1);

  if (existingUser.length > 0) {
    const membership = await db
      .select()
      .from(organisationMembers)
      .where(
        and(
          eq(organisationMembers.userId, existingUser[0].id),
          eq(organisationMembers.organisationId, organisationId),
          eq(organisationMembers.isActive, true)
        )
      )
      .limit(1);

    if (membership.length > 0) {
      throw new Error("User is already a member of this organisation");
    }
  }

  // Validate roles
  if (roleIds.length > 0) {
    const validRoles = await db
      .select()
      .from(roles)
      .where(
        and(
          eq(roles.organisationId, organisationId),
          eq(roles.isActive, true)
        )
      );

    const validRoleIds = validRoles.map(r => r.id);
    const invalidRoles = roleIds.filter(id => !validRoleIds.includes(id));

    if (invalidRoles.length > 0) {
      throw new Error(`Invalid role IDs: ${invalidRoles.join(", ")}`);
    }
  }

  // Validate permissions
  if (permissionIds.length > 0) {
    const validPermissions = await db
      .select()
      .from(permissions);

    const validPermissionIds = validPermissions.map(p => p.id);
    const invalidPermissions = permissionIds.filter(id => !validPermissionIds.includes(id));

    if (invalidPermissions.length > 0) {
      throw new Error(`Invalid permission IDs: ${invalidPermissions.join(", ")}`);
    }
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");

  // Create invitation
  const invitationId = generateUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  await db.insert(organisationInvitations).values({
    id: invitationId,
    organisationId,
    email: email.toLowerCase(),
    roleId: roleIds.length > 0 ? roleIds[0] : null, // Store first role in roleId field for backward compatibility
    token,
    status: "pending",
    invitedBy,
    expiresAt,
  });

  // Store additional role and permission data in metadata (we'll need to create a metadata field or handle this differently)
  // For now, we'll store roles and permissions separately when accepting the invitation

  // Get inviter details
  const inviter = await db
    .select()
    .from(user)
    .where(eq(user.id, invitedBy))
    .limit(1);

  // Send invitation email using notification service
  await notifyUserInvitation(
    email,
    org[0].name,
    inviter.length > 0 ? inviter[0].name || "System Administrator" : "System Administrator",
    token,
    expiresInDays
  );

  return {
    id: invitationId,
    organisationId,
    organisationName: org[0].name,
    email: email.toLowerCase(),
    roleIds,
    permissionIds,
    token,
    status: "pending",
    invitedBy,
    invitedByName: inviter.length > 0 ? inviter[0].name : "System Administrator",
    expiresAt,
    createdAt: new Date(),
  };
}



/**
 * Get invitation by token
 */
export async function getInvitationByToken(token: string): Promise<any> {
  const invitation = await db
    .select({
      invitation: organisationInvitations,
      organisation: organisations,
      inviter: user,
    })
    .from(organisationInvitations)
    .innerJoin(
      organisations,
      eq(organisationInvitations.organisationId, organisations.id)
    )
    .leftJoin(
      user,
      eq(organisationInvitations.invitedBy, user.id)
    )
    .where(eq(organisationInvitations.token, token))
    .limit(1);

  if (invitation.length === 0) {
    return null;
  }

  const inv = invitation[0];

  // Check if expired
  if (inv.invitation.status !== "pending" || new Date() > inv.invitation.expiresAt) {
    return {
      ...inv.invitation,
      organisation: inv.organisation,
      inviter: inv.inviter,
      expired: true,
    };
  }

  return {
    ...inv.invitation,
    organisation: inv.organisation,
    inviter: inv.inviter,
    expired: false,
  };
}

/**
 * Accept invitation and create/link user
 */
export async function acceptInvitation(
  token: string,
  userName: string
): Promise<{ userId: string; organisationId: string }> {
  const invitationData = await getInvitationByToken(token);

  if (!invitationData) {
    throw new Error("Invalid invitation token");
  }

  if (invitationData.expired || invitationData.status !== "pending") {
    throw new Error("Invitation has expired or already been used");
  }

  const email = invitationData.email;
  const organisationId = invitationData.organisationId;
  const roleId = invitationData.roleId;

  // Check if user already exists
  let userId: string;
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email.toLowerCase()))
    .limit(1);

  if (existingUser.length > 0) {
    userId = existingUser[0].id;
    
    // Update user name if not set
    if (!existingUser[0].name && userName) {
      await db
        .update(user)
        .set({ name: userName, updatedAt: new Date() })
        .where(eq(user.id, userId));
    }
  } else {
    // Create new user
    userId = generateUUID();
    await db.insert(user).values({
      id: userId,
      email: email.toLowerCase(),
      name: userName,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Add user to organisation
  const membershipId = generateUUID();
  const existingMembership = await db
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, userId),
        eq(organisationMembers.organisationId, organisationId)
      )
    )
    .limit(1);

  if (existingMembership.length === 0) {
    await db.insert(organisationMembers).values({
      id: membershipId,
      organisationId,
      userId,
      isPrimary: false,
      isActive: true,
      addedBy: invitationData.invitedBy,
    });
  } else {
    // Reactivate membership if inactive
    await db
      .update(organisationMembers)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(organisationMembers.id, existingMembership[0].id));
  }

  // Assign role if specified
  if (roleId) {
    const existingRole = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleId, roleId),
          eq(userRoles.organisationId, organisationId)
        )
      )
      .limit(1);

    if (existingRole.length === 0) {
      const userRoleId = generateUUID();
      await db.insert(userRoles).values({
        id: userRoleId,
        userId,
        roleId,
        organisationId,
        isActive: true,
        assignedBy: invitationData.invitedBy,
      });
    }
  }

  // Mark invitation as accepted
  await db
    .update(organisationInvitations)
    .set({
      status: "accepted",
      acceptedBy: userId,
      acceptedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(organisationInvitations.id, invitationData.id));

  return { userId, organisationId };
}

/**
 * Revoke an invitation
 */
export async function revokeInvitation(invitationId: string): Promise<void> {
  await db
    .update(organisationInvitations)
    .set({
      status: "revoked",
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(organisationInvitations.id, invitationId));
}

/**
 * List invitations for an organisation
 */
export async function listInvitationsForOrganisation(
  organisationId: string,
  status?: string
): Promise<any[]> {
  const baseQuery = db
    .select({
      invitation: organisationInvitations,
      inviter: user,
    })
    .from(organisationInvitations)
    .leftJoin(user, eq(organisationInvitations.invitedBy, user.id));

  const results = status
    ? await baseQuery.where(
        and(
          eq(organisationInvitations.organisationId, organisationId),
          eq(organisationInvitations.status, status)
        )
      )
    : await baseQuery.where(eq(organisationInvitations.organisationId, organisationId));

  return results.map((r) => ({
    ...r.invitation,
    inviterName: r.inviter?.name || "Unknown",
    inviterEmail: r.inviter?.email || "Unknown",
  }));
}

/**
 * List all invitations (for system admins)
 */
export async function listAllInvitations(status?: string): Promise<any[]> {
  const baseQuery = db
    .select({
      invitation: organisationInvitations,
      organisation: organisations,
      inviter: user,
    })
    .from(organisationInvitations)
    .innerJoin(
      organisations,
      eq(organisationInvitations.organisationId, organisations.id)
    )
    .leftJoin(user, eq(organisationInvitations.invitedBy, user.id));

  const results = status
    ? await baseQuery.where(eq(organisationInvitations.status, status))
    : await baseQuery;

  return results.map((r) => ({
    ...r.invitation,
    organisationName: r.organisation.name,
    organisationCode: r.organisation.code,
    inviterName: r.inviter?.name || "Unknown",
    inviterEmail: r.inviter?.email || "Unknown",
  }));
}

/**
 * System admin specific invitation with full control
 * Allows assigning multiple roles and direct permissions
 */
export async function createSystemAdminInvitation(
  email: string,
  organisationId: string,
  invitedBy: string,
  roleIds: string[] = [],
  permissionIds: string[] = [],
  expiresInDays: number = 7
): Promise<InvitationData> {
  // This is essentially the same as createInvitation but called by system admins
  // System admins can bypass certain restrictions
  return createInvitation(
    email,
    organisationId,
    invitedBy,
    roleIds,
    permissionIds,
    expiresInDays
  );
}

/**
 * Accept system admin invitation with multiple roles and permissions
 */
export async function acceptSystemAdminInvitation(
  token: string,
  userName: string,
  additionalRoleIds: string[] = [],
  additionalPermissionIds: string[] = []
): Promise<{ userId: string; organisationId: string }> {
  // First accept the basic invitation
  const result = await acceptInvitation(token, userName);

  // Then assign additional roles
  for (const roleId of additionalRoleIds) {
    const existingRole = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, result.userId),
          eq(userRoles.roleId, roleId),
          eq(userRoles.organisationId, result.organisationId)
        )
      )
      .limit(1);

    if (existingRole.length === 0) {
      const userRoleId = generateUUID();
      await db.insert(userRoles).values({
        id: userRoleId,
        userId: result.userId,
        roleId,
        organisationId: result.organisationId,
        isActive: true,
        assignedBy: result.userId, // Self-assigned from invitation
      });
    }
  }

  // Assign additional direct permissions
  for (const permissionId of additionalPermissionIds) {
    const existingPermission = await db
      .select()
      .from(userPermissions)
      .where(
        and(
          eq(userPermissions.userId, result.userId),
          eq(userPermissions.permissionId, permissionId),
          eq(userPermissions.organisationId, result.organisationId)
        )
      )
      .limit(1);

    if (existingPermission.length === 0) {
      const userPermissionId = generateUUID();
      await db.insert(userPermissions).values({
        id: userPermissionId,
        userId: result.userId,
        permissionId,
        organisationId: result.organisationId,
        granted: true,
        assignedBy: result.userId, // Self-assigned from invitation
      });
    }
  }

  return result;
}
