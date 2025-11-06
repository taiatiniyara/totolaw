import { db } from "@/drizzle/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { sendEmail } from "./services/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"// path to your Drizzle schema files
  }),

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        // send email to user
        await sendEmail({
          to: email,
          subject: "Your Magic Login Link",
          paragraphs: [
            `Click the link below to log in:`,
            `<a href="${url}">${url}</a>`,
            `This link will expire in 10 minutes.`,
          ],
        });
      },
    }),
  ],
});
