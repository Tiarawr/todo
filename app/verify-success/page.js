"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { auth } from "@/lib/Firebase";
import { applyActionCode, checkActionCode } from "firebase/auth";

export default function VerifySuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleEmailVerification = async () => {
      const actionCode = searchParams.get("oobCode");
      const mode = searchParams.get("mode");

      if (mode === "verifyEmail" && actionCode) {
        try {
          // Check the action code validity
          await checkActionCode(auth, actionCode);

          // Apply the email verification
          await applyActionCode(auth, actionCode);

          setVerificationStatus("success");

          // Redirect after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } catch (error) {
          setVerificationStatus("error");
          setErrorMessage(error.message);
        }
      } else {
        setVerificationStatus("error");
        setErrorMessage("Invalid verification link");
      }
    };

    handleEmailVerification();
  }, [searchParams, router]);

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
              onClick={() => router.push("/login")}
              className="btn btn-primary bg-[#f67011] hover:bg-[#e6651a] text-white w-full rounded-xl font-semibold font-['Montserrat'] mt-4"
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
            Your email has been verified. You can now login to your account.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="btn btn-primary bg-[#f67011] hover:bg-[#e6651a] text-white w-full rounded-xl font-semibold font-['Montserrat'] mt-4"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
