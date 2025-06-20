"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { auth } from "@/lib/Firebase";
import { applyActionCode, checkActionCode } from "firebase/auth";

export default function VerifySuccessContent() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const handleEmailVerification = async () => {
      const actionCode = searchParams.get("oobCode");
      const mode = searchParams.get("mode");

      console.log("🎉 Verify success page loaded");
      console.log("🔍 Action code:", actionCode);
      console.log("🔍 Mode:", mode);

      if (mode === "verifyEmail" && actionCode) {
        try {
          // Check the action code validity
          console.log("🔄 Checking action code...");
          await checkActionCode(auth, actionCode);

          // Apply the email verification
          console.log("✅ Applying email verification...");
          await applyActionCode(auth, actionCode);

          console.log("🎉 Email verification successful!");
          setVerificationStatus("success");

          // Start countdown
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                window.location.href = "https://todoriko.xyz/login";
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(countdownInterval);
        } catch (error) {
          console.error("❌ Verification error:", error);
          setVerificationStatus("error");
          setErrorMessage(error.message);
        }
      } else {
        console.log("❌ Invalid verification link");
        setVerificationStatus("error");
        setErrorMessage("Invalid verification link");
      }
    };

    handleEmailVerification();
  }, [searchParams]);

  if (verificationStatus === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#ffe8d6] dark:from-[#1a1a1a] dark:to-[#2b2b2b] px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#121212] rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-[#f67011]/20 p-4 rounded-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f67011]"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
              Verifying Email...
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium font-['Montserrat']">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#ffe8d6] dark:from-[#1a1a1a] dark:to-[#2b2b2b] px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#121212] rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-red-500/20 p-4 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium font-['Montserrat']">
              {errorMessage || "Something went wrong during verification."}
            </p>
            <button
              onClick={() =>
                (window.location.href = "https://todoriko.xyz/login")
              }
              className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-xl font-semibold font-['Montserrat'] transition-colors duration-300"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#ffe8d6] dark:from-[#1a1a1a] dark:to-[#2b2b2b] px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-[#121212] rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-green-500/20 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
            Email Verified Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium font-['Montserrat']">
            Your email has been verified. Redirecting to login in {countdown}{" "}
            seconds...
          </p>
          <button
            onClick={() =>
              (window.location.href = "https://todoriko.xyz/login")
            }
            className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-xl font-semibold font-['Montserrat'] transition-colors duration-300"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    </div>
  );
}
