import SeverityBadge,{Severity,} from "@/components/SeverityBadge";
import Link from "next/link"

const incidents:{id:string;title:string;severity:Severity;time:string}[] = [
  {
    id: "INC-1001",
    title: "Payment Service Error",
    severity: "Critical",
    time: "2 min ago",
  },
  {
    id: "INC-1002",
    title: "Database Timeout",
    severity: "Warning",
    time: "6 min ago",
  },
  {
    id: "INC-1003",
    title: "Cache Degraded",
    severity: "Info",
    time: "14 min ago",
  },
];

export default function RecentIncidents() {
  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-8
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      
      <h2 className="text-xl font-semibold text-green-900 mb-6">
        Recent Incidents
      </h2>

      <div className="flex flex-col gap-4">

        {incidents.map((incident) => (
          <Link
            key={incident.id}
            href={`/incidents/${incident.id}`}
            className="
              block
              border-b
              border-gray-200
              p-2
              pt-4
              pb-4
              hover:bg-gray-100
              rounded-lg
              transition-colors
              cursor-pointer
            "
                    >
          <div
            key={incident.title}
            className="flex items-center justify-between "
          >

            <div className="flex items-start gap-4">
              <SeverityBadge severity={incident.severity} />

              <div>
                <p className="font-medium text-gray-600">
                  {incident.title}
                </p>

                <p className="text-sm text-gray-500">
                  {incident.time}
                </p>
              </div>
            </div>

          </div>
          </Link>
        ))}

      </div>

    </div>
  );
}