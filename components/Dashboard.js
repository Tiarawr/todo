"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  // 1. ALL STATES (definisikan semua state di atas)
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFilterModal, setShowAddFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false); // Tambah state ini
  const router = useRouter();

  // 2. INITIAL DATA
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: false },
    { name: "Freelance", color: "#FEBC2E", isDefault: false },
    { name: "Work", color: "#28C840", isDefault: false },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 0,
      title: "Old Task - Will be deleted",
      description:
        "This task is over 2 years overdue and will be automatically deleted.",
      time: "10:00 AM",
      date: "Monday, 10 January 2022",
      sortDate: "2022-01-10",
      completed: false,
      category: "personal",
    },
    {
      id: 1,
      title: "Apply Job",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a pharetra diam. Nunc fringilla magna in finibus molestie.",
      time: "09:30 AM",
      date: "Sunday, 15 December 2024",
      sortDate: "2024-12-15",
      completed: false,
      category: "WORK",
    },
    {
      id: 2,
      title: "Client Project",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a pharetra diam. Nunc fringilla magna in finibus molestie.",
      time: "02:15 PM",
      date: "Sunday, 16 June 2025",
      sortDate: "2025-06-16",
      completed: false,
      category: "Freelance",
    },
    {
      id: 3,
      title: "Meeting with Team",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a pharetra diam. Nunc fringilla magna in finibus molestie.",
      time: "11:45 AM",
      date: "Monday, 17 June 2025",
      sortDate: "2025-06-17",
      completed: false,
      category: "work",
    },
    {
      id: 4,
      title: "Personal Shopping",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a pharetra diam. Nunc fringilla magna in finibus molestie.",
      time: "04:20 PM",
      date: "Wednesday, 18 June 2025",
      sortDate: "2025-06-18",
      completed: true,
      category: "Personal",
    },
    {
      id: 5,
      title: "Website Development",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a pharetra diam. Nunc fringilla magna in finibus molestie.",
      time: "08:00 AM",
      date: "Sunday, 29 June 2025",
      sortDate: "2025-06-29",
      completed: true,
      category: "FREELANCE",
    },
  ]);

  const filters = ["Upcoming", "This Week", "Today", "Completed", "Overdue"];

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

  // 3. USE EFFECTS
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar && !event.target.closest(".relative")) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // 4. ALL FUNCTIONS (definisikan semua function sebelum digunakan)
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

  const getTaskCategoryColor = (taskCategory) => {
    if (!taskCategory) return "#FEBC2E";

    const category = taskCategories.find(
      (cat) => cat.name.toLowerCase() === taskCategory.toLowerCase()
    );
    return category ? category.color : "#FEBC2E";
  };

  const addPredefinedFilter = (name, color) => {
    const existingCategory = taskCategories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      alert(`Category "${existingCategory.name}" already exists!`);
      return;
    }

    const newCategory = {
      name: name,
      color: color,
      isDefault: false,
    };

    setTaskCategories((prev) => [...prev, newCategory]);
    setShowAddFilterModal(false);
  };

  const addCustomFilter = () => {
    const trimmedName = newFilterName.trim();

    if (!trimmedName) {
      alert("Category name cannot be empty!");
      return;
    }

    const existingCategory = taskCategories.find(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingCategory) {
      alert(`Category "${existingCategory.name}" already exists!`);
      setNewFilterName(""); // clear input
      return;
    }

    const newCategory = {
      name: trimmedName, // Keep original case
      color: getAvailableColor(),
      isDefault: false,
    };

    setTaskCategories((prev) => [...prev, newCategory]);
    setNewFilterName("");
    setShowCustomInput(false);
    setShowAddFilterModal(false);
  };

  const removeFilter = (filterName) => {
    setTaskCategories((prev) =>
      prev.filter((cat) => cat.name.toLowerCase() !== filterName.toLowerCase())
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addCustomFilter(); // Ganti dari addNewFilter ke addCustomFilter
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) => {
      if (prev.includes(filter)) {
        // Remove filter if already selected
        return prev.filter((f) => f !== filter);
      } else {
        // Add filter if not selected
        return [...prev, filter];
      }
    });
  };

  const getDateRanges = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // 1 year ago from today
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const oneYearAgoStr = oneYearAgo.toISOString().split("T")[0];

    // 2 years ago from today
    const twoYearsAgo = new Date(today);
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    const twoYearsAgoStr = twoYearsAgo.toISOString().split("T")[0];

    // Get start and end of current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    const startOfWeekStr = startOfWeek.toISOString().split("T")[0];
    const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

    return {
      todayStr,
      oneYearAgoStr,
      twoYearsAgoStr,
      startOfWeekStr,
      endOfWeekStr,
    };
  };

  const filterTasksBySearch = (tasks) => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase().trim(); // trim spaces
    return tasks.filter(
      (task) =>
        (task.title && task.title.toLowerCase().includes(query)) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.time && task.time.toLowerCase().includes(query)) ||
        (task.date && task.date.toLowerCase().includes(query)) ||
        (task.category && task.category.toLowerCase().includes(query)) // tambah category search
    );
  };

  const filterTasksByDate = (tasks) => {
    if (!selectedDate) return tasks;

    return tasks.filter((task) => task.sortDate === selectedDate);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push(date);
    }

    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const taskMatchesFilters = (task) => {
    // Cek apakah kategori task masih ada di taskCategories (case-insensitive)
    if (!task.category) return false; // jika task tidak punya category

    const categoryExists = taskCategories.find(
      (cat) => cat.name.toLowerCase() === task.category.toLowerCase()
    );

    if (!categoryExists) {
      return false; // Jangan tampilkan task jika kategorinya sudah dihapus
    }

    // Apply search filter first (sudah case-insensitive)
    const searchFiltered = filterTasksBySearch([task]);
    if (searchFiltered.length === 0) return false;

    // Apply date filter if selected
    const dateFiltered = filterTasksByDate([task]);
    if (selectedDate && dateFiltered.length === 0) return false;

    // If no filters selected, show all tasks within 1 year
    if (activeFilters.length === 0) {
      const { todayStr, oneYearAgoStr } = getDateRanges();
      return task.sortDate >= oneYearAgoStr;
    }

    const { todayStr, startOfWeekStr, endOfWeekStr } = getDateRanges();
    const taskDate = task.sortDate;

    return activeFilters.some((filter) => {
      switch (filter) {
        case "Today":
          return taskDate === todayStr;

        case "This Week":
          return taskDate >= startOfWeekStr && taskDate <= endOfWeekStr;

        case "Upcoming":
          return taskDate > endOfWeekStr; // After this week

        case "Completed":
          return task.completed === true;

        case "Overdue":
          return taskDate < todayStr && !task.completed;

        default:
          return false;
      }
    });
  };

  const getAutoDeleteTasks = () => {
    const { todayStr, twoYearsAgoStr } = getDateRanges();
    return tasks.filter(
      (task) => task.sortDate < twoYearsAgoStr && !task.completed
    );
  };

  const getTaskBg = (completed) => {
    if (completed) {
      return "bg-[#fff4ed]"; // completed tasks - light orange background
    }
    return "bg-white"; // pending tasks - white background
  };

  const getTaskTextColor = (completed) => {
    return "text-black"; // all tasks use black text
  };

  const getTaskBorderColor = (completed) => {
    if (completed) {
      return "border-[#e5e7eb]"; // completed tasks - light gray border
    }
    return "border-black border-2"; // pending tasks - thick black border
  };

  const handleTaskAction = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleToggleComplete = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTask.id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleEditTask = () => {
    setEditingTask({ ...selectedTask });
    setShowTaskModal(false);
  };

  const handleDeleteTask = () => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== selectedTask.id)
    );
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleSaveEdit = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === editingTask.id ? editingTask : task))
    );
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // 5. COMPUTE FILTERED DATA
  const filteredTasks = tasks.filter(taskMatchesFilters);
  const autoDeleteTasks = getAutoDeleteTasks();

  const groupedTasks = filteredTasks
    .sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate))
    .reduce((acc, task) => {
      const date = task.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {});

  // 6. LOADING STATE
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

  // 7. RETURN JSX
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
          <div className="h-px bg-white opacity-20"></div>

          {/* Menu Items */}
          <nav className="space-y-6">
            {/* Today Task */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                      fill="#FEBC2E"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Today Task
                </h3>
              </div>

              {/* Task Categories */}
              <div className="space-y-3 ml-13">
                {taskCategories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between group"
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
                    {/* Remove button - now shows for ALL categories */}
                    <button
                      onClick={() => removeFilter(category.name)}
                      className="opacity-0 group-hover:opacity-100 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-200 hover:bg-red-600"
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
                  </div>
                ))}

                {/* Add filter button */}
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                    onClick={() => setShowAddFilterModal(true)}
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
                    onClick={() => setShowAddFilterModal(true)}
                  >
                    Add filter
                  </span>
                </div>

                {/* Show message when no categories */}
                {taskCategories.length === 0 && (
                  <div className="text-center py-4">
                    <p
                      className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No categories yet. Add your first one!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Tasks */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.04 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                    fill="#D9D9D9"
                  />
                </svg>
              </div>
              <span
                className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Schedule Tasks
              </span>
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                    fill="#D9D9D9"
                  />
                </svg>
              </div>
              <span
                className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Settings
              </span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <div
              className={`flex items-center space-x-4 p-3 rounded-2xl border transition-colors duration-300 ${
                theme === "dark" ? "border-[#4d6080]" : "border-gray-300"
              }`}
            >
              <div className="flex-1 flex items-center space-x-4">
                {/* Search Icon */}
                <svg
                  className="w-6 h-6 text-[#FEBC2E]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent text-2xl font-light font-['Montserrat'] outline-none transition-colors duration-300 ${
                    theme === "dark"
                      ? "text-white placeholder-gray-400"
                      : "text-black placeholder-gray-500"
                  }`}
                />
              </div>
              <div className="flex items-center space-x-2">
                {/* Calendar Button */}
                <button
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <svg
                    className="w-6 h-6 text-[#FEBC2E]"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Calendar Dropdown */}
            {showCalendar && (
              <div
                className={`absolute right-0 top-full mt-2 p-4 rounded-lg shadow-lg z-50 ${
                  theme === "dark"
                    ? "bg-[#2D2D2D] text-white"
                    : "bg-white text-black"
                }`}
                style={{ width: "280px" }}
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold font-['Montserrat']">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-xs text-[#FEBC2E] hover:text-[#E5A627] font-['Montserrat']"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-xs text-center py-2 font-semibold text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (date) {
                          const dateStr = formatDate(date);
                          setSelectedDate(dateStr);
                          setShowCalendar(false);
                        }
                      }}
                      disabled={!date}
                      className={`
              text-xs py-2 rounded transition-colors duration-200
              ${!date ? "invisible" : ""}
              ${
                date && formatDate(date) === selectedDate
                  ? "bg-[#FEBC2E] text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }
              ${
                date && formatDate(date) === formatDate(new Date())
                  ? "font-bold border border-[#FEBC2E]"
                  : ""
              }
            `}
                    >
                      {date ? date.getDate() : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Search & Date Filters Display */}
          {(searchQuery || selectedDate) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Active filters:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium font-['Montserrat'] rounded-full flex items-center space-x-1">
                  <span>Search: "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedDate && (
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium font-['Montserrat'] rounded-full flex items-center space-x-1">
                  <span>
                    Date: {new Date(selectedDate).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="ml-1 hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-5 py-3 rounded-[20px] text-base font-semibold font-['Montserrat'] transition-all duration-300 ${
                  activeFilters.includes(filter)
                    ? "bg-[#febc2e] text-white"
                    : "bg-[#d9d9d9] text-[#6f6a6a]"
                }`}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={() => setActiveFilters([])}
              className={`px-5 py-3 rounded-[20px] text-base font-semibold font-['Montserrat'] transition-all duration-300 ${
                activeFilters.length === 0
                  ? "bg-[#febc2e] text-white"
                  : "bg-[#d9d9d9] text-[#6f6a6a]"
              }`}
            >
              All Tasks
            </button>
          </div>

          {/* Auto-delete Warning */}
          {autoDeleteTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 font-['Montserrat']">
                    Auto-Delete Notice
                  </h3>
                  <p className="text-sm text-red-700 font-['Montserrat'] mt-1">
                    {autoDeleteTasks.length} overdue task
                    {autoDeleteTasks.length > 1 ? "s" : ""} older than 2 years
                    will be automatically deleted to keep your workspace clean.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Active filters:
              </span>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="px-3 py-1 bg-[#febc2e] text-white text-xs font-medium font-['Montserrat'] rounded-full"
                >
                  {filter}
                </span>
              ))}
            </div>
          )}

          {/* Show All Info */}
          {activeFilters.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-800 font-['Montserrat']">
                    Showing All Tasks
                  </h3>
                  <p className="text-sm text-blue-700 font-['Montserrat'] mt-1">
                    Displaying all tasks from the past year. Tasks older than 2
                    years are automatically archived for better performance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tasks */}
          <div className="space-y-12">
            {Object.entries(groupedTasks).length === 0 ? (
              <div className="text-center py-12">
                <p
                  className={`text-lg font-medium font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No tasks found for selected filters
                </p>
              </div>
            ) : (
              Object.entries(groupedTasks).map(([date, dateTasks]) => (
                <div key={date} className="space-y-8">
                  {/* Date Header */}
                  <h2
                    className={`text-xl font-light font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {date}
                  </h2>

                  {/* Tasks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dateTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-8 rounded-[37px] transition-all duration-300 hover:shadow-lg ${getTaskBg(
                          task.completed
                        )} ${getTaskBorderColor(task.completed)}`}
                      >
                        {/* Task Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            {/* Dynamic color based on task category */}
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{
                                backgroundColor: getTaskCategoryColor(
                                  task.category
                                ),
                              }}
                            ></div>
                            <div className="flex flex-col">
                              <h3
                                className={`text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${getTaskTextColor(
                                  task.completed
                                )}`}
                              >
                                {task.title}
                              </h3>
                              {/* Show category name */}
                              <span
                                className={`text-xs font-medium font-['Montserrat'] opacity-60 ${getTaskTextColor(
                                  task.completed
                                )}`}
                              >
                                {task.category}
                              </span>
                            </div>
                          </div>
                          <button
                            className="w-7 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200"
                            onClick={() => handleTaskAction(task)}
                          >
                            <svg
                              width="5"
                              height="21"
                              viewBox="0 0 5 21"
                              fill="none"
                            >
                              <path
                                d="M2.5 20.1667C1.83542 20.1667 1.26649 19.93 0.793229 19.4568C0.319965 18.9835 0.083333 18.4146 0.083333 17.75C0.083333 17.0854 0.319965 16.5165 0.793229 16.0432C1.26649 15.57 1.83542 15.3333 2.5 15.3333C3.16458 15.3333 3.73351 15.57 4.20677 16.0432C4.68003 16.5165 4.91667 17.0854 4.91667 17.75C4.91667 18.4146 4.68003 18.9835 4.20677 19.4568C3.73351 19.93 3.16458 20.1667 2.5 20.1667ZM2.5 12.9167C1.83542 12.9167 1.26649 12.68 0.793229 12.2068C0.319965 11.7335 0.083333 11.1646 0.083333 10.5C0.083333 9.83542 0.319965 9.26649 0.793229 8.79323C1.26649 8.31997 1.83542 8.08333 2.5 8.08333C3.16458 8.08333 3.73351 8.31997 4.20677 8.79323C4.68003 9.26649 4.91667 9.83542 4.91667 10.5C4.91667 11.1646 4.68003 11.7335 4.20677 12.2068C3.73351 12.68 3.16458 12.9167 2.5 12.9167ZM2.5 5.66667C1.83542 5.66667 1.26649 5.43004 0.793229 4.95677C0.319965 4.48351 0.083333 3.91458 0.083333 3.25C0.083333 2.58542 0.319965 2.01649 0.793229 1.54323C1.26649 1.06997 1.83542 0.833333 2.5 0.833333C3.16458 0.833333 3.73351 1.06997 4.20677 1.54323C4.68003 2.01649 4.91667 2.58542 4.91667 3.25C4.91667 3.91458 4.68003 4.48351 4.20677 4.95677C3.73351 5.43004 3.16458 5.66667 2.5 5.66667Z"
                                fill="#F4721E"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Task Time */}
                        <div className="mb-4">
                          <span
                            className={`text-lg font-medium font-['Montserrat'] transition-colors duration-300 ${getTaskTextColor(
                              task.completed
                            )}`}
                          >
                            {task.time}
                          </span>
                        </div>

                        {/* Task Description */}
                        <p
                          className={`text-sm font-normal font-['Montserrat'] mb-8 leading-relaxed transition-colors duration-300 ${getTaskTextColor(
                            task.completed
                          )}`}
                        >
                          {task.description}
                        </p>

                        {/* Task Footer */}
                        <div className="flex justify-end">
                          {task.completed ? (
                            <div className="w-7 h-7 bg-[#F4721E] rounded flex items-center justify-center">
                              <svg
                                width="20"
                                height="15"
                                viewBox="0 0 20 15"
                                fill="none"
                              >
                                <path
                                  d="M7.1417 15L0.491699 8.34999L2.1542 6.68749L7.1417 11.675L17.8459 0.970825L19.5084 2.63333L7.1417 15Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-7 h-7 bg-[#F4721E] rounded"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Add Filter Modal - Dropdown Style */}
      {showAddFilterModal && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowAddFilterModal(false)}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg p-4 w-80 ${
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
              {/* Predefined Categories */}
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

      {/* Custom Input Modal */}
      {showCustomInput && (
        <div
          className="fixed inset-0 z-60"
          onClick={() => setShowCustomInput(false)}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg p-4 w-80 ${
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
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
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
                  setNewFilterName("");
                }}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 font-['Montserrat'] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addCustomFilter}
                disabled={!newFilterName.trim()}
                className="px-3 py-1 text-xs bg-[#FEBC2E] text-white rounded font-['Montserrat'] hover:bg-[#E5A627] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Actions Modal */}
      {showTaskModal && selectedTask && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowTaskModal(false)}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg p-4 w-64 ${
              theme === "dark"
                ? "bg-[#2D2D2D] text-white"
                : "bg-white text-black"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold font-['Montserrat'] mb-3">
              Task Actions
            </h3>
            <div className="space-y-2">
              {/* Complete/Uncomplete Button */}
              <button
                onClick={handleToggleComplete}
                className={`w-full flex items-center space-x-3 p-2 rounded transition-colors duration-200 ${
                  selectedTask.completed
                    ? "hover:bg-orange-50 dark:hover:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "hover:bg-green-50 dark:hover:bg-green-900 text-green-600 dark:text-green-400"
                }`}
              >
                {selectedTask.completed ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM6.5 12L2 7.5l1.41-1.41L6.5 9.17l6.59-6.59L14.5 4 6.5 12z"
                        fill="currentColor"
                      />
                      <line
                        x1="2"
                        y1="8"
                        x2="14"
                        y2="8"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="text-sm font-['Montserrat']">
                      Mark as Incomplete
                    </span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-sm font-['Montserrat']">
                      Mark as Complete
                    </span>
                  </>
                )}
              </button>

              {/* Edit Button */}
              <button
                onClick={handleEditTask}
                className="w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm font-['Montserrat']">Edit Task</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDeleteTask}
                className="w-full flex items-center space-x-3 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5.5 1a.5.5 0 000 1h5a.5.5 0 000-1h-5zM3 2.5a.5.5 0 01.5-.5h1.064l.085-.002.018-.007A3.001 3.001 0 017.5 1h1a3.001 3.001 0 012.833.991l.018.007.085.002H12.5a.5.5 0 010 1h-1v9a2 2 0 01-2 2h-3a2 2 0 01-2-2v-9h-1a.5.5 0 01-.5-.5z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm font-['Montserrat']">Delete Task</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className={`rounded-lg shadow-lg p-6 w-96 max-w-md mx-4 ${
              theme === "dark"
                ? "bg-[#2D2D2D] text-white"
                : "bg-white text-black"
            }`}
          >
            <h3 className="text-lg font-semibold font-['Montserrat'] mb-4">
              Edit Task
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-['Montserrat'] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className={`w-full p-2 border rounded font-['Montserrat'] outline-none focus:border-[#FEBC2E] transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-black placeholder-gray-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-['Montserrat'] mb-1">
                  Description
                </label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className={`w-full p-2 border rounded font-['Montserrat'] outline-none focus:border-[#FEBC2E] transition-colors duration-300 resize-none ${
                    theme === "dark"
                      ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-black placeholder-gray-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-['Montserrat'] mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={editingTask.time}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, time: e.target.value })
                  }
                  className={`w-full p-2 border rounded font-['Montserrat'] outline-none focus:border-[#FEBC2E] transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-black placeholder-gray-500"
                  }`}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-['Montserrat'] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#FEBC2E] text-white rounded-lg font-['Montserrat'] hover:bg-[#E5A627] transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
