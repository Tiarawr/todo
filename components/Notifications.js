"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock data for notifications - Replace with your actual data fetching logic
const mockNotifications = [
  {
    id: 1,
    type: "success",
    title: "Account Verified!",
    message:
      "Your account has been successfully verified. You can now access all features.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Task Assigned",
    message: "Project 'Phoenix' has a new task: 'Design new dashboard'.",
    timestamp: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Password Expiring Soon",
    message:
      "Your password will expire in 3 days. Please update it for security.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "error",
    title: "Payment Failed",
    message: "We couldn't process the payment for your subscription.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Welcome to Todoriko!",
    message: "We're glad to have you on board. Let's get things done!",
    timestamp: "3 days ago",
    read: true,
  },
];

// Icon component to render different SVG icons based on notification type
const NotificationIcon = ({ type }) => {
  const iconStyles = "w-6 h-6";
  switch (type) {
    case "success":
      return (
        <svg
          className={`${iconStyles} text-green-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "warning":
      return (
        <svg
          className={`${iconStyles} text-yellow-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    case "error":
      return (
        <svg
          className={`${iconStyles} text-red-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "info":
    default:
      return (
        <svg
          className={`${iconStyles} text-blue-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  useEffect(() => {
    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;

    // Listen for theme changes from other components
    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
      document.documentElement.className = event.detail.theme;
    };
    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#16151a] text-gray-200"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-full transition-colors ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-6 h-6"
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
            <h1 className="text-2xl sm:text-3xl font-bold font-['Montserrat']">
              Notifications
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-semibold text-[#f67011] hover:underline mt-2 sm:mt-0"
            >
              Mark all as read
            </button>
          )}
        </header>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  theme === "dark"
                    ? "border-gray-700 bg-[#1e1e1e] hover:bg-[#2a2a2a]"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                } ${
                  !notification.read
                    ? theme === "dark"
                      ? "border-l-4 border-l-[#f67011]"
                      : "border-l-4 border-l-[#f67011]"
                    : ""
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold font-['Montserrat']">
                    {notification.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {notification.timestamp}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                      title="Unread"
                    ></div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className={`text-center py-16 px-6 rounded-xl ${
                theme === "dark" ? "bg-[#1e1e1e]" : "bg-white"
              }`}
            >
              <img
                src="/no-notifications.svg"
                alt="No notifications"
                className="w-40 h-40 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold font-['Montserrat']">
                All Caught Up!
              </h3>
              <p
                className={`mt-2 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You have no new notifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
