import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ cpu: 0, memory: 0 })

    const latest = await prisma.metric.findFirst({
      where: { organizationId: session.user.organizationId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      cpu: latest?.cpuUsage ?? 0,
      memory: latest?.memoryUsage ?? 0,
    })
  } catch (error) {
    return NextResponse.json({ cpu: 0, memory: 0 })
  }
}