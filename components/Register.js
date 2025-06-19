"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const router = useRouter();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  useEffect(() => {
    setMounted(true);
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

  const handleLoginClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push("/login");
    }, 800);
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

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 3000);
  };

  const handleRegisterClick = () => {
    const emailInput = document.querySelector('input[type="email"]').value;
    const fullNameInput = document.querySelector('input[type="text"]').value;
    const passwordInput = document.querySelector(
      'input[type="password"]'
    ).value;
    const confirmPasswordInput = document.querySelectorAll(
      'input[type="password"]'
    )[1].value;
    const termsCheckbox = document.querySelector(
      'input[type="checkbox"]'
    ).checked;

    // Validation
    if (!fullNameInput.trim()) {
      showToast("Please enter your full name!", "error");
      return;
    }

    if (!emailInput.trim()) {
      showToast("Please enter your email address!", "error");
      return;
    }

    if (!passwordInput.trim()) {
      showToast("Please enter a password!", "error");
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      showToast("Passwords do not match!", "error");
      return;
    }

    if (!termsCheckbox) {
      showToast("Please agree to the Terms and Conditions!", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      showToast("Please enter a valid email address!", "error");
      return;
    }

    setEmail(emailInput);
    setMaskedEmail(maskEmail(emailInput));
    setShowModal(true);
    showToast("Verification email sent successfully!", "success");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  if (!mounted || theme === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f67011] mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Montserrat']">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#16151a]" : "bg-[#ffffff]"
      }`}
    >
      {/* Toggle Switch - Mobile responsive */}
      <div
        className={`absolute top-4 left-4 z-50 flex items-center gap-2 transition-all duration-800 ease-in-out ${
          isAnimating ? "transform -translate-x-full opacity-0" : ""
        }`}
      >
        <button
          type="button"
          onClick={toggleTheme}
          className={`relative w-10 h-5 sm:w-12 sm:h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer focus:outline-none ${
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

      {/* Main Container - Fixed: flex-col tanpa reverse */}
      <div className="flex flex-col xl:flex-row px-4 sm:px-6 lg:px-8 xl:px-24 gap-4 sm:gap-6 xl:gap-8">
        {/* Branding Section - Mobile: Atas, Desktop: Kanan */}
        <aside className="w-full xl:w-1/2 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto">
          <div
            className={`min-h-[40vh] xl:min-h-screen relative flex flex-col justify-center items-center py-8 xl:py-0 transition-all duration-800 ease-in-out ${
              isAnimating ? "xl:transform xl:-translate-x-full" : ""
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
            <div className="relative z-10 text-center px-4 sm:px-6 xl:px-8">
              <h1
                className={`text-3xl sm:text-4xl xl:text-5xl font-black font-['Montserrat'] transition-colors duration-300 mb-2 sm:mb-4 ${
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
            <div className="relative z-10 mt-4 xl:mt-8">
              <img
                src="/Register.svg"
                alt="Register Character"
                className="w-32 h-32 sm:w-48 sm:h-48 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </aside>

        {/* Form Section - Mobile: Bawah, Desktop: Kiri */}
        <main className="flex-1 space-y-6 sm:space-y-8 pb-8">
          <div
            className={`min-h-[60vh] xl:min-h-screen flex flex-col justify-center items-center py-8 xl:py-0 transition-all duration-800 ease-in-out ${
              isAnimating ? "xl:transform xl:translate-x-full" : ""
            }`}
          >
            <div className="w-full max-w-md space-y-6 sm:space-y-8">
              {/* Title */}
              <h2
                className={`text-2xl sm:text-3xl xl:text-[32px] font-extrabold font-['Montserrat'] text-center transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Register
              </h2>

              {/* Social Login */}
              <div className="flex justify-center gap-4 sm:gap-6">
                <div className="group cursor-pointer">
                  <img
                    src="/Google.svg"
                    alt="Google Logo"
                    className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125"
                  />
                </div>
                <div className="group cursor-pointer">
                  <img
                    src="/Facebook.svg"
                    alt="Facebook Logo"
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
                  Or register with email
                </p>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`w-full h-12 sm:h-14 px-4 sm:px-6 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
                    theme === "dark"
                      ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                      : "border-[#4285f4] bg-white text-black"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleEmailChange}
                  className={`w-full h-12 sm:h-14 px-4 sm:px-6 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
                    theme === "dark"
                      ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                      : "border-[#4285f4] bg-white text-black"
                  }`}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={`w-full h-12 sm:h-14 px-4 sm:px-6 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
                    theme === "dark"
                      ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                      : "border-[#4285f4] bg-white text-black"
                  }`}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full h-12 sm:h-14 px-4 sm:px-6 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
                    theme === "dark"
                      ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                      : "border-[#4285f4] bg-white text-black"
                  }`}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 accent-[#f67011] cursor-pointer flex-shrink-0"
                />
                <label className="text-sm font-['Montserrat'] cursor-pointer leading-relaxed">
                  <span
                    className={`transition-colors duration-300 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => router.push(`/tnc?theme=${theme}`)}
                      className="text-[#f67011] hover:underline"
                    >
                      Terms and Conditions
                    </button>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="button"
                onClick={handleRegisterClick}
                className="w-full h-12 sm:h-14 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base"
              >
                Register
              </button>

              {/* Login Link */}
              <div className="text-center">
                <span
                  className={`text-sm sm:text-base font-light font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-[#d9d9d9]" : "text-gray-600"
                  }`}
                >
                  Already have an account?{" "}
                </span>
                <span
                  onClick={handleLoginClick}
                  className="text-[#f67011] text-sm sm:text-base font-light font-['Montserrat'] cursor-pointer hover:underline transition-all duration-300"
                >
                  Login
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Verification Modal - Mobile responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div
            className={`relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            }`}
          >
            {/* Modal content remains the same but responsive */}
            <button
              onClick={closeModal}
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                className={`text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Verify Your Email
              </h3>
              <p
                className={`text-sm sm:text-base font-normal font-['Montserrat'] px-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                We've sent a verification link to
              </p>
            </div>

            <div className="text-center mb-4 sm:mb-6">
              <div
                className={`inline-block px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium font-['Montserrat'] text-sm sm:text-base break-all ${
                  theme === "dark"
                    ? "bg-[#f67011]/20 text-[#f67011]"
                    : "bg-[#f67011]/10 text-[#f67011]"
                }`}
              >
                {maskedEmail}
              </div>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <p
                className={`text-xs sm:text-sm font-normal font-['Montserrat'] leading-relaxed px-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Please check your email and click the verification link to
                activate your account. Don't forget to check your spam folder!
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  closeModal();
                  router.push("/login");
                }}
                className="w-full h-12 sm:h-14 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base"
              >
                Go to Login
              </button>
              <button
                onClick={closeModal}
                className={`w-full h-12 sm:h-14 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Resend Email
              </button>
            </div>

            <div className="text-center mt-4 sm:mt-6">
              <p
                className={`text-xs font-light font-['Montserrat'] ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification - Mobile responsive */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] px-4 w-full max-w-sm">
          <div
            className={`shadow-xl rounded-lg p-3 sm:p-4 border-l-4 animate-in slide-in-from-top-2 duration-300 ${
              toast.type === "success"
                ? "bg-green-600 border-green-400 text-white"
                : toast.type === "warning"
                ? "bg-yellow-600 border-yellow-400 text-white"
                : toast.type === "info"
                ? "bg-blue-600 border-blue-400 text-white"
                : "bg-red-600 border-red-400 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                {toast.type === "error" && (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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

              <span className="text-xs sm:text-sm font-semibold font-['Montserrat'] flex-1">
                {toast.message}
              </span>

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
