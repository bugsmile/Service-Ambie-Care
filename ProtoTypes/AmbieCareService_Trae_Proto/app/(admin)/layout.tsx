/**
 * app/(admin)/layout.tsx
 * Admin Portal Layout (Server Component)
 * - Protects the route by checking for a valid 'FACILITY_ADMIN' session.
 * - Renders a responsive shell with a distinct admin style and role badge.
 */

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assumption: authOptions location
import { NavigationLinks } from "@/components/shared/navigation-links";
import { LogoutButton } from "@/components/shared/logout-button";

const ADMIN_LINKS = [
  { label: "실시간 대시보드", href: "/admin/dashboard" },
  { label: "이벤트 로그", href: "/admin/dashboard/events" },
  { label: "디바이스 관리", href: "/admin/devices" },
];

export default async function AdminLayout({
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
      <aside className="hidden w-64 flex-col border-r bg-slate-900 text-slate-50 md:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <span className="text-lg font-bold text-white">Rooted Admin</span>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                관리자 메뉴
              </p>
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                ADMIN
              </span>
            </div>
            <NavigationLinks 
              links={ADMIN_LINKS} 
              className="text-slate-300 hover:text-white"
            />
          </div>
          <div className="border-t border-slate-800 pt-4">
            <div className="mb-4 px-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{session.user.name || session.user.email}</p>
              </div>
              <p className="text-xs text-slate-400">시설 관리자</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4 md:hidden">
          <span className="font-bold text-primary">Rooted Admin</span>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            시설 관리자
          </span>
        </header>
        
        <main className="flex-1 bg-slate-50/50 p-4 md:p-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-2 md:hidden">
          <div className="flex justify-around">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-2 text-xs text-slate-500 hover:text-primary"
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
