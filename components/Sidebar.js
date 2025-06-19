"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar({
  theme = "light",
  onThemeChange,
  onNavigation,
  taskCategories = [],
  setTaskCategories,
  removeFilter = () => {},
  setShowAddFilterModal = () => {},
  showAddFilterModal,
  newFilterName,
  setNewFilterName,
  addCustomFilter,
  addPredefinedFilter,
  showCustomInput,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isTodayTaskActive = pathname === "/dashboard";
  const isScheduleTaskActive = pathname === "/dashboard/schedule";
  const isSettingsActive = pathname === "/dashboard/settings";

  const handleNavigation = (path) => {
    if (onNavigation) {
      onNavigation(path);
    } else {
      router.push(path);
    }
  };

  return (
    <aside className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 space-y-6 mt-4 lg:mt-0">
      {/* Profile Section */}
      <div className="text-center lg:text-left">
        <div className="flex flex-col items-center lg:items-start">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4">
            <div className="w-full h-full bg-[#febc2e] rounded-full relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-b from-[#FDA894] to-[#F49074] rounded-full relative">
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#7C3605] rounded-full"></div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#7C3605] rounded-full"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-1.5 sm:w-4 sm:h-2 bg-[#7C3605] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <h2
            className={`text-lg sm:text-xl font-semibold font-['Montserrat'] mb-1 transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Todoriko
          </h2>
          <p className="text-[#febc2e] text-xs sm:text-sm font-normal font-['Montserrat']">
            Evan Puertorico
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className={`hidden xl:block h-px transition-colors duration-300 ${
          theme === "dark" ? "bg-white opacity-20" : "bg-gray-300"
        }`}
      ></div>

      {/* Navigation */}
      <nav className="space-y-4 sm:space-y-6">
        {/* Today Task */}
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                  fill={isTodayTaskActive ? "#FEBC2E" : "#D9D9D9"}
                  className="transition-colors duration-300"
                />
              </svg>
            </div>
            <h3
              className={`text-base sm:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                isTodayTaskActive
                  ? "text-[#FEBC2E]"
                  : theme === "dark"
                  ? "text-gray-400 group-hover:text-[#FEBC2E]"
                  : "text-gray-600 group-hover:text-[#FEBC2E]"
              }`}
            >
              Today Task
            </h3>
          </button>

          {/* Category List */}
          <div className="space-y-2 sm:space-y-3 ml-10 sm:ml-13 max-h-40 sm:max-h-none overflow-y-auto">
            {taskCategories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span
                    className={`text-xs sm:text-sm font-medium font-['Montserrat'] truncate ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFilter(category.name)}
                  className="opacity-0 group-hover:opacity-100 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-200 hover:bg-red-600 ml-2"
                  title={`Remove ${category.name} category`}
                >
                  <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1 1l6 6M1 7l6-6"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add Category */}
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              onClick={() => setShowAddFilterModal(true)}
            >
              <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 10 10"
                  fill="none"
                  className={`sm:w-2.5 sm:h-2.5 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
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
                className={`text-xs sm:text-sm font-medium font-['Montserrat'] hover:text-[#FEBC2E] ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Add category
              </span>
            </div>

            {taskCategories.length === 0 && (
              <p
                className={`text-center text-xs sm:text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No categories yet. Add your first one!
              </p>
            )}
          </div>
        </div>

        {/* Schedule Tasks */}
        <button
          onClick={() => handleNavigation("/dashboard/schedule")}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.04 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                fill={isScheduleTaskActive ? "#FEBC2E" : "#D9D9D9"}
                className="transition-colors duration-300"
              />
            </svg>
          </div>
          <span
            className={`text-base sm:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
              isScheduleTaskActive
                ? "text-[#FEBC2E]"
                : theme === "dark"
                ? "text-gray-400 group-hover:text-[#FEBC2E]"
                : "text-gray-600 group-hover:text-[#FEBC2E]"
            }`}
          >
            Schedule Tasks
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={() => handleNavigation("/dashboard/settings")}
          className="flex items-center space-x-3 group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                fill={isSettingsActive ? "#FEBC2E" : "#D9D9D9"}
                className="transition-colors duration-300"
              />
            </svg>
          </div>
          <span
            className={`text-base sm:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
              isSettingsActive
                ? "text-[#FEBC2E]"
                : theme === "dark"
                ? "text-gray-400 group-hover:text-[#FEBC2E]"
                : "text-gray-600 group-hover:text-[#FEBC2E]"
            }`}
          >
            Settings
          </span>
        </button>
      </nav>
    </aside>
  );
}
