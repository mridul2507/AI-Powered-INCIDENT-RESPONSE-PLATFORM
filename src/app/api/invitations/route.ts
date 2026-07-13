import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.email || !body.role) {
       return NextResponse.json({ error: "Missing email or role" }, { status: 400 });
    }

    const invite = await prisma.invitation.upsert({
      where: {
        email: body.email,
      },
      update: {
        role: body.role,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        accepted: false,
      },
      create: {
        email: body.email,
        role: body.role,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        organizationId: session.user.organizationId,
      },
    });

    return NextResponse.json(invite);
    
  } catch{
    return NextResponse.json(
      { error: "Failed to process invitation" }, 
      { status: 500 }
    );
  }
}