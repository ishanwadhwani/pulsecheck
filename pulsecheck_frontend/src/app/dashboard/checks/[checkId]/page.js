"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckDetailsPage() {
  const router = useRouter();

  const { checkId } = useParams();

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!checkId) return;

    const token = localStorage.getItem("pulsecheck_token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `http://localhost:5002/api/checks/${checkId}/logs`,
          {
            headers: { "x-auth-token": token },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch logs. You may not have permission.");
        }

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [checkId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl text-gray-600 animate-pulse">PulseCheck</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-2xl font-bold text-indigo-600"
              >
                PulseCheck
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <h1 className="text-3xl text-center font-bold text-gray-900 mt-2 px-2">
            History
          </h1>
          <ul className="divide-y divide-gray-200">
            {logs.length > 0 ? (
              logs.map((log) => (
                <li key={log.log_id} className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          log.status === "Up" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <p className="ml-3 text-lg font-semibold text-gray-500">{log.status}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-2 ml-6 text-sm text-gray-600">
                    <p>
                      Status Code:
                      <span
                        className={`m-1 ${
                          log.status === "Up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {log.status_code || "N/A"}
                      </span>
                      | Response Time: {log.response_time_ms}ms
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                No log history found for this monitor.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
