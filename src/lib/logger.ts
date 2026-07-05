import pino from "pino";

const lokiTransport = pino.transport({
  targets: [
    {
      target: "pino-loki",
      options: {
        host: "https://logs-prod-ap-south-1.grafana.net",
        basicAuth: {
          username: "1670096",
          password: process.env.GRAFANA_CLOUD_API_TOKEN,
        },
        labels: { job: "ir-assist", env: "production" },
        batching: true,
        interval: 5,
      },
      level: "info",
    },
    {
      target: "pino-pretty", // console output (optional, remove in prod)
      options: { colorize: true },
      level: "debug",
    },
  ],
});

export const logger = pino(
  {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  lokiTransport
);