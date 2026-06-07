import { UserRole } from "@prisma/client";

export function canManageServices(role: UserRole) {
  return role === "ADMIN";
}

export function canManageIncidents(role: UserRole) {
  return role === "ADMIN" || role === "ENGINEER";
}

export function canView(role: UserRole) {
  return (
    role === "ADMIN" ||
    role === "ENGINEER" ||
    role === "VIEWER"
  );
}