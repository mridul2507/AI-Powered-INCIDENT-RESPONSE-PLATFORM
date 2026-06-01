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

const data = [
  {
    time: "1 PM",
    cpu: 40,
    memory: 20,
    error: 5,
  },
  {
    time: "2 PM",
    cpu: 55,
    memory: 35,
    error: 8,
  },
  {
    time: "3 PM",
    cpu: 80,
    memory: 60,
    error: 15,
  },
  {
    time: "4 PM",
    cpu: 65,
    memory: 45,
    error: 12,
  },
  {
    time: "5 PM",
    cpu: 90,
    memory: 98,
    error: 20,
  },
];

export default function MetricsChart() {
  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-8
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      <h2 className="text-green-900 text-xl uppercase font-semibold mb-6">
        System Overview
      </h2>

      <div className="flex items-center gap-8 mb-8">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">CPU USAGE(%)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">MEMORY USAGE(%)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">ERROR RATE(%)</span>
        </div>
      </div>

      

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
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="memory"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="error"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}