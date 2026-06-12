"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeverityBadge from "@/components/SeverityBadge";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link"
import { ArrowLeft, 
  CirclePlus,
  RefreshCw,
  AlertTriangle,
  Server, 
  CheckCircle,} from "lucide-react";

const logs = [
          {
            time: "12:32:45",
            level: "ERROR",
            message: "Database connection timeout",
          },
          {
            time: "12:32:46",
            level: "INFO",
            message: "Retry attempt started",
          },
          {
            time: "12:32:48",
            level: "WARNING",
            message: "Connection pool usage exceeded 90%",
          },
];

type Incident = {
  id: string;
  title: string;
  description: string | null;
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";

  service: {
    id: string;
    name: string;
  } | null;

  createdAt: string;
  updatedAt: string;
};

export default function IncidentDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [mttr, setMttr] = useState<string | null>(null);
  useEffect(() => {
    async function fetchIncident() {
      const res = await fetch(
        `/api/incidents/${params.id}`
      );
      const data = await res.json();
      const timelineRes = await fetch(`/api/incidents/${params.id}/timeline`);
      const timelineData = await timelineRes.json();
      const resolvedEvent = [...timelineData]
        .reverse()
        .find(
          (e: any) =>
            e.type === "RESOLVED" ||
            (
              e.type === "STATUS_CHANGED" &&
              e.message.includes("RESOLVED")
            )
        );

      if (resolvedEvent) {
        const diff =
          new Date(resolvedEvent.createdAt).getTime() -
          new Date(data.createdAt).getTime();

        const totalMinutes = Math.floor(diff / 60000);
        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
        const minutes = totalMinutes % 60;
      
        let formatted = "";
        if (days > 0) formatted += `${days}d `;
        if (hours > 0) formatted += `${hours}h `;
        formatted += `${minutes}m`;
        setMttr(formatted);
      }
      setTimeline(timelineData);
      setIncident(data);
      setLoading(false);
      
    }

    fetchIncident();
    const interval = setInterval(
      fetchIncident,
      10000
    );

    return () => clearInterval(interval);
  }, [params.id]);

  async function handleDelete() {
    if (!incident) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this incident?"
    );

    if (!confirmed) return;

    const res = await fetch(
      `/api/incidents/${incident.id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      router.push("/incidents");
      router.refresh();
    } else {
      alert("Failed to delete incident");
    }
  }

  async function handleResolve() {
    if (!incident) return;

    const res = await fetch(
      `/api/incidents/${incident.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: incident.title,
          description: incident.description,
          severity: incident.severity,
          status: "RESOLVED",
          serviceId: incident.service?.id,
        }),
      }
    );

    if (res.ok) {
      router.refresh();
      window.location.reload();
    } else {
      alert("Failed to resolve incident");
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!incident) {
    return <div className="p-8">Incident not found</div>;
  }
  return (
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">
      <Link
        href="/incidents"
        className="
          inline-flex
          items-center
          gap-2
          text-gray-600
          hover:text-green-900 dark:text-green-400
          transition-colors
          mb-6
        "
      >
        <ArrowLeft size={18} />
        Back to Incidents
      </Link>

      <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
          {incident.id.slice(0, 8)}
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            {incident.title}
          </h1>

          <div className="flex gap-3">
            {session?.user.role !== "VIEWER" && (
              <Link
                href={`/incidents/${incident.id}/edit`}
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
                Edit Incident
              </Link>
            )}

            {session?.user.role !== "VIEWER" &&
              incident.status !== "RESOLVED" && (
                <button
                  onClick={handleResolve}
                  className="
                    bg-blue-600
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    hover:bg-blue-700
                    transition-colors
                  "
                >
                  Resolve Incident
                </button>
              )}

            {session?.user.role === "ADMIN" && (
              <button
                onClick={handleDelete}
                className="
                  bg-red-600
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  hover:bg-red-700
                  transition-colors
                "
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-4">

          <SeverityBadge
            severity={
              incident.severity === "CRITICAL"
                ? "Critical"
                : incident.severity === "WARNING"
                ? "Warning"
                : "Info"
            }
          />

          <StatusBadge
            status={
              incident.status === "OPEN"
                ? "Open"
                : incident.status === "INVESTIGATING"
                ? "Investigating"
                : "Resolved"
            }
          />

        </div>

        <p className="text-gray-600">
          {incident.description || "No description available"}
        </p>
        {incident.service && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Affected Service
            </p>

            <p className="font-semibold text-green-700">
              {incident.service.name}
            </p>
          </div>
         )}
         <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            MTTR
          </p>

          <p className="font-semibold text-blue-700">
            {mttr ?? "--"}
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-4">
            Incident Timeline
          </h2>

          <div className="space-y-8">

            <div className="border-l-2 border-green-600 pl-4">
              <p className="font-medium text-gray-700 dark:text-slate-400">
                12:30 PM
              </p>

              <p className="text-gray-500 dark:text-slate-400">
                Error rate exceeded threshold.
              </p>
            </div>

            <div className="border-l-2 border-green-600 pl-4">
              <p className="font-medium text-gray-700 dark:text-slate-400">
                12:32 PM
              </p>

              <p className="text-gray-500 dark:text-slate-400">
                Alert triggered for Payment Service.
              </p>
            </div>

            <div className="border-l-2 border-green-600 pl-4">
              <p className="font-medium text-gray-700 dark:text-slate-400">
                12:35 PM
              </p>

              <p className="text-gray-500 dark:text-slate-400">
                Incident created automatically.
              </p>
            </div>

          </div>

        </div>

        {/* AI Analysis Card */}
        <div className="col-span-2">
          <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 h-full 
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-4">
              AI Root Cause Analysis
            </h2>

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">

              <p className="font-semibold text-violet-700 mb-2">
                Root Cause
              </p>

              <p className="text-gray-700">
                The payment service is experiencing elevated error rates due to
                database connection pool exhaustion. Incoming requests are
                exceeding available database connections.
              </p>

            </div>

            <div className="mt-6">
              <p className="font-semibold text-yellow-800 mb-2">
                Confidence Score
              </p>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full w-[92%] transition-all duration-700"></div>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Confidence Score: 92%
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-green-900 dark:text-green-400 mb-3">
                Contributing Factors
              </h3>

              <ul className="space-y-2 text-gray-700">

                <li>
                  • Increased payment traffic after promotional campaign
                </li>

                <li>
                  • Database connection pool reached maximum capacity
                </li>

                <li>
                  • Slow database queries causing connection retention
                </li>

                <li>
                  • Retry logic amplifying incoming requests
                </li>

              </ul>

            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-green-900 dark:text-green-400 mb-3">
                Recommended Actions
              </h3>

              <ul className="space-y-2 text-gray-700">

                <li>
                  • Increase database connection pool size
                </li>

                <li>
                  • Optimize slow-running queries
                </li>

                <li>
                  • Add rate limiting to retry mechanism
                </li>

                <li>
                  • Monitor active connections more aggressively
                </li>

              </ul>

            </div>

          </div>
        </div>

        {/*Logs Explorer*/}
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <h2 className="flex flex-wrap text-xl font-semibold text-green-900 dark:text-green-400 mb-4">
            Logs Explorer
          </h2>
                    
          {logs.map((log) => (
          <div
            key={log.time}
            className="
              text-sm
              grid
              flex-wrap
              grid-cols-[80px_90px_minmax(0,1fr)]
              hover:bg-gray-100
              rounded-lg
              px-2
              transition-colors
              duration-200
              border-b
              border-gray-100
              py-3
              items-center"
          >
            <p className="text-gray-700 dark:text-slate-400">
              {log.time}
            </p>

            <p className={`
                font-semibold
                ${
                  log.level === "ERROR"
                    ? "text-red-600"
                    : log.level === "WARNING"
                    ? "text-amber-600"
                    : "text-blue-600"
                }
              `}>
              {log.level}
            </p>

            <p className="text-gray-700 dark:text-slate-400">
              {log.message}
            </p>
          </div>
        ))}

        </div>

        {/*Service Map*/}
        <div className="col-span-2 bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
                transition-colors duration-300 hover:shadow-lg hover:-translate-y-1">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
            Service Map (Tracing)
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-gray-700 font-semibold border border-green-300 bg-green-100 rounded-xl px-6 py-4">
              User
            </div>

            <div className="text-3xl text-gray-400">→</div>

            <div className="border border-red-300 bg-red-50 rounded-xl px-10 py-8">
              <p className="text-gray-700 font-semibold">
                Payment Service
              </p>
              <p className="text-red-600 text-sm">
                Critical
              </p>
            </div>

            <div className="text-3xl text-gray-400">→</div>

            <div className="border border-green-300 bg-green-50 rounded-xl px-6 py-4">
              <p className=" text-gray-700 font-semibold">
                Notification
              </p>
              <p className="text-green-600 text-sm">
                Healthy
              </p>
            </div>
            
            <div className="text-gray-700 border border-amber-300 bg-amber-100 rounded-xl px-6 py-4">
              <p className="text-gray-700 font-semibold">
                User DB
              </p>
              <p className="text-amber-600 text-sm">
                Warning
              </p>
            </div>

            
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700
        rounded-2xl shadow-sm p-6 mt-6 transition-colors duration-300 hover:shadow-lg hover:-translate-y-1">
        <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
          Timeline
        </h2>

        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div
              key={event.id}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full
                    ${
                      event.type === "CREATED"
                        ? "bg-green-100 text-green-700"
                        : event.type === "STATUS_CHANGED"
                        ? "bg-blue-100 text-blue-700"
                        : event.type === "SEVERITY_CHANGED"
                        ? "bg-orange-100 text-orange-700"
                        : event.type === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-purple-100 text-purple-700"
                    }
                  `}
                >
                  {event.type === "CREATED" ? (<CirclePlus size={16} />) 
                  : event.type === "STATUS_CHANGED" ? (<RefreshCw size={16} />)
                  : event.type === "SEVERITY_CHANGED" ? (<AlertTriangle size={16} />) 
                  : event.type === "RESOLVED" ? (<CheckCircle size={16} />) 
                  : (<Server size={16} />)
                  }
                </div>

                {index !== timeline.length - 1 && (
                  <div className="w-[2px] flex-1 bg-gray-300 dark:bg-white mt-2"/>
                )}
              </div>

              <div className="pb-8">
                <p className="font-medium">
                  {event.message}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}