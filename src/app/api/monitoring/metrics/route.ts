import { NextResponse } from "next/server";
import { Queue } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getUptime } from "@/lib/uptime";

const queue = new Queue("ai-analysis", {
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
    tls: {},
  },
});

export async function GET() {
  const started = Date.now();

  const [
    queueCounts,
    services,
    incidents,
    logs,
    notifications,
  ] = await Promise.all([
    queue.getJobCounts(),
    prisma.service.count(),
    prisma.incident.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.log.count(),
    prisma.notification.count(),
  ]);

  const latency = Date.now() - started;

  return NextResponse.json({
    latency,
    queue: queueCounts,
    services,
    incidents,
    logs,
    notifications,
    timestamp: new Date().toISOString(),
    uptime: getUptime(),
  });
}