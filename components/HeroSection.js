"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
    };

    window.addEventListener("themeChange", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
  };

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f4721e] mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Montserrat']">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 relative overflow-hidden ${
        theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      {/* Animated Background Blobs - Responsive */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-2xl sm:blur-3xl animate-spin"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-24 sm:w-32 lg:w-48 h-24 sm:h-32 lg:h-48 bg-gradient-to-r from-cyan-400/25 to-blue-500/25 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/4 sm:left-1/3 w-28 sm:w-40 lg:w-56 h-28 sm:h-40 lg:h-56 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 rounded-full blur-xl sm:blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-r from-teal-400/15 to-cyan-500/15 rounded-full blur-lg sm:blur-xl animate-ping"></div>
        <div className="absolute top-1/4 left-1/2 w-20 sm:w-28 lg:w-40 h-20 sm:h-28 lg:h-40 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-lg sm:blur-xl animate-pulse"></div>
      </div>

      {/* Main Content - Fully Responsive */}
      <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl relative z-10">
        <div className="text-center space-y-6 lg:space-y-8">
          {/* Main Heading - Mobile First */}
          <div className="space-y-4">
            <h1
              className={`font-['Montserrat'] font-bold transition-colors duration-300 leading-tight ${
                theme === "dark" ? "text-white" : "text-black"
              } text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px]`}
            >
              <span className="block">Welcome to</span>
              <span className="block text-[#f4721e] mb-2">Todoriko</span>
              <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[32px] font-medium">Stay Organized. Get Things Done.</span>
            </h1>

            {/* Subtitle - Responsive */}
            <p
              className={`font-['Montserrat'] font-normal transition-colors duration-300 max-w-3xl mx-auto leading-relaxed ${
                theme === "dark" ? "text-white/80" : "text-black/80"
              } text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-0`}
            >
              Todoriko is the best todo list app to help you manage tasks, boost productivity, and organize your daily life. Simple, powerful, and free.
            </p>
          </div>

          {/* CTA Button - Mobile First */}
          <div className="pt-4 sm:pt-6 lg:pt-8">
            <button
              onClick={handleLoginClick}
              className="bg-[#f4721e] hover:bg-[#e6651a] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-2xl sm:rounded-[20px] group"
            >
              <span className="text-white text-base sm:text-lg lg:text-xl font-semibold font-['Montserrat'] group-hover:tracking-wider transition-all duration-300">
                GET STARTED
              </span>
            </button>
          </div>

          {/* Optional: Features Preview - Hidden on mobile, visible on larger screens */}
          <div className="hidden lg:block pt-12">
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-white/10" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-[#f4721e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3
                  className={`font-['Montserrat'] font-semibold text-sm ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Organize Tasks
                </h3>
              </div>

              <div className="text-center space-y-3">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-white/10" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-[#f4721e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3
                  className={`font-['Montserrat'] font-semibold text-sm ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Track Progress
                </h3>
              </div>

              <div className="text-center space-y-3">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-white/10" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-[#f4721e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3
                  className={`font-['Montserrat'] font-semibold text-sm ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Stay Productive
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
