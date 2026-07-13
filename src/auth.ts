import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import authConfig from "./auth.config";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers, 
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logger.warn({ event: "LOGIN_FAILED", reason: "MISSING_CREDENTIALS" });
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { organization: true },
        });
        if (!user) {
          logger.warn({ event: "LOGIN_FAILED", reason: "USER_NOT_FOUND", email: credentials.email });
          return null;
        }
        const validPassword = await bcrypt.compare(credentials.password as string, user.password);
        if (!validPassword) {
          logger.warn({ event: "LOGIN_FAILED", reason: "INVALID_PASSWORD", email: user.email, userId: user.id });
          return null;
        }
        logger.info({ event: "LOGIN_SUCCESS", userId: user.id, email: user.email, role: user.role });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          organization: {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
          },
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" && user?.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            const invitation = await prisma.invitation.findUnique({
              where: { email: user.email },
            });

            if (invitation && !invitation.accepted && invitation.expiresAt > new Date()) {
              const randomPassword = await bcrypt.hash(randomUUID(), 10);
              await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || "Invited User",
                  password: randomPassword,
                  role: invitation.role,
                  organizationId: invitation.organizationId,
                },
              });
              await prisma.invitation.update({
                where: { email: user.email },
                data: { accepted: true },
              });
            }
          }
        }
        return true; 
      } catch (error) {
        logger.error({ event: "SIGNIN_CALLBACK_ERROR", error });
        return true;
      }
    },
    
    async jwt({ token, user }) {
      try {
        if (user?.email) {
          token.email = user.email;
          token.name = user.name;
        }
        const email = token.email as string;
        if (!email) return token;

        const dbUser = await prisma.user.findUnique({
          where: { email },
          include: { organization: true },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.organizationId = dbUser.organizationId;
          if (dbUser.organization) {
            token.organization = {
              id: dbUser.organization.id,
              name: dbUser.organization.name,
              slug: dbUser.organization.slug,
            };
          }
        }
        return token;
      } catch (error) {
        logger.error({ event: "JWT_CALLBACK_ERROR", error });
        return token;
      }
    },
  },
});