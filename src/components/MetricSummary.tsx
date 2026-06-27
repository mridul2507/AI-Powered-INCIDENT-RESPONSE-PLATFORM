type Metric = {
  cpuUsage: number | null;
  memoryUsage: number | null;
  diskUsage: number | null;
  responseTime: number | null;
  requestsPerMin: number | null;
  errorRate: number | null;
};

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
      bg-white
      border
      rounded-2xl
      p-5
      shadow-sm
      hover:shadow-md
      transition-all
    "
    >
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-3 text-green-700 dark:text-green-400">
        {value}
      </h2>
    </div>
  );
}

export default function MetricSummary({
  metric,
}: {
  metric: Metric | undefined;
}) {
  if (!metric) {
    return (
      <div className="border rounded-2xl p-10 text-center text-gray-500">
        No metrics available.
      </div>
    );
  }

  return (
    <div>

      <h2 className="text-2xl font-bold mb-6 text-green-900 dark:text-green-400">
        Latest Metrics
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        <Card
          title="CPU Usage"
          value={`${metric.cpuUsage ?? 0}%`}
        />

        <Card
          title="Memory Usage"
          value={`${metric.memoryUsage ?? 0}%`}
        />

        <Card
          title="Disk Usage"
          value={`${metric.diskUsage ?? 0}%`}
        />

        <Card
          title="Response Time"
          value={`${metric.responseTime ?? 0} ms`}
        />

        <Card
          title="Requests / Min"
          value={`${metric.requestsPerMin ?? 0}`}
        />

        <Card
          title="Error Rate"
          value={`${metric.errorRate ?? 0}%`}
        />

      </div>

    </div>
  );
}