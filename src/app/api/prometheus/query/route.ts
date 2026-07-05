import { NextResponse } from "next/server";
import { queryPrometheusValue } from "@/lib/prometheus";

export async function GET() {
  try {
    const [cpu, memory] = await Promise.all([
      queryPrometheusValue('rate(process_cpu_seconds_total{job="ir-assist"}[5m]) * 100'),
      queryPrometheusValue('process_resident_memory_bytes{job="ir-assist"} / 1024 / 1024'),
    ]);
    return NextResponse.json({ cpu, memory });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}