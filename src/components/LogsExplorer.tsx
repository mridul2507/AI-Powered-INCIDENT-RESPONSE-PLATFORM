import Link from "next/link"

const logs = [
  {
    time: "12:32 PM",
    level: "ERROR",
    message: "Database connection timeout",
    service: "User Database"
  },
  {
    time: "12:31 PM",
    level: "INFO",
    message: "Health check passed",
    service: "User Service"
  },
  {
    time: "12:30 PM",
    level: "WARNING",
    message: "High memory usage detected",
    service: "User Service"
  },
  {
    time: "12:29 PM",
    level: "ERROR",
    message: "API request failed",
    service: "User Database"
  },
];

export default function LogsExplorer() {
  return (
    <div className="bg-white dark:bg-emerald-950 border border-gray-300 rounded-2xl p-6 mt-8
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      <h2 className="text-xl font-semibold text-green-900 dark:text-green-400 mb-6">
        Logs Explorer
      </h2>

      <div className="flex flex-col gap-4">

        {logs.map((log) => (
          <Link
            key={log.time + log.message}
            href={`/services/${log.service}`}
            className="
              block
              border-b
              border-gray-200 dark:border-slate-700
              p-2
              pb-4
              pt-4
              hover:bg-gray-100
              rounded-lg
              transition-colors
            "
          >
          <div
            key={log.time + log.message}
            className="flex items-center justify-between"
          >

            <p className="text-sm text-gray-500 dark:text-slate-400 w-24">
              {log.time}
            </p>

            <p
              className={`
                font-semibold w-24

                ${
                  log.level === "ERROR"
                    ? "text-red-600"
                    : log.level === "WARNING"
                    ? "text-amber-600"
                    : "text-blue-600"
                }
              `}
            >
              {log.level}
            </p>

            <p className="flex-1 text-gray-800">
              {log.message}
            </p>

          </div>
          </Link>
        ))}

      </div>

    </div>
  );
}