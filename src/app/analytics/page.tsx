"use client"

import ThemeToggle from "@/components/ThemeToggle"
import { useState } from "react";
import AIInsightCard from "@/components/AIInsightCard";
import { FileText, Brain } from "lucide-react";

export default function AnalyticsPage(){
  const [executiveReport, setExecutiveReport] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [analyticsInsights,setAnalyticsInsights]=useState("");
  const [analyzingInsights,setAnalyzingInsights]=useState(false);
  const metrics = {
    totalIncidents: 124,
    mttr: "42 min",
    availability: "99.8%",
    errorRate: "1.4%",
    criticalIncidents: 12,
    warningIncidents: 45,
    infoIncidents: 67,
  };

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
            <p className="text-3xl font-bold text-purple-500 mt-2">124</p>
        </div>

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <p className="text-medium text-gray-900 dark:text-slate-400">MTTR</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">42 min</p>
        </div>
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <p className="text-medium text-gray-900 dark:text-slate-400">System Availability</p>
          <p className="text-3xl font-bold text-green-600 mt-2">99.8%</p>
        </div>
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <p className="text-medium text-gray-900 dark:text-slate-400">Error Rate</p>
          <p className="text-3xl font-bold text-red-500 mt-2">1.4%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 mt-6
          transition-all duration-300 hover:shadow-lg min-w-0">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-4">Incident Trend</h2>
          <div className="h-80 bg-gray-50 rounded-xl p-6">
          <div className="h-full flex items-end justify-between gap-3">

            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-10 h-24 rounded-t-md"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Mon</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-10 h-32 rounded-t-md"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Tue</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-amber-500 w-10 h-20 rounded-t-md"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Wed</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-10 h-40 rounded-t-md"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Thu</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-red-500 w-10 h-56 rounded-t-md"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Fri</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-amber-500 w-10 h-36 rounded-t-md"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Sat</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-10 h-28 rounded-t-md"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Sun</p>
            </div>

          </div>
        </div>
        </div>


        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 mt-6
          transition-all duration-300 hover:shadow-lg min-w-0">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
            Severity Distribution
          </h2>

          <div className="space-y-6">
    
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-red-600">
                  Critical
                </span>
                <span className="text-gray-700 dark:text-slate-400">
                  12
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-3 w-[15%] bg-red-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-amber-600">
                  Warning
                </span>
                <span className="text-gray-700 dark:text-slate-400">
                  45
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-3 w-[55%] bg-amber-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-blue-600">
                  Info
                </span>
                <span className="text-gray-700 dark:text-slate-400">
                  67
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-3 w-[50%] bg-blue-500 rounded-full"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
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
        </div>
    </div>
  
  )
}