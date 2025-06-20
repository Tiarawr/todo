"use client";

import { Suspense } from "react";
import VerifySuccessContent from "../../components/VerifySuccessContent";

export default function VerifySuccessPage() {
  return (
    <Suspense fallback={<VerifySuccessLoading />}>
      <VerifySuccessContent />
    </Suspense>
  );
}

function VerifySuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#ffe8d6] dark:from-[#1a1a1a] dark:to-[#2b2b2b] px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-[#121212] rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-[#f67011]/20 p-4 rounded-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f67011]"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
            Loading...
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium font-['Montserrat']">
            Please wait while we prepare the verification page.
          </p>
        </div>
      </div>
    </div>
  );
}
