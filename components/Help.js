"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function HelpSettings() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Task categories for sidebar consistency
  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: false },
    { name: "Freelance", color: "#FEBC2E", isDefault: false },
    { name: "Work", color: "#28C840", isDefault: false },
  ]);

  // Modal state - Using this to toggle the category modal visibility
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Add useEffect to handle modal display if needed
  useEffect(() => {
    if (showAddCategoryModal) {
      // Modal open logic could go here
      console.log("Category modal opened");
    }
  }, [showAddCategoryModal]);

  // FAQ state
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How do I create a new task?",
      answer:
        "To create a new task, click the '+' button on the dashboard. Fill in the task details including title, description, category, and deadline. Then click 'Save Task' to add it to your list.",
    },
    {
      id: 2,
      question: "How do I set up notifications?",
      answer:
        "Go to Settings > Notifications to configure your notification preferences. You can enable/disable task reminders, deadline alerts, email notifications, and set reminder timing.",
    },
    {
      id: 3,
      question: "Can I change the app theme?",
      answer:
        "Yes! You can toggle between light and dark mode using the theme switch in the top navigation bar. Your preference will be saved automatically.",
    },
    {
      id: 4,
      question: "How do I edit my profile?",
      answer:
        "Navigate to Settings > Profile to update your personal information, upload a profile photo, and manage your account details.",
    },
    {
      id: 5,
      question: "What are task categories?",
      answer:
        "Task categories help you organize your tasks by type (Personal, Work, Freelance, etc.). You can create custom categories and assign different colors to them for easy identification.",
    },
    {
      id: 6,
      question: "How do I delete a task?",
      answer:
        "To delete a task, click on the task card and look for the delete button (trash icon). Confirm the deletion when prompted. Deleted tasks cannot be recovered.",
    },
    {
      id: 7,
      question: "Can I schedule tasks for the future?",
      answer:
        "Yes! When creating a task, you can set a specific date and time. Use the Schedule Tasks feature to view and manage your upcoming tasks.",
    },
    {
      id: 8,
      question: "How do timezone settings work?",
      answer:
        "Timezone settings ensure your notifications and reminders are sent at the correct local time. Make sure to select your correct region and timezone in the Profile settings.",
    },
  ];

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

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  // Loading state
  if (!mounted || theme === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1E1E1E]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f67011] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-['Montserrat']">
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
      {/* Responsive container with improved responsiveness */}
      <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 md:px-8 lg:px-24 xl:px-32">
        {/* Sidebar */}
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
          {/* Back Button for Mobile - Now part of the header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1
                className={`text-2xl md:text-3xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Help & Support
              </h1>
              <p
                className={`text-base font-normal font-['Montserrat'] transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Find answers to common questions and get support.
              </p>
            </div>
            <button
              onClick={() => handleNavigation("/dashboard/settings")}
              className="lg:hidden flex items-center space-x-2"
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
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button
              onClick={() => handleNavigation("/dashboard/settings")}
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() =>
                handleNavigation("/dashboard/settings/notification")
              }
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Notifications
            </button>
            <button className="px-4 py-2 md:px-6 md:py-3 bg-[#febc2e] rounded-[20px] text-white text-sm md:text-base font-semibold font-['Montserrat']">
              Help
            </button>
          </div>

          {/* FAQ Section - Responsive Padding */}
          <div
            className={`p-4 sm:p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="space-y-6">
              <div className="space-y-1">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {faqData.map((faq) => (
                  <div
                    key={faq.id}
                    className={`border rounded-lg transition-all duration-300 ${
                      theme === "dark"
                        ? "border-gray-700 bg-[#1E1E1E]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between"
                    >
                      <h3
                        className={`text-base font-semibold font-['Montserrat'] flex-1 pr-4 ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {faq.question}
                      </h3>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`flex-shrink-0 transform transition-transform duration-300 ${
                          openFAQ === faq.id ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke={theme === "dark" ? "#FEBC2E" : "#6f6a6a"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <p
                          className={`text-sm font-['Montserrat'] leading-relaxed ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support Section - Responsive Padding */}
          <div
            className={`p-4 sm:p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="space-y-6">
              <div className="space-y-1">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Need More Help?
                </h2>
                <p
                  className={`text-sm md:text-base font-normal font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Can't find what you're looking for? Contact our support team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-opacity-50 transition-colors duration-300">
                  <div className="w-10 h-10 bg-[#febc2e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3.33331 3.33334H16.6666C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6666 16.6667H3.33331C2.41665 16.6667 1.66665 15.9167 1.66665 15V5.00001C1.66665 4.08334 2.41665 3.33334 3.33331 3.33334Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.3333 5L9.99998 10.8333L1.66665 5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-base font-semibold font-['Montserrat'] ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Email Support
                    </h3>
                    <p
                      className={`text-sm font-['Montserrat'] ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      support@todoriko.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start pt-2">
                <button className="w-full sm:w-auto px-6 py-3 bg-[#f67011] rounded-lg text-white text-base font-bold font-['Montserrat'] hover:bg-[#e5600b] transition-colors duration-200">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
