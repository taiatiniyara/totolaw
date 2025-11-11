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
  scheduledTime: string;
  actionType: string;
  status: string;
  location: string | null;
  judgeId: string | null;
  bailDecision: string | null;
  createdAt: Date;
}

/**
 * Get all hearings for the organisation
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
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "hearings:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    // Build base conditions
    const conditions = [];
    if (options?.upcoming) {
      conditions.push(gte(hearings.scheduledDate, new Date()));
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
        date: hearings.scheduledDate,
        scheduledTime: hearings.scheduledTime,
        actionType: hearings.actionType,
        status: hearings.status,
        location: hearings.location,
        judgeId: hearings.judgeId,
        bailDecision: hearings.bailDecision,
        createdAt: hearings.createdAt,
      })
      .from(hearings)
      .innerJoin(cases, eq(hearings.caseId, cases.id))
      .where(withOrgFilter(context.organisationId, hearings, conditions.length > 0 ? conditions : undefined))
      .orderBy(desc(hearings.scheduledDate))
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
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "hearings:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Permission denied" };
    }

    const [hearing] = await db
      .select({
        id: hearings.id,
        caseId: hearings.caseId,
        caseTitle: cases.title,
        date: hearings.scheduledDate,
        scheduledTime: hearings.scheduledTime,
        actionType: hearings.actionType,
        status: hearings.status,
        location: hearings.location,
        judgeId: hearings.judgeId,
        bailDecision: hearings.bailDecision,
        createdAt: hearings.createdAt,
      })
      .from(hearings)
      .innerJoin(cases, eq(hearings.caseId, cases.id))
      .where(
        withOrgFilter(context.organisationId, hearings, [
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
 * Create a new hearing (Enhanced for Fiji court system)
 */
export async function createHearing(data: {
  caseId: string;
  scheduledDate: Date;
  scheduledTime?: string;
  estimatedDuration?: number;
  courtRoomId?: string;
  location?: string;
  actionType: string;
  status?: string;
  judgeId?: string;
  magistrateId?: string;
  clerkId?: string;
  bailConsidered?: boolean;
  bailDecision?: string;
  bailAmount?: number;
  bailConditions?: string;
  notes?: string;
}): Promise<ActionResult<{ id: string }>> {
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
      "hearings:create",
      context.isSuperAdmin
    );

    if (!canCreate) {
      return { success: false, error: "Permission denied" };
    }

    // Verify case belongs to organisation
    const [caseItem] = await db
      .select()
      .from(cases)
      .where(
        withOrgFilter(context.organisationId, cases, [
          eq(cases.id, data.caseId)
        ])
      )
      .limit(1);

    if (!caseItem) {
      return { success: false, error: "Case not found or access denied" };
    }

    // Generate ID
    const hearingId = crypto.randomUUID();

    // Insert hearing with new Fiji fields
    await db
      .insert(hearings)
      .values(
        withOrgId(context.organisationId, {
          id: hearingId,
          caseId: data.caseId,
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
          estimatedDuration: data.estimatedDuration,
          courtRoomId: data.courtRoomId,
          location: data.location,
          actionType: data.actionType,
          status: data.status || "scheduled",
          judgeId: data.judgeId,
          magistrateId: data.magistrateId,
          clerkId: data.clerkId,
          bailConsidered: data.bailConsidered || false,
          bailDecision: data.bailDecision,
          bailAmount: data.bailAmount,
          bailConditions: data.bailConditions,
          notes: data.notes,
          createdBy: session.user.id,
          // Legacy field for compatibility
          date: data.scheduledDate,
        }) as any
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
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canUpdate = await hasPermission(
      session.user.id,
      context.organisationId,
      "hearings:update",
      context.isSuperAdmin
    );

    if (!canUpdate) {
      return { success: false, error: "Permission denied" };
    }

    // Verify hearing exists and belongs to organisation
    const [hearing] = await db
      .select()
      .from(hearings)
      .where(
        withOrgFilter(context.organisationId, hearings, [
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
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canDelete = await hasPermission(
      session.user.id,
      context.organisationId,
      "hearings:delete",
      context.isSuperAdmin
    );

    if (!canDelete) {
      return { success: false, error: "Permission denied" };
    }

    // Verify hearing exists and belongs to organisation
    const [hearing] = await db
      .select()
      .from(hearings)
      .where(
        withOrgFilter(context.organisationId, hearings, [
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
