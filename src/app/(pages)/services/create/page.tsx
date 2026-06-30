"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateServicePage() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [status, setStatus] = useState<
    "HEALTHY" | "WARNING" | "CRITICAL"
  >("HEALTHY");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const res = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        status,
      }),
    });

    if (res.ok) {
      router.push("/services");
      router.refresh();
    } else {
      toast.error("Failed to create service");
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 p-8">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400 mb-8">
          Create Service
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input
            type="text"
            placeholder="Service Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              w-full
              p-4
              border
              rounded-xl
              dark:bg-slate-900
            "
            required
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as
                  | "HEALTHY"
                  | "WARNING"
                  | "CRITICAL"
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
            <option value="HEALTHY">
              Healthy
            </option>

            <option value="WARNING">
              Warning
            </option>

            <option value="CRITICAL">
              Critical
            </option>
          </select>

          <button
            type="submit"
            className="
              bg-green-700
              text-white
              px-6
              py-3
              rounded-xl
              hover:bg-green-800
            "
          >
            Create Service
          </button>

        </form>
      </div>
    </div>
  );
}