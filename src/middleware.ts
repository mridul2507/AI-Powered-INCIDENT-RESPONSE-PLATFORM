export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard",
    "/services",
    "/incidents",
    "/logs",
    "/analytics",
    "/settings",
  ],
};