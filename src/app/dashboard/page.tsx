"use client"

import {useEffect, useState} from "react"
import DashboardCard from "@/components/DashboardCard";
import {Server, ShieldCheck, AlertTriangle, Siren} from "lucide-react";
import Navbar from "@/components/Navbar";
import Metrics from "@/components/MetricsChart";
import ServiceHealthChart from "@/components/ServiceHealthChart";
import RecentIncidents from "@/components/RecentIncidents"
import LogsExplorer from "@/components/LogsExplorer";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    healthyServices: 0,
    activeIncidents: 0,
    criticalAlerts: 0,
  });

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
          criticalAlerts: data.criticalAlerts ?? 0,
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchStats();
  }, []);
  return (

  <div className="flex min-h-screen bg-white dark:bg-emerald-950">

    <main className="flex-1 p-10">
      <Navbar />
      
      <h1 className="text-green-900 dark:text-green-400 text-4xl font-bold mb-8">
        IR Assist
      </h1>

      <div className="grid grid-cols-4 gap-4">
        
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

      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 min-w-0">
          <Metrics />
        </div>

        <div className="min-w-0">
          <ServiceHealthChart />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <RecentIncidents />
        <LogsExplorer/>
      </div>

    </main>

  </div>
);
}