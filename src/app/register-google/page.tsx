"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterGoogle() {
  const { data: session, status, update } = useSession();

  const router = useRouter();

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("ENGINEER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);


  useEffect(() => {
    console.log(session);
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } 
    
    else if (status === "authenticated" && session?.user?.organizationId) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  async function register() {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    const res = await fetch("/api/auth/google-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        organization,
        role,
        password,
      }),
    });

    if (res.ok) {
      await update(); 
      window.location.href = "/dashboard";
    } else {
      const data = await res.json();
      alert(data.error || "Registration failed");
    }
  
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Session not available
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-xl shadow-xl p-10 w-[500px] space-y-6">

        <h1 className="text-3xl font-bold">
          Complete Registration
        </h1>
      
        <input
          className="w-full border rounded-lg p-3 bg-gray-100"
          value={session?.user?.email ?? ""}
          readOnly
        />

        <input
          className="w-full border rounded-lg p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />

        <input
          className="w-full border rounded-lg p-3"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Organization"
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <select
          className="w-full border rounded-lg p-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="ENGINEER">ENGINEER</option>
          <option value="VIEWER">VIEWER</option>
        </select>

        <button
          onClick={register}
          className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg p-3"
        >
          Create Workspace
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg p-3 transition"
        >
          Cancel and Return to Login
        </button>

      </div>
    </div>
  );
}