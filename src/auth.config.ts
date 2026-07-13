import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  trustHost: true,

  callbacks: {
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.sub as string) || "";
        session.user.role = (token.role as string) || "VIEWER";
        session.user.organizationId = (token.organizationId as string) || "";
        session.user.organization = token.organization as any;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;