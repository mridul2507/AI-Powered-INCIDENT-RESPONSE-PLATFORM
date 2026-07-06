import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { publish } from "@/lib/events";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const notification =
      await prisma.notification.findFirst({
        where: {
          id,
          organizationId:
            currentUser.organizationId,
        },
      });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const updated =
      await prisma.notification.update({
        where: {
          id,
        },
        data: {
          isRead: true,
        },
      });

    publish({
      type: "NOTIFICATION_UPDATED",
      notification: updated,
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const notification =
      await prisma.notification.findFirst({
        where: {
          id,
          organizationId:
            currentUser.organizationId,
        },
      });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

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

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}