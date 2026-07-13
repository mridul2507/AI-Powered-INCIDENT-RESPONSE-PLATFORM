import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const body = await req.json();

  if (!body.name || !body.password || !body.organization) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    
    const baseSlug = body.organization.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    
    const organization = await prisma.organization.create({
      data: {
        name: body.organization,
        slug: uniqueSlug,
      },
    });

    await prisma.user.create({
      data: {
        email: session.user.email!,
        name: body.name,
        password: hashedPassword,
        role: body.role || "ENGINEER",
        organizationId: organization.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
    
  } catch (error) {
    console.error("GOOGLE REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Registration failed. The organization name might already exist." },
      { status: 500 }
    );
  }
}