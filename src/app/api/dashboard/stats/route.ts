import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalServices =
      await prisma.service.count();

    const healthyServices =
      await prisma.service.count({
        where: {
          status: "HEALTHY",
        },
      });

    const activeIncidents =
      await prisma.incident.count({
        where: {
          status: {
            in: ["OPEN", "INVESTIGATING"],
          },
        },
      });

    const criticalAlerts =
      await prisma.incident.count({
        where: {
          severity: "CRITICAL",
        },
      });
    
    const warningAlerts =
      await prisma.incident.count({
        where: {
          severity: "WARNING",
        },
      });

    const infoAlerts =
      await prisma.incident.count({
        where: {
          severity: "INFO",
        },
      });

    const resolvedIncidents =
      await prisma.incident.count({
        where: {
          status: "RESOLVED",
        },
      });

    const resolvedEvents = await prisma.timelineEvent.findMany({
      where: {
        type: "RESOLVED",
      },
      include: {
        incident: true,
      },
    });

    let averageMttr = "--";

    if (resolvedEvents.length > 0) {
      const totalMs = resolvedEvents.reduce(
        (sum, event) =>
          sum +
          (
            new Date(event.createdAt).getTime() -
            new Date(event.incident.createdAt).getTime()
          ),
        0
      );

      const avgMs = totalMs / resolvedEvents.length;

      const totalMinutes = Math.floor(avgMs / 60000);

      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor(
        (totalMinutes % (24 * 60)) / 60
      );
      const minutes = totalMinutes % 60;

      averageMttr =
        days > 0
          ? `${days}d ${hours}h ${minutes}m`
          : hours > 0
          ? `${hours}h ${minutes}m`
          : `${minutes}m`;
    }

    return NextResponse.json({
      totalServices,
      healthyServices,

      activeIncidents,
      resolvedIncidents,

      criticalAlerts,
      warningAlerts,
      infoAlerts,

      averageMttr,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}