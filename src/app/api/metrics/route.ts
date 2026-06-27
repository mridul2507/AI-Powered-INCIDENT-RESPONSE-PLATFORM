import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

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

    const where: any = {
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
        include: {
          service: true,
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
    console.error(error);

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