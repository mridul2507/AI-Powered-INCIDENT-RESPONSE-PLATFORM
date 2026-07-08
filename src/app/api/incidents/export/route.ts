import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canExport } from "@/lib/roles";

export async function GET() {
  try {
    const session = await auth();

  if (!session?.user?.role ||  !canExport(session.user.role)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }
    const incidents = await prisma.incident.findMany({
      where:{
        deletedAt: null,
        organizationId: session.user.organizationId,
      },
      include: {
        service: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to export incidents" },
      { status: 500 }
    );
  }
}