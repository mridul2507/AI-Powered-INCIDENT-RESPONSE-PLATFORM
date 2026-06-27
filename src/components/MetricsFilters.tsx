type Service = {
  id: string;
  name: string;
};

type Props = {
  services: Service[];

  selectedService: string;

  selectedRange: string;

  onServiceChange: (value: string) => void;

  onRangeChange: (value: string) => void;
};

export default function MetricsFilters({
  services,
  selectedService,
  selectedRange,
  onServiceChange,
  onRangeChange,
}: Props) {
  return (
    <div
      className="
      flex
      flex-col
      md:flex-row
      gap-4
      justify-between
      items-center
      my-8
    "
    >

      <div className="flex gap-3 items-center">

        <label className="font-medium">
          Service
        </label>

        <select
          value={selectedService}
          onChange={(e) =>
            onServiceChange(e.target.value)
          }
          className="
            border
            rounded-xl
            px-4
            py-2
            dark:bg-white
            dark:text-black
          "
        >

          <option value="all">
            All Services
          </option>

          {services.map((service) => (

            <option
              key={service.id}
              value={service.id}
            >
              {service.name}
            </option>

          ))}

        </select>

      </div>

      <div className="flex gap-3 items-center">

        <label className="font-medium">
          Time Range
        </label>

        <select
          value={selectedRange}
          onChange={(e) =>
            onRangeChange(e.target.value)
          }
          className="
            border
            rounded-xl
            px-4
            py-2
            dark:bg-white
            dark:text-black
          "
        >

          <option value="all">
            All Time
          </option>

          <option value="1h">
            Last Hour
          </option>

          <option value="24h">
            Last 24 Hours
          </option>

          <option value="7d">
            Last 7 Days
          </option>

          <option value="30d">
            Last 30 Days
          </option>

        </select>

      </div>

    </div>
  );
}