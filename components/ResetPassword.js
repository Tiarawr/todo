"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [oobCode, setOobCode] = useState("");

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (!code) {
      setStatus("error");
      setErrorMsg("Reset password link is invalid.");
      return;
    }

    verifyPasswordResetCode(auth, code)
      .then(() => {
        setOobCode(code);
        setStatus("valid");
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        setStatus("error");
        setErrorMsg("This link is invalid or has expired.");
      });
  }, [searchParams]);

  const handleReset = async () => {
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("success");
    } catch (err) {
      console.error("Reset failed:", err);
      setErrorMsg(err.message || "Failed to reset password.");
      setStatus("error");
    }
  };
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center p-8 bg-white dark:bg-[#121212] shadow-xl rounded-3xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f67011] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center p-8 bg-white dark:bg-[#121212] shadow-xl rounded-3xl">
          <div className="mb-4">
            <AlertCircle className="text-red-500 w-10 h-10 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Reset Failed</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center p-8 bg-white dark:bg-[#121212] shadow-xl rounded-3xl">
          <div className="mb-4">
            <CheckCircle className="text-green-500 w-10 h-10 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Password Reset Successful!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can now log in with your new password.
          </p>
          <button
            onClick={() =>
              (window.location.href = "https://todoriko.xyz/login")
            }
            className="mt-6 w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-xl font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center p-8 bg-white dark:bg-[#121212] shadow-xl rounded-3xl space-y-4">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white"
        />
        <button
          onClick={handleReset}
          className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-xl font-semibold"
        >
          Confirm Reset
        </button>
      </div>
    </div>
  );
}
