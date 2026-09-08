"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ProfileIcon, TransfersIcon } from "./Icons";

const items = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/transfers", label: "Transfers", icon: TransfersIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 border-t border-zinc-100 bg-white px-8 py-3" aria-label="Main">
      <ul className="grid grid-cols-3">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 text-xs font-medium ${
                  active ? "text-violet-600" : "text-zinc-400"
                }`}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
