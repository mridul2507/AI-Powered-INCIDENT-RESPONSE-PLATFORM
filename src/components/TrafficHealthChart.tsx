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

  requestsPerMin: number | null;
  errorRate: number | null;

  createdAt: string;
};

export default function TrafficHealthChart({
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

      requests: metric.requestsPerMin ?? 0,
      errors: metric.errorRate ?? 0,
    }));

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <h2 className="text-2xl font-bold text-green-900 mb-6">
        Traffic & Error Health
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
              dataKey="requests"
              name="Requests / Min"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="errors"
              name="Error Rate (%)"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}