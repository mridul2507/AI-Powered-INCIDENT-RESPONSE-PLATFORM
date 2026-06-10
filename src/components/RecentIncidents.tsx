"use client";

import {useState, useEffect} from "react";
import SeverityBadge from "@/components/SeverityBadge";
import Link from "next/link"

type Incident = {
  id: string;
  title: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  createdAt: string;
};

export default function RecentIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    async function fetchIncidents() {
      const res = await fetch(
        "/api/incidents"
      );

      const data = await res.json();

      setIncidents(data.slice(0, 5));
    }

    fetchIncidents();
  }, []);
  return (
    <div className="bg-white dark:bg-emerald-950 border border-gray-300 rounded-2xl p-6 mt-6
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      
      <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
        Recent Incidents
      </h2>

      <div className="flex flex-col gap-4">

        {incidents.map((incident) => (
          <Link
            key={incident.id}
            href={`/incidents/${incident.id}`}
            className="
              block
              border-b
              border-gray-200 dark:border-slate-700
              p-2
              pt-4
              pb-4
              hover:bg-gray-100
              rounded-lg
              transition-colors
              cursor-pointer
            "
                    >
          <div
            className="flex items-center justify-between "
          >

            <div className="flex items-start gap-4">
              <SeverityBadge
                severity={
                  incident.severity === "CRITICAL"
                    ? "Critical"
                    : incident.severity === "WARNING"
                    ? "Warning"
                    : "Info"
                }
              />

              <div>
                <p className="font-medium text-gray-600">
                  {incident.title}
                </p>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {new Date(
                    incident.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

          </div>
          </Link>
        ))}

      </div>

    </div>
  );
}