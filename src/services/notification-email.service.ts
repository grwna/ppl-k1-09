import { Resend } from "resend";

type NotificationEmailInput = {
  to: string;
  subject: string;
  message: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

function toHtml(message: string) {
  return `<p>${message}</p>`;
}

export const NotificationEmailService = {
  async send(input: NotificationEmailInput) {
    if (!process.env.RESEND_API_KEY || !process.env.NOTIFICATION_EMAIL_FROM) {
      return { skipped: true };
    }

    const result = await resend.emails.send({
      from: process.env.NOTIFICATION_EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: toHtml(input.message),
      text: input.message,
    });

    if (result.error) {
      console.error("Notification email failed:", result.error);
    }

    return { skipped: false };
  },
};
