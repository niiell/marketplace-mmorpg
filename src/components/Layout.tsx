"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
      data-testid="layout-container"
    >
      <Navbar />
      <main
        className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
        data-testid="main-content"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}