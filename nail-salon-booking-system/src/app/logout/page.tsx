"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    console.log("Logging out..."); // Debug
    // Clear user from localStorage
    localStorage.removeItem("user");
    // Redirect to homepage
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}