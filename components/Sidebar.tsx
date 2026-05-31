"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  AlertTriangle,
  Server,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
  Shield,
} from "lucide-react";

const generalItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Incidents",
    icon: AlertTriangle,
    href: "/incidents",
  },
  {
    title: "Services",
    icon: Server,
    href: "/services",
  },
  {
    title: "Logs",
    icon: FileText,
    href: "/logs",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
];

const systemItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
  return (
    
    <div
        className={`
            relative min-h-screen bg-green-950 text-white p-6
            flex flex-col border-r border-green-900
            transition-all duration-300
            ${isCollapsed ? "w-20" : "w-72"}
        `}>

      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          absolute
          top-6
          -right-5
          w-8
          h-8
          rounded-lg
          bg-gray-300
          border border-gray-500
          text-black
          flex
          items-center
          justify-center
          cursor-pointer
          hover:bg-green-800
          hover:text-white
          transition-all
          
        "
      >
        <ChevronLeft
          size={16}
          className={`
            transition-transform duration-300
            ${isCollapsed ? "rotate-180" : ""}
          `}
        />
      </div>
      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-xl bg-green-900">
                <Shield className="w-6 h-6" />
            </div>

            {!isCollapsed && (
                <div>
                    <h1 className="text-3xl font-bold">
                        IR Assist
                    </h1>

                    <p className="text-xs text-green-200">
                        Incident Platform
                    </p>
                </div>
            )}
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
                <Link
                  key={item.title}
                  href={item.href}
                  className={`
                    flex items-center
                    ${isCollapsed ? "justify-center" : "gap-3"}
                    p-3 rounded-xl
                    cursor-pointer
                    transition-all
                    hover:bg-green-900
                    ${
                      pathname === item.href
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
                </Link>
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
                <Link
                  key={item.title}
                  href={item.href}
                  className={`
                    flex items-center
                    ${isCollapsed ? "justify-center" : "gap-3"}
                    p-3 rounded-xl
                    cursor-pointer
                    transition-all
                    hover:bg-green-900
                    ${
                      pathname === item.href
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
                </Link>
              );
            })}

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
          <div className="flex justify-center mt-6">
            <LogOut
              size={24}
              className="
                cursor-pointer
                hover:text-green-300
                transition-all
              "
            />
          </div>
        )}

      </div>

    </div>
  );
}