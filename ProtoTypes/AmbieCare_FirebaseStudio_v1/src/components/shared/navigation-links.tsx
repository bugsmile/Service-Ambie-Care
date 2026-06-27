
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationLinksProps {
  links: NavLink[];
  className?: string;
}

/**
 * [UI-002 / UI-003] Active-route nav links
 * Client Component
 */
export function NavigationLinks({ links, className }: NavigationLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col space-y-1', className)}>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.icon}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
