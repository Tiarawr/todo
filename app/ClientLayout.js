"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "../components/Header";

export default function ClientLayout({ children, montserrat, poppins }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/tnc" ||
    pathname.startsWith("/email-handler/reset-password") ||
    pathname.startsWith("/email-handler/verify-email");

  useEffect(() => {
    // Apply theme immediately saat component mount
    const applyTheme = () => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") || "light";
        const body = document.body;

        // Remove existing theme classes
        body.classList.remove(
          "bg-white",
          "bg-[#1E1E1E]",
          "text-black",
          "text-white"
        );

        if (savedTheme === "dark") {
          body.classList.add("bg-[#1E1E1E]", "text-white");
        } else {
          body.classList.add("bg-white", "text-black");
        }
      }
    };

    applyTheme();
  }, []);

  return (
    <body
      className={`${montserrat.variable} ${poppins.variable} transition-colors duration-300`}
    >
      {!isAuthPage && <Header />}
      <main>{children}</main>
    </body>
  );
}
