"use client"

import ThemeToggle from "@/components/ThemeToggle"
import { useState, useEffect } from "react";
import AIInsightCard from "@/components/AIInsightCard";
import { FileText, Brain } from "lucide-react";
import AnalyticsTrendChart from "@/components/AnalyticsTrendChart";
import { useSession } from "next-auth/react";

export default function AnalyticsPage(){
  const [executiveReport, setExecutiveReport] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [analyticsInsights,setAnalyticsInsights]=useState("");
  const [analyzingInsights,setAnalyzingInsights]=useState(false);
  const [metrics, setMetrics] = useState({
    totalIncidents: 0,
    mttr: "--",
    availability: "--",
    errorRate: "--",
    criticalIncidents: 0,
    warningIncidents: 0,
    infoIncidents: 0,
  });
  const { data: session } = useSession();
  const role = session?.user.role;

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();

      setMetrics({
        totalIncidents: data.activeIncidents + data.resolvedIncidents,
        mttr: data.averageMttr,
        availability:
          data.totalServices > 0
            ? (
                (data.healthyServices / data.totalServices) * 100
              ).toFixed(1) + "%"
            : "--",

        errorRate:
          (
            (data.criticalAlerts / (data.activeIncidents + data.resolvedIncidents)) * 100
          ).toFixed(1) + "%",

        criticalIncidents:
          data.criticalAlerts,

        warningIncidents:
          data.warningAlerts,

        infoIncidents:
          data.infoAlerts,
      });
    }

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics,10000);
    return () => clearInterval(interval);
  }, []);

  async function generateExecutiveReport(force=false) {
  if (executiveReport && !force) return;
  try {
    setGeneratingReport(true);
    const res = await fetch(
      "/api/ai-executive-report",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          metrics,
        }),
      }
    );

    const data = await res.json();
    setExecutiveReport(data.report);

  }

  finally {
    setGeneratingReport(false);
  }
  }

  async function analyzeAnalytics(force=false){
    if(analyticsInsights && !force) return;

    try{
      setAnalyzingInsights(true);
      const res=await fetch(
        "/api/ai-analytics-insights",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            metrics
          })
        }
      );

      const data=await res.json();
      setAnalyticsInsights(data.insights);
    }

    finally{
      setAnalyzingInsights(false);
    }
  }

  const totalSeverity = metrics.criticalIncidents + metrics.warningIncidents + metrics.infoIncidents;

  const criticalPercent = totalSeverity > 0
      ? (metrics.criticalIncidents / totalSeverity) * 100
      : 0;

  const warningPercent = totalSeverity > 0
      ? (metrics.warningIncidents / totalSeverity) * 100
      : 0;

  const infoPercent = totalSeverity > 0
      ? (metrics.infoIncidents / totalSeverity) * 100
      : 0;
  return(
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Analytics
        </h1>

        <ThemeToggle/>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-6">
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <p className="text-medium text-gray-900 dark:text-slate-400 dark:text-slate-400">Total Incidents</p>
            <p className="text-3xl font-bold text-purple-500 mt-2">
              {metrics.totalIncidents}
            </p>
        </div>

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <p className="text-medium text-gray-900 dark:text-slate-400">MTTR</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {metrics.mttr}
          </p>
        </div>
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <p className="text-medium text-gray-900 dark:text-slate-400">System Availability</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {metrics.availability}
          </p>
        </div>
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <p className="text-medium text-gray-900 dark:text-slate-400">Error Rate</p>
          <p className="text-3xl font-bold text-red-500 mt-2">
            {metrics.errorRate}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 mt-6
          transition-all duration-300 hover:shadow-lg min-w-0">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-4">INCIDENT TREND</h2>
          <div className="h-80 bg-gray-50 rounded-xl p-6">
            <AnalyticsTrendChart/>
          </div>
        </div>


        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 mt-6
          transition-all duration-300 hover:shadow-lg min-w-0">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
            SEVERITY DISTRIBUTION
          </h2>

          <div className="space-y-6">
    
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-red-600">
                  Critical
                </span>
                <span className="text-gray-700 dark:text-slate-400">
                  {metrics.criticalIncidents}
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-3 bg-red-500 rounded-full"
                  style={{ width: `${criticalPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-amber-600">
                  Warning
                </span>
                <span className="text-gray-700 dark:text-slate-400">
                  {metrics.warningIncidents}
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-3 bg-amber-500 rounded-full"
                  style={{ width: `${warningPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-blue-600">
                  Info
                </span>
                <span className="text-gray-700 dark:text-slate-400">
                  {metrics.infoIncidents}
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-3 bg-blue-500 rounded-full"
                  style={{ width: `${infoPercent}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {role !== "VIEWER" && (
          <AIInsightCard
            title="Executive Report"
            icon={<FileText className="text-indigo-600" />}
            content={executiveReport}
            placeholder="Generate executive report."
            loading={generatingReport}
            buttonText="Generate Report"
            loadingText="Generating..."
            buttonColor="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => generateExecutiveReport()}
            onRegenerate={() => generateExecutiveReport(true)}
          />
        )}

        {role !== "VIEWER" && (
          <AIInsightCard
            title="AI Analytics Insights"
            icon={<Brain className="text-cyan-600"/>}
            content={analyticsInsights}
            placeholder="Analyze analytics trends."
            loading={analyzingInsights}
            buttonText="Analyze Analytics"
            loadingText="Analyzing..."
            buttonColor="bg-cyan-600 hover:bg-cyan-700"
            onClick={()=>analyzeAnalytics()}
            onRegenerate={()=>analyzeAnalytics(true)}
            />
        )}
        </div>
    </div>
  
  )
}