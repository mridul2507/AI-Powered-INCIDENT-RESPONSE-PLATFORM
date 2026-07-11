import { auth } from "@/auth";
import { canManageServices } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { publish } from "@/lib/events";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const services = await prisma.service.findMany({
      where: {
        organizationId:
          session.user.organizationId,
      },
      
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        status: true,
        availability: true,
        responseTime: true,
        requestsPerMin: true,
        createdAt: true,

        incidents: {
          take: 1,

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            severity: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    logger.info({
      event: "SERVICES_FETCHED",
      total: services.length,
    });

    return NextResponse.json(services);

  } catch (error) {

    logger.error({
      event: "SERVICES_FETCH_FAILED",
      error,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch services",
      },
      {
        status: 500,
      }
    );

  }
}

export async function POST(req: Request) {
  try {

    const session = await auth();

    if (
      !session?.user?.role ||
      !canManageServices(session.user.role)
    ) {

      logger.warn({
        event: "SERVICE_CREATE_UNAUTHORIZED",
        userId: session?.user?.id,
      });

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );

    }

    const body = await req.json();

    const service = await prisma.service.create({
      data: {
        name: body.name,
        status: body.status,
        organizationId:
          session.user.organizationId,
      },
    });

    logger.info({
      event: "SERVICE_CREATED",
      serviceId: service.id,
      name: service.name,
      status: service.status,
    });

    await createAuditLog({
      action: "CREATE",

      entityType: "SERVICE",

      entityId: service.id,

      userId: session.user.id,

      organizationId:
        session.user.organizationId,

      metadata: {
        name: service.name,
        status: service.status,
      },
    });

    publish({
      type: "SERVICE_CREATED",
      service,
    });

    return NextResponse.json(service);

  } catch (error) {

    logger.error({
      event: "SERVICE_CREATE_FAILED",
      error,
    });

    return NextResponse.json(
      {
        error: "Failed to create service",
      },
      {
        status: 500,
      }
    );

  }
}