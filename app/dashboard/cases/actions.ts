"use server";

/**
 * Case Management Actions
 * 
 * Server actions for managing cases with multi-tenant organisation isolation.
 * All queries include organisation filtering for data security.
 * 
 * Enhanced for Fiji court system support.
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/connection";
import { cases } from "@/lib/drizzle/schema/db-schema";
import { organisations } from "@/lib/drizzle/schema/organisation-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { withOrgFilter, withOrgId, validateOrgAccess } from "@/lib/utils/query-helpers";
import { generateCaseNumber } from "@/lib/utils/case-number";
import { eq, desc, or, like, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all cases for the current user's organisation
 */
export async function getCases(filters?: {
  status?: string;
  assignedJudge?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<typeof cases.$inferSelect[]>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "cases:read-all",
      context.isSuperAdmin
    );

    if (!canView) {
      // Check if user can at least view their own cases
      const canViewOwn = await hasPermission(
        session.user.id,
        context.organisationId,
        "cases:read-own",
        context.isSuperAdmin
      );
      
      if (!canViewOwn) {
        return { success: false, error: "Permission denied" };
      }
      
      // Return only user's cases
      filters = { ...filters, assignedJudge: session.user.id };
    }

    // Build query conditions
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(cases.status, filters.status));
    }
    
    if (filters?.assignedJudge) {
      conditions.push(eq(cases.assignedJudgeId, filters.assignedJudge));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(cases.title, `%${filters.search}%`),
        like(cases.type, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const query = db
      .select()
      .from(cases)
      .where(withOrgFilter(context.organisationId, cases, conditions.length > 0 ? conditions : undefined))
      .orderBy(desc(cases.createdAt));

    if (filters?.limit) {
      query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query.offset(filters.offset);
    }

    const results = await query;

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching cases:", error);
    return { success: false, error: "Failed to fetch cases" };
  }
}

/**
 * Get a single case by ID
 */
export async function getCaseById(
  caseId: string
): Promise<ActionResult<typeof cases.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    const [caseRecord] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organisationId, cases, [eq(cases.id, caseId)])
      )
      .limit(1);

    if (!caseRecord) {
      return { success: false, error: "Case not found" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "cases:read-all",
      context.isSuperAdmin
    );

    if (!canView) {
      // Check if user can view their own cases
      const canViewOwn = await hasPermission(
        session.user.id,
        context.organisationId,
        "cases:read-own",
        context.isSuperAdmin
      );
      
      if (!canViewOwn || 
          (caseRecord.assignedJudgeId !== session.user.id && 
           caseRecord.assignedClerkId !== session.user.id && 
           caseRecord.filedBy !== session.user.id)) {
        return { success: false, error: "Permission denied" };
      }
    }

    return { success: true, data: caseRecord };
  } catch (error) {
    console.error("Error fetching case:", error);
    return { success: false, error: "Failed to fetch case" };
  }
}

/**
 * Create a new case (Enhanced for Fiji court system)
 */
export async function createCase(data: {
  title: string;
  type: string;
  courtLevel: string;
  caseType?: string;
  status?: string;
  parties: {
    prosecution?: { name: string; counsel?: string }[];
    defense?: { name: string; counsel?: string }[];
    plaintiff?: { name: string; counsel?: string }[];
    defendant?: { name: string; counsel?: string }[];
    appellant?: { name: string; counsel?: string }[];
    respondent?: { name: string; counsel?: string }[];
  };
  offences?: string[];
  assignedJudgeId?: string;
  assignedClerkId?: string;
}): Promise<ActionResult<typeof cases.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canCreate = await hasPermission(
      session.user.id,
      context.organisationId,
      "cases:create",
      context.isSuperAdmin
    );

    if (!canCreate) {
      return { success: false, error: "Permission denied" };
    }

    // Generate case number based on court level and type
    const caseNumber = await generateCaseNumber(
      context.organisationId,
      data.courtLevel,
      data.caseType || data.type,
      new Date().getFullYear()
    );

    // Generate ID
    const caseId = crypto.randomUUID();
    const now = new Date();

    // Insert with organisation context
    const [newCase] = await db
      .insert(cases)
      .values(
        withOrgId(context.organisationId, {
          id: caseId,
          caseNumber,
          title: data.title,
          type: data.type,
          courtLevel: data.courtLevel,
          caseType: data.caseType,
          status: data.status || "open",
          parties: data.parties,
          offences: data.offences,
          assignedJudgeId: data.assignedJudgeId,
          assignedClerkId: data.assignedClerkId,
          filedBy: session.user.id,
          filedDate: now,
        }) as any
      )
      .returning();

    revalidatePath("/dashboard/cases");

    return { success: true, data: newCase };
  } catch (error) {
    console.error("Error creating case:", error);
    return { success: false, error: "Failed to create case" };
  }
}

