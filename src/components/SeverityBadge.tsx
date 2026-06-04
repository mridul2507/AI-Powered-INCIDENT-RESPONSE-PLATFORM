export type Severity =
  | "Critical"
  | "Warning"
  | "Info";

type SeverityBadgeProps = {
  severity: Severity;
};

export default function SeverityBadge({
  severity,
}: SeverityBadgeProps) {
  return (
    <span
      className={`
        inline-flex px-3 py-1 rounded-full text-sm font-medium

        ${
          severity === "Critical"
            ? "bg-red-100 text-red-700"
            : severity === "Warning"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700"
        }
      `}
    >
      {severity}
    </span>
  );
}