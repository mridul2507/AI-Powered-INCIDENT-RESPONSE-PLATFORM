import { auth } from "@/auth";
import { canManageIncidents } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const incident = await prisma.incident.findUnique({
      where: {
        id,
      },
    });

    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch incident" },
      { status: 500 }
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
      !canManageIncidents(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = await params;

    const body = await req.json();

    const incident = await prisma.incident.update({
      where: {
        id,
      },
      data: {
        title: body.title,
        description: body.description,
        severity: body.severity,
        status: body.status,
      },
    });

    await createAuditLog(
      "UPDATE",
      "INCIDENT",
      incident.id
    );

    return NextResponse.json(incident);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = await params;

    await prisma.incident.delete({
      where: {
        id,
      },
    });

    await createAuditLog(
      "DELETE",
      "INCIDENT",
      id
      );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete incident" },
      { status: 500 }
    );
  }
}