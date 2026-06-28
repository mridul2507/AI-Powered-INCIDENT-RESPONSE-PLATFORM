import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const incidents =
    await prisma.incident.findMany({
      where:{
        deletedAt:null,
      },
      select: {
        createdAt: true,
      },
    });

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const counts = Array(7).fill(0);

  incidents.forEach((incident) => {

    const day =
      new Date(incident.createdAt).getDay();

    counts[day]++;

  });

  const data =
    days.map((day,index)=>({
      day,
      incidents: counts[index],
    }));

  return NextResponse.json(data);

}