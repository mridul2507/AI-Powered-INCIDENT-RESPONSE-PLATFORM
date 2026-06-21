"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";

type TrendData = {
  day: string;
  incidents: number;
};

export default function AnalyticsTrendChart() {

  const [data,setData] = useState<TrendData[]>([]);

  useEffect(() => {
    async function fetchTrend() {

      const res = await fetch("/api/analytics/trend");

      const trend = await res.json();

      setData(trend);

    }

    fetchTrend();

    const interval = setInterval(fetchTrend,10000);

    return () => clearInterval(interval);

  },[]);

  return (
    <div className="h-75 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    dataKey="day"
                    stroke="#64748b"
                />

                <YAxis stroke="#64748b" />

                <Tooltip />

                <Bar
                    dataKey="incidents"
                    fill="#16a34a"
                    radius={[12,12,0,0]}
                />
            </BarChart>
        </ResponsiveContainer>
    </div>

  );

}