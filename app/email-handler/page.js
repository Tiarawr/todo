import { Suspense } from "react";
import EmailActionHandler from "@/app/email-handler/EmailActionHandler";
export default function EmailHandlerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <p>Loading...</p>
        </div>
      }
    >
      <EmailActionHandler />
    </Suspense>
  );
}
