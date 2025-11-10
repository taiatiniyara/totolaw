import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * System Admins Table
 * Stores authorized super admin emails that can set up and manage the entire system
 * These users have platform-wide access across all organizations
 */
export const systemAdmins = pgTable(
  "system_admins",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(), // Authorized email address
    name: text("name"), // Optional: Display name
    isActive: boolean("is_active").default(true).notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // Link to user account when they sign up
    addedBy: text("added_by").references(() => user.id, { onDelete: "set null" }), // Who added this admin
    addedAt: timestamp("added_at").defaultNow().notNull(),
    lastLogin: timestamp("last_login"),
    notes: text("notes"), // Optional notes about this admin
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    emailIdx: index("system_admin_email_idx").on(table.email),
    userIdx: index("system_admin_user_idx").on(table.userId),
    activeIdx: index("system_admin_active_idx").on(table.isActive),
  })
);

export type SystemAdmin = typeof systemAdmins.$inferSelect;
export type NewSystemAdmin = typeof systemAdmins.$inferInsert;

/**
 * System Admin Audit Log
 * Tracks all system-level administrative actions
 */
export const systemAdminAuditLog = pgTable(
  "system_admin_audit_log",
  {
    id: text("id").primaryKey(),
    adminId: text("admin_id")
      .references(() => systemAdmins.id, { onDelete: "cascade" })
      .notNull(),
    action: varchar("action", { length: 100 }).notNull(), // "created_organization", "added_admin", "modified_permissions", etc.
    entityType: varchar("entity_type", { length: 50 }), // "organization", "role", "permission", "user", "system_admin"
    entityId: text("entity_id"),
    description: text("description").notNull(),
    metadata: text("metadata"), // JSON string with additional details
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    adminIdx: index("sys_admin_audit_admin_idx").on(table.adminId),
    actionIdx: index("sys_admin_audit_action_idx").on(table.action),
    entityIdx: index("sys_admin_audit_entity_idx").on(
      table.entityType,
      table.entityId
    ),
    createdAtIdx: index("sys_admin_audit_created_at_idx").on(table.createdAt),
  })
);

export type SystemAdminAuditLog = typeof systemAdminAuditLog.$inferSelect;
export type NewSystemAdminAuditLog = typeof systemAdminAuditLog.$inferInsert;
