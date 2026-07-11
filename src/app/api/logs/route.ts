import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { publish } from "@/lib/events";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const logs = await prisma.log.findMany({
      where: {
        service: {
          organizationId: currentUser.organizationId,
        },
      },
      select: {
        id: true,
        timestamp: true,
        level: true,
        message: true,

        service: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
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

    if (service.organizationId !==  currentUser.organizationId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const log = await prisma.log.create({
      data: {
        level: body.level,
        message: body.message,
        serviceId: body.serviceId,
      },
    });

    publish({
      type: "LOG_CREATED",
      log,
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create log",
      },
      {
        status: 500,
      }
    );
  }
}