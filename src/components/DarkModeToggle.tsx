"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialDark = root.classList.contains("dark");
    setIsDark(initialDark);
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
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