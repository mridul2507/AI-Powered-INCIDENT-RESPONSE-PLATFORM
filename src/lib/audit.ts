import { prisma } from "@/lib/prisma";

export async function createAuditLog(
  action: string,
  entityType: string,
  entityId: string
) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
      },
    });

  } catch (error) {
    console.error("AUDIT ERROR:", error);
  }
}