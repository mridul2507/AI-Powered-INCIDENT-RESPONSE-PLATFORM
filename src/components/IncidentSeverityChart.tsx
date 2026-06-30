"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { useIncidentEventContext } from "@/context/IncidentEventsContext";

type ChartData = {
  severity: string;
  count: number;
};

const initialData: ChartData[] = [
  {
    severity: "Critical",
    count: 0,
  },
  {
    severity: "Warning",
    count: 0,
  },
  {
    severity: "Info",
    count: 0,
  },
];

export default function MetricsChart() {
  const [data, setData] = useState<ChartData[]>(initialData);
  const { lastEvent } = useIncidentEventContext();

  async function fetchStats() {
      const res = await fetch(
        "/api/dashboard/stats"
      );

      const stats = await res.json();

      setData([
        {
          severity: "Critical",
          count: stats.criticalAlerts,
        },
        {
          severity: "Warning",
          count: stats.warningAlerts,
        },
        {
          severity: "Info",
          count: stats.infoAlerts,
        },
      ]);
  }


  useEffect(() => {
    fetchStats();
    const interval = setInterval(
    fetchStats,
    10000
  );

  return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case "INCIDENT_CREATED":
        fetchStats();
        break;

      case "INCIDENT_UPDATED":
        fetchStats();
        break;

      case "INCIDENT_DELETED":
        fetchStats();
        break;

      default:
        break;
    }
  }, [lastEvent]);

  return (
    <div className="bg-white dark:bg-emerald-950 border border-gray-300 rounded-2xl p-6 mt-6
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      <h2 className="text-green-900 dark:text-green-400 text-xl uppercase font-semibold mb-6">
        Incident Severity Distribution
      </h2>   

      <div className="h-[300px] min-w-0 overflow-hidden">

        <ResponsiveContainer width="100%" height="100%" debounce={500}>

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="severity" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#ef4444"
              strokeWidth={3}
              dot={true}
              isAnimationActive={true}
              animationDuration={1000}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}