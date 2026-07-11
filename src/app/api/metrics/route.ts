import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const serviceId = searchParams.get("serviceId");
    const range = searchParams.get("range");

    const where: Prisma.MetricWhereInput = {
      organizationId: currentUser.organizationId,
    };

    if (serviceId && serviceId !== "all") {
      where.serviceId = serviceId;
    }

    if (range && range !== "all") {
      const now = new Date();
      const from = new Date(now);

      switch (range) {
        case "1h":
          from.setHours(now.getHours() - 1);
          break;

        case "24h":
          from.setDate(now.getDate() - 1);
          break;

        case "7d":
          from.setDate(now.getDate() - 7);
          break;

        case "30d":
          from.setDate(now.getDate() - 30);
          break;
      }

      where.createdAt = {
        gte: from,
      };
    }

    const [metrics, services] = await Promise.all([
      prisma.metric.findMany({
        where,
        select: {
          id: true,
          cpuUsage: true,
          memoryUsage: true,
          diskUsage: true,
          responseTime: true,
          requestsPerMin: true,
          errorRate: true,
          createdAt: true,

          service: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.service.findMany({
        where: {
          organizationId: currentUser.organizationId,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      metrics,
      services,
    });

  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
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

  const metric = await prisma.metric.create({
    data: {
      serviceId: service.id,
      organizationId: service.organizationId,

      cpuUsage: body.cpuUsage,
      memoryUsage: body.memoryUsage,
      diskUsage: body.diskUsage,
      responseTime: body.responseTime,
      requestsPerMin: body.requestsPerMin,
      errorRate: body.errorRate,
    },
  });

  return NextResponse.json(metric);
}