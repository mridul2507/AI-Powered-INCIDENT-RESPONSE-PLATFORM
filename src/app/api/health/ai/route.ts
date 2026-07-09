import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status:
      process.env.GEMINI_API_KEY
        ? "healthy"
        : "unhealthy",
    provider: "Gemini",
    configured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
}