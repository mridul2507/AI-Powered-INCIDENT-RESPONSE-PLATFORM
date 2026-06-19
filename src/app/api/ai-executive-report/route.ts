import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response =
      await ai.models.generateContent({

        model: "gemini-2.5-flash",
        contents: `
Generate an executive report for system analytics.

Metrics:

${JSON.stringify(body.metrics)}

Return markdown:

# Executive Summary

Brief overview.

# Key Findings

- Finding 1
- Finding 2
- Finding 3

# Risks

- Risk 1
- Risk 2

# Recommendations

- Recommendation 1
- Recommendation 2
- Recommendation 3

Keep concise.

`,
      });

    return NextResponse.json({
      report: response.text || "No report generated.",
    });

  }

  catch {
    return NextResponse.json(
      {
        error: "Failed to generate report",
      },
      {
        status: 500,
      }
    );

  }

}