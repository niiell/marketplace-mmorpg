"use client";

import { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
  isItemOpen: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType>({
  openItems: [],
  toggleItem: () => {},
  isItemOpen: () => false,
});

interface AccordionProps {
  children: React.ReactNode;
  defaultOpen?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  children,
  defaultOpen = [],
  allowMultiple = false,
  className = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const isItemOpen = (id: string) => openItems.includes(id);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, isItemOpen }}>
      <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({
  id,
  title,
  children,
  icon,
  disabled = false,
  className = "",
}: AccordionItemProps) {
  const { toggleItem, isItemOpen } = useContext(AccordionContext);
  const isOpen = isItemOpen(id);

  return (
    <div className={`${className}`}>
      <button
        onClick={() => !disabled && toggleItem(id)}
        className={`
          flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors
          ${
            disabled
              ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
              : "text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
          }
        `}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={`accordion-${id}`}
      >
        <span className="flex items-center space-x-3">
          {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
          <span>{title}</span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`shrink-0 text-gray-400 dark:text-gray-500 ${
            disabled ? "opacity-50" : ""
          }`}
        >
          <ChevronDownIcon className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-2 text-sm text-gray-600 dark:text-gray-300">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper components for common use cases
export function AccordionGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function AccordionDivider() {
  return <div className="h-px bg-gray-200 dark:bg-gray-700" />;
}