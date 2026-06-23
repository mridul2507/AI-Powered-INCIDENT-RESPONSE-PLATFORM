import { getAI } from "@/lib/gemini";
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
    const ai = getAI();

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
Service:

${body.serviceName}

Incident:

${body.incidentTitle}

Explain:

## Affected Components

Which systems may be affected?

## User Impact

How would users experience this issue?

## Failure Propagation

How could the issue spread?

## Recommendations

Three recommendations.

Keep concise.
`,
      });

    const explanation = response.text || "No explanation generated.";

    await prisma.incident.update({
      where: {
        id: body.id,
      },
      data: {
        aiDependencyAnalysis: explanation,
      },
    });

    return NextResponse.json({
      explanation,
    });

  } catch {

    return NextResponse.json({
      explanation: `
## AI Service Unavailable

Dependency analysis unavailable.
`,
    });

  }
}