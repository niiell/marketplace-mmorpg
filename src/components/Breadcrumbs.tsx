"use client";

import Link from "next/link";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export default function Breadcrumbs({
  items,
  className = "",
  showHome = true,
}: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: "Home", href: "/", icon: <HomeIcon className="h-4 w-4" /> }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
            )}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`group flex items-center space-x-2 text-sm font-medium ${
                    index === allItems.length - 1
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {item.icon && (
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0"
                    >
                      {item.icon}
                    </motion.span>
                  )}
                  <motion.span
                    className="truncate"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Animated underline */}
                  {index !== allItems.length - 1 && (
                    <motion.div
                      className="absolute -bottom-px left-0 h-0.5 w-full bg-gray-200 dark:bg-gray-700"
                      initial={false}
                      transition={{ duration: 0.2 }}
                      style={{
                        originX: 0,
                        scaleX: 0,
                      }}
                      whileHover={{
                        scaleX: 1,
                      }}
                    />
                  )}
                </Link>
              ) : (
                <span className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>

      {/* Mobile Breadcrumb */}
      <div className="sm:hidden">
        <button
          type="button"
          className="flex items-center space-x-2 text-sm font-medium text-gray-900 dark:text-white"
          onClick={() => window.history.back()}
        >
          <ChevronRightIcon
            className="h-4 w-4 rotate-180 transform text-gray-400"
            aria-hidden="true"
          />
          <span>Back</span>
        </button>
      </div>
    </nav>
  );
}
