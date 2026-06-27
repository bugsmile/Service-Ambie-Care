
import { redirect } from 'next/navigation';
import { LayoutDashboard, Activity, HardDrive, Bell, Menu } from 'lucide-react';
import { NavigationLinks } from '@/components/shared/navigation-links';
import { LogoutButton } from '@/components/shared/logout-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

/**
 * [UI-003] Admin Portal Layout
 * Server Component
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mocking session for UI foundation
  const session = {
    user: {
      name: '이관리',
      email: 'admin@rooted.com',
      role: 'FACILITY_ADMIN'
    }
  };

  // if (!session) redirect('/login');
  if (session.user.role !== 'FACILITY_ADMIN') redirect('/(guardian)/dashboard');

  const navLinks = [
    { label: '실시간 대시보드', href: '/(admin)/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: '이벤트 로그', href: '/(admin)/dashboard/events', icon: <Activity className="h-4 w-4" /> },
    { label: '디바이스 관리', href: '/(admin)/devices', icon: <HardDrive className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-sidebar p-4">
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-accent" />
          <span className="text-xl font-bold font-headline">Rooted Admin</span>
        </div>
        <div className="mb-8 px-2">
          <Badge variant="secondary" className="font-semibold bg-accent/20 text-accent-foreground">
            시설 관리자
          </Badge>
        </div>

        <div className="flex-1">
          <NavigationLinks links={navLinks} />
        </div>

        <div className="mt-auto pt-4 border-t space-y-4">
          <div className="px-2 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="relative shrink-0">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between h-16 px-4 border-b bg-background sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-headline text-primary">Rooted</span>
            <Badge variant="outline" className="text-[10px] h-4">시설 관리자</Badge>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="relative shrink-0">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar flex flex-col p-4">
                <div className="flex items-center gap-2 mb-2 px-2">
                  <div className="h-8 w-8 rounded-lg bg-accent" />
                  <span className="text-xl font-bold font-headline">Rooted Admin</span>
                </div>
                <div className="mb-8 px-2">
                  <Badge variant="secondary" className="font-semibold bg-accent/20">시설 관리자</Badge>
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
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
