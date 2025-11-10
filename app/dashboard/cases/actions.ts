"use server";

/**
 * Case Management Actions
 * 
 * Server actions for managing cases with multi-tenant organization isolation.
 * All queries include organization filtering for data security.
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/connection";
import { cases } from "@/lib/drizzle/schema/db-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { withOrgFilter, withOrgId, validateOrgAccess } from "@/lib/utils/query-helpers";
import { eq, desc, or, like, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all cases for the current user's organization
 */
export async function getCases(filters?: {
  status?: string;
  assignedTo?: string;
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
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organizationId,
      "cases:read-all"
    );

    if (!canView) {
      // Check if user can at least view their own cases
      const canViewOwn = await hasPermission(
        session.user.id,
        context.organizationId,
        "cases:read-own"
      );
      
      if (!canViewOwn) {
        return { success: false, error: "Permission denied" };
      }
      
      // Return only user's cases
      filters = { ...filters, assignedTo: session.user.id };
    }

    // Build query conditions
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(cases.status, filters.status));
    }
    
    if (filters?.assignedTo) {
      conditions.push(eq(cases.assignedTo, filters.assignedTo));
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
      .where(withOrgFilter(context.organizationId, cases, conditions.length > 0 ? conditions : undefined))
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
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    const [caseRecord] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organizationId, cases, [eq(cases.id, caseId)])
      )
      .limit(1);

    if (!caseRecord) {
      return { success: false, error: "Case not found" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organizationId,
      "cases:read-all"
    );

    if (!canView) {
      // Check if user can view their own cases
      const canViewOwn = await hasPermission(
        session.user.id,
        context.organizationId,
        "cases:read-own"
      );
      
      if (!canViewOwn || 
          (caseRecord.assignedTo !== session.user.id && caseRecord.filedBy !== session.user.id)) {
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
 * Create a new case
 */
export async function createCase(data: {
  title: string;
  type: string;
  status?: string;
  assignedTo?: string;
}): Promise<ActionResult<typeof cases.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    // Check permission
    const canCreate = await hasPermission(
      session.user.id,
      context.organizationId,
      "cases:create"
    );

    if (!canCreate) {
      return { success: false, error: "Permission denied" };
    }

    // Generate ID
    const caseId = crypto.randomUUID();

    // Insert with organization context
    const [newCase] = await db
      .insert(cases)
      .values(
        withOrgId(context.organizationId, {
          id: caseId,
          title: data.title,
          type: data.type,
          status: data.status || "pending",
          assignedTo: data.assignedTo,
          filedBy: session.user.id,
        })
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
    assignedTo: string;
  }>
): Promise<ActionResult<typeof cases.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    // Verify case exists and belongs to organization
    const [existingCase] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organizationId, cases, [eq(cases.id, caseId)])
      )
      .limit(1);

    validateOrgAccess(context.organizationId, existingCase, "Case");

    // Check permission
    const canUpdate = await hasPermission(
      session.user.id,
      context.organizationId,
      "cases:update"
    );

    if (!canUpdate) {
      return { success: false, error: "Permission denied" };
    }

    // Update case
    const [updatedCase] = await db
      .update(cases)
      .set(data)
      .where(
        withOrgFilter(context.organizationId, cases, [eq(cases.id, caseId)])
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
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
    }

    // Verify case exists and belongs to organization
    const [existingCase] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organizationId, cases, [eq(cases.id, caseId)])
      )
      .limit(1);

    validateOrgAccess(context.organizationId, existingCase, "Case");

    // Check permission
    const canDelete = await hasPermission(
      session.user.id,
      context.organizationId,
      "cases:delete"
    );

    if (!canDelete) {
      return { success: false, error: "Permission denied" };
    }

    // Delete case (cascade will handle related records)
    await db
      .delete(cases)
      .where(
        withOrgFilter(context.organizationId, cases, [eq(cases.id, caseId)])
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
    if (!context?.organizationId) {
      return { success: false, error: "No organization context" };
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
      .where(eq(cases.organizationId, context.organizationId));

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching case stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
