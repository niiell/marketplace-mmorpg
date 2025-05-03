"use client";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!mounted) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Marketplace MMORPG SEA
      </Link>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <button
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          className="px-2 py-1 border rounded text-sm"
          aria-label="Toggle dark mode"
        >
          {currentTheme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}
