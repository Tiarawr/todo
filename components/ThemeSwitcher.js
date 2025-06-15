// components/ThemeSwitcher.js
"use client";
import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Emit custom event untuk notify komponen lain
    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { theme: newTheme },
      })
    );
  };

  // Don't render until mounted (prevent hydration issues)
  if (!mounted) {
    return <div className="w-[59px] h-[26px]"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      <div className="relative">
        {/* Toggle Background */}
        <div
          className={`
          w-[59px] h-[26px] rounded-[13px] transition-all duration-500 ease-in-out
          ${
            theme === "dark"
              ? "bg-transparent border-2 border-white"
              : "bg-transparent border-2 border-black"
          }
        `}
        >
          {/* Toggle Circle */}
          <div
            className={`
            absolute top-1/2 w-[19px] h-[19px] rounded-full transition-all duration-500 ease-in-out transform -translate-y-1/2
            ${
              theme === "dark"
                ? "translate-x-[36px] bg-white shadow-lg"
                : "translate-x-[4px] bg-[#4D6080] shadow-md"
            }
          `}
          ></div>
        </div>
      </div>
    </button>
  );
}
