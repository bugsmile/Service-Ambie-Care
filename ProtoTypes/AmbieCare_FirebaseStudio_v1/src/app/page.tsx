
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * [UI-001] Landing Page
 * Server Component
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary font-headline">
            Rooted
          </h1>
          <p className="text-xl font-medium text-muted-foreground">
            AI 기반 앰비언트 케어 솔루션
          </p>
        </div>

        <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">서비스 시작하기</CardTitle>
            <CardDescription>
              앰비언트 기술로 지키는 소중한 일상
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild size="lg" className="w-full font-semibold">
              <Link href="/login">보호자 로그인</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full font-semibold">
              <Link href="/login">시설 관리자 로그인</Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Rooted는 비접촉 센서와 AI를 결합하여 거주자의 프라이버시를 존중하면서도 24시간 안전을 모니터링합니다.
        </p>
      </div>
    </main>
  );
}
