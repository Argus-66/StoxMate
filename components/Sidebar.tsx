"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Portfolio", href: "/dashboard" },
  { name: "Watchlist", href: "/dashboard/watchlist" },
  { name: "News", href: "/dashboard/news" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">StoxMate</h1>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-3 py-2 rounded transition-colors
              ${pathname === item.href
                ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white font-bold"
                : "hover:bg-gray-700 hover:text-white text-gray-300"}
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
