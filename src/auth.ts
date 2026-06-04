import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          credentials.email === "admin@test.com" &&
          credentials.password === "password123"
        ) {
          return {
            id: "1",
            name: "Mridul",
            email: "admin@test.com",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});