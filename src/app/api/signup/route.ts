import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      organizationName,
      name,
      email,
      password,
    } = body;

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const baseSlug = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    const organization =
      await prisma.organization.create({
        data: {
          name: organizationName,
          slug: uniqueSlug,
        },
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        organizationId: organization.id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error: unknown) {

  console.error("SIGNUP ERROR");
  console.error(error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : String(error),
    },
    {
      status: 500,
    }
  );

}
}