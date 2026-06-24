export async function sendSlackAlert(
  title: string,
  severity: string,
  description?: string
) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
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
  });
}