"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

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
  History,
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
    title: "Audit Logs",
    icon: History,
    href: "/audit-logs",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const pathname = usePathname();
  return (
    
    <div
        className={`
            relative min-h-screen bg-green-950 text-white p-6
            flex flex-col border-r border-green-900
            transition-[width] duration-300 ease-in-out
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
          rounded-xl
          bg-white dark:bg-emerald-950
          border
          border-gray-200 dark:border-slate-700
          text-green-800
          shadow-md

          flex
          items-center
          justify-center

          cursor-pointer

          transition-transform
          duration-300

          hover:bg-green-900
          hover:text-white
          hover:scale-110
          hover:shadow-lg

          active:scale-95
        "
      >
        <ChevronLeft
          size={20}
          className={`
            transition-transform duration-300
            ${isCollapsed ? "rotate-180" : ""}
          `}
        />
      </div>
      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div
          className={`
            flex items-center
            ${isCollapsed ? "justify-center" : "gap-3"}
            mb-10
          `}
        >
          <div className="p-2 rounded-xl bg-green-900 shrink-0">
            <Shield className="w-6 h-6" />
          </div>

          {!isCollapsed && (
            <div
              className="
                overflow-hidden
                whitespace-nowrap
                transition-opacity
                duration-300
              "
            >
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
                    transition-transform
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
                    <span className={`
                      text-lg
                      overflow-hidden
                      whitespace-nowrap
                      transition-opacity duration-200
                      ${isCollapsed ? "opacity-0" : "opacity-100"}
                    `}
                  >
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
                    transition-transform
                    duration-200
                    hover:bg-green-900
                    hover:text-white
                    ${
                      pathname === item.href
                        ? "bg-green-900"
                        : ""
                    }
                  `}
                >
                  <Icon className="w-6 h-6 shrink-0" />

                  {!isCollapsed && (
                    <span className={`
                      text-lg
                      whitespace-nowrap
                      transition-transform
                      duration-300
                      overflow-hidden
                      ${
                        isCollapsed
                          ? "opacity-0 w-0"
                          : "opacity-100 w-auto"
                      }
                    `}>
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
              {session?.user.role}
            </p>
            )}
          </div>

        </div>
        
        {!isCollapsed && (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="
            mt-6
            text-lg
            hover:text-green-300
            transition-transform
          "
        >
          Log out
        </button>
        )}

        {isCollapsed && (
          <div className="flex justify-center mt-6">
            <LogOut
              size={24}
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="
                cursor-pointer
                hover:text-green-300
                transition-transform
              "
            />
          </div>
        )}

      </div>

    </div>
  );
}