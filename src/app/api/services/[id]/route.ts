import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  return NextResponse.json(service);
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  return NextResponse.json(service);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.service.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
  });
}