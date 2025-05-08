"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-center p-4 text-sm text-gray-600 dark:text-gray-400">
      &copy; {currentYear} Marketplace MMORPG SEA. All rights reserved.
    </footer>
  );
}