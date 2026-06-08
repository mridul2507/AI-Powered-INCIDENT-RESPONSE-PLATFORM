"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import SeverityBadge from "@/components/SeverityBadge";
import Link from "next/link";
import {Search} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

type Service = {
  id: string;
  name: string;
};

type Incident = {
  id: string;
  title: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  createdAt: string;

  service: {
    id: string;
    name: string;
  } | null;
};

export default function IncidentsPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchIncidents() {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      setIncidents(data);

      const servicesRes = await fetch("/api/services");
      const servicesData = await servicesRes.json();
      setServices(servicesData);
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

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(search.toLowerCase()) ||
      incident.title.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity =
      severityFilter === "ALL" ||
      incident.severity === severityFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      incident.status === statusFilter;

    const matchesService =
      serviceFilter === "ALL" ||
      incident.service?.name === serviceFilter;

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesStatus &&
      matchesService
    );
  });
  return (
    
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6 ">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Incidents
        </h1>

        
      <div className="flex items-center gap-4">
        {session?.user.role !== "VIEWER" && (
          <Link
            href="/incidents/create"
            className="
              bg-green-700
              text-white
              px-4
              py-2
              rounded-xl
              hover:bg-green-800
              transition-colors
            "
          >
            Create Incident
          </Link>
        )}

        <ThemeToggle />
      </div>
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

            <div className="flex gap-4 mb-6">
        <select
          value={severityFilter}
          onChange={(e) =>
            setSeverityFilter(e.target.value)
          }
          className="
            p-3
            border
            rounded-xl
            dark:bg-slate-900
          "
        >
          <option value="ALL">
            All Severities
          </option>

          <option value="INFO">
            Info
          </option>

          <option value="WARNING">
            Warning
          </option>

          <option value="CRITICAL">
            Critical
          </option>

        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="
            p-3
            border
            rounded-xl
            dark:bg-slate-900
          "
        >
          <option value="ALL">
            All Statuses
          </option>

          <option value="OPEN">
            Open
          </option>

          <option value="INVESTIGATING">
            Investigating
          </option>

          <option value="RESOLVED">
            Resolved
          </option>

        </select>

        <select
          value={serviceFilter}
          onChange={(e) =>
            setServiceFilter(e.target.value)
          }
          className="
            p-3
            border
            rounded-xl
            dark:bg-slate-900
          "
        >
          <option value="ALL">
            All Services
          </option>

          {services.map((service) => (
            <option
              key={service.id}
              value={service.name}
            >
              {service.name}
            </option>
          ))}
        </select>

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