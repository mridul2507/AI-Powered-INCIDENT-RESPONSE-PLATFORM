import { waitUntil } from "@vercel/functions";

const LOKI_URL = "https://logs-prod-028.grafana.net/loki/api/v1/push";

async function pushToLoki(level: string, data: object): Promise<void> {
  const token = process.env.GRAFANA_CLOUD_API_TOKEN;
  if (!token) return;

  const auth = Buffer.from(`1670096:${token}`).toString("base64");
  const logLine = JSON.stringify({
    level,
    time: new Date().toISOString(),
    ...data,
  });

  await fetch(LOKI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      streams: [
        {
          stream: { job: "ir-assist", env: "production", level },
          values: [[String(Date.now() * 1_000_000), logLine]],
        },
      ],
    }),
  });
}

function log(
  level: "info" | "warn" | "error" | "debug",
  data: object | string
) {
  const entry = typeof data === "string" ? { msg: data } : data;

  console.log(JSON.stringify({ level, time: new Date().toISOString(), ...entry }));

  if (process.env.GRAFANA_CLOUD_API_TOKEN) {
    try {
      waitUntil(pushToLoki(level, entry));
    } catch {
    }
  }
}

export const logger = {
  info:  (data: object | string) => log("info", data),
  warn:  (data: object | string) => log("warn", data),
  error: (data: object | string) => log("error", data),
  debug: (data: object | string) => log("debug", data),
};