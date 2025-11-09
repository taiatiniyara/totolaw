import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./drizzle/connection";
import { magicLink } from "better-auth/plugins";
import { sendEmail } from "./services/email.service";
import { nextCookies } from "better-auth/next-js";
import * as schema from "./drizzle/schema/auth-schema";

const authUrl = process.env.BETTER_AUTH_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!authUrl || !authSecret) {
  throw new Error("BETTER_AUTH_URL or BETTER_AUTH_SECRET is not defined");
}

export const auth = betterAuth({
  secret: authSecret,
  url: authUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendEmail(email, "Your Magic Login Link", [
          `Bula vinaka,`,
          `You requested a magic login link. Use the link below to log in:`,
          `<a style="color: blue; text-decoration: underline; font-weight: bold;" href="${url}">Click Here</a>`,
          `If you did not request this link, please ignore this email.`,
        ]);
      },
      rateLimit: {
        window: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each email to 5 requests per windowMs
      },
    }),
    nextCookies(),
  ],
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3224"],
});
