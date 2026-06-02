"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const services = [
  {
    name: "Payment Service",
    status: "Critical",
    responseTime: "1.8s",
    uptime: "97.2%",
    lastIncident: "2 min ago",
  },
  {
    name: "User Service",
    status: "Healthy",
    responseTime: "120ms",
    uptime: "99.9%",
    lastIncident: "None",
  },
  {
    name: "Notification Service",
    status: "Healthy",
    responseTime: "180ms",
    uptime: "99.7%",
    lastIncident: "None",
  },
  {
    name: "User Database",
    status: "Warning",
    responseTime: "850ms",
    uptime: "98.5%",
    lastIncident: "15 min ago",
  },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.status.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6 max-w-7xl">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Services
        </h1>

        <ThemeToggle/>
      </div>

      <div className="relative mb-6">
        <Search
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            w-5
            h-5
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-12
            pr-4
            py-3
            text-gray-700
            border
            border-gray-300
            rounded-xl
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black  
          "
        />

      </div>

      <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-4 bg-gray-50 font-semibold text-gray-700">
            <p>Service Name</p>
            <p>Status</p>
            <p>Response Time</p>
            <p>Uptime</p>
            <p>Last Incident</p>
        </div>

        {filteredServices.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">
            No services found.
          </div>
        )}

        {/* Rows */}
        {filteredServices.map((service) => (
          <div 
            key={service.name}
            className="grid
                grid-cols-[2fr_1fr_1fr_1fr_1fr]
                p-4
                border-t
                border-gray-200 dark:border-slate-700
                items-center"
            >

                <div>
                  <Link
                   href={`/services/${service.name}`}
                   className="
                      inline-block
                      font-medium 
                      text-green-700 
                      hover:text-green-900 dark:text-green-400 
                      hover:underline 
                      cursor-pointer
                      transition-all
                      duration-200
                    ">
                      {service.name}
                    </Link>
                </div>

                <span
                className={`
                    px-3 py-1 rounded-full text-sm font-medium w-fit

                    ${
                    service.status === "Critical"
                        ? "bg-red-100 text-red-700"
                        : service.status === "Warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }
                `}
                >
                {service.status}
                </span>

                <p className="text-gray-600 dark:text-slate-400">
                {service.responseTime}
                </p>

                <p className="text-gray-600 dark:text-slate-400">
                {service.uptime}
                </p>

                <p className="text-gray-600 dark:text-slate-400">
                {service.lastIncident}
                </p>

            </div>
        ))}

        </div>
    </div>
  );
}