import { prisma } from "@/lib/prisma";
import { getResend } from "@/lib/email";
import { logger } from "./logger";

export async function sendCriticalIncidentEmail(
  title: string,
  description: string
) {

  try{
    const resend = getResend();

    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "ENGINEER"],
        },
      },

      select: {
        email: true,
      },
    });

    const emails = users.map((user) => user.email);

    if (emails.length === 0) {
      logger.warn({
        event: "EMAIL_SKIPPED",
        reason: "NO_RECIPIENTS",
      });

      return;
    }

    const response = await resend.emails.send({
      from: "IR Assist <onboarding@resend.dev>",

      to: emails,

      subject: `🚨 Critical Incident: ${title}`,

      html: `
        <h2>Critical Incident Detected</h2>

        <p><strong>Title:</strong> ${title}</p>

        <p>${description}</p>
      `,
    });

    logger.info({
      event: "EMAIL_SENT",
      title,
      recipients: emails.length,
      emailId: response.data?.id,
    });
  }
  catch(error){
    logger.error({
        event:"EMAIL_SEND_FAILED",
        title,
        error,
    });

    throw error;
  }
}