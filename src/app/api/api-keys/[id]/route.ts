import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { canManageApiKeys } from "@/lib/roles";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      !canManageApiKeys(currentUser.role)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        organizationId: currentUser.organizationId,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API Key not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.apiKey.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete API Key",
      },
      {
        status: 500,
      }
    );
  }
}