import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { publish } from "@/lib/events";

export async function GET() {
  const logs = await prisma.log.findMany({
    include: {
      service: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const log = await prisma.log.create({
      data: {
        level: body.level,
        message: body.message,
        serviceId: body.serviceId,
      },
    });

    publish({
      type: "LOG_CREATED",
      log,
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create log",
      },
      {
        status: 500,
      }
    );
  }
}