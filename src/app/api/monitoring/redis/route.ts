import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD!,
  tls: {},
});

export async function GET() {
  const start = performance.now();

  await redis.ping();

  const latency = Math.round(
    performance.now() - start
  );

  return NextResponse.json({
    latency,
    status: "healthy",
  });
}