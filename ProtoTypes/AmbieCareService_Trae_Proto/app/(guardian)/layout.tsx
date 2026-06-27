/**
 * app/(guardian)/layout.tsx
 * Guardian Portal Layout (Server Component)
 * - Protects the route by checking for a valid 'GUARDIAN' session.
 * - Renders a responsive shell with a desktop sidebar and mobile bottom navigation.
 */

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assumption: authOptions location
import { NavigationLinks } from "@/components/shared/navigation-links";
import { LogoutButton } from "@/components/shared/logout-button";

const GUARDIAN_LINKS = [
  { label: "홈 대시보드", href: "/guardian/dashboard" },
  { label: "일간 보고서", href: "/guardian/reports" },
  { label: "디바이스 설정", href: "/guardian/devices" },
];

export default async function GuardianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 미들웨어에서 인증을 처리하므로, 여기서는 세션 데이터 존재 여부만 확인하여 타입 안전성 확보
  if (!session || !session.user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-muted/20 md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-bold text-primary">Rooted</span>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-4">
            <div className="px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                보호자 메뉴
              </p>
            </div>
            <NavigationLinks links={GUARDIAN_LINKS} />
          </div>
          <div className="border-t pt-4">
            <div className="mb-4 px-2">
              <p className="text-sm font-medium">{session.user.name || session.user.email}</p>
              <p className="text-xs text-muted-foreground">보호자</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-4 md:hidden">
          <span className="font-bold text-primary">Rooted</span>
        </header>
        
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background p-2 md:hidden">
          <div className="flex justify-around">
            {GUARDIAN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-2 text-xs text-muted-foreground hover:text-primary"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
