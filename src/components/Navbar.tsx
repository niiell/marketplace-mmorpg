"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Sync with localStorage and html class
    const isDark = localStorage.getItem("theme") === "dark" ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="font-bold text-xl text-brand">Marketplace MMORPG</div>
      <button
        onClick={toggleDark}
        className="rounded-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <span title="Light Mode">🌞</span>
        ) : (
          <span title="Dark Mode">🌙</span>
        )}
      </button>
    </nav>
  );
}
