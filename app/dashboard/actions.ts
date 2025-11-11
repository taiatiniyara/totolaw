"use server";

/**
 * Dashboard Actions
 * 
 * General dashboard actions including logout and organisation switching.
 */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { 
  getUserTenantContext, 
  getUserOrganisations,
  switchUserOrganisation 
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
 * Get current organisation context
 * Super admins get special context with "*" organisation ID for omnipotent access
 */
export async function getCurrentOrganisation(): Promise<ActionResult> {
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
    console.error("Error getting organisation context:", error);
    return { 
      success: false, 
      error: "Failed to get organisation context" 
    };
  }
}

/**
 * Get all organisations the user has access to
 */
export async function getAvailableOrganisations(): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const organisations = await getUserOrganisations(session.user.id);
    
    return { 
      success: true, 
      data: organisations 
    };
  } catch (error) {
    console.error("Error getting organisations:", error);
    return { 
      success: false, 
      error: "Failed to get organisations" 
    };
  }
}

/**
 * Switch to a different organisation
 */
export async function switchOrganisation(
  organisationId: string
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await switchUserOrganisation(session.user.id, organisationId);
    
    // Revalidate all dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/cases");
    
    return { 
      success: true, 
      data: { organisationId } 
    };
  } catch (error) {
    console.error("Error switching organisation:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to switch organisation" 
    };
  }
}

/**
 * Get upcoming hearings for dashboard
 * Super admins see hearings from all organisations
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
    if (!context?.organisationId) {
      return { success: false, error: "Organisation context not found" };
    }

    const { db } = await import("@/lib/drizzle/connection");
    const { hearings, cases } = await import("@/lib/drizzle/schema/db-schema");
    const { withOrgFilter } = await import("@/lib/utils/query-helpers");
    const { gte, asc, eq } = await import("drizzle-orm");

    const conditions = withOrgFilter(context.organisationId, hearings, [
      gte(hearings.scheduledDate, new Date())
    ]);

    const results = await db
      .select({
        id: hearings.id,
        caseId: hearings.caseId,
        caseTitle: cases.title,
        scheduledDate: hearings.scheduledDate,
        scheduledTime: hearings.scheduledTime,
        location: hearings.location,
        organisationId: hearings.organisationId,
      })
      .from(hearings)
      .innerJoin(cases, eq(hearings.caseId, cases.id))
      .where(conditions)
      .orderBy(asc(hearings.scheduledDate))
      .limit(limit);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching upcoming hearings:", error);
    return { success: false, error: "Failed to fetch upcoming hearings" };
  }
}

/**
 * Get recent cases for dashboard
 * Super admins see cases from all organisations
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
    if (!context?.organisationId) {
      return { success: false, error: "Organisation context not found" };
    }

    const { db } = await import("@/lib/drizzle/connection");
    const { cases } = await import("@/lib/drizzle/schema/db-schema");
    const { withOrgFilter } = await import("@/lib/utils/query-helpers");
    const { desc } = await import("drizzle-orm");

    const conditions = withOrgFilter(context.organisationId, cases);

    const results = await db
      .select({
        id: cases.id,
        title: cases.title,
        type: cases.type,
        status: cases.status,
        createdAt: cases.createdAt,
        organisationId: cases.organisationId,
      })
      .from(cases)
      .where(conditions)
      .orderBy(desc(cases.createdAt))
      .limit(limit);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching recent cases:", error);
    return { success: false, error: "Failed to fetch recent cases" };
  }
}
