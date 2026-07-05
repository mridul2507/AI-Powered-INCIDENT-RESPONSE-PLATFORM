import pino from "pino";
import { Writable } from "stream";
import { waitUntil } from "@vercel/functions";

const LOKI_URL = "https://logs-prod-ap-south-1.grafana.net/loki/api/v1/push";

async function sendToLoki(line: string): Promise<void> {
  if (!process.env.GRAFANA_CLOUD_API_TOKEN) return;

  const auth = Buffer.from(
    `1670096:${process.env.GRAFANA_CLOUD_API_TOKEN}`
  ).toString("base64");

  let level = "info";
  try {
    const obj = JSON.parse(line);
    if (obj.level >= 50) level = "error";
    else if (obj.level >= 40) level = "warn";
    else if (obj.level >= 20) level = "debug";
  } catch {}

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
          values: [[String(Date.now() * 1_000_000), line]],
        },
      ],
    }),
  });
}

const lokiStream = new Writable({
  write(chunk, _, callback) {
    const line = chunk.toString().trim();
    process.stdout.write(chunk);
    if (line) {
      waitUntil(sendToLoki(line)); // Vercel keeps function alive until this resolves
    }
    callback();
  },
});

export const logger = pino(
  {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  lokiStream
);