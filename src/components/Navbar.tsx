"use client";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Marketplace MMORPG SEA
      </Link>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <DarkModeToggle />
      </div>
    </nav>
  );
}
