import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !port || !user || !pass) {
  throw new Error("SMTP configuration is missing in environment variables.");
}
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: {
    user,
    pass,
  },
});

function htmlTemplate(paragraphs: string[]): string {
  return `
    <DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            background-color: #f4f4f4;
          }
        </style>
      </head>
      <body>
        ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <footer>
          <p>Kind regards,<br />The Totolaw Team</p>
        </footer>
      </body>
    </html>
  `;
}

export async function sendEmail(
  to: string,
  subject: string,
  paragraphs: string[]
): Promise<string> {
  const htmlContent = htmlTemplate(paragraphs);
  try {
    await transporter.sendMail({
      from: `Totolaw <${user}>`,
      to,
      subject,
      html: htmlContent,
    });
    return "Email sent successfully";
  } catch (error) {
    console.error("Error sending email:", error);
    return "Error sending email";
  }
}
