"use client";

import { useState } from "react";

import {
  LayoutDashboard,
  AlertTriangle,
  Server,
  FileText,
  BarChart3,
  Settings,
  Moon,
  ChevronLeft,
  LogOut,
} from "lucide-react";

const generalItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Incidents",
    icon: AlertTriangle,
  },
  {
    title: "Services",
    icon: Server,
  },
  {
    title: "Logs",
    icon: FileText,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
];

const systemItems = [
  {
    title: "Settings",
    icon: Settings,
  },
  {
    title: "Dark Mode",
    icon: Moon,
  },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    
    <div
        className={`
            h-screen bg-green-950 text-white p-6
            flex flex-col border-r border-green-900
            transition-all duration-300
            ${isCollapsed ? "w-20" : "w-72"}
        `}>
      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div
            className={`
                flex items-center mb-10
                ${isCollapsed ? "justify-center" : "justify-between"}
            `}>
          {!isCollapsed && (
            <h1 className="text-4xl font-bold">
                IR Assist
            </h1>
            )}

          <div onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-green-900 cursor-pointer transition-all">
            <ChevronLeft size={20} />
          </div>

        </div>

        {/* GENERAL */}
        <div className="flex flex-col gap-3">
        
        {!isCollapsed && (
          <p className="text-green-200 text-sm uppercase tracking-widest">
            General
          </p>
        )}

          <div className="flex flex-col gap-2">

            {generalItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`
                    flex items-center 
                    ${isCollapsed ? "justify-center" : "gap-3"}
                    p-3 rounded-xl
                    cursor-pointer
                    transition-all
                    hover:bg-green-900
                    ${
                      item.title === "Dashboard"
                        ? "bg-green-900"
                        : ""
                    }
                  `}
                >

                  <Icon className="w-6 h-6 shrink-0" />

                  {!isCollapsed && (
                    <span className="text-lg">
                        {item.title}
                    </span>
                    )}

                </div>
              );
            })}

          </div>

        </div>

        {/* SYSTEM */}
        <div className="flex flex-col gap-3 mt-10">
        {!isCollapsed &&(
          <p className="text-green-200 text-sm uppercase tracking-widest">
            System
          </p>
        )}

          <div className="flex flex-col gap-2">

            {systemItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`
                    flex items-center
                    ${isCollapsed ? "justify-center" : "gap-3"}
                    p-3 rounded-xl
                    cursor-pointer
                    transition-all
                    hover:bg-green-900
                  `}
                >

                  <Icon className="w-6 h-6 shrink-0" />

                  {!isCollapsed && (
                    <span className="text-lg">
                        {item.title}
                    </span>
                    )}

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* BOTTOM PROFILE */}
      <div className="mt-auto border-t border-green-900 pt-6">

        <div className="flex items-center gap-3">

          <div className="w-6 h-6 shrink-0 rounded-full bg-green-700"></div>

          <div>
            {!isCollapsed && (
            <p className="font-semibold">
              UserName
            </p>
            )}

            {!isCollapsed &&(
            <p className="text-green-200 text-sm">
              Admin
            </p>
            )}
          </div>

        </div>
        
        {!isCollapsed && (
        <button className="
          mt-6
          text-lg
          hover:text-green-300
          transition-all
        ">
          Log out
        </button>
        )}

        {isCollapsed && (
            <LogOut className="
                mt-6
                text-lg
                hover:text-green-300
                transition-all
                "size={20}/>
          )}

      </div>

    </div>
  );
}