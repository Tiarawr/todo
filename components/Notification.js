"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar"; // Import Sidebar component

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
        <Sidebar
          theme={theme}
          onThemeChange={(newTheme) => {
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
          }}
          onNavigation={handleNavigation}
          taskCategories={taskCategories}
          setTaskCategories={setTaskCategories}
        />

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
