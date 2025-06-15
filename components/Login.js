"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [theme, setTheme] = useState("light");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [maskedForgotEmail, setMaskedForgotEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get initial theme from localStorage or default to "light"
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Listen for theme changes
    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  const toggleTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const event = new CustomEvent("themeChange", {
      detail: { theme: newTheme },
    });
    window.dispatchEvent(event);
  };

  const handleSignUpClick = () => {
    setIsAnimating(true);

    setTimeout(() => {
      router.push("/register");
    }, 800);
  };

  // Handle login button click
  const handleLoginClick = () => {
    setIsLoggingIn(true);

    // Simulate login process with a short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  // Function to mask email
  const maskEmail = (email) => {
    if (!email) return "";

    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;

    const maskedLocal =
      localPart.length > 2
        ? localPart[0] +
          "*".repeat(localPart.length - 2) +
          localPart[localPart.length - 1]
        : localPart[0] + "*".repeat(localPart.length - 1);

    const [domainName, domainExt] = domain.split(".");
    const maskedDomain =
      domainName.length > 2
        ? domainName[0] +
          "*".repeat(domainName.length - 2) +
          domainName[domainName.length - 1]
        : domainName[0] + "*".repeat(domainName.length - 1);

    return `${maskedLocal}@${maskedDomain}.${domainExt}`;
  };

  // Handle forgot password click
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
    setIsEmailSent(false);
  };

  // Handle send reset email
  const handleSendResetEmail = () => {
    if (forgotEmail) {
      setMaskedForgotEmail(maskEmail(forgotEmail));
      setIsEmailSent(true);
    } else {
      alert("Please enter your email address");
    }
  };

  // Handle modal close
  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setMaskedForgotEmail("");
    setIsEmailSent(false);
  };

  return (
    <div
      className={`w-full h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#16151a]" : "bg-[#ffffff]"
      }`}
    >
      {/* Toggle Switch - With Animation */}
      <div
        className={`absolute top-4 right-4 z-50 flex items-center gap-2 transition-all duration-800 ease-in-out ${
          isAnimating ? "transform translate-x-full opacity-0" : ""
        }`}
      >
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

      <div className="w-full h-full flex flex-col lg:flex-row relative">
        {/* Left Section - Branding - Slides to Right */}
        <div
          className={`w-full lg:w-1/2 h-[50%] lg:h-full relative transition-all duration-800 ease-in-out ${
            isAnimating ? "lg:transform lg:translate-x-full" : ""
          }`}
        >
          <div
            className={`absolute inset-0 transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-b from-[#e8d9ca] to-[#f4721e]/80"
                : "bg-gradient-to-b from-[#f0f0f0] to-[#f4721e]/80"
            }`}
          />
          <div className="absolute left-[10%] top-[20%] lg:left-[33%] lg:top-[25%] text-center">
            <h1
              className={`text-4xl lg:text-5xl font-black font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Todoriko
            </h1>
            <p
              className={`mt-4 text-base font-bold font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Your personal tracker
            </p>
          </div>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
            <img
              src="/Login.svg"
              alt="Login Character"
              className="w-48 h-48 lg:w-96 lg:h-96 transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Section - Form - Slides to Left */}
        <div
          className={`w-full lg:w-1/2 h-[50%] lg:h-full flex flex-col justify-center items-center relative transition-all duration-800 ease-in-out ${
            isAnimating ? "lg:transform lg:-translate-x-full" : ""
          }`}
        >
          <h2
            className={`text-[28px] lg:text-[32px] font-extrabold font-['Montserrat'] transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Login
          </h2>

          <div className="flex gap-4 mt-4">
            <div className="group cursor-pointer">
              <img
                src="/Google.svg"
                alt="Google Logo"
                className="w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125"
              />
            </div>
            <div className="group cursor-pointer">
              <img
                src="/Facebook.svg"
                alt="Facebook Logo"
                className="w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125"
              />
            </div>
          </div>

          <div className="w-full max-w-md mt-8">
            <div className="flex items-center justify-between">
              <div className="w-[30%] h-[1px] bg-gray-400"></div>
              <p
                className={`text-base font-normal font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Or login with email
              </p>
              <div className="w-[30%] h-[1px] bg-gray-400"></div>
            </div>
            <div className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Email"
                className={`w-full h-12 px-4 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 ${
                  theme === "dark"
                    ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                    : "border-[#4285f4] bg-white text-black"
                }`}
              />
              <input
                type="password"
                placeholder="Password"
                className={`w-full h-12 px-4 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 ${
                  theme === "dark"
                    ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                    : "border-[#4285f4] bg-white text-black"
                }`}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 text-sm font-['Montserrat'] transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#f67011] cursor-pointer"
                />
                <span
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Remember me
                </span>
              </label>
              <a
                href="#"
                onClick={handleForgotPasswordClick}
                className={`text-sm font-['Montserrat'] transition-colors duration-300 hover:underline ${
                  theme === "dark" ? "text-[#f67011]" : "text-[#f67011]"
                }`}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="button"
              onClick={handleLoginClick}
              disabled={isLoggingIn}
              className={`w-full h-12 mt-8 text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 flex items-center justify-center ${
                isLoggingIn
                  ? "bg-[#e6651a] cursor-not-allowed"
                  : "bg-[#f67011] hover:bg-[#e6651a]"
              }`}
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div className="mt-4">
            <span
              className={`text-base font-light font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-[#d9d9d9]" : "text-gray-600"
              }`}
            >
              Don't have an account?{" "}
            </span>
            <span
              onClick={handleSignUpClick}
              className="text-[#f67011] text-base font-light font-['Montserrat'] cursor-pointer hover:underline transition-all duration-300"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div
            className={`relative max-w-md w-full rounded-3xl p-8 shadow-2xl transform transition-all duration-300 scale-100 ${
              theme === "dark"
                ? "bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeForgotModal}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-black"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!isEmailSent ? (
              // Step 1: Email Input
              <>
                {/* Icon */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#f67011]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[#f67011]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-2xl font-bold font-['Montserrat'] mb-2 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Forgot Password?
                  </h3>
                  <p
                    className={`text-base font-normal font-['Montserrat'] ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No worries! Enter your email and we'll send you a reset
                    link.
                  </p>
                </div>

                {/* Email Input */}
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={`w-full h-12 px-4 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 ${
                      theme === "dark"
                        ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                        : "border-[#4285f4] bg-white text-black"
                    }`}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleSendResetEmail}
                    className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300"
                  >
                    Send Reset Link
                  </button>
                  <button
                    onClick={closeForgotModal}
                    className={`w-full h-12 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Back to Login
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Confirmation
              <>
                {/* Icon */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-2xl font-bold font-['Montserrat'] mb-2 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Check Your Email
                  </h3>
                  <p
                    className={`text-base font-normal font-['Montserrat'] ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    We've sent a password reset link to
                  </p>
                </div>

                {/* Masked Email */}
                <div className="text-center mb-6">
                  <div
                    className={`inline-block px-4 py-2 rounded-full font-medium font-['Montserrat'] ${
                      theme === "dark"
                        ? "bg-[#f67011]/20 text-[#f67011]"
                        : "bg-[#f67011]/10 text-[#f67011]"
                    }`}
                  >
                    {maskedForgotEmail}
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center mb-8">
                  <p
                    className={`text-sm font-normal font-['Montserrat'] leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Click the link in the email to reset your password. If you
                    don't see the email, check your spam folder.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={closeForgotModal}
                    className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300"
                  >
                    Back to Login
                  </button>
                  <button
                    onClick={() => {
                      setIsEmailSent(false);
                      setForgotEmail("");
                    }}
                    className={`w-full h-12 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Try Different Email
                  </button>
                </div>
              </>
            )}

            {/* Footer Note */}
            <div className="text-center mt-6">
              <p
                className={`text-xs font-light font-['Montserrat'] ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Need help? Contact our support team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
