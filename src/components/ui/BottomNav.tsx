"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PillarIcon } from "@/components/ui/PillarIcon";
import type { PillarIconName } from "@/lib/pillarDisplay";

// Ícones da nav (redesenho 2026-09-02, pedido do utilizador: "quase uma app
// nova", nav só com texto sem nenhum apoio visual). "Learn" e "Speak" reúsam
// os ícones já existentes de Reading/Speaking (PillarIcon.tsx) — mesmo
// espírito visual, sem desenhar dois ícones a mais para o mesmo significado.
// "Home"/"Practice"/"Progress" são novos, mas simples o suficiente para caber
// aqui em vez de crescer PillarIcon.tsx com nomes que não são pilares.
interface NavItem {
  href: string;
  label: string;
  icon?: PillarIconName;
}

function NavIcon({ item, className }: { item: NavItem; className?: string }) {
  if (item.icon) return <PillarIcon name={item.icon} className={className} />;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {item.href === "/home" && (
        <>
          <path d="M4 11l8-7 8 7" />
          <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
        </>
      )}
      {item.href === "/practice" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
        </>
      )}
      {item.href === "/progress" && (
        <>
          <line x1="4" y1="20" x2="4" y2="14" />
          <line x1="10" y1="20" x2="10" y2="9" />
          <line x1="16" y1="20" x2="16" y2="4" />
        </>
      )}
    </svg>
  );
}

const ITEMS: NavItem[] = [
  { href: "/home", label: "Home" },
  { href: "/learn", label: "Learn", icon: "reading" },
  { href: "/practice", label: "Practice" },
  { href: "/speak", label: "Speak", icon: "speaking" },
  { href: "/progress", label: "Progress" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-ink/10 bg-linen/95 backdrop-blur dark:border-linen/10 dark:bg-inkNeutral/95">
      <ul className="mx-auto flex max-w-md justify-between px-4 py-2">
        {ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-control px-3 py-1.5 text-xs font-medium ${
                  active ? "text-verdigris" : "text-inkNeutral/60 dark:text-linen/60"
                }`}
              >
                <NavIcon item={item} className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
