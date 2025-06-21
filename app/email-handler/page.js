"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuth, applyActionCode } from "firebase/auth";
import { auth } from "@/lib/Firebase";

export default function EmailHandlerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (mode === "verifyEmail" && oobCode) {
      const authInstance = getAuth();
      applyActionCode(authInstance, oobCode)
        .then(() => {
          alert("✅ Email berhasil diverifikasi!");
          router.push("/login");
        })
        .catch((error) => {
          console.error("Email verification failed:", error);
          alert("❌ Link verifikasi tidak valid atau sudah digunakan.");
          router.push("/login");
        });
    }
  }, [mode, oobCode, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] px-4">
      <div className="max-w-md text-center p-8 shadow-xl rounded-3xl">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f67011] mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Memproses verifikasi email Anda...
        </p>
      </div>
    </div>
  );
}
