"use client";

import { useState, useEffect } from "react";
import { KeyRound, Copy, Check } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keys, setKeys] = useState<any[]>([]);
  const [keyName, setKeyName] = useState("");
  
  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    const res = await fetch("/api/api-keys/all");

    const data = await res.json();

    setKeys(data);
  }

  async function generateKey() {
    try {
      setLoading(true);

      const res = await fetch("/api/api-keys", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: keyName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setApiKey(data.apiKey);
      setKeyName("");
      fetchKeys();
      setCopied(false);
    } catch (error) {
      console.error(error);
      alert("Failed to generate API Key");
    } finally {
      setLoading(false);
    }
  }

  async function copyKey() {
    await navigator.clipboard.writeText(apiKey);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function deleteKey(id: string) {

    const confirmed = confirm(
      "Delete this API Key?"
    );

    if (!confirmed) return;

    const res = await fetch(
      `/api/api-keys/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      fetchKeys();
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 p-8">

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">
          <KeyRound
            className="text-green-700 dark:text-green-400"
            size={32}
          />

          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            API Keys
          </h1>
        </div>

        <ThemeToggle />

      </div>

      <div className="bg-white dark:bg-emerald-950 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8">

        <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
          API Key Name
        </label>

        <input
          type="text"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="e.g. Production Log Collector"
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-green-600
          "
        />
      </div>
        <h2 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-400">
          Generate API Key
        </h2>

        <p className="text-gray-600 dark:text-slate-400 mb-6">
          Use API keys to securely send logs, metrics and incidents from
          external systems into IR Assist.
        </p>

        <button
          onClick={generateKey}
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl disabled:opacity-50 transition"
        >
          {loading ? "Generating..." : "Generate API Key"}
        </button>

        {apiKey && (
          <div className="mt-8">

            <div className="rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 p-4 mb-5">

              <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                Copy this API key now.
              </p>

              <p className="text-sm mt-1 text-yellow-700 dark:text-yellow-300">
                For security reasons, this key will never be shown again.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <code
                className="
                  flex-1
                  bg-gray-100
                  dark:bg-slate-900
                  rounded-xl
                  px-4
                  py-4
                  break-all
                  text-sm
                  font-mono
                "
              >
                {apiKey}
              </code>

              <button
                onClick={copyKey}
                className="
                  flex
                  items-center
                  gap-2
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-5
                  py-3
                  rounded-xl
                "
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </button>

            </div>

          </div>
        )}

      </div>

      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-5">
          Existing API Keys
        </h2>

        <div className="space-y-4">

          {keys.map((key) => (

            <div
              key={key.id}
              className=" border rounded-xl p-4 flex justify-between items-center">
              
              <div>
                <p className="font-semibold">
                  {key.name}
                </p>

                <p className="text-sm text-gray-500">
                  Created:
                  {" "}
                  {new Date(
                    key.createdAt
                  ).toLocaleString()}
                </p>

                <p className="text-sm text-gray-500">

                  Last Used:

                  {" "}

                  {key.lastUsedAt
                    ? new Date(
                        key.lastUsedAt
                      ).toLocaleString()
                    : "Never"}

                </p>
              </div>

              <button
                onClick={() => deleteKey(key.id)}
                className=" bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                Revoke
              </button>

            </div>
            

          ))}

        </div>

      </div>

    </div>
  );
}