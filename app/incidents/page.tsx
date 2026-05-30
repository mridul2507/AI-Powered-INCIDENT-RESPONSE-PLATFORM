import StatusBadge from "@/components/StatusBadge";
import SeverityBadge from "@/components/SeverityBadge";
import Link from "next/link";

type Incident = {
  id: string;
  title: string;
  severity: "Critical" | "Warning" | "Info";
  status: "Open" | "Investigating" | "Resolved";
  createdAt: string;
};

const incidents:Incident[] = [
  {
    id: "INC-1001",
    title: "Payment Service Failure",
    severity: "Critical",
    status: "Open",
    createdAt: "2 min ago",
  },
  {
    id: "INC-1002",
    title: "Database Timeout",
    severity: "Warning",
    status: "Investigating",
    createdAt: "15 min ago",
  },
  {
    id: "INC-1003",
    title: "Cache Hit Rate Degraded",
    severity: "Info",
    status: "Resolved",
    createdAt: "1 hr ago",
  },
];

export default function IncidentsPage() {
  return (
    <div className="bg-white min-h-screen p-8">

      <h1 className="text-3xl font-bold text-green-900 mb-6">
        Incidents
      </h1>

      <input
        type="text"
        placeholder="Search incidents..."
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

        <div className="grid grid-cols-5 p-4 bg-gray-50 font-semibold text-gray-700">

          <p>ID</p>

          <p>Title</p>

          <p>Severity</p>

          <p>Status</p>

          <p>Created</p>

        </div>

        {incidents.map((incident) => (
          <Link
            key={incident.id}
            href={`/incidents/${incident.id}`}
          >
            <div
              className="
                grid
                grid-cols-5
                p-4
                text-gray-700
                border-t
                border-gray-300
                items-center
                hover:bg-gray-50
                cursor-pointer
                transition-all
              "
            >
          <p className="font-medium">
            {incident.id}
          </p>

          <p>
            {incident.title}
          </p>

          <div>
            <SeverityBadge
              severity={incident.severity}
            />
          </div>

          <div>
            <StatusBadge
              status={incident.status}
            />
          </div>

          <p className="text-gray-500">
            {incident.createdAt}
          </p>
          

        </div>
        </Link>
      ))}

      </div>

    </div>
    


  );
}