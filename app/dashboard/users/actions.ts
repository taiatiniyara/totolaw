/**
 * User Management Server Actions
 * 
 * Server-side actions for user and role management with RBAC
 */

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/connection";
import { user as userTable } from "@/lib/drizzle/schema/auth-schema";
import { organisationMembers } from "@/lib/drizzle/schema/organisation-schema";
import { userRoles, roles, permissions } from "@/lib/drizzle/schema/rbac-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { 
  createInvitation, 
  listInvitationsForOrganisation, 
  revokeInvitation,
  listAllInvitations 
} from "@/lib/services/invitation.service";
import { eq, and } from "drizzle-orm";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

interface UserWithRoles {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
}

/**
 * Get all users in the current organisation
 * Super admins see ALL users from ALL organisations
 */
export async function getUsersForOrganisation(): Promise<ActionResult<UserWithRoles[]>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    const isSuperAdmin = context.organisationId === "*";

    // Get organisation members (or all users for super admins)
    const members = isSuperAdmin
      ? await db
          .select({
            userId: userTable.id,
            email: userTable.email,
            name: userTable.name,
          })
          .from(userTable)
      : await db
          .select({
            userId: organisationMembers.userId,
            email: userTable.email,
            name: userTable.name,
          })
          .from(organisationMembers)
          .innerJoin(userTable, eq(organisationMembers.userId, userTable.id))
          .where(eq(organisationMembers.organisationId, context.organisationId));

    // Get roles for each user
    const usersWithRoles: UserWithRoles[] = await Promise.all(
      members.map(async (member) => {
        // For super admins, get roles from all organisations
        // For regular users, get roles from current organisation only
        const userRolesData = isSuperAdmin
          ? await db
              .select({
                roleName: roles.name,
              })
              .from(userRoles)
              .innerJoin(roles, eq(userRoles.roleId, roles.id))
              .where(eq(userRoles.userId, member.userId))
          : await db
              .select({
                roleName: roles.name,
              })
              .from(userRoles)
              .innerJoin(roles, eq(userRoles.roleId, roles.id))
              .where(
                and(
                  eq(userRoles.userId, member.userId),
                  eq(userRoles.organisationId, context.organisationId)
                )
              );

        return {
          id: member.userId,
          email: member.email,
          name: member.name,
          roles: userRolesData.map((r) => r.roleName),
        };
      })
    );

    return { success: true, data: usersWithRoles };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

/**
 * Get user details by ID
 * Super admins can view any user regardless of organisation
 */
export async function getUserById(userId: string): Promise<ActionResult<UserWithRoles>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    const isSuperAdmin = context.organisationId === "*";

    // Get user
    const [foundUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!foundUser) {
      return { success: false, error: "User not found" };
    }

    // Check if user is in the organisation (skip for super admins)
    if (!isSuperAdmin) {
      const [membership] = await db
        .select()
        .from(organisationMembers)
        .where(
          and(
            eq(organisationMembers.userId, userId),
            eq(organisationMembers.organisationId, context.organisationId)
          )
        )
        .limit(1);

      if (!membership) {
        return { success: false, error: "User not in organisation" };
      }
    }

    // Get user roles (all orgs for super admin, current org for regular users)
    const userRolesData = isSuperAdmin
      ? await db
          .select({
            roleName: roles.name,
          })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(eq(userRoles.userId, userId))
      : await db
          .select({
            roleName: roles.name,
          })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(
            and(
              eq(userRoles.userId, userId),
              eq(userRoles.organisationId, context.organisationId)
            )
          );

    return {
      success: true,
      data: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        roles: userRolesData.map((r) => r.roleName),
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

/**
 * Get available roles for the organisation
 * Super admins see roles from all organisations
 */
export async function getOrganisationRoles(): Promise<ActionResult<{ id: string; name: string; slug: string }[]>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    const isSuperAdmin = context.organisationId === "*";

    const orgRoles = isSuperAdmin
      ? await db
          .select({
            id: roles.id,
            name: roles.name,
            slug: roles.slug,
          })
          .from(roles)
      : await db
          .select({
            id: roles.id,
            name: roles.name,
            slug: roles.slug,
          })
          .from(roles)
          .where(eq(roles.organisationId, context.organisationId));

    return { success: true, data: orgRoles };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { success: false, error: "Failed to fetch roles" };
  }
}

// ========================================
// User Invitation Actions
// ========================================

/**
 * Create a user invitation
 * Requires users:manage permission
 */
export async function inviteUser(
  email: string,
  roleIds: string[] = [],
  permissionIds: string[] = []
): Promise<ActionResult<any>> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canManage = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:manage",
      context.isSuperAdmin
    );

    if (!canManage) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Create invitation
    const invitation = await createInvitation(
      email,
      context.organisationId,
      session.user.id,
      roleIds,
      permissionIds
    );

    return { success: true, data: invitation };
  } catch (error: any) {
    console.error("Error creating invitation:", error);
    return { success: false, error: error.message || "Failed to create invitation" };
  }
}

/**
 * Get invitations for current organisation
 * Requires users:read permission
 */
export async function getInvitations(status?: string): Promise<ActionResult<any[]>> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Super admins can see all invitations
    const invitations = context.isSuperAdmin
      ? await listAllInvitations(status)
      : await listInvitationsForOrganisation(context.organisationId, status);

    return { success: true, data: invitations };
  } catch (error: any) {
    console.error("Error fetching invitations:", error);
    return { success: false, error: error.message || "Failed to fetch invitations" };
  }
}

/**
 * Revoke an invitation
 * Requires users:manage permission
 */
export async function revokeUserInvitation(invitationId: string): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canManage = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:manage",
      context.isSuperAdmin
    );

    if (!canManage) {
      return { success: false, error: "Insufficient permissions" };
    }

    await revokeInvitation(invitationId);

    return { success: true };
  } catch (error: any) {
    console.error("Error revoking invitation:", error);
    return { success: false, error: error.message || "Failed to revoke invitation" };
  }
}

/**
 * Get available permissions (for super admins)
 */
export async function getAvailablePermissions(): Promise<ActionResult<any[]>> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    
    // Only super admins can view all permissions
    if (!context?.isSuperAdmin) {
      return { success: false, error: "Insufficient permissions" };
    }

    const allPermissions = await db.select().from(permissions);

    return { success: true, data: allPermissions };
  } catch (error: any) {
    console.error("Error fetching permissions:", error);
    return { success: false, error: error.message || "Failed to fetch permissions" };
  }
}
