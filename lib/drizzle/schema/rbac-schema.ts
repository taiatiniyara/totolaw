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
import { organizations } from "./organization-schema";

// --- Roles
export const roles = pgTable(
  "roles",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(), // e.g., "Judge", "Clerk", "Administrator"
    slug: varchar("slug", { length: 100 }).notNull(), // e.g., "judge", "clerk", "admin"
    description: text("description"),
    isSystem: boolean("is_system").default(false).notNull(), // System roles cannot be deleted
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Unique role slug per organization
    uniqueOrgSlug: unique("unique_org_role_slug").on(
      table.organizationId,
      table.slug
    ),
    orgIdx: index("role_org_idx").on(table.organizationId),
    slugIdx: index("role_slug_idx").on(table.slug),
    systemIdx: index("role_system_idx").on(table.isSystem),
    activeIdx: index("role_active_idx").on(table.isActive),
  })
);

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

// --- Permissions
export const permissions = pgTable(
  "permissions",
  {
    id: text("id").primaryKey(),
    resource: varchar("resource", { length: 100 }).notNull(), // e.g., "cases", "hearings", "users"
    action: varchar("action", { length: 50 }).notNull(), // e.g., "create", "read", "update", "delete", "assign"
    slug: varchar("slug", { length: 150 }).notNull().unique(), // e.g., "cases:create", "hearings:read"
    description: text("description"),
    isSystem: boolean("is_system").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    resourceIdx: index("permission_resource_idx").on(table.resource),
    actionIdx: index("permission_action_idx").on(table.action),
    slugIdx: index("permission_slug_idx").on(table.slug),
    systemIdx: index("permission_system_idx").on(table.isSystem),
  })
);

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;

// --- Role-Permission Mappings
export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: text("id").primaryKey(),
    roleId: text("role_id")
      .references(() => roles.id, { onDelete: "cascade" })
      .notNull(),
    permissionId: text("permission_id")
      .references(() => permissions.id, { onDelete: "cascade" })
      .notNull(),
    conditions: text("conditions"), // JSON string for conditional permissions
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Unique permission per role
    uniqueRolePermission: unique("unique_role_permission").on(
      table.roleId,
      table.permissionId
    ),
    roleIdx: index("role_perm_role_idx").on(table.roleId),
    permIdx: index("role_perm_perm_idx").on(table.permissionId),
  })
);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;

// --- User-Role Assignments
export const userRoles = pgTable(
  "user_roles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    roleId: text("role_id")
      .references(() => roles.id, { onDelete: "cascade" })
      .notNull(),
    organizationId: text("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    scope: text("scope"), // Optional: JSON string for scoped access (e.g., specific divisions, regions)
    isActive: boolean("is_active").default(true).notNull(),
    assignedBy: text("assigned_by").references(() => user.id),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"), // Optional: for temporary roles
    revokedAt: timestamp("revoked_at"),
    revokedBy: text("revoked_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Unique role assignment per user per organization
    uniqueUserRoleOrg: unique("unique_user_role_org").on(
      table.userId,
      table.roleId,
      table.organizationId
    ),
    userIdx: index("user_role_user_idx").on(table.userId),
    roleIdx: index("user_role_role_idx").on(table.roleId),
    orgIdx: index("user_role_org_idx").on(table.organizationId),
    activeIdx: index("user_role_active_idx").on(table.isActive),
    userOrgIdx: index("user_role_user_org_idx").on(table.userId, table.organizationId),
  })
);

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;

// --- User Direct Permissions (overrides/exceptions)
export const userPermissions = pgTable(
  "user_permissions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    permissionId: text("permission_id")
      .references(() => permissions.id, { onDelete: "cascade" })
      .notNull(),
    organizationId: text("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    granted: boolean("granted").default(true).notNull(), // true = grant, false = deny (explicit deny)
    conditions: text("conditions"), // JSON string for conditional permissions
    scope: text("scope"), // JSON string for scoped access
    assignedBy: text("assigned_by").references(() => user.id),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
    revokedAt: timestamp("revoked_at"),
    revokedBy: text("revoked_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index("user_perm_user_idx").on(table.userId),
    permIdx: index("user_perm_perm_idx").on(table.permissionId),
    orgIdx: index("user_perm_org_idx").on(table.organizationId),
    grantedIdx: index("user_perm_granted_idx").on(table.granted),
    userOrgIdx: index("user_perm_user_org_idx").on(table.userId, table.organizationId),
  })
);

export type UserPermission = typeof userPermissions.$inferSelect;
export type NewUserPermission = typeof userPermissions.$inferInsert;

// --- Audit Log for Role/Permission Changes
export const rbacAuditLog = pgTable(
  "rbac_audit_log",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(), // "role", "permission", "user_role", "user_permission"
    entityId: text("entity_id").notNull(),
    action: varchar("action", { length: 50 }).notNull(), // "created", "updated", "deleted", "assigned", "revoked"
    performedBy: text("performed_by")
      .references(() => user.id)
      .notNull(),
    targetUserId: text("target_user_id").references(() => user.id), // For user role/permission changes
    changes: text("changes"), // JSON string with before/after values
    metadata: text("metadata"), // JSON string with additional context
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index("audit_org_idx").on(table.organizationId),
    entityIdx: index("audit_entity_idx").on(table.entityType, table.entityId),
    performedByIdx: index("audit_performed_by_idx").on(table.performedBy),
    targetUserIdx: index("audit_target_user_idx").on(table.targetUserId),
    createdAtIdx: index("audit_created_at_idx").on(table.createdAt),
  })
);

export type RbacAuditLog = typeof rbacAuditLog.$inferSelect;
export type NewRbacAuditLog = typeof rbacAuditLog.$inferInsert;
