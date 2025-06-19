"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { auth, db } from "@/lib/Firebase";
import {
  updateEmail,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

export default function Settings() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [avatarURL, setAvatarURL] = useState(null);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handleProfileSave = async () => {
    if (!user) return;
    const displayName = `${firstName} ${lastName}`.trim();

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: avatarURL || null,
      });

      await setDoc(doc(db, "users", user.uid), {
        displayName,
        avatarURL,
        email: user.email,
        updatedAt: serverTimestamp(),
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile: " + error.message);
    }
  };

  // Task categories untuk sidebar consistency
  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: false },
    { name: "Freelance", color: "#FEBC2E", isDefault: false },
    { name: "Work", color: "#28C840", isDefault: false },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNewEmail(currentUser.email);
        setFirstName(currentUser.displayName?.split(" ")[0] || "");
        setLastName(currentUser.displayName?.split(" ")[1] || "");
        setAvatarURL(currentUser.photoURL || null);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const validateEmail = (email) => {
    const re = /[^@]+@[^.]+\..+/;
    return re.test(email);
  };

  const handleEmailChange = async () => {
    if (!validateEmail(newEmail)) {
      alert("Invalid email");
      return;
    }
    if (!currentPassword) {
      alert("Please enter your password");
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    try {
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      await sendEmailVerification(user);
      alert("Email changed successfully! Please verify the new email.");
      setShowEmailModal(false);
    } catch (err) {
      console.error(err);
      alert("Error updating email: " + err.message);
    }
  };
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
        <Sidebar
          theme={theme}
          onThemeChange={(newTheme) => {
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
          }}
          onNavigation={handleNavigation}
          taskCategories={taskCategories}
          setTaskCategories={setTaskCategories}
          removeFilter={removeFilter}
        />
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
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                      value={user?.email || ""}
                      readOnly
                      className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                        theme === "dark"
                          ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(true)}
                      className="mt-2 px-4 py-2 bg-[#4d6080] rounded-[20px] text-white font-medium font-['Montserrat'] hover:bg-[#3a4a63] transition-colors duration-200"
                    >
                      Change Email
                    </button>
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
                      <button
                        onClick={handleProfileSave}
                        className="mt-4 px-6 py-3 bg-[#febc2e] rounded-2xl text-white font-semibold hover:bg-[#e5a627] transition"
                      >
                        Save Profile
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
            <button
              onClick={handleProfileSave}
              className="w-full sm:w-auto px-8 py-4 bg-[#febc2e] rounded-3xl text-white text-base font-bold font-['Montserrat'] hover:bg-[#e5a627] transition-colors duration-200"
            >
              Update Profile
            </button>
          </div>
        </main>
      </div>
      {showEmailModal && (
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
              onClick={() => setShowEmailModal(false)}
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

            <h3
              className={`text-xl sm:text-2xl font-bold font-['Montserrat'] mb-4 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Change Email
            </h3>

            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={`w-full h-12 px-4 mb-4 rounded-[21px] border placeholder:text-gray-400 text-sm font-['Montserrat'] ${
                theme === "dark"
                  ? "bg-[#1e1e1e] border-[#4285f4] text-white"
                  : "bg-white border-[#4285f4] text-black"
              }`}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full h-12 px-4 mb-6 rounded-[21px] border placeholder:text-gray-400 text-sm font-['Montserrat'] ${
                theme === "dark"
                  ? "bg-[#1e1e1e] border-[#4285f4] text-white"
                  : "bg-white border-[#4285f4] text-black"
              }`}
            />

            <button
              onClick={handleEmailChange}
              className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] text-sm transition-all duration-300"
            >
              Update Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
