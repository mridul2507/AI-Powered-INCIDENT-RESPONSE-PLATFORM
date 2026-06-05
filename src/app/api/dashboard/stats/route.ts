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

    return NextResponse.json({
      totalServices,
      healthyServices,
      activeIncidents,
      criticalAlerts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}