import crypto from "crypto";
import { prisma } from "./prisma";

export function generateApiKey() {
  return (
    "ira_live_" +
    crypto.randomBytes(32).toString("hex")
  );
}

export function hashApiKey(key: string) {
  return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex");
}

export async function validateApiKey(
  key: string
) {
  const hashedKey = hashApiKey(key);

  const apiKey = await prisma.apiKey.findUnique({
    where: {
      hashedKey,
    },
  });

  if (!apiKey) return null;

  await prisma.apiKey.update({
    where: {
      id: apiKey.id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  return apiKey;
}