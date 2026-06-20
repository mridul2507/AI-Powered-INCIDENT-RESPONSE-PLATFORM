import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function main() {
  const org =
    await prisma.organization.upsert({
      where: {
        id: "default-org",
      },

      update: {},

      create: {
        id: "default-org",
        name: "IR Assist",
      },
  });

  const hashedPassword = await bcrypt.hash("password123",10);

  await prisma.user.upsert({
    where: {
      email: "admin@test.com",
    },

    update: {},

    create: {
      email: "admin@test.com",
      name: "Mridul",
      password: hashedPassword,
      role: "ADMIN",
      organizationId: org.id,
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