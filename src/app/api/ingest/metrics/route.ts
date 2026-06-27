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

    const metric = await prisma.metric.create({
      data: {
        serviceId: service.id,
        organizationId: validKey.organizationId,

        cpuUsage: body.cpuUsage,
        memoryUsage: body.memoryUsage,
        diskUsage: body.diskUsage,
        responseTime: body.responseTime,
        requestsPerMin: body.requestsPerMin,
        errorRate: body.errorRate,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "METRIC_INGESTED",
        entityType: "Metric",
        entityId: metric.id,
      },
    });

    const unhealthy =
      (metric.cpuUsage ?? 0) > 90 ||
      (metric.memoryUsage ?? 0) > 95 ||
      (metric.diskUsage ?? 0) > 95 ||
      (metric.responseTime ?? 0) > 2000 ||
      (metric.errorRate ?? 0) > 5;

    if (unhealthy) {
      await prisma.notification.create({
        data: {
          title: "Critical Metrics",
          message: `${service.name} exceeded monitoring thresholds.`,
        },
      });

      try {
        await sendCriticalIncidentEmail(
          `Critical Metrics - ${service.name}`,
          `
          CPU: ${metric.cpuUsage}%
          Memory: ${metric.memoryUsage}%
          Disk: ${metric.diskUsage}%
          Response Time: ${metric.responseTime}ms
          Error Rate: ${metric.errorRate}%
          `
        );
      } catch (error) {
        console.error("Email failed:", error);
      }

      try {
        await sendSlackAlert(
          `Critical Metrics - ${service.name}`,
          "CRITICAL",
          `CPU ${metric.cpuUsage}% | Memory ${metric.memoryUsage}% | Disk ${metric.diskUsage}%`
        );
      } catch (error) {
        console.error("Slack failed:", error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        metric,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to ingest metric",
      },
      {
        status: 500,
      }
    );
  }
}