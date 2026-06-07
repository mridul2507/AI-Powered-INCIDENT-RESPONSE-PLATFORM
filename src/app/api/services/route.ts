import { auth } from "@/auth";
import { canManageServices } from "@/lib/rbac";import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "desc",
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
        organizationId: body.organizationId,
      },
    });

    await createAuditLog(
      "CREATE",
      "SERVICE",
      service.id
    );

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}