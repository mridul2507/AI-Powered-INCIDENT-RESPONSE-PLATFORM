import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { publish } from "@/lib/events";

export async function GET() {
  try {
    const notifications =
      await prisma.notification.findMany({
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
    const body = await req.json();

    const notification =
      await prisma.notification.create({
        data: {
          title: body.title,
          message: body.message,
        },
      });

    publish({
      type: "NOTIFICATION_CREATED",
      notification,
    });

    return NextResponse.json(notification, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}