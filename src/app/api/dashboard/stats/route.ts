import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const organizationId =
      session.user.organizationId;

    const [totalServices,healthyServices,activeIncidents,criticalAlerts,warningAlerts,infoAlerts,resolvedIncidents,
    ] = await Promise.all([
      prisma.service.count({
        where: {
          organizationId,
        },
      }),

      prisma.service.count({
        where: {
          organizationId,
          status: "HEALTHY",
        },
      }),

      prisma.incident.count({
        where: {
          organizationId,
          deletedAt: null,
          status: {
            in: ["OPEN", "INVESTIGATING"],
          },
        },
      }),

      prisma.incident.count({
        where: {
          organizationId,
          deletedAt: null,
          severity: "CRITICAL",
        },
      }),

      prisma.incident.count({
        where: {
          organizationId,
          deletedAt: null,
          severity: "WARNING",
        },
      }),

      prisma.incident.count({
        where: {
          organizationId,
          deletedAt: null,
          severity: "INFO",
        },
      }),

      prisma.incident.count({
        where: {
          organizationId,
          deletedAt: null,
          status: "RESOLVED",
        },
      }),
    ]);

    const [resolvedEvents, latestMetric] =
      await Promise.all([

        prisma.timelineEvent.findMany({

          where: {
            type: "RESOLVED",

            incident: {
              organizationId,
            },
          },

          include: {
            incident: true,
          },

        }),

        prisma.metric.findFirst({

          where: {
            organizationId,
          },

          orderBy: {
            createdAt: "desc",
          },

        }),

      ]);

    let averageMttr = "--";

    if (resolvedEvents.length > 0) {

      const totalMs =
        resolvedEvents.reduce(

          (sum, event) =>
            sum +
            (
              new Date(event.createdAt).getTime() -
              new Date(event.incident.createdAt).getTime()
            ),

          0

        );

      const avgMs =
        totalMs /
        resolvedEvents.length;

      const totalMinutes =
        Math.floor(avgMs / 60000);

      const days =
        Math.floor(totalMinutes / 1440);

      const hours =
        Math.floor(
          (totalMinutes % 1440) / 60
        );

      const minutes =
        totalMinutes % 60;

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

      latestMetric,

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch stats",
      },
      {
        status: 500,
      }
    );

  }

}