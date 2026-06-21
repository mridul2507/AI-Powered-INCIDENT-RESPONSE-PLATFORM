"use client";

import { useEffect, useState } from "react";

export default function TopAffectedServices() {
  const [services, setServices] = useState<
    { name: string; count: number }[]
  >([]);

  useEffect(() => {
    async function fetchIncidents() {
      const res = await fetch("/api/incidents");

      const incidents = await res.json();

      const counts: Record<string, number> = {};

      incidents.forEach((incident: any) => {
        if (!incident.service) return;

        counts[incident.service.name] =
          (counts[incident.service.name] || 0) + 1;
      });

      const sorted = Object.entries(counts)
        .map(([name, count]) => ({
          name,
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setServices(sorted.slice(0,5));
    }

    fetchIncidents();
    const interval = setInterval(
      fetchIncidents,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-emerald-950 border border-gray-300 rounded-2xl p-6 mt-6
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
        TOP AFFECTED SERVICES
      </h2>

      <div className="space-y-6">
        {services.map((service) => {
            const maxCount = services[0]?.count || 1;
            const width = (service.count / maxCount) * 100;

            return (
            <div key={service.name}>
                <div className="flex justify-between mb-2">
                <p className="font-medium text-gray-700 dark:text-slate-300">
                    {service.name}
                </p>

                <p className="font-bold text-green-700 dark:text-green-400">
                    {service.count}
                </p>
                </div>

                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                    className="bg-green-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${width}%` }}
                />
                </div>
            </div>
            );
        })}
        </div>
    </div>
  );
}