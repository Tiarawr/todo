"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");
    if (!oobCode) {
      setStatus("error");
      setMessage("Verification link is missing or invalid.");
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("This link is invalid or has expired.");
      });
  }, [searchParams]);

  if (status === "loading") {
    return <p className="text-center p-6">Verifying your email...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center p-8 bg-white dark:bg-[#121212] shadow-xl rounded-3xl">
        <div className="mb-4">
          {status === "success" ? (
            <CheckCircle className="text-green-500 w-10 h-10 mx-auto" />
          ) : (
            <AlertCircle className="text-red-500 w-10 h-10 mx-auto" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {status === "success" ? "Email Verified!" : "Verification Failed"}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-6 w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-xl font-semibold"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
