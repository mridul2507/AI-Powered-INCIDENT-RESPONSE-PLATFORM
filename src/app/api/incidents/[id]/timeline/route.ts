import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const events = await prisma.timelineEvent.findMany({
      where: {
        incidentId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}