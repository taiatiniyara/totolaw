"use server";

import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import {
  addSystemAdmin,
  removeSystemAdmin,
  reactivateSystemAdmin,
  listSystemAdmins,
  getSystemAdminAuditLog,
  logSystemAdminAction,
  getSystemAdminByUserId,
} from "@/lib/services/system-admin.service";
import {
  getUserTenantContext,
  getUserOrganizations,
} from "@/lib/services/tenant.service";
import { db } from "@/lib/drizzle/connection";
import { organizations } from "@/lib/drizzle/schema/organization-schema";
import { roles, permissions } from "@/lib/drizzle/schema/rbac-schema";
import { eq } from "drizzle-orm";

/**
 * Server Actions for Super Admin Dashboard
 */

// ========================================
// System Admin Management
// ========================================

export async function getSystemAdmins() {
  await requireSuperAdmin();
  const admins = await listSystemAdmins(true);
  return { success: true, admins };
}

export async function addNewSystemAdmin(
  email: string,
  name: string,
  notes?: string
) {
  const admin = await requireSuperAdmin();
  const adminRecord = await getSystemAdminByUserId(admin.userId);

  if (!adminRecord) {
    return { error: "Not authorized" };
  }

  try {
    const newAdminId = await addSystemAdmin(
      email,
      name || null,
      admin.userId,
      notes
    );
    return { success: true, adminId: newAdminId };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deactivateSystemAdmin(adminId: string) {
  const admin = await requireSuperAdmin();

  try {
    await removeSystemAdmin(adminId, admin.userId);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function activateSystemAdmin(adminId: string) {
  const admin = await requireSuperAdmin();

  try {
    await reactivateSystemAdmin(adminId, admin.userId);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getAuditLog(limit = 50, offset = 0) {
  await requireSuperAdmin();
  const logs = await getSystemAdminAuditLog(limit, offset);
  return { success: true, logs };
}

// ========================================
// System Overview
// ========================================

export async function getSystemOverview() {
  const admin = await requireSuperAdmin();
  const adminRecord = await getSystemAdminByUserId(admin.userId);

  // Get counts
  const orgs = await db.select().from(organizations);
  const allRoles = await db.select().from(roles);
  const allPermissions = await db.select().from(permissions);
  const admins = await listSystemAdmins(true);

  // Get admin's context
  const context = await getUserTenantContext(admin.userId);
  const userOrgs = await getUserOrganizations(admin.userId);

  return {
    success: true,
    overview: {
      totalOrganizations: orgs.length,
      activeOrganizations: orgs.filter((o) => o.isActive).length,
      totalRoles: allRoles.length,
      totalPermissions: allPermissions.length,
      totalAdmins: admins.length,
      activeAdmins: admins.filter((a) => a.isActive).length,
    },
    currentAdmin: {
      email: admin.email,
      name: admin.name,
      linkedOrganizations: userOrgs.length,
      currentOrganization: context?.organizationId || "None",
    },
    adminRecord,
  };
}

// ========================================
// Organization Management
// ========================================

export async function getAllOrganizations() {
  await requireSuperAdmin();
  const orgs = await db.select().from(organizations);
  return { success: true, organizations: orgs };
}

export async function createOrganization(data: {
  name: string;
  code: string;
  type: string;
  description?: string;
  parentId?: string;
}) {
  const admin = await requireSuperAdmin();
  const adminRecord = await getSystemAdminByUserId(admin.userId);

  if (!adminRecord) {
    return { error: "Not authorized" };
  }

  const { generateUUID } = await import("@/lib/services/uuid.service");
  const orgId = generateUUID();

  try {
    await db.insert(organizations).values({
      id: orgId,
      name: data.name,
      code: data.code.toUpperCase(),
      type: data.type,
      description: data.description || null,
      parentId: data.parentId || null,
      isActive: true,
      createdBy: admin.userId,
    });

    // Log the action
    await logSystemAdminAction(
      adminRecord.id,
      "created_organization",
      "organization",
      orgId,
      `Created organization: ${data.name} (${data.code})`,
      data
    );

    return { success: true, organizationId: orgId };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateOrganizationStatus(
  orgId: string,
  isActive: boolean
) {
  const admin = await requireSuperAdmin();
  const adminRecord = await getSystemAdminByUserId(admin.userId);

  if (!adminRecord) {
    return { error: "Not authorized" };
  }

  try {
    await db
      .update(organizations)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(organizations.id, orgId));

    // Log the action
    await logSystemAdminAction(
      adminRecord.id,
      isActive ? "activated_organization" : "deactivated_organization",
      "organization",
      orgId,
      `Organization ${isActive ? "activated" : "deactivated"}`,
      { orgId, isActive }
    );

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ========================================
// Role & Permission Overview
// ========================================

export async function getRolesAndPermissions() {
  await requireSuperAdmin();

  const allRoles = await db.select().from(roles);
  const allPermissions = await db.select().from(permissions);

  // Group roles by organization
  const rolesByOrg = allRoles.reduce((acc, role) => {
    const orgId = role.organizationId;
    if (!acc[orgId]) acc[orgId] = [];
    acc[orgId].push(role);
    return acc;
  }, {} as Record<string, typeof allRoles>);

  // Group permissions by resource
  const permissionsByResource = allPermissions.reduce((acc, perm) => {
    const resource = perm.resource;
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(perm);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  return {
    success: true,
    roles: allRoles,
    rolesByOrg,
    permissions: allPermissions,
    permissionsByResource,
  };
}
