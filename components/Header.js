// components/Header.js
"use client";
import { useState, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [showDropdown, setShowDropdown] = useState(false);
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
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    setShowDropdown(false);
    router.push("/");
  };

  // Handle Terms & Conditions click
  const handleTermsClick = () => {
    setShowDropdown(false);
    router.push("/tnc");
  };

  // Toggle dropdown function
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Dropdown clicked, current state:", showDropdown); // Debug log
    setShowDropdown(!showDropdown);
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
    setTheme(savedTheme);

    // Listen for theme changes
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
    };

    // Listen for custom event from ThemeSwitcher
    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    // Close dropdown when clicking outside
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
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChange", handleThemeChange);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Debug: Log the current state
  console.log("isDashboard:", isDashboard, "showDropdown:", showDropdown);

  return (
    <header
      className={`navbar shadow-lg px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      <div className="navbar-start">
        <h1
          className={`text-xl font-bold font-montserrat transition-colors duration-300 cursor-pointer ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
          onClick={() => router.push("/")}
        >
          Todoriko
        </h1>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              className={`transition-colors duration-300 cursor-pointer ${
                theme === "dark"
                  ? "text-white hover:text-[#f4721e]"
                  : "text-black hover:text-[#f4721e]"
              }`}
              onClick={() => router.push("/")}
            >
              Home
            </a>
          </li>
          <li>
            <a
              className={`transition-colors duration-300 cursor-pointer ${
                theme === "dark"
                  ? "text-white hover:text-[#f4721e]"
                  : "text-black hover:text-[#f4721e]"
              }`}
              onClick={() => router.push("/dashboard")}
            >
              My-todo
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <ThemeSwitcher />

        {isDashboard ? (
          // User is logged in - Show user profile
          <div className="relative user-dropdown-container">
            <button
              onClick={toggleDropdown}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                theme === "dark"
                  ? "hover:bg-[#2a2a2a] text-white"
                  : "hover:bg-gray-100 text-black"
              }`}
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-[#febc2e] rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-b from-[#FDA894] to-[#F49074] rounded-full relative">
                  {/* Simple face */}
                  <div className="absolute top-1 left-1 w-1 h-1 bg-[#7C3605] rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-[#7C3605] rounded-full"></div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-[#7C3605] rounded-full"></div>
                </div>
              </div>

              {/* Name */}
              <span className="font-medium font-montserrat">Evan</span>

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
                className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg border z-50 ${
                  theme === "dark"
                    ? "bg-[#2a2a2a] border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Notifications Section */}
                <div
                  className={`px-4 py-3 border-b ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${
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
                              className={`font-medium text-sm ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#f4721e] rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
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
                  className={`px-4 py-3 text-center transition-colors duration-300 border-b cursor-pointer ${
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
                  className={`px-4 py-3 transition-colors duration-300 flex items-center gap-3 cursor-pointer ${
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
                  className={`px-4 py-3 transition-colors duration-300 flex items-center gap-3 text-red-500 cursor-pointer rounded-b-xl ${
                    theme === "dark" ? "hover:bg-red-900/20" : "hover:bg-red-50"
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
        ) : (
          // User is not logged in - Show Sign Up button
          <button
            onClick={handleLoginClick}
            className="btn bg-[#f4721e] hover:bg-[#e6651a] text-white border-none rounded-xl transition-all duration-300"
          >
            Sign Up
          </button>
        )}
      </div>
    </header>
  );
}
