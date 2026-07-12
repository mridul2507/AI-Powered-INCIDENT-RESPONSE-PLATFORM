import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: {
      id: session.user.organizationId,
    },
  });

  return NextResponse.json(org);
}

export async function PUT(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const body = await req.json();

  const org = await prisma.organization.update({
    where: {
      id: session.user.organizationId,
    },
    data: body,
  });

  return NextResponse.json(org);
}