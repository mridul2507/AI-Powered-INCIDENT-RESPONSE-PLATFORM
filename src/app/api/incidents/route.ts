import { auth } from "@/auth";
import { canManageIncidents } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { sendCriticalIncidentEmail } from "@/lib/sendEmail";
import { sendSlackAlert } from "@/lib/slack";
import { publish } from "@/lib/events";
import { logger } from "@/lib/logger";
import { trace } from "@opentelemetry/api";

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

  logger.info({
    event: "INCIDENTS_FETCHED",
    total: incidents.length,
  });

  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  try {

    const tracer = trace.getTracer("incident-api");

    const span = tracer.startSpan("POST /api/incidents");

    span.setAttribute("endpoint", "/api/incidents");
    span.setAttribute("method", "POST");
    const session = await auth();

    if (
      !session?.user?.role ||
      !canManageIncidents(session.user.role)
    ) {
      logger.warn({
        event: "INCIDENT_CREATE_UNAUTHORIZED",
        userId: session?.user?.id,
        role: session?.user?.role,
      });

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

    logger.info({
      event: "INCIDENT_CREATED",
      incidentId: incident.id,
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
      serviceId: incident.serviceId,
      userId: session.user.id,
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
      ).catch((error) => {
        logger.error({
          event: "EMAIL_FAILED",
          incidentTitle: body.title,
          error,
        });
      });

      sendSlackAlert(
        body.title,
        body.severity,
        body.description
      ).catch((error) => {
        logger.error({
          event: "SLACK_ALERT_FAILED",
          incidentTitle: body.title,
          error,
        });
      });
    }

    await createAuditLog({
      action: "CREATE",
      entityType: "INCIDENT",
      entityId: incident.id,

      userId: session.user.id,

      organizationId:
        session.user.organizationId,

      metadata: {
        title: incident.title,
        severity: incident.severity,
        status: incident.status,
      },
    });

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

    span.setAttribute("incident.id", incident.id);
    span.setAttribute("severity", incident.severity);

    span.end();

    return NextResponse.json(incident, { status: 201 });
  } 
  
  catch (error) {
    logger.error({
      event: "INCIDENT_CREATE_FAILED",
      error,
    });

    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}