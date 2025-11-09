import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// --- Cases
export const cases = pgTable("cases", {
  id: text().primaryKey(),
  title: text("title").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  filedBy: text("filed_by").references(() => user.id),
  assignedTo: text("assigned_to").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;

// --- Evidence
export const evidence = pgTable("evidence", {
  id: text().primaryKey(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  submittedBy: text("submitted_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Evidence = typeof evidence.$inferSelect;
export type NewEvidence = typeof evidence.$inferInsert;

// --- Hearings
export const hearings = pgTable("hearings", {
  id: text().primaryKey(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  judgeId: text("judge_id").references(() => user.id),
  bailDecision: varchar("bail_decision", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Hearing = typeof hearings.$inferSelect;
export type NewHearing = typeof hearings.$inferInsert;

// --- Pleas
export const pleas = pgTable("pleas", {
  id: text().primaryKey(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  defendantId: text("defendant_id").references(() => user.id),
  pleaType: varchar("plea_type", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Plea = typeof pleas.$inferSelect;
export type NewPlea = typeof pleas.$inferInsert;

// --- Trials
export const trials = pgTable("trials", {
  id: text().primaryKey(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  judgeId: text("judge_id").references(() => user.id),
  verdict: varchar("verdict", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Trial = typeof trials.$inferSelect;
export type NewTrial = typeof trials.$inferInsert;

// --- Sentences
export const sentences = pgTable("sentences", {
  id: text().primaryKey(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  sentenceType: varchar("sentence_type", { length: 50 }).notNull(),
  duration: integer("duration"), // months/years if applicable
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Sentence = typeof sentences.$inferSelect;
export type NewSentence = typeof sentences.$inferInsert;

// --- Appeals
export const appeals = pgTable("appeals", {
  id: text().primaryKey(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  filedBy: text("filed_by").references(() => user.id),
  reason: text("reason"),
  outcome: varchar("outcome", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Appeal = typeof appeals.$inferSelect;
export type NewAppeal = typeof appeals.$inferInsert;

// --- Enforcement
export const enforcement = pgTable("enforcement", {
  id: text().primaryKey(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  officerId: text("officer_id").references(() => user.id),
  action: varchar("action", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Enforcement = typeof enforcement.$inferSelect;
export type NewEnforcement = typeof enforcement.$inferInsert;
