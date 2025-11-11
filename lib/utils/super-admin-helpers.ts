/**
 * Super Admin Helper Utilities
 * 
 * Centralized helpers for checking super admin status and handling
 * omnipotent access across the application.
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/drizzle/connection";
import { user } from "@/lib/drizzle/schema/auth-schema";
import { eq } from "drizzle-orm";

/**
 * Check if the current session belongs to a super admin
 */
export async function isCurrentUserSuperAdmin(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return false;
    }

    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    return userData[0]?.isSuperAdmin || false;
  } catch (error) {
    console.error("Error checking super admin status:", error);
    return false;
  }
}

/**
 * Check if a user ID is a super admin
 */
export async function isUserSuperAdmin(userId: string): Promise<boolean> {
  try {
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return userData[0]?.isSuperAdmin || false;
  } catch (error) {
    console.error("Error checking super admin status:", error);
    return false;
  }
}

/**
 * Check if an organization ID represents super admin omnipotent access
 */
export function isSuperAdminContext(organizationId: string | null | undefined): boolean {
  return organizationId === "*";
}

/**
 * Require super admin access or throw error
 */
export async function requireSuperAdmin(): Promise<void> {
  const isSuperAdmin = await isCurrentUserSuperAdmin();
  
  if (!isSuperAdmin) {
    throw new Error("Super admin access required");
  }
}

/**
 * Get user session with super admin status
 */
export async function getSessionWithSuperAdminStatus() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    return { session: null, isSuperAdmin: false };
  }

  const isSuperAdmin = await isUserSuperAdmin(session.user.id);
  
  return { session, isSuperAdmin };
}

/**
 * Bypass organization check for super admins
 * Returns true if access should be granted
 */
export function shouldBypassOrgCheck(
  organizationId: string | null | undefined,
  isSuperAdmin: boolean
): boolean {
  return isSuperAdmin || organizationId === "*";
}
