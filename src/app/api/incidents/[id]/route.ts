import { auth } from "@/auth";
import { canManageIncidents } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const incident = await prisma.incident.findUnique({
      where: {
        id,
      },
      include: {
        service: true,
      },
    });

    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error(error);

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = await params;
    const body = await req.json();
    const oldIncident = await prisma.incident.findUnique({
      where: {
        id,
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

      await prisma.notification.create({
        data: {
          title: "Status Changed",
          message: `${oldIncident.title}: ${oldIncident.status} → ${body.status}`,
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

      await prisma.notification.create({
        data: {
          title: "Severity Updated",
          message: `${oldIncident.title}: ${oldIncident.severity} → ${body.severity}`,
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

      await prisma.notification.create({
        data: {
          title: "Service Assignment Changed",
          message: body.serviceId
            ? `Assigned to ${incident.service?.name}`
            : "Service unassigned",
        },
      });
    }

    await createAuditLog(
      "UPDATE",
      "INCIDENT",
      incident.id
    );

    return NextResponse.json(incident);
  } catch (error) {
    console.error(error);

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = await params;

    await prisma.incident.delete({
      where: {
        id,
      },
    });

    await createAuditLog(
      "DELETE",
      "INCIDENT",
      id
      );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete incident" },
      { status: 500 }
    );
  }
}