import { sendCriticalIncidentEmail } from "@/lib/sendEmail";
import { sendSlackAlert } from "@/lib/slack";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/apiKeys";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        { error: "Missing API Key" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace(
      "Bearer ",
      ""
    );

    const validKey = await validateApiKey(apiKey);

    if (!validKey) {
      return NextResponse.json(
        { error: "Invalid API Key" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const service = await prisma.service.findUnique({
      where: {
        id: body.serviceId,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    
    if (
      service.organizationId !==
      validKey.organizationId
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const incident = await prisma.incident.create({
      data: {
        title: body.title,
        description: body.description,
        severity: body.severity,
        status: body.status,
        serviceId: service.id,
        organizationId:
          validKey.organizationId,

        timelineEvents: {
          create: {
            type: "CREATED",
            message: "Incident created via API",
          },
        },
      },

      include: {
        service: true,
      },
    });

    await prisma.notification.create({
      data: {
        title: "External Incident",
        message: `${incident.title} received via API.`,
        organizationId: validKey.organizationId,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "INCIDENT_CREATED",
        entityType: "Incident",
        entityId: incident.id,
        organizationId: validKey.organizationId,
      },
    });

    if (incident.severity === "CRITICAL") {
      try {
        await sendCriticalIncidentEmail(
          incident.title,
          incident.description ?? ""
        );
      } catch (error) {
        console.error("Email failed:", error);
      }

      try {
        await sendSlackAlert(
          incident.title,
          incident.severity,
          incident.description ?? ""
        );
      } catch (error) {
        console.error("Slack failed:", error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        incident,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to ingest incident",
      },
      {
        status: 500,
      }
    );
  }
}