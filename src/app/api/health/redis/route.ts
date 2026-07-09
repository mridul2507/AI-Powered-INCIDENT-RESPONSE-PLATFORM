import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD!,
  tls: {},
});

export async function GET() {
  try {
    await redis.ping();

    return NextResponse.json({
      status: "healthy",
      redis: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        redis: "disconnected",
      },
      {
        status: 500,
      }
    );
  }
}