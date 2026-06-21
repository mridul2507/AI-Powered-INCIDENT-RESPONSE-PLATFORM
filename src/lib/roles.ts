export function isAdmin(role?: string) {
  return role === "ADMIN";
}

export function isEngineer(role?: string) {
  return role === "ENGINEER";
}

export function isViewer(role?: string) {
  return role === "VIEWER";
}

export function canManageServices(role?: string) {
  return isAdmin(role);
}

export function canManageIncidents(role?: string) {
  return isAdmin(role) || isEngineer(role);
}