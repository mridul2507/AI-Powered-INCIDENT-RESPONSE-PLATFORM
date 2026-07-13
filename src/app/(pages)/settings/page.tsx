"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import Toggle from "@/components/settings/Toggle";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [orgName, setOrgName] = useState("IR Assist");
  const [orgSlug, setOrgSlug] = useState("ir-assist");

  const { data: session, status } = useSession();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [session]);

  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("English");

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const [criticalRules, setCriticalRules] = useState(true);
  const [warningRules, setWarningRules] = useState(true);
  const [infoRules, setInfoRules] = useState(false);

  const [rootCauseAnalysis, setRootCauseAnalysis] = useState(true);
  const [anomalyDetection, setAnomalyDetection] = useState(true);

  const [autoAssign, setAutoAssign] = useState(true);
  const [autoEscalation, setAutoEscalation] = useState(true);
  const [autoResolution, setAutoResolution] = useState(false);
    

  const [slackIntegration, setSlackIntegration] = useState(true);

  const [,setLoading]=useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {

    async function loadSettings(){

    const res=await fetch("/api/settings");

    const data=await res.json();

    setOrgName(data.name);

    setOrgSlug(data.slug);

    setLanguage(data.language);

    setTimezone(data.timezone);

    setEmailAlerts(data.emailAlerts);

    setSlackAlerts(data.slackAlerts);

    setSmsAlerts(data.smsAlerts);

    setCriticalRules(data.criticalAlerts);

    setWarningRules(data.warningAlerts);

    setInfoRules(data.infoAlerts);

    setRootCauseAnalysis(data.rootCauseAnalysis);

    setAnomalyDetection(data.anomalyDetection);

    setAutoAssign(data.autoAssign);

    setAutoEscalation(data.autoEscalation);

    setAutoResolution(data.autoResolution);

    setSlackIntegration(data.slackIntegration);

    setLoading(false);

    }

    loadSettings();

    },[]);

  if (status === "loading") {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>
  );
}

    async function saveSettings(){

      const res=await fetch("/api/settings",{

      method:"PUT",

      headers:{
      "Content-Type":"application/json"
      },

      body:JSON.stringify({

      name:orgName,

      slug:orgSlug,

      language,

      timezone,

      emailAlerts,

      slackAlerts,

      smsAlerts,

      criticalAlerts:criticalRules,

      warningAlerts:warningRules,

      infoAlerts:infoRules,

      rootCauseAnalysis,

      anomalyDetection,

      autoAssign,

      autoEscalation,

      autoResolution,

      slackIntegration,

      })

      });

      if(res.ok){

      toast.success("Settings saved");

      }else{

      toast.error("Failed to save");

      }

      }

  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-emerald-900 p-8">
      

      <SettingsHeader />
       
      <div className="grid grid-cols-[280px_1fr] gap-8">

        {/* Sidebar */}

        <SettingsSidebar
          active={activeTab}
          setActive={setActiveTab}
        />

        {/* GENERAL */}

        {activeTab === "general" && (

        <div className="space-y-6 w-full">

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">

        <h2 className="text-2xl font-bold mb-6">
        General Settings
        </h2>

        <div className="grid grid-cols-2 gap-6">

        <div>

        <label className="text-sm font-medium">
        Full Name
        </label>

        <input
        className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-white
            dark:text-black p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
        value={fullName}
        onChange={(e)=>setFullName(e.target.value)}
        />

        </div>

        <div>

        <label className="text-sm font-medium">
        Email
        </label>

        <input
        disabled
        className="mt-2 w-full rounded-xl border p-3 bg-gray-100 dark:text-black"
        value={email}
        />

        </div>

        <div>

        <label className="text-sm font-medium">
        Language
        </label>

        <select
        className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-white
            dark:text-black p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
        value={language}
        onChange={(e)=>setLanguage(e.target.value)}
        >

        <option>English</option>
        <option>German</option>
        <option>French</option>

        </select>

        </div>

        <div>

        <label className="text-sm font-medium">
        Timezone
        </label>

        <select
        className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-white
            dark:text-black p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
        value={timezone}
        onChange={(e)=>setTimezone(e.target.value)}
        >

        <option>UTC</option>
        <option>Asia/Kolkata</option>
        <option>Europe/London</option>

        </select>

        </div>

        </div>

        </div>

        </div>

        )}

        {/* ORGANIZATION */}

        {activeTab==="organization" && (

        <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">

        <h2 className="text-2xl font-bold mb-6">
        Organization
        </h2>

        <div className="space-y-5">

        <div>

        <label className="text-sm font-medium">
        Organization Name
        </label>

        <input
        className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-white
            dark:text-black p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
        value={orgName}
        onChange={(e)=>setOrgName(e.target.value)}
        />

        </div>

        <div>

        <label className="text-sm font-medium">
        Slug
        </label>

        <input
        className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-white
            dark:text-black p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
        value={orgSlug}
        onChange={(e)=>setOrgSlug(e.target.value)}
        />

        </div>

        </div>

        </div>

        )}

        {/* NOTIFICATIONS */}

        <div className="space-y-6">
          {activeTab === "notifications" && (
            <>

          <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-2">
              Notification Preferences
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Configure how alerts and incidents are delivered.
            </p>

            <div className="space-y-5">

              <div className="flex justify-between items-center border-b border-gray-100 pb-4
              hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors duration-200">
                <div>
                  <p className="text-gray-700 dark:text-slate-400 font-medium">
                    Email Alerts
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Receive incident updates via email.
                  </p>
                </div>

                <Toggle
                  enabled={emailAlerts}
                  onToggle={() => setEmailAlerts(!emailAlerts)}
                />
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-4
              hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors duration-200">
                <div>
                  <p className="text-gray-700 dark:text-slate-400 font-medium">
                    Slack Notifications
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Send alerts directly to Slack.
                  </p>
                </div>

                <Toggle
                  enabled={slackAlerts}
                  onToggle={() => setSlackAlerts(!slackAlerts)}
                />
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-4
              hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors duration-200">
                <div>
                  <p className="text-gray-700 dark:text-slate-400 font-medium">
                    SMS Alerts
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Receive critical alerts on mobile.
                  </p>
                </div>

                <Toggle
                  enabled={smsAlerts}
                  onToggle={() => setSmsAlerts(!smsAlerts)}
                />
              </div>

            </div>

          </div>

          <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-2">
              Incident Severity Rules
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Define which incident levels trigger notifications.
            </p>

            <div className="space-y-4">

              <div className="flex justify-between items-center">
                <span className="text-red-600 font-medium">
                  Critical
                </span>

                <Toggle
                  enabled={criticalRules}
                  onToggle={() => setCriticalRules(!criticalRules)}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-amber-600 font-medium">
                  Warning
                </span>

                <Toggle
                  enabled={warningRules}
                  onToggle={() => setWarningRules(!warningRules)}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">
                  Info
                </span>

                <Toggle
                  enabled={infoRules}
                  onToggle={() => setInfoRules(!infoRules)}
                />
              </div>

            </div>

          </div>
            </>
          )}

          {activeTab === "alerts" && (

            <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-6">
            Alert Policies
            </h2>

            <p className="text-gray-500 mb-6">
            Configure which incidents trigger notifications.
            </p>

            <div className="space-y-6">

            <div className="flex items-center justify-between">

            <div>

            <h3 className="font-semibold">
            Critical Alerts
            </h3>

            <p className="text-sm text-gray-500">
            Notify immediately for production failures.
            </p>

            </div>

            <Toggle
            enabled={criticalRules}
            onToggle={() => setCriticalRules(!criticalRules)}
            />

            </div>

            <div className="flex items-center justify-between">

            <div>

            <h3 className="font-semibold">
            Warning Alerts
            </h3>

            <p className="text-sm text-gray-500">
            Notify engineering team.
            </p>

            </div>

            <Toggle
            enabled={warningRules}
            onToggle={() => setWarningRules(!warningRules)}
            />

            </div>

            <div className="flex items-center justify-between">

            <div>

            <h3 className="font-semibold">
            Information Alerts
            </h3>

            <p className="text-sm text-gray-500">
            Record informational events only.
            </p>

            </div>

            <Toggle
            enabled={infoRules}
            onToggle={() =>setInfoRules(!infoRules)}
            />

            </div>

            </div>

            </div>

            )}

          {/*AI ANALYSIS*/}
          {activeTab === "ai" && (
            <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-2">
                AI Analysis
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mb-6">
                Configure AI powered incident investigation.
              </p>

              <div className="space-y-5">

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 dark:text-slate-400 font-medium">Root Cause Analysis</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Automatically generate root cause reports.
                    </p>
                  </div>

                  <Toggle
                    enabled={rootCauseAnalysis}
                    onToggle={() => setRootCauseAnalysis(!rootCauseAnalysis)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 dark:text-slate-400 font-medium">Anomaly Detection</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Detect unusual system behavior.
                    </p>
                  </div>

                  <Toggle
                    enabled={anomalyDetection}
                    onToggle={() => setAnomalyDetection(!anomalyDetection)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 dark:text-slate-400 font-medium">Confidence Threshold</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Minimum AI confidence required.
                    </p>
                  </div>

                  <span className="text-green-700 font-semibold">
                    85%
                  </span>
                </div>

              </div>
            </div>
          )}

          {/*AUTOMATION SECTION*/}
          {activeTab === "automation" && (
          <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
              Automation Rules
            </h2>

            <div className="space-y-5">

              <div className="text-gray-700 dark:text-slate-400 flex justify-between">
                <span>Auto Assign Incidents</span>
                <Toggle
                  enabled={autoAssign}
                  onToggle={() => setAutoAssign(!autoAssign)}
                />
              </div>

              <div className="text-gray-700 dark:text-slate-400 flex justify-between">
                <span>Auto Escalation</span>
                <Toggle
                  enabled={autoEscalation}
                  onToggle={() => setAutoEscalation(!autoEscalation)}
                />
              </div>

              <div className="text-gray-700 dark:text-slate-400 flex justify-between">
                <span>Auto Resolution Suggestions</span>
                <Toggle
                  enabled={autoResolution}
                  onToggle={() => setAutoResolution(!autoResolution)}
                />
              </div>

            </div>
          </div>
        )}

        
        {/*INTEGRATIONS SECTION*/}
        {activeTab === "integrations" && (
          <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
              Integrations
            </h2>

            <div className="space-y-5">

              <div className="text-gray-700 dark:text-slate-400 flex justify-between">
                <span>Slack</span>
                <Toggle
                  enabled={slackIntegration}
                  onToggle={() => setSlackIntegration(!slackIntegration)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">

          <button
            type="button"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-white px-6 py-3 font-semibold shadow"
            onClick={saveSettings}
            >

          Save Changes

          </button>

          </div>

        </div>


      </div>

    </div>
  );
}