"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialDark = root.classList.contains("dark");
    setIsDark(initialDark);
  }, []);

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={toggleDarkMode}
      className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
