// app/email-handler/page.js
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Import komponen verifikasi email secara dinamis (client component)
const EmailHandlerClient = dynamic(() => import("./EmailHandlerClient"), {
  ssr: false,
});

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
      <EmailHandlerClient />
    </Suspense>
  );
}
