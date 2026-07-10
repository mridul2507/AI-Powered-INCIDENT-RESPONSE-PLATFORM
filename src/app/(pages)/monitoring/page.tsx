"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

type Health = {
  status: string;
};

type Metrics = {
  services: number;
  incidents: number;
  logs: number;
  notifications: number;
  latency: number;
  uptime: {
    days: number;
    hours: number;
    minutes: number;
  };
};

type Latency = {
  latency: number;
};

type WorkerMetrics = {
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  delayed: number;
};

type QueueStatus = {
  status: string;
  queue: WorkerMetrics;
};

type Alerts = {
  healthy: boolean;
  alerts: string[];
};

export default function MonitoringPage() {
  const [database, setDatabase] = useState<Health>();
  const [redis, setRedis] = useState<Health>();
  const [worker, setWorker] = useState<QueueStatus>();
  const [ai, setAi] = useState<Health>();
  const [metrics, setMetrics] = useState<Metrics>();
  const [databaseLatency, setDatabaseLatency] = useState<Latency>();
  const [redisLatency, setRedisLatency] = useState<Latency>();
  const [workerMetrics, setWorkerMetrics] = useState<WorkerMetrics>();
  const [alerts, setAlerts] = useState<Alerts>();
  const [lastRefresh, setLastRefresh] = useState("");

  async function load() {
    try {
        const [healthDb,healthRedis,healthWorker,healthAi,monitoring,dbLatency,redisLatency,workerStats,alertData,
        ]: [Health,Health,QueueStatus,Health,Metrics,Latency,Latency,WorkerMetrics,Alerts
        ] = await Promise.all([
        fetch("/api/health").then((r) => r.json()),
        fetch("/api/health/redis").then((r) => r.json()),
        fetch("/api/health/worker").then((r) => r.json()),
        fetch("/api/health/ai").then((r) => r.json()),
        fetch("/api/monitoring/metrics").then((r) => r.json()),
        fetch("/api/monitoring/database").then((r) => r.json()),
        fetch("/api/monitoring/redis").then((r) => r.json()),
        fetch("/api/monitoring/worker").then((r) => r.json()),
        fetch("/api/monitoring/alerts").then((r) => r.json()),
        ]);

        setDatabase(healthDb);
        setRedis(healthRedis);
        setWorker(healthWorker);
        setAi(healthAi);

        setMetrics(monitoring);

        setDatabaseLatency(dbLatency);
        setRedisLatency(redisLatency);
        setWorkerMetrics(workerStats);

        setAlerts(alertData);

        setLastRefresh(new Date().toLocaleTimeString());

    } catch (error) {
        console.error(error);
    }
    }

  useEffect(() => {
    load();

    const interval = setInterval(load, 30000);

    return () => clearInterval(interval);
  }, []);

  const Card = ({title,value,healthy,}: {
    title: string;
    value?: string;
    healthy?: boolean;
  }) => (
    <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow border p-6">
      <h2 className="font-semibold mb-4">{title}</h2>

      <span
        className={`px-4 py-2 rounded-full font-semibold ${
            healthy === undefined
                ? "bg-blue-100 text-blue-700"
                : healthy
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
        }`}
      >
        {value ?? "--"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-emerald-950">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          IR Assist Monitoring
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            Last Updated: {lastRefresh}
        </p>

        <ThemeToggle />

      </div>

      <div className="grid grid-cols-4 gap-6">

        <Card
          title="Database"
          value={database?.status}
          healthy={database?.status === "healthy"}
        />

        <Card
          title="Redis"
          value={redis?.status}
          healthy={redis?.status === "healthy"}
        />

        <Card
          title="AI"
          value={ai?.status}
          healthy={ai?.status === "healthy"}
        />

        <Card
          title="Worker"
          value={worker?.status}
          healthy={worker?.status === "healthy"}
        />

      </div>

      <div className="mt-10 bg-white dark:bg-emerald-900 rounded-2xl border p-6">

        <h2 className="font-semibold mb-6">
          Queue
        </h2>

        <div className="grid grid-cols-4 gap-6">

            <div>
            <h3>Waiting</h3>
            <p>{worker?.queue?.waiting}</p>
            </div>

            <div>
            <h3>Active</h3>
            <p>{worker?.queue?.active}</p>
            </div>

            <div>
            <h3>Completed</h3>
            <p>{worker?.queue?.completed}</p>
            </div>

            <div>
            <h3>Failed</h3>
            <p>{worker?.queue?.failed}</p>
            </div>

        </div>

      </div>

      <div className="mt-8 grid grid-cols-5 gap-6">
        <Card
            title="Services"
            value={String(metrics?.services ?? "--")}
        />

        <Card
            title="Incidents"
            value={String(metrics?.incidents ?? "--")}
        />

        <Card
            title="Logs"
            value={String(metrics?.logs ?? "--")}
        />

        <Card
            title="Notifications"
            value={String(metrics?.notifications ?? "--")}
        />

        <Card
            title="Latency"
            value={
            metrics
                ? `${metrics.latency} ms`
                : "--"
            }
        />

        </div>

        <div className="grid grid-cols-4 gap-6 mt-8">

            <Card
                title="DB Latency"
                value={`${databaseLatency?.latency ?? "--"} ms`}
            />

            <Card
                title="Redis Latency"
                value={`${redisLatency?.latency ?? "--"} ms`}
            />

            <Card
                title="Worker Active Jobs"
                value={String(workerMetrics?.active ?? "--")}
            />

            <Card
                title="Uptime"
                value={
                    metrics
                    ? `${metrics.uptime.days}d ${metrics.uptime.hours}h ${metrics.uptime.minutes}m`
                    : "--"
                }
                />

        </div>

        <div className="mt-8 bg-white dark:bg-emerald-900 rounded-2xl border p-6">
            <h2 className="font-semibold mb-6">
                System Alerts
            </h2>

            {
                alerts?.healthy ? (
                <div className="text-green-600 font-semibold">
                    ✅ No active alerts
                </div>
                ) : (
                <ul className="space-y-3">
                    {alerts?.alerts?.map((alert: string) => (
                    <li
                        key={alert}
                        className="text-red-600 font-semibold"
                    >
                        ⚠ {alert}
                    </li>
                    ))}
                </ul>
                )
            }

            </div>

        <div className="mt-8 bg-white dark:bg-emerald-900 rounded-2xl border p-6">
            <h2 className="font-semibold mb-6">
                Worker Statistics
            </h2>

            <div className="grid grid-cols-4 gap-6">

                <div>
                <h3 className="font-medium">Waiting</h3>
                <p>{workerMetrics?.waiting ?? 0}</p>
                </div>

                <div>
                <h3 className="font-medium">Completed</h3>
                <p>{workerMetrics?.completed ?? 0}</p>
                </div>

                <div>
                <h3 className="font-medium">Failed</h3>
                <p>{workerMetrics?.failed ?? 0}</p>
                </div>

                <div>
                <h3 className="font-medium">Delayed</h3>
                <p>{workerMetrics?.delayed ?? 0}</p>
                </div>

            </div>

            </div>

    </div>
  );
}