import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
        if (!credentials.email || !credentials.password) return null;

        const user =await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) return null;

        const validPassword =
          await bcrypt.compare(
            credentials.password as string,
            user.password
          );

        if (!validPassword)
          return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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
        token.role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role as string;

      return session;
    },
  },
});