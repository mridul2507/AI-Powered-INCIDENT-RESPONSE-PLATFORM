import { NextResponse } from "next/server";
import { writeLog } from "@/lib/logger";

export async function GET() {
  await writeLog(
    "INFO",
    "Test log from IR Assist",
    {
      source: "api/test-log",
    }
  );

  return NextResponse.json({
    success: true,
  });
}