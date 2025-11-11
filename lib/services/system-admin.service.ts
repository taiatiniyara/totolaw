import { db } from "../drizzle/connection";
import { systemAdminAuditLog } from "../drizzle/schema/system-admin-schema";
import { user } from "../drizzle/schema/auth-schema";
import { eq, isNotNull } from "drizzle-orm";
import { generateUUID } from "./uuid.service";
import { notifySuperAdminAdded } from "./notification.service";

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  adminNotes?: string | null;
  adminAddedBy?: string | null;
  adminAddedAt?: Date | null;
  lastLogin?: Date | null;
}

export async function isSuperAdmin(userId: string): Promise<boolean> {
  const result = await db
    .select({ isSuperAdmin: user.isSuperAdmin })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return result.length > 0 && result[0].isSuperAdmin;
}

export async function isSuperAdminByEmail(email: string): Promise<boolean> {
  const result = await db
    .select({ isSuperAdmin: user.isSuperAdmin })
    .from(user)
    .where(eq(user.email, email.toLowerCase()))
    .limit(1);
  return result.length > 0 && result[0].isSuperAdmin;
}

export async function getSuperAdminById(userId: string): Promise<SuperAdminUser | null> {
  const result = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  if (result.length === 0 || !result[0].isSuperAdmin) return null;
  return {
    id: result[0].id,
    email: result[0].email,
    name: result[0].name,
    isSuperAdmin: result[0].isSuperAdmin,
    adminNotes: result[0].adminNotes,
    adminAddedBy: result[0].adminAddedBy,
    adminAddedAt: result[0].adminAddedAt,
    lastLogin: result[0].lastLogin,
  };
}

export async function getSuperAdminByEmail(email: string): Promise<SuperAdminUser | null> {
  const result = await db.select().from(user).where(eq(user.email, email.toLowerCase())).limit(1);
  if (result.length === 0 || !result[0].isSuperAdmin) return null;
  return {
    id: result[0].id,
    email: result[0].email,
    name: result[0].name,
    isSuperAdmin: result[0].isSuperAdmin,
    adminNotes: result[0].adminNotes,
    adminAddedBy: result[0].adminAddedBy,
    adminAddedAt: result[0].adminAddedAt,
    lastLogin: result[0].lastLogin,
  };
}

export async function grantSuperAdmin(userId: string, grantedBy: string, notes?: string): Promise<void> {
  const existingUser = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  if (existingUser.length === 0) throw new Error("User not found");
  if (existingUser[0].isSuperAdmin) return;

  // Get the granter's name for the email
  const granterUser = await db.select().from(user).where(eq(user.id, grantedBy)).limit(1);
  const granterName = granterUser.length > 0 ? granterUser[0].name : "System Administrator";

  await db.update(user).set({
    isSuperAdmin: true,
    adminAddedBy: grantedBy,
    adminAddedAt: new Date(),
    adminNotes: notes,
    updatedAt: new Date(),
  }).where(eq(user.id, userId));

  await logSystemAdminAction(grantedBy, "granted_super_admin", "user", userId,
    `Super admin privileges granted to ${existingUser[0].email}`,
    { userId, email: existingUser[0].email, notes });

  // Send email notification to the new super admin
  try {
    await notifySuperAdminAdded(
      existingUser[0].email,
      existingUser[0].name,
      granterName,
      notes
    );
  } catch (error) {
    console.error("Failed to send super admin notification email:", error);
    // Don't throw - we still want the admin to be added even if email fails
  }
}

export async function revokeSuperAdmin(userId: string, revokedBy: string, reason?: string): Promise<void> {
  const existingUser = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  if (existingUser.length === 0) throw new Error("User not found");
  if (!existingUser[0].isSuperAdmin) return;

  const updateNotes = reason ? `${existingUser[0].adminNotes || ""}\nRevoked: ${reason}`.trim() : existingUser[0].adminNotes;
  await db.update(user).set({
    isSuperAdmin: false,
    adminNotes: updateNotes,
    updatedAt: new Date(),
  }).where(eq(user.id, userId));

  await logSystemAdminAction(revokedBy, "revoked_super_admin", "user", userId,
    `Super admin privileges revoked from ${existingUser[0].email}`,
    { userId, email: existingUser[0].email, reason });
}

export async function grantSuperAdminByEmail(email: string, name: string, grantedBy: string, notes?: string): Promise<string> {
  const existingUser = await db.select().from(user).where(eq(user.email, email.toLowerCase())).limit(1);
  if (existingUser.length > 0) {
    await grantSuperAdmin(existingUser[0].id, grantedBy, notes);
    return existingUser[0].id;
  }

  // Get the granter's name for the email
  const granterUser = await db.select().from(user).where(eq(user.id, grantedBy)).limit(1);
  const granterName = granterUser.length > 0 ? granterUser[0].name : "System Administrator";

  const userId = generateUUID();
  await db.insert(user).values({
    id: userId,
    email: email.toLowerCase(),
    name,
    emailVerified: false,
    isSuperAdmin: true,
    adminAddedBy: grantedBy,
    adminAddedAt: new Date(),
    adminNotes: notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await logSystemAdminAction(grantedBy, "granted_super_admin", "user", userId,
    `Super admin privileges granted to new user ${email}`,
    { userId, email, name, notes });

  // Send email notification to the new super admin
  try {
    await notifySuperAdminAdded(
      email.toLowerCase(),
      name,
      granterName,
      notes
    );
  } catch (error) {
    console.error("Failed to send super admin notification email:", error);
    // Don't throw - we still want the admin to be added even if email fails
  }

  return userId;
}

export async function listSuperAdmins(): Promise<SuperAdminUser[]> {
  // Return all users who have ever been admins (including deactivated ones)
  // by checking if adminAddedAt is not null
  const results = await db.select().from(user).where(isNotNull(user.adminAddedAt)).orderBy(user.adminAddedAt);
  return results.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    isSuperAdmin: u.isSuperAdmin,
    adminNotes: u.adminNotes,
    adminAddedBy: u.adminAddedBy,
    adminAddedAt: u.adminAddedAt,
    lastLogin: u.lastLogin,
  }));
}

export async function getSystemAdminAuditLog(limit = 100, offset = 0, userId?: string) {
  let query = db.select().from(systemAdminAuditLog).orderBy(systemAdminAuditLog.createdAt).limit(limit).offset(offset);
  if (userId) query = query.where(eq(systemAdminAuditLog.userId, userId)) as any;
  return await query;
}

export async function logSystemAdminAction(userId: string, action: string, entityType: string | null, entityId: string | null, description: string, metadata?: any, ipAddress?: string, userAgent?: string): Promise<void> {
  const id = generateUUID();
  await db.insert(systemAdminAuditLog).values({
    id, userId, action, entityType, entityId, description,
    metadata: metadata ? JSON.stringify(metadata) : null,
    ipAddress, userAgent,
  });
}

export async function updateSuperAdminLastLogin(userId: string): Promise<void> {
  const isSuperAdminUser = await isSuperAdmin(userId);
  if (!isSuperAdminUser) return;
  await db.update(user).set({ lastLogin: new Date(), updatedAt: new Date() }).where(eq(user.id, userId));
}
