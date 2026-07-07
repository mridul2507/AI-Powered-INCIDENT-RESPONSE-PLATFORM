import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/apiKeys";
import { sendCriticalIncidentEmail } from "@/lib/sendEmail";
import { sendSlackAlert } from "@/lib/slack";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error: "Missing API Key",
        },
        {
          status: 401,
        }
      );
    }

    const apiKey = authHeader.replace(
      "Bearer ",
      ""
    );

    const validKey = await validateApiKey(apiKey);

    if (!validKey) {
      return NextResponse.json(
        {
          error: "Invalid API Key",
        },
        {
          status: 401,
        }
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
        {
          error: "Service not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      service.organizationId !==
      validKey.organizationId
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const log = await prisma.log.create({
      data: {
        level: body.level,
        message: body.message,
        serviceId: service.id,
      },
    });

    await prisma.notification.create({
      data: {
        title: `${log.level} Log`,
        message: `${log.level}: ${log.message}`,
        organizationId: validKey.organizationId,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "LOG_INGESTED",
        entityType: "Log",
        entityId: log.id,
        organizationId: validKey.organizationId,
      },
    });

    if (log.level === "ERROR") {
      try {
        await sendCriticalIncidentEmail(
          `Error Log - ${service.name}`,
          log.message
        );
      } catch (error) {
        console.error("Email failed:", error);
      }

      try {
        await sendSlackAlert(
          `Error Log - ${service.name}`,
          "WARNING",
          log.message
        );
      } catch (error) {
        console.error("Slack failed:", error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        log,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to ingest log",
      },
      {
        status: 500,
      }
    );
  }
}