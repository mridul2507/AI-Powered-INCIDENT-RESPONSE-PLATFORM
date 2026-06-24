import { prisma } from "@/lib/prisma";
import { getResend } from "@/lib/email";

export async function sendCriticalIncidentEmail(
  title: string,
  description: string
) {
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

  if (emails.length === 0) return;

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

  console.log(response);
}