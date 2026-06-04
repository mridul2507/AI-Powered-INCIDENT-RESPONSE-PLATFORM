import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const incidents = await prisma.incident.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(incidents);
}