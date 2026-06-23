import { getAI } from "@/lib/gemini";
import { NextResponse } from "next/server";
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

Analyze these analytics metrics.

${JSON.stringify(body.metrics)}

Return markdown:

## Incident Trends

Describe patterns.

## Reliability Analysis

Explain MTTR and availability.

## Risks

Potential issues.

## Recommendations

- Recommendation 1
- Recommendation 2
- Recommendation 3

Keep concise.

`,
      });

    return NextResponse.json({
      insights:
        response.text ||
        "No insights generated.",
    });

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Failed to generate insights",
      },
      {
        status: 500,
      }
    );

  }

}