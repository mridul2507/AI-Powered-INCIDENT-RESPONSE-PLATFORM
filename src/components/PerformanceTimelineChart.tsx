"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Metric = {
  id: string;

  cpuUsage: number | null;
  memoryUsage: number | null;
  diskUsage: number | null;
  responseTime: number | null;

  createdAt: string;
};

export default function PerformanceTimelineChart({
  metrics,
}: {
  metrics: Metric[];
}) {
  const chartData = [...metrics]
    .reverse()
    .map((metric) => ({
      time: new Date(metric.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      cpu: metric.cpuUsage ?? 0,
      memory: metric.memoryUsage ?? 0,
      disk: metric.diskUsage ?? 0,
      latency: metric.responseTime ?? 0,
    }));

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <h2 className="text-2xl font-bold text-green-900 ">
        Performance Timeline
      </h2>

      <div className="h-[450px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="cpu"
              name="CPU Usage (%)"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="memory"
              name="Memory Usage (%)"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="disk"
              name="Disk Usage (%)"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="latency"
              name="Latency (ms)"
              stroke="#9333ea"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}