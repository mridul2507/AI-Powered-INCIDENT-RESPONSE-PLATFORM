import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function requireOrganization() {

  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session.user.organizationId;

}

export async function requireAdmin() {

  const session = await auth();

  if (
    !session ||
    session.user.role !== "ADMIN"
  ) {
    throw new Error("Forbidden");
  }

  return session;

}

export async function requireEngineer() {

  const session = await auth();

  if (
    !session ||
    (
      session.user.role !== "ADMIN" &&
      session.user.role !== "ENGINEER"
    )
  ) {
    throw new Error("Forbidden");
  }

  return session;

}

export async function requireViewer() {

  const session = await auth();

  if (!session) {
    throw new Error("Forbidden");
  }

  return session;

}

export async function getOrganizationBySlug(
  slug: string
) {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  });
}

export async function getOrganization(
  id: string
) {
  return prisma.organization.findUnique({
    where: {
      id,
    },
  });
}