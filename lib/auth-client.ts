import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

const url = process.env.BETTER_AUTH_URL;
if (!url) {
  throw new Error("BETTER_AUTH_URL is not defined");
}
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: url + "/api/auth",
  plugins: [magicLinkClient()],
});
