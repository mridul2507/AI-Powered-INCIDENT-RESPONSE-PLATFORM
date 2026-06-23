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
  Analyze this service.

  ${JSON.stringify(body.service)}

  Return markdown:

  ## Health Summary

  Overall service health.

  ## Risks

  Potential bottlenecks and reliability concerns.

  ## Recommendations

  - Recommendation 1
  - Recommendation 2
  - Recommendation 3

  Keep concise.
  `,
      });

    const insights =
      response.text || "No insights generated.";

    await prisma.service.update({
      where: {
        id: body.service.id,
      },
      data: {
        aiServiceInsights: insights,
      },
    });

    return NextResponse.json({
      insights,
    });
  }
  catch {
    return NextResponse.json(
      {
        error: "Failed to generate insights",
      },
      {
        status: 500,
      }
    );
  }

}