import { prisma } from "@/lib/prisma";

import {
  register,
  totalServices,
  healthyServices,
  activeIncidents,
  criticalAlerts,
  warningAlerts,
  infoAlerts,
  resolvedIncidents,
} from "@/lib/metrics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const [
    total,
    healthy,
    active,
    critical,
    warning,
    info,
    resolved,
  ] = await Promise.all([
    prisma.service.count(),

    prisma.service.count({
      where: {
        status: "HEALTHY",
      },
    }),

    prisma.incident.count({
      where: {
        deletedAt: null,
        status: {
          in: ["OPEN", "INVESTIGATING"],
        },
      },
    }),

    prisma.incident.count({
      where: {
        deletedAt: null,
        severity: "CRITICAL",
      },
    }),

    prisma.incident.count({
      where: {
        deletedAt: null,
        severity: "WARNING",
      },
    }),

    prisma.incident.count({
      where: {
        deletedAt: null,
        severity: "INFO",
      },
    }),

    prisma.incident.count({
      where: {
        deletedAt: null,
        status: "RESOLVED",
      },
    }),
  ]);

  totalServices.set(total);
  healthyServices.set(healthy);
  activeIncidents.set(active);
  criticalAlerts.set(critical);
  warningAlerts.set(warning);
  infoAlerts.set(info);
  resolvedIncidents.set(resolved);

  return new Response(await register.metrics(), {
    headers: {
      "Content-Type": register.contentType,
      "Cache-Control": "no-store",
    },
  });
}