import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const log = await prisma.log.findFirst({
    where: {
      id,
      service: {
        organizationId: session.user.organizationId,
      },
    },
    include: {
      service: true,
    },
  });
  if (!log) {
    return NextResponse.json(
      { error: "Log not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(log);
}