import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const notification = await prisma.notification.update({
    where: {
      id,
    },

    data: {
      isRead: true,
    },
  });

  return NextResponse.json(notification);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.notification.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}