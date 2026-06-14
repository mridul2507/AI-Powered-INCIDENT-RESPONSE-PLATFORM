import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
Summarize this incident for executives.

Title:
${body.title}

Description:
${body.description}

Severity:
${body.severity}

Status:
${body.status}

Return:

## Summary

One concise paragraph.

## Business Impact

One concise paragraph.

## Recommended Next Steps

3 bullet points.

Keep everything concise.
`,
      });

    return NextResponse.json({
      summary:
        response.text,
    });

  } catch (error) {

    return NextResponse.json(
      {
        error:
          "Failed to generate summary",
      },
      {
        status: 500,
      }
    );
  }
}