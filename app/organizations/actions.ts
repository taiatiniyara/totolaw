"use server";

import { db } from "@/lib/drizzle/connection";
import { organizations } from "@/lib/drizzle/schema/organization-schema";
import { eq } from "drizzle-orm";

/**
 * Public action to fetch all active organizations for the hierarchy display
 */
export async function getPublicOrganizations() {
  try {
    const orgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        code: organizations.code,
        type: organizations.type,
        description: organizations.description,
        parentId: organizations.parentId,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .where(eq(organizations.isActive, true))
      .orderBy(organizations.createdAt);

    return { success: true, organizations: orgs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
