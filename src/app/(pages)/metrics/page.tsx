"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Activity } from "lucide-react";

import MetricSummary from "@/components/MetricSummary";
import MetricsFilters from "@/components/MetricsFilters";

import PerformanceTimelineChart from "@/components/PerformanceTimelineChart";
import TrafficHealthChart from "@/components/TrafficHealthChart";
import { useCallback } from "react";

type Metric = {
  id: string;
  cpuUsage: number | null;
  memoryUsage: number | null;
  diskUsage: number | null;
  responseTime: number | null;
  requestsPerMin: number | null;
  errorRate: number | null;
  createdAt: string;

  service: {
    id: string;
    name: string;
  };
};

type Service = {
  id: string;
  name: string;
};

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [selectedService, setSelectedService] =
    useState("all");

  const [selectedRange, setSelectedRange] =
    useState("all");

  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        serviceId: selectedService,
        range: selectedRange,
      });

      const res = await fetch(
        `/api/metrics?${params}`
      );

      const data: {
        metrics: Metric[];
        services: Service[];
      } = await res.json();

      setMetrics(data.metrics ?? []);

      setServices(data.services ?? []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedService, selectedRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const latestMetric =
    metrics.length > 0
      ? metrics[metrics.length - 1]
      : undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 p-8">

      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-3">

          <Activity
            size={30}
            className="text-green-700 dark:text-green-400"
          />

          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            Metrics
          </h1>

        </div>

        <ThemeToggle />

      </div>

      <MetricSummary
        metric={latestMetric}
      />

      <MetricsFilters
        services={services}
        selectedService={selectedService}
        selectedRange={selectedRange}
        onServiceChange={setSelectedService}
        onRangeChange={setSelectedRange}
      />

      {loading ? (

        <div className="text-center py-20 text-gray-500">
          Loading Metrics...
        </div>

      ) : metrics.length === 0 ? (

        <div className="text-center py-20 text-gray-500">
          No Metrics Found
        </div>

      ) : (

        <>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <PerformanceTimelineChart metrics={metrics} />

            <TrafficHealthChart metrics={metrics} />

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-6">
              Metrics History
            </h2>

            <div className="overflow-x-auto rounded-2xl border bg-white dark: text-black">

              <table className="min-w-full">

                <thead className="border-b bg-gray-100 dark:bg-gray-300">

                  <tr>

                    <th className="px-5 py-3 text-left">
                      Service
                    </th>

                    <th className="px-5 py-3 text-left">
                      CPU
                    </th>

                    <th className="px-5 py-3 text-left">
                      Memory
                    </th>

                    <th className="px-5 py-3 text-left">
                      Disk
                    </th>

                    <th className="px-5 py-3 text-left">
                      Latency
                    </th>

                    <th className="px-5 py-3 text-left">
                      Requests/min
                    </th>

                    <th className="px-5 py-3 text-left">
                      Error Rate
                    </th>

                    <th className="px-5 py-3 text-left">
                      Timestamp
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {metrics
                    .slice()
                    .reverse()
                    .map((metric) => (

                      <tr
                        key={metric.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-300 transition"
                      >

                        <td className="px-5 py-4 font-medium">
                          {metric.service.name}
                        </td>

                        <td className="px-5 py-4">
                          {metric.cpuUsage ?? 0}%
                        </td>

                        <td className="px-5 py-4">
                          {metric.memoryUsage ?? 0}%
                        </td>

                        <td className="px-5 py-4">
                          {metric.diskUsage ?? 0}%
                        </td>

                        <td className="px-5 py-4">
                          {metric.responseTime ?? 0} ms
                        </td>

                        <td className="px-5 py-4">
                          {metric.requestsPerMin ?? 0}
                        </td>

                        <td className="px-5 py-4">
                          {metric.errorRate ?? 0}%
                        </td>

                        <td className="px-5 py-4">
                          {new Date(metric.createdAt).toLocaleString()}
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          </div>

        </>

      )}

    </div>
  );
}