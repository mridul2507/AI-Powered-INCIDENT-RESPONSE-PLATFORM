import { auth } from "@/auth";
import { canManageIncidents } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { publish } from "@/lib/events";
import { logger } from "@/lib/logger";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const incident = await prisma.incident.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      
      include: {
        service: {
          include: {
            logs: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!incident) {
      logger.warn({
        event: "INCIDENT_NOT_FOUND",
        incidentId: id,
      });
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    logger.info({
      event: "INCIDENT_FETCHED",
      incidentId: incident.id,
    });

    return NextResponse.json(incident);
  } catch (error) {
    logger.error({
      event: "INCIDENT_FETCH_FAILED",
      error,
    });

    return NextResponse.json(
      { error: "Failed to fetch incident" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (
      !session?.user?.role ||
      !canManageIncidents(session.user.role)
    ) {
      logger.warn({
        event: "INCIDENT_UPDATE_UNAUTHORIZED",
        userId: session?.user?.id,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = await params;
    const body = await req.json();
    const oldIncident =
      await prisma.incident.findFirst({
        where: {
          id,
          deletedAt: null,
          organizationId: session!.user.organizationId,
        },

        include: {
          service: true,
        },
      });

    if (!oldIncident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }
    if (oldIncident.status !== body.status) {
      await prisma.timelineEvent.create({
        data: {
          incidentId: id,
          type: "STATUS_CHANGED",
          message: `Status changed from ${oldIncident.status} to ${body.status}`,
        },
      });

      logger.info({
        event: "INCIDENT_STATUS_CHANGED",
        incidentId: id,
        from: oldIncident.status,
        to: body.status,
      });

      await prisma.notification.create({
        data: {
          title: "Status Changed",
          message: `${oldIncident.title}: ${oldIncident.status} → ${body.status}`,
          organizationId: session.user.organizationId,
        },
      });
    }

    if (
      oldIncident.status !== "RESOLVED" &&
      body.status === "RESOLVED"
    ) {
      await prisma.timelineEvent.create({
        data: {
          incidentId: id,
          type: "RESOLVED",
          message: "Incident resolved",
        },
      });

      await prisma.notification.create({
        data: {
          title: "Incident Resolved",
          message: `${oldIncident.title} has been resolved.`,
          organizationId: session.user.organizationId,
        },
      });
    }

    if (oldIncident.severity !== body.severity) {
      await prisma.timelineEvent.create({
        data: {
          incidentId: id,
          type: "SEVERITY_CHANGED",
          message: `Severity changed from ${oldIncident.severity} to ${body.severity}`,
        },
      });

      logger.info({
        event: "INCIDENT_SEVERITY_CHANGED",
        incidentId: id,
        from: oldIncident.severity,
        to: body.severity,
      });

      await prisma.notification.create({
        data: {
          title: "Severity Updated",
          message: `${oldIncident.title}: ${oldIncident.severity} → ${body.severity}`,
          organizationId: session.user.organizationId,
        },
      });
    }
    const incident = await prisma.incident.update({
      where: {
        id,
      },
      data: {
        title: body.title,
        description: body.description,
        severity: body.severity,
        status: body.status,
        serviceId: body.serviceId || null,
      },
      include: {
        service: true,
      },
    });

    logger.info({
      event: "INCIDENT_UPDATED",
      incidentId: incident.id,
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
    });

    if (oldIncident.serviceId !== body.serviceId) {
      await prisma.timelineEvent.create({
        data: {
          incidentId: id,
          type: "SERVICE_CHANGED",
          message: body.serviceId
            ? `Assigned to ${incident.service?.name}`
            : "Service unassigned",
        },
      });

      logger.info({
        event: "INCIDENT_SERVICE_CHANGED",
        incidentId: id,
        serviceId: body.serviceId,
      });

      await prisma.notification.create({
        data: {
          title: "Service Assignment Changed",
          message: body.serviceId
            ? `Assigned to ${incident.service?.name}`
            : "Service unassigned",
          organizationId: session.user.organizationId,
        },
      });
    }

    await createAuditLog({
      action: "UPDATE",

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
      type: "INCIDENT_UPDATED",
      incident,
    });

    return NextResponse.json(incident);
  } catch (error) {
    logger.error({
      event: "INCIDENT_UPDATE_FAILED",
      error,
    });

    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      logger.warn({
        event: "INCIDENT_DELETE_UNAUTHORIZED",
        userId: session?.user?.id,
      });

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const incident = await prisma.incident.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    await prisma.incident.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    logger.info({
      event: "INCIDENT_DELETED",
      incidentId: incident.id,
      deletedBy: session.user.id,
    });

    await createAuditLog({
      action: "DELETE",

      entityType: "INCIDENT",

      entityId: incident.id,

      userId: session.user.id,

      organizationId: session.user.organizationId,

      metadata: {
        title: incident.title,
        severity: incident.severity,
        status: incident.status,
      },
    });

    publish({
      type: "INCIDENT_DELETED",
      id: incident.id,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    logger.error({
      event: "INCIDENT_DELETE_FAILED",
      error,
    });

    return NextResponse.json(
      { error: "Failed to delete incident" },
      { status: 500 }
    );

  }
}