import { NextResponse } from "next/server";
import { queryPrometheus } from "@/lib/prometheus";

function extractValue(result: any[]): number | null {
  const val = result?.[0]?.value?.[1];
  return val !== undefined ? parseFloat(val) : null;
}

export async function GET() {
  try {
    const [cpuResult, memoryResult] = await Promise.all([
      queryPrometheus('rate(process_cpu_seconds_total{job="ir-assist"}[5m]) * 100'),
      queryPrometheus('process_resident_memory_bytes{job="ir-assist"} / 1024 / 1024'),
    ]);

    const cpu = extractValue(cpuResult)?.toFixed(2) ?? "N/A";
    const memory = extractValue(memoryResult)?.toFixed(1) ?? "N/A";

    return NextResponse.json({
      cpu,
      memory,
      lastUpdated: new Date().toISOString(),
      // windows metrics removed — exporter not running
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch Prometheus metrics" },
      { status: 500 }
    );
  }
}