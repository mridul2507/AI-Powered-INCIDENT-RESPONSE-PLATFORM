const logs = [
  {
    time: "12:32:45",
    level: "ERROR",
    service: "Payment Service",
    message: "Database connection timeout",
  },
  {
    time: "12:32:46",
    level: "INFO",
    service: "Payment Service",
    message: "Retry attempt started",
  },
  {
    time: "12:32:48",
    level: "WARNING",
    service: "User Database",
    message: "Connection pool usage exceeded 90%",
  },
  {
    time: "12:33:10",
    level: "INFO",
    service: "Notification Service",
    message: "Email dispatch successful",
  },
];

export default function LogsPage() {
  return (
    <div className="bg-white min-h-screen p-8">

      <h1 className="text-3xl font-bold text-green-900 mb-6">
        Logs
      </h1>

      <input
        type="text"
        placeholder="Search logs..."
        className="
          w-full
          p-3
          text-gray-500
          border
          border-gray-300
          rounded-xl
          mb-6
        "
      />
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[220px_220px_320px_1fr] p-4 bg-gray-50 font-semibold text-gray-700">
            <p>Time</p>
            <p>Level</p>
            <p>Service</p>
            <p>Message</p>
        </div>

        {logs.map((log) => (
            <div
                key={log.time}
                className="
                grid
                grid-cols-[220px_220px_320px_1fr]
                p-4
                border-t
                border-gray-200
                items-center
                "
            >
                <p className="text-gray-700">
                {log.time}
                </p>

                <span
                className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                    w-fit

                    ${
                    log.level === "ERROR"
                        ? "bg-red-100 text-red-700"
                        : log.level === "WARNING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }
                `}
                >
                {log.level}
                </span>

                <p className="text-gray-700">
                {log.service}
                </p>

                <p className="text-gray-600">
                {log.message}
                </p>

            </div>
            ))}
        </div>
      </div>
  );
}