import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = performance.now();

  await prisma.$queryRaw`SELECT 1`;

  const latency = Math.round(
    performance.now() - start
  );

  return NextResponse.json({
    latency,
    status: "healthy",
  });
}