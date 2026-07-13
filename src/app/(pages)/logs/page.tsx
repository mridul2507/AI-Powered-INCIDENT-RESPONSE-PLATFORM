"use client";

import { useEffect, useState } from "react";
import { Search, FileText } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useIncidentEventContext } from "@/context/IncidentEventsContext";

type Log = {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  service: {
    id: string;
    name: string;
  };
};

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const { lastEvent } = useIncidentEventContext();

  async function fetchLogs() {
  const res = await fetch("/api/logs");
  const data = await res.json();
  setLogs(data);
}

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case "INCIDENT_CREATED":
      case "INCIDENT_UPDATED":
      case "INCIDENT_DELETED":
        fetchLogs();
        break;
    }
  }, [lastEvent]);

  const filteredLogs = logs.filter((log) => {
  const matchesSearch =
    log.level.toLowerCase().includes(search.toLowerCase()) ||
    log.service.name.toLowerCase().includes(search.toLowerCase()) ||
    log.message.toLowerCase().includes(search.toLowerCase());

  const matchesLevel =
    levelFilter === "ALL" ||
    log.level === levelFilter;

  const matchesService =
    serviceFilter === "ALL" ||
    log.service.name === serviceFilter;

  return (
    matchesSearch &&
    matchesLevel &&
    matchesService
  );
});
  return (
    
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Logs
        </h1>

        <ThemeToggle />
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
          placeholder="Search logs..."
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
          value={levelFilter}
          onChange={(e) =>
            setLevelFilter(e.target.value)
          }
          className="
            p-3
            border
            rounded-xl
            dark:bg-white
            dark:text-black
          "
        >
          <option value="ALL">
            All Levels
          </option>

          <option value="INFO">
            INFO
          </option>

          <option value="WARNING">
            WARNING
          </option>

          <option value="ERROR">
            ERROR
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
            dark:bg-white
            dark:text-black
          "
        >
          <option value="ALL">
            All Services
          </option>

          {[...new Set(
            logs.map((log) => log.service.name)
          )].map((service) => (
            <option
              key={service}
              value={service}
            >
              {service}
            </option>
          ))}
        </select>

      </div>
      <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[220px_220px_320px_1fr] p-4 bg-gray-50 font-semibold text-gray-700 dark:text-slate-400">
            <p>Time</p>
            <p>Level</p>
            <p>Service</p>
            <p>Message</p>
        </div>

        {filteredLogs.length === 0 && (
          <div className=" py-16 flex flex-col items-center justify-center text-center">
            <FileText size={48} className="text-gray-300 mb-4"/>

            <h2 className="text-xl font-semibold mb-2">
              No Logs Found
            </h2>

            <p className="text-gray-500">
              There are currently no logs matching your filters.
            </p>
          </div>
        )}

        {filteredLogs.map((log) => (
          <Link 
            key={log.id}
            href={`/logs/${log.id}`}
            className="contents">
            <div
                key={log.message}
                className="
                grid
                grid-cols-[220px_220px_320px_1fr]
                p-4
                border-t
                border-gray-200 dark:border-slate-700
                items-center
                hover:bg-gray-100
                transition-colors
                duration-200
                cursor-pointer
                "
            >
                <p className="text-gray-700 dark:text-slate-400">
                {new Date(log.timestamp).toLocaleString()}
                </p>

                <span
                className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                    w-fit

                    ${
                    log.level === "ERROR"
                        ? "bg-red-100 text-red-700"
                        : log.level === "WARNING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }
                `}
                >
                {log.level}
                </span>

                <p className="text-green-700 font-medium">
                {log.service.name}
                </p>

                <p className="text-gray-700 dark:text-slate-400">
                {log.message}
                </p>

            </div>
            </Link>
            ))}
        </div>
      </div>
  );
}