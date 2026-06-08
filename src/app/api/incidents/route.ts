import { auth } from "@/auth";
import { canManageIncidents } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const incidents = await prisma.incident.findMany({
    include: {
      service: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (
      !session?.user?.role ||
      !canManageIncidents(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const body = await req.json();

    const incident = await prisma.incident.create({
      data: {
        title: body.title,
        description: body.description,
        severity: body.severity,
        status: body.status,
        serviceId: body.serviceId || null,
        organizationId: body.organizationId,
      },
    });

    await createAuditLog(
      "CREATE",
      "INCIDENT",
      incident.id
      );

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}