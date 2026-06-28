import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      where:{
        deletedAt: null,
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