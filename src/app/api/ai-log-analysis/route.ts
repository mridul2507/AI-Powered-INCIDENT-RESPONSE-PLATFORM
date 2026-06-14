import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
Analyze these logs.

${JSON.stringify(body.logs)}

Identify:

1. Suspicious events

2. Root cause

3. Impact

4. Recommended actions

Keep the response concise.
`,
      });

    return NextResponse.json({
      analysis:
        response.text,
    });

  } catch (error) {

    return NextResponse.json(
      {
        error:
          "Analysis failed",
      },
      {
        status: 500,
      }
    );
  }
}