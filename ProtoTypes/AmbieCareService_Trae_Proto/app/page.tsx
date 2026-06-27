/**
 * app/page.tsx
 * Landing Page (Server Component)
 * - Prominently displays the service name and slogan.
 * - Provides entry points for Guardian and Facility Admin login.
 */

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "GUARDIAN") {
      redirect("/guardian/dashboard");
    } else if (session.user.role === "FACILITY_ADMIN") {
      redirect("/admin/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-primary">
            Rooted
          </h1>
          <p className="text-xl font-medium text-muted-foreground sm:text-2xl">
            AI 기반 앰비언트 케어 솔루션
          </p>
        </div>

        <p className="text-lg text-muted-foreground">
          소중한 가족의 일상과 안전을 비접촉 방식으로 지켜드리는 최첨단 앰비언트 케어 플랫폼입니다.
          언제 어디서나 실시간으로 상태를 확인하고 긴급 상황에 대비하세요.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            보호자 로그인
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            시설 관리자 로그인
          </Link>
        </div>
      </div>
    </main>
  );
}

