
import type {Metadata} from 'next';
import './globals.css';

/**
 * [UI-001] Root Layout
 * Server Component
 */
export const metadata: Metadata = {
  title: 'Rooted — Ambient Home Safety',
  description: 'AI 기반 비접촉 앰비언트 케어 솔루션으로 소중한 가족의 일상 안전을 지킵니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
