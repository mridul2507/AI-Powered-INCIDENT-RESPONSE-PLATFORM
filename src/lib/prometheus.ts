const GRAFANA_URL = "https://irassist07.grafana.net";
const GRAFANA_DS_UID = "grafanacloud-irassist07-prom";
const GRAFANA_TOKEN = process.env.GRAFANA_SERVICE_TOKEN;

export async function queryPrometheusValue(query: string): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${GRAFANA_URL}/api/ds/query`, {
      method: "POST",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${GRAFANA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queries: [{
          refId: "A",
          datasource: { type: "prometheus", uid: GRAFANA_DS_UID },
          expr: query,
          instant: true,
          intervalMs: 60000,
          maxDataPoints: 1,
        }],
        from: "now-5m",
        to: "now",
      }),
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Grafana ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const values = data.results?.A?.frames?.[0]?.data?.values;
    return Number(values?.[1]?.[0] ?? 0);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}