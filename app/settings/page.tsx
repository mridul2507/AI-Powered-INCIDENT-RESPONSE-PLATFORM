"use client";

import { useState } from "react";

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative
        w-12
        h-6
        rounded-full
        transition-all
        duration-300
        ${enabled ? "bg-green-500" : "bg-gray-300"}
      `}
    >
      <div
        className={`
          absolute
          top-1
          w-4
          h-4
          bg-white
          rounded-full
          shadow-sm
          transition-all
          duration-300
          ${enabled ? "left-7" : "left-1"}
        `}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
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
    
  const [darkMode, setDarkMode] = useState(false);
  const [compactLayout, setCompactLayout] = useState(false);
  const [animations, setAnimations] = useState(true);

  const [slackIntegration, setSlackIntegration] = useState(true);
  const [pagerDutyIntegration, setPagerDutyIntegration] = useState(false);
  const [jiraIntegration, setJiraIntegration] = useState(true);
  return (
    
    <div className="bg-white min-h-screen p-8">

      <h1 className="text-3xl font-bold text-green-900 mb-8">
        Settings
      </h1>

      <div className="grid grid-cols-[250px_1fr] gap-8">

        {/* Sidebar */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 h-fit">

          <div className="space-y-2">

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all
                ${
                  activeTab === "notifications"
                    ? "bg-green-100 text-green-900 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              Notifications
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all
                ${
                  activeTab === "ai"
                    ? "bg-green-100 text-green-900 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              AI Analysis
            </button>

            <button
              onClick={() => setActiveTab("automation")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all
                ${
                  activeTab === "automation"
                    ? "bg-green-100 text-green-900 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              Automation
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all
                ${
                  activeTab === "appearance"
                    ? "bg-green-100 text-green-900 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              Appearance
            </button>

            <button
              onClick={() => setActiveTab("integrations")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all
                ${
                  activeTab === "integrations"
                    ? "bg-green-100 text-green-900 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              Integrations
            </button> 

          </div>

        </div>

        {/* NOTIFICATIONS */}

        <div className="space-y-6">
          {activeTab === "notifications" && (
            <>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Notification Preferences
            </h2>

            <p className="text-gray-500 mb-6">
              Configure how alerts and incidents are delivered.
            </p>

            <div className="space-y-5">

              <div className="flex justify-between items-center border-b border-gray-100 pb-4
              hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors duration-200">
                <div>
                  <p className="text-gray-700 font-medium">
                    Email Alerts
                  </p>

                  <p className="text-sm text-gray-500">
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
                  <p className="text-gray-700 font-medium">
                    Slack Notifications
                  </p>

                  <p className="text-sm text-gray-500">
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
                  <p className="text-gray-700 font-medium">
                    SMS Alerts
                  </p>

                  <p className="text-sm text-gray-500">
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

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Incident Severity Rules
            </h2>

            <p className="text-gray-500 mb-6">
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

          {/*AI ANALYSIS*/}
          {activeTab === "ai" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                AI Analysis
              </h2>

              <p className="text-gray-500 mb-6">
                Configure AI powered incident investigation.
              </p>

              <div className="space-y-5">

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 font-medium">Root Cause Analysis</p>
                    <p className="text-sm text-gray-500">
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
                    <p className="text-gray-700 font-medium">Anomaly Detection</p>
                    <p className="text-sm text-gray-500">
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
                    <p className="text-gray-700 font-medium">Confidence Threshold</p>
                    <p className="text-sm text-gray-500">
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
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-6">
              Automation Rules
            </h2>

            <div className="space-y-5">

              <div className="text-gray-700 flex justify-between">
                <span>Auto Assign Incidents</span>
                <Toggle
                  enabled={autoAssign}
                  onToggle={() => setAutoAssign(!autoAssign)}
                />
              </div>

              <div className="text-gray-700 flex justify-between">
                <span>Auto Escalation</span>
                <Toggle
                  enabled={autoEscalation}
                  onToggle={() => setAutoEscalation(!autoEscalation)}
                />
              </div>

              <div className="text-gray-700 flex justify-between">
                <span>Auto Resolution Suggestions</span>
                <Toggle
                  enabled={autoResolution}
                  onToggle={() => setAutoResolution(!autoResolution)}
                />
              </div>

            </div>
          </div>
        )}

        {/*APPEARANCE SECTION*/}
        {activeTab === "appearance" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-6">
              Appearance
            </h2>

            <div className="space-y-5">

              <div className="text-gray-700 flex justify-between">
                <span>Dark Mode</span>
                <Toggle
                  enabled={darkMode}
                  onToggle={() => setDarkMode(!darkMode)}
                />

              </div>

              <div className="text-gray-700 flex justify-between">
                <span>Compact Layout</span>
                <Toggle
                  enabled={compactLayout}
                  onToggle={() => setCompactLayout(!compactLayout)}
                />
              </div>

              <div className="text-gray-700 flex justify-between">
                <span>Animations</span>
                <Toggle
                  enabled={animations}
                  onToggle={() => setAnimations(!animations)}
                />
              </div>

            </div>
          </div>
        )}

        {/*INTEGRATIONS SECTION*/}
        {activeTab === "integrations" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-6">
              Integrations
            </h2>

            <div className="space-y-5">

              <div className="text-gray-700 flex justify-between">
                <span>Slack</span>
                <Toggle
                  enabled={slackIntegration}
                  onToggle={() => setSlackIntegration(!slackIntegration)}
                />
              </div>

              <div className="text-gray-700 flex justify-between">
                <span>PagerDuty</span>
                <Toggle
                  enabled={pagerDutyIntegration}
                  onToggle={() => setPagerDutyIntegration(!pagerDutyIntegration)}
                />
              </div>

              <div className="text-gray-700 flex justify-between">
                <span>Jira</span>
                <Toggle
                  enabled={jiraIntegration}
                  onToggle={() => setJiraIntegration(!jiraIntegration)}
                />
              </div>

            </div>
          </div>
        )}

        </div>


      </div>

    </div>
  );
}