import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  out: "./lib/drizzle/migrations",
  schema: "./lib/drizzle/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
