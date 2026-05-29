import SeverityBadge,{Severity,} from "@/components/SeverityBadge";

const incidents:{title:string;severity:Severity;time:string}[] = [
  {
    title: "Payment Service Error",
    severity: "Critical",
    time: "2 min ago",
  },
  {
    title: "Database Timeout",
    severity: "Warning",
    time: "6 min ago",
  },
  {
    title: "Cache Degraded",
    severity: "Info",
    time: "14 min ago",
  },
];

export default function RecentIncidents() {
  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-8
      hover:shadow-xl transition-all duration-300">
      
      <h2 className="text-xl font-semibold text-green-900 mb-6">
        Recent Incidents
      </h2>

      <div className="flex flex-col gap-4">

        {incidents.map((incident) => (
          <div
            key={incident.title}
            className="flex items-center justify-between border-b border-gray-200 pb-4"
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
        ))}

      </div>

    </div>
  );
}