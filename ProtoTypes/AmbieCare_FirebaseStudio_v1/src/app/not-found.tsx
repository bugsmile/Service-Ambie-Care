
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * [UI-001] Custom 404 Page
 * Server Component
 */
export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl font-headline">404</h1>
        <h2 className="text-xl font-semibold sm:text-2xl">페이지를 찾을 수 없습니다</h2>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
