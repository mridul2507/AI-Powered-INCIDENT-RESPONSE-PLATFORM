import { NextResponse } from "next/server";
import { queryPrometheus } from "@/lib/prometheus";

export async function GET() {
  try {
    const [cpu, memory] = await Promise.all([
      queryPrometheus('rate(process_cpu_seconds_total{job="ir-assist"}[5m]) * 100'),
      queryPrometheus('process_resident_memory_bytes{job="ir-assist"} / 1024 / 1024'),
    ]);

    return NextResponse.json({ cpu, memory });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch Prometheus metrics" },
      { status: 500 }
    );
  }
}