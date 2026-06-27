/**
 * components/shared/logout-button.tsx
 * Logout Button (Client Component)
 * - Triggers the NextAuth signOut process.
 */

"use client";

import { signOut } from "next-auth/react";
// import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
    >
      로그아웃
    </button>
  );
}
