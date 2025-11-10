/**
 * User Management Server Actions
 * 
 * Server-side actions for user and role management with RBAC
 */

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/connection";
import { user as userTable } from "@/lib/drizzle/schema/auth-schema";
import { organizationMembers } from "@/lib/drizzle/schema/organization-schema";
import { userRoles, roles } from "@/lib/drizzle/schema/rbac-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
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
 * Get all users in the current organization
 */
export async function getUsersForOrganization(): Promise<ActionResult<UserWithRoles[]>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organizationId,
      "users:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    // Get organization members
    const members = await db
      .select({
        userId: organizationMembers.userId,
        email: userTable.email,
        name: userTable.name,
      })
      .from(organizationMembers)
      .innerJoin(userTable, eq(organizationMembers.userId, userTable.id))
      .where(eq(organizationMembers.organizationId, context.organizationId));

    // Get roles for each user
    const usersWithRoles: UserWithRoles[] = await Promise.all(
      members.map(async (member) => {
        const userRolesData = await db
          .select({
            roleName: roles.name,
          })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(
            and(
              eq(userRoles.userId, member.userId),
              eq(userRoles.organizationId, context.organizationId)
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
 */
export async function getUserById(userId: string): Promise<ActionResult<UserWithRoles>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organizationId,
      "users:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    // Get user
    const [foundUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!foundUser) {
      return { success: false, error: "User not found" };
    }

    // Check if user is in the organization
    const [membership] = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.organizationId, context.organizationId)
        )
      )
      .limit(1);

    if (!membership) {
      return { success: false, error: "User not in organization" };
    }

    // Get user roles
    const userRolesData = await db
      .select({
        roleName: roles.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.organizationId, context.organizationId)
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
 * Get available roles for the organization
 */
export async function getOrganizationRoles(): Promise<ActionResult<{ id: string; name: string; slug: string }[]>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    const orgRoles = await db
      .select({
        id: roles.id,
        name: roles.name,
        slug: roles.slug,
      })
      .from(roles)
      .where(eq(roles.organizationId, context.organizationId));

    return { success: true, data: orgRoles };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { success: false, error: "Failed to fetch roles" };
  }
}
