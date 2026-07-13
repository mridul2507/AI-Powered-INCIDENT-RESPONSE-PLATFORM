"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function NotInvited() {

  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-700">Access Denied</h1>
        <p className="mt-4 text-gray-600">
          Your email has not been invited to this organization. Please contact your administrator.
        </p>
        <Link 
          href="/login"
          className="mt-8 inline-block w-full bg-green-900 text-white p-3 rounded-xl hover:bg-green-800 transition"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}