import { ai } from "@/lib/gemini";
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

    const history = body.messages
        ?.map(
            (msg: {
            role: string;
            content: string;
            }) =>
            `${msg.role.toUpperCase()}:
        ${msg.content}`
        )
        .join("\n\n");

    let context = "";
    if (body.pathname === "/dashboard") {

    context = `
    Current page: Dashboard

    The user is viewing overall system health,
    metrics, incidents and analytics.
    `;

    }

    else if (body.pathname.startsWith("/incidents")) {

    context = `
    Current page: Incident Management

    The user is viewing incidents.

    Provide answers as an Incident Response expert.
    `;

    }

    else if (body.pathname.startsWith("/services")) {

    context = `
    Current page: Services

    The user is viewing services and dependencies.

    Act as an SRE engineer.
    `;

    }

    else if (body.pathname.startsWith("/analytics")) {

    context = `
    Current page: Analytics

    The user is analyzing trends and metrics.
    `;

    }

    else if (body.pathname.startsWith("/logs")) {

      context = `
      Current page: Log Details

      The user is investigating logs and failures.

      Act as an SRE and log analysis expert.
      `;

    }

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: `
            You are IR Assist Copilot.

            You are an expert SRE and Incident Response Assistant.

            ${context}

            Current Page Data:
            ${body.context}

            Conversation History:
            ${history}

            Answer the following question concisely.

            Question:

            ${body.message}`,
      });

    return NextResponse.json({
      reply:
        response.text || "No response generated.",
    });

  } catch {

    return NextResponse.json(
      {
        reply:
          "AI service unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}