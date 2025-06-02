"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumbs, { BreadcrumbItem } from "./Breadcrumbs";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Generate breadcrumb items based on pathname
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    if (!pathname) return [];
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      // Capitalize segment for label
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, href };
    });
    return items;
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header>
        <Navbar />
      </header>
      <nav aria-label="breadcrumb" className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 dark:bg-gray-900">
        <Breadcrumbs items={breadcrumbItems} />
      </nav>
      <main className="flex-grow" role="main">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
