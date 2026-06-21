"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Server } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { isAdmin, isEngineer } from "@/lib/roles";

type Service = {
  id: string;
  name: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  responseTime: string | null;
  availability: string | null;
  createdAt: string;
  incidents:{
    createdAt: string;
  }[];
};

export default function ServicesPage() {
  const { data: session } = useSession();
  const role = session?.user.role;

  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");

      const data = await res.json();

      setServices(data);
    }

    fetchServices();

    const interval = setInterval(fetchServices,10000);
    return () => clearInterval(interval);
    
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.status.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="bg-white dark:bg-emerald-950 min-h-screen p-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Services  
        </h1>

        <div className="flex items-center gap-4">
          {(isAdmin(role) || isEngineer(role)) && (
            <Link
              href="/services/create"
              className="
                bg-green-700
                text-white
                px-4
                py-2
                rounded-xl
                hover:bg-green-800
                transition-colors
              "
            >
              Create Service
            </Link>
          )}

          <ThemeToggle />
        </div>
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
          <div className=" py-16 flex flex-col items-center justify-center text-center">
            <Server size={48} className="text-gray-300 mb-4"/>

            <h2 className="text-xl font-semibold mb-2">
              No Services Found
            </h2>

            <p className="text-gray-500">
              There are currently no services matching your filters.
            </p>
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
                   href={`/services/${service.id}`}
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
                      service.status === "CRITICAL"
                        ? "bg-red-100 text-red-700"
                        : service.status === "WARNING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {service.status}
                </span>

                <p className="text-gray-600 dark:text-slate-400">
                  {service.responseTime ?? "--"}
                </p>

                <p className="text-gray-600 dark:text-slate-400">
                  {service.availability ?? "--"}
                </p>

                <p className="text-gray-600 dark:text-slate-400">
                  {
                    service.incidents.length > 0
                      ? new Date(service.incidents[0].createdAt).toLocaleDateString()
                      : "--"
                  }
                </p>

            </div>
        ))}

        </div>
    </div>
  );
}