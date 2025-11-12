"use server";

/**
 * Legal Representatives Management Actions
 * 
 * Server actions for managing lawyers, law firms, and legal aid
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/connection";
import { legalRepresentatives } from "@/lib/drizzle/schema/db-schema";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { withOrgFilter, withOrgId, validateOrgAccess } from "@/lib/utils/query-helpers";
import { eq, like, or } from "drizzle-orm";
import { auth } from "@/lib/auth";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all legal representatives for the current organisation
 */
export async function getLegalRepresentatives(filters?: {
  type?: string;
  search?: string;
  isActive?: boolean;
}): Promise<ActionResult<typeof legalRepresentatives.$inferSelect[]>> {
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
    
    if (filters?.type) {
      conditions.push(eq(legalRepresentatives.type, filters.type));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(legalRepresentatives.isActive, filters.isActive));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(legalRepresentatives.name, `%${filters.search}%`),
        like(legalRepresentatives.firmName, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const results = await db
      .select()
      .from(legalRepresentatives)
      .where(withOrgFilter(context.organisationId, legalRepresentatives, conditions.length > 0 ? conditions : undefined))
      .orderBy(legalRepresentatives.name);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching legal representatives:", error);
    return { success: false, error: "Failed to fetch legal representatives" };
  }
}

/**
 * Get a single legal representative by ID
 */
export async function getLegalRepresentativeById(
  repId: string
): Promise<ActionResult<typeof legalRepresentatives.$inferSelect>> {
  try {
    const session = await auth.api.getSession({ headers: await import("next/headers").then(m => m.headers()) });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    const [rep] = await db
      .select()
      .from(legalRepresentatives)
      .where(
        withOrgFilter(context.organisationId, legalRepresentatives, [eq(legalRepresentatives.id, repId)])
      )
      .limit(1);

    if (!rep) {
      return { success: false, error: "Legal representative not found" };
    }

    return { success: true, data: rep };
  } catch (error) {
    console.error("Error fetching legal representative:", error);
    return { success: false, error: "Failed to fetch legal representative" };
  }
}

/**
 * Create a new legal representative
 */
export async function createLegalRepresentative(data: {
  name: string;
  type: string;
  firmName?: string;
  email?: string;
  phone?: string;
  address?: string;
  practiceAreas?: string[];
  notes?: string;
  isActive?: boolean;
}): Promise<ActionResult<typeof legalRepresentatives.$inferSelect>> {
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

    const repId = crypto.randomUUID();

    const [newRep] = await db
      .insert(legalRepresentatives)
      .values(
        withOrgId(context.organisationId, {
          id: repId,
          name: data.name,
          type: data.type,
          firmName: data.firmName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          practiceAreas: data.practiceAreas,
          notes: data.notes,
          isActive: data.isActive ?? true,
          createdBy: session.user.id,
        }) as any
      )
      .returning();

    revalidatePath("/dashboard/settings/legal-representatives");

    return { success: true, data: newRep };
  } catch (error) {
    console.error("Error creating legal representative:", error);
    return { success: false, error: "Failed to create legal representative" };
  }
}

/**
 * Update a legal representative
 */
export async function updateLegalRepresentative(
  repId: string,
  data: Partial<{
    name: string;
    type: string;
    firmName: string;
    email: string;
    phone: string;
    address: string;
    practiceAreas: string[];
    isActive: boolean;
    notes: string;
  }>
): Promise<ActionResult<typeof legalRepresentatives.$inferSelect>> {
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
      .from(legalRepresentatives)
      .where(
        withOrgFilter(context.organisationId, legalRepresentatives, [eq(legalRepresentatives.id, repId)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existing, "Legal representative");

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
      .update(legalRepresentatives)
      .set(data)
      .where(
        withOrgFilter(context.organisationId, legalRepresentatives, [eq(legalRepresentatives.id, repId)])
      )
      .returning();

    revalidatePath("/dashboard/settings/legal-representatives");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating legal representative:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update legal representative",
    };
  }
}

/**
 * Delete a legal representative
 */
export async function deleteLegalRepresentative(repId: string): Promise<ActionResult> {
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
      .from(legalRepresentatives)
      .where(
        withOrgFilter(context.organisationId, legalRepresentatives, [eq(legalRepresentatives.id, repId)])
      )
      .limit(1);

    validateOrgAccess(context.organisationId, existing, "Legal representative");

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
      .delete(legalRepresentatives)
      .where(
        withOrgFilter(context.organisationId, legalRepresentatives, [eq(legalRepresentatives.id, repId)])
      );

    revalidatePath("/dashboard/settings/legal-representatives");

    return { success: true };
  } catch (error) {
    console.error("Error deleting legal representative:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete legal representative",
    };
  }
}
