import {
  pgTable,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * System Admin Audit Log
 * Tracks all system-level administrative actions
 * 
 * Note: System admin status is now managed directly in the user table via the is_super_admin field.
 * This audit log tracks actions performed by super admins.
 */
export const systemAdminAuditLog = pgTable(
  "system_admin_audit_log",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    action: varchar("action", { length: 100 }).notNull(), // "created_organization", "granted_super_admin", "revoked_super_admin", etc.
    entityType: varchar("entity_type", { length: 50 }), // "organization", "role", "permission", "user"
    entityId: text("entity_id"),
    description: text("description").notNull(),
    metadata: text("metadata"), // JSON string with additional details
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("sys_admin_audit_user_idx").on(table.userId),
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
