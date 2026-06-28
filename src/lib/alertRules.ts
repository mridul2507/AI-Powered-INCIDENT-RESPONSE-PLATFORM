type MetricInput = {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  responseTime: number;
  errorRate: number;
};

export type AlertResult = {
  triggered: boolean;
  severity: "CRITICAL" | "WARNING" | null;
  title: string | null;
  description: string | null;
};

export function evaluateAlertRules(
  metric: MetricInput
): AlertResult {

    if (metric.cpuUsage >= 90) {
    return {
      triggered: true,
      severity: "CRITICAL",
      title: "High CPU Usage",
      description: `CPU usage reached ${metric.cpuUsage}%.`,
    };
  }

  if (metric.memoryUsage >= 90) {
    return {
      triggered: true,
      severity: "CRITICAL",
      title: "High Memory Usage",
      description: `Memory usage reached ${metric.memoryUsage}%.`,
    };
  }

  if (metric.diskUsage >= 95) {
    return {
      triggered: true,
      severity: "CRITICAL",
      title: "Disk Almost Full",
      description: `Disk usage reached ${metric.diskUsage}%.`,
    };
  }

  if (metric.responseTime >= 500) {
    return {
      triggered: true,
      severity: "CRITICAL",
      title: "High Response Time",
      description: `Response time reached ${metric.responseTime} ms.`,
    };
  }

  if (metric.errorRate >= 10) {
    return {
      triggered: true,
      severity: "CRITICAL",
      title: "High Error Rate",
      description: `Error rate reached ${metric.errorRate}%.`,
    };
  }

  if (metric.cpuUsage >= 80) {
    return {
      triggered: true,
      severity: "WARNING",
      title: "CPU Usage Warning",
      description: `CPU usage reached ${metric.cpuUsage}%.`,
    };
  }

  if (metric.memoryUsage >= 80) {
    return {
      triggered: true,
      severity: "WARNING",
      title: "Memory Usage Warning",
      description: `Memory usage reached ${metric.memoryUsage}%.`,
    };
  }

  if (metric.diskUsage >= 90) {
    return {
      triggered: true,
      severity: "WARNING",
      title: "Disk Usage Warning",
      description: `Disk usage reached ${metric.diskUsage}%.`,
    };
  }

  if (metric.responseTime >= 300) {
    return {
      triggered: true,
      severity: "WARNING",
      title: "Slow Response Time",
      description: `Response time reached ${metric.responseTime} ms.`,
    };
  }

  if (metric.errorRate >= 5) {
    return {
      triggered: true,
      severity: "WARNING",
      title: "Error Rate Warning",
      description: `Error rate reached ${metric.errorRate}%.`,
    };
  }

  return {
    triggered: false,
    severity: null,
    title: null,
    description: null,
  };
}