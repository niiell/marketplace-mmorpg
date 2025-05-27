"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "/flags/en.svg" },
  { code: "id", name: "Bahasa Indonesia", flag: "/flags/id.svg" },
  { code: "th", name: "ไทย", flag: "/flags/th.svg" },
  { code: "ph", name: "Filipino", flag: "/flags/ph.svg" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  useEffect(() => {
    // Initialize language from localStorage or browser preference
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang) {
      const lang = languages.find((l) => l.code === savedLang);
      if (lang) setSelectedLang(lang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      const lang = languages.find((l) => l.code === browserLang);
      if (lang) {
        setSelectedLang(lang);
        localStorage.setItem("preferred-language", lang.code);
      }
    }
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLang(language);
    localStorage.setItem("preferred-language", language.code);
    setIsOpen(false);

    // Refresh the page with new language
    router.refresh();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors duration-200
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative w-5 h-5 rounded-full overflow-hidden">
          <Image
            src={selectedLang.flag}
            alt={selectedLang.name}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {selectedLang.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <motion.div
              className="absolute mt-2 right-0 z-50 min-w-[200px] py-2 
                bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700
                rounded-lg shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  onHoverStart={() => setHoveredLang(lang.code)}
                  onHoverEnd={() => setHoveredLang(null)}
                  className={`
                    relative w-full flex items-center space-x-3 px-4 py-2
                    text-left text-sm
                    ${
                      selectedLang.code === lang.code
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                    transition-colors duration-200
                  `}
                >
                  <div className="relative w-5 h-5 rounded-full overflow-hidden">
                    <Image
                      src={lang.flag}
                      alt={lang.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span
                    className={`font-medium ${
                      selectedLang.code === lang.code
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {lang.name}
                  </span>

                  {/* Selected indicator */}
                  {selectedLang.code === lang.code && (
                    <motion.div
                      className="absolute right-4 text-blue-600 dark:text-blue-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}

                  {/* Hover effect */}
                  {hoveredLang === lang.code && selectedLang.code !== lang.code && (
                    <motion.div
                      className="absolute inset-0 bg-current opacity-5"
                      layoutId="hoverEffect"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}

              {/* Language hint */}
              <div className="mt-2 px-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Changes will take effect immediately
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}