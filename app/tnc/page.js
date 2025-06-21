import { Suspense } from "react";
import TermsAndConditions from "@/components/TermsAndConditions";

export default function TNCPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center p-8 bg-white dark:bg-[#121212] shadow-xl rounded-3xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f67011] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Terms & Conditions...</p>
        </div>
      </div>
    }>
      <TermsAndConditions />
    </Suspense>
  );
}
