"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
];

export default function IncidentStatusChart() {
  const [stats, setStats] = useState({
    open: 0,
    investigating: 0,
    resolved: 0,
  });

  useEffect(() => {
    async function fetchIncidents() {
      const res = await fetch("/api/incidents");

      const incidents = await res.json();

      setStats({
        open: incidents.filter(
          (i: any) => i.status === "OPEN"
        ).length,

        investigating: incidents.filter(
          (i: any) => i.status === "INVESTIGATING"
        ).length,

        resolved: incidents.filter(
          (i: any) => i.status === "RESOLVED"
        ).length,
      });
    }

    fetchIncidents();
    const interval = setInterval(
      fetchIncidents,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  const data = [
    {
      name: "Open",
      value: stats.open,
    },
    {
      name: "Investigating",
      value: stats.investigating,
    },
    {
      name: "Resolved",
      value: stats.resolved,
    },
  ];

  const total =
    stats.open +
    stats.investigating +
    stats.resolved;

  return (
    <div
      className="
        bg-white dark:bg-emerald-950
        border border-gray-300
        rounded-2xl
        p-6 mt-6
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
      "
    >
    <h2 className="text-green-900 dark:text-green-400 text-xl uppercase font-semibold mb-8">
      Incident Status
    </h2>

    {[
      {
        label: "Open",
        value: stats.open,
        color: "bg-red-500",
      },
      {
        label: "Investigating",
        value: stats.investigating,
        color: "bg-amber-500",
      },
      {
        label: "Resolved",
        value: stats.resolved,
        color: "bg-green-500",
      },
    ].map((item) => {
      const total =
        stats.open +
        stats.investigating +
        stats.resolved;

      const width =
        total === 0
          ? 0
          : (item.value / total) * 100;

      return (
        <div key={item.label} className="mb-8">
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${item.color}`}
              />

              <span className="text-gray-700 dark:text-slate-300 font-medium">
                {item.label}
              </span>
            </div>

            <span className="font-bold text-green-900 dark:text-green-400">
              {item.value}
            </span>
          </div>

          <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`${item.color} h-full rounded-full transition-all duration-700`}
              style={{
                width: `${width}%`,
              }}
            />
          </div>
        </div>
      );
    })}
  </div>
);
}