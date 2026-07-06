import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const session = await auth();

  if (!session) {

    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  }

  const incidents =
    await prisma.incident.findMany({

      where: {

        organizationId:
          session.user.organizationId,

        deletedAt: null,

      },

      select: {
        createdAt: true,
      },

    });

  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const counts =
    Array(7).fill(0);

  incidents.forEach((incident) => {

    const day =
      new Date(
        incident.createdAt
      ).getDay();

    counts[day]++;

  });

  return NextResponse.json(

    days.map(
      (day, index) => ({
        day,
        incidents: counts[index],
      })
    )

  );

}