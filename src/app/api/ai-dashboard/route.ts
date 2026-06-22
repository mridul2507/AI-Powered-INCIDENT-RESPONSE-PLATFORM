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

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
Analyze these metrics.

Total Services:
${body.totalServices}

Healthy Services:
${body.healthyServices}

Active Incidents:
${body.activeIncidents}

Resolved Incidents:
${body.resolvedIncidents}

Critical Alerts:
${body.criticalAlerts}

Warning Alerts:
${body.warningAlerts}

Info Alerts:
${body.infoAlerts}

Return:

## Overall Health

Brief overview.

## Risks

Potential concerns.

## Recommendations

Three recommendations.

Keep concise.
`,
      });

    return NextResponse.json({
      insights:
        response.text,
    });

  } catch {

    return NextResponse.json({
      insights: `
## AI Service Unavailable

Dashboard insights are currently unavailable.
`,
    });

  }
}