"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  const paths =
    items ||
    pathname
      ?.split("/")
      .filter(Boolean)
      .map((path, index, array) => ({
        href: `/${array.slice(0, index + 1).join("/")}`,
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        current: index === array.length - 1,
      })) ||
    [];

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center space-x-2 text-sm sm:text-base">
        <motion.li
          initial="hidden"
          animate="visible"
          variants={variants}
          custom={0}
          className="flex items-center"
        >
          <Link
            href="/"
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 
              dark:hover:text-blue-400 flex items-center transition-colors duration-200"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="sr-only">Home</span>
          </Link>
        </motion.li>

        {paths.map((item, index) => (
          <motion.li
            key={item.href}
            initial="hidden"
            animate="visible"
            variants={variants}
            custom={index + 1}
            className="flex items-center"
          >
            <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-600" />
            <Link
              href={item.href}
              className={`ml-2 ${
                item.current
                  ? "font-medium text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              } transition-colors duration-200`}
              aria-current={item.current ? "page" : undefined}
            >
              <span className="truncate max-w-[150px] sm:max-w-none">{item.label}</span>
            </Link>
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}
