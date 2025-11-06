import { defineConfig } from "drizzle-kit";

const url = process.env.NEXT_PUBLIC_DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
