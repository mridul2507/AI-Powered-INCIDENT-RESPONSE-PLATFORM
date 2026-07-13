"use client";

import {
  Building2,
  Bell,
  TriangleAlert,
  BrainCircuit,
  Workflow,
  Plug,
  Settings2,
} from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "alerts", label: "Alert Policies", icon: TriangleAlert },
  { id: "ai", label: "AI Configuration", icon: BrainCircuit },
  { id: "automation", label: "Automation", icon: Workflow },
  { id: "integrations", label: "Integrations", icon: Plug },
];

export default function SettingsSidebar({
  active,
  setActive,
}: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-emerald-950 rounded-2xl border border-gray-200 dark:border-slate-700 p-4">

      <div className="space-y-2">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all

              ${
                active === tab.id
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400"
                  : "hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}