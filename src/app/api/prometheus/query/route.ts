import { NextResponse } from "next/server";
import { queryPrometheus } from "@/lib/prometheus";

export async function GET() {
  try {
    const cpu = await queryPrometheus(
      'rate(process_cpu_seconds_total{job="ir-assist"}[5m]) * 100'
    );

    const memory = await queryPrometheus(
      'process_resident_memory_bytes{job="ir-assist"} / 1024 / 1024'
    );

    const disk = await queryPrometheus(
      '100 * (1 - windows_logical_disk_free_bytes{volume="C:"} / windows_logical_disk_size_bytes{volume="C:"})'
    );

    const networkIn = await queryPrometheus(
      'rate(windows_net_bytes_received_total[5m])'
    );

    const networkOut = await queryPrometheus(
      'rate(windows_net_bytes_sent_total[5m])'
    );

    const uptime = await queryPrometheus(
      'time() - windows_system_system_up_time'
    );

    return NextResponse.json({
      cpu,
      memory,
      disk,
      networkIn,
      networkOut,
      uptime,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch Prometheus metrics",
      },
      {
        status: 500,
      }
    );
  }
}