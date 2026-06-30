"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useIncidentEventContext } from "@/context/IncidentEventsContext";

type Incident = {
  createdAt: string
};

export default function IncidentTrendChart() {
  const [data, setData] = useState<
    { day: string; incidents: number }[]
  >([]);
  const { lastEvent } = useIncidentEventContext();

  async function fetchIncidents() {
      const res = await fetch("/api/incidents");

      const incidents = await res.json();

      const counts: Record<string, number> = {};

      incidents.forEach((incident: Incident) => {
        const day = new Date(
          incident.createdAt
        ).toLocaleDateString();

        counts[day] = (counts[day] || 0) + 1;
      });

      const trendData = Object.entries(counts).map(
        ([day, incidents]) => ({
          day,
          incidents,
        })
      );

      setData(trendData);
  }
 
  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case "INCIDENT_CREATED":
        fetchIncidents();
        break;

      case "INCIDENT_UPDATED":
        fetchIncidents();
        break;

      case "INCIDENT_DELETED":
        fetchIncidents();
        break;

      default:
        break;
    }
  }, [lastEvent]);


  return (
    <div className="bg-white dark:bg-emerald-950 border border-gray-300 rounded-2xl p-6 mt-6
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <h2 className="
        text-xl
        font-semibold
        text-green-900 dark:text-green-400
        mb-6
      ">
        INCIDENT TREND
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="incidents"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}