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
  try {
    const counts = await queue.getJobCounts();

    return NextResponse.json({
      status: "healthy",
      queue: counts,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
      },
      {
        status: 500,
      }
    );
  }
}