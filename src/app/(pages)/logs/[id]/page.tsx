"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import AIInsightCard from "@/components/AIInsightCard";

type Log = {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  service: {
    id: string;
    name: string;
  };
};

export default function LogDetailsPage() {
  const params = useParams();

  const [log, setLog] = useState<Log | null>(null);
  const [logAnalysis, setLogAnalysis] = useState("");
  const [analyzingLog, setAnalyzingLog] = useState(false);

  useEffect(() => {
    async function fetchLog() {
      const res = await fetch(`/api/logs/${params.id}`);

      const data = await res.json();

      setLog(data);
    }

    fetchLog();
  }, [params.id]);

  async function analyzeLog(force = false) {
    if (logAnalysis && !force) return;

    try {
      setAnalyzingLog(true);

      const res = await fetch(
        "/api/ai-log-analysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logs: [log],
          }),
        }
      );  

      const data = await res.json();

      setLogAnalysis(data.analysis);

    } finally {
      setAnalyzingLog(false);
    }
  }

  if (!log) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <Link
        href="/logs"
        className=" inline-flex items-center gap-2 text-gray-600 hover:text-green-900 dark:text-green-400 mb-6"
      >
        <ArrowLeft size={18}/>
        Back to Logs
      </Link>

      <div className="
        bg-white dark:bg-emerald-950
        border border-gray-200 dark:border-slate-700
        rounded-2xl
        shadow-sm
        p-6
      ">

        <div className="flex items-center justify-between mb-4">

          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            Log Details
          </h1>

          <span
            className={`
              px-3 py-1 rounded-full text-sm font-medium

              ${
                log.level === "ERROR"
                  ? "bg-red-100 text-red-700"
                  : log.level === "WARNING"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700"
              }
            `}
          >
            {log.level}
          </span>

        </div>

        <div className="space-y-6">

          <div>
            <p className="text-sm text-gray-500">
              Timestamp
            </p>

            <p className="text-gray-700 dark:text-slate-400">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Service
            </p>

            <Link
              href={`/services/${log.service.id}`}
              className="text-green-700 hover:underline"
            >
              {log.service.name}
            </Link>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Message
            </p>

            <p className="text-gray-700 dark:text-slate-400">
              {log.message}
            </p>
          </div>

        </div>

      </div>

      <AIInsightCard
        title="AI Log Analysis"
        icon={<FileText className="text-cyan-600" />}
        content={logAnalysis}
        placeholder="Generate an executive summary."
        loading={analyzingLog}
        buttonText="Generate"
        loadingText="Generating..."
        buttonColor="bg-cyan-600 hover:bg-cyan-700"
        onClick={()=>analyzeLog()}
        onRegenerate={()=>analyzeLog(true)}
      />

    </div>
  );
}