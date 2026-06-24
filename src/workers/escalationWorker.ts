import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { prisma } from "@/lib/prisma";
import { sendCriticalIncidentEmail } from "@/lib/sendEmail";
import { sendSlackAlert } from "@/lib/slack";

async function checkEscalations() {
  try {
    const fifteenMinutesAgo = new Date(
      Date.now() - 15 * 60 * 1000
    );

    const incidents = await prisma.incident.findMany({
      where: {
        severity: "CRITICAL",
        status: {
          not: "RESOLVED",
        },
        escalated: false,
        createdAt: {
          lte: fifteenMinutesAgo,
        },
      },
    });

    for (const incident of incidents) {
      await prisma.notification.create({
        data: {
          title: "ESCALATED INCIDENT",
          message: incident.title,
        },
      });

      await sendCriticalIncidentEmail(
        `ESCALATED: ${incident.title}`,
        incident.description ?? ""
      );

      await sendSlackAlert(
        `ESCALATED: ${incident.title}`,
        "CRITICAL",
        incident.description ?? ""
      );

      await prisma.incident.update({
        where: {
          id: incident.id,
        },
        data: {
          escalated: true,
        },
      });

      console.log(
        `${incident.title} escalated`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

setInterval(
  checkEscalations,
  60 * 1000
);

console.log(
  "Escalation worker running..."
);