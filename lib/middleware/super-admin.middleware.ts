import { auth } from "@/lib/auth";
import { checkAndElevateSuperAdmin } from "@/lib/services/system-admin.service";
import { headers } from "next/headers";
import { db } from "@/lib/drizzle/connection";
import { user } from "@/lib/drizzle/schema/auth-schema";
import { eq } from "drizzle-orm";

/**
 * Super Admin Middleware
 * Automatically elevates authorized users to super admin status upon login
 */

export interface SessionWithAdmin {
  session: any;
  user: {
    id: string;
    email: string;
    name: string;
    isSuperAdmin: boolean;
  } | null;
}

/**
 * Get session and check if user should be elevated to super admin
 */
export async function getSessionWithAdminCheck(): Promise<SessionWithAdmin> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { session: null, user: null };
  }

  // Get full user data from database to check isSuperAdmin flag
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (userData.length === 0) {
    return { session: null, user: null };
  }

  const fullUser = userData[0];

  // Check if user should be elevated to super admin
  if (!fullUser.isSuperAdmin && session.user.email) {
    const wasElevated = await checkAndElevateSuperAdmin(
      session.user.email,
      session.user.id
    );

    if (wasElevated) {
      // Get updated user data
      const updatedUserData = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);

      if (updatedUserData.length > 0) {
        return {
          session,
          user: {
            id: updatedUserData[0].id,
            email: updatedUserData[0].email,
            name: updatedUserData[0].name,
            isSuperAdmin: updatedUserData[0].isSuperAdmin,
          },
        };
      }
    }
  }

  return {
    session,
    user: {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      isSuperAdmin: fullUser.isSuperAdmin,
    },
  };
}

/**
 * Require super admin access
 * Use this in server components and actions that require super admin privileges
 */
export async function requireSuperAdmin(): Promise<{
  userId: string;
  email: string;
  name: string;
}> {
  const { user } = await getSessionWithAdminCheck();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (!user.isSuperAdmin) {
    throw new Error("Super admin access required");
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
  };
}

/**
 * Check if current user is a super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const { user } = await getSessionWithAdminCheck();
  return user?.isSuperAdmin || false;
}
