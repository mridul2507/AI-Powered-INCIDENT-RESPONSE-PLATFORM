import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import {canManageApiKeys,} from "@/lib/roles";
import {generateApiKey,  hashApiKey,} from "@/lib/apiKeys";

export async function POST(req:Request) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      !canManageApiKeys(currentUser.role)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const rawKey = generateApiKey();

    const hashedKey = hashApiKey(rawKey);

    await prisma.apiKey.create({
      data: {
        name: body.name?.trim() ||  `API Key ${new Date().toLocaleString()}`,
        hashedKey,
        organizationId:
          currentUser.organizationId,
      },
    });

    return NextResponse.json({
      apiKey: rawKey,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create API key",
      },
      {
        status: 500,
      }
    );
  }
}