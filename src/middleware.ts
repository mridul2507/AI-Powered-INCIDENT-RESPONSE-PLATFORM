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

    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/signup") ||
      pathname.startsWith("/api/ingest") ||
      pathname.startsWith("/not-invited")
    ) {
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!session.user.organizationId) {
      if (pathname.startsWith("/register-google")) {
        return NextResponse.next();
      }
      
      return NextResponse.redirect(new URL("/not-invited", req.url));
    }

    if (pathname.startsWith("/register-google")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }
);

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};