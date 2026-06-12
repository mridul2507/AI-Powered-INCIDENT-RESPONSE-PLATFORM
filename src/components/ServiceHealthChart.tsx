"use client";

import {useEffect, useState} from "react";
import{
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

export default function ServiceHealthChart() {
    const [stats, setStats] = useState({
        healthy: 0,
        warning: 0,
        critical: 0,
    });

    useEffect(() => {
        async function fetchServices() {
            const res = await fetch("/api/services");

            const services = await res.json();

            setStats({
            healthy: services.filter(
                (s: any) => s.status === "HEALTHY"
            ).length,

            warning: services.filter(
                (s: any) => s.status === "WARNING"
            ).length,

            critical: services.filter(
                (s: any) => s.status === "CRITICAL"
            ).length,
            });
        }

        fetchServices();
        const interval = setInterval(
            fetchServices,
            10000
        );

        return () => clearInterval(interval);
        }, []);

        const data = [
        {
            name: "Healthy",
            value: stats.healthy,
        },
        {
            name: "Warning",
            value: stats.warning,
        },
        {
            name: "Critical",
            value: stats.critical,
        },
        ];

        const total = stats.healthy + stats.warning + stats.critical;
    return (
    <div className="bg-white dark:bg-emerald-950 border border-gray-300 rounded-2xl p-6 mt-6
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <h2 className="text-green-900 dark:text-green-400 text-xl uppercase font-semibold mb-6">
        Service Health
      </h2>

    {/*HCW*/}
      <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Healthy</span>
                    </div>

                    <span className="text-gray-600">{stats.healthy}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-gray-600">Warning</span>
                    </div>

                    <span className="text-gray-600">{stats.warning}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Critical</span>
                    </div>

                    <span className="text-gray-600">{stats.critical}</span>
            </div>
        </div>

    {/*PIECHART*/}
      <div className="relative h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie 
                    data={data}
                    dataKey="value"
                    innerRadius={50}
                    isAnimationActive={true}
                    animationDuration={1000}
                >

                {data.map((entry,index)=>(
                    <Cell
                        key={entry.name}
                        fill={COLORS[index]}
                    />
                ))}

                </Pie>
            </PieChart>
        </ResponsiveContainer>

    {/*TOTAL*/}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-bold text-green-900 dark:text-green-400">
                {total}
            </p>

            <p className="text-gray-500 dark:text-slate-400 text-sm">
                Total
            </p>
        </div>
    </div>
    </div>
  );
}