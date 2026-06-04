"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import SeverityBadge from "@/components/SeverityBadge";
import Link from "next/link";
import {Search} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

type Incident = {
  id: string;
  title: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  createdAt: string;
};



export default function IncidentsPage() {
  const [search, setSearch] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    async function fetchIncidents() {
      const res = await fetch("/api/incidents");

      const data = await res.json();

      setIncidents(data);
    }

    fetchIncidents();
  }, []);

  const severityMap: Record<
    Incident["severity"],
    "Critical" | "Warning" | "Info"
  > = {
    CRITICAL: "Critical",
    WARNING: "Warning",
    INFO: "Info",
  };

  const statusMap: Record<
    Incident["status"],
    "Open" | "Investigating" | "Resolved"
  > = {
    OPEN: "Open",
    INVESTIGATING: "Investigating",
    RESOLVED: "Resolved",
  };

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.id.toLowerCase().includes(search.toLowerCase()) ||
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.severity.toLowerCase().includes(search.toLowerCase()) ||
      incident.status.toLowerCase().includes(search.toLowerCase())
  );
  return (
    
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6 max-w-7xl">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Incidents
        </h1>

        <ThemeToggle/>
      </div>

      <div className="relative mb-6">
        <Search
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            w-5
            h-5
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-12
            pr-4
            py-3
            text-gray-700 dark:text-slate-400
            border
            border-gray-300
            rounded-xl
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black  
          "
        />

      </div>

      <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

        <div className="grid grid-cols-5 p-4 bg-gray-50 font-semibold text-gray-700 dark:text-slate-400">

          <p>ID</p>

          <p>Title</p>

          <p>Severity</p>

          <p>Status</p>

          <p>Created</p>

        </div>

        {filteredIncidents.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">
            No incidents found.
          </div>
        )}

        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            className="grid grid-cols-5 p-4 text-gray-700 dark:text-slate-400 border-t border-gray-300 items-center"
          >
            <div>
              <Link
                href={`/incidents/${incident.id}`}
                className="
                  inline-block
                  font-medium 
                  text-green-700 
                  hover:text-green-900 dark:text-green-400 
                  hover:underline 
                  cursor-pointer
                  transition-colors
                  duration-200
                "
              >
                {incident.id.slice(0,8)}
              </Link>
            </div>

            <p>{incident.title}</p>

            <div>
              <SeverityBadge
                severity={
                  severityMap[
                    incident.severity
                  ] as "Critical" | "Warning" | "Info"
                }
              />
            </div>

            <div>
              <StatusBadge
                status={
                  statusMap[
                    incident.status
                  ] as "Open" | "Investigating" | "Resolved"
                }
              />
            </div>

            <p className="text-gray-500 dark:text-slate-400">{new Date(
                incident.createdAt
              ).toLocaleDateString()}</p>
          </div>
      ))}

      </div>

    </div>
    


  );
}