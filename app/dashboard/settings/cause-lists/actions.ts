/**
 * Daily Cause List Actions
 * 
 * Server actions for creating and managing daily court schedules
 */

"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/connection";
import { dailyCauseLists, hearings, cases, courtRooms } from "@/lib/drizzle/schema/db-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { withOrgFilter, withOrgId, validateOrgAccess } from "@/lib/utils/query-helpers";
import { eq, gte, lte, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get daily cause lists
 */
export async function getDailyCauseLists(params?: {
  date?: Date;
  courtRoomId?: string;
  courtLevel?: string;
  status?: string;
  limit?: number;
}): Promise<ActionResult<typeof dailyCauseLists.$inferSelect[]>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    const conditions = [];
    
    if (params?.date) {
      const startOfDay = new Date(params.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(params.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      conditions.push(
        gte(dailyCauseLists.listDate, startOfDay),
        lte(dailyCauseLists.listDate, endOfDay)
      );
    }
    
    if (params?.courtRoomId) {
      conditions.push(eq(dailyCauseLists.courtRoomId, params.courtRoomId));
    }
    
    if (params?.courtLevel) {
      conditions.push(eq(dailyCauseLists.courtLevel, params.courtLevel));
    }
    
    if (params?.status) {
      conditions.push(eq(dailyCauseLists.status, params.status));
    }

    let query = db
      .select()
      .from(dailyCauseLists)
      .where(withOrgFilter(context.organisationId, dailyCauseLists, conditions.length > 0 ? conditions : undefined))
      .orderBy(desc(dailyCauseLists.listDate));

    if (params?.limit) {
      query = query.limit(params.limit) as any;
    }

    const results = await query;
    return { success: true, data: results };
  } catch (error) {
    console.error("Failed to get daily cause lists:", error);
    return { success: false, error: "Failed to fetch daily cause lists" };
  }
}

/**
 * Get a single cause list by ID
 */
export async function getDailyCauseListById(
  id: string
): Promise<ActionResult<typeof dailyCauseLists.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    const [causeList] = await db
      .select()
      .from(dailyCauseLists)
      .where(
        withOrgFilter(context.organisationId, dailyCauseLists, [eq(dailyCauseLists.id, id)])
      )
      .limit(1);

    if (!causeList) {
      return { success: false, error: "Cause list not found" };
    }

    return { success: true, data: causeList };
  } catch (error) {
    console.error("Failed to get cause list:", error);
    return { success: false, error: "Failed to fetch cause list" };
  }
}

/**
 * Get hearings for a cause list date
 */
export async function getHearingsForCauseList(params: {
  date: Date;
  courtRoomId?: string;
  courtLevel?: string;
  judgeId?: string;
}): Promise<ActionResult<any[]>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    const startOfDay = new Date(params.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setHours(23, 59, 59, 999);

    const conditions = [
      gte(hearings.scheduledDate, startOfDay),
      lte(hearings.scheduledDate, endOfDay),
      eq(hearings.status, "scheduled"),
    ];
    
    if (params.courtRoomId) {
      conditions.push(eq(hearings.courtRoomId, params.courtRoomId));
    }
    
    if (params.judgeId) {
      conditions.push(eq(hearings.judgeId, params.judgeId));
    }

    const results = await db
      .select({
        hearing: hearings,
        case: cases,
        courtRoom: courtRooms,
      })
      .from(hearings)
      .leftJoin(cases, eq(hearings.caseId, cases.id))
      .leftJoin(courtRooms, eq(hearings.courtRoomId, courtRooms.id))
      .where(
        withOrgFilter(context.organisationId, hearings, conditions)
      )
      .orderBy(hearings.scheduledTime);

    return { success: true, data: results };
  } catch (error) {
    console.error("Failed to get hearings:", error);
    return { success: false, error: "Failed to fetch hearings" };
  }
}

/**
 * Create a new daily cause list
 */
