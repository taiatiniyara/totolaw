import { boolean, integer, json, pgTable, text, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { organisations } from "./organisation-schema";

interface ProceedingStep {
    title: string;
    description?: string;
    order: number;
    isRequired: boolean;
}

export const proceedingTemplates = pgTable("proceeding_templates", {
    id: text().primaryKey(),
    organisationId: text("organisation_id")
      .references(() => organisations.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    steps: json("steps").notNull().$type<ProceedingStep[]>(), // Storing steps as JSON array
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("proceeding_template_org_idx").on(table.organisationId),
}));
export type ProceedingTemplate = typeof proceedingTemplates.$inferSelect;
export type NewProceedingTemplate = typeof proceedingTemplates.$inferInsert;

export const proceedingSteps = pgTable("proceeding_steps", {
    id: text("id").primaryKey(),
    organisationId: text("organisation_id")
      .references(() => organisations.id, { onDelete: "cascade" })
      .notNull(),
    templateId: text("template_id").references(() => proceedingTemplates.id).notNull(),
    title: text("title").notNull(), // e.g. "Investigation", "Arrest", "Trial"
    description: text("description"),
    order: integer("order").notNull(), // step sequence
    isRequired: boolean("is_required").default(true),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("proceeding_step_org_idx").on(table.organisationId),
  templateIdx: index("proceeding_step_template_idx").on(table.templateId),
}));