/**
 * app/not-found.tsx
 * Custom 404 Page
 * - Displays a friendly error message in Korean when a route is not found.
 * - Provides a link back to the home page.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
