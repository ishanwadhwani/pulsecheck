"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting credentials:", { email, password });
    try {
      const res = await fetch("http://localhost:5002/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful, token received: --->", data.token);
        localStorage.setItem("pulsecheck_token", data.token);

        router.push("/dashboard");
      } else {
        setError(data.message || "An error occured.");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      setError("Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setLoading(false);
      setError("This is a sample error message.");
    }, 2000);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white roundedd-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-300">PulseCheck</h1>
          <p className="mt-2 text-gray-600">Sign in to monitor your services</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 
              border border-gray-300 rounded-md appeareance-none focus:outline-none focus:ring-indigo-500 
              focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 
                border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 
                focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="p-3 text-sm text-red-300 bg-red-100 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 
              border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