export async function createDailyCauseList(data: {
  listDate: Date;
  courtLevel: string;
  courtRoomId?: string;
  presidingOfficerId: string;
  presidingOfficerTitle?: string;
  sessionTime?: string;
  notes?: string;
}): Promise<ActionResult<typeof dailyCauseLists.$inferSelect>> {
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
      "hearings:manage",
      context.isSuperAdmin
    );

    if (!canCreate) {
      return { success: false, error: "Permission denied" };
    }

    const listId = crypto.randomUUID();

    const [newList] = await db
      .insert(dailyCauseLists)
      .values(
        withOrgId(context.organisationId, {
          id: listId,
          listDate: data.listDate,
          courtLevel: data.courtLevel,
          courtRoomId: data.courtRoomId,
          presidingOfficerId: data.presidingOfficerId,
          presidingOfficerTitle: data.presidingOfficerTitle,
          sessionTime: data.sessionTime,
          notes: data.notes,
          status: "draft",
          createdBy: session.user.id,
        }) as any
      )
      .returning();

    revalidatePath("/dashboard/settings/cause-lists");

    return { success: true, data: newList };
  } catch (error) {
    console.error("Error creating cause list:", error);
    return { success: false, error: "Failed to create cause list" };
  }
}

/**
 * Update a daily cause list
 */
export async function updateDailyCauseList(
  id: string,
  data: Partial<{
    presidingOfficerId: string;
    presidingOfficerTitle: string;
    courtRoomId: string;
    sessionTime: string;
    notes: string;
    status: string;
  }>
): Promise<ActionResult<typeof dailyCauseLists.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Verify exists
    const [existing] = await db
      .select()
      .from(dailyCauseLists)
      .where(
        withOrgFilter(context.organisationId, dailyCauseLists, [eq(dailyCauseLists.id, id)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existing, "Cause list");

    // Check permission
    const canUpdate = await hasPermission(
      session.user.id,
      context.organisationId,
      "hearings:manage",
      context.isSuperAdmin
    );

    if (!canUpdate) {
      return { success: false, error: "Permission denied" };
    }

    const [updated] = await db
      .update(dailyCauseLists)
      .set(data)
      .where(
        withOrgFilter(context.organisationId, dailyCauseLists, [eq(dailyCauseLists.id, id)])
      )
      .returning();

    revalidatePath("/dashboard/settings/cause-lists");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating cause list:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update cause list",
    };
  }
}

/**
 * Publish a daily cause list
 */
export async function publishDailyCauseList(id: string): Promise<ActionResult> {
  try {
    const result = await updateDailyCauseList(id, {
      status: "published",
    });

    if (result.success) {
      // Set publishedAt timestamp
      await db
        .update(dailyCauseLists)
        .set({ publishedAt: new Date() })
        .where(eq(dailyCauseLists.id, id));
    }

    revalidatePath("/dashboard/settings/cause-lists");
    return result;
  } catch (error) {
    console.error("Failed to publish daily cause list:", error);
    return { success: false, error: "Failed to publish cause list" };
  }
}

/**
 * Delete a daily cause list
 */
export async function deleteDailyCauseList(id: string): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Verify exists
    const [existing] = await db
      .select()
      .from(dailyCauseLists)
      .where(
        withOrgFilter(context.organisationId, dailyCauseLists, [eq(dailyCauseLists.id, id)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existing, "Cause list");

    // Check permission
    const canDelete = await hasPermission(
      session.user.id,
      context.organisationId,
      "hearings:manage",
      context.isSuperAdmin
    );

    if (!canDelete) {
      return { success: false, error: "Permission denied" };
    }

    await db
      .delete(dailyCauseLists)
      .where(
        withOrgFilter(context.organisationId, dailyCauseLists, [eq(dailyCauseLists.id, id)])
      );

    revalidatePath("/dashboard/settings/cause-lists");

    return { success: true };
  } catch (error) {
    console.error("Error deleting cause list:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete cause list",
    };
  }
}
