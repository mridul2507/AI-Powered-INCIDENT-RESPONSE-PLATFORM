import { auth } from "@/auth";
import { canManageServices } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { publish } from "@/lib/events";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      incidents: {
        orderBy: {
          createdAt: "desc",
        },

        take: 1,
      },
    },
  });

  return NextResponse.json(services);
}

export async function POST(req: Request) {
  try {
    const session = await auth();

      if (
        !session?.user?.role ||
        !canManageServices(session.user.role)
      ) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
    const body = await req.json();

    const service = await prisma.service.create({
      data: {
        name: body.name,
        status: body.status,
        organizationId: session.user.organizationId,
      },
    });

    await createAuditLog(
      "CREATE",
      "SERVICE",
      service.id
    );

    publish({
      type: "SERVICE_CREATED",
      service,
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}