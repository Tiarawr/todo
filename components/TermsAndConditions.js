"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TermsAndConditions() {
  const [theme, setTheme] = useState("light");
  const [scrollProgress, setScrollProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get theme from URL parameter first, then localStorage
    const themeParam = searchParams.get("theme");
    const savedTheme = themeParam || localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // If theme came from URL, save it to localStorage
    if (themeParam) {
      localStorage.setItem("theme", themeParam);
    }

    // Listen for theme changes
    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    // Handle scroll progress
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      const progress = (currentScroll / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("themeChange", handleThemeChange);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [searchParams]);

  const toggleTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Update URL parameter
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set("theme", newTheme);
    window.history.replaceState({}, "", currentUrl);

    // Trigger custom event for theme change
    const event = new CustomEvent("themeChange", {
      detail: { theme: newTheme },
    });
    window.dispatchEvent(event);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#16151a]" : "bg-[#ffffff]"
      }`}
    >
      {/* Sticky Progress Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#16151a]/90" : "bg-[#ffffff]/90"
        } backdrop-blur-md border-b ${
          theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <div className="h-1 w-full bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-[#f67011] to-[#ff8c42] transition-all duration-300 ease-out"
            style={{
              width: `${scrollProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="relative pt-1">
        {/* Background Pattern */}
        <div
          className={`absolute inset-0 opacity-5 ${
            theme === "dark" ? "bg-white" : "bg-black"
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f67011' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Navigation */}
        <div className="relative z-10 flex justify-between items-center p-6">
          <button
            onClick={handleBackClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-['Montserrat'] font-medium">Back</span>
          </button>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer focus:outline-none ${
              theme === "dark" ? "bg-[#f67011]" : "bg-gray-300"
            }`}
            aria-label="Toggle theme"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                theme === "dark" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 text-center py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1
              className={`text-4xl lg:text-6xl font-black font-['Montserrat'] mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Terms & Conditions
            </h1>
            <p
              className={`text-lg lg:text-xl font-light font-['Montserrat'] mb-8 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Please read these terms carefully before using Todoriko
            </p>

            {/* Static Decorative Bar */}
            <div className="w-24 h-1 bg-gradient-to-r from-[#f67011] to-[#ff8c42] mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div
          className={`rounded-3xl p-8 lg:p-12 shadow-2xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-gray-700"
              : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
          }`}
        >
          {/* Last Updated */}
          <div className="text-center mb-8">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium font-['Montserrat'] ${
                theme === "dark"
                  ? "bg-[#f67011]/20 text-[#f67011]"
                  : "bg-[#f67011]/10 text-[#f67011]"
              }`}
            >
              Last updated: June 15, 2025
            </span>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="group">
              <h2
                className={`text-2xl font-bold font-['Montserrat'] mb-4 transition-colors duration-300 group-hover:text-[#f67011] ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                1. Acceptance of Terms
              </h2>
              <p
                className={`text-base font-normal font-['Montserrat'] leading-relaxed transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                By accessing and using Todoriko ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </div>

            {/* Section 2 */}
            <div className="group">
              <h2
                className={`text-2xl font-bold font-['Montserrat'] mb-4 transition-colors duration-300 group-hover:text-[#f67011] ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                2. Use License
              </h2>
              <p
                className={`text-base font-normal font-['Montserrat'] leading-relaxed mb-4 transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Permission is granted to temporarily use Todoriko for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul
                className={`list-disc list-inside space-y-2 ml-4 text-base font-normal font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose</li>
                <li>attempt to decompile or reverse engineer any software</li>
                <li>remove any copyright or other proprietary notations</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="group">
              <h2
                className={`text-2xl font-bold font-['Montserrat'] mb-4 transition-colors duration-300 group-hover:text-[#f67011] ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                3. Privacy Policy
              </h2>
              <p
                className={`text-base font-normal font-['Montserrat'] leading-relaxed transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Your privacy is important to us. We collect minimal data
                necessary for the functioning of the service. All personal
                information is encrypted and stored securely. We do not sell,
                trade, or otherwise transfer your personal information to third
                parties.
              </p>
            </div>

            {/* Section 4 */}
            <div className="group">
              <h2
                className={`text-2xl font-bold font-['Montserrat'] mb-4 transition-colors duration-300 group-hover:text-[#f67011] ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                4. User Responsibilities
              </h2>
              <p
                className={`text-base font-normal font-['Montserrat'] leading-relaxed mb-4 transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                As a user of Todoriko, you agree to:
              </p>
              <ul
                className={`list-disc list-inside space-y-2 ml-4 text-base font-normal font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <li>Use the service only for lawful purposes</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not attempt to gain unauthorized access to the service</li>
                <li>Report any security vulnerabilities you discover</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="group">
              <h2
                className={`text-2xl font-bold font-['Montserrat'] mb-4 transition-colors duration-300 group-hover:text-[#f67011] ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                5. Limitations
              </h2>
              <p
                className={`text-base font-normal font-['Montserrat'] leading-relaxed transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                In no event shall Todoriko or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use Todoriko, even if Todoriko or its
                authorized representative has been notified orally or in writing
                of the possibility of such damage.
              </p>
            </div>

            {/* Section 6 */}
            <div className="group">
              <h2
                className={`text-2xl font-bold font-['Montserrat'] mb-4 transition-colors duration-300 group-hover:text-[#f67011] ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                6. Contact Information
              </h2>
              <p
                className={`text-base font-normal font-['Montserrat'] leading-relaxed transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                If you have any questions about these Terms and Conditions,
                please contact us at{" "}
                <a
                  href="mailto:support@todoriko.com"
                  className="text-[#f67011] hover:underline font-medium"
                >
                  support@todoriko.com
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-600 text-center">
            <p
              className={`text-sm font-light font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              © 2024 Todoriko. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          theme === "dark"
            ? "bg-[#f67011] text-white"
            : "bg-[#f67011] text-white"
        }`}
      >
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}
