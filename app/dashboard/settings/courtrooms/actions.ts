"use server";

/**
 * Court Room Management Actions
 * 
 * Server actions for managing physical courtrooms
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/connection";
import { courtRooms } from "@/lib/drizzle/schema/db-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { withOrgFilter, withOrgId, validateOrgAccess } from "@/lib/utils/query-helpers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all courtrooms for the current organisation
 */
export async function getCourtRooms(filters?: {
  courtLevel?: string;
  isActive?: boolean;
}): Promise<ActionResult<typeof courtRooms.$inferSelect[]>> {
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
    
    if (filters?.courtLevel) {
      conditions.push(eq(courtRooms.courtLevel, filters.courtLevel));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(courtRooms.isActive, filters.isActive));
    }

    const results = await db
      .select()
      .from(courtRooms)
      .where(withOrgFilter(context.organisationId, courtRooms, conditions.length > 0 ? conditions : undefined))
      .orderBy(courtRooms.name);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching courtrooms:", error);
    return { success: false, error: "Failed to fetch courtrooms" };
  }
}

/**
 * Get a single courtroom by ID
 */
export async function getCourtRoomById(
  roomId: string
): Promise<ActionResult<typeof courtRooms.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    const [room] = await db
      .select()
      .from(courtRooms)
      .where(
        withOrgFilter(context.organisationId, courtRooms, [eq(courtRooms.id, roomId)])
      )
      .limit(1);

    if (!room) {
      return { success: false, error: "Courtroom not found" };
    }

    return { success: true, data: room };
  } catch (error) {
    console.error("Error fetching courtroom:", error);
    return { success: false, error: "Failed to fetch courtroom" };
  }
}

/**
 * Create a new courtroom
 */
export async function createCourtRoom(data: {
  name: string;
  code: string;
  courtLevel: string;
  location?: string;
  capacity?: number;
  isActive?: boolean;
}): Promise<ActionResult<typeof courtRooms.$inferSelect>> {
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
      "settings:manage",
      context.isSuperAdmin
    );

    if (!canCreate) {
      return { success: false, error: "Permission denied" };
    }

    const roomId = crypto.randomUUID();

    const [newRoom] = await db
      .insert(courtRooms)
      .values(
        withOrgId(context.organisationId, {
          id: roomId,
          name: data.name,
          code: data.code,
          courtLevel: data.courtLevel,
          location: data.location,
          capacity: data.capacity,
          isActive: data.isActive ?? true,
        }) as any
      )
      .returning();

    revalidatePath("/dashboard/settings/courtrooms");

    return { success: true, data: newRoom };
  } catch (error) {
    console.error("Error creating courtroom:", error);
    return { success: false, error: "Failed to create courtroom" };
  }
}

/**
 * Update a courtroom
 */
export async function updateCourtRoom(
  roomId: string,
  data: Partial<{
    name: string;
    code: string;
    courtLevel: string;
    location: string;
    capacity: number;
    isActive: boolean;
  }>
): Promise<ActionResult<typeof courtRooms.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Verify courtroom exists
    const [existing] = await db
      .select()
      .from(courtRooms)
      .where(
        withOrgFilter(context.organisationId, courtRooms, [eq(courtRooms.id, roomId)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existing, "Courtroom");

    // Check permission
    const canUpdate = await hasPermission(
      session.user.id,
      context.organisationId,
      "settings:manage",
      context.isSuperAdmin
    );

    if (!canUpdate) {
      return { success: false, error: "Permission denied" };
    }

    const [updated] = await db
      .update(courtRooms)
      .set(data)
      .where(
        withOrgFilter(context.organisationId, courtRooms, [eq(courtRooms.id, roomId)])
      )
      .returning();

    revalidatePath("/dashboard/settings/courtrooms");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating courtroom:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update courtroom",
    };
  }
}

/**
 * Delete a courtroom
 */
export async function deleteCourtRoom(roomId: string): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Verify courtroom exists
    const [existing] = await db
      .select()
      .from(courtRooms)
      .where(
        withOrgFilter(context.organisationId, courtRooms, [eq(courtRooms.id, roomId)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existing, "Courtroom");

    // Check permission
    const canDelete = await hasPermission(
      session.user.id,
      context.organisationId,
      "settings:manage",
      context.isSuperAdmin
    );

    if (!canDelete) {
      return { success: false, error: "Permission denied" };
    }

    await db
      .delete(courtRooms)
      .where(
        withOrgFilter(context.organisationId, courtRooms, [eq(courtRooms.id, roomId)])
      );

    revalidatePath("/dashboard/settings/courtrooms");

    return { success: true };
  } catch (error) {
    console.error("Error deleting courtroom:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete courtroom",
    };
  }
}
