"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useIncidentEventContext } from "@/context/IncidentEventsContext";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  metadata: any;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1); 
  const [pages, setPages] = useState(1);  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const { data: session } = useSession();
  const router = useRouter();
  const { lastEvent } = useIncidentEventContext();

  async function fetchLogs() {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      search,
      action: actionFilter,
      from,
      to,
    });

    const res = await fetch(`/api/audit-logs?${params}`);
    const data = await res.json();

    setLogs(data.logs);
    setPages(data.pages);
    setLoading(false);
  }

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    setPage(1);
  }, [search, actionFilter, from, to]);

  useEffect(() => {
    fetchLogs();
  }, [page, search, actionFilter, from, to]);

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case "INCIDENT_CREATED":
      case "INCIDENT_UPDATED":
      case "INCIDENT_DELETED":
        fetchLogs();
        break;
      default:
        break;
    }
  }, [lastEvent]);

  return (
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8 w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Audit Logs
        </h1>
        <ThemeToggle />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search audit logs..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl dark:bg-emerald-900 dark:border-slate-700 dark:text-white"
        />
      </div>

      <div className="flex flex-wrap gap-6 items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-slate-300 text-sm font-semibold">From:</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-xl px-4 py-2 dark:bg-emerald-900 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-slate-300 text-sm font-semibold">To:</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded-xl px-4 py-2 dark:bg-emerald-900 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-slate-300 text-sm font-semibold">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border rounded-xl px-4 py-2 dark:bg-emerald-900 dark:border-slate-700 dark:text-white"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-emerald-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        
        <div className="grid grid-cols-[1.5fr_1.5fr_3fr_2fr] bg-gray-50 dark:bg-emerald-900 border-b border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 p-4 font-semibold text-sm tracking-wider">
          <p>Action</p>
          <p>Entity</p>
          <p>ID</p>
          <p>Time</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500 dark:text-slate-400">
            Loading logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">No Audit Logs</h2>
            <p className="text-gray-500 dark:text-slate-400">No logs match the current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[1.5fr_1.5fr_3fr_2fr] items-center p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors duration-150"
              >
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-block text-center w-24 ${
                      log.action === "CREATE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : log.action === "UPDATE"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {log.action}
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-800 dark:text-slate-300">
                  {log.entityType}
                </p>

                <p className="text-sm font-mono text-gray-600 dark:text-slate-400 break-all pr-4">
                  {log.entityId}
                </p>

                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {new Date(log.createdAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-emerald-900 disabled:opacity-50 disabled:hover:bg-transparent dark:border-slate-700 dark:text-white text-sm font-medium transition-colors"
        >
          Previous
        </button>

        <span className="text-sm text-gray-700 dark:text-slate-300 font-medium">
          {page} / {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-emerald-900 disabled:opacity-50 disabled:hover:bg-transparent dark:border-slate-700 dark:text-white text-sm font-medium transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}