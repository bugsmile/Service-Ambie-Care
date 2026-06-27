/**
 * app/layout.tsx
 * Root Layout (Server Component)
 * - Sets the HTML language to Korean.
 * - Configures global metadata for the application.
 * - Imports global CSS and wraps the application content.
 */

import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "Rooted — Ambient Home Safety",
  description: "AI 기반 비접촉 앰비언트 케어 솔루션으로 소중한 가족의 일상 안전을 지킵니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
