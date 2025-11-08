import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const cases = pgTable("cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
});
