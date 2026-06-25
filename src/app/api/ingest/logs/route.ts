import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/apiKeys";

export async function POST(req: Request) {
  try {
    // Read Authorization header
    const authHeader = req.headers.get("authorization");

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error: "Missing API Key",
        },
        {
          status: 401,
        }
      );
    }

    // Extract API key
    const apiKey = authHeader.replace(
      "Bearer ",
      ""
    );

    // Validate API key
    const validKey = await validateApiKey(apiKey);

    if (!validKey) {
      return NextResponse.json(
        {
          error: "Invalid API Key",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: {
        id: body.serviceId,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          error: "Service not found",
        },
        {
          status: 404,
        }
      );
    }

    // Ensure the API key belongs to the same organization
    if (
      service.organizationId !==
      validKey.organizationId
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // Create log
    const log = await prisma.log.create({
      data: {
        level: body.level,
        message: body.message,
        serviceId: service.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        log,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to ingest log",
      },
      {
        status: 500,
      }
    );
  }
}