import { Queue } from "bullmq";

export const aiQueue = new Queue(
  "ai-analysis",
  {
    connection: {
      host: process.env.REDIS_HOST!,
      port: Number(process.env.REDIS_PORT!),
      password: process.env.REDIS_PASSWORD!,
      tls: {},
    },
  }
);