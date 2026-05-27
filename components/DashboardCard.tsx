type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-300 w-full">
      <div className="flex items-center gap-2">
        <Icon className="text-gray-400"/>   

        <h2 className="text-gray-500 text-sm">{title}</h2>
      </div>

      <p className="text-3xl font-bold text-green-900 mt-2">
        {value}
      </p>
    </div>
  );
}