import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/apiKeys";
import { sendCriticalIncidentEmail } from "@/lib/sendEmail";
import { sendSlackAlert } from "@/lib/slack";
import { evaluateAlertRules } from "@/lib/alertRules";

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

    const alert = evaluateAlertRules({
      cpuUsage: metric.cpuUsage ?? 0,
      memoryUsage: metric.memoryUsage ?? 0,
      diskUsage: metric.diskUsage ?? 0,
      responseTime: metric.responseTime ?? 0,
      errorRate: metric.errorRate ?? 0,
    });
    
    if (!alert.triggered) {
      const activeIncidents = await prisma.incident.findMany({
          where: {
            organizationId: validKey.organizationId,
            deletedAt:null,

            serviceId: service.id,

            status: {
              in: ["OPEN", "INVESTIGATING"],
            },
          },
        });

      for (const incident of activeIncidents) {
        await prisma.incident.update({
          where: {
            id: incident.id,
          },

          data: {
            status: "RESOLVED",

            timelineEvents: {
              create: {
                type: "RESOLVED",
                message:
                  "Automatically resolved because metrics returned to healthy values.",
              },
            },
          },
        });

        await prisma.notification.create({
          data: {
            title: "Incident Auto Resolved",
            message: `${incident.title} has returned to a healthy state.`,
          },
        });

        await prisma.auditLog.create({
          data: {
            action: "AUTO_INCIDENT_RESOLVED",
            entityType: "Incident",
            entityId: incident.id,
          },
        });
      }
    }

    if(alert.triggered){
      const existingIncident = await prisma.incident.findFirst({
          where: {
            organizationId: validKey.organizationId,
            deletedAt:null,

            serviceId: service.id,

            title: alert.title!,

            status: {
              in: ["OPEN", "INVESTIGATING"],
            },
          },
        });

        if(!existingIncident){
          const incident = await prisma.incident.create({
          data: {
            title: alert.title!,
            description: alert.description!,
            severity: alert.severity!,
            status: "OPEN",

            organizationId:
              validKey.organizationId,

            serviceId: service.id,

            timelineEvents: {
              create: {
                type: "CREATED",
                message:
                  "Automatically created from alert rules.",
              },
            },
          },
        });

        await prisma.auditLog.create({
          data: {
            action: "AUTO_INCIDENT_CREATED",
            entityType: "Incident",
            entityId: incident.id,
          },
        });

        await prisma.notification.create({
          data: {
            title: `${alert.severity} Metrics`,
            message: `${alert.title}: ${alert.description}`,
          },
        });

        try {
          await sendCriticalIncidentEmail(
            `${alert.severity} Metrics - ${service.name}`,
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
            `${alert.severity} Metrics - ${service.name}`,
            alert.severity!,
            `CPU ${metric.cpuUsage}% | Memory ${metric.memoryUsage}% | Disk ${metric.diskUsage}%`
          );
        } catch (error) {
          console.error("Slack failed:", error);
        }
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