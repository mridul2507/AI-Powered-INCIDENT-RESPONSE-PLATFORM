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
      { error: "Service not found" },
      { status: 404 }
    );
  }

  logger.info({
    event: "SERVICE_FETCHED",
    serviceId: service.id,
    name: service.name,
  });

  return NextResponse.json(service);
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  try{
    if (
      !session?.user?.role ||
      !canManageServices(session.user.role)
    ) {
      logger.warn({
        event: "SERVICE_UPDATE_UNAUTHORIZED",
        userId: session?.user?.id,
      });

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = await params;

    const body = await req.json();

    const service = await prisma.service.update({
      where: { id },
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

    await createAuditLog(
      "UPDATE",
      "SERVICE",
      service.id
    );

    publish({
      type: "SERVICE_UPDATED",
      service,
    });

    return NextResponse.json(service);
  }
  catch (error) {
    logger.error({
      event: "SERVICE_UPDATE_FAILED",
      error,
    });

    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  try{
    if (
      !session?.user?.role ||
      !canManageServices(session.user.role)
    ) {
      logger.warn({
        event: "SERVICE_DELETE_UNAUTHORIZED",
        userId: session?.user?.id,
      });

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = await params;

    await createAuditLog(
      "DELETE",
      "SERVICE",
      id
    );

    publish({
      type: "SERVICE_DELETED",
      id,
    });

    logger.info({
      event: "SERVICE_DELETED",
      serviceId: id,
    });

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  }

  catch (error) {
    logger.error({
      event: "SERVICE_DELETE_FAILED",
      error,
    });

    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}