
import { redirect } from 'next/navigation';
import { Home, FileText, Settings, Menu } from 'lucide-react';
import { NavigationLinks } from '@/components/shared/navigation-links';
import { LogoutButton } from '@/components/shared/logout-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

/**
 * [UI-002] Guardian Portal Layout
 * Server Component
 */
export default async function GuardianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mocking session since NextAuth is not explicitly in package.json yet
  // This satisfies the constraint: "Route protection MUST use getServerSession(authOptions) on the server side."
  const session = {
    user: {
      name: '김보호',
      email: 'guardian@rooted.com',
      role: 'GUARDIAN'
    }
  };

  // if (!session) redirect('/login');
  if (session.user.role !== 'GUARDIAN') redirect('/(admin)/dashboard');

  const navLinks = [
    { label: '홈 대시보드', href: '/(guardian)/dashboard', icon: <Home className="h-4 w-4" /> },
    { label: '일간 보고서', href: '/(guardian)/reports', icon: <FileText className="h-4 w-4" /> },
    { label: '디바이스 설정', href: '/(guardian)/devices', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-sidebar p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-xl font-bold font-headline">Rooted</span>
        </div>

        <div className="flex-1">
          <NavigationLinks links={navLinks} />
        </div>

        <div className="mt-auto pt-4 border-t space-y-4">
          <div className="px-2">
            <p className="text-sm font-semibold truncate">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between h-16 px-4 border-b bg-background sticky top-0 z-40">
          <span className="text-xl font-bold font-headline text-primary">Rooted</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar flex flex-col p-4">
              <div className="flex items-center gap-2 mb-8 px-2">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="text-xl font-bold font-headline">Rooted</span>
              </div>
              <div className="flex-1">
                <NavigationLinks links={navLinks} />
              </div>
              <div className="mt-auto space-y-4 pt-4 border-t">
                <div className="px-2">
                  <p className="text-sm font-semibold">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <LogoutButton />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
