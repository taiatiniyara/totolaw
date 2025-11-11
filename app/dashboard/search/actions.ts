"use server";

import { db } from "@/lib/drizzle/connection";
import { cases, hearings, evidence } from "@/lib/drizzle/schema/db-schema";
import { sql, eq } from "drizzle-orm";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export interface SearchResults {
  cases: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: Date;
  }>;
  hearings: Array<{
    id: string;
    caseId: string;
    caseTitle: string;
    date: Date;
    location: string | null;
  }>;
  evidence: Array<{
    id: string;
    caseId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  }>;
}

/**
 * Global search across cases, hearings, and evidence
 */
export async function globalSearch(
  query: string
): Promise<ActionResult<SearchResults>> {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: { cases: [], hearings: [], evidence: [] },
      };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return { success: false, error: "Organization context not found" };
    }

    const searchPattern = `%${query.toLowerCase()}%`;
    const isSuperAdmin = context.organizationId === "*";

    // Search cases
    const casesResults = await db
      .select({
        id: cases.id,
        title: cases.title,
        type: cases.type,
        status: cases.status,
        createdAt: cases.createdAt,
        organizationId: cases.organizationId,
      })
      .from(cases)
      .where(
        isSuperAdmin
          ? sql`(
              LOWER(${cases.title}) LIKE ${searchPattern} OR
              LOWER(${cases.type}) LIKE ${searchPattern} OR
              LOWER(${cases.status}) LIKE ${searchPattern}
            )`
          : sql`${cases.organizationId} = ${context.organizationId} AND (
              LOWER(${cases.title}) LIKE ${searchPattern} OR
              LOWER(${cases.type}) LIKE ${searchPattern} OR
              LOWER(${cases.status}) LIKE ${searchPattern}
            )`
      )
      .limit(10);

    // Search hearings
    const hearingsResults = await db
      .select({
        id: hearings.id,
        caseId: hearings.caseId,
        caseTitle: cases.title,
        date: hearings.date,
        location: hearings.location,
        organizationId: hearings.organizationId,
      })
      .from(hearings)
      .innerJoin(cases, eq(hearings.caseId, cases.id))
      .where(
        isSuperAdmin
          ? sql`(
              LOWER(${hearings.location}) LIKE ${searchPattern} OR
              LOWER(${cases.title}) LIKE ${searchPattern}
            )`
          : sql`${hearings.organizationId} = ${context.organizationId} AND (
              LOWER(${hearings.location}) LIKE ${searchPattern} OR
              LOWER(${cases.title}) LIKE ${searchPattern}
            )`
      )
      .limit(10);

    // Search evidence
    const evidenceResults = await db
      .select({
        id: evidence.id,
        caseId: evidence.caseId,
        fileName: evidence.fileName,
        fileType: evidence.fileType,
        fileSize: evidence.fileSize,
        createdAt: evidence.createdAt,
        organizationId: evidence.organizationId,
      })
      .from(evidence)
      .where(
        isSuperAdmin
          ? sql`(
              LOWER(${evidence.fileName}) LIKE ${searchPattern} OR
              LOWER(${evidence.description}) LIKE ${searchPattern}
            )`
          : sql`${evidence.organizationId} = ${context.organizationId} AND (
              LOWER(${evidence.fileName}) LIKE ${searchPattern} OR
              LOWER(${evidence.description}) LIKE ${searchPattern}
            )`
      )
      .limit(10);

    return {
      success: true,
      data: {
        cases: casesResults,
        hearings: hearingsResults,
        evidence: evidenceResults,
      },
    };
  } catch (error) {
    console.error("Error performing global search:", error);
    return { success: false, error: "Failed to perform search" };
  }
}
