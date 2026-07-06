import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publish } from "@/lib/events";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notifications =
      await prisma.notification.findMany({
        where: {
          organizationId: currentUser.organizationId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(notifications);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const notification =
      await prisma.notification.create({
        data: {
          title: body.title,
          message: body.message,
          organizationId: currentUser.organizationId,
        },
      });

    publish({
      type: "NOTIFICATION_CREATED",
      notification,
    });

    return NextResponse.json(
      notification,
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}