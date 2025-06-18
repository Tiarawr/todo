"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function HeroSection() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); // Pindahkan ke atas, di dalam component

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
  }, []); // Remove router dependency karena tidak digunakan di useEffect

  // Fungsi untuk handle login click
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
      className={`min-h-screen flex items-center justify-center px-4 pt-16 transition-colors duration-300 relative overflow-hidden ${
        theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-spin"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-cyan-400/25 to-blue-500/25 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-teal-400/15 to-cyan-500/15 rounded-full blur-xl animate-ping"></div>
        <div className="absolute top-1/4 left-1/2 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
      </div>

      <div className="text-center max-w-4xl relative -mt-8 z-10">
        <div className="space-y-6 md:space-y-0 md:relative md:w-[663px] md:h-[220px] md:mx-auto">
          <h1
            className={`font-['Montserrat'] font-bold transition-colors duration-300 text-2xl sm:text-3xl md:text-[40px] md:absolute md:w-[418px] md:left-[135px] md:top-0 md:text-center ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Stay Organized. Get Things Done.
          </h1>

          <p
            className={`font-['Montserrat'] font-normal transition-colors duration-300 text-sm sm:text-base md:absolute md:w-[663px] md:h-[26px] md:left-0 md:top-[113px] ${
              theme === "dark" ? "text-white/80" : "text-black"
            }`}
          >
            A simple yet powerful to-do app to help you manage tasks and boost
            productivity
          </p>

          <div className="pt-4 md:pt-0">
            <button
              onClick={handleLoginClick} // Gunakan function yang sudah didefinisikan
              className="bg-[#f4721e] hover:bg-[#e6651a] hover:scale-105 transition-all duration-300 w-full sm:w-auto px-6 py-3 rounded-[17px] md:absolute md:w-[159px] md:h-12 md:px-[21px] md:py-[9px] md:left-[240px] md:top-[172px] inline-flex justify-center items-center"
            >
              <span className="text-white text-base font-semibold font-montserrat">
                GET STARTED
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
