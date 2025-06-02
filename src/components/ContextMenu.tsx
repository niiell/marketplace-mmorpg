"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  items: MenuItem[];
  children: ReactNode;
  className?: string;
}

export default function ContextMenu({
  items,
  children,
  className = "",
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside<HTMLDivElement>(menuRef, (e) => {
    if (!triggerRef.current?.contains(e.target as Node)) {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
      setIsOpen(true);
    }
  };

  const handleLongPress = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({ x: rect.width / 2, y: rect.height / 2 });
      setIsOpen(true);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < items.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (selectedIndex >= 0) {
            const item = items[selectedIndex];
            if (!item.disabled) {
              item.onClick();
              setIsOpen(false);
              setSelectedIndex(-1);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, items, selectedIndex]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Handle long press for touch devices
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const trigger = triggerRef.current;

    const handleTouchStart = () => {
      timer = setTimeout(handleLongPress, 500);
    };

    const handleTouchEnd = () => {
      clearTimeout(timer);
    };

    if (trigger) {
      trigger.addEventListener("touchstart", handleTouchStart);
      trigger.addEventListener("touchend", handleTouchEnd);

      return () => {
        trigger.removeEventListener("touchstart", handleTouchStart);
        trigger.removeEventListener("touchend", handleTouchEnd);
        clearTimeout(timer);
      };
    }
  }, [handleLongPress]);

  return (
    <div
      ref={triggerRef}
      className={`inline-block ${className}`}
      onContextMenu={handleContextMenu}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
            }}
            className="z-50 min-w-[12rem] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="context-menu-button"
          >
            <div className="py-1" role="none">
              {items.map((item, index) => (
                <div key={item.id}>
                  {item.divider && (
                    <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  )}
                  <button
                    className={`
                      group relative flex w-full items-center px-4 py-2 text-sm
                      ${
                        item.disabled
                          ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                          : item.danger
                          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50"
                      }
                      ${selectedIndex === index ? "bg-gray-100 dark:bg-gray-700/50" : ""}
                    `}
                    role="menuitem"
                    onClick={() => {
                      if (!item.disabled) {
                        item.onClick();
                        setIsOpen(false);
                      }
                    }}
                    disabled={item.disabled}
                    tabIndex={selectedIndex === index ? 0 : -1}
                    aria-disabled={item.disabled}
                  >
                    {item.icon && (
                      <span className="mr-3 h-5 w-5" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}