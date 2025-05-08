"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" data-testid="layout-container">
      <Navbar />
      <main className="flex-grow" data-testid="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}