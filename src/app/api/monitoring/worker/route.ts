import { NextResponse } from "next/server";
import { Queue } from "bullmq";

const queue = new Queue("ai-analysis", {
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
    tls: {},
  },
});

export async function GET() {
  const counts =
    await queue.getJobCounts();

  return NextResponse.json({
    active: counts.active,
    waiting: counts.waiting,
    completed: counts.completed,
    failed: counts.failed,
    delayed: counts.delayed,
  });
}