/**
 * app/login/page.tsx
 * Login Page (Client Component)
 * - Provides a mock login for testing the prototype.
 * - Supports testing both Guardian and Admin roles.
 */

"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // hard redirect를 통해 세션 상태를 모든 레이어(Middleware, Server Components)에 확실히 동기화
        const target = callbackUrl || (email.includes("admin") ? "/admin/dashboard" : "/guardian/dashboard");
        window.location.href = target;
      } else {
        alert("로그인 실패: 이메일이나 비밀번호를 확인하세요.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("로그인 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="guardian@test.com 또는 admin@test.com"
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Rooted 로그인</h1>
          <p className="mt-2 text-muted-foreground">프로토타입 테스트 계정을 사용하세요.</p>
        </div>

        <Suspense fallback={<div className="text-center py-4">로딩 중...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 rounded-md bg-muted p-4 text-xs space-y-2">
          <p className="font-semibold text-muted-foreground underline">테스트 계정 정보</p>
          <p>• 보호자: guardian@test.com / password</p>
          <p>• 관리자: admin@test.com / password</p>
        </div>
      </div>
    </div>
  );
}

