import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { organizations } from "./organization-schema";
import { cases } from "./db-schema";
import { hearings } from "./db-schema";

// --- Transcripts
// Main transcript record linked to a hearing
export const transcripts = pgTable("transcripts", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  hearingId: text("hearing_id")
    .references(() => hearings.id)
    .notNull(),
  title: text("title").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, in-progress, completed, reviewed
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // total duration in seconds
  recordingUrl: text("recording_url"), // URL to audio/video recording if available
  transcriptionService: varchar("transcription_service", { length: 50 }), // deepgram, assemblyai, whisper, etc.
  language: varchar("language", { length: 10 }).default("en"),
  accuracy: integer("accuracy"), // confidence score 0-100 if provided by service
  createdBy: text("created_by").references(() => user.id),
  reviewedBy: text("reviewed_by").references(() => user.id), // who verified/approved the transcript
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("transcript_org_idx").on(table.organizationId),
  caseIdx: index("transcript_case_idx").on(table.caseId),
  hearingIdx: index("transcript_hearing_idx").on(table.hearingId),
  statusIdx: index("transcript_status_idx").on(table.status),
  createdByIdx: index("transcript_created_by_idx").on(table.createdBy),
}));
export type Transcript = typeof transcripts.$inferSelect;
export type NewTranscript = typeof transcripts.$inferInsert;

// --- Transcript Speakers
// Define who is speaking in the transcript (judge, prosecutor, defense attorney, witness, etc.)
export const transcriptSpeakers = pgTable("transcript_speakers", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  transcriptId: text("transcript_id")
    .references(() => transcripts.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // Full name of speaker
  role: varchar("role", { length: 50 }).notNull(), // judge, prosecutor, defense_attorney, witness, defendant, clerk, etc.
  userId: text("user_id").references(() => user.id), // link to user if they're in the system
  speakerLabel: varchar("speaker_label", { length: 20 }), // label used by transcription service (e.g., "Speaker A", "Speaker 1")
  notes: text("notes"), // additional context about the speaker
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("transcript_speaker_org_idx").on(table.organizationId),
  transcriptIdx: index("transcript_speaker_transcript_idx").on(table.transcriptId),
  roleIdx: index("transcript_speaker_role_idx").on(table.role),
}));
export type TranscriptSpeaker = typeof transcriptSpeakers.$inferSelect;
export type NewTranscriptSpeaker = typeof transcriptSpeakers.$inferInsert;

// --- Transcript Segments
// Individual segments of the transcript with timestamps and speaker information
export const transcriptSegments = pgTable("transcript_segments", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  transcriptId: text("transcript_id")
    .references(() => transcripts.id, { onDelete: "cascade" })
    .notNull(),
  speakerId: text("speaker_id").references(() => transcriptSpeakers.id),
  segmentNumber: integer("segment_number").notNull(), // sequence order
  startTime: integer("start_time").notNull(), // milliseconds from start
  endTime: integer("end_time").notNull(), // milliseconds from start
  text: text("text").notNull(), // the actual transcript text
  originalText: text("original_text"), // original unedited text from transcription service
  confidence: integer("confidence"), // confidence score 0-100 from transcription service
  isEdited: boolean("is_edited").default(false),
  editedBy: text("edited_by").references(() => user.id),
  editedAt: timestamp("edited_at"),
  metadata: json("metadata"), // store additional data like word-level timestamps, alternatives, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("transcript_segment_org_idx").on(table.organizationId),
  transcriptIdx: index("transcript_segment_transcript_idx").on(table.transcriptId),
  speakerIdx: index("transcript_segment_speaker_idx").on(table.speakerId),
  segmentNumberIdx: index("transcript_segment_number_idx").on(table.transcriptId, table.segmentNumber),
  startTimeIdx: index("transcript_segment_start_time_idx").on(table.transcriptId, table.startTime),
}));
export type TranscriptSegment = typeof transcriptSegments.$inferSelect;
export type NewTranscriptSegment = typeof transcriptSegments.$inferInsert;

// --- Transcript Annotations
// Allow users to add notes, highlights, or bookmarks to specific parts of the transcript
export const transcriptAnnotations = pgTable("transcript_annotations", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  transcriptId: text("transcript_id")
    .references(() => transcripts.id, { onDelete: "cascade" })
    .notNull(),
  segmentId: text("segment_id").references(() => transcriptSegments.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // note, highlight, bookmark, objection, key_testimony, etc.
  content: text("content"), // annotation text
  startTime: integer("start_time"), // if annotation spans time range
  endTime: integer("end_time"),
  color: varchar("color", { length: 20 }), // for highlights
  createdBy: text("created_by").references(() => user.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("transcript_annotation_org_idx").on(table.organizationId),
  transcriptIdx: index("transcript_annotation_transcript_idx").on(table.transcriptId),
  segmentIdx: index("transcript_annotation_segment_idx").on(table.segmentId),
  typeIdx: index("transcript_annotation_type_idx").on(table.type),
  createdByIdx: index("transcript_annotation_created_by_idx").on(table.createdBy),
}));
export type TranscriptAnnotation = typeof transcriptAnnotations.$inferSelect;
export type NewTranscriptAnnotation = typeof transcriptAnnotations.$inferInsert;
