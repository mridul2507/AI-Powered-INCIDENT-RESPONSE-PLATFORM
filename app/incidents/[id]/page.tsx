import SeverityBadge from "@/components/SeverityBadge";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link"
import { ArrowLeft } from "lucide-react";

const logs = [
          {
            time: "12:32:45",
            level: "ERROR",
            message: "Database connection timeout",
          },
          {
            time: "12:32:46",
            level: "INFO",
            message: "Retry attempt started",
          },
          {
            time: "12:32:48",
            level: "WARNING",
            message: "Connection pool usage exceeded 90%",
          },
          ];
export default function IncidentDetailsPage() {
  return (
    <div className="bg-white min-h-screen p-8">
      <Link
        href="/incidents"
        className="
          inline-flex
          items-center
          gap-2
          text-gray-600
          hover:text-green-900
          transition-colors
          mb-6
        "
      >
        <ArrowLeft size={18} />
        Back to Incidents
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

        <p className="text-sm text-gray-500 mb-2">
          INC-1001
        </p>

        <h1 className="text-3xl font-bold text-green-900 mb-4">
          Payment Service Failure
        </h1>

        <div className="flex gap-4 mb-4">

          <SeverityBadge severity="Critical" />

          <StatusBadge status="Open" />

        </div>

        <p className="text-gray-600">
          High error rates detected in the payment processing service.
          Multiple customer transactions are failing due to backend API timeouts.
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

          <h2 className="text-xl font-semibold text-green-900 mb-4">
            Incident Timeline
          </h2>

          <div className="space-y-8">

            <div className="border-l-2 border-green-600 pl-4">
              <p className="font-medium text-gray-800">
                12:30 PM
              </p>

              <p className="text-gray-500">
                Error rate exceeded threshold.
              </p>
            </div>

            <div className="border-l-2 border-green-600 pl-4">
              <p className="font-medium text-gray-800">
                12:32 PM
              </p>

              <p className="text-gray-500">
                Alert triggered for Payment Service.
              </p>
            </div>

            <div className="border-l-2 border-green-600 pl-4">
              <p className="font-medium text-gray-800">
                12:35 PM
              </p>

              <p className="text-gray-500">
                Incident created automatically.
              </p>
            </div>

          </div>

        </div>

        {/* AI Analysis Card */}
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-full 
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            <h2 className="text-xl font-semibold text-green-900 mb-4">
              AI Root Cause Analysis
            </h2>

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">

              <p className="font-semibold text-violet-700 mb-2">
                Root Cause
              </p>

              <p className="text-gray-700">
                The payment service is experiencing elevated error rates due to
                database connection pool exhaustion. Incoming requests are
                exceeding available database connections.
              </p>

            </div>

            <div className="mt-6">
              <p className="font-semibold text-yellow-800 mb-2">
                Confidence Score
              </p>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full w-[92%] transition-all duration-700"></div>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Confidence Score: 92%
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-green-900 mb-3">
                Contributing Factors
              </h3>

              <ul className="space-y-2 text-gray-700">

                <li>
                  • Increased payment traffic after promotional campaign
                </li>

                <li>
                  • Database connection pool reached maximum capacity
                </li>

                <li>
                  • Slow database queries causing connection retention
                </li>

                <li>
                  • Retry logic amplifying incoming requests
                </li>

              </ul>

            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-green-900 mb-3">
                Recommended Actions
              </h3>

              <ul className="space-y-2 text-gray-700">

                <li>
                  • Increase database connection pool size
                </li>

                <li>
                  • Optimize slow-running queries
                </li>

                <li>
                  • Add rate limiting to retry mechanism
                </li>

                <li>
                  • Monitor active connections more aggressively
                </li>

              </ul>

            </div>

          </div>
        </div>

        {/*Logs Explorer*/}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <h2 className="flex flex-wrap text-xl font-semibold text-green-900 mb-4">
            Logs Explorer
          </h2>
                    
          {logs.map((log) => (
          <div
            key={log.time}
            className="
              text-sm
              grid
              flex-wrap
              grid-cols-[80px_90px_minmax(0,1fr)]
              hover:bg-gray-100
              rounded-lg
              px-2
              transition-colors
              duration-200
              border-b
              border-gray-100
              py-3
              items-center"
          >
            <p className="text-gray-800">
              {log.time}
            </p>

            <p className={`
                font-semibold
                ${
                  log.level === "ERROR"
                    ? "text-red-600"
                    : log.level === "WARNING"
                    ? "text-amber-600"
                    : "text-blue-600"
                }
              `}>
              {log.level}
            </p>

            <p className="text-gray-800">
              {log.message}
            </p>
          </div>
        ))}

        </div>

        {/*Service Map*/}
        <div className="col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6
                transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <h2 className="text-xl font-semibold text-green-900 mb-6">
            Service Map (Tracing)
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-gray-700 font-semibold border border-green-300 bg-green-100 rounded-xl px-6 py-4">
              User
            </div>

            <div className="text-3xl text-gray-400">→</div>

            <div className="border border-red-300 bg-red-50 rounded-xl px-10 py-8">
              <p className="text-gray-700 font-semibold">
                Payment Service
              </p>
              <p className="text-red-600 text-sm">
                Critical
              </p>
            </div>

            <div className="text-3xl text-gray-400">→</div>

            <div className="border border-green-300 bg-green-50 rounded-xl px-6 py-4">
              <p className=" text-gray-700 font-semibold">
                Notification
              </p>
              <p className="text-green-600 text-sm">
                Healthy
              </p>
            </div>
            
            <div className="text-gray-700 border border-amber-300 bg-amber-100 rounded-xl px-6 py-4">
              <p className="text-gray-700 font-semibold">
                User DB
              </p>
              <p className="text-amber-600 text-sm">
                Warning
              </p>
            </div>

            
          </div>
        </div>
      </div>

    </div>
  );
}