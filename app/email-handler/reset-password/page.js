// /app/email-handler/reset-password/page.js

"use client";
import dynamic from "next/dynamic";

const ResetPassword = dynamic(() => import("@/components/ResetPassword"), {
  ssr: false,
});

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
