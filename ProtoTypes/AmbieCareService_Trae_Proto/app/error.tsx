/**
 * app/error.tsx
 * Global Error Boundary (Client Component)
 * - Catches unexpected errors in the route segment.
 * - Displays an error message and a retry button.
 */

"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            문제가 발생했습니다
          </h2>
          <p className="text-muted-foreground">
            시스템 오류로 인해 페이지를 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
