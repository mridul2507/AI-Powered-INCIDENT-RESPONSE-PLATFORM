"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const logs = [
  {
    time: "12:32:45",
    level: "ERROR",
    service: "Payment Service",
    message: "Database connection timeout",
  },
  {
    time: "12:32:46",
    level: "INFO",
    service: "Payment Service",
    message: "Retry attempt started",
  },
  {
    time: "12:32:48",
    level: "WARNING",
    service: "User Database",
    message: "Connection pool usage exceeded 90%",
  },
  {
    time: "12:33:10",
    level: "INFO",
    service: "Notification Service",
    message: "Email dispatch successful",
  },
];

export default function LogsPage() {
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.level.toLowerCase().includes(search.toLowerCase()) ||
      log.service.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase())
  );
  return (
    
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6 max-w-7xl">
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
      <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[220px_220px_320px_1fr] p-4 bg-gray-50 font-semibold text-gray-700 dark:text-slate-400">
            <p>Time</p>
            <p>Level</p>
            <p>Service</p>
            <p>Message</p>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">
            No logs found.
          </div>
        )}

        {filteredLogs.map((log) => (
          <Link 
            key={log.time}
            href={`/services/${log.service}`}
            className="contents">
            <div
                key={log.time}
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
                {log.time}
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
                {log.service}
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