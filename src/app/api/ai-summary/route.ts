import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
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

    const summary =
      response.text || "No summary generated.";

    await prisma.incident.update({
      where: {
        id: body.id,
      },
      data: {
        aiIncidentSummary: summary,
      },
    });

    return NextResponse.json({
      summary,
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