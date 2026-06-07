export function canManageServices(role: string) {
  return role === "ADMIN";
}

export function canManageIncidents(role: string) {
  return (
    role === "ADMIN" ||
    role === "ENGINEER"
  );
}

export function isAdmin(role: string) {
  return role === "ADMIN";
}