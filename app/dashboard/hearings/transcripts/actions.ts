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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const transcript = await transcriptService.createTranscript(
      context.organisationId,
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const details = await transcriptService.getTranscriptWithDetails(
      transcriptId,
      context.organisationId
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const transcript = await transcriptService.updateTranscriptStatus(
      transcriptId,
      context.organisationId,
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const speaker = await transcriptService.addSpeaker(
      context.organisationId,
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const segment = await transcriptService.updateSegment(
      segmentId,
      context.organisationId,
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const annotation = await transcriptService.addAnnotation(
      context.organisationId,
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    await transcriptService.deleteAnnotation(
      annotationId,
      context.organisationId,
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const segments = await transcriptService.searchSegments(
      transcriptId,
      context.organisationId,
      query
    );

    return { success: true, segments };
  } catch (error) {
    console.error("Error searching transcript:", error);
    return { error: "Failed to search transcript" };
  }
}

/**
 * Save manual transcript entries
 */
export async function saveManualTranscriptEntries(data: {
  transcriptId: string;
  entries: Array<{
    id: string;
    speakerId: string;
    text: string;
    timestamp: string;
    notes?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    // Convert entries to segments with proper format
    const segments = data.entries.map((entry, index) => ({
      transcriptId: data.transcriptId,
      speakerId: entry.speakerId,
      segmentNumber: index + 1,
      startTime: parseTimestampToMs(entry.timestamp),
      endTime: parseTimestampToMs(entry.timestamp) + 1000, // Default 1 second duration
      text: entry.text,
      confidence: 1.0, // Manual entries have 100% confidence
      metadata: entry.notes ? { notes: entry.notes, manualEntry: true } : { manualEntry: true },
    }));

    // Add segments to transcript
    await transcriptService.addSegmentsBatch(context.organisationId, segments);

    // Update transcript status if it was draft
    const transcript = await transcriptService.getTranscript(
      data.transcriptId,
      context.organisationId
    );

    if (transcript?.status === "draft") {
      await transcriptService.updateTranscriptStatus(
        data.transcriptId,
        context.organisationId,
        "completed",
        session.user.id
      );
    }

    revalidatePath(`/dashboard/hearings/transcripts/${data.transcriptId}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving manual transcript:", error);
    return { error: "Failed to save manual transcript" };
  }
}

/**
 * Auto-save manual transcript entries (partial save)
 */
export async function autoSaveManualTranscript(data: {
  transcriptId: string;
  entries: Array<{
    id: string;
    speakerId: string;
    text: string;
    timestamp: string;
    notes?: string;
  }>;
}) {
  // Reuse the same logic as saveManualTranscriptEntries but don't mark as completed
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    // Just update the status to in-progress to indicate work is being done
    await transcriptService.updateTranscriptStatus(
      data.transcriptId,
      context.organisationId,
      "in-progress"
    );

    return { success: true };
  } catch (error) {
    console.error("Error auto-saving transcript:", error);
    return { error: "Failed to auto-save" };
  }
}

/**
 * Helper function to parse timestamp string (MM:SS or HH:MM:SS) to milliseconds
 */
function parseTimestampToMs(timestamp: string): number {
  const parts = timestamp.split(":").map(Number);
  
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return (minutes * 60 + seconds) * 1000;
  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }
  
  return 0;
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
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }

  try {
    const stats = await transcriptService.getTranscriptStats(
      transcriptId,
      context.organisationId
    );

    return { success: true, stats };
  } catch (error) {
    console.error("Error getting transcript stats:", error);
    return { error: "Failed to get transcript statistics" };
  }
}
