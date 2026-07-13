import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import authConfig from "./auth.config";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

type SessionUser = {
  role: string;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  providers: [
    ...authConfig.providers, 
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {

          logger.warn({
            event: "LOGIN_FAILED",
            reason: "MISSING_CREDENTIALS",
          });

          return null;
        }

        const user = await prisma.user.findUnique({

          where: {
            email: credentials.email as string,
          },

          include: {
            organization: true,
          },

        });

        if (!user) {

          logger.warn({
            event: "LOGIN_FAILED",
            reason: "USER_NOT_FOUND",
            email: credentials.email,
          });

          return null;
        }

        const validPassword = await bcrypt.compare(

          credentials.password as string,

          user.password,

        );

        if (!validPassword) {

          logger.warn({
            event: "LOGIN_FAILED",
            reason: "INVALID_PASSWORD",
            email: user.email,
            userId: user.id,
          });

          return null;
        }

        logger.info({
          event: "LOGIN_SUCCESS",
          userId: user.id,
          email: user.email,
          role: user.role,
        });

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
    // 1. Inherit the session callback we just moved to auth.config.ts
    ...authConfig.callbacks,

    // 2. Keep the signIn callback
    async signIn({ account }) {
      return true;
    },
    
    // 3. Keep your existing jwt callback with the Prisma logic
    async jwt({ token, user, account }) {
      if (user?.email) {
        token.email = user.email;
        token.name = user.name;
      }

      const email = token.email as string;

      if (!email) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          organization: true,
        },
      });

      if (dbUser) {
        token.role = dbUser.role;
        token.organizationId = dbUser.organizationId;
        token.organization = {
          id: dbUser.organization.id,
          name: dbUser.organization.name,
          slug: dbUser.organization.slug,
        };
      }

      return token;
    },
    
    // NOTE: Delete the async session() block from here, 
    // as it is now safely inherited from authConfig.callbacks!
  },

});