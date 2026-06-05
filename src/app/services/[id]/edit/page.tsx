"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("HEALTHY");

  const [responseTime, setResponseTime] = useState("");
  const [availability, setAvailability] = useState("");
  const [requestsPerMin, setRequestsPerMin] = useState("");

  useEffect(() => {
    async function fetchService() {
      const res = await fetch(`/api/services/${params.id}`);

      const data = await res.json();

      setName(data.name);
      setDescription(data.description || "");
      setStatus(data.status);

      setResponseTime(data.responseTime || "");
      setAvailability(data.availability || "");
      setRequestsPerMin(data.requestsPerMin || "");
    }

    fetchService();
  }, [params.id]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await fetch(`/api/services/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        status,
        responseTime,
        availability,
        requestsPerMin,
      }),
    });

    router.push(`/services/${params.id}`);
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        Edit Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Service Name"
          className="w-full border p-3 rounded-xl"
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Description"
          className="w-full border p-3 rounded-xl"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="w-full border p-3 rounded-xl"
        >
          <option value="HEALTHY">
            HEALTHY
          </option>

          <option value="WARNING">
            WARNING
          </option>

          <option value="CRITICAL">
            CRITICAL
          </option>
        </select>

        <input
            value={responseTime}
            onChange={(e) =>
            setResponseTime(e.target.value)
            }
            placeholder="Response Time"
            className="w-full border p-3 rounded-xl"
            />

            <input
            value={availability}
            onChange={(e) =>
            setAvailability(e.target.value)
            }
            placeholder="Availability"
            className="w-full border p-3 rounded-xl"
            />

            <input
            value={requestsPerMin}
            onChange={(e) =>
            setRequestsPerMin(e.target.value)
            }
            placeholder="Requests Per Minute"
            className="w-full border p-3 rounded-xl"
            />

        <button
          type="submit"
          className="
            bg-green-700
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
  );
}