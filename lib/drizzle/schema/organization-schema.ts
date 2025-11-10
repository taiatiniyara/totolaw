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

// --- Organizations (Countries/Islands)
export const organizations = pgTable(
  "organizations",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(), // e.g., "Fiji", "Samoa", "Tonga"
    code: varchar("code", { length: 10 }).notNull().unique(), // e.g., "FJ", "WS", "TO"
    type: varchar("type", { length: 50 }).notNull(), // "country", "province", "district"
    description: text("description"),
    parentId: text("parent_id"), // For hierarchical structures
    isActive: boolean("is_active").default(true).notNull(),
    settings: text("settings"), // JSON string for org-specific settings
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
  })
);

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

// Self-referencing relationship for hierarchical organizations
export const organizationsRelations = {
  parent: {
    field: organizations.parentId,
    references: organizations.id,
  },
};

// --- Organization Memberships
export const organizationMembers = pgTable(
  "organization_members",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(), // User's primary organization
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
    // Ensure a user can only have one membership per organization
    uniqueOrgUser: unique("unique_org_user").on(
      table.organizationId,
      table.userId
    ),
    orgIdx: index("org_member_org_idx").on(table.organizationId),
    userIdx: index("org_member_user_idx").on(table.userId),
    primaryIdx: index("org_member_primary_idx").on(table.userId, table.isPrimary),
    activeIdx: index("org_member_active_idx").on(table.isActive),
  })
);

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;

// --- Organization Invitations
export const organizationInvitations = pgTable(
  "organization_invitations",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
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
    orgIdx: index("org_invitation_org_idx").on(table.organizationId),
    emailIdx: index("org_invitation_email_idx").on(table.email),
    statusIdx: index("org_invitation_status_idx").on(table.status),
    tokenIdx: index("org_invitation_token_idx").on(table.token),
  })
);

export type OrganizationInvitation = typeof organizationInvitations.$inferSelect;
export type NewOrganizationInvitation = typeof organizationInvitations.$inferInsert;
