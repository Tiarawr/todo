"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScheduleTask() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [showAddFilterModal, setShowAddFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState(""); // Added for consistency
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Available colors array (same as Dashboard)
  const availableColors = [
    "#FF5F57",
    "#FEBC2E",
    "#28C840",
    "#007AFF",
    "#FF9500",
    "#AF52DE",
    "#FF2D92",
    "#5856D6",
    "#32D74B",
    "#FF3B30",
    "#34C759",
    "#5AC8FA",
    "#FFCC00",
    "#FF9F0A",
    "#BF5AF2",
    "#FF6482",
    "#30D158",
    "#64D2FF",
    "#FFD60A",
    "#FF69B4",
    "#9370DB",
    "#20B2AA",
    "#FF7F50",
    "#6495ED",
    "#DC143C",
  ];

  // Tambahkan state untuk categories (sama seperti Dashboard)
  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: false },
    { name: "Freelance", color: "#FEBC2E", isDefault: false },
    { name: "Work", color: "#28C840", isDefault: false },
  ]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("taskCategories", JSON.stringify(taskCategories));
    }
  }, [taskCategories, mounted]);

  const getMonthName = (monthIndex) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthIndex];
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${weekday}, ${day} ${month} ${year}`;
  };

  const [taskInput, setTaskInput] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmPm, setSelectedAmPm] = useState("AM");
  const [categoryInput, setCategoryInput] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  // Get available color function (same as Dashboard)
  const getAvailableColor = () => {
    const usedColors = taskCategories.map((cat) => cat.color);
    const availableColorOptions = availableColors.filter(
      (color) => !usedColors.includes(color)
    );

    if (availableColorOptions.length === 0) {
      return availableColors[
        Math.floor(Math.random() * availableColors.length)
      ];
    }

    return availableColorOptions[
      Math.floor(Math.random() * availableColorOptions.length)
    ];
  };

  const showToast = (message, type = "error") => {
    console.log("showToast called:", message, type);
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 3000);
  };

  const removeFilter = (categoryName) => {
    const categoryToRemove = taskCategories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryToRemove && !categoryToRemove.isDefault) {
      setTaskCategories((prev) =>
        prev.filter(
          (cat) => cat.name.toLowerCase() !== categoryName.toLowerCase()
        )
      );

      if (
        selectedCategory &&
        selectedCategory.name.toLowerCase() === categoryName.toLowerCase()
      ) {
        setSelectedCategory(null);
      }

      showToast(`Category "${categoryName}" removed successfully!`, "success");
    } else {
      showToast("Cannot remove this category!", "error");
    }
  };

  // Update selectedTime when hour, minute, or AM/PM changes
  useEffect(() => {
    const timeString = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;
    setSelectedTime(timeString);
  }, [selectedHour, selectedMinute, selectedAmPm]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Load categories from localStorage if available
    const savedCategories = localStorage.getItem("taskCategories");
    if (savedCategories) {
      setTaskCategories(JSON.parse(savedCategories));
    }

    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  // Updated functions to match Dashboard exactly
  const addPredefinedCategory = (name, color) => {
    const existingCategory = taskCategories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      showToast(`Category "${existingCategory.name}" already exists!`);
      return;
    }

    const newCategory = {
      name: name,
      color: color,
      isDefault: false,
    };

    setTaskCategories((prev) => [...prev, newCategory]);
    setShowAddCategoryModal(false);
    showToast(`Category "${name}" added successfully!`, "success");
  };

  const addCustomCategory = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      showToast("Category name cannot be empty!");
      return;
    }

    const existingCategory = taskCategories.find(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingCategory) {
      showToast(`Category "${existingCategory.name}" already exists!`);
      setNewCategoryName("");
      return;
    }

    const newCategory = {
      name: trimmedName,
      color: getAvailableColor(),
      isDefault: false,
    };

    setTaskCategories((prev) => [...prev, newCategory]);
    setNewCategoryName("");
    setShowCustomInput(false);
    setShowAddCategoryModal(false);
    showToast(`Category "${trimmedName}" created successfully!`, "success");
  };

  // Legacy functions for backward compatibility
  const addCustomFilter = () => {
    addCustomCategory();
  };

  const addPredefinedFilter = (name, color) => {
    addPredefinedCategory(name, color);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addCustomCategory();
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  // Calendar functions
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarView, setCalendarView] = useState("days");

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push(date);
    }

    return days;
  };

  const generateMonths = () => {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  };

  const generateYears = () => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(monthIndex);
    setCalendarView("days");
  };

  const handleYearSelect = (year) => {
    setCurrentYear(year);
    setCalendarView("months");
  };

  const handleSaveTask = () => {
    console.log("Save task clicked");

    if (!taskInput.trim()) {
      showToast("Please enter a task title!", "error");
      return;
    }

    if (!selectedCategory) {
      showToast("Please select a category!", "error");
      return;
    }

    if (!selectedDate) {
      showToast("Please select a date!", "error");
      return;
    }

    if (!selectedTime) {
      showToast("Please select a time!", "error");
      return;
    }

    showToast("Task saved successfully!", "success");

    setTimeout(() => {
      setTaskInput("");
      setTaskDescription("");
      setSelectedCategory(null);
      setCategoryInput("");
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedHour("12");
      setSelectedMinute("00");
      setSelectedAmPm("AM");
      router.push("/dashboard");
    }, 1500);
  };

  if (!mounted || theme === null) {
    return (
      <div
        className={`w-full h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FEBC2E] mx-auto mb-4"></div>
          <p
            className={`font-['Montserrat'] ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Loading...
          </p>
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
      <div className="flex flex-col lg:flex-row px-2 sm:px-4 md:px-6 lg:px-24 gap-4 sm:gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8 mt-6 lg:mt-0">
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

          {/* Divider - Only show on desktop */}
          <div
            className={`hidden xl:block h-px transition-colors duration-300 ${
              theme === "dark" ? "bg-white opacity-20" : "bg-gray-300"
            }`}
          ></div>

          {/* Menu Navigation */}
          <nav className="space-y-4 sm:space-y-6">
            {/* Today Task */}
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-3 group w-full"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="sm:w-6 sm:h-6"
                  >
                    <path
                      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                      fill="#D9D9D9"
                      className="group-hover:fill-[#FEBC2E] transition-colors duration-300"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-base sm:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 group-hover:text-[#FEBC2E] ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Today Task
                </h3>
              </button>

              {/* Task Categories */}
              <div className="space-y-2 sm:space-y-3 ml-10 sm:ml-13 max-h-40 sm:max-h-none overflow-y-auto">
                {taskCategories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span
                        className={`text-xs sm:text-sm font-medium font-['Montserrat'] transition-colors duration-300 truncate ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFilter(category.name)}
                      className="opacity-0 group-hover:opacity-100 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-200 hover:bg-red-600 flex-shrink-0"
                      title={`Remove ${category.name} category`}
                    >
                      <svg
                        width="6"
                        height="6"
                        viewBox="0 0 8 8"
                        fill="none"
                        className="sm:w-2 sm:h-2"
                      >
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

                {/* Add category button - Updated to use setShowAddFilterModal for Dashboard compatibility */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center transition-colors duration-200 cursor-pointer flex-shrink-0"
                    onClick={() => setShowAddFilterModal(true)}
                  >
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
                    className={`text-xs sm:text-sm font-medium font-['Montserrat'] transition-colors duration-300 cursor-pointer hover:text-[#FEBC2E] ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                    onClick={() => setShowAddFilterModal(true)}
                  >
                    Add category
                  </span>
                </div>

                {/* Show message when no categories */}
                {taskCategories.length === 0 && (
                  <div className="text-center py-4">
                    <p
                      className={`text-xs sm:text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No categories yet. Add your first one!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Tasks - Active */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="sm:w-6 sm:h-6"
                >
                  <path
                    d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.04 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                    fill="#FEBC2E"
                  />
                </svg>
              </div>
              <span
                className={`text-base sm:text-xl font-semibold font-['Montserrat'] text-[#FEBC2E]`}
              >
                Schedule Tasks
              </span>
            </div>

            {/* Settings */}
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="sm:w-6 sm:h-6"
                >
                  <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                    fill="#D9D9D9"
                    className="group-hover:fill-[#FEBC2E] transition-colors duration-300"
                  />
                </svg>
              </div>
              <span
                className={`text-base sm:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 group-hover:text-[#FEBC2E] ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Settings
              </span>
            </button>
          </nav>
        </aside>

        {/* Main Content - Keep existing form content */}
        <main className="flex-1 space-y-8 pt-4 sm:pt-8">
          <div className="w-full max-w-2xl mx-auto">
            <h1
              className={`text-xl sm:text-2xl xl:text-3xl font-bold font-['Montserrat'] mb-4 sm:mb-6 xl:mb-8 transition-colors duration-300 text-center xl:text-left ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Schedule New Task
            </h1>

            {/* Task Form - Keep all existing form content unchanged */}
            <div
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-colors duration-300 ${
                theme === "dark"
                  ? "border-[#4d6080] bg-[#2D2D2D]"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div className="space-y-4 sm:space-y-6">
                {/* Task Title */}
                <div>
                  <label
                    className={`block text-sm font-medium font-['Montserrat'] mb-2 transition-colors duration-300 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Type your next task....."
                    className={`w-full p-3 text-base sm:text-lg font-light font-['Montserrat'] rounded-lg border outline-none transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-black placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Task Description */}
                <div>
                  <label
                    className={`block text-sm font-medium font-['Montserrat'] mb-2 transition-colors duration-300 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Description{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Add task description..."
                    rows={3}
                    className={`w-full p-3 text-sm font-light font-['Montserrat'] rounded-lg border outline-none resize-none transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-black placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label
                    className={`block text-sm font-medium font-['Montserrat'] mb-2 transition-colors duration-300 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Category <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const value = e.target.value.trim();
                          if (value) {
                            const existingCategory = taskCategories.find(
                              (cat) =>
                                cat.name.toLowerCase() === value.toLowerCase()
                            );

                            if (existingCategory) {
                              setSelectedCategory(existingCategory);
                              setCategoryInput(existingCategory.name);
                            } else {
                              const newCategory = {
                                name: value,
                                color: getAvailableColor(),
                                isDefault: false,
                              };
                              setTaskCategories((prev) => [
                                ...prev,
                                newCategory,
                              ]);
                              setSelectedCategory(newCategory);
                              setCategoryInput(newCategory.name);
                            }
                          }
                        }
                      }}
                      placeholder="Type or select category..."
                      className={`w-full p-3 text-sm font-light font-['Montserrat'] rounded-lg border outline-none transition-colors duration-300 ${
                        theme === "dark"
                          ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-black placeholder-gray-500"
                      }`}
                    />

                    {categoryInput && (
                      <button
                        onClick={() => {
                          setCategoryInput("");
                          setSelectedCategory(null);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category suggestions - Responsive grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {taskCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryInput(category.name);
                        }}
                        className={`flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 transition-all duration-200 text-left ${
                          selectedCategory?.name === category.name
                            ? "border-solid shadow-md scale-105"
                            : "border-dashed hover:border-solid opacity-70 hover:opacity-100"
                        }`}
                        style={{
                          borderColor: category.color,
                          backgroundColor:
                            selectedCategory?.name === category.name
                              ? `${category.color}20`
                              : "transparent",
                        }}
                      >
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span
                          className={`text-xs font-medium font-['Montserrat'] transition-colors duration-300 truncate ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p
                    className={`text-xs mt-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Type a new category name and press Enter, or click existing
                    categories above
                  </p>
                </div>

                {/* Date and Time - Keep all existing date/time selection code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Selection */}
                  <div className="relative">
                    <label
                      className={`block text-sm font-medium font-['Montserrat'] mb-2 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={() => setShowCalendar(!showCalendar)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors duration-300 ${
                        theme === "dark"
                          ? "bg-[#3D3D3D] border-gray-600 text-white"
                          : "bg-white border-gray-300 text-black"
                      }`}
                    >
                      <span className="truncate">
                        {selectedDate
                          ? formatDisplayDate(selectedDate)
                          : "Select Date"}
                      </span>
                    </button>

                    {/* Keep existing calendar modal */}
                    {showCalendar && (
                      <div
                        className={`absolute top-full left-0 mt-1 z-50 rounded-lg shadow-xl p-3 w-72 sm:w-80 border-2 ${
                          theme === "dark"
                            ? "bg-[#1E1E1E] border-gray-500"
                            : "bg-white border-gray-400"
                        }`}
                      >
                        {/* Keep all existing calendar content */}
                      </div>
                    )}
                  </div>

                  {/* Time Selection - Keep existing */}
                  <div>
                    <label
                      className={`block text-sm font-medium font-['Montserrat'] mb-2 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-1 sm:space-x-2">
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className={`flex-1 p-2 sm:p-3 rounded-lg border transition-colors duration-300 text-sm ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white"
                            : "bg-white border-gray-300 text-black"
                        }`}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <option
                              key={hour}
                              value={hour.toString().padStart(2, "0")}
                            >
                              {hour.toString().padStart(2, "0")}
                            </option>
                          )
                        )}
                      </select>
                      <span
                        className={`flex items-center text-sm ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        :
                      </span>
                      <select
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        className={`flex-1 p-2 sm:p-3 rounded-lg border transition-colors duration-300 text-sm ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white"
                            : "bg-white border-gray-300 text-black"
                        }`}
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map(
                          (minute) => (
                            <option
                              key={minute}
                              value={minute.toString().padStart(2, "0")}
                            >
                              {minute.toString().padStart(2, "0")}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        value={selectedAmPm}
                        onChange={(e) => setSelectedAmPm(e.target.value)}
                        className={`p-2 sm:p-3 rounded-lg border transition-colors duration-300 text-sm ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white"
                            : "bg-white border-gray-300 text-black"
                        }`}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {selectedTime && (
                      <div
                        className={`mt-1 text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Selected: {selectedTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    onClick={handleSaveTask}
                    className="px-4 sm:px-6 py-2 bg-[#FEBC2E] text-white rounded-lg font-['Montserrat'] hover:bg-[#E5A627] transition-colors duration-200"
                  >
                    Save Task
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className={`px-4 sm:px-6 py-2 rounded-lg font-['Montserrat'] transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Filter Modal - Exactly same as Dashboard */}
      {showAddFilterModal && (
        <div
          className="fixed inset-0 z-50 p-4"
          onClick={() => setShowAddFilterModal(false)}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg p-4 w-full max-w-sm ${
              theme === "dark"
                ? "bg-[#2D2D2D] text-white"
                : "bg-white text-black"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold font-['Montserrat'] mb-3">
              Add New Filter
            </h3>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium font-['Montserrat'] text-gray-500">
                  Choose Category:
                </label>

                {/* Work Option */}
                {!taskCategories.find(
                  (cat) => cat.name.toLowerCase() === "work"
                ) && (
                  <button
                    onClick={() => addPredefinedFilter("Work", "#28C840")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:bg-green-50 dark:hover:bg-green-900/20 ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div className="w-4 h-4 bg-[#28C840] rounded-full"></div>
                    <span className="text-sm font-medium font-['Montserrat']">
                      Work
                    </span>
                  </button>
                )}

                {/* Personal Option */}
                {!taskCategories.find(
                  (cat) => cat.name.toLowerCase() === "personal"
                ) && (
                  <button
                    onClick={() => addPredefinedFilter("Personal", "#FF5F57")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:bg-red-50 dark:hover:bg-red-900/20 ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div className="w-4 h-4 bg-[#FF5F57] rounded-full"></div>
                    <span className="text-sm font-medium font-['Montserrat']">
                      Personal
                    </span>
                  </button>
                )}

                {/* Freelance Option */}
                {!taskCategories.find(
                  (cat) => cat.name.toLowerCase() === "freelance"
                ) && (
                  <button
                    onClick={() => addPredefinedFilter("Freelance", "#FEBC2E")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:bg-yellow-50 dark:hover:bg-yellow-900/20 ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div className="w-4 h-4 bg-[#FEBC2E] rounded-full"></div>
                    <span className="text-sm font-medium font-['Montserrat']">
                      Freelance
                    </span>
                  </button>
                )}

                {/* Custom Option */}
                <button
                  onClick={() => setShowCustomInput(true)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:bg-purple-50 dark:hover:bg-purple-900/20 ${
                    theme === "dark" ? "border-gray-600" : "border-gray-300"
                  }`}
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span className="text-sm font-medium font-['Montserrat']">
                    Custom Category
                  </span>
                </button>
              </div>

              {/* Show message if all predefined categories exist */}
              {taskCategories.find(
                (cat) => cat.name.toLowerCase() === "work"
              ) &&
                taskCategories.find(
                  (cat) => cat.name.toLowerCase() === "personal"
                ) &&
                taskCategories.find(
                  (cat) => cat.name.toLowerCase() === "freelance"
                ) && (
                  <div
                    className={`text-center py-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs font-['Montserrat']">
                      All default categories added. Create a custom one!
                    </span>
                  </div>
                )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowAddFilterModal(false);
                  setShowCustomInput(false);
                  setNewFilterName("");
                }}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 font-['Montserrat'] transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Input Modal - Exactly same as Dashboard */}
      {showCustomInput && (
        <div
          className="fixed inset-0 z-60"
          onClick={() => setShowCustomInput(false)}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg p-4 w-full max-w-sm ${
              theme === "dark"
                ? "bg-[#2D2D2D] text-white"
                : "bg-white text-black"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold font-['Montserrat'] mb-3">
              Create Custom Category
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter category name..."
              className={`w-full p-2 text-sm border rounded font-['Montserrat'] outline-none focus:border-[#FEBC2E] transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-black placeholder-gray-500"
              }`}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setNewCategoryName("");
                }}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 font-['Montserrat'] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addCustomCategory}
                disabled={!newCategoryName.trim()}
                className="px-3 py-1 text-xs bg-[#FEBC2E] text-white rounded font-['Montserrat'] hover:bg-[#E5A627] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification - Exactly same as Dashboard */}
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
