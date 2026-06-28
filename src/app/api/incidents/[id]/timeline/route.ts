import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const incident =
      await prisma.incident.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!incident) {
      return NextResponse.json(
        {
          error: "Incident not found",
        },
        {
          status: 404,
        }
      );
    }

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