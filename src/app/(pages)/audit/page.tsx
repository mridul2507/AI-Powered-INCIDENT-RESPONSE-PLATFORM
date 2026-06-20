"use client";

import { useEffect, useState } from "react";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch("/api/audit");
      const data = await res.json();

      setLogs(data);
    }

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 p-8">

      <h1 className="text-3xl font-bold text-green-900 dark:text-green-400 mb-8">
        Audit Logs
      </h1>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="
              border
              border-gray-300
              rounded-2xl
              p-5
            "
          >
            <p className="font-semibold">
              {log.action}
            </p>

            <p className="text-gray-500">
              {log.entityType}
            </p>

            <p className="text-sm text-gray-400">
              {new Date(
                log.createdAt
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}