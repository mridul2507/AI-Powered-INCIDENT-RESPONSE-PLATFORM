"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AIInsightCard from "@/components/AIInsightCard";
import { Activity } from "lucide-react";
import { isAdmin, isEngineer, isViewer } from "@/lib/roles";
import { toast } from "sonner";

type Service = {
  id: string;
  name: string;
  description: string | null;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  responseTime: string | null;
  availability: string | null;
  requestsPerMin: string | null;

  incidents: {
    id: string;
    title: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
  }[];

  logs: {
    id: string;
    level: string;
    message: string;
  }[];
};

export default function ServiceDetailsPage() {
  const { data: session } = useSession();
  const role = session?.user.role;
  const router = useRouter();
  const params = useParams();

  const [service, setService] = useState<Service | null>(null);
  const [serviceInsights, setServiceInsights] = useState("");
  const [analyzingServices, setAnalyzingServices] = useState(false);

  useEffect(() => {
    async function fetchService() {
      const res = await fetch(`/api/services/${params.id}`);

      const data = await res.json();

      setService(data);
      setServiceInsights(data.aiServiceInsights || "");
    }

    fetchService();
  }, [params.id]);

  async function handleDelete() {
    if (!service) return;
      const confirmed = window.confirm(
      "Are you sure you want to delete this incident?"
      );
      if (!confirmed) return;
      const res = await fetch(
      `/api/services/${service.id}`,
      {
          method: "DELETE",
      }
      );
      if (res.ok) {
          router.push("/services");
          router.refresh();
      } 
      else {
          alert("Failed to delete services");
      }
  }

  async function generateServiceInsights(force = false) {
    if (!isAdmin(role) && !isEngineer(role)) {
      toast.error("Permission denied");
      return;
    }
    if (serviceInsights && !force) return;

    try {
      setAnalyzingServices(true);

      const res = await fetch(
        "/api/ai-service-health",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            service,
          }),
        }
      );

      const data = await res.json();

      setServiceInsights(data.insights);

    }

    finally {
      setAnalyzingServices(false);
    }

  }

  if (!service) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">
      <Link
        href="/services"
        className="
          inline-flex
          items-center
          gap-2
          text-gray-600
          hover:text-green-900
          dark:text-green-400
          transition-colors
          mb-6
        "
      >
        <ArrowLeft size={18} />
        Back to Services
      </Link>

      <div
        className="
          bg-white dark:bg-emerald-950
          border border-gray-200 dark:border-slate-700
          rounded-2xl shadow-sm p-6
        "
      >
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
          {service.id.slice(0, 8)}
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            {service.name}
          </h1>

          <div className="flex gap-3">
            {(isAdmin(role) || isEngineer(role)) && (
              <Link
                  href={`/services/${service.id}/edit`}
                  className="
                  bg-green-700
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  hover:bg-green-800
                  "
              >
                  Edit Service
              </Link>
            )}

            {isAdmin(role) && (
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
          <span
            className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${
                service.status === "CRITICAL"
                  ? "bg-red-100 text-red-700"
                  : service.status === "WARNING"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }
            `}
          >
            {service.status}
          </span>
        </div>

        <p className="text-gray-600 dark:text-slate-400">
          {service.description ?? "No description"}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-6">
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-600">Response Time</p>

          <p className="text-3xl font-bold text-blue-700 mt-2">
            {service.responseTime ?? "--"}
          </p>
        </div>

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-600">Error Rate</p>

          <p className="text-3xl font-bold text-red-600 mt-2">
            --
          </p>
        </div>

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-600">Availability</p>

          <p className="text-3xl font-bold text-green-500 mt-2">
            {service.availability ?? "--"}
          </p>
        </div>

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-600">Requests/min</p>

          <p className="text-3xl font-bold text-violet-600 mt-2">
            {service.requestsPerMin ?? "--"}
          </p>
        </div>
      </div>

        <div className="grid grid-cols-2 gap-6 mt-6">

        {/*RECENT INCIDENTS*/}
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-4">
                Recent Incidents
            </h2>

            {service.incidents.length === 0 && (
              <p className="text-gray-500 dark:text-slate-400">
                No incidents found.
              </p>
            )}

            {service.incidents.map((incident) => (
                <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                >
                <div
                    className="
                    border-b
                    border-gray-100
                    p-4
                    pb-4
                    pt-4
                    hover:bg-gray-100
                    hover:rounded-xl
                    cursor-pointer
                    transition-all
                    "
                >
                    <p className="font-medium text-gray-700 dark:text-slate-400">
                    {incident.id}
                    </p>

                    <p className="text-gray-600 mt-1">
                    {incident.title}
                    </p>

                    <span
                    className={`
                        inline-flex
                        mt-2
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium

                        ${
                        incident.severity === "CRITICAL"
                            ? "bg-red-100 text-red-700"
                            : incident.severity === "WARNING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }
                    `}
                    >
                    {incident.severity.charAt(0) + incident.severity.slice(1).toLowerCase()}
                    </span>
                </div>
                </Link>
            ))}
            </div>

            {/* Recent Logs */}
            <div
              className="
              bg-white dark:bg-emerald-950
              border border-gray-200 dark:border-slate-700
              rounded-2xl shadow-sm p-6
              transition-all duration-300
              hover:shadow-lg hover:-translate-y-1
            "
            >
              <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-4">
                Recent Logs
              </h2>

              {service.logs.length === 0 && (
                <p className="text-gray-500 dark:text-slate-400">
                  No logs found.
                </p>
              )}

              {service.logs.map((log) => (
                <div
                  key={log.id}
                  className="
                    border-b border-gray-100
                    py-4
                  "
                >
                  <p className="font-medium text-gray-700 dark:text-slate-300">
                    {log.message}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {log.level}
                  </p>
                </div>
              ))}
            </div>

        </div>

        {!isViewer(role) && (
          <AIInsightCard
            title="AI Service Health Insights"
            icon={<Activity className=" text-green-600 " />}
            content={serviceInsights}
            placeholder="Click Analyze Service Health"
            loading={analyzingServices}
            buttonText="Analyze Service Health"
            loadingText="Analyzing..."
            buttonColor="bg-green-600 hover:bg-green-700"
            onClick={() =>generateServiceInsights()}
            onRegenerate={() =>generateServiceInsights(true)}
          />
        )}
    </div>
  );
}
