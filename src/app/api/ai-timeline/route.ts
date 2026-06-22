import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { canUseAI } from "@/lib/roles";

export async function POST(req: Request) {
  try {

    const session = await auth();
    
    if (!session?.user?.role ||!canUseAI(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
These are incident timeline events:

${JSON.stringify(body.timeline)}

Explain:

## Event Sequence

How did the incident evolve?

## Escalation

How did the situation worsen?

## Resolution

How was it resolved?

Keep concise.
`,
      });

    const insights =
      response.text || "No insights generated.";

    await prisma.incident.update({
      where: {
        id: body.id,
      },
      data: {
        aiTimelineInsights: insights,
      },
    });

return NextResponse.json({
  insights,
});

  } catch {

    return NextResponse.json({
      insights: `
## AI Service Unavailable

Timeline insights could not be generated.
`,
    });

  }
}