import { Suspense } from "react";
import EmailVerificationClient from "./EmailVerificationClient";

export default function EmailHandlerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] px-4">
          <div className="max-w-md text-center p-8 shadow-xl rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f67011] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Memproses verifikasi email Anda...
            </p>
          </div>
        </div>
      }
    >
      <EmailVerificationClient />
    </Suspense>
  );
}
