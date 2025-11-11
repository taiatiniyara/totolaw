"use server";

import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import {
  grantSuperAdminByEmail,
  revokeSuperAdmin,
  grantSuperAdmin,
  listSuperAdmins,
  getSystemAdminAuditLog,
  logSystemAdminAction,
  getSuperAdminById,
} from "@/lib/services/system-admin.service";
import {
  getUserTenantContext,
  getUserOrganisations,
} from "@/lib/services/tenant.service";
import { db } from "@/lib/drizzle/connection";
import { organisations } from "@/lib/drizzle/schema/organisation-schema";
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
  const admins = await listSuperAdmins();
  return { success: true, admins };
}

export async function addNewSystemAdmin(
  email: string,
  name: string,
  notes?: string
) {
  const admin = await requireSuperAdmin();

  try {
    const newUserId = await grantSuperAdminByEmail(
      email,
      name,
      admin.userId,
      notes
    );
    return { success: true, userId: newUserId };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deactivateSystemAdmin(userId: string) {
  const admin = await requireSuperAdmin();

  try {
    await revokeSuperAdmin(userId, admin.userId, "Deactivated by admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function activateSystemAdmin(userId: string) {
  const admin = await requireSuperAdmin();

  try {
    await grantSuperAdmin(userId, admin.userId, "Reactivated by admin");
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
  const adminRecord = await getSuperAdminById(admin.userId);

  // Get counts
  const orgs = await db.select().from(organisations);
  const allRoles = await db.select().from(roles);
  const allPermissions = await db.select().from(permissions);
  const admins = await listSuperAdmins();

  // Get admin's context
  const context = await getUserTenantContext(admin.userId);
  const userOrgs = await getUserOrganisations(admin.userId);

  return {
    success: true,
    overview: {
      totalOrganisations: orgs.length,
      activeOrganisations: orgs.filter((o) => o.isActive).length,
      totalRoles: allRoles.length,
      totalPermissions: allPermissions.length,
      totalAdmins: admins.length,
      activeAdmins: admins.filter((a) => a.isSuperAdmin).length,
    },
    currentAdmin: {
      email: admin.email,
      name: admin.name,
      linkedOrganisations: userOrgs.length,
      currentOrganisation: context?.organisationId || "None",
    },
    adminRecord,
  };
}

// ========================================
// Organisation Management
// ========================================

export async function getAllOrganisations() {
  await requireSuperAdmin();
  const orgs = await db.select().from(organisations);
  return { success: true, organisations: orgs };
}

export async function createOrganisation(data: {
  name: string;
  code: string;
  type: string;
  description?: string;
  parentId?: string;
}) {
  const admin = await requireSuperAdmin();

  const { generateUUID } = await import("@/lib/services/uuid.service");
  const orgId = generateUUID();

  try {
    await db.insert(organisations).values({
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
      admin.userId,
      "created_organisation",
      "organisation",
      orgId,
      `Created organisation: ${data.name} (${data.code})`,
      data
    );

    return { success: true, organisationId: orgId };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateOrganisation(
  orgId: string,
  data: {
    name?: string;
    type?: string;
    description?: string;
    parentId?: string;
  }
) {
  const admin = await requireSuperAdmin();

  try {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined)
      updateData.description = data.description || null;
    if (data.parentId !== undefined)
      updateData.parentId = data.parentId || null;

    await db
      .update(organisations)
      .set(updateData)
      .where(eq(organisations.id, orgId));

    // Log the action
    await logSystemAdminAction(
      admin.userId,
      "updated_organisation",
      "organisation",
      orgId,
      `Updated organisation details`,
      data
    );

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateOrganisationStatus(
  orgId: string,
  isActive: boolean
) {
  const admin = await requireSuperAdmin();

  try {
    await db
      .update(organisations)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(organisations.id, orgId));

    // Log the action
    await logSystemAdminAction(
      admin.userId,
      isActive ? "activated_organisation" : "deactivated_organisation",
      "organisation",
      orgId,
      `Organisation ${isActive ? "activated" : "deactivated"}`,
      { orgId, isActive }
    );

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getOrganisationById(orgId: string) {
  await requireSuperAdmin();

  try {
    const org = await db
      .select()
      .from(organisations)
      .where(eq(organisations.id, orgId))
      .limit(1);

    if (!org.length) {
      return { error: "Organisation not found" };
    }

    return { success: true, organisation: org[0] };
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

  // Group roles by organisation
  const rolesByOrg = allRoles.reduce((acc, role) => {
    const orgId = role.organisationId;
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

// ========================================
// User Invitation (System Admin)
// ========================================

/**
 * Create a system admin invitation with full control
 * Super admins can invite users to any organisation with any roles/permissions
 */
export async function createSystemAdminInvitation(
  email: string,
  organisationId: string,
  roleIds: string[] = [],
  permissionIds: string[] = []
) {
  const admin = await requireSuperAdmin();

  try {
    const { createInvitation } = await import("@/lib/services/invitation.service");
    
    const invitation = await createInvitation(
      email,
      organisationId,
      admin.userId,
      roleIds,
      permissionIds
    );

    // Log the action
    await logSystemAdminAction(
      admin.userId,
      "created_user_invitation",
      "invitation",
      invitation.id,
      `Invited ${email} to organisation ${organisationId}`,
      { email, organisationId, roleIds, permissionIds }
    );

    return { success: true, invitation };
  } catch (error: any) {
    return { error: error.message };
  }
}
