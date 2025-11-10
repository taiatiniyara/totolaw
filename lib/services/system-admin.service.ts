import { db } from "../drizzle/connection";
import { systemAdmins, systemAdminAuditLog } from "../drizzle/schema/system-admin-schema";
import { user } from "../drizzle/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { generateUUID } from "./uuid.service";

/**
 * System Admin Service
 * Manages super admin team members who can set up and configure the entire system
 */

export interface SystemAdminContext {
  id: string;
  email: string;
  name?: string;
  userId?: string;
  isActive: boolean;
}

/**
 * Check if an email is authorized as a system admin
 */
export async function isAuthorizedSystemAdmin(email: string): Promise<boolean> {
  const admin = await db
    .select()
    .from(systemAdmins)
    .where(and(eq(systemAdmins.email, email.toLowerCase()), eq(systemAdmins.isActive, true)))
    .limit(1);

  return admin.length > 0;
}

/**
 * Get system admin record by email
 */
export async function getSystemAdminByEmail(
  email: string
): Promise<SystemAdminContext | null> {
  const admin = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.email, email.toLowerCase()))
    .limit(1);

  if (admin.length === 0) return null;

  return {
    id: admin[0].id,
    email: admin[0].email,
    name: admin[0].name || undefined,
    userId: admin[0].userId || undefined,
    isActive: admin[0].isActive,
  };
}

/**
 * Get system admin record by user ID
 */
export async function getSystemAdminByUserId(
  userId: string
): Promise<SystemAdminContext | null> {
  const admin = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.userId, userId))
    .limit(1);

  if (admin.length === 0) return null;

  return {
    id: admin[0].id,
    email: admin[0].email,
    name: admin[0].name || undefined,
    userId: admin[0].userId || undefined,
    isActive: admin[0].isActive,
  };
}

/**
 * Link a system admin record to a user account after they sign up/login
 * Also updates the user's isSuperAdmin flag
 */
export async function linkSystemAdminToUser(
  email: string,
  userId: string
): Promise<boolean> {
  try {
    console.log(`[linkSystemAdminToUser] Starting for email: ${email}, userId: ${userId}`);
    
    const admin = await getSystemAdminByEmail(email);
    if (!admin) {
      console.log(`[linkSystemAdminToUser] No system admin found for ${email}`);
      return false;
    }
    
    if (!admin.isActive) {
      console.log(`[linkSystemAdminToUser] System admin ${email} is not active`);
      return false;
    }

    console.log(`[linkSystemAdminToUser] Found active admin: ${admin.id}`);

    // Update system admin record
    await db
      .update(systemAdmins)
      .set({
        userId,
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(systemAdmins.id, admin.id));

    console.log(`[linkSystemAdminToUser] Updated system admin record`);

    // Update user's super admin flag
    await db
      .update(user)
      .set({
        isSuperAdmin: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    console.log(`[linkSystemAdminToUser] Updated user super admin flag`);

    // Log the action
    await logSystemAdminAction(
      admin.id,
      "login",
      "system_admin",
      admin.id,
      `System admin ${email} logged in and linked to user account`
    );

    console.log(`[linkSystemAdminToUser] Successfully linked ${email} to user account`);
    return true;
  } catch (error) {
    console.error(`[linkSystemAdminToUser] Error linking system admin:`, error);
    throw error;
  }
}

/**
 * Add a new system admin (can only be done by existing system admins)
 */
export async function addSystemAdmin(
  email: string,
  name: string | null,
  addedBy: string,
  notes?: string
): Promise<string> {
  // Check if email already exists
  const existing = await getSystemAdminByEmail(email);
  if (existing) {
    throw new Error("Email is already registered as a system admin");
  }

  const id = generateUUID();
  await db.insert(systemAdmins).values({
    id,
    email: email.toLowerCase(),
    name,
    isActive: true,
    addedBy,
    notes,
  });

  // Log the action
  await logSystemAdminAction(
    id,
    "created",
    "system_admin",
    id,
    `New system admin added: ${email}`,
    { email, name, notes }
  );

  return id;
}

/**
 * Remove/deactivate a system admin
 */
export async function removeSystemAdmin(
  adminId: string,
  removedBy: string
): Promise<void> {
  const admin = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.id, adminId))
    .limit(1);

  if (admin.length === 0) {
    throw new Error("System admin not found");
  }

  // Deactivate the admin
  await db
    .update(systemAdmins)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(systemAdmins.id, adminId));

  // If linked to a user, remove super admin flag
  if (admin[0].userId) {
    await db
      .update(user)
      .set({
        isSuperAdmin: false,
        updatedAt: new Date(),
      })
      .where(eq(user.id, admin[0].userId));
  }

  // Log the action
  await logSystemAdminAction(
    adminId,
    "deactivated",
    "system_admin",
    adminId,
    `System admin deactivated: ${admin[0].email}`,
    { removedBy }
  );
}

/**
 * Reactivate a system admin
 */
export async function reactivateSystemAdmin(
  adminId: string,
  reactivatedBy: string
): Promise<void> {
  const admin = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.id, adminId))
    .limit(1);

  if (admin.length === 0) {
    throw new Error("System admin not found");
  }

  // Reactivate the admin
  await db
    .update(systemAdmins)
    .set({
      isActive: true,
      updatedAt: new Date(),
    })
    .where(eq(systemAdmins.id, adminId));

  // If linked to a user, restore super admin flag
  if (admin[0].userId) {
    await db
      .update(user)
      .set({
        isSuperAdmin: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, admin[0].userId));
  }

  // Log the action
  await logSystemAdminAction(
    adminId,
    "reactivated",
    "system_admin",
    adminId,
    `System admin reactivated: ${admin[0].email}`,
    { reactivatedBy }
  );
}

/**
 * List all system admins
 */
export async function listSystemAdmins(includeInactive = false) {
  const query = db.select().from(systemAdmins);

  if (!includeInactive) {
    query.where(eq(systemAdmins.isActive, true));
  }

  return await query;
}

/**
 * Get system admin audit log
 */
export async function getSystemAdminAuditLog(
  limit = 100,
  offset = 0,
  adminId?: string
) {
  const query = db
    .select()
    .from(systemAdminAuditLog)
    .orderBy(systemAdminAuditLog.createdAt)
    .limit(limit)
    .offset(offset);

  if (adminId) {
    query.where(eq(systemAdminAuditLog.adminId, adminId));
  }

  return await query;
}

/**
 * Log a system admin action
 */
export async function logSystemAdminAction(
  adminId: string,
  action: string,
  entityType: string | null,
  entityId: string | null,
  description: string,
  metadata?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const id = generateUUID();
  await db.insert(systemAdminAuditLog).values({
    id,
    adminId,
    action,
    entityType,
    entityId,
    description,
    metadata: metadata ? JSON.stringify(metadata) : null,
    ipAddress,
    userAgent,
  });
}

/**
 * Update last login time for a system admin
 */
export async function updateSystemAdminLastLogin(userId: string): Promise<void> {
  const admin = await getSystemAdminByUserId(userId);
  if (!admin) return;

  await db
    .update(systemAdmins)
    .set({
      lastLogin: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(systemAdmins.id, admin.id));
}

/**
 * Check if user should be elevated to super admin on login
 * This is called during authentication flow
 */
export async function checkAndElevateSuperAdmin(
  email: string,
  userId: string
): Promise<boolean> {
  const isAuthorized = await isAuthorizedSystemAdmin(email);
  if (!isAuthorized) {
    return false;
  }

  await linkSystemAdminToUser(email, userId);
  return true;
}
