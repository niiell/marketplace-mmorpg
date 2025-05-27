"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  const moonPoints = [
    [12, 4],
    [20, 12],
    [12, 20],
    [4, 12],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative w-12 h-12 rounded-full
        flex items-center justify-center
        focus:outline-none
        ${
          isDark
            ? "text-blue-100 bg-gray-800 hover:bg-gray-700"
            : "text-yellow-500 bg-gray-100 hover:bg-gray-200"
        }
        transition-colors duration-200
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-6 h-6">
        <AnimatedIcon isDark={isDark} />
      </div>
    </motion.button>
  );
}

function AnimatedIcon({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={isDark ? "dark" : "light"}
      className="absolute inset-0"
    >
      {/* Sun */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 w-full h-full"
        variants={{
          dark: {
            scale: 0,
            opacity: 0,
            transition: { duration: 0.2 },
          },
          light: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.2, delay: 0.2 },
          },
        }}
      >
        <circle cx="12" cy="12" r="5" className="fill-current" />
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="12"
            y1="1"
            x2="12"
            y2="3"
            className="stroke-current"
            style={{
              transformOrigin: "center",
              transform: `rotate(${i * 45}deg)`,
            }}
            variants={{
              dark: { scale: 0 },
              light: { scale: 1 },
            }}
          />
        ))}
      </motion.svg>

      {/* Moon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 w-full h-full text-blue-100"
        variants={{
          dark: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.2, delay: 0.2 },
          },
          light: {
            scale: 0,
            opacity: 0,
            transition: { duration: 0.2 },
          },
        }}
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          className="fill-current stroke-current"
        />

        {/* Stars */}
        {[...Array(3)].map((_, i) => (
          <motion.circle
            key={i}
            cx={6 + i * 6}
            cy={6}
            r="1"
            className="fill-current"
            variants={{
              dark: {
                opacity: [0, 1, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                },
              },
              light: { opacity: 0 },
            }}
          />
        ))}
      </motion.svg>
    </motion.div>
  );
}