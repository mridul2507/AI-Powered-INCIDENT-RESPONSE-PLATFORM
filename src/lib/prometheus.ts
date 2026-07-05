const PROMETHEUS_URL = "https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom";
const PROMETHEUS_USER = "3348842";
const PROMETHEUS_TOKEN = process.env.GRAFANA_PROMETHEUS_TOKEN!;

export async function queryPrometheus(query: string) {
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`;

  const auth = Buffer.from(`${PROMETHEUS_USER}:${PROMETHEUS_TOKEN}`).toString("base64");

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Prometheus error ${res.status}: ${body}`);
    throw new Error(`Prometheus ${res.status}`);
  }

  const data = await res.json();
  return data.data.result;
}