/**
 * Update a case
 */
export async function updateCase(
  caseId: string,
  data: Partial<{
    title: string;
    type: string;
    status: string;
    assignedJudgeId: string;
    assignedClerkId: string;
  }>
): Promise<ActionResult<typeof cases.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Verify case exists and belongs to organisation
    const [existingCase] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organisationId, cases, [eq(cases.id, caseId)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existingCase, "Case");

    // Check permission
    const canUpdate = await hasPermission(
      session.user.id,
      context.organisationId,
      "cases:update",
      context.isSuperAdmin
    );

    if (!canUpdate) {
      return { success: false, error: "Permission denied" };
    }

    // Update case
    const [updatedCase] = await db
      .update(cases)
      .set(data)
      .where(
        withOrgFilter(context.organisationId, cases, [eq(cases.id, caseId)])
      )
      .returning();

    revalidatePath("/dashboard/cases");
    revalidatePath(`/dashboard/cases/${caseId}`);

    return { success: true, data: updatedCase };
  } catch (error) {
    console.error("Error updating case:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update case",
    };
  }
}

/**
 * Delete a case
 */
export async function deleteCase(caseId: string): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Verify case exists and belongs to organisation
    const [existingCase] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organisationId, cases, [eq(cases.id, caseId)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existingCase, "Case");

    // Check permission
    const canDelete = await hasPermission(
      session.user.id,
      context.organisationId,
      "cases:delete",
      context.isSuperAdmin
    );

    if (!canDelete) {
      return { success: false, error: "Permission denied" };
    }

    // Delete case (cascade will handle related records)
    await db
      .delete(cases)
      .where(
        withOrgFilter(context.organisationId, cases, [eq(cases.id, caseId)])
      );

    revalidatePath("/dashboard/cases");

    return { success: true };
  } catch (error) {
    console.error("Error deleting case:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete case",
    };
  }
}

/**
 * Get case statistics for dashboard
 */
export async function getCaseStats(): Promise<
  ActionResult<{
    total: number;
    active: number;
    pending: number;
    closed: number;
  }>
> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Get counts for each status
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where status = 'active')::int`,
        pending: sql<number>`count(*) filter (where status = 'pending')::int`,
        closed: sql<number>`count(*) filter (where status = 'closed')::int`,
      })
      .from(cases)
      .where(eq(cases.organisationId, context.organisationId));

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching case stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}

/**
 * Get court organisations for selection
 */
export async function getCourtOrganisations(): Promise<
  ActionResult<{
    id: string;
    name: string;
    courtLevel?: string | null;
    courtType?: string | null;
  }[]>
> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const courts = await db
      .select({
        id: organisations.id,
        name: organisations.name,
        courtLevel: organisations.courtLevel,
        courtType: organisations.courtType,
      })
      .from(organisations)
      .where(eq(organisations.isActive, true))
      .orderBy(organisations.name);

    return { success: true, data: courts };
  } catch (error) {
    console.error("Error fetching courts:", error);
    return { success: false, error: "Failed to fetch courts" };
  }
}
