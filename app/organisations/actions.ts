"use server";

import { db } from "@/lib/drizzle/connection";
import { organisations } from "@/lib/drizzle/schema/organisation-schema";
import { eq } from "drizzle-orm";

/**
 * Public action to fetch all active organisations for the hierarchy display
 */
export async function getPublicOrganisations() {
  try {
    const orgs = await db
      .select({
        id: organisations.id,
        name: organisations.name,
        code: organisations.code,
        type: organisations.type,
        description: organisations.description,
        parentId: organisations.parentId,
        createdAt: organisations.createdAt,
      })
      .from(organisations)
      .where(eq(organisations.isActive, true))
      .orderBy(organisations.createdAt);

    return { success: true, organisations: orgs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
