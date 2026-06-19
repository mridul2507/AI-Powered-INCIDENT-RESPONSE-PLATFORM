import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

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