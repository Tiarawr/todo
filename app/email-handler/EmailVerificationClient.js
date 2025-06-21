"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function EmailActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Processing...");
  const [actionTitle, setActionTitle] = useState("Processing");

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus("error");
      setMessage("Missing or invalid link.");
      setActionTitle("Invalid Link");
      return;
    }

    switch (mode) {
      case "verifyEmail":
        setActionTitle("Verifying your email...");
        applyActionCode(auth, oobCode)
          .then(() => {
            setStatus("success");
            setMessage("Your email has been successfully verified.");
            setActionTitle("Email Verified!");
          })
          .catch((error) => {
            console.error(error);
            setStatus("error");
            setMessage("This verification link is invalid or expired.");
            setActionTitle("Verification Failed");
          });
        break;

      case "resetPassword":
        setActionTitle("Resetting your password...");
        verifyPasswordResetCode(auth, oobCode)
          .then(() => {
            router.push(`/reset-password?oobCode=${oobCode}`);
          })
          .catch((error) => {
            console.error(error);
            setStatus("error");
            setMessage("This reset password link is invalid or expired.");
            setActionTitle("Reset Failed");
          });
        break;

      case "recoverEmail":
        setStatus("success");
        setActionTitle("Email Recovered");
        setMessage("Your email has been successfully recovered.");
        break;

      case "verifyBeforeChangeEmail":
        setStatus("success");
        setActionTitle("Change Email Verified");
        setMessage("Email change verified. You can now continue.");
        break;

      default:
        setStatus("error");
        setActionTitle("Unknown Action");
        setMessage("The provided action is not recognized.");
    }
  }, [mode, oobCode, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center p-8 bg-white dark:bg-[#121212] shadow-xl rounded-3xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f67011] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
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
        <h1 className="text-2xl font-bold mb-2">{actionTitle}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>

        <button
          onClick={() => router.push("/login")}
          className="mt-6 w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-xl font-semibold"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
