"use client";
import { useEffect, useState } from "react";
import * as Toggle from '@radix-ui/react-toggle';
import { Home, List, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Marketplace", href: "/marketplace", icon: List },
  { name: "Profile", href: "/profile", icon: User },
];

export default function NavbarRadix() {
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
      <div className="flex items-center space-x-6">
        {navItems.map(({ name, href, icon: Icon }) => (
          <motion.a
            key={name}
            href={href}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={20} />
            <span>{name}</span>
          </motion.a>
        ))}
      </div>
      <Toggle.Root
        pressed={dark}
        onPressedChange={toggleDark}
        className="rounded-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <span title="Light Mode">🌞</span>
        ) : (
          <span title="Dark Mode">🌙</span>
        )}
      </Toggle.Root>
    </nav>
  );
}
