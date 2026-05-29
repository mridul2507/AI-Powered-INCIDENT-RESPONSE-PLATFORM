const logs = [
  {
    time: "12:32 PM",
    level: "ERROR",
    message: "Database connection timeout",
  },
  {
    time: "12:31 PM",
    level: "INFO",
    message: "Health check passed",
  },
  {
    time: "12:30 PM",
    level: "WARNING",
    message: "High memory usage detected",
  },
  {
    time: "12:29 PM",
    level: "ERROR",
    message: "API request failed",
  },
];

export default function LogsExplorer() {
  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-8
      hover:shadow-xl transition-all duration-300">

      <h2 className="text-xl font-semibold text-green-900 mb-6">
        Logs Explorer
      </h2>

      <div className="flex flex-col gap-4">

        {logs.map((log) => (
          <div
            key={log.time + log.message}
            className="flex items-center justify-between border-b border-gray-200 pb-3"
          >

            <p className="text-sm text-gray-500 w-24">
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
        ))}

      </div>

    </div>
  );
}