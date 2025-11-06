import { db } from "@/drizzle/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"// path to your Drizzle schema files
  }),
  //... the rest of your config
});
