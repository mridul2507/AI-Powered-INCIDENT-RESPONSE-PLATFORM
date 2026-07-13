"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ENGINEER");
  const [loading, setLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send invitation");
        return;
      }

      toast.success(`Invitation sent to ${email}`);
      setEmail(""); 
      setRole("ENGINEER"); 
    } catch{
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow border border-gray-100 w-full">
      <h2 className="text-2xl font-bold mb-2 text-green-900">Invite Team Member</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Send an invitation link to securely add a new user to your organization.
      </p>

      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700
            dark:border-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 bg-white
            dark:border-gray-700 dark:text-black"
          >
            <option value="ADMIN">Admin - Full Access</option>
            <option value="ENGINEER">Engineer - Standard Access</option>
            <option value="VIEWER">Viewer - Read Only</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-900 hover:bg-green-800 text-white p-3 rounded-xl transition disabled:opacity-50 mt-4 font-medium"
        >
          {loading ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </div>
  );
}