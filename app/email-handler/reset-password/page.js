import dynamic from "next/dynamic";

const ResetPassword = dynamic(
  () => import("@/components/reset-password/ResetPassword"),
  {
    ssr: false,
  }
);

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
