import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

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
      logger.warn({
        event: "TIMELINE_INCIDENT_NOT_FOUND",
        incidentId: id,
      });
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

    logger.info({
      event: "TIMELINE_FETCHED",
      incidentId: id,
      totalEvents: events.length,
    });
    return NextResponse.json(events);
  } catch (error) {
    logger.error({
      event: "TIMELINE_FETCH_FAILED",
      error,
    });

    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}