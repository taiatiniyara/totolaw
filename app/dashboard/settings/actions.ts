"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/connection";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { generateUUID } from "@/lib/services/uuid.service";
import { 
  roles, 
  permissions, 
  rolePermissions, 
  userRoles 
} from "@/lib/drizzle/schema/rbac-schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * Get all roles for the current organisation
 */
export async function getOrganisationRoles() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  try {
    const orgRoles = await db
      .select()
      .from(roles)
      .where(
        and(
          eq(roles.organisationId, context.organisationId),
          eq(roles.isActive, true)
        )
      );

    return { success: true, roles: orgRoles };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get all permissions in the system
 */
export async function getAllPermissions() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const allPermissions = await db.select().from(permissions);
    
    // Group by resource for easier display
    const permissionsByResource = allPermissions.reduce((acc, perm) => {
      if (!acc[perm.resource]) {
        acc[perm.resource] = [];
      }
      acc[perm.resource].push(perm);
      return acc;
    }, {} as Record<string, typeof allPermissions>);

    return { 
      success: true, 
      permissions: allPermissions,
      permissionsByResource 
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get permissions for a specific role
 */
export async function getRolePermissions(roleId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  try {
    // Verify role belongs to user's organisation
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1)
      .then(results => results[0]);

    if (!role || role.organisationId !== context.organisationId) {
      return { error: "Role not found" };
    }

    // Get role permissions
    const rolePerms = await db
      .select({
        permission: permissions,
        rolePermission: rolePermissions,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
      .where(eq(rolePermissions.roleId, roleId));

    return { 
      success: true, 
      role,
      permissions: rolePerms.map(rp => rp.permission) 
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Create a new role
 */
export async function createRole(data: {
  name: string;
  slug: string;
  description?: string;
  permissionIds: string[];
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  // Check permission
  const canManage = await hasPermission(
    session.user.id,
    context.organisationId,
    "roles:create",
    context.isSuperAdmin
  );

  if (!canManage) {
    return { error: "Permission denied: Cannot create roles" };
  }

  try {
    const roleId = generateUUID();

    // Create role
    await db.insert(roles).values({
      id: roleId,
      organisationId: context.organisationId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      isSystem: false,
      isActive: true,
    });

    // Assign permissions
    if (data.permissionIds.length > 0) {
      const rolePermValues = data.permissionIds.map(permId => ({
        id: generateUUID(),
        roleId,
        permissionId: permId,
        createdBy: session.user.id,
      }));

      await db.insert(rolePermissions).values(rolePermValues);
    }

    return { success: true, roleId };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Update a role
 */
export async function updateRole(
  roleId: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    permissionIds?: string[];
  }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  // Check permission
  const canManage = await hasPermission(
    session.user.id,
    context.organisationId,
    "roles:update",
    context.isSuperAdmin
  );

  if (!canManage) {
    return { error: "Permission denied: Cannot update roles" };
  }

  try {
    // Verify role belongs to organisation and is not system role
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1)
      .then(results => results[0]);

    if (!role || role.organisationId !== context.organisationId) {
      return { error: "Role not found" };
    }

    if (role.isSystem) {
      return { error: "Cannot modify system roles" };
    }

    // Update role details
    if (data.name || data.slug || data.description !== undefined) {
      await db
        .update(roles)
        .set({
          name: data.name || role.name,
          slug: data.slug || role.slug,
          description: data.description !== undefined ? data.description : role.description,
          updatedAt: new Date(),
        })
        .where(eq(roles.id, roleId));
    }

    // Update permissions if provided
    if (data.permissionIds) {
      // Remove existing permissions
      await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

      // Add new permissions
      if (data.permissionIds.length > 0) {
        const rolePermValues = data.permissionIds.map(permId => ({
          id: generateUUID(),
          roleId,
          permissionId: permId,
          createdBy: session.user.id,
        }));

        await db.insert(rolePermissions).values(rolePermValues);
      }
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete a role
 */
export async function deleteRole(roleId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  // Check permission
  const canManage = await hasPermission(
    session.user.id,
    context.organisationId,
    "roles:delete",
    context.isSuperAdmin
  );

  if (!canManage) {
    return { error: "Permission denied: Cannot delete roles" };
  }

  try {
    // Verify role belongs to organisation and is not system role
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1)
      .then(results => results[0]);

    if (!role || role.organisationId !== context.organisationId) {
      return { error: "Role not found" };
    }

    if (role.isSystem) {
      return { error: "Cannot delete system roles" };
    }

    // Check if role is assigned to any users
    const assignments = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.roleId, roleId),
          eq(userRoles.isActive, true)
        )
      )
      .limit(1);

    if (assignments.length > 0) {
      return { error: "Cannot delete role: It is assigned to users" };
    }

    // Soft delete role
    await db
      .update(roles)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(roles.id, roleId));

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get users with a specific role
 */
export async function getUsersWithRole(roleId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  try {
    // Verify role belongs to organisation
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1)
      .then(results => results[0]);

    if (!role || role.organisationId !== context.organisationId) {
      return { error: "Role not found" };
    }

    // Get user assignments
    const assignments = await db
      .select({
        userRole: userRoles,
      })
      .from(userRoles)
      .where(
        and(
          eq(userRoles.roleId, roleId),
          eq(userRoles.isActive, true)
        )
      );

    return { success: true, assignments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Assign role to a user
 */
export async function assignRoleToUser(userId: string, roleId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  // Check permission
  const canAssign = await hasPermission(
    session.user.id,
    context.organisationId,
    "roles:assign",
    context.isSuperAdmin
  );

  if (!canAssign) {
    return { error: "Permission denied: Cannot assign roles" };
  }

  try {
    // Verify role belongs to organisation
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1)
      .then(results => results[0]);

    if (!role || role.organisationId !== context.organisationId) {
      return { error: "Role not found" };
    }

    // Check if user already has this role
    const existing = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleId, roleId),
          eq(userRoles.organisationId, context.organisationId),
          eq(userRoles.isActive, true)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { error: "User already has this role" };
    }

    // Assign role
    const userRoleId = generateUUID();
    await db.insert(userRoles).values({
      id: userRoleId,
      userId,
      roleId,
      organisationId: context.organisationId,
      assignedBy: session.user.id,
      isActive: true,
    });

    return { success: true, userRoleId };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get user roles for display in UI
 */
export async function getUserRolesForDisplay(userId: string, organisationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  try {
    const userRoleRecords = await db
      .select({
        role: roles,
        userRole: userRoles,
      })
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.organisationId, organisationId),
          eq(userRoles.isActive, true)
        )
      );

    return { success: true, data: userRoleRecords };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Revoke role from a user
 */
export async function revokeRoleFromUser(userRoleId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    return { error: "No organisation context" };
  }

  // Check permission
  const canRevoke = await hasPermission(
    session.user.id,
    context.organisationId,
    "roles:revoke",
    context.isSuperAdmin
  );

  if (!canRevoke) {
    return { error: "Permission denied: Cannot revoke roles" };
  }

  try {
    // Verify assignment belongs to organisation
    const assignment = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.id, userRoleId))
      .limit(1)
      .then(results => results[0]);

    if (!assignment || assignment.organisationId !== context.organisationId) {
      return { error: "Role assignment not found" };
    }

    // Revoke role
    await db
      .update(userRoles)
      .set({
        isActive: false,
        revokedAt: new Date(),
        revokedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(userRoles.id, userRoleId));

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
