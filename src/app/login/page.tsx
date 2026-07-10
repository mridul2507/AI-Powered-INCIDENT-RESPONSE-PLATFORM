"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-green-900">
          IR Assist Login
        </h1>

        <button
          type="button"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
          className=" w-full border p-3 rounded-xl flex items-center
          justify-center gap-3 hover:bg-gray-50 transition mb-4">
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="px-3 text-gray-500">OR</span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded-xl mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded-xl mb-6"
        />

        <button
          type="submit"
          className="w-full bg-green-900 text-white p-3 rounded-xl"
        >
          Login
        </button>

        <p className="text-center mt-6 text-gray-500">
          Don&apos;t have an account?

          <Link
            href="/signup"
            className="ml-2 text-green-700 hover:underline"
          >
            Create Account
          </Link>
        </p>

      </form>

    </div>
  );
}