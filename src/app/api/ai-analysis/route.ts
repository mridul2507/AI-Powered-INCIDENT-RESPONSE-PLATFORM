import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: `
    Analyze this incident.

    Title:
    ${body.title}

    Description:
    ${body.description}

    Return in markdown:

    ## Root Cause:
    ...

    ## Impact:
    ...

    ## Recommendations:
      ⦿ **Recommendation 1**
      ⦿ **Recommendation 2**
      ⦿ **Recommendation 3**
    Keep response concise.
    `,
    });

    const summary =
      response.text || "No analysis generated.";

    await prisma.incident.update({
      where: {
        id: body.id,
      },
      data: {
        aiRootCauseAnalysis: summary,
      },
    });

    return NextResponse.json({
      summary,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Analysis failed",
      },
      {
        status: 500,
      }
    );
  }
}