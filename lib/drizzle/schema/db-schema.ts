import {
  integer,
  json,
  pgTable,
  text,
  timestamp,
  varchar,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { organisations } from "./organisation-schema";

// --- Cases
export const cases = pgTable("cases", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  
  // Case identification and classification
  caseNumber: varchar("case_number", { length: 50 }).notNull(), // HAC 179/2024, ABU 002/20, etc.
  title: text("title").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // criminal, civil, appeal, etc.
  courtLevel: varchar("court_level", { length: 50 }).notNull(), // high_court, magistrates, court_of_appeal, tribunal
  caseType: varchar("case_type", { length: 50 }), // criminal, civil for high court
  status: varchar("status", { length: 50 }).notNull(), // open, active, closed, appealed
  
  // Parties (multiple supported via JSON)
  parties: json("parties").$type<{
    prosecution?: { name: string; counsel?: string }[];
    defense?: { name: string; counsel?: string }[];
    plaintiff?: { name: string; counsel?: string }[];
    defendant?: { name: string; counsel?: string }[];
    appellant?: { name: string; counsel?: string }[];
    respondent?: { name: string; counsel?: string }[];
  }>().notNull(),
  
  // Assignment
  assignedJudgeId: text("assigned_judge_id").references(() => user.id),
  assignedClerkId: text("assigned_clerk_id").references(() => user.id),
  
  // Dates
  filedDate: timestamp("filed_date").notNull(),
  firstHearingDate: timestamp("first_hearing_date"),
  closedDate: timestamp("closed_date"),
  
  // Additional metadata
  offences: json("offences").$type<string[]>(), // For criminal cases
  notes: text("notes"),
  
  // Audit
  filedBy: text("filed_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  orgIdx: index("case_org_idx").on(table.organisationId),
  statusIdx: index("case_status_idx").on(table.status),
  caseNumberIdx: index("case_number_idx").on(table.caseNumber),
  courtLevelIdx: index("case_court_level_idx").on(table.courtLevel),
  assignedJudgeIdx: index("case_assigned_judge_idx").on(table.assignedJudgeId),
  filedDateIdx: index("case_filed_date_idx").on(table.filedDate),
}));
export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;

// --- Evidence
export const evidence = pgTable("evidence", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
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
  orgIdx: index("evidence_org_idx").on(table.organisationId),
  caseIdx: index("evidence_case_idx").on(table.caseId),
  hearingIdx: index("evidence_hearing_idx").on(table.hearingId),
  submittedByIdx: index("evidence_submitted_by_idx").on(table.submittedBy),
}));
export type Evidence = typeof evidence.$inferSelect;
export type NewEvidence = typeof evidence.$inferInsert;

// --- Court Rooms
export const courtRooms = pgTable("court_rooms", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // "HIGH COURT ROOM NO. 2", "COURT NO. 1"
  code: varchar("code", { length: 20 }).notNull(), // "HC-2", "MC-1"
  courtLevel: varchar("court_level", { length: 50 }).notNull(), // high_court, magistrates, etc.
  location: text("location"), // Building/floor details
  capacity: integer("capacity"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  orgIdx: index("courtroom_org_idx").on(table.organisationId),
  codeIdx: index("courtroom_code_idx").on(table.code),
  activeIdx: index("courtroom_active_idx").on(table.isActive),
}));
export type CourtRoom = typeof courtRooms.$inferSelect;
export type NewCourtRoom = typeof courtRooms.$inferInsert;

