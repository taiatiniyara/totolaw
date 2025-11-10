/**
 * Transcript Actions
 * Server actions for transcript operations
 */

"use server";

import { auth } from "@/lib/auth";
import { transcriptService } from "@/lib/services/transcript.service";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { revalidatePath } from "next/cache";

/**
 * Create a new transcript
 */
export async function createTranscript(data: {
  caseId: string;
  hearingId: string;
  title: string;
  recordingUrl?: string;
}) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const transcript = await transcriptService.createTranscript(
      context.organizationId,
      session.user.id,
      data
    );

    revalidatePath(`/dashboard/hearings/${data.hearingId}`);
    return { success: true, transcript };
  } catch (error) {
    console.error("Error creating transcript:", error);
    return { error: "Failed to create transcript" };
  }
}

/**
 * Get transcript with details
 */
export async function getTranscriptDetails(transcriptId: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const details = await transcriptService.getTranscriptWithDetails(
      transcriptId,
      context.organizationId
    );

    if (!details) {
      return { error: "Transcript not found" };
    }

    return { success: true, ...details };
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return { error: "Failed to fetch transcript" };
  }
}

/**
 * Update transcript status
 */
export async function updateTranscriptStatus(
  transcriptId: string,
  status: string
) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const transcript = await transcriptService.updateTranscriptStatus(
      transcriptId,
      context.organizationId,
      status,
      session.user.id
    );

    revalidatePath(`/dashboard/transcripts/${transcriptId}`);
    return { success: true, transcript };
  } catch (error) {
    console.error("Error updating transcript status:", error);
    return { error: "Failed to update transcript status" };
  }
}

/**
 * Add speaker to transcript
 */
export async function addSpeaker(data: {
  transcriptId: string;
  name: string;
  role: string;
  userId?: string;
}) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const speaker = await transcriptService.addSpeaker(
      context.organizationId,
      data
    );

    revalidatePath(`/dashboard/transcripts/${data.transcriptId}`);
    return { success: true, speaker };
  } catch (error) {
    console.error("Error adding speaker:", error);
    return { error: "Failed to add speaker" };
  }
}

/**
 * Update segment
 */
export async function updateSegment(
  segmentId: string,
  text: string
) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const segment = await transcriptService.updateSegment(
      segmentId,
      context.organizationId,
      {
        text,
        editedBy: session.user.id,
      }
    );

    return { success: true, segment };
  } catch (error) {
    console.error("Error updating segment:", error);
    return { error: "Failed to update segment" };
  }
}

/**
 * Add annotation
 */
export async function addAnnotation(data: {
  transcriptId: string;
  segmentId?: string;
  type: string;
  content?: string;
  color?: string;
}) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const annotation = await transcriptService.addAnnotation(
      context.organizationId,
      {
        ...data,
        createdBy: session.user.id,
      }
    );

    return { success: true, annotation };
  } catch (error) {
    console.error("Error adding annotation:", error);
    return { error: "Failed to add annotation" };
  }
}

/**
 * Delete annotation
 */
export async function deleteAnnotation(annotationId: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    await transcriptService.deleteAnnotation(
      annotationId,
      context.organizationId,
      session.user.id
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting annotation:", error);
    return { error: "Failed to delete annotation" };
  }
}

/**
 * Search transcript segments
 */
export async function searchTranscript(
  transcriptId: string,
  query: string
) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const segments = await transcriptService.searchSegments(
      transcriptId,
      context.organizationId,
      query
    );

    return { success: true, segments };
  } catch (error) {
    console.error("Error searching transcript:", error);
    return { error: "Failed to search transcript" };
  }
}

/**
 * Get transcript statistics
 */
export async function getTranscriptStats(transcriptId: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    return { error: "Organization context not found" };
  }

  try {
    const stats = await transcriptService.getTranscriptStats(
      transcriptId,
      context.organizationId
    );

    return { success: true, stats };
  } catch (error) {
    console.error("Error getting transcript stats:", error);
    return { error: "Failed to get transcript statistics" };
  }
}
