import {
  Registry,
  collectDefaultMetrics,
  Gauge,
} from "prom-client";

export const register = new Registry();

collectDefaultMetrics({
  register,
});

export const totalServices = new Gauge({
  name: "ir_assist_total_services",
  help: "Total services",
  registers: [register],
});

export const healthyServices = new Gauge({
  name: "ir_assist_healthy_services",
  help: "Healthy services",
  registers: [register],
});

export const activeIncidents = new Gauge({
  name: "ir_assist_active_incidents",
  help: "Active incidents",
  registers: [register],
});

export const criticalAlerts = new Gauge({
  name: "ir_assist_critical_alerts",
  help: "Critical alerts",
  registers: [register],
});

export const warningAlerts = new Gauge({
  name: "ir_assist_warning_alerts",
  help: "Warning alerts",
  registers: [register],
});

export const infoAlerts = new Gauge({
  name: "ir_assist_info_alerts",
  help: "Info alerts",
  registers: [register],
});

export const resolvedIncidents = new Gauge({
  name: "ir_assist_resolved_incidents",
  help: "Resolved incidents",
  registers: [register],
});