// --- Hearings
export const hearings = pgTable("hearings", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id, { onDelete: "cascade" })
    .notNull(),
  
  // Schedule
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: varchar("scheduled_time", { length: 10 }).notNull(), // "9:30AM", "10:00AM"
  estimatedDuration: integer("estimated_duration"), // minutes
  
  // Location
  courtRoomId: text("court_room_id").references(() => courtRooms.id),
  location: text("location"), // Fallback if courtroom not tracked
  
  // Type/Action - Based on Fiji court lists
  actionType: varchar("action_type", { length: 50 }).notNull(), // MENTION, HEARING, TRIAL, CONTINUATION OF TRIAL, VOIR DIRE HEARING, PRE-TRIAL CONFERENCE, RULING, FIRST CALL, BAIL HEARING
  status: varchar("status", { length: 50 }).notNull(), // scheduled, in_progress, completed, adjourned, cancelled
  
  // Personnel
  judgeId: text("judge_id").references(() => user.id),
  magistrateId: text("magistrate_id").references(() => user.id), // For magistrates courts
  clerkId: text("clerk_id").references(() => user.id),
  
  // Outcomes
  outcome: text("outcome"), // Brief outcome description
  nextActionRequired: text("next_action_required"),
  
  // Bail-related (if applicable)
  bailConsidered: boolean("bail_considered").default(false),
  bailDecision: varchar("bail_decision", { length: 50 }), // granted, denied, continued
  bailAmount: integer("bail_amount"),
  bailConditions: text("bail_conditions"),
  
  // Minutes/Notes
  minutes: text("minutes"),
  notes: text("notes"),
  
  // Audit
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  orgIdx: index("hearing_org_idx").on(table.organisationId),
  caseIdx: index("hearing_case_idx").on(table.caseId),
  judgeIdx: index("hearing_judge_idx").on(table.judgeId),
  dateIdx: index("hearing_date_idx").on(table.scheduledDate),
  statusIdx: index("hearing_status_idx").on(table.status),
  actionTypeIdx: index("hearing_action_type_idx").on(table.actionType),
  courtRoomIdx: index("hearing_courtroom_idx").on(table.courtRoomId),
}));
export type Hearing = typeof hearings.$inferSelect;
export type NewHearing = typeof hearings.$inferInsert;

// --- Pleas
export const pleas = pgTable("pleas", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  defendantId: text("defendant_id").references(() => user.id),
  pleaType: varchar("plea_type", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("plea_org_idx").on(table.organisationId),
  caseIdx: index("plea_case_idx").on(table.caseId),
}));
export type Plea = typeof pleas.$inferSelect;
export type NewPlea = typeof pleas.$inferInsert;

// --- Trials
export const trials = pgTable("trials", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  judgeId: text("judge_id").references(() => user.id),
  verdict: varchar("verdict", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("trial_org_idx").on(table.organisationId),
  caseIdx: index("trial_case_idx").on(table.caseId),
  judgeIdx: index("trial_judge_idx").on(table.judgeId),
}));
export type Trial = typeof trials.$inferSelect;
export type NewTrial = typeof trials.$inferInsert;

// --- Sentences
export const sentences = pgTable("sentences", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  sentenceType: varchar("sentence_type", { length: 50 }).notNull(),
  duration: integer("duration"), // months/years if applicable
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("sentence_org_idx").on(table.organisationId),
  caseIdx: index("sentence_case_idx").on(table.caseId),
}));
export type Sentence = typeof sentences.$inferSelect;
export type NewSentence = typeof sentences.$inferInsert;

// --- Appeals
export const appeals = pgTable("appeals", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  
  // Link to original case (lower court)
  originalCaseId: text("original_case_id")
    .references(() => cases.id)
    .notNull(),
  
  // New appeal case (if created as new case)
  appealCaseId: text("appeal_case_id")
    .references(() => cases.id),
  
  // Appeal details
  appealType: varchar("appeal_type", { length: 50 }).notNull(), // criminal_appeal, civil_appeal, bail_application
  grounds: text("grounds"), // Grounds for appeal
  status: varchar("status", { length: 50 }).notNull(), // pending, admitted, dismissed, allowed, withdrawn
  
  // Parties
  appellantId: text("appellant_id").references(() => user.id),
  appellantCounsel: text("appellant_counsel"),
  respondentCounsel: text("respondent_counsel"),
  
  // Dates
  filedDate: timestamp("filed_date").notNull(),
  hearingDate: timestamp("hearing_date"),
  decisionDate: timestamp("decision_date"),
  
  // Outcome
  decision: text("decision"),
  orders: text("orders"),
  
  // Audit
  filedBy: text("filed_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  orgIdx: index("appeal_org_idx").on(table.organisationId),
  originalCaseIdx: index("appeal_original_case_idx").on(table.originalCaseId),
  appealCaseIdx: index("appeal_case_idx").on(table.appealCaseId),
  statusIdx: index("appeal_status_idx").on(table.status),
  filedByIdx: index("appeal_filed_by_idx").on(table.filedBy),
}));
export type Appeal = typeof appeals.$inferSelect;
export type NewAppeal = typeof appeals.$inferInsert;

