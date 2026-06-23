import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canUseAI } from "@/lib/roles";
import { aiQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (
      !session?.user?.role ||
      !canUseAI(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    await aiQueue.add(
      "analyze-incident",
      {
        id: body.id,
        title: body.title,
        description: body.description,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Analysis queued",
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