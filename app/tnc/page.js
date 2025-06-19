import { Suspense } from "react";
import TermsAndConditions from "@/components/TermsAndConditions";

export default function TNCPage() {
  return (
    <Suspense fallback={<div>Loading Terms & Conditions...</div>}>
      <TermsAndConditions />
    </Suspense>
  );
}
