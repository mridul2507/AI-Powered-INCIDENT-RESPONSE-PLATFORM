import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const analysis = response.text || "No analysis generated.";

    if (body.id) {
      try {
        await prisma.incident.update({
          where: {
            id: body.id,
          },
          data: {
            aiLogAnalysis: analysis,
          },
        });
      } 
      catch {}
    }

    return NextResponse.json({
      analysis,
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