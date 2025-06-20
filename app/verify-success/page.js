"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { auth } from "@/lib/Firebase";
import { signOut } from "firebase/auth";

export default function VerifySuccessPage() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth);

    const timer = setTimeout(() => {
      router.push("/login");
    }, 8000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#ffe8d6] dark:from-[#1a1a1a] dark:to-[#2b2b2b] px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-[#121212] rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-[#f67011]/20 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-[#f67011]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
            Email Verified!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium font-['Montserrat']">
            Your email has been successfully verified. You will be redirected to
            the login page shortly.
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
