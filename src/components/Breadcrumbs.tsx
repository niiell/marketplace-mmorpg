"use client";

import Link from "next/link";

interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumb">
      <ol className="list-reset flex text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.current ? (
              <span className="text-gray-900 dark:text-gray-100 font-semibold" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
