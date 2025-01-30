"use client";

import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Logout failed. Try again.");
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/me");
      setData(res.data?.data?._id || "No User Data");
    } catch (error) {
      console.error("Error fetching user details", error);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
        <p className="text-gray-600 mb-4">Welcome to your profile page</p>
        <h2 className="p-2 rounded bg-green-500 text-white font-semibold text-center">
          {loading ? (
            "Loading..."
          ) : data ? (
            <Link href={`/profile/${data}`}>{data}</Link>
          ) : (
            "No User Data"
          )}
        </h2>
        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={getUserDetails}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {loading ? "Fetching..." : "Get User Details"}
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
