import NextAuth from "next-auth";
import authConfig from "./auth.config";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(
  (
    req: NextRequest & {
      auth: Session | null;
    }
  ) => {
    const session = req.auth;
    const pathname = req.nextUrl.pathname;

    // 1. PUBLIC ROUTES (Notice /register-google is removed from here)
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/signup") ||
      pathname.startsWith("/api/ingest")
    ) {
      return NextResponse.next();
    }

    // 2. REQUIRE SESSION
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 3. HANDLE INCOMPLETE USERS (No Organization ID)
    if (!session.user.organizationId) {
      // If they came from the Signup page, let them access registration
      if (pathname.startsWith("/register-google")) {
        return NextResponse.next();
      }
      
      // If they came from the Login page (trying to reach /dashboard) or the root URL (/), 
      // reject them. They don't exist in the database yet.
      return NextResponse.redirect(new URL("/login?error=NoUserFound", req.url));
    }

    // 4. FULLY REGISTERED USERS
    // Prevent fully onboarded users from ever seeing the registration page again
    if (pathname.startsWith("/register-google")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }
);

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};