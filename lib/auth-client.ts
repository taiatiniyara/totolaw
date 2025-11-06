import { createAuthClient } from "better-auth/react";
const url = process.env.BETTER_AUTH_URL || "http://localhost:3000";
if (!url) {
  throw new Error("BETTER_AUTH_URL is not defined");
}
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: url,
});
