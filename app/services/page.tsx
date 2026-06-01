"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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
    <div className="bg-white min-h-screen p-8">

      <h1 className="text-3xl font-bold text-green-900 mb-6">
        Services
      </h1>

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

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-4 bg-gray-50 font-semibold text-gray-700">
            <p>Service Name</p>
            <p>Status</p>
            <p>Response Time</p>
            <p>Uptime</p>
            <p>Last Incident</p>
        </div>

        {filteredServices.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No services found.
          </div>
        )}

        {/* Rows */}
        {filteredServices.map((service) => (
            <Link
                key={service.name}
                href={`/services/${service.name}`}
            >
            <div
                className="
                grid
                grid-cols-[2fr_1fr_1fr_1fr_1fr]
                p-4
                border-t
                border-gray-200
                items-center
                hover:bg-gray-100
                transition-colors
                duration-100
                cursor-pointer
                "
            >

                <p className="font-medium text-gray-800">
                {service.name}
                </p>

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

                <p className="text-gray-600">
                {service.responseTime}
                </p>

                <p className="text-gray-600">
                {service.uptime}
                </p>

                <p className="text-gray-600">
                {service.lastIncident}
                </p>

            </div>
            </Link>
        ))}

        </div>
    </div>
  );
}