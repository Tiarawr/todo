"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [avatarURL, setAvatarURL] = useState(null);

  // Task categories untuk sidebar consistency
  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: false },
    { name: "Freelance", color: "#FEBC2E", isDefault: false },
    { name: "Work", color: "#28C840", isDefault: false },
  ]);

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

  const handleNavigation = (path) => {
    router.push(path);
  };

  const removeFilter = (filterName) => {
    setTaskCategories((prev) =>
      prev.filter((cat) => cat.name.toLowerCase() !== filterName.toLowerCase())
    );
  };

  // Loading state
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
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      <div className="flex flex-col lg:flex-row px-4 md:px-6 lg:px-24 gap-8">
        {/* Sidebar - Same as Dashboard */}
        <aside className="w-full lg:w-80 space-y-8">
          {/* Profile Section */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative w-20 h-20 mb-4">
                <div className="w-20 h-20 bg-[#febc2e] rounded-full relative overflow-hidden">
                  {/* Avatar illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-[#FDA894] to-[#F49074] rounded-full relative">
                      {/* Simple face */}
                      <div className="absolute top-4 left-4 w-2 h-2 bg-[#7C3605] rounded-full"></div>
                      <div className="absolute top-4 right-4 w-2 h-2 bg-[#7C3605] rounded-full"></div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-[#7C3605] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h2
                className={`text-xl font-semibold font-['Montserrat'] mb-1 transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Todoriko
              </h2>
              <p className="text-[#febc2e] text-sm font-normal font-['Montserrat']">
                Evan Puertorico
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white opacity-20"></div>

          {/* Menu Items */}
          <nav className="space-y-6">
            {/* Today Task - Clickable with proper hover area */}
            <div className="space-y-4">
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="flex items-center space-x-3 group" // Pindahkan group ke sini, bukan di parent
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                      fill="#6f6a6a"
                      className="group-hover:fill-[#FEBC2E] transition-colors duration-300"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 group-hover:text-[#FEBC2E] ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Today Task
                </h3>
              </button>

              {/* Task Categories - Di luar button */}
              <div className="space-y-3 ml-13">
                {taskCategories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between group/category"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span
                        className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                    {/* Remove button - only for custom categories */}
                    {!category.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCategory(category.name);
                        }}
                        className="opacity-0 group-hover/category:opacity-100 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-200 hover:bg-red-600"
                        title={`Remove ${category.name} category`}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1 1l6 6M1 7l6-6"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                {/* Add category button */}
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                    onClick={() => setShowAddCategoryModal(true)}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className={theme === "dark" ? "text-white" : "text-black"}
                    >
                      <path
                        d="M5 1v8M1 5h8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 cursor-pointer hover:text-[#FEBC2E] ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                    onClick={() => setShowAddCategoryModal(true)}
                  >
                    Add category
                  </span>
                </div>
              </div>
            </div>
            {/* Schedule Tasks */}
            <button
              onClick={() => handleNavigation("/dashboard/schedule")}
              className="flex items-center space-x-3 group w-full"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.04 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                    fill="#D9D9D9"
                    className="group-hover:fill-[#FEBC2E] transition-colors duration-300"
                  />
                </svg>
              </div>
              <span
                className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 group-hover:text-[#FEBC2E] ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Schedule Tasks
              </span>
            </button>
            {/* Settings - Active State */}
            <div className="flex items-center space-x-3 group w-full">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                    fill="#FEBC2E"
                    className="transition-colors duration-300"
                  />
                </svg>
              </div>
              <span
                className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Settings
              </span>
            </div>{" "}
          </nav>
        </aside>

        {/* Main Content - Settings */}
        <main className="flex-1 space-y-6 md:space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1
              className={`text-2xl md:text-4xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Settings
            </h1>
            <p
              className={`text-base md:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
              }`}
            >
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button className="px-4 py-2 md:px-6 md:py-3 bg-[#febc2e] rounded-[20px] text-white text-sm md:text-base font-semibold font-['Montserrat']">
              Profile
            </button>
            <button
              onClick={() =>
                handleNavigation("/dashboard/settings/notification")
              }
              className="px-4 py-2 md:px-6 md:py-3 bg-[#d9d9d9] rounded-[20px] text-[#6f6a6a] text-sm md:text-base font-semibold font-['Montserrat'] hover:bg-[#febc2e] hover:text-white transition-colors duration-200"
            >
              Notifications
            </button>
            <button
              onClick={() => handleNavigation("/dashboard/settings/help")}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#d9d9d9] rounded-[20px] text-[#6f6a6a] text-sm md:text-base font-semibold font-['Montserrat'] hover:bg-[#febc2e] hover:text-white transition-colors duration-200"
            >
              Help
            </button>
          </div>

          {/* Profile Section */}
          <div
            className={`p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-6">
              {/* Section Header */}
              <div className="space-y-2">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Profile
                </h2>
                <p
                  className={`text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                  }`}
                >
                  Set your account details
                </p>
              </div>

              {/* Profile Content */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Fields */}
                <div className="flex-1 space-y-6">
                  {/* Name & Surname Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-4">
                      <label
                        className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                          theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                        }`}
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        placeholder="your first name"
                        className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                        }`}
                      />
                    </div>

                    {/* Surname Field */}
                    <div className="space-y-4">
                      <label
                        className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                          theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                        }`}
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        placeholder="your last name"
                        className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-4">
                    <label
                      className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your email"
                      className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                        theme === "dark"
                          ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start space-y-4">
                  {/* Avatar Display */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-[#febc2e] rounded-full overflow-hidden relative">
                      {avatarURL ? (
                        <img
                          src={avatarURL}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-b from-[#FDA894] to-[#F49074] rounded-full relative">
                            <div className="absolute top-6 left-6 w-3 h-3 bg-[#7C3605] rounded-full"></div>
                            <div className="absolute top-6 right-6 w-3 h-3 bg-[#7C3605] rounded-full"></div>
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-[#7C3605] rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    {avatarURL && (
                      <button
                        onClick={() => setAvatarURL(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-[#4d6080] rounded-full flex items-center justify-center hover:bg-[#3a4a63] transition-colors duration-200"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 2L10 10M2 10L10 2"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* File input & button - Aligned with avatar */}
                  <div className="flex justify-center w-full">
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (!file.type.startsWith("image/")) {
                            alert("Only image files are allowed.");
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            alert("Image must be less than 2MB.");
                            return;
                          }
                          const objectURL = URL.createObjectURL(file);
                          setAvatarURL(objectURL);
                        }
                      }}
                    />
                    <label htmlFor="photo-upload">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("photo-upload").click()
                        }
                        className="px-4 py-2 bg-[#4d6080] rounded-[20px] text-white text-sm md:text-base font-medium font-['Montserrat'] hover:bg-[#3a4a63] transition-colors duration-200"
                      >
                        Edit Photo
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div
            className={`p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row md:space-x-10 space-y-8 md:space-y-0">
              {/* Section Header di kiri */}
              <div className="md:w-1/3">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Password
                </h2>
                <p
                  className={`text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                  }`}
                >
                  Set your password
                </p>
              </div>

              {/* Form Fields di kanan */}
              <div className="md:w-2/3 w-full space-y-6">
                {/* Current Password */}
                <div className="flex flex-col space-y-2 w-full max-w-md">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Current password
                  </label>
                  <input
                    type="password"
                    className={`w-full max-w-md px-4 py-3 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* New Password */}
                <div className="flex flex-col space-y-2 w-full max-w-md">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    className={`w-full max-w-md px-4 py-3 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Repeat Password */}
                <div className="flex flex-col space-y-2 w-full max-w-md">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Repeat password
                  </label>
                  <input
                    type="password"
                    className={`w-full max-w-md px-4 py-3 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end pt-4">
                  <button className="text-[#febc2e] text-base font-light font-['Montserrat'] hover:text-[#e5a627] transition-colors duration-200">
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timezone & Preference Section */}
          <div
            className={`p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-6">
              {/* Section Header */}
              <div className="space-y-2">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Timezone & preference
                </h2>
                <p
                  className={`text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                  }`}
                >
                  Let us know the time zone and format
                </p>
              </div>

              {/* Timezone Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Region Field */}
                <div className="space-y-4">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Region
                  </label>
                  <select
                    className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white"
                        : "bg-white border-[#d9d9d9] text-black"
                    }`}
                  >
                    <option value="">Select region</option>
                    <option value="asia-southeast">Asia - Southeast</option>
                    <option value="asia-east">Asia - East</option>
                    <option value="asia-south">Asia - South</option>
                    <option value="europe-west">Europe - West</option>
                    <option value="europe-east">Europe - East</option>
                    <option value="north-america-east">
                      North America - East
                    </option>
                    <option value="north-america-west">
                      North America - West
                    </option>
                    <option value="south-america">South America</option>
                    <option value="africa">Africa</option>
                    <option value="oceania">Oceania</option>
                  </select>
                </div>

                {/* Timezone Field */}
                <div className="space-y-4">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Timezone
                  </label>
                  <select
                    className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white"
                        : "bg-white border-[#d9d9d9] text-black"
                    }`}
                  >
                    <option value="">Select timezone</option>
                    {/* Asia */}
                    <option value="UTC+7">UTC+7 (Jakarta, Bangkok)</option>
                    <option value="UTC+8">
                      UTC+8 (Singapore, Kuala Lumpur)
                    </option>
                    <option value="UTC+9">UTC+9 (Tokyo, Seoul)</option>
                    <option value="UTC+5:30">UTC+5:30 (Mumbai, Delhi)</option>
                    {/* Europe */}
                    <option value="UTC+0">UTC+0 (London, Dublin)</option>
                    <option value="UTC+1">UTC+1 (Paris, Berlin, Rome)</option>
                    <option value="UTC+2">UTC+2 (Helsinki, Athens)</option>
                    <option value="UTC+3">UTC+3 (Moscow, Istanbul)</option>
                    {/* Americas */}
                    <option value="UTC-5">UTC-5 (New York, Toronto)</option>
                    <option value="UTC-6">UTC-6 (Chicago, Mexico City)</option>
                    <option value="UTC-7">UTC-7 (Denver, Phoenix)</option>
                    <option value="UTC-8">
                      UTC-8 (Los Angeles, Vancouver)
                    </option>
                    <option value="UTC-3">
                      UTC-3 (São Paulo, Buenos Aires)
                    </option>
                    {/* Others */}
                    <option value="UTC+2">UTC+2 (Cairo, Johannesburg)</option>
                    <option value="UTC+10">UTC+10 (Sydney, Melbourne)</option>
                    <option value="UTC+12">UTC+12 (Auckland, Fiji)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#febc2e] rounded-3xl text-white text-base font-bold font-['Montserrat'] hover:bg-[#e5a627] transition-colors duration-200">
              Update Profile
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
