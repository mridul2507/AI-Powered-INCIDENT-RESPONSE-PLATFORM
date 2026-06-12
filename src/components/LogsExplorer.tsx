"use client";

import { useEffect, useState } from "react";
import Link from "next/link"

type Log = {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  service: {
    name: string;
  };
};

export default function LogsExplorer() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch("/api/logs");
      const data = await res.json();
      setLogs(data.slice(0, 5));
    }

    fetchLogs();
    const interval = setInterval(
      fetchLogs,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
      bg-white dark:bg-emerald-950
      border border-gray-300 dark:border-slate-700
      rounded-2xl p-6 mt-6
      transition-all duration-300
      hover:shadow-lg hover:-translate-y-1
    "
    >
      <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
        Logs Explorer
      </h2>

      <div className="space-y-4">
        {logs.map((log) => (
          <Link
            key={log.id}
            href={`/logs/${log.id}`}
            className="
              block
              border-b
              border-gray-200
              dark:border-slate-700
              pb-4
              rounded-lg
              hover:bg-gray-100
              dark:hover:bg-white
              p-3
              transition-colors
            "
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className={`
                  font-semibold
                  ${
                    log.level === "ERROR"
                      ? "text-red-600"
                      : log.level === "WARNING"
                      ? "text-amber-600"
                      : "text-blue-600"
                  }
                `}
              >
                {log.level}
              </span>

              <span className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-gray-700 dark:text-slate-400">
              {log.message}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {log.service.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}