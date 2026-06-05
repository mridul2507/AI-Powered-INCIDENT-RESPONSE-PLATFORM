"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateIncidentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [severity, setSeverity] = useState("INFO");
  const [status, setStatus] = useState("OPEN");

  const [loading, setLoading] = useState(false);

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

        organizationId:
          "cmpzsbax30000uwaci6jrvs8y",
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/incidents");
      router.refresh();
    } else {
      alert("Failed to create incident");
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