import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import { logger } from "./lib/logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          logger.warn({
            event: "LOGIN_FAILED",
            reason: "MISSING_CREDENTIALS",
          }); 

          return null;
        }

        const user =await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
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

        const validPassword =
          await bcrypt.compare(
            credentials.password as string,
            user.password
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
          organizationId: user.organizationId
        };
      }
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
      }

      if (!token.organizationId && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
          select: {
            organizationId: true,
          },
        });

        if (dbUser) token.organizationId = dbUser.organizationId;

      }

      return token;
    },

    async session({ session, token }) {
      session.user.role =
        token.role as string;

      session.user.organizationId =
        token.organizationId as string;

      return session;
    },
  },
});