/**
 * Hearing Management Server Actions
 * 
 * Server-side actions for hearing scheduling and management with RBAC
 */

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/connection";
import { hearings } from "@/lib/drizzle/schema/db-schema";
import { cases } from "@/lib/drizzle/schema/db-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { eq, desc, gte } from "drizzle-orm";
import { withOrgFilter, withOrgId } from "@/lib/utils/query-helpers";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

interface HearingWithCase {
  id: string;
  caseId: string;
  caseTitle: string;
  date: Date;
  location: string | null;
  judgeId: string | null;
  bailDecision: string | null;
  createdAt: Date;
}

/**
 * Get all hearings for the organization
 */
export async function getHearings(options?: {
  limit?: number;
  upcoming?: boolean;
  caseId?: string;
}): Promise<ActionResult<HearingWithCase[]>> {
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
      "hearings:read"
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    // Build base conditions
    const conditions = [];
    if (options?.upcoming) {
      conditions.push(gte(hearings.date, new Date()));
    }
    if (options?.caseId) {
      conditions.push(eq(hearings.caseId, options.caseId));
    }

    // Build query
    const query = db
      .select({
        id: hearings.id,
        caseId: hearings.caseId,
        caseTitle: cases.title,
        date: hearings.date,
        location: hearings.location,
        judgeId: hearings.judgeId,
        bailDecision: hearings.bailDecision,
        createdAt: hearings.createdAt,
      })
      .from(hearings)
      .innerJoin(cases, eq(hearings.caseId, cases.id))
      .where(withOrgFilter(context.organizationId, hearings, conditions.length > 0 ? conditions : undefined))
      .orderBy(desc(hearings.date))
      .limit(options?.limit || 1000);

    const results = await query;

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching hearings:", error);
    return { success: false, error: "Failed to fetch hearings" };
  }
}

/**
 * Get hearing by ID
 */
export async function getHearingById(hearingId: string): Promise<ActionResult<HearingWithCase>> {
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
      "hearings:read"
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    const [hearing] = await db
      .select({
        id: hearings.id,
        caseId: hearings.caseId,
        caseTitle: cases.title,
        date: hearings.date,
        location: hearings.location,
        judgeId: hearings.judgeId,
        bailDecision: hearings.bailDecision,
        createdAt: hearings.createdAt,
      })
      .from(hearings)
      .innerJoin(cases, eq(hearings.caseId, cases.id))
      .where(
        withOrgFilter(context.organizationId, hearings, [
          eq(hearings.id, hearingId)
        ])
      )
      .limit(1);

    if (!hearing) {
      return { success: false, error: "Hearing not found" };
    }

    return { success: true, data: hearing };
  } catch (error) {
    console.error("Error fetching hearing:", error);
    return { success: false, error: "Failed to fetch hearing" };
  }
}

/**
 * Create a new hearing
 */
export async function createHearing(data: {
  caseId: string;
  date: Date;
  location?: string;
  judgeId?: string;
  bailDecision?: string;
}): Promise<ActionResult<{ id: string }>> {
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
      "hearings:create"
    );

    if (!canCreate) {
      return { success: false, error: "Permission denied" };
    }

    // Verify case belongs to organization
    const [caseItem] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organizationId, cases, [
          eq(cases.id, data.caseId)
        ])
      )
      .limit(1);

    if (!caseItem) {
      return { success: false, error: "Case not found or access denied" };
    }

    // Generate ID
    const hearingId = crypto.randomUUID();

    // Insert hearing
    await db
      .insert(hearings)
      .values(
        withOrgId(context.organizationId, {
          id: hearingId,
          caseId: data.caseId,
          date: data.date,
          location: data.location,
          judgeId: data.judgeId,
          bailDecision: data.bailDecision,
        })
      );

    revalidatePath("/dashboard/hearings");
    revalidatePath(`/dashboard/cases/${data.caseId}`);

    return { success: true, data: { id: hearingId } };
  } catch (error) {
    console.error("Error creating hearing:", error);
    return { success: false, error: "Failed to create hearing" };
  }
}

/**
 * Update a hearing
 */
export async function updateHearing(
  hearingId: string,
  data: {
    date?: Date;
    location?: string;
    judgeId?: string;
    bailDecision?: string;
  }
): Promise<ActionResult> {
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
    const canUpdate = await hasPermission(
      session.user.id,
      context.organizationId,
      "hearings:update"
    );

    if (!canUpdate) {
      return { success: false, error: "Permission denied" };
    }

    // Verify hearing exists and belongs to organization
    const [hearing] = await db
      .select()
      .from(hearings)
      .where(
        withOrgFilter(context.organizationId, hearings, [
          eq(hearings.id, hearingId),
        ])
      )
      .limit(1);

    if (!hearing) {
      return { success: false, error: "Hearing not found or access denied" };
    }

    // Update hearing
    await db
      .update(hearings)
      .set(data)
      .where(eq(hearings.id, hearingId));

    revalidatePath("/dashboard/hearings");
    revalidatePath(`/dashboard/hearings/${hearingId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating hearing:", error);
    return { success: false, error: "Failed to update hearing" };
  }
}

/**
 * Delete a hearing
 */
export async function deleteHearing(hearingId: string): Promise<ActionResult> {
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
    const canDelete = await hasPermission(
      session.user.id,
      context.organizationId,
      "hearings:delete"
    );

    if (!canDelete) {
      return { success: false, error: "Permission denied" };
    }

    // Verify hearing exists and belongs to organization
    const [hearing] = await db
      .select()
      .from(hearings)
      .where(
        withOrgFilter(context.organizationId, hearings, [
          eq(hearings.id, hearingId),
        ])
      )
      .limit(1);

    if (!hearing) {
      return { success: false, error: "Hearing not found or access denied" };
    }

    // Delete hearing
    await db.delete(hearings).where(eq(hearings.id, hearingId));

    revalidatePath("/dashboard/hearings");

    return { success: true };
  } catch (error) {
    console.error("Error deleting hearing:", error);
    return { success: false, error: "Failed to delete hearing" };
  }
}
