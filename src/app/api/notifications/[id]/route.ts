import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publish } from "@/lib/events";

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

  publish({
    type: "NOTIFICATION_UPDATED",
    notification,
  });

  return NextResponse.json(notification);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
  const { id } = await params;

  await prisma.notification.delete({
    where: {
      id,
    },
  });

  publish({
    type: "NOTIFICATION_DELETED",
    id,
  });

  return NextResponse.json({
    success: true,
  });
}