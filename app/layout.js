"use client";

import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import Header from "../components/Header";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname(); // Mendapatkan rute saat ini

  const isAuthPage =
    pathname === "/login" || pathname === "/register" || pathname === "/tnc";

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${poppins.variable} bg-[#1E1E1E] text-white`}
      >
        {!isAuthPage && <Header />} <main>{children}</main>
      </body>
    </html>
  );
}
