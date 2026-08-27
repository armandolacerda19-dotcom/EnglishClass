"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/home", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/speak", label: "Speak" },
  { href: "/progress", label: "Progress" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-ink/10 bg-linen/95 backdrop-blur dark:border-linen/10 dark:bg-ink/95">
      <ul className="mx-auto flex max-w-md justify-between px-4 py-2">
        {ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-control px-3 py-1.5 text-xs font-medium ${
                  active ? "text-verdigris" : "text-inkNeutral/60 dark:text-linen/60"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
