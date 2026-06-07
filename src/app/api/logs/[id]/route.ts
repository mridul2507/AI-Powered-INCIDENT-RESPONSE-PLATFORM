import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const log = await prisma.log.findUnique({
    where: {
      id,
    },
    include: {
      service: true,
    },
  });

  return NextResponse.json(log);
}