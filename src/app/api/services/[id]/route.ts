import { auth } from "@/auth";
import { canManageServices } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

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

  return NextResponse.json(service);
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  await createAuditLog(
    "UPDATE",
    "SERVICE",
    service.id
  );

  return NextResponse.json(service);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const { id } = await params;

  await createAuditLog(
    "DELETE",
    "SERVICE",
    id
    );

  await prisma.service.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
  });
}