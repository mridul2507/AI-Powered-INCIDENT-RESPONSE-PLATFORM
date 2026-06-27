"use client"

import {useEffect, useState} from "react"
import DashboardCard from "@/components/DashboardCard";
import {Server, ShieldCheck, AlertTriangle, Siren, Clock3} from "lucide-react";
import Navbar from "@/components/Navbar";
import IncidentSeverityChart from "@/components/IncidentSeverityChart";
import ServiceHealthChart from "@/components/ServiceHealthChart";
import RecentIncidents from "@/components/RecentIncidents"
import LogsExplorer from "@/components/LogsExplorer";
import IncidentStatusChart from "@/components/IncidentStatusChart";
import TopAffectedServices from "@/components/TopAffectedServices";
import IncidentTrendChart from "@/components/IncidentTrendChart";
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    healthyServices: 0,

    activeIncidents: 0,
    resolvedIncidents: 0,

    criticalAlerts: 0,
    warningAlerts: 0,
    infoAlerts: 0,

    averageMttr: "--",
  });
  const [dashboardInsights, setDashboardInsights] = useState("");
  const [analyzingDashboard, setAnalyzingDashboard] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");

        if (!res.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await res.json();

        setStats({
          totalServices: data.totalServices ?? 0,
          healthyServices: data.healthyServices ?? 0,
          activeIncidents: data.activeIncidents ?? 0,
          resolvedIncidents: data.resolvedIncidents ?? 0,
          criticalAlerts: data.criticalAlerts ?? 0,
          warningAlerts: data.warningAlerts ?? 0,
          infoAlerts: data.infoAlerts ?? 0,
          averageMttr: data.averageMttr ?? "--",
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchStats();

    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  async function generateDashboardInsights() {
    setAnalyzingDashboard(true);

    const res = await fetch(
      "/api/ai-dashboard",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(stats),
      }
    );

    const data = await res.json();

    setDashboardInsights(
      data.insights
    );

    setAnalyzingDashboard(false);
  }
  return (

  <div className="flex min-h-screen bg-white dark:bg-emerald-950">

    <main className="flex-1 p-10">
      <Navbar />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-green-900 dark:text-green-400 text-4xl font-bold">
        IR Assist
      </h1>

      <button
        onClick={generateDashboardInsights}
        className=" bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl"
      >
        {
          analyzingDashboard
            ? "Analyzing..."
            : "Analyze Dashboard"
        }
      </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        
        <DashboardCard
          title="Total Services"
          value={stats.totalServices.toString()}
          icon={Server}
        />

        <DashboardCard
          title="Healthy Services"
          value={stats.healthyServices.toString()}
          icon={ShieldCheck}
        />

        <DashboardCard
          title="Active Incidents"
          value={stats.activeIncidents.toString()}
          icon={AlertTriangle}
        />

        <DashboardCard
          title="Critical Alerts"
          value={stats.criticalAlerts.toString()}
          icon={Siren}
        />

        <DashboardCard
          title="Resolved Incidents"
          value={stats.resolvedIncidents.toString()}
          icon={ShieldCheck}
        />

        <DashboardCard
          title="Warning Alerts"
          value={stats.warningAlerts.toString()}
          icon={AlertTriangle}
        />

        <DashboardCard
          title="Info Alerts"
          value={stats.infoAlerts.toString()}
          icon={Server}
        />

        <DashboardCard
          title="Average MTTR"
          value={stats.averageMttr}
          icon={Clock3}
        />

      </div>

      <div className="grid grid-cols-2 gap-6">
        <IncidentSeverityChart />
        <ServiceHealthChart />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <IncidentStatusChart />
        <IncidentTrendChart />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <RecentIncidents />
        <TopAffectedServices />
      </div>

      <div >
        <LogsExplorer />
      </div>

      <div className=" bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700
          rounded-2xl shadow-sm hover:shadow-lg p-6 mt-6">

        <h2 className=" text-xl font-semibold text-green-900 dark:text-green-400 mb-4 uppercase">
          AI Dashboard Insights
        </h2>

        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2
                className=" text-xl font-bold text-blue-700 mt-6 mb-3"
              >
                {children}
              </h2>
            ),

            p: ({ children }) => (
              <p
                className=" leading-8 mb-4 text-gray-700 dark:text-slate-300"
              >
                {children}
              </p>
            ),

            li: ({ children }) => (
              <li
                className=" ml-6 mb-2 list-disc"
              >
                {children}
              </li>
            ),
          }}
        >
          {
            dashboardInsights ||
            "Analyze the dashboard to understand overall system health and risks."
          }
        </ReactMarkdown>

      </div>
    </main>

  </div>
);
}