// --- Enforcement
export const enforcement = pgTable("enforcement", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: text("case_id")
    .references(() => cases.id)
    .notNull(),
  officerId: text("officer_id").references(() => user.id),
  action: varchar("action", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("enforcement_org_idx").on(table.organisationId),
  caseIdx: index("enforcement_case_idx").on(table.caseId),
  officerIdx: index("enforcement_officer_idx").on(table.officerId),
}));
export type Enforcement = typeof enforcement.$inferSelect;
export type NewEnforcement = typeof enforcement.$inferInsert;

// --- Legal Representatives (Lawyers/Law Firms)
export const legalRepresentatives = pgTable("legal_representatives", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  
  // Representative details
  name: text("name").notNull(), // Individual lawyer or firm name
  type: varchar("type", { length: 50 }).notNull(), // "individual", "law_firm", "legal_aid"
  firmName: text("firm_name"), // If individual, their firm
  
  // Contact
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  
  // Specialization
  practiceAreas: json("practice_areas").$type<string[]>(), // criminal, civil, family, etc.
  
  // Association with system user (if they have an account)
  userId: text("user_id").references(() => user.id),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Metadata
  notes: text("notes"),
  
  // Audit
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  orgIdx: index("legal_rep_org_idx").on(table.organisationId),
  userIdx: index("legal_rep_user_idx").on(table.userId),
  activeIdx: index("legal_rep_active_idx").on(table.isActive),
}));
export type LegalRepresentative = typeof legalRepresentatives.$inferSelect;
export type NewLegalRepresentative = typeof legalRepresentatives.$inferInsert;

// --- Daily Cause Lists (Court Schedules)
export const dailyCauseLists = pgTable("daily_cause_lists", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  
  // Schedule details
  listDate: timestamp("list_date").notNull(), // Date for this cause list
  courtLevel: varchar("court_level", { length: 50 }).notNull(), // high_court, magistrates, etc.
  
  // Judge/Magistrate
  presidingOfficerId: text("presiding_officer_id").references(() => user.id).notNull(),
  presidingOfficerTitle: varchar("presiding_officer_title", { length: 100 }), // "HON. MR. JUSTICE GOUNDAR"
  
  // Courtroom
  courtRoomId: text("court_room_id").references(() => courtRooms.id),
  
  // Session details
  sessionTime: varchar("session_time", { length: 20 }), // "9:30AM", "10.00AM"
  
  // Status
  status: varchar("status", { length: 50 }).default("draft").notNull(), // draft, published, completed
  publishedAt: timestamp("published_at"),
  
  // Metadata
  notes: text("notes"),
  
  // Audit
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  orgIdx: index("cause_list_org_idx").on(table.organisationId),
  dateIdx: index("cause_list_date_idx").on(table.listDate),
  officerIdx: index("cause_list_officer_idx").on(table.presidingOfficerId),
  statusIdx: index("cause_list_status_idx").on(table.status),
}));
export type DailyCauseList = typeof dailyCauseLists.$inferSelect;
export type NewDailyCauseList = typeof dailyCauseLists.$inferInsert;

interface ManagedListItem {
  id: string;
  name: string;
  details?: string;
}

export const managedLists = pgTable("managed_lists", {
  id: text().primaryKey(),
  organisationId: text("organisation_id")
    .references(() => organisations.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  list: json("list").notNull().$type<ManagedListItem[]>(), // Storing as JSON array
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("managed_list_org_idx").on(table.organisationId),
}));
export type ManagedList = typeof managedLists.$inferSelect;
export type NewManagedList = typeof managedLists.$inferInsert;
