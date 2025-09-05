/* eslint-disable no-console */
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import env from "../config/env.config";
import AppError from "../errorHelpers/AppError";
import httpStatus from "./httpStatus";

interface ISendEmailProps {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, string>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmailProps) => {
  try {
    const templatePath = path.join(
      __dirname,
      `../templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Email sending error", error);

    throw new AppError(httpStatus.BAD_GATEWAY, "Email error");
  }
};
