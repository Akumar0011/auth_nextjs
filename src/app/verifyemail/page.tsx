"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
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
          Please wait while we verify your email address.
        </p>
        <h2 className="p-2 bg-orange-500 text-white font-semibold rounded-lg inline-block">
          {token ? `Token: ${token}` : "No token found"}
        </h2>
        <div className="mt-4">
          {verified ? (
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
              <p>Please try again or contact support.</p>
            </div>
          ) : (
            <p className="text-gray-500">Verifying...</p>
          )}
        </div>
      </div>
    </div>
  );
}
