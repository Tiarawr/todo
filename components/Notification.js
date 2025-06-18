"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationSettings() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Task categories untuk sidebar consistency
  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: false },
    { name: "Freelance", color: "#FEBC2E", isDefault: false },
    { name: "Work", color: "#28C840", isDefault: false },
  ]);

  // Modal state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Notification settings state
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    deadlineAlerts: true,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    reminderTime: "15", // minutes before
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

  const handleNotificationChange = (key, value) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const removeCategory = (categoryName) => {
    setTaskCategories((prev) =>
      prev.filter(
        (cat) => cat.name.toLowerCase() !== categoryName.toLowerCase()
      )
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
            {/* Today Task */}
            <div className="space-y-4">
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="flex items-center space-x-3 group w-full"
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

              {/* Task Categories */}
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
                    {/* Remove button */}
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
              <span className="text-xl font-semibold font-['Montserrat'] transition-colors duration-300 text-[#FEBC2E]">
                Settings
              </span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6 md:space-y-8">
          {/* Back Button for Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => handleNavigation("/dashboard/settings")}
              className="flex items-center space-x-2 mb-6"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke={theme === "dark" ? "#FEBC2E" : "#6f6a6a"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className={`font-['Montserrat'] font-medium ${
                  theme === "dark" ? "text-[#FEBC2E]" : "text-[#6f6a6a]"
                }`}
              >
                Back to Settings
              </span>
            </button>
          </div>

          {/* Page Header */}
          <div className="space-y-2">
            <h1
              className={`text-2xl md:text-4xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Notification Settings
            </h1>
            <p
              className={`text-base md:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
              }`}
            >
              Manage how and when you receive notifications
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={() => handleNavigation("/dashboard/settings")}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#d9d9d9] rounded-[20px] text-[#6f6a6a] text-sm md:text-base font-semibold font-['Montserrat'] hover:bg-[#febc2e] hover:text-white transition-colors duration-200"
            >
              Profile
            </button>
            <button className="px-4 py-2 md:px-6 md:py-3 bg-[#febc2e] rounded-[20px] text-white text-sm md:text-base font-semibold font-['Montserrat']">
              Notifications
            </button>
            <button
              onClick={() => handleNavigation("/dashboard/settings/help")}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#d9d9d9] rounded-[20px] text-[#6f6a6a] text-sm md:text-base font-semibold font-['Montserrat'] hover:bg-[#febc2e] hover:text-white transition-colors duration-200"
            >
              Help
            </button>
          </div>

          {/* Notification Preferences */}
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
                  Notification Preferences
                </h2>
                <p
                  className={`text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                  }`}
                >
                  Choose what notifications you want to receive
                </p>
              </div>

              {/* Notification Options */}
              <div className="space-y-6">
                {/* Task Reminders */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-base font-semibold font-['Montserrat'] ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Task Reminders
                    </h3>
                    <p
                      className={`text-sm font-['Montserrat'] ${
                        theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                      }`}
                    >
                      Get reminded about your upcoming tasks
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.taskReminders}
                      onChange={(e) =>
                        handleNotificationChange(
                          "taskReminders",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#febc2e]"></div>
                  </label>
                </div>

                {/* Deadline Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-base font-semibold font-['Montserrat'] ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Deadline Alerts
                    </h3>
                    <p
                      className={`text-sm font-['Montserrat'] ${
                        theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                      }`}
                    >
                      Alert when tasks are approaching deadline
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.deadlineAlerts}
                      onChange={(e) =>
                        handleNotificationChange(
                          "deadlineAlerts",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#febc2e]"></div>
                  </label>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-base font-semibold font-['Montserrat'] ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Email Notifications
                    </h3>
                    <p
                      className={`text-sm font-['Montserrat'] ${
                        theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                      }`}
                    >
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) =>
                        handleNotificationChange(
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#febc2e]"></div>
                  </label>
                </div>

                {/* Sound Enabled */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-base font-semibold font-['Montserrat'] ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Sound Notifications
                    </h3>
                    <p
                      className={`text-sm font-['Montserrat'] ${
                        theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                      }`}
                    >
                      Play sound when receiving notifications
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.soundEnabled}
                      onChange={(e) =>
                        handleNotificationChange(
                          "soundEnabled",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#febc2e]"></div>
                  </label>
                </div>

                {/* Reminder Time */}
                <div className="space-y-4">
                  <div>
                    <h3
                      className={`text-base font-semibold font-['Montserrat'] ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Reminder Time
                    </h3>
                    <p
                      className={`text-sm font-['Montserrat'] ${
                        theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                      }`}
                    >
                      How many minutes before a task should you be reminded?
                    </p>
                  </div>
                  <select
                    value={notifications.reminderTime}
                    onChange={(e) =>
                      handleNotificationChange("reminderTime", e.target.value)
                    }
                    className={`w-full max-w-xs px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white"
                        : "bg-white border-[#d9d9d9] text-black"
                    }`}
                  >
                    <option value="5">5 minutes before</option>
                    <option value="10">10 minutes before</option>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#febc2e] rounded-3xl text-white text-base font-bold font-['Montserrat'] hover:bg-[#e5a627] transition-colors duration-200">
              Save Notification Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
