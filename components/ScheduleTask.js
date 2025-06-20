"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { auth, db } from "@/lib/Firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ScheduleTask() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [showAddFilterModal, setShowAddFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatarURL: null,
  });

  // Di bagian atas component, tambahkan flag
  const USE_FIREBASE = false; // Set false untuk testing

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

  // Update state untuk categories
  const [taskCategories, setTaskCategories] = useState([
    {
      id: "default-personal",
      name: "Personal",
      color: "#FF5F57",
      isDefault: true,
    },
    {
      id: "default-freelance",
      name: "Freelance",
      color: "#FEBC2E",
      isDefault: true,
    },
    { id: "default-work", name: "Work", color: "#28C840", isDefault: true },
  ]);

  // Authentication listener
  useEffect(() => {
    if (!USE_FIREBASE) {
      // LOCAL STORAGE MODE - Load profile from localStorage
      try {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setUserProfile(profileData);
          console.log("Loaded profile in ScheduleTask:", profileData);
        } else {
          // Set default profile if none exists
          const defaultProfile = {
            firstName: "Todoriko",
            lastName: "",
            email: "user@todoapp.com",
            avatarURL: null,
          };
          setUserProfile(defaultProfile);
          localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
        }
      } catch (error) {
        console.error("Error loading profile in ScheduleTask:", error);
        const fallbackProfile = {
          firstName: "Todoriko",
          lastName: "",
          email: "user@todoapp.com",
          avatarURL: null,
        };
        setUserProfile(fallbackProfile);
      }

      // Skip Firebase, langsung set dummy user
      setCurrentUser({ uid: "test", email: "test@test.com" });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadUserCategories(user.uid);
      } else {
        setCurrentUser(null);
        setLoading(false);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Load user categories from Firestore
  const loadUserCategories = async (userId) => {
    try {
      setLoading(true);

      const categoriesQuery = query(
        collection(db, "categories"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const categoriesSnapshot = await getDocs(categoriesQuery);
      const userCategories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (userCategories.length > 0) {
        setTaskCategories(userCategories);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading categories:", error);
      showToast("Error loading categories", "error");
      setLoading(false);
    }
  };

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
  // Updated to delete from localStorage or Firestore
  const removeFilter = async (categoryName) => {
    const categoryToRemove = taskCategories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!categoryToRemove) {
      showToast("Category not found!", "error");
      return;
    }

    if (categoryToRemove.isDefault) {
      showToast("Cannot remove default categories!", "error");
      return;
    }

    if (!USE_FIREBASE) {
      // LOCAL STORAGE MODE
      try {
        setTaskCategories((prev) =>
          prev.filter((cat) => cat.id !== categoryToRemove.id)
        );

        if (selectedCategory && selectedCategory.id === categoryToRemove.id) {
          setSelectedCategory(null);
          setCategoryInput("");
        }

        showToast(
          `Category "${categoryName}" removed successfully!`,
          "success"
        );
      } catch (error) {
        console.error("Error removing category:", error);
        showToast("Error removing category", "error");
      }
      return;
    }

    // FIREBASE MODE
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, "categories", categoryToRemove.id));

      setTaskCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToRemove.id)
      );

      if (selectedCategory && selectedCategory.id === categoryToRemove.id) {
        setSelectedCategory(null);
        setCategoryInput("");
      }

      showToast(`Category "${categoryName}" removed successfully!`, "success");
    } catch (error) {
      console.error("Error removing category:", error);
      showToast("Error removing category", "error");
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

    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    // Listen for profile changes from other components
    const handleProfileChange = (event) => {
      if (event.detail && event.detail.profile) {
        setUserProfile(event.detail.profile);
        console.log(
          "Profile updated from event in ScheduleTask:",
          event.detail.profile
        );
      }
    };

    window.addEventListener("themeChange", handleThemeChange);
    window.addEventListener("profileChange", handleProfileChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
      window.removeEventListener("profileChange", handleProfileChange);
    };
  }, []);

  // Updated functions to save to Firestore
  const addPredefinedCategory = async (name, color) => {
    if (!currentUser) return;

    const existingCategory = taskCategories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      showToast(`Category "${existingCategory.name}" already exists!`);
      return;
    }

    try {
      const newCategory = {
        name: name,
        color: color,
        isDefault: false,
        userId: currentUser.uid,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "categories"), newCategory);

      setTaskCategories((prev) => [...prev, { id: docRef.id, ...newCategory }]);
      setShowAddFilterModal(false);
      showToast(`Category "${name}" added successfully!`, "success");
    } catch (error) {
      console.error("Error adding category:", error);
      showToast("Error adding category", "error");
    }
  };

  const addCustomCategory = async () => {
    if (!currentUser) return;

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

    try {
      const newCategory = {
        name: trimmedName,
        color: getAvailableColor(),
        isDefault: false,
        userId: currentUser.uid,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "categories"), newCategory);

      setTaskCategories((prev) => [...prev, { id: docRef.id, ...newCategory }]);
      setNewCategoryName("");
      setShowCustomInput(false);
      setShowAddFilterModal(false);
      showToast(`Category "${trimmedName}" created successfully!`, "success");
    } catch (error) {
      console.error("Error creating category:", error);
      showToast("Error creating category", "error");
    }
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

  // Calendar functions - keep existing
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

  // Updated to save task to Firestore
  const handleSaveTask = async () => {
    console.log("Save task clicked");

    if (!USE_FIREBASE) {
      // Local storage save untuk testing
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
      } // Save to localStorage with user-specific key
      const newTask = {
        id: Date.now(),
        title: taskInput.trim(),
        description: taskDescription.trim(),
        category: selectedCategory.name,
        date: formatDisplayDate(selectedDate),
        sortDate: selectedDate,
        time: selectedTime,
        completed: false,
      };

      // Use user email to create user-specific task storage
      const userEmail = localStorage.getItem("userEmail") || "default";
      const taskKey = `tasks_${userEmail}`;
      const existingTasks = JSON.parse(localStorage.getItem(taskKey) || "[]");
      localStorage.setItem(
        taskKey,
        JSON.stringify([...existingTasks, newTask])
      );

      showToast("Task saved successfully!", "success");

      setTimeout(() => {
        // Clear form
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

      return;
    }

    // Firebase save code here...
  };

  // Tambahkan useEffect untuk handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar && !event.target.closest(".calendar-container")) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  if (!mounted || loading) {
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

  if (!currentUser) {
    return null;
  }

  // Keep all existing JSX structure
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      {" "}
      <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 md:px-8 lg:px-24 xl:px-32">
        {/* Sidebar */}
        {/* Sidebar */}{" "}
        <Sidebar
          theme={theme}
          onThemeChange={(newTheme) => {
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
          }}
          onNavigation={handleNavigation}
          taskCategories={taskCategories}
          setTaskCategories={setTaskCategories}
          showAddFilterModal={showAddFilterModal}
          setShowAddFilterModal={setShowAddFilterModal}
          newFilterName={newFilterName}
          setNewFilterName={setNewFilterName}
          addCustomFilter={addCustomFilter}
          addPredefinedFilter={addPredefinedFilter}
          removeFilter={removeFilter}
          showCustomInput={showCustomInput}
          userProfile={userProfile}
        ></Sidebar>
        {/* Main Content */}
        <main className="flex-1 space-y-6 sm:space-y-8 pt-2 sm:pt-4 lg:pt-8">
          <div className="w-full max-w-3xl mx-auto">
            <h1
              className={`text-xl sm:text-2xl lg:text-3xl font-bold font-['Montserrat'] mb-4 sm:mb-6 lg:mb-8 transition-colors duration-300 text-center lg:text-left ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Schedule New Task
            </h1>{" "}
            {/* Task Form */}
            <div
              className={`p-4 sm:p-6 lg:p-8 rounded-xl border transition-colors duration-300 ${
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
                  </label>{" "}
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Type your next task....."
                    className={`w-full p-3 sm:p-4 text-base font-light font-['Montserrat'] rounded-lg border outline-none transition-colors duration-300 ${
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

                    {/* Calendar Modal - Lengkap dengan content */}
                    {showCalendar && (
                      <div
                        className={`calendar-container absolute top-full left-0 mt-1 z-50 rounded-lg shadow-xl p-3 w-72 sm:w-80 border-2 ${
                          theme === "dark"
                            ? "bg-[#1E1E1E] border-gray-500"
                            : "bg-white border-gray-400"
                        }`}
                      >
                        {/* Header Navigation */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => navigateMonth("prev")}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setCalendarView("months")}
                              className={`text-sm font-semibold hover:text-[#FEBC2E] transition-colors ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              {getMonthName(currentMonth)}
                            </button>
                            <button
                              onClick={() => setCalendarView("years")}
                              className={`text-sm font-semibold hover:text-[#FEBC2E] transition-colors ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              {currentYear}
                            </button>
                          </div>

                          <button
                            onClick={() => navigateMonth("next")}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Calendar Views */}
                        {calendarView === "days" && (
                          <>
                            {/* Days of Week Header */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                                (day) => (
                                  <div
                                    key={day}
                                    className={`text-xs text-center py-2 font-semibold ${
                                      theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {day}
                                  </div>
                                )
                              )}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1">
                              {generateCalendarDays().map((date, index) => {
                                if (!date) {
                                  return (
                                    <div key={index} className="p-2"></div>
                                  );
                                }

                                const dateStr = formatDate(date);
                                const isSelected = selectedDate === dateStr;
                                const isToday =
                                  dateStr === formatDate(new Date());
                                const isPast =
                                  date < new Date().setHours(0, 0, 0, 0);

                                return (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      setSelectedDate(dateStr);
                                      setShowCalendar(false);
                                    }}
                                    className={`p-2 text-xs rounded hover:bg-[#FEBC2E] hover:text-white transition-colors ${
                                      isSelected
                                        ? "bg-[#FEBC2E] text-white font-semibold"
                                        : isToday
                                        ? "bg-blue-100 text-blue-600 font-semibold"
                                        : isPast
                                        ? "text-gray-400 cursor-not-allowed"
                                        : theme === "dark"
                                        ? "text-white hover:bg-[#FEBC2E]"
                                        : "text-black hover:bg-[#FEBC2E]"
                                    }`}
                                    disabled={isPast}
                                  >
                                    {date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}

                        {/* Month View */}
                        {calendarView === "months" && (
                          <div className="grid grid-cols-3 gap-2">
                            {generateMonths().map((month, index) => (
                              <button
                                key={month}
                                onClick={() => handleMonthSelect(index)}
                                className={`p-2 text-xs rounded hover:bg-[#FEBC2E] hover:text-white transition-colors ${
                                  index === currentMonth
                                    ? "bg-[#FEBC2E] text-white font-semibold"
                                    : theme === "dark"
                                    ? "text-white"
                                    : "text-black"
                                }`}
                              >
                                {month.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Year View */}
                        {calendarView === "years" && (
                          <div className="grid grid-cols-3 gap-2">
                            {generateYears().map((year) => (
                              <button
                                key={year}
                                onClick={() => handleYearSelect(year)}
                                className={`p-2 text-xs rounded hover:bg-[#FEBC2E] hover:text-white transition-colors ${
                                  year === currentYear
                                    ? "bg-[#FEBC2E] text-white font-semibold"
                                    : theme === "dark"
                                    ? "text-white"
                                    : "text-black"
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => {
                                setSelectedDate(formatDate(new Date()));
                                setShowCalendar(false);
                              }}
                              className="text-xs text-[#FEBC2E] hover:text-[#E5A627] font-medium transition-colors"
                            >
                              Today
                            </button>
                            {selectedDate && (
                              <button
                                onClick={() => {
                                  setSelectedDate(null);
                                  setShowCalendar(false);
                                }}
                                className={`text-xs font-medium transition-colors ${
                                  theme === "dark"
                                    ? "text-gray-400 hover:text-white"
                                    : "text-gray-500 hover:text-black"
                                }`}
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>
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
