import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// --- Organisations (Countries/Islands/Courts)
export const organisations = pgTable(
  "organisations",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(), // e.g., "Fiji Court of Appeal", "Suva High Court", "Nadi Magistrates Court"
    code: varchar("code", { length: 10 }).notNull().unique(), // e.g., "FJ-COA", "FJ-HC-SUVA", "FJ-MC-NADI"
    type: varchar("type", { length: 50 }).notNull(), // "country", "court_system", "court", "tribunal"
    
    // Court-specific fields
    courtLevel: varchar("court_level", { length: 50 }), // "court_of_appeal", "high_court", "magistrates", "tribunal"
    courtType: varchar("court_type", { length: 50 }), // "criminal", "civil", "family", "agricultural", "small_claims"
    jurisdiction: text("jurisdiction"), // Geographic or subject matter jurisdiction
    
    description: text("description"),
    parentId: text("parent_id"), // For hierarchical structures (e.g., Suva High Court -> Fiji Court System)
    isActive: boolean("is_active").default(true).notNull(),
    settings: text("settings"), // JSON string for org-specific settings (e.g., case number format)
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    codeIdx: index("org_code_idx").on(table.code),
    parentIdx: index("org_parent_idx").on(table.parentId),
    activeIdx: index("org_active_idx").on(table.isActive),
    courtLevelIdx: index("org_court_level_idx").on(table.courtLevel),
  })
);

export type Organisation = typeof organisations.$inferSelect;
export type NewOrganisation = typeof organisations.$inferInsert;

// Self-referencing relationship for hierarchical organisations
export const organisationsRelations = {
  parent: {
    field: organisations.parentId,
    references: organisations.id,
  },
};

// --- Organisation Memberships
export const organisationMembers = pgTable(
  "organisation_members",
  {
    id: text("id").primaryKey(),
    organisationId: text("organisation_id")
      .references(() => organisations.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(), // User's primary organisation
    isActive: boolean("is_active").default(true).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
    addedBy: text("added_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Ensure a user can only have one membership per organisation
    uniqueOrgUser: unique("unique_org_user").on(
      table.organisationId,
      table.userId
    ),
    orgIdx: index("org_member_org_idx").on(table.organisationId),
    userIdx: index("org_member_user_idx").on(table.userId),
    primaryIdx: index("org_member_primary_idx").on(table.userId, table.isPrimary),
    activeIdx: index("org_member_active_idx").on(table.isActive),
  })
);

export type OrganisationMember = typeof organisationMembers.$inferSelect;
export type NewOrganisationMember = typeof organisationMembers.$inferInsert;

// --- Organisation Invitations
export const organisationInvitations = pgTable(
  "organisation_invitations",
  {
    id: text("id").primaryKey(),
    organisationId: text("organisation_id")
      .references(() => organisations.id, { onDelete: "cascade" })
      .notNull(),
    email: text("email").notNull(),
    roleId: text("role_id"), // Optional: pre-assign role upon acceptance
    token: text("token").notNull().unique(),
    status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, accepted, expired, revoked
    invitedBy: text("invited_by")
      .references(() => user.id)
      .notNull(),
    acceptedBy: text("accepted_by").references(() => user.id),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    orgIdx: index("org_invitation_org_idx").on(table.organisationId),
    emailIdx: index("org_invitation_email_idx").on(table.email),
    statusIdx: index("org_invitation_status_idx").on(table.status),
    tokenIdx: index("org_invitation_token_idx").on(table.token),
  })
);

export type OrganisationInvitation = typeof organisationInvitations.$inferSelect;
export type NewOrganisationInvitation = typeof organisationInvitations.$inferInsert;

// --- Organisation Join Requests (User-initiated)
export const organisationJoinRequests = pgTable(
  "organisation_join_requests",
  {
    id: text("id").primaryKey(),
    organisationId: text("organisation_id")
      .references(() => organisations.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, approved, rejected
    message: text("message"), // Optional message from user
    reviewedBy: text("reviewed_by").references(() => user.id),
    reviewedAt: timestamp("reviewed_at"),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    orgIdx: index("org_join_request_org_idx").on(table.organisationId),
    userIdx: index("org_join_request_user_idx").on(table.userId),
    statusIdx: index("org_join_request_status_idx").on(table.status),
    // Ensure user can only have one pending request per organisation
    uniqueUserOrgPending: unique("unique_user_org_join_request").on(
      table.userId,
      table.organisationId
    ),
  })
);

export type OrganisationJoinRequest = typeof organisationJoinRequests.$inferSelect;
export type NewOrganisationJoinRequest = typeof organisationJoinRequests.$inferInsert;
