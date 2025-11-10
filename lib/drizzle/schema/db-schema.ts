import {
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

// --- Cases
export const cases = pgTable("cases", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  filedBy: text("filed_by").references(() => user.id),
  assignedTo: text("assigned_to").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("case_org_idx").on(table.organizationId),
  statusIdx: index("case_status_idx").on(table.status),
  assignedIdx: index("case_assigned_idx").on(table.assignedTo),
  filedByIdx: index("case_filed_by_idx").on(table.filedBy),
}));
export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;

// --- Evidence
export const evidence = pgTable("evidence", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  hearingId: text("hearing_id").references(() => hearings.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  fileType: varchar("file_type", { length: 100 }).notNull(), // MIME type
  filePath: text("file_path").notNull(), // storage path
  description: text("description"),
  submittedBy: text("submitted_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("evidence_org_idx").on(table.organizationId),
  caseIdx: index("evidence_case_idx").on(table.caseId),
  hearingIdx: index("evidence_hearing_idx").on(table.hearingId),
  submittedByIdx: index("evidence_submitted_by_idx").on(table.submittedBy),
}));
export type Evidence = typeof evidence.$inferSelect;
export type NewEvidence = typeof evidence.$inferInsert;

// --- Hearings
export const hearings = pgTable("hearings", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  judgeId: text("judge_id").references(() => user.id),
  bailDecision: varchar("bail_decision", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("hearing_org_idx").on(table.organizationId),
  caseIdx: index("hearing_case_idx").on(table.caseId),
  judgeIdx: index("hearing_judge_idx").on(table.judgeId),
  dateIdx: index("hearing_date_idx").on(table.date),
}));
export type Hearing = typeof hearings.$inferSelect;
export type NewHearing = typeof hearings.$inferInsert;

// --- Pleas
export const pleas = pgTable("pleas", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  defendantId: text("defendant_id").references(() => user.id),
  pleaType: varchar("plea_type", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("plea_org_idx").on(table.organizationId),
  caseIdx: index("plea_case_idx").on(table.caseId),
}));
export type Plea = typeof pleas.$inferSelect;
export type NewPlea = typeof pleas.$inferInsert;

// --- Trials
export const trials = pgTable("trials", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  judgeId: text("judge_id").references(() => user.id),
  verdict: varchar("verdict", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("trial_org_idx").on(table.organizationId),
  caseIdx: index("trial_case_idx").on(table.caseId),
  judgeIdx: index("trial_judge_idx").on(table.judgeId),
}));
export type Trial = typeof trials.$inferSelect;
export type NewTrial = typeof trials.$inferInsert;

// --- Sentences
export const sentences = pgTable("sentences", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  sentenceType: varchar("sentence_type", { length: 50 }).notNull(),
  duration: integer("duration"), // months/years if applicable
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("sentence_org_idx").on(table.organizationId),
  caseIdx: index("sentence_case_idx").on(table.caseId),
}));
export type Sentence = typeof sentences.$inferSelect;
export type NewSentence = typeof sentences.$inferInsert;

// --- Appeals
export const appeals = pgTable("appeals", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  filedBy: text("filed_by").references(() => user.id),
  reason: text("reason"),
  outcome: varchar("outcome", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("appeal_org_idx").on(table.organizationId),
  caseIdx: index("appeal_case_idx").on(table.caseId),
  filedByIdx: index("appeal_filed_by_idx").on(table.filedBy),
}));
export type Appeal = typeof appeals.$inferSelect;
export type NewAppeal = typeof appeals.$inferInsert;

// --- Enforcement
export const enforcement = pgTable("enforcement", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  officerId: text("officer_id").references(() => user.id),
  action: varchar("action", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("enforcement_org_idx").on(table.organizationId),
  caseIdx: index("enforcement_case_idx").on(table.caseId),
  officerIdx: index("enforcement_officer_idx").on(table.officerId),
}));
export type Enforcement = typeof enforcement.$inferSelect;
export type NewEnforcement = typeof enforcement.$inferInsert;

interface ManagedListItem {
  id: string;
  name: string;
  details?: string;
}

export const managedLists = pgTable("managed_lists", {
  id: text().primaryKey(),
  organizationId: text("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  list: json("list").notNull().$type<ManagedListItem[]>(), // Storing as JSON array
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("managed_list_org_idx").on(table.organizationId),
}));
export type ManagedList = typeof managedLists.$inferSelect;
export type NewManagedList = typeof managedLists.$inferInsert;
