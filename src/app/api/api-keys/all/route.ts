import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      !isAdmin(currentUser.role)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const keys = await prisma.apiKey.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });

    return NextResponse.json(keys);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch API Keys",
      },
      {
        status: 500,
      }
    );
  }
}