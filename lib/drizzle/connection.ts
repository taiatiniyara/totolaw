import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./schema/auth-schema";
import * as organizationSchema from "./schema/organization-schema";
import * as rbacSchema from "./schema/rbac-schema";
import * as dbSchema from "./schema/db-schema";
import * as caseSchema from "./schema/case-schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new Pool({
  connectionString: url,
});

export const db = drizzle(pool, {
  schema: {
    ...authSchema,
    ...organizationSchema,
    ...rbacSchema,
    ...dbSchema,
    ...caseSchema,
  },
});
