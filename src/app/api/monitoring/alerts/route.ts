import { NextResponse } from "next/server";
import { Queue } from "bullmq";
import { prisma } from "@/lib/prisma";

const queue = new Queue("ai-analysis", {
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
    tls: {},
  },
});

export async function GET() {
  const start = performance.now();

  await prisma.$queryRaw`SELECT 1`;

  const dbLatency = Math.round(performance.now() - start);

  const counts = await queue.getJobCounts();

  const alerts: string[] = [];

  if (dbLatency > 300)
    alerts.push("High Database Latency");

  if (counts.waiting > 20)
    alerts.push("Worker Queue Backlog");

  if (counts.failed > 0)
    alerts.push("Failed Worker Jobs");

  return NextResponse.json({
    alerts,
    healthy: alerts.length === 0,
  });
}