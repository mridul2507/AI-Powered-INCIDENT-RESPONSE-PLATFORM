const PROMETHEUS_URL =
  process.env.PROMETHEUS_URL!;

export async function queryPrometheus(
  query: string
) {
  const url =
    `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(
      query
    )}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      "Failed to query Prometheus"
    );
  }

  const data = await res.json();

  return data.data.result;
}