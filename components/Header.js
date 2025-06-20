// components/Header.js
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatarURL: null,
  });
  const [notifications] = useState([
    {
      id: 1,
      title: "Task Reminder",
      message: "Don't forget to complete your job application task",
      time: "2 hours ago",
      read: false,
      type: "reminder",
    },
    {
      id: 2,
      title: "Task Completed",
      message: "You've successfully completed 3 tasks today!",
      time: "5 hours ago",
      read: true,
      type: "success",
    },
    {
      id: 3,
      title: "New Feature",
      message: "Check out our new dark mode theme",
      time: "1 day ago",
      read: false,
      type: "info",
    },
  ]);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is on dashboard
  const isDashboard =
    pathname === "/dashboard" ||
    pathname === "/dashboard/settings" ||
    pathname === "/dashboard/schedule";
  const unreadCount = notifications.filter((n) => !n.read).length; // Generate display name from profile - two versions
  const getDisplayName = (showFullName = false) => {
    if (showFullName) {
      // For dropdown - show full name
      if (userProfile.firstName && userProfile.lastName) {
        return `${userProfile.firstName} ${userProfile.lastName}`;
      } else if (userProfile.firstName) {
        return userProfile.firstName;
      } else if (userProfile.email) {
        return userProfile.email.split("@")[0]; // Use email prefix if no name
      }
      return "User"; // Fallback
    } else {
      // For header - show only first name
      if (userProfile.firstName) {
        return userProfile.firstName;
      } else if (userProfile.email) {
        return userProfile.email.split("@")[0]; // Use email prefix if no name
      }
      return "User"; // Fallback
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };
  const handleLogout = () => {
    setShowDropdown(false);
    // Clear user session but keep profile data for next login
    localStorage.removeItem("userEmail");
    // Important: DO NOT remove userProfile - it should persist
    console.log("🚪 Logout: Removed userEmail but kept userProfile");
    router.push("/");
  };

  const handleTermsClick = () => {
    setShowDropdown(false);
    router.push("/tnc");
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Enhanced theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Trigger custom event for theme change
    const event = new CustomEvent("themeChange", {
      detail: { theme: newTheme },
    });
    window.dispatchEvent(event);

    // Close dropdown after theme change
    setShowDropdown(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder":
        return (
          <div className="w-8 h-8 bg-[#FEBC2E]/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#FEBC2E]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        );
      case "success":
        return (
          <div className="w-8 h-8 bg-[#28C840]/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#28C840]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        );
      case "info":
        return (
          <div className="w-8 h-8 bg-[#4285F4]/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#4285F4]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
        );
    }
  };
  useEffect(() => {
    // Get initial theme
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme); // Load profile from localStorage
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem("userProfile");
        const userEmail = localStorage.getItem("userEmail");
        console.log("🔍 Header loading profile - savedProfile:", savedProfile);
        console.log("🔍 Header loading profile - userEmail:", userEmail);

        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          console.log("✅ Header parsed profile data:", profileData);

          // Update with userEmail if available and different
          if (userEmail && userEmail !== profileData.email) {
            profileData.email = userEmail;
            localStorage.setItem("userProfile", JSON.stringify(profileData));
            console.log("🔧 Header updated profile email to:", userEmail);
          }

          setUserProfile(profileData);
        } else if (userEmail) {
          // Create profile from userEmail if no profile exists
          const defaultProfile = {
            firstName: "User",
            lastName: "",
            email: userEmail,
            avatarURL: null,
          };
          console.log(
            "📝 Header created profile from userEmail:",
            defaultProfile
          );
          setUserProfile(defaultProfile);
          localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
        } else {
          // Keep existing profile even if no userEmail (after logout)
          // Only set default profile if absolutely no profile exists
          console.log(
            "📝 Header: No userEmail found, keeping existing profile"
          );
          // Don't overwrite existing profile after logout
        }
      } catch (error) {
        console.error("❌ Error loading profile in Header:", error);
        const fallbackProfile = {
          firstName: "Todoriko",
          lastName: "",
          email: "user@todoapp.com",
          avatarURL: null,
        };
        setUserProfile(fallbackProfile);
      }
    };

    loadProfile();

    // Listen for theme changes
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
    };

    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    // Listen for profile changes from other components
    const handleProfileChange = (event) => {
      if (event.detail && event.detail.profile) {
        setUserProfile(event.detail.profile);
      }
    };

    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      const dropdownContainer = document.querySelector(
        ".user-dropdown-container"
      );

      if (dropdownContainer && !dropdownContainer.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("themeChange", handleThemeChange);
    window.addEventListener("profileChange", handleProfileChange);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChange", handleThemeChange);
      window.removeEventListener("profileChange", handleProfileChange);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 shadow-lg px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <div className="flex items-center">
          <h1
            className={`text-lg sm:text-xl font-bold font-['Montserrat'] transition-colors duration-300 cursor-pointer ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
            onClick={() => router.push("/")}
          >
            Todoriko
          </h1>
        </div>

        {/* Desktop Navigation - Responsive */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <button
            onClick={() => router.push("/")}
            className={`font-medium font-['Montserrat'] transition-colors duration-300 hover:text-[#f4721e] text-sm lg:text-base ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className={`font-medium font-['Montserrat'] transition-colors duration-300 hover:text-[#f4721e] text-sm lg:text-base ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            My-todo
          </button>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {isDashboard ? (
            <>
              {/* User Profile */}
              <div className="relative user-dropdown-container">
                <button
                  onClick={toggleDropdown}
                  className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl transition-all duration-300 ${
                    theme === "dark"
                      ? "hover:bg-[#2a2a2a] text-white"
                      : "hover:bg-gray-100 text-black"
                  }`}
                >
                  {" "}
                  {/* Avatar */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#febc2e] rounded-full relative overflow-hidden">
                    {userProfile.avatarURL ? (
                      <img
                        src={userProfile.avatarURL}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-b from-[#FDA894] to-[#F49074] rounded-full relative">
                          <div className="absolute top-1 left-1 w-1 h-1 bg-[#7C3605] rounded-full"></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-[#7C3605] rounded-full"></div>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-[#7C3605] rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Name - Hidden on mobile */}
                  <span className="hidden sm:block font-medium font-['Montserrat'] text-sm lg:text-base">
                    {getDisplayName()}
                  </span>
                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl shadow-xl border z-50 ${
                      theme === "dark"
                        ? "bg-[#2a2a2a] border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* User Info */}
                    <div
                      className={`px-4 py-4 border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      {" "}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#febc2e] rounded-full relative overflow-hidden">
                          {userProfile.avatarURL ? (
                            <img
                              src={userProfile.avatarURL}
                              alt="User Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 bg-gradient-to-b from-[#FDA894] to-[#F49074] rounded-full relative">
                                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#7C3605] rounded-full"></div>
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#7C3605] rounded-full"></div>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1.5 bg-[#7C3605] rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          {" "}
                          <h3
                            className={`font-semibold font-['Montserrat'] ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            {getDisplayName(true)}
                          </h3>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {userProfile.email || "No email set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Theme Switcher */}
                    <div
                      className={`px-4 py-3 border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full transition-colors duration-300 ${
                              theme === "dark"
                                ? "bg-yellow-400/20"
                                : "bg-orange-100"
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 transition-colors duration-300 ${
                                theme === "dark"
                                  ? "text-yellow-400"
                                  : "text-orange-500"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {theme === "dark" ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              )}
                            </svg>
                          </div>
                          <div>
                            <span
                              className={`font-medium font-['Montserrat'] text-sm ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              {theme === "dark" ? "Dark Mode" : "Light Mode"}
                            </span>
                            <p
                              className={`text-xs ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {theme === "dark"
                                ? "Switch to light theme"
                                : "Switch to dark theme"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-[#f67011] to-[#ff8c42] focus:ring-[#f67011]"
                              : "bg-gray-300 hover:bg-gray-400 focus:ring-gray-400"
                          } ${
                            theme === "dark"
                              ? "focus:ring-offset-[#2a2a2a]"
                              : "focus:ring-offset-white"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center ${
                              theme === "dark"
                                ? "translate-x-7"
                                : "translate-x-0"
                            }`}
                          >
                            <svg
                              className={`w-3 h-3 transition-colors duration-300 ${
                                theme === "dark"
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {theme === "dark" ? (
                                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              ) : (
                                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              )}
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Notifications Section */}
                    <div
                      className={`px-4 py-3 border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold font-['Montserrat'] ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-1 text-xs bg-[#f4721e] text-white rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notification Items */}
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b transition-colors duration-200 cursor-pointer ${
                            theme === "dark"
                              ? "border-gray-700 hover:bg-[#3a3a3a]"
                              : "border-gray-100 hover:bg-gray-50"
                          } ${
                            !notification.read
                              ? theme === "dark"
                                ? "bg-[#3a3a3a]/50"
                                : "bg-blue-50/50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`font-medium text-sm font-['Montserrat'] ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-black"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-[#f4721e] rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p
                                className={`text-xs mt-1 font-['Montserrat'] ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p
                                className={`text-xs mt-1 font-['Montserrat'] ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Notifications */}
                    <div
                      onClick={() => router.push("/notifications")}
                      className={`px-4 py-3 text-center transition-colors duration-300 border-b cursor-pointer font-['Montserrat'] ${
                        theme === "dark"
                          ? "text-[#f4721e] hover:bg-[#3a3a3a] border-gray-700"
                          : "text-[#f4721e] hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      View All Notifications
                    </div>

                    {/* Terms & Conditions */}
                    <div
                      onClick={handleTermsClick}
                      className={`px-4 py-3 transition-colors duration-300 flex items-center gap-3 cursor-pointer font-['Montserrat'] ${
                        theme === "dark"
                          ? "text-white hover:bg-[#3a3a3a] hover:text-[#f4721e]"
                          : "text-black hover:bg-gray-100 hover:text-[#f4721e]"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Terms & Conditions
                    </div>

                    {/* Logout */}
                    <div
                      onClick={handleLogout}
                      className={`px-4 py-3 transition-colors duration-300 flex items-center gap-3 text-red-500 cursor-pointer rounded-b-xl font-['Montserrat'] ${
                        theme === "dark"
                          ? "hover:bg-red-900/20"
                          : "hover:bg-red-50"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Enhanced Theme Switcher for non-logged in users */}
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 sm:w-14 sm:h-7 flex items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-[#f67011] to-[#ff8c42] focus:ring-[#f67011]"
                    : "bg-gray-300 hover:bg-gray-400 focus:ring-gray-400"
                } ${
                  theme === "dark"
                    ? "focus:ring-offset-[#1E1E1E]"
                    : "focus:ring-offset-white"
                }`}
                aria-label="Toggle theme"
              >
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center ${
                    theme === "dark"
                      ? "translate-x-6 sm:translate-x-7"
                      : "translate-x-0"
                  }`}
                >
                  <svg
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-colors duration-300 ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {theme === "dark" ? (
                      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    ) : (
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    )}
                  </svg>
                </div>
              </button>

              {/* Sign Up Button */}
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 bg-[#f4721e] hover:bg-[#e6651a] hover:scale-105 active:scale-95 text-white rounded-xl transition-all duration-300 font-medium font-['Montserrat'] text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
