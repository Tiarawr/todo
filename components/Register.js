"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [theme, setTheme] = useState(null); // Set null initially
  const [mounted, setMounted] = useState(false); // Add mounted state
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
    // Set mounted and get saved theme
    setMounted(true);
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

    // Trigger custom event for theme change
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

  // Tambahkan function showToast setelah state declarations
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 3000);
  };

  // Handle register button click
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      showToast("Please enter a valid email address!", "error");
      return;
    }

    // Success - show modal
    setEmail(emailInput);
    setMaskedEmail(maskEmail(emailInput));
    setShowModal(true);
    showToast("Verification email sent successfully!", "success");
  };

  // Handle modal close
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Show loading screen until mounted and theme is loaded
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
      className={`w-full h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#16151a]" : "bg-[#ffffff]"
      }`}
    >
      {/* Toggle Switch - With Animation */}
      <div
        className={`absolute top-4 left-4 z-50 flex items-center gap-2 transition-all duration-800 ease-in-out ${
          isAnimating ? "transform -translate-x-full opacity-0" : ""
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

      <div className="w-full h-full flex flex-col lg:flex-row">
        {/* Left Section - Form */}
        <div
          className={`w-full lg:w-1/2 h-[50%] lg:h-full flex flex-col justify-center items-center relative transition-all duration-800 ease-in-out ${
            isAnimating ? "lg:transform lg:translate-x-full" : ""
          }`}
        >
          <h2
            className={`text-[28px] lg:text-[32px] font-extrabold font-['Montserrat'] transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Register
          </h2>

          {/* Logo Google dan Facebook */}
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
                Or register with email
              </p>
              <div className="w-[30%] h-[1px] bg-gray-400"></div>
            </div>
            <div className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full h-12 px-4 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 ${
                  theme === "dark"
                    ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                    : "border-[#4285f4] bg-white text-black"
                }`}
              />
              <input
                type="email"
                placeholder="Email"
                onChange={handleEmailChange}
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
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full h-12 px-4 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 ${
                  theme === "dark"
                    ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                    : "border-[#4285f4] bg-white text-black"
                }`}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center mt-4">
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

            <button
              type="button"
              onClick={handleRegisterClick}
              className="w-full h-12 mt-8 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300"
            >
              Register
            </button>
          </div>
          <div className="mt-4">
            <span
              className={`text-base font-light font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-[#d9d9d9]" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
            </span>
            <span
              onClick={handleLoginClick}
              className="text-[#f67011] text-base font-light font-['Montserrat'] cursor-pointer hover:underline transition-all duration-300"
            >
              Login
            </span>
          </div>
        </div>

        {/* Right Section - Branding */}
        <div
          className={`w-full lg:w-1/2 h-[50%] lg:h-full relative transition-all duration-800 ease-in-out ${
            isAnimating ? "lg:transform lg:-translate-x-full" : ""
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
              src="/Register.svg"
              alt="Register Character"
              className="w-48 h-48 lg:w-96 lg:h-96 transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showModal && (
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
              onClick={closeModal}
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                className={`text-2xl font-bold font-['Montserrat'] mb-2 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Verify Your Email
              </h3>
              <p
                className={`text-base font-normal font-['Montserrat'] ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                We've sent a verification link to
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
                {maskedEmail}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-8">
              <p
                className={`text-sm font-normal font-['Montserrat'] leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Please check your email and click the verification link to
                activate your account. Don't forget to check your spam folder!
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  closeModal();
                  router.push("/login");
                }}
                className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300"
              >
                Go to Login
              </button>
              <button
                onClick={closeModal}
                className={`w-full h-12 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Resend Email
              </button>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-6">
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

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div
            className={`shadow-xl rounded-lg p-4 max-w-sm border-l-4 animate-in slide-in-from-top-2 duration-300 ${
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
              {/* Icon */}
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <svg
                    className="w-5 h-5"
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
                    className="w-5 h-5"
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
                    className="w-5 h-5"
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
              <span className="text-sm font-semibold font-['Montserrat'] flex-1">
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
                  className="w-4 h-4"
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
