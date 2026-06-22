"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {toast} from "sonner";

type Incident = {
  id: string;
  title: string;
  description: string | null;
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  serviceId: string | null;
};

export default function EditIncidentPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [severity, setSeverity] = useState<Incident["severity"]>("INFO");
  const [status, setStatus] = useState<Incident["status"]>("OPEN");
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchIncident() {
      const res = await fetch(
        `/api/incidents/${params.id}`
      );

      const data = await res.json();

      setTitle(data.title);
      setDescription(data.description || "");
      setSeverity(data.severity);
      setStatus(data.status);
      setServiceId(data.serviceId || "");
      
      const servicesRes = await fetch("/api/services");
      const servicesData = await servicesRes.json();

      setServices(servicesData);
      setLoading(false);
    }

    fetchIncident();
  }, [params.id]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const res = await fetch(
      `/api/incidents/${params.id}`,
      {
        method: "PATCH",
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
      }
    );

    if (res.ok) {
      router.push(
        `/incidents/${params.id}`
      );

      router.refresh();
    } else {
      toast.error("Failed to update incident");
    }
  }

  if (loading) {
    return (
      <div className=" min-h-screen flex items-center justify-center">
        <div className="text-xl text-green-700">
          Loading incident...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 p-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400 mb-8">
          Edit Incident
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="
              w-full
              p-4
              border
              rounded-xl
              dark:bg-slate-900
            "
          />

          <textarea
            rows={5}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
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
              setSeverity(
                e.target.value as Incident["severity"]
              )
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
              setStatus(
                e.target.value as Incident["status"]
              )
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
            ">
            <option value="">
              No Service
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
            className="
              bg-green-700
              hover:bg-green-800
              text-white
              px-6
              py-3
              rounded-xl
            "
          >
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
}