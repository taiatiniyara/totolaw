import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const cases = pgTable("cases", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
});
