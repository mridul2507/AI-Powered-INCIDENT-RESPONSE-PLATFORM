import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {canViewAuditLogs,} from "@/lib/roles";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (
      !session ||
      !canViewAuditLogs(session.user.role)
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");
    const search = searchParams.get("search") ?? "";
    const action = searchParams.get("action") ?? "ALL";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const skip = (page - 1) * limit;
    const where: Prisma.AuditLogWhereInput = {
      organizationId:
        session.user.organizationId,
    };

    if (action !== "ALL") {
      where.action = action;
    }

    if (search) {
      where.OR = [
        {
          entityType: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          entityId: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (from || to) {

      where.createdAt = {};

      if (from) {
        where.createdAt.gte =
          new Date(from);
      }

      if (to) {
        where.createdAt.lte =
          new Date(to);
      }

    }

    const [logs, total] =
      await Promise.all([

        prisma.auditLog.findMany({

          where,

          include: {

            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },

          },

          orderBy: {
            createdAt: "desc",
          },

          skip,

          take: limit,

        }),

        prisma.auditLog.count({
          where,
        }),

      ]);

    return NextResponse.json({
      logs,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    });

  } catch (error) {

    console.error(
      error instanceof Error
        ? error.message
        : error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch audit logs",
      },
      {
        status: 500,
      }
    );

  }
}