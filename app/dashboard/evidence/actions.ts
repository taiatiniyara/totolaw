"use server";

import { db } from "@/lib/drizzle/connection";
import { evidence, cases } from "@/lib/drizzle/schema/db-schema";
import { eq, desc } from "drizzle-orm";
import { hasPermission } from "@/lib/services/authorization.service";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { generateUUID } from "@/lib/services/uuid.service";
import { withOrgFilter } from "@/lib/utils/query-helpers";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// File upload configuration
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "evidence");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
];

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Upload evidence file for a case
 */
export async function uploadEvidence(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "Organisation context not found" };
    }

    // Check permission
    const canCreate = await hasPermission(
      session.user.id,
      context.organisationId,
      "evidence:create",
      context.isSuperAdmin
    );

    if (!canCreate) {
      return { success: false, error: "Permission denied" };
    }

    // Extract form data
    const caseId = formData.get("caseId") as string;
    const hearingId = (formData.get("hearingId") as string) || null;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!caseId || !file) {
      return { success: false, error: "Case ID and file are required" };
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { success: false, error: "File type not allowed" };
    }

    // Verify case exists and belongs to organisation
    const [caseRecord] = await db
      .select()
      .from(cases)
      .where(withOrgFilter(context.organisationId, cases, [eq(cases.id, caseId)]))
      .limit(1);

    if (!caseRecord) {
      return { success: false, error: "Case not found or access denied" };
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${sanitizedFilename}`;
    const filePath = join(UPLOAD_DIR, filename);
    const publicPath = `/uploads/evidence/${filename}`;

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create evidence record
    const evidenceId = generateUUID();
    await db.insert(evidence).values({
      id: evidenceId,
      organisationId: context.organisationId,
      caseId,
      hearingId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      filePath: publicPath,
      description,
      submittedBy: session.user.id,
    });

    revalidatePath(`/dashboard/cases/${caseId}`);
    revalidatePath("/dashboard/evidence");

    return { success: true, data: { id: evidenceId } };
  } catch (error) {
    console.error("Error uploading evidence:", error);
    return { success: false, error: "Failed to upload evidence" };
  }
}

/**
 * Get all evidence for a case
 */
export async function getEvidenceForCase(
  caseId: string
): Promise<ActionResult<typeof evidence.$inferSelect[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "Organisation context not found" };
    }

    // Check permission
    const canRead = await hasPermission(
      session.user.id,
      context.organisationId,
      "evidence:read",
      context.isSuperAdmin
    );

    if (!canRead) {
      return { success: false, error: "Permission denied" };
    }

    // Get evidence
    const results = await db
      .select()
      .from(evidence)
      .where(
        withOrgFilter(context.organisationId, evidence, [
          eq(evidence.caseId, caseId),
        ])
      )
      .orderBy(desc(evidence.createdAt));

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return { success: false, error: "Failed to fetch evidence" };
  }
}

/**
 * Get evidence by ID
 */
export async function getEvidenceById(
  evidenceId: string
): Promise<ActionResult<typeof evidence.$inferSelect>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "Organisation context not found" };
    }

    // Check permission
    const canRead = await hasPermission(
      session.user.id,
      context.organisationId,
      "evidence:read",
      context.isSuperAdmin
    );

    if (!canRead) {
      return { success: false, error: "Permission denied" };
    }

    // Get evidence
    const [result] = await db
      .select()
      .from(evidence)
      .where(
        withOrgFilter(context.organisationId, evidence, [
          eq(evidence.id, evidenceId),
        ])
      )
      .limit(1);

    if (!result) {
      return { success: false, error: "Evidence not found or access denied" };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return { success: false, error: "Failed to fetch evidence" };
  }
}

/**
 * Delete evidence
 */
export async function deleteEvidence(
  evidenceId: string
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "Organisation context not found" };
    }

    // Check permission
    const canDelete = await hasPermission(
      session.user.id,
      context.organisationId,
      "evidence:delete",
      context.isSuperAdmin
    );

    if (!canDelete) {
      return { success: false, error: "Permission denied" };
    }

    // Get evidence to verify access and get file path
    const [evidenceRecord] = await db
      .select()
      .from(evidence)
      .where(
        withOrgFilter(context.organisationId, evidence, [
          eq(evidence.id, evidenceId),
        ])
      )
      .limit(1);

    if (!evidenceRecord) {
      return { success: false, error: "Evidence not found or access denied" };
    }

    // Delete file from disk
    const fullPath = join(process.cwd(), "public", evidenceRecord.filePath);
    try {
      await unlink(fullPath);
    } catch (fileError) {
      console.error("Error deleting file:", fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete evidence record
    await db.delete(evidence).where(eq(evidence.id, evidenceId));

    revalidatePath(`/dashboard/cases/${evidenceRecord.caseId}`);
    revalidatePath("/dashboard/evidence");

    return { success: true };
  } catch (error) {
    console.error("Error deleting evidence:", error);
    return { success: false, error: "Failed to delete evidence" };
  }
}

/**
 * Get all evidence (with optional filters)
 */
export async function getAllEvidence(options?: {
  limit?: number;
}): Promise<ActionResult<Array<typeof evidence.$inferSelect & { caseTitle: string }>>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "Organisation context not found" };
    }

    // Check permission
    const canRead = await hasPermission(
      session.user.id,
      context.organisationId,
      "evidence:read",
      context.isSuperAdmin
    );

    if (!canRead) {
      return { success: false, error: "Permission denied" };
    }

    // Build query
    const query = db
      .select({
        id: evidence.id,
        organisationId: evidence.organisationId,
        caseId: evidence.caseId,
        hearingId: evidence.hearingId,
        fileName: evidence.fileName,
        fileSize: evidence.fileSize,
        fileType: evidence.fileType,
        filePath: evidence.filePath,
        description: evidence.description,
        submittedBy: evidence.submittedBy,
        createdAt: evidence.createdAt,
        caseTitle: cases.title,
      })
      .from(evidence)
      .innerJoin(cases, eq(evidence.caseId, cases.id))
      .where(withOrgFilter(context.organisationId, evidence))
      .orderBy(desc(evidence.createdAt))
      .limit(options?.limit || 100);

    const results = await query;

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching all evidence:", error);
    return { success: false, error: "Failed to fetch evidence" };
  }
}
