"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeverityBadge from "@/components/SeverityBadge";
import StatusBadge from "@/components/StatusBadge";
import AIInsightCard from "@/components/AIInsightCard";
import Link from "next/link"
import { ArrowLeft, 
  CirclePlus,
  RefreshCw,
  AlertTriangle,
  Server, 
  CheckCircle,
  FileText, Brain, FileSearch, Network, GitBranch} from "lucide-react";
import {toast} from "sonner";
import { isAdmin, isEngineer, isViewer } from "@/lib/roles";

type Incident = {
  id: string;
  title: string;
  description: string | null;
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";

  service: {
    id: string;
    name: string;

    logs:{
      id:string;
      level:string;
      message:string;
      createdAt:string;
    }[];
  } | null;

  createdAt: string;
  updatedAt: string;
};

type TimelineEvent={
  type: string;
  message: string;
};

export default function IncidentDetailsPage() {
  const { data: session } = useSession();
  const role = session?.user.role;
  const params = useParams();
  const router = useRouter();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [mttr, setMttr] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [logAnalysis, setLogAnalysis] = useState("");
  const [analyzingLogs, setAnalyzingLogs] = useState(false);

  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  const [timelineInsights, setTimelineInsights] = useState("");
  const [analyzingTimeline, setAnalyzingTimeline] = useState(false);

  const [dependencyExplanation, setDependencyExplanation] = useState("");
  const [analyzingDependencies, setAnalyzingDependencies] = useState(false);

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
          (e: TimelineEvent) =>
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

      setAnalysis(data.aiRootCauseAnalysis || "");
      setSummary(data.aiIncidentSummary || "");
      setLogAnalysis(data.aiLogAnalysis || "");
      setTimelineInsights(data.aiTimelineInsights || "");
      setDependencyExplanation(data.aiDependencyAnalysis || "");
      
      setLoading(false);
      
    }

    fetchIncident();
    const interval = setInterval(
      fetchIncident,
      10000
    );

    return () => clearInterval(interval);
  }, [params.id]);

  async function analyzeIncident(force=false) {
    try{
      if (!isAdmin(role) && !isEngineer(role)) {
          toast.error("Permission denied");
          return;
      }
      if(analysis && !force){
        toast.info("Root cause already generated");
        return;
      }
      if(!incident) return
      setAnalyzing(true);
        const res = await fetch("/api/ai-analysis",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: incident.id,
              title: incident.title,
              description: incident.description,
            }),
          }
        );

        const data = await res.json();

        setAnalysis(data.summary);
        toast.success("Root cause analysis complete");
      }

      catch {
        toast.error("Failed to generate Root Cause");
      }

      finally{
        setAnalyzing(false);
      }
    }

    async function analyzeLogs(force=false) {
      try{  
      if (!isAdmin(role) && !isEngineer(role)) {
        toast.error("Permission denied");
        return;
      }
      if(logAnalysis && !force){
        toast.info("Log already analyzed");
        return;
      }
        setAnalyzingLogs(true);

        const res = await fetch(
          "/api/ai-log-analysis",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: incident?.id,
              logs: incident?.service?.logs,
            }),
          }
        );

        const data = await res.json();

        setLogAnalysis(data.analysis);
        toast.success("Logs Analyzed");
      }
      
      catch {
        toast.error("Failed to generate Log analysis");
      }
      
      finally{
        setAnalyzingLogs(false);
      }
    }

    async function generateSummary(force=false) {
      try{  
        if (!isAdmin(role) && !isEngineer(role)) {
          toast.error("Permission denied");
          return;
        }
        if(summary && !force) {
          toast.info("Summary already exists");
          return;
        }
        setSummarizing(true);

        const res = await fetch(
          "/api/ai-summary",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: incident?.id,
              title: incident?.title,
              description: incident?.description,
              severity: incident?.severity,
              status: incident?.status,
            }),
          }
        );

        const data = await res.json();

        setSummary(data.summary);
        toast.success("AI summary generated");
      }

      catch {
        toast.error("Failed to generate summary");
      }

      finally{
        setSummarizing(false);
      }
    }

    async function generateTimelineInsights(force=false) {
      try{  
        if (!isAdmin(role) && !isEngineer(role)) {
          toast.error("Permission denied");
          return;
        }
        if(timelineInsights && !force){
          toast.info("Timeline Insights already generated");
          return;
        }
        setAnalyzingTimeline(true);

        const res = await fetch(
          "/api/ai-timeline",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: incident?.id,
              timeline,
            }),
          }
        );

        const data = await res.json();

        setTimelineInsights(data.insights);
        toast.success("Timeline Analyzed");
      }

      catch {
        toast.error("Failed to generate Timeline Insights");
      }

      finally{
        setAnalyzingTimeline(false);
      }
    }

    async function generateDependencyExplanation(force=false) {
      try{  
        if (!isAdmin(role) && !isEngineer(role)) {
          toast.error("Permission denied");
          return;
        }
        if(dependencyExplanation && !force){
          toast.info("Dependency analysis already exists");
          return;
        }
        if (!incident) return;

        setAnalyzingDependencies(true);

        const res = await fetch(
          "/api/ai-service-dependency",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: incident.id,
              serviceName: incident.service?.name,
              incidentTitle: incident.title,
            }),
          }
        );

        const data = await res.json();

        setDependencyExplanation(data.explanation);
        toast.success("Dependencies Analyzed");
      }

      catch {
        toast.error("Failed to generate Dependencies");
      }

      finally{
        setAnalyzingDependencies(false);
      }
    }

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
      toast.error("Failed to delete incident");
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

      const updated = await fetch(`/api/incidents/${incident.id}`);
      const data = await updated.json();

      setIncident(data);
    } else {
      toast.error("Failed to resolve incident");
    }
  }

  if (loading) {
    return (
      <div className=" min-h-screen flex items-center justify-center">
        <div className="text-xl text-green-700">
          Loading incident...
        </div>
      </div>
    );
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
          #{incident.id.slice(0, 8)}
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            {incident.title}
          </h1>

          <div className="flex gap-3">
            {(isAdmin(role) || isEngineer(role)) && (
              <Link
                href={`/incidents/${incident.id}/edit`}
                className=" bg-green-700 text-white px-4 py-2
                  rounded-xl hover:bg-green-800 transition-colors
                "
              >
                Edit Incident
              </Link>
            )}

            {(isAdmin(role) || isEngineer(role)) &&
              incident.status !== "RESOLVED" && (
                <button
                  onClick={handleResolve}
                  className=" bg-blue-600 text-white px-4 py-2
                    rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Resolve Incident
                </button>
              )}

            {isAdmin(role) && (
              <button
                onClick={handleDelete}
                className=" bg-red-600 text-white px-4 py-2
                  rounded-xl hover:bg-red-700 transition-colors "
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

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Created
          </p>

          <p className="font-semibold">
            {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Last Updated
          </p>

          <p className="font-semibold">
            {new Date(incident.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {!isViewer(role) && (  
          <AIInsightCard
            title="AI Incident Summary"
            icon={<FileText className="text-cyan-600" />}
            content={summary}
            placeholder="Generate an executive summary."
            loading={summarizing}
            buttonText="Generate"
            loadingText="Generating..."
            buttonColor="bg-cyan-600 hover:bg-cyan-700"
            onClick={()=>generateSummary()}
            onRegenerate={()=>generateSummary(true)}
          />)}

        {!isViewer(role) && (  
          <AIInsightCard
            title="AI Root Cause Analysis"
            icon={<Brain className="text-purple-600" />}
            content={analysis}
            placeholder="Analyze the incident root cause."
            loading={analyzing}
            buttonText="Analyze"
            loadingText="Analyzing..."
            buttonColor="bg-purple-600 hover:bg-purple-700"
            onClick={()=>analyzeIncident()}
            onRegenerate={()=>analyzeIncident(true)}
          />)}
        </div>
          
        {/*Logs Explorer*/}
        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6
              transition-all duration-300 hover:shadow-lg mt-12">
          <h2 className="flex flex-wrap text-xl font-semibold text-green-900 dark:text-green-400 mb-4">
            LOGS EXPLORER
          </h2>
                    
          {incident.service?.logs?.length ? (
            incident.service?.logs?.map((log) => (
            <div
              key={log.id}
              className=" text-sm grid flex-wrap grid-cols-[80px_90px_minmax(0,1fr)] hover:bg-gray-100 rounded-lg
                px-2 transition-colors duration-200 border-b border-gray-100 py-3 items-center"
            >
              <p className="text-gray-700 dark:text-slate-400">
                {new Date(log.createdAt).toLocaleTimeString()}
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
          ))
          ) : ( <p className="text-gray-500">
                No logs available.
              </p>
        )}
        </div>

      <div className="grid grid-cols-2 gap-6">
        {!isViewer(role) && (  
          <AIInsightCard
            title="AI Log Analysis"
            icon={<FileSearch className="text-amber-600" />}
            content={logAnalysis}
            placeholder="Analyze logs and detect suspicious events."
            loading={analyzingLogs}
            buttonText="Analyze Logs"
            loadingText="Analyzing..."
            buttonColor="bg-amber-600 hover:bg-amber-700"
            onClick={()=>analyzeLogs()}
            onRegenerate={()=>analyzeLogs(true)}
          />)}

        {!isViewer(role) && (  
          <AIInsightCard
            title="AI Service Dependency Analysis"
            icon={<Network className="text-teal-600" />}
            content={dependencyExplanation}
            placeholder="Analyze service dependencies and failure propagation."
            loading={analyzingDependencies}
            buttonText="Analyze"
            loadingText="Analyzing..."
            buttonColor="bg-teal-600 hover:bg-teal-700"
            onClick={()=>generateDependencyExplanation()}
            onRegenerate={()=>generateDependencyExplanation(true)}
          />)}
      </div>

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700
          rounded-2xl shadow-sm p-6 mt-12 transition-all duration-300 hover:shadow-lg ">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
            TIMELINE
          </h2>

          <div className="space-y-6 max-h-[400px] overflow-y-auto">
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

        {!isViewer(role) && (  
          <AIInsightCard
            title="AI Timeline Insights"
            icon={<GitBranch className="text-indigo-600" />}
            content={timelineInsights}
            placeholder="Analyze timeline escalation and resolution."
            loading={analyzingTimeline}
            buttonText="Analyze Timeline"
            loadingText="Analyzing..."
            buttonColor="bg-indigo-600 hover:bg-indigo-700"
            onClick={()=>generateTimelineInsights()}
            onRegenerate={()=>generateTimelineInsights(true)}
          />)}

    </div>
  );
}