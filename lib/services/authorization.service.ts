import { db } from "../drizzle/connection";
import { 
  roles, 
  permissions, 
  userRoles, 
  userPermissions,
  rolePermissions 
} from "../drizzle/schema/rbac-schema";
import { eq, and, inArray, or, sql } from "drizzle-orm";

/**
 * Authorization Service
 * Handles role-based access control (RBAC) and permission checking
 */

export interface UserPermissions {
  userId: string;
  organisationId: string;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
}

/**
 * Get all permissions for a user in a specific organisation
 */
export async function getUserPermissions(
  userId: string,
  organisationId: string,
  isSuperAdmin: boolean = false
): Promise<UserPermissions> {
  // Super admins have all permissions
  if (isSuperAdmin) {
    const allPermissions = await db.select().from(permissions);
    return {
      userId,
      organisationId,
      roles: ["super-admin"],
      permissions: allPermissions.map(p => p.slug),
      isSuperAdmin: true,
    };
  }

  // Get user's active roles in this organisation
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
        eq(userRoles.isActive, true),
        or(
          sql`${userRoles.expiresAt} IS NULL`,
          sql`${userRoles.expiresAt} > NOW()`
        )
      )
    );

  const roleIds = userRoleRecords.map(r => r.role.id);
  const roleNames = userRoleRecords.map(r => r.role.slug);

  // Get permissions from roles
  const rolePermissionRecords = roleIds.length > 0 
    ? await db
        .select({
          permission: permissions,
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
        .where(inArray(rolePermissions.roleId, roleIds))
    : [];

  const rolePermissionSlugs = rolePermissionRecords.map(rp => rp.permission.slug);

  // Get direct user permissions (grants and denies)
  const directPermissions = await db
    .select({
      permission: permissions,
      userPermission: userPermissions,
    })
    .from(userPermissions)
    .innerJoin(permissions, eq(permissions.id, userPermissions.permissionId))
    .where(
      and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.organisationId, organisationId),
        or(
          sql`${userPermissions.expiresAt} IS NULL`,
          sql`${userPermissions.expiresAt} > NOW()`
        )
      )
    );

  // Process direct permissions (explicit grants and denies)
  const grantedPermissions = directPermissions
    .filter(dp => dp.userPermission.granted)
    .map(dp => dp.permission.slug);
  
  const deniedPermissions = directPermissions
    .filter(dp => !dp.userPermission.granted)
    .map(dp => dp.permission.slug);

  // Combine permissions: role permissions + granted - denied
  const allPermissions = new Set([
    ...rolePermissionSlugs,
    ...grantedPermissions,
  ]);

  // Remove explicitly denied permissions
  deniedPermissions.forEach(p => allPermissions.delete(p));

  return {
    userId,
    organisationId,
    roles: roleNames,
    permissions: Array.from(allPermissions),
    isSuperAdmin: false,
  };
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(
  userId: string,
  organisationId: string,
  permissionSlug: string,
  isSuperAdmin: boolean = false
): Promise<boolean> {
  if (isSuperAdmin) {
    return true;
  }

  const userPerms = await getUserPermissions(userId, organisationId, isSuperAdmin);
  return userPerms.permissions.includes(permissionSlug);
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(
  userId: string,
  organisationId: string,
  permissionSlugs: string[],
  isSuperAdmin: boolean = false
): Promise<boolean> {
  if (isSuperAdmin) {
    return true;
  }

  const userPerms = await getUserPermissions(userId, organisationId, isSuperAdmin);
  return permissionSlugs.some(slug => userPerms.permissions.includes(slug));
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(
  userId: string,
  organisationId: string,
  permissionSlugs: string[],
  isSuperAdmin: boolean = false
): Promise<boolean> {
  if (isSuperAdmin) {
    return true;
  }

  const userPerms = await getUserPermissions(userId, organisationId, isSuperAdmin);
  return permissionSlugs.every(slug => userPerms.permissions.includes(slug));
}

/**
 * Check if user has a specific role
 */
export async function hasRole(
  userId: string,
  organisationId: string,
  roleSlug: string,
  isSuperAdmin: boolean = false
): Promise<boolean> {
  if (isSuperAdmin) {
    return true;
  }

  const userPerms = await getUserPermissions(userId, organisationId, isSuperAdmin);
  return userPerms.roles.includes(roleSlug);
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(
  userId: string,
  organisationId: string,
  roleSlugs: string[],
  isSuperAdmin: boolean = false
): Promise<boolean> {
  if (isSuperAdmin) {
    return true;
  }

  const userPerms = await getUserPermissions(userId, organisationId, isSuperAdmin);
  return roleSlugs.some(slug => userPerms.roles.includes(slug));
}

/**
 * Check if user has all specified roles
 */
export async function hasAllRoles(
  userId: string,
  organisationId: string,
  roleSlugs: string[],
  isSuperAdmin: boolean = false
): Promise<boolean> {
  if (isSuperAdmin) {
    return true;
  }

  const userPerms = await getUserPermissions(userId, organisationId, isSuperAdmin);
  return roleSlugs.every(slug => userPerms.roles.includes(slug));
}

/**
 * Get all roles for a user in a specific organisation
 */
export async function getUserRoles(userId: string, organisationId: string) {
  return await db
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
}

/**
 * Assign a role to a user
 */
export async function assignRole(
  userId: string,
  roleId: string,
  organisationId: string,
  assignedBy: string,
  scope?: string,
  expiresAt?: Date
) {
  const roleRecord = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1).then(results => results[0]);

  if (!roleRecord || roleRecord.organisationId !== organisationId) {
    throw new Error("Role not found or does not belong to this organisation");
  }

  const { generateUUID } = await import("./uuid.service");
  const id = generateUUID();

  await db.insert(userRoles).values({
    id,
    userId,
    roleId,
    organisationId,
    assignedBy,
    scope,
    expiresAt,
    isActive: true,
  });

  return id;
}

/**
 * Revoke a role from a user
 */
export async function revokeRole(
  userRoleId: string,
  revokedBy: string
): Promise<void> {
  await db
    .update(userRoles)
    .set({
      isActive: false,
      revokedAt: new Date(),
      revokedBy,
      updatedAt: new Date(),
    })
    .where(eq(userRoles.id, userRoleId));
}

/**
 * Grant a direct permission to a user
 */
export async function grantPermission(
  userId: string,
  permissionId: string,
  organisationId: string,
  assignedBy: string,
  conditions?: string,
  scope?: string,
  expiresAt?: Date
): Promise<string> {
  const { generateUUID } = await import("./uuid.service");
  const id = generateUUID();

  await db.insert(userPermissions).values({
    id,
    userId,
    permissionId,
    organisationId,
    granted: true,
    conditions,
    scope,
    assignedBy,
    expiresAt,
  });

  return id;
}

/**
 * Deny a permission for a user (explicit deny overrides role permissions)
 */
export async function denyPermission(
  userId: string,
  permissionId: string,
  organisationId: string,
  assignedBy: string,
  expiresAt?: Date
): Promise<string> {
  const { generateUUID } = await import("./uuid.service");
  const id = generateUUID();

  await db.insert(userPermissions).values({
    id,
    userId,
    permissionId,
    organisationId,
    granted: false,
    assignedBy,
    expiresAt,
  });

  return id;
}

/**
 * Revoke a direct user permission
 */
export async function revokeUserPermission(
  userPermissionId: string,
  revokedBy: string
): Promise<void> {
  await db
    .update(userPermissions)
    .set({
      revokedAt: new Date(),
      revokedBy,
      updatedAt: new Date(),
    })
    .where(eq(userPermissions.id, userPermissionId));
}
