import { auth } from "@/auth";
import { canManageServices } from "@/lib/roles";
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

    const service = await prisma.service.findUnique({
      where: {
        id,
      },

      include: {
        incidents: true,
        logs: true,
      },
    });

    if (!service) {
      logger.warn({
        event: "SERVICE_NOT_FOUND",
        serviceId: id,
      });

      return NextResponse.json(
        {
          error: "Service not found",
        },
        {
          status: 404,
        }
      );
    }

    logger.info({
      event: "SERVICE_FETCHED",
      serviceId: service.id,
      name: service.name,
    });

    return NextResponse.json(service);

  } catch (error) {

    logger.error({
      event: "SERVICE_FETCH_FAILED",
      error,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch service",
      },
      {
        status: 500,
      }
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
      !canManageServices(session.user.role)
    ) {

      logger.warn({
        event: "SERVICE_UPDATE_UNAUTHORIZED",
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

    const { id } = await params;

    const body = await req.json();

    const oldService =
      await prisma.service.findUnique({
        where: {
          id,
        },
      });

    if (!oldService) {

      return NextResponse.json(
        {
          error: "Service not found",
        },
        {
          status: 404,
        }
      );

    }

    const service =
      await prisma.service.update({
        where: {
          id,
        },

        data: {
          name: body.name,
          status: body.status,
          description: body.description,
          responseTime: body.responseTime,
          availability: body.availability,
          requestsPerMin: body.requestsPerMin,
        },
      });

    logger.info({
      event: "SERVICE_UPDATED",
      serviceId: service.id,
      name: service.name,
      status: service.status,
    });

    await createAuditLog({
      action: "UPDATE",

      entityType: "SERVICE",

      entityId: service.id,

      userId: session.user.id,

      organizationId:
        session.user.organizationId,

      metadata: {
        previousName: oldService.name,
        newName: service.name,

        previousStatus: oldService.status,
        newStatus: service.status,
      },
    });

    publish({
      type: "SERVICE_UPDATED",
      service,
    });

    return NextResponse.json(service);

  } catch (error) {

    logger.error({
      event: "SERVICE_UPDATE_FAILED",
      error,
    });

    return NextResponse.json(
      {
        error: "Failed to update service",
      },
      {
        status: 500,
      }
    );

  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const session = await auth();

    if (
      !session?.user?.role ||
      !canManageServices(session.user.role)
    ) {

      logger.warn({
        event: "SERVICE_DELETE_UNAUTHORIZED",
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

    const { id } = await params;

    const service =
      await prisma.service.findUnique({
        where: {
          id,
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

    await prisma.service.delete({
      where: {
        id,
      },
    });

    logger.info({
      event: "SERVICE_DELETED",
      serviceId: service.id,
      name: service.name,
    });

    await createAuditLog({
      action: "DELETE",

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
      type: "SERVICE_DELETED",
      id: service.id,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    logger.error({
      event: "SERVICE_DELETE_FAILED",
      error,
    });

    return NextResponse.json(
      {
        error: "Failed to delete service",
      },
      {
        status: 500,
      }
    );

  }
}