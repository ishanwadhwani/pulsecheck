"use client";

import { useState } from "react";

const CreateCheckModal = ({ isOpen, onClose, onCheckCreated }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setName('');
    setUrl('');
    setInterval(5);
    setError('');
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("pulsecheck_token");
    try {
      const res = await fetch("http://localhost:5002/api/checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          name,
          url,
          interval_minutes: interval,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onCheckCreated(data);
        handleClose();
        onClose();
      } else {
        setError(data.message || "Failed to create check");
      }
    } catch (err) {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">Create a New Monitor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label
              htmlFor="check-name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="check-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-gray-800 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., My Personal Blog"
            />
          </div>

          {/* URL */}
          <div>
            <label
              htmlFor="check-url"
              className="block text-sm font-medium text-gray-700"
            >
              URL
            </label>
            <input
              id="check-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="text-gray-800 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com"
            />
          </div>

          {/* INTERVAL */}
          <div>
            <label
              htmlFor="check-interval"
              className="block text-sm font-medium text-gray-700"
            >
              Check Interval (minutes)
            </label>
            <select
              id="check-interval"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              required
              className="text-gray-800 mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={1}>1 Minute</option>
              <option value={5}>5 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end pt-4 space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? "Creating..." : "Create Check"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default CreateCheckModal;