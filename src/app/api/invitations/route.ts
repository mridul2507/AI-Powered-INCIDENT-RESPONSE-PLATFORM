import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({}, { status: 401 });
  }

  const body = await req.json();

  const invite = await prisma.invitation.create({

    data: {

      email: body.email,

      role: body.role,

      token: randomUUID(),

      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),

      organizationId: session.user.organizationId,

    },

  });

  return NextResponse.json(invite);

}