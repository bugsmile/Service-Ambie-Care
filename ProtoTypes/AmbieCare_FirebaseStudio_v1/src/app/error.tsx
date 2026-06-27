
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * [UI-001] Global Error Boundary
 * Client Component
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl font-headline">문제가 발생했습니다</h2>
        <p className="max-w-[600px] text-muted-foreground">
          어플리케이션 실행 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <pre className="mt-4 p-4 bg-muted rounded-lg text-xs text-left overflow-auto max-w-md">
          {error.message || 'Unknown error occurred'}
        </pre>
      </div>
      <Button onClick={() => reset()} size="lg">
        다시 시도하기
      </Button>
    </div>
  );
}
