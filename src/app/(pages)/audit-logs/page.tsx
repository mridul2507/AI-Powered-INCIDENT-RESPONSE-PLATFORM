"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter,setActionFilter] = useState("ALL");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      session &&
      session.user.role !== "ADMIN"
    ) {
      router.push("/dashboard");
    }
  }, [session, router]);
  

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch("/api/audit-logs");

      const data = await res.json();

      setLogs(data);
    }

    fetchLogs();

    const interval = setInterval(
      fetchLogs,
      10000
    );

    return () => clearInterval(interval);

  }, []);

  const filteredLogs = logs.filter(log => {

  const matchesSearch =
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entityType.toLowerCase().includes(search.toLowerCase()) ||
    log.entityId.toLowerCase().includes(search.toLowerCase());

  const matchesAction =
    actionFilter==="ALL" ||
    log.action===actionFilter;

  return matchesSearch && matchesAction;

  });

  return (
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            Audit Logs
          </h1>
      
          <ThemeToggle/>
      </div>

      <div className="relative mb-6">

        <Search className=" absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search audit logs..."
          className="
            w-full
            pl-12
            py-3
            border
            rounded-xl
          "
        />

      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={actionFilter}
          onChange={(e)=>setActionFilter(e.target.value)}
        >

        <option value="ALL">
          All Actions
        </option>

        <option value="CREATE">
          CREATE
        </option>

        <option value="UPDATE">
          UPDATE
        </option>

        <option value="DELETE">
          DELETE
        </option>

        </select>
      </div>

      <div className=" bg-white dark:bg-emerald-950 border border-gray-200
       dark:border-slate-700 rounded-2xl overflow-hidden">

        <div className=" grid grid-cols-[1fr_1fr_1fr_2fr] bg-gray-50 text-black dark:text-black p-4 font-semibold">
          <p>Action</p>
          <p>Entity</p>
          <p>ID</p>
          <p>Time</p>
        </div>

        {filteredLogs.length === 0 && (
          <div className="
            py-16
            flex
            flex-col
            items-center
            text-center
          ">
            <h2 className="text-xl font-semibold mb-2">
              No Audit Logs
            </h2>

            <p className="text-gray-500">
              No logs match the current filters.
            </p>
          </div>
        )}

        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="
              grid
              grid-cols-[1fr_1fr_1fr_2fr]
              p-4
              border-t
              border-gray-200 dark:border-slate-700
              hover:bg-gray-50 dark:hover:bg-white
              transition-colors
              duration-200
            "
          >

            <span
              className={`
                px-3
                py-1
                rounded-full
                text-sm
                font-medium
                w-fit
                

                ${
                  log.action === "CREATE"
                    ? "bg-green-100 text-green-700"
                    : log.action === "UPDATE"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {log.action}
            </span>

            <p className="text-gray-700 dark:text-slate-400">{log.entityType}</p>

            <p className="text-gray-700 dark:text-slate-400">
              {log.entityId.slice(0,8)}
            </p>

            <p className="text-gray-700 dark:text-slate-400">
              {new Date(log.createdAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}