import { config } from "dotenv";
config();

import { db } from "../lib/drizzle/connection";
import { rate_limit } from "../lib/drizzle/schema/auth-schema";

async function clearRateLimit() {
  try {
    console.log("Clearing rate limit entries...");
    
    // Delete all rate limit entries
    await db.delete(rate_limit);
    
    console.log("✓ Rate limit entries cleared successfully!");
    console.log("You can now try logging in again.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error clearing rate limit:", error);
    process.exit(1);
  }
}

clearRateLimit();
