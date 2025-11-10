/**
 * Transcript Service
 * Handles all transcript-related business logic
 */

import { db } from "@/lib/drizzle/connection";
import {
  transcripts,
  transcriptSpeakers,
  transcriptSegments,
  transcriptAnnotations,
  type Transcript,
  type NewTranscript,
  type TranscriptSpeaker,
  type NewTranscriptSpeaker,
  type TranscriptSegment,
  type NewTranscriptSegment,
  type TranscriptAnnotation,
  type NewTranscriptAnnotation,
} from "@/lib/drizzle/schema/transcript-schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { generateUUID } from "@/lib/services/uuid.service";

export interface CreateTranscriptData {
  caseId: string;
  hearingId: string;
  title: string;
  language?: string;
  recordingUrl?: string;
}

export interface CreateSpeakerData {
  transcriptId: string;
  name: string;
  role: string;
  userId?: string;
  speakerLabel?: string;
  notes?: string;
}

export interface CreateSegmentData {
  transcriptId: string;
  speakerId?: string;
  segmentNumber: number;
  startTime: number;
  endTime: number;
  text: string;
  confidence?: number;
  metadata?: any;
}

export interface UpdateSegmentData {
  text?: string;
  speakerId?: string;
  editedBy: string;
}

export interface CreateAnnotationData {
  transcriptId: string;
  segmentId?: string;
  type: string;
  content?: string;
  startTime?: number;
  endTime?: number;
  color?: string;
  createdBy: string;
}

export class TranscriptService {
  /**
   * Create a new transcript
   */
  async createTranscript(
    organizationId: string,
    createdBy: string,
    data: CreateTranscriptData
  ): Promise<Transcript> {
    const newTranscript: NewTranscript = {
      id: generateUUID(),
      organizationId,
      caseId: data.caseId,
      hearingId: data.hearingId,
      title: data.title,
      status: "draft",
      language: data.language || "en",
      recordingUrl: data.recordingUrl,
      createdBy,
    };

    const [transcript] = await db
      .insert(transcripts)
      .values(newTranscript)
      .returning();

    return transcript;
  }

  /**
   * Get transcript by ID
   */
  async getTranscript(
    transcriptId: string,
    organizationId: string
  ): Promise<Transcript | null> {
    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(
        and(
          eq(transcripts.id, transcriptId),
          eq(transcripts.organizationId, organizationId)
        )
      );

    return transcript || null;
  }

  /**
   * Get all transcripts for a hearing
   */
  async getTranscriptsByHearing(
    hearingId: string,
    organizationId: string
  ): Promise<Transcript[]> {
    return db
      .select()
      .from(transcripts)
      .where(
        and(
          eq(transcripts.hearingId, hearingId),
          eq(transcripts.organizationId, organizationId)
        )
      )
      .orderBy(desc(transcripts.createdAt));
  }

  /**
   * Get all transcripts for a case
   */
  async getTranscriptsByCase(
    caseId: string,
    organizationId: string
  ): Promise<Transcript[]> {
    return db
      .select()
      .from(transcripts)
      .where(
        and(
          eq(transcripts.caseId, caseId),
          eq(transcripts.organizationId, organizationId)
        )
      )
      .orderBy(desc(transcripts.createdAt));
  }

  /**
   * Update transcript status
   */
  async updateTranscriptStatus(
    transcriptId: string,
    organizationId: string,
    status: string,
    userId?: string
  ): Promise<Transcript> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    if (status === "reviewed" && userId) {
      updateData.reviewedBy = userId;
      updateData.reviewedAt = new Date();
    }

    const [updated] = await db
      .update(transcripts)
      .set(updateData)
      .where(
        and(
          eq(transcripts.id, transcriptId),
          eq(transcripts.organizationId, organizationId)
        )
      )
      .returning();

