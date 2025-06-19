"use client";

import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import Header from "../components/Header";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Head from "next/head";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/tnc" ||
    pathname === "/verify-success";

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
    <html lang="en">
      <Head>
        <link rel="icon" href="/todorik.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#f67011" />
        <title>Todoriko</title>
      </Head>
      <body
        className={`${montserrat.variable} ${poppins.variable} transition-colors duration-300`}
      >
        {!isAuthPage && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}
