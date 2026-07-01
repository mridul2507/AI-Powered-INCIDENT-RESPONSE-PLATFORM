import { logger } from "./logger";

export async function sendSlackAlert(
  title: string,
  severity: string,
  description?: string
) {
  try {
    const response = await fetch(
      process.env.SLACK_WEBHOOK_URL!,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: `
🚨 *Critical Incident*

*Title:* ${title}

*Severity:* ${severity}

*Description:* ${description ?? ""}
          `,
        }),
      }
    );

    logger.info({
      event: "SLACK_SENT",
      title,
      incidentSeverity: severity,
      status: response.status,
    });
  } catch (error) {
    logger.error({
      event: "SLACK_SEND_FAILED",
      title,
      error,
    });

    throw error;
  }
}