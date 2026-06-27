
import { Skeleton } from '@/components/ui/skeleton';

/**
 * [UI-001] Global Loading UI
 */
export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 space-y-8">
      <div className="space-y-4 w-full max-w-md flex flex-col items-center">
        <Skeleton className="h-12 w-48 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <div className="grid gap-4 w-full max-w-md">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
