/**
 * app/loading.tsx
 * Global Loading UI
 * - Displays a simple centered spinner during route transitions.
 */

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">불러오는 중...</p>
      </div>
    </div>
  );
}
