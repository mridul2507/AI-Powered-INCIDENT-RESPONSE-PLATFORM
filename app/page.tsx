import DashboardCard from "@/components/DashboardCard";
import {Server, ShieldCheck, AlertTriangle, Siren} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Metrics from "@/components/MetricsChart";

export default function Home() {
  return (

  <div className="flex min-h-screen bg-white">
    <Sidebar />

    <main className="flex-1 p-10">
      <Navbar />
      
      <h1 className="text-green-900 text-4xl font-bold mb-8">
        IR Assist
      </h1>

      <div className="grid grid-cols-4 gap-4">
        
        <DashboardCard
          title="Total Services"
          value="24"
          icon={Server}
        />

        <DashboardCard
          title="Healthy Services"
          value="18"
          icon={ShieldCheck}
        />

        <DashboardCard
          title="Active Incidents"
          value="5"
          icon={AlertTriangle}
        />

        <DashboardCard
          title="Critical Alerts"
          value="12"
          icon={Siren}
        />

      </div>

      <Metrics />

    </main>

  </div>
);
}