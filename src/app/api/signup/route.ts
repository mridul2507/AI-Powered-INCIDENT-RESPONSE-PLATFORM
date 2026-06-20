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

    // Check existing user
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

    // Create organization
    const organization =
      await prisma.organization.create({
        data: {
          name: organizationName,
        },
      });

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create first admin user
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

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Signup failed",
      },
      {
        status: 500,
      }
    );

  }
}