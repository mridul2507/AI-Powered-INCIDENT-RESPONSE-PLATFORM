"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateIncidentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [severity, setSeverity] = useState("INFO");
  const [status, setStatus] = useState("OPEN");

  const [loading, setLoading] = useState(false);

  type Service = {
    id: string;
    name: string;
  };

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");

      const data = await res.json();

      setServices(data);
    }

    fetchServices();
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title,
        description,
        severity,
        status,
        serviceId,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/incidents");
      router.refresh();
    } else {
      toast.error("Failed to create incident");
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 p-8">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-green-900 dark:text-green-400">
          Create Incident
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input
            type="text"
            placeholder="Incident Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
            className="
              w-full
              p-4
              border
              rounded-xl
              dark:bg-slate-900
            "
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={5}
            className="
              w-full
              p-4
              border
              rounded-xl
              dark:bg-slate-900
            "
          />

          <select
            value={severity}
            onChange={(e) =>
              setSeverity(e.target.value)
            }
            className="
              w-full
              p-4
              border
              rounded-xl
              dark:bg-slate-900
            "
          >
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="
              w-full
              p-4
              border
              rounded-xl
              dark:bg-slate-900
            "
          >
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">
              Investigating
            </option>
            <option value="RESOLVED">
              Resolved
            </option>
          </select>

          <select
            value={serviceId}
            onChange={(e) =>
              setServiceId(e.target.value)
            }
            className="
              w-full
              p-4
              border
              rounded-xl
              dark:bg-slate-900
            "
          >
            <option value="">
              Select Affected Service
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

          <button
            type="submit"
            disabled={loading}
            className="
              bg-green-700
              text-white
              px-6
              py-3
              rounded-xl
              hover:bg-green-800
            "
          >
            {loading
              ? "Creating..."
              : "Create Incident"}
          </button>
        </form>
      </div>
    </div>
  );
}