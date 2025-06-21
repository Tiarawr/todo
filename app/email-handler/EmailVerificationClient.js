"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuth, applyActionCode } from "firebase/auth";
import { auth } from "@/lib/Firebase";

export default function EmailVerificationClient() {
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

  return null;
}
