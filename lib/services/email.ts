import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;

if (!host || !port || !user || !password) {
  throw new Error("SMTP configuration is missing in environment variables.");
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user,
    pass: password,
  },
});

const bodyTemplate = (paragraphs: string[]) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    ${paragraphs.map((p) => `<p>${p}</p>`).join("")}
    <p style="margin-top: 20px;">Kind regards,<br/>The TotoLaw Team</p>
  </div>
`;

export const sendEmail = async (options: {
  to: string;
  subject: string;
  paragraphs: string[];
}) => {
  const mailOptions = {
    from: `"TotoLaw" <${user}>`,
    to: options.to,
    subject: options.subject,
    html: bodyTemplate(options.paragraphs),
  };
  await transporter.sendMail(mailOptions);
};
