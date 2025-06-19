"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const [theme, setTheme] = useState("light");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [maskedForgotEmail, setMaskedForgotEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 3000);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

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

  const handleLoginClick = async () => {
    if (!email || !password) {
      showToast("Email and password are required.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await user.reload();

      if (!user.emailVerified) {
        showToast("Please verify your email before logging in.", "warning");
        setIsLoggingIn(false);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      showToast(error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return; // cegah double click
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      showToast(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };
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

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
    setIsEmailSent(false);
  };

  const handleSendResetEmail = async () => {
    if (forgotEmail) {
      try {
        await sendPasswordResetEmail(auth, forgotEmail);
        setMaskedForgotEmail(maskEmail(forgotEmail));
        setIsEmailSent(true);
      } catch (error) {
        showToast(error.message);
        console.error("Reset error:", error);
      }
    } else {
      showToast("Please enter your email address");
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setMaskedForgotEmail("");
    setIsEmailSent(false);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#16151a]" : "bg-[#ffffff]"
      }`}
    >
      {/* Toggle Switch - Responsive positioning */}
      <div
        className={`absolute top-4 right-4 z-50 flex items-center gap-2 transition-all duration-800 ease-in-out ${
          isAnimating ? "transform translate-x-full opacity-0" : ""
        }`}
      >
        <button
          type="button"
          onClick={toggleTheme}
          className={`relative w-10 h-5 sm:w-12 sm:h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
            theme === "dark" ? "bg-[#f67011]" : "bg-gray-300"
          }`}
          aria-label="Toggle theme"
        >
          <div
            className={`w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
              theme === "dark"
                ? "translate-x-5 sm:translate-x-6"
                : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Main Container - Mobile First Layout */}
      <div className="min-h-screen flex flex-col">
        {/* Mobile: Single column layout, Desktop: Two column layout */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Branding Section */}
          <div
            className={`w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen relative flex flex-col justify-center items-center transition-all duration-800 ease-in-out ${
              isAnimating ? "lg:transform lg:translate-x-full" : ""
            }`}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-b from-[#e8d9ca] to-[#f4721e]/80"
                  : "bg-gradient-to-b from-[#f0f0f0] to-[#f4721e]/80"
              }`}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-black font-['Montserrat'] transition-colors duration-300 mb-2 sm:mb-4 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Todoriko
              </h1>
              <p
                className={`text-sm sm:text-base font-bold font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Your personal tracker
              </p>
            </div>

            {/* Character Image */}
            <div className="relative z-10 mt-4 lg:mt-8">
              <img
                src="/Login.svg"
                alt="Login Character"
                className="w-32 h-32 sm:w-48 sm:h-48 lg:w-80 lg:h-80 xl:w-96 xl:h-96 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Form Section */}
          <div
            className={`w-full lg:w-1/2 min-h-[60vh] lg:min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0 transition-all duration-800 ease-in-out ${
              isAnimating ? "lg:transform lg:-translate-x-full" : ""
            }`}
          >
            <div className="w-full max-w-md space-y-6 sm:space-y-8">
              {/* Title */}
              <h2
                className={`text-2xl sm:text-3xl lg:text-[32px] font-extrabold font-['Montserrat'] text-center transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Login
              </h2>

              {/* Social Login */}
              <div className="flex justify-center gap-4 sm:gap-6">
                <div
                  className="group cursor-pointer"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="/Google.svg"
                    alt="Google Logo"
                    className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-4">
                <div className="flex-1 h-px bg-gray-400"></div>
                <p
                  className={`text-sm sm:text-base font-normal font-['Montserrat'] whitespace-nowrap px-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Or login with email
                </p>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-12 sm:h-14 px-4 sm:px-6 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
                    theme === "dark"
                      ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                      : "border-[#4285f4] bg-white text-black"
                  }`}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-12 sm:h-14 px-4 sm:px-6 pr-12 sm:pr-14 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
                      theme === "dark"
                        ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                        : "border-[#4285f4] bg-white text-black"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 transition-colors duration-300 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {" "}
                    {showPassword ? (
                      // Eye Off Icon
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      // Eye On Icon
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
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
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
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
                  className="text-sm font-['Montserrat'] text-[#f67011] hover:underline transition-colors duration-300"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={handleLoginClick}
                disabled={isLoggingIn}
                className={`w-full h-12 sm:h-14 text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
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

              {/* Sign Up Link */}
              <div className="text-center">
                <span
                  className={`text-sm sm:text-base font-light font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-[#d9d9d9]" : "text-gray-600"
                  }`}
                >
                  Don't have an account?{" "}
                </span>
                <span
                  onClick={handleSignUpClick}
                  className="text-[#f67011] text-sm sm:text-base font-light font-['Montserrat'] cursor-pointer hover:underline transition-all duration-300"
                >
                  Sign up
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div
            className={`relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeForgotModal}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-black"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#f67011]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-[#f67011]"
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
                    className={`text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Forgot Password?
                  </h3>
                  <p
                    className={`text-sm sm:text-base font-normal font-['Montserrat'] px-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No worries! Enter your email and we'll send you a reset
                    link.
                  </p>
                </div>

                {/* Email Input */}
                <div className="mb-4 sm:mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={`w-full h-12 sm:h-14 px-4 sm:px-6 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
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
                    className="w-full h-12 sm:h-14 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base"
                  >
                    Send Reset Link
                  </button>
                  <button
                    onClick={closeForgotModal}
                    className={`w-full h-12 sm:h-14 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base ${
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
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-green-500"
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
                    className={`text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Check Your Email
                  </h3>
                  <p
                    className={`text-sm sm:text-base font-normal font-['Montserrat'] px-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    We've sent a password reset link to
                  </p>
                </div>

                {/* Masked Email */}
                <div className="text-center mb-4 sm:mb-6">
                  <div
                    className={`inline-block px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium font-['Montserrat'] text-sm sm:text-base break-all ${
                      theme === "dark"
                        ? "bg-[#f67011]/20 text-[#f67011]"
                        : "bg-[#f67011]/10 text-[#f67011]"
                    }`}
                  >
                    {maskedForgotEmail}
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center mb-6 sm:mb-8">
                  <p
                    className={`text-xs sm:text-sm font-normal font-['Montserrat'] leading-relaxed px-2 ${
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
                    className="w-full h-12 sm:h-14 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base"
                  >
                    Back to Login
                  </button>
                  <button
                    onClick={() => {
                      setIsEmailSent(false);
                      setForgotEmail("");
                    }}
                    className={`w-full h-12 sm:h-14 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base ${
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
            <div className="text-center mt-4 sm:mt-6">
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

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] px-4 w-full max-w-sm">
          <div
            className={`shadow-xl rounded-lg p-3 sm:p-4 border-l-4 ${
              toast.type === "success"
                ? "bg-green-600 border-green-400 text-white shadow-green-500/30 dark:bg-green-700 dark:border-green-500 dark:text-green-100"
                : toast.type === "warning"
                ? "bg-yellow-600 border-yellow-400 text-white shadow-yellow-500/30 dark:bg-yellow-700 dark:border-yellow-500 dark:text-yellow-100"
                : toast.type === "info"
                ? "bg-blue-600 border-blue-400 text-white shadow-blue-500/30 dark:bg-blue-700 dark:border-blue-500 dark:text-blue-100"
                : "bg-red-600 border-red-400 text-white shadow-red-500/30 dark:bg-red-700 dark:border-red-500 dark:text-red-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toast.type === "warning" && (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toast.type === "info" && (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Message */}
              <span className="text-xs sm:text-sm font-semibold font-['Montserrat'] flex-1 text-white">
                {toast.message}
              </span>

              {/* Close button */}
              <button
                onClick={() =>
                  setToast({ show: false, message: "", type: "error" })
                }
                className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
