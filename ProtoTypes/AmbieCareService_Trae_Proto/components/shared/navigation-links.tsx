/**
 * components/shared/navigation-links.tsx
 * Active-route Navigation Links (Client Component)
 * - Accepts an array of navigation links.
 * - Highlights the active link based on the current pathname.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming cn utility for Tailwind class merging

interface NavigationLink {
  label: string;
  href: string;
}

interface NavigationLinksProps {
  links: NavigationLink[];
  className?: string;
}

export function NavigationLinks({ links, className }: NavigationLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
