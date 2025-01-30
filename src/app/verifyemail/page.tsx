"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async () => {
    if (!token) return;

    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
      console.error("Verification Error: ", error.response?.data);
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError("No token found in the URL.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-4">
          {loading ? "Please wait while we verify your email address." : ""}
        </p>
        <h2 className="p-2 bg-orange-500 text-white font-semibold rounded-lg inline-block">
          {token ? `Token: ${token}` : "No token found"}
        </h2>

        <div className="mt-4">
          {loading && !error && !verified ? (
            <p className="text-gray-500">Verifying...</p>
          ) : verified ? (
            <div className="text-green-600 font-semibold">
              <h2 className="text-2xl">Email Verified Successfully!</h2>
              <Link
                href="/login"
                className="mt-2 inline-block text-blue-500 hover:underline"
              >
                Proceed to Login
              </Link>
            </div>
          ) : error ? (
            <div className="text-red-600 font-semibold">
              <h2 className="text-2xl">Verification Failed</h2>
              <p>{error}</p>
              <Link
                href="/resend-verification"
                className="text-blue-500 hover:underline"
              >
                Resend Verification Email
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">Verification process completed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
