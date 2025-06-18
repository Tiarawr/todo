"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScheduleTask() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmPm, setSelectedAmPm] = useState("AM");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const router = useRouter();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    console.log("showToast called:", message, type); // Debug log
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 3000);
  };

  // Task categories with colors - sync with localStorage or default
  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: true },
    { name: "Freelance", color: "#FEBC2E", isDefault: true },
    { name: "Work", color: "#28C840", isDefault: true },
  ]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("taskCategories", JSON.stringify(taskCategories));
    }
  }, [taskCategories, mounted]);

  // Update selectedTime when hour, minute, or AM/PM changes
  useEffect(() => {
    const timeString = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;
    setSelectedTime(timeString);
  }, [selectedHour, selectedMinute, selectedAmPm]);

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
  };

  const removeCategory = (categoryName) => {
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
    }
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

  // Tambahkan state untuk current month/year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarView, setCalendarView] = useState("days");

  // Update function generateCalendarDays
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

  // Function untuk navigate month
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

  // Get month name
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

  const handleSaveTask = () => {
    console.log("Save task clicked"); // Debug log

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

    // Reset form after delay
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
      <div className="w-full h-screen flex items-center justify-center bg-[#16151a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FEBC2E] mx-auto mb-4"></div>
          <p className="text-white font-['Montserrat']">Loading...</p>
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
        {/* Sidebar */}
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
          <div
            className={`h-px transition-colors duration-300 ${
              theme === "dark" ? "bg-white opacity-20" : "bg-gray-300"
            }`}
          ></div>

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

            {/* Schedule Tasks - Active */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.04 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                    fill="#FEBC2E"
                  />
                </svg>
              </div>
              <span
                className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Schedule Tasks
              </span>
            </div>
            {/* Settings - Clickable with proper hover */}
            <button
              onClick={() => handleNavigation("/dashboard/settings")}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
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
                Settings
              </span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8 pt-8">
          <div className="max-w-2xl mx-auto">
            <h1
              className={`text-3xl font-bold font-['Montserrat'] mb-8 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Schedule New Task
            </h1>

            {/* Task Input */}
            <div
              className={`p-6 rounded-2xl border transition-colors duration-300 ${
                theme === "dark"
                  ? "border-[#4d6080] bg-[#2D2D2D]"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div className="space-y-6">
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
                    className={`w-full p-3 text-lg font-light font-['Montserrat'] rounded-lg border outline-none transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-black placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Task Description - Optional */}
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
                      value={categoryInput} // Gunakan state terpisah untuk input
                      onChange={(e) => setCategoryInput(e.target.value)} // Bisa diketik bebas
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const value = e.target.value.trim();
                          if (value) {
                            // Check if category exists
                            const existingCategory = taskCategories.find(
                              (cat) =>
                                cat.name.toLowerCase() === value.toLowerCase()
                            );

                            if (existingCategory) {
                              setSelectedCategory(existingCategory);
                              setCategoryInput(existingCategory.name);
                            } else {
                              // Create new category
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

                    {/* Clear button */}
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

                  {/* Existing categories as suggestions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {taskCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryInput(category.name);
                        }}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full border-2 transition-all duration-200 ${
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
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span
                          className={`text-xs font-medium font-['Montserrat'] transition-colors duration-300 ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Helper text */}
                  <p
                    className={`text-xs mt-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Type a new category name and press Enter, or click existing
                    categories above
                  </p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
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
                      {selectedDate
                        ? formatDisplayDate(selectedDate)
                        : "Select Date"}
                    </button>
                    {/* Calendar Modal - Multi-view (Days/Months/Years) */}
                    {showCalendar && (
                      <div
                        className={`absolute top-full left-0 mt-1 z-50 rounded-lg shadow-xl p-3 w-80 border-2 ${
                          theme === "dark"
                            ? "bg-[#1E1E1E] border-gray-500"
                            : "bg-white border-gray-400"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                          {calendarView === "days" && (
                            <>
                              <button
                                onClick={() => navigateMonth("prev")}
                                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  theme === "dark"
                                    ? "text-gray-400 hover:text-white"
                                    : "text-gray-600 hover:text-black"
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
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setCalendarView("months")}
                                  className={`text-sm font-semibold font-['Montserrat'] hover:text-[#FEBC2E] transition-colors ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-black"
                                  }`}
                                >
                                  {getMonthName(currentMonth)}
                                </button>
                                <button
                                  onClick={() => setCalendarView("years")}
                                  className={`text-sm font-semibold font-['Montserrat'] hover:text-[#FEBC2E] transition-colors ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-black"
                                  }`}
                                >
                                  {currentYear}
                                </button>
                              </div>

                              <button
                                onClick={() => navigateMonth("next")}
                                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  theme === "dark"
                                    ? "text-gray-400 hover:text-white"
                                    : "text-gray-600 hover:text-black"
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
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </>
                          )}

                          {calendarView === "months" && (
                            <>
                              <button
                                onClick={() => setCalendarView("days")}
                                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  theme === "dark"
                                    ? "text-gray-400 hover:text-white"
                                    : "text-gray-600 hover:text-black"
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
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>

                              <h3
                                className={`text-sm font-semibold font-['Montserrat'] ${
                                  theme === "dark" ? "text-white" : "text-black"
                                }`}
                              >
                                Select Month - {currentYear}
                              </h3>

                              <button
                                onClick={() => setCalendarView("years")}
                                className={`text-sm font-medium underline hover:text-[#FEBC2E] transition-colors ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                Change Year
                              </button>
                            </>
                          )}

                          {calendarView === "years" && (
                            <>
                              <button
                                onClick={() => setCalendarView("months")}
                                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  theme === "dark"
                                    ? "text-gray-400 hover:text-white"
                                    : "text-gray-600 hover:text-black"
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
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>

                              <h3
                                className={`text-sm font-semibold font-['Montserrat'] ${
                                  theme === "dark" ? "text-white" : "text-black"
                                }`}
                              >
                                Select Year
                              </h3>

                              <div></div>
                            </>
                          )}

                          {/* Close button - always visible */}
                          <button
                            onClick={() => {
                              setShowCalendar(false);
                              setCalendarView("days");
                            }}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ml-2 ${
                              theme === "dark"
                                ? "text-gray-400 hover:text-white"
                                : "text-gray-600 hover:text-black"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Content based on view */}
                        {calendarView === "days" && (
                          <div className="grid grid-cols-7 gap-1">
                            {/* Days header */}
                            {[
                              "Sun",
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ].map((day) => (
                              <div
                                key={day}
                                className={`text-center text-xs font-medium p-2 ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {day}
                              </div>
                            ))}

                            {/* Calendar days */}
                            {generateCalendarDays().map((date, index) => {
                              const today = new Date();
                              const isToday =
                                date &&
                                date.getDate() === today.getDate() &&
                                date.getMonth() === today.getMonth() &&
                                date.getFullYear() === today.getFullYear();

                              return (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (date) {
                                      setSelectedDate(formatDate(date));
                                      setShowCalendar(false);
                                      setCalendarView("days");
                                    }
                                  }}
                                  className={`p-2 text-sm rounded transition-all duration-200 relative ${
                                    date
                                      ? `${
                                          theme === "dark"
                                            ? "text-white hover:bg-gray-700"
                                            : "text-gray-900 hover:bg-gray-100"
                                        } ${
                                          selectedDate ===
                                          (date ? formatDate(date) : "")
                                            ? "!bg-[#FEBC2E] !text-white shadow-lg"
                                            : ""
                                        } ${
                                          isToday
                                            ? "ring-2 ring-blue-500 ring-opacity-50"
                                            : ""
                                        }`
                                      : "text-transparent cursor-default"
                                  }`}
                                >
                                  {date ? date.getDate() : ""}
                                  {/* Today indicator */}
                                  {isToday && (
                                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {calendarView === "months" && (
                          <div className="grid grid-cols-3 gap-2">
                            {generateMonths().map((month, index) => (
                              <button
                                key={month}
                                onClick={() => handleMonthSelect(index)}
                                className={`p-3 text-sm rounded-lg transition-all duration-200 ${
                                  index === currentMonth
                                    ? "bg-[#FEBC2E] text-white shadow-lg"
                                    : theme === "dark"
                                    ? "text-white hover:bg-gray-700"
                                    : "text-gray-900 hover:bg-gray-100"
                                }`}
                              >
                                {month.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        )}

                        {calendarView === "years" && (
                          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                            {generateYears().map((year) => (
                              <button
                                key={year}
                                onClick={() => handleYearSelect(year)}
                                className={`p-2 text-sm rounded-lg transition-all duration-200 ${
                                  year === currentYear
                                    ? "bg-[#FEBC2E] text-white shadow-lg"
                                    : theme === "dark"
                                    ? "text-white hover:bg-gray-700"
                                    : "text-gray-900 hover:bg-gray-100"
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Quick navigation to today - only show in days view */}
                        {calendarView === "days" && (
                          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <button
                              onClick={() => {
                                const today = new Date();
                                setCurrentMonth(today.getMonth());
                                setCurrentYear(today.getFullYear());
                                setSelectedDate(formatDate(today));
                                setShowCalendar(false);
                                setCalendarView("days");
                              }}
                              className={`w-full text-xs py-2 px-3 rounded transition-colors duration-200 ${
                                theme === "dark"
                                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                                  : "text-gray-600 hover:text-black hover:bg-gray-100"
                              }`}
                            >
                              Today
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Time Selection with AM/PM */}
                  <div>
                    <label
                      className={`block text-sm font-medium font-['Montserrat'] mb-2 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      {/* Hour */}
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className={`flex-1 p-3 rounded-lg border transition-colors duration-300 ${
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
                        className={`flex items-center ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        :
                      </span>
                      {/* Minute */}
                      <select
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        className={`flex-1 p-3 rounded-lg border transition-colors duration-300 ${
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
                      {/* AM/PM */}
                      <select
                        value={selectedAmPm}
                        onChange={(e) => setSelectedAmPm(e.target.value)}
                        className={`p-3 rounded-lg border transition-colors duration-300 ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white"
                            : "bg-white border-gray-300 text-black"
                        }`}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {/* Display selected time */}
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
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className={`px-6 py-2 rounded-lg font-['Montserrat'] transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTask}
                    className="px-6 py-2 bg-[#FEBC2E] text-white rounded-lg font-['Montserrat'] hover:bg-[#E5A627] transition-colors duration-200"
                  >
                    Save Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Category Modal - Fixed positioning */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className={`rounded-lg shadow-lg p-4 w-80 max-w-sm mx-4 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border border-gray-600"
                : "bg-white border border-gray-300"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {!showCustomInput ? (
              // Quick Add Options
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className={`text-sm font-semibold font-['Montserrat'] ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Add New Category
                  </h3>
                  <button
                    onClick={() => setShowAddCategoryModal(false)}
                    className={`hover:text-gray-700 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500"
                    }`}
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  {/* Study Option */}
                  {!taskCategories.find(
                    (cat) => cat.name.toLowerCase() === "study"
                  ) && (
                    <button
                      onClick={() => addPredefinedCategory("Study", "#007AFF")}
                      className={`w-full flex items-center space-x-2 p-2 rounded-md border border-dashed transition-all duration-200 hover:border-solid hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                        theme === "dark" ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <div className="w-3 h-3 bg-[#007AFF] rounded-full"></div>
                      <span
                        className={`text-xs font-medium font-['Montserrat'] ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Study
                      </span>
                    </button>
                  )}

                  {/* Health Option */}
                  {!taskCategories.find(
                    (cat) => cat.name.toLowerCase() === "health"
                  ) && (
                    <button
                      onClick={() => addPredefinedCategory("Health", "#32D74B")}
                      className={`w-full flex items-center space-x-2 p-2 rounded-md border border-dashed transition-all duration-200 hover:border-solid hover:bg-green-50 dark:hover:bg-green-900/20 ${
                        theme === "dark" ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <div className="w-3 h-3 bg-[#32D74B] rounded-full"></div>
                      <span
                        className={`text-xs font-medium font-['Montserrat'] ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Health
                      </span>
                    </button>
                  )}

                  {/* Shopping Option */}
                  {!taskCategories.find(
                    (cat) => cat.name.toLowerCase() === "shopping"
                  ) && (
                    <button
                      onClick={() =>
                        addPredefinedCategory("Shopping", "#FF9500")
                      }
                      className={`w-full flex items-center space-x-2 p-2 rounded-md border border-dashed transition-all duration-200 hover:border-solid hover:bg-orange-50 dark:hover:bg-orange-900/20 ${
                        theme === "dark" ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <div className="w-3 h-3 bg-[#FF9500] rounded-full"></div>
                      <span
                        className={`text-xs font-medium font-['Montserrat'] ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Shopping
                      </span>
                    </button>
                  )}

                  {/* Custom Option */}
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className={`w-full flex items-center space-x-2 p-2 rounded-md border border-dashed transition-all duration-200 hover:border-solid hover:bg-purple-50 dark:hover:bg-purple-900/20 ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span
                      className={`text-xs font-medium font-['Montserrat'] ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Custom Category
                    </span>
                  </button>
                </div>
              </>
            ) : (
              // Custom Input Form
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className={`text-sm font-semibold font-['Montserrat'] ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Create Custom Category
                  </h3>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setShowAddCategoryModal(false);
                    }}
                    className={`hover:text-gray-700 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500"
                    }`}
                  >
                    ✕
                  </button>
                </div>
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
                    className={`px-3 py-1 text-xs hover:text-gray-800 font-['Montserrat'] transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600"
                    }`}
                  >
                    Back
                  </button>
                  <button
                    onClick={addCustomCategory}
                    disabled={!newCategoryName.trim()}
                    className="px-3 py-1 text-xs bg-[#FEBC2E] text-white rounded font-['Montserrat'] hover:bg-[#E5A627] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification - Better contrast untuk dark & light mode */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div
            className={`shadow-xl rounded-lg p-4 max-w-sm border-l-4 ${
              toast.type === "success"
                ? "bg-green-600 border-green-400 text-white shadow-green-500/30 dark:bg-green-700 dark:border-green-500 dark:text-green-100"
                : toast.type === "warning"
                ? "bg-yellow-600 border-yellow-400 text-white shadow-yellow-500/30 dark:bg-yellow-700 dark:border-yellow-500 dark:text-yellow-100"
                : toast.type === "info"
                ? "bg-blue-600 border-blue-400 text-white shadow-blue-500/30 dark:bg-blue-700 dark:border-blue-500 dark:text-blue-100"
                : "bg-red-600 border-red-400 text-white shadow-red-500/30 dark:bg-red-700 dark:border-red-500 dark:text-red-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <svg
                    className="w-5 h-5 text-white"
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
                    className="w-5 h-5 text-white"
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
                {toast.type === "info" && (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg
                    className="w-5 h-5 text-white"
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
              <span className="text-sm font-semibold font-['Montserrat'] flex-1 text-white">
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
