import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "STATUS_CHANGE";

type CreateAuditLogParams = {
  action: AuditAction;
  entityType: string;
  entityId: string;

  userId?: string;
  organizationId?: string;

  metadata?: Record<string, unknown>;
};

export async function createAuditLog({
  action,
  entityType,
  entityId,
  userId,
  organizationId,
  metadata,
}: CreateAuditLogParams) {
  return prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      userId,
      organizationId,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });
}