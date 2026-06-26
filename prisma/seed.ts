import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: {
      name: "IR Assist",
    },
    update: {},
    create: {
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

  const paymentService = await prisma.service.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: "Payment Service",
      },
    },
    update: {},
    create: {
      name: "Payment Service",
      status: "CRITICAL",
      organizationId: org.id,
      description: "Handles customer payments",
      availability: "99.1%",
      requestsPerMin: "2400",
      responseTime: "920ms",
    },
  });

  const databaseService = await prisma.service.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: "Database Cluster",
      },
    },
    update: {},
    create: {
      name: "Database Cluster",
      status: "WARNING",
      organizationId: org.id,
      description: "Primary PostgreSQL Cluster",
      availability: "99.9%",
      requestsPerMin: "1200",
      responseTime: "75ms",
    },
  });

  const gatewayService = await prisma.service.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: "API Gateway",
      },
    },
    update: {},
    create: {
      name: "API Gateway",
      status: "HEALTHY",
      organizationId: org.id,
      description: "Public API Gateway",
      availability: "100%",
      requestsPerMin: "5000",
      responseTime: "18ms",
    },
  });

  await prisma.incident.create({
    data: {
      title: "Payment Service Failure",
      severity: "CRITICAL",
      status: "OPEN",
      organizationId: org.id,
      serviceId: paymentService.id,
    },
  });

  await prisma.incident.create({
    data: {
      title: "Database Timeout",
      severity: "WARNING",
      status: "INVESTIGATING",
      organizationId: org.id,
      serviceId: databaseService.id,
    },
  });

  await prisma.incident.create({
    data: {
      title: "Cache Hit Rate Degraded",
      severity: "INFO",
      status: "RESOLVED",
      organizationId: org.id,
      serviceId: gatewayService.id,
    },
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());