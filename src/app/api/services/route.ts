import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const body = await req.json();

    const service = await prisma.service.create({
      data: {
        name: body.name,
        status: body.status,
        organizationId: body.organizationId,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}