    return updated;
  }

  /**
   * Start a live transcription session
   */
  async startTranscription(
    transcriptId: string,
    organizationId: string,
    transcriptionService: string
  ): Promise<Transcript> {
    const [updated] = await db
      .update(transcripts)
      .set({
        status: "in-progress",
        startedAt: new Date(),
        transcriptionService,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transcripts.id, transcriptId),
          eq(transcripts.organizationId, organizationId)
        )
      )
      .returning();

    return updated;
  }

  /**
   * Add a speaker to a transcript
   */
  async addSpeaker(
    organizationId: string,
    data: CreateSpeakerData
  ): Promise<TranscriptSpeaker> {
    const newSpeaker: NewTranscriptSpeaker = {
      id: generateUUID(),
      organizationId,
      transcriptId: data.transcriptId,
      name: data.name,
      role: data.role,
      userId: data.userId,
      speakerLabel: data.speakerLabel,
      notes: data.notes,
    };

    const [speaker] = await db
      .insert(transcriptSpeakers)
      .values(newSpeaker)
      .returning();

    return speaker;
  }

  /**
   * Get all speakers for a transcript
   */
  async getSpeakersByTranscript(
    transcriptId: string,
    organizationId: string
  ): Promise<TranscriptSpeaker[]> {
    return db
      .select()
      .from(transcriptSpeakers)
      .where(
        and(
          eq(transcriptSpeakers.transcriptId, transcriptId),
          eq(transcriptSpeakers.organizationId, organizationId)
        )
      );
  }

  /**
   * Add a segment to a transcript
   */
  async addSegment(
    organizationId: string,
    data: CreateSegmentData
  ): Promise<TranscriptSegment> {
    const newSegment: NewTranscriptSegment = {
      id: generateUUID(),
      organizationId,
      transcriptId: data.transcriptId,
      speakerId: data.speakerId,
      segmentNumber: data.segmentNumber,
      startTime: data.startTime,
      endTime: data.endTime,
      text: data.text,
      originalText: data.text, // Store original for comparison
      confidence: data.confidence,
      metadata: data.metadata,
    };

    const [segment] = await db
      .insert(transcriptSegments)
      .values(newSegment)
      .returning();

    return segment;
  }

  /**
   * Batch add segments (for live transcription performance)
   */
  async addSegmentsBatch(
    organizationId: string,
    segments: CreateSegmentData[]
  ): Promise<TranscriptSegment[]> {
    const newSegments: NewTranscriptSegment[] = segments.map((data) => ({
      id: generateUUID(),
      organizationId,
      transcriptId: data.transcriptId,
      speakerId: data.speakerId,
      segmentNumber: data.segmentNumber,
      startTime: data.startTime,
      endTime: data.endTime,
      text: data.text,
      originalText: data.text,
      confidence: data.confidence,
      metadata: data.metadata,
    }));

    return db.insert(transcriptSegments).values(newSegments).returning();
  }

  /**
   * Get all segments for a transcript
   */
  async getSegmentsByTranscript(
    transcriptId: string,
    organizationId: string
  ): Promise<TranscriptSegment[]> {
    return db
      .select()
      .from(transcriptSegments)
      .where(
        and(
          eq(transcriptSegments.transcriptId, transcriptId),
          eq(transcriptSegments.organizationId, organizationId)
        )
      )
      .orderBy(asc(transcriptSegments.segmentNumber));
  }

  /**
   * Update a segment (for editing)
   */
  async updateSegment(
    segmentId: string,
    organizationId: string,
    data: UpdateSegmentData
  ): Promise<TranscriptSegment> {
    const [updated] = await db
      .update(transcriptSegments)
      .set({
        text: data.text,
        speakerId: data.speakerId,
        isEdited: true,
        editedBy: data.editedBy,
        editedAt: new Date(),
      })
      .where(
        and(
          eq(transcriptSegments.id, segmentId),
          eq(transcriptSegments.organizationId, organizationId)
        )
      )
      .returning();

    return updated;
  }

  /**
   * Search transcript segments
   */
  async searchSegments(
    transcriptId: string,
    organizationId: string,
    searchQuery: string
  ): Promise<TranscriptSegment[]> {
    return db
      .select()
      .from(transcriptSegments)
      .where(
        and(
          eq(transcriptSegments.transcriptId, transcriptId),
          eq(transcriptSegments.organizationId, organizationId),
          sql`to_tsvector('english', ${transcriptSegments.text}) @@ plainto_tsquery('english', ${searchQuery})`
        )
      )
      .orderBy(asc(transcriptSegments.segmentNumber));
  }

  /**
   * Add an annotation
   */
  async addAnnotation(
    organizationId: string,
    data: CreateAnnotationData
  ): Promise<TranscriptAnnotation> {
    const newAnnotation: NewTranscriptAnnotation = {
      id: generateUUID(),
      organizationId,
      transcriptId: data.transcriptId,
      segmentId: data.segmentId,
      type: data.type,
      content: data.content,
      startTime: data.startTime,
      endTime: data.endTime,
      color: data.color,
      createdBy: data.createdBy,
    };

    const [annotation] = await db
      .insert(transcriptAnnotations)
      .values(newAnnotation)
      .returning();

    return annotation;
  }

  /**
   * Get all annotations for a transcript
   */
  async getAnnotationsByTranscript(
    transcriptId: string,
    organizationId: string
  ): Promise<TranscriptAnnotation[]> {
    return db
      .select()
      .from(transcriptAnnotations)
      .where(
        and(
          eq(transcriptAnnotations.transcriptId, transcriptId),
          eq(transcriptAnnotations.organizationId, organizationId)
        )
      )
      .orderBy(desc(transcriptAnnotations.createdAt));
  }

  /**
   * Delete an annotation
   */
  async deleteAnnotation(
    annotationId: string,
    organizationId: string,
    userId: string
  ): Promise<void> {
    await db
      .delete(transcriptAnnotations)
      .where(
        and(
          eq(transcriptAnnotations.id, annotationId),
          eq(transcriptAnnotations.organizationId, organizationId),
          eq(transcriptAnnotations.createdBy, userId)
        )
      );
  }

  /**
   * Get transcript with full details (speakers and segments)
   */
  async getTranscriptWithDetails(
    transcriptId: string,
    organizationId: string
  ) {
    const transcript = await this.getTranscript(transcriptId, organizationId);
    if (!transcript) return null;

    const [speakers, segments, annotations] = await Promise.all([
      this.getSpeakersByTranscript(transcriptId, organizationId),
      this.getSegmentsByTranscript(transcriptId, organizationId),
      this.getAnnotationsByTranscript(transcriptId, organizationId),
    ]);

    return {
      transcript,
      speakers,
      segments,
      annotations,
    };
  }

  /**
   * Calculate transcript statistics
   */
  async getTranscriptStats(transcriptId: string, organizationId: string) {
    const segments = await this.getSegmentsByTranscript(
      transcriptId,
      organizationId
    );

    const totalWords = segments.reduce(
      (sum, seg) => sum + seg.text.split(/\s+/).length,
      0
    );

    const averageConfidence =
      segments.filter((s) => s.confidence).length > 0
        ? segments.reduce((sum, seg) => sum + (seg.confidence || 0), 0) /
          segments.filter((s) => s.confidence).length
        : null;

    const editedCount = segments.filter((s) => s.isEdited).length;

    const speakerCounts = segments.reduce((acc, seg) => {
      if (seg.speakerId) {
        acc[seg.speakerId] = (acc[seg.speakerId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSegments: segments.length,
      totalWords,
      averageConfidence,
      editedCount,
      editPercentage: (editedCount / segments.length) * 100,
      speakerCounts,
    };
  }
}

export const transcriptService = new TranscriptService();
