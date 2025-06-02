"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  onChange?: (tabId: string) => void;
  className?: string;
}

export default function TabNavigation({
  tabs,
  onChange,
  className = "",
}: TabNavigationProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Find active tab based on current pathname
  const currentTab = tabs.find(tab => 
    pathname?.includes(tab.id.toLowerCase())
  );

  useEffect(() => {
    if (currentTab) {
      setActiveTab(currentTab.id);
      updateIndicator(currentTab.id);
    }
  }, [currentTab]);

  const updateIndicator = (tabId: string) => {
    const tabElement = tabRefs.current.get(tabId);
    if (tabElement) {
      const { width, left } = tabElement.getBoundingClientRect();
      const parentLeft = tabElement.parentElement?.getBoundingClientRect().left || 0;
      setIndicatorStyle({
        width,
        left: left - parentLeft,
      });
    }
  };

  // Update indicator on window resize
  useEffect(() => {
    const handleResize = () => {
      if (activeTab) {
        updateIndicator(activeTab);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) {
          const newTab = tabs[currentIndex - 1];
          setActiveTab(newTab.id);
          onChange?.(newTab.id);
          tabRefs.current.get(newTab.id)?.focus();
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < tabs.length - 1) {
          const newTab = tabs[currentIndex + 1];
          setActiveTab(newTab.id);
          onChange?.(newTab.id);
          tabRefs.current.get(newTab.id)?.focus();
        }
        break;
    }
  };

  return (
    <div
      className={`relative ${className}`}
    >
      <div
        className="hide-scrollbar flex space-x-1 overflow-x-auto"
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id);
              onChange?.(tab.id);
            }}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={`
              relative flex min-w-0 items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>
            {typeof tab.count !== "undefined" && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  inline-flex h-5 items-center justify-center rounded-full px-2 text-xs font-medium
                  ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }
                `}
              >
                {tab.count}
              </motion.span>
            )}
          </button>
        ))}
      </div>

      {/* Animated indicator */}
      <motion.div
        className="absolute bottom-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"
        initial={false}
        animate={{
          width: indicatorStyle.width,
          x: indicatorStyle.left,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />

      {/* Bottom border */}
      <div className="absolute bottom-0 h-px w-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}