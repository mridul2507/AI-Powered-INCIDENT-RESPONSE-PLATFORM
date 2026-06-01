import Link from "next/link"
import { ArrowLeft } from "lucide-react";

const recentIncidents = [
  {
    id: "INC-1001",
    title: "Payment Service Failure",
    severity: "Critical",
  },
  {
    id: "INC-0987",
    title: "Payment Gateway Timeout",
    severity: "Warning",
  },
  {
    id: "INC-0942",
    title: "Duplicate Transaction Alert",
    severity: "Info",
  },
];

export default function ServiceDetailsPage() {
  return (
    <div className="bg-white min-h-screen p-8">
        <Link
            href="/services"
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
            Back to Services
        </Link>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

        <p className="text-sm text-gray-500 mb-2">
          SRV-1001
        </p>

        <h1 className="text-3xl font-bold text-green-900 mb-4">
          Payment Service
        </h1>

        <div className="flex gap-4 mb-4">

          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
            Critical
          </span>

        </div>

        <p className="text-gray-600">
          Handles customer payment processing, transaction validation,
          and payment gateway communication.
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6 mt-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <p className="text-sm text-gray-600">
            Response Time
            </p>

            <p className="text-3xl font-bold text-blue-700 mt-2">
            1.8s
            </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <p className="text-sm text-gray-600">
            Error Rate
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
            14%
            </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <p className="text-sm text-gray-600">
            Availability
            </p>

            <p className="text-3xl font-bold text-green-500 mt-2">
            97.2%
            </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <p className="text-sm text-gray-600">
            Requests/min
            </p>

            <p className="text-3xl font-bold text-violet-600 mt-2">
            12.4k
            </p>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">

        {/*RECENT INCIDENTS*/}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
                Recent Incidents
            </h2>

            {recentIncidents.map((incident) => (
                <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                >
                <div
                    className="
                    border-b
                    border-gray-100
                    p-4
                    pb-4
                    pt-4
                    hover:bg-gray-100
                    hover:rounded-xl
                    cursor-pointer
                    transition-all
                    "
                >
                    <p className="font-medium text-gray-800">
                    {incident.id}
                    </p>

                    <p className="text-gray-600 mt-1">
                    {incident.title}
                    </p>

                    <span
                    className={`
                        inline-flex
                        mt-2
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium

                        ${
                        incident.severity === "Critical"
                            ? "bg-red-100 text-red-700"
                            : incident.severity === "Warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }
                    `}
                    >
                    {incident.severity}
                    </span>
                </div>
                </Link>
            ))}
            </div>

            {/*Dependencies*/}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
                transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h2 className="text-xl font-semibold text-green-900 mb-4">
                    Service Dependencies
                </h2>

                <div >
                    <Link href="/services/User Database">
                    <div className="flex justify-between pb-3
                        hover:bg-gray-100 rounded-lg p-4 pt-3 cursor-pointer">
                    <p className="text-gray-700 font-medium">
                        User Database
                    </p>

                    <span className="text-amber-600">
                        Warning
                    </span>
                    </div>
                    </Link>

                    <div className="flex justify-between pb-3
                        hover:bg-gray-100 rounded-lg p-4 pt-3 cursor-pointer">
                    <p className="text-gray-700 font-medium">
                        Notification Service
                    </p>

                    <span className="text-green-600">
                        Healthy
                    </span>
                    </div>

                    <div className="flex justify-between pb-3 hover:bg-gray-100 rounded-lg p-4 pt-3 cursor-pointer">
                    <p className="text-gray-700 font-medium">
                        Fraud Detection Service
                    </p>

                    <span className="text-green-600">
                        Healthy
                    </span>
                    </div>

                </div>

            </div>

        </div>
    </div>
  );
}
