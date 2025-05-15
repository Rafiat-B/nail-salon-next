"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Invalid email format");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      interface LoginResponse {
        user: {
          role: string;
          [key: string]: any; // Add other user properties if needed
        };
      }

      const res = await axios.post<LoginResponse>("/api/auth/login", { email, password }, {
        headers: { "Content-Type": "application/json" },
      });

      // Store the full user object in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as any).response === "object"
  ) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    setError(axiosErr.response?.data?.error || "Login failed. Please try again.");
  } else {
    setError("An unexpected error occurred.");
  }
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-pink-700">Login</h2>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        <form onSubmit={handleLogin}>
          <label className="block text-gray-700 mt-4">Email</label>
          <input
            type="email"
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <label className="block text-gray-700 mt-4">Password</label>
          <input
            type="password"
            className="border p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="mt-6 bg-pink-600 text-white px-4 py-2 rounded w-full hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}