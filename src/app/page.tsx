"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession(); 
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }

    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return null;
}