import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: any }) => {

  const session = req.auth;

  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/signup") ||
    pathname.startsWith("/api/ingest")
  ) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();

});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico).*)",
  ],
};