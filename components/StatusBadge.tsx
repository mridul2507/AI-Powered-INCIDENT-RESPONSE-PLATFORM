type StatusBadgeProps = {
  status:
    | "Open"
    | "Investigating"
    | "Resolved";
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-sm font-medium

        ${
          status === "Open"
            ? "bg-red-100 text-red-700"
            : status === "Investigating"
            ? "bg-amber-100 text-amber-700"
            : "bg-green-100 text-green-700"
        }
      `}
    >
      {status}
    </span>
  );
}