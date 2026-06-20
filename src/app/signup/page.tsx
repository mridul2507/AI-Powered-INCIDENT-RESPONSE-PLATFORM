"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "/api/signup",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            organizationName,
            name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.error
        );
        return;
      }

      toast.success(
        "Account created successfully"
      );

      router.push("/login");
    }

    catch {
      toast.error(
        "Signup failed"
      );
    }

    finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-emerald-950">

      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-[450px]"
      >

        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400 mb-8">
          Create Organization
        </h1>

        <button
          type="button"
          onClick={() =>
            signIn(
              "google",
              {
                callbackUrl:
                  "/dashboard",
              }
            )
          }
          className="w-full border p-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 mb-6"
        >
          <FcGoogle size={22} />

          Continue with Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="px-3 text-gray-500">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <input
          placeholder="Organization Name"
          value={organizationName}
          onChange={(e) =>
            setOrganizationName(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl mb-4"
          required
        />

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl mb-4"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl mb-4"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl mb-6"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-green-900 text-white p-3 rounded-xl disabled:opacity-50"
        >
          {
            loading
            ?
            "Creating..."
            :
            "Create Organization"
          }
        </button>

        <p className="text-center mt-6 text-gray-500">

          Already have an account?

          <Link
            href="/login"
            className="text-green-700 ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}