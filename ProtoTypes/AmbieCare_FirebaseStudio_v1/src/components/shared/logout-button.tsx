
'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * [UI-002 / UI-003] Client-side Logout Button
 */
export function LogoutButton() {
  const handleLogout = async () => {
    // In a real app with next-auth:
    // await signOut({ callbackUrl: '/' });
    console.log('Logging out...');
    window.location.href = '/';
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      로그아웃
    </Button>
  );
}
