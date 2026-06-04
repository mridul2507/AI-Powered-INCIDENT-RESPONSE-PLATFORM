import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.create({
    data: {
      name: "IR Assist",
    },
  });

  await prisma.incident.createMany({
    data: [
      {
        title: "Payment Service Failure",
        severity: "CRITICAL",
        status: "OPEN",
        organizationId: org.id,
      },
      {
        title: "Database Timeout",
        severity: "WARNING",
        status: "INVESTIGATING",
        organizationId: org.id,
      },
      {
        title: "Cache Hit Rate Degraded",
        severity: "INFO",
        status: "RESOLVED",
        organizationId: org.id,
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());