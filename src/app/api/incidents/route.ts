import { auth } from "@/auth";
import { canManageIncidents } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { sendCriticalIncidentEmail } from "@/lib/sendEmail";
import { sendSlackAlert } from "@/lib/slack";
import { publish } from "@/lib/events";

export async function GET() {
  const incidents = await prisma.incident.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      service: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log(session);
    console.log(session?.user);

    if (
      !session?.user?.role ||
      !canManageIncidents(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const body = await req.json();

    const incident = await prisma.incident.create({
      data: {
        title: body.title,
        description: body.description,
        severity: body.severity,
        status: body.status,
        serviceId: body.serviceId || null,
        organizationId: session.user.organizationId,

        timelineEvents: {
          create: {
            type: "CREATED",
            message: "Incident created",
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        title: "New Incident",
        message: `${incident.title} has been created.`,
      },
    });

    if (body.severity === "CRITICAL") {
      sendCriticalIncidentEmail(
        body.title,
        body.description
      ).catch(console.error);

      sendSlackAlert(
        body.title,
        body.severity,
        body.description
      ).catch(console.error);
    }

    await createAuditLog(
      "CREATE",
      "INCIDENT",
      incident.id
    );

    publish({
      type: "INCIDENT_CREATED",
      incident,
    });
      
    await prisma.notification.create({
      data: {
        title: "New Incident Created",
        message: incident.title,
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}