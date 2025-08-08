"use client";

import Link from "next/link";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";

import CreateCheckModal from "@/components/modals/CreateCheckModal";
import EditCheckModal from "@/components/modals/EditCheckModal";

export default function DashboardPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [checks, setChecks] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCheck, setCurrentCheck] = useState(null);

  const fetchChecks = useCallback(async () => {
    const token = localStorage.getItem("pulsecheck_token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5002/api/checks", {
        headers: { "x-auth-token": token },
      });

      if (!res.ok) {
        localStorage.removeItem("pulsecheck_token");
        router.push("/");
        return;
      }

      const data = await res.json();
      setChecks(data); // Update the state with the fresh data
    } catch (err) {
      setError("Could not connect to the server.");
    }
  }, [router]);

  useEffect(() => {
    const verifyAuthAndFetchData = async () => {
      const token = localStorage.getItem("pulsecheck_token");
      if (!token) {
        router.push("/");
        return;
      }
      await fetchChecks(); // Perform the initial fetch
      setIsLoading(false);
    };
    verifyAuthAndFetchData();
  }, [router, fetchChecks]);

  useEffect(() => {
    // Set an interval to run the fetchChecks function every 5 seconds (5000 milliseconds)
    const intervalId = setInterval(() => {
      console.log("Polling for new data...");
      fetchChecks();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchChecks]);

  const handleLogout = () => {
    localStorage.removeItem("pulsecheck_token");
    router.push("/");
  };

  const handleCheckCreated = (newCheck) => {
    setChecks((prevChecks) => [newCheck, ...prevChecks]);
  };

  const handleDelete = async (checkId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this monitor?")) {
      return;
    }
    const token = localStorage.getItem("pulsecheck_token");
    try {
      const res = await fetch(`http://localhost:5002/api/checks/${checkId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
        },
      });
      if (res.ok) {
        setChecks((prevChecks) =>
          prevChecks.filter((check) => check.check_id !== checkId)
        );
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete check.");
      }
    } catch (err) {
      alert("Could not connect to the server.");
    }
  };

  const openEditModal = (check, e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentCheck(check);
    setIsEditModalOpen(true);
  };

  const handleCheckUpdated = (updatedCheck) => {
    setChecks((prevChecks) =>
      prevChecks.map((check) =>
        check.check_id === updatedCheck.check_id ? updatedCheck : check
      )
    );
  };

  // While isLoading is true, rendering a simple loading screen.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">PulseCheck</p>
      </div>
    );
  }

  return (
    <>
      <CreateCheckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCheckCreated={handleCheckCreated}
      />
      <EditCheckModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        check={currentCheck}
        onCheckUpdated={handleCheckUpdated}
      />
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <Link href={"/"} className="flex items-center cursor-pointer">
                <span className="text-2xl font-bold text-indigo-600">
                  PulseCheck
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 cursor-pointer"
                >
                  + Create Monitor
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Your Monitors
          </h1>
          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {checks.length > 0 ? (
              checks.map((check) => (
                <Link
                  href={`/dashboard/checks/${check.check_id}`}
                  key={check.check_id}
                >
                  <div
                    key={check.check_id}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {check.name}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          check.current_status === "Up"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {check.current_status || "Pending"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 truncate">
                      {check.url}
                    </p>
                    <p className="mt-4 text-xs text-gray-400">
                      Last checked:{" "}
                      {check.last_checked_at
                        ? new Date(check.last_checked_at).toLocaleString()
                        : "Never"}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                      <button
                        onClick={(e) => openEditModal(check, e)}
                        className="flex px-2 py-1 gap-1 text-indigo-400 hover:text-indigo-500 border rounded-full transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer"
                      >
                        <MdOutlineEdit size={18}/>
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(check.check_id, e)}
                        className="flex px-2 py-1 gap-1 text-red-400 hover:text-red-500 border rounded-full transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer"
                      >
                        <AiOutlineDelete size={18} />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">
                You havent created any checks yet.
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
