"use server";

/**
 * Dashboard Actions
 * 
 * General dashboard actions including logout and organization switching.
 */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { 
  getUserTenantContext, 
  getUserOrganizations,
  switchUserOrganization 
} from "@/lib/services/tenant.service";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Logout the current user
 */
export async function logoutAction() {
  try {
    await authClient.signOut();
    redirect("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to logout");
  }
}

/**
 * Get current organization context
 */
export async function getCurrentOrganization(): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    
    return { 
      success: true, 
      data: context 
    };
  } catch (error) {
    console.error("Error getting organization context:", error);
    return { 
      success: false, 
      error: "Failed to get organization context" 
    };
  }
}

/**
 * Get all organizations the user has access to
 */
export async function getAvailableOrganizations(): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const organizations = await getUserOrganizations(session.user.id);
    
    return { 
      success: true, 
      data: organizations 
    };
  } catch (error) {
    console.error("Error getting organizations:", error);
    return { 
      success: false, 
      error: "Failed to get organizations" 
    };
  }
}

/**
 * Switch to a different organization
 */
export async function switchOrganization(
  organizationId: string
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await switchUserOrganization(session.user.id, organizationId);
    
    // Revalidate all dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/cases");
    
    return { 
      success: true, 
      data: { organizationId } 
    };
  } catch (error) {
    console.error("Error switching organization:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to switch organization" 
    };
  }
}

/**
 * Get upcoming hearings for dashboard
 */
export async function getUpcomingHearings(limit: number = 5): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "Organization context not found" };
    }

    const { db } = await import("@/lib/drizzle/connection");
    const { hearings, cases } = await import("@/lib/drizzle/schema/db-schema");
    const { withOrgFilter } = await import("@/lib/utils/query-helpers");
    const { gte, asc, eq } = await import("drizzle-orm");

    const results = await db
      .select({
        id: hearings.id,
        caseId: hearings.caseId,
        caseTitle: cases.title,
        date: hearings.date,
        location: hearings.location,
      })
      .from(hearings)
      .innerJoin(cases, eq(hearings.caseId, cases.id))
      .where(withOrgFilter(context.organizationId, hearings, [
        gte(hearings.date, new Date())
      ]))
      .orderBy(asc(hearings.date))
      .limit(limit);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching upcoming hearings:", error);
    return { success: false, error: "Failed to fetch upcoming hearings" };
  }
}

/**
 * Get recent cases for dashboard
 */
export async function getRecentCases(limit: number = 5): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "Organization context not found" };
    }

    const { db } = await import("@/lib/drizzle/connection");
    const { cases } = await import("@/lib/drizzle/schema/db-schema");
    const { withOrgFilter } = await import("@/lib/utils/query-helpers");
    const { desc } = await import("drizzle-orm");

    const results = await db
      .select({
        id: cases.id,
        title: cases.title,
        type: cases.type,
        status: cases.status,
        createdAt: cases.createdAt,
      })
      .from(cases)
      .where(withOrgFilter(context.organizationId, cases))
      .orderBy(desc(cases.createdAt))
      .limit(limit);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching recent cases:", error);
    return { success: false, error: "Failed to fetch recent cases" };
  }
}
