# Role & Objective
You are an expert Frontend Developer specializing in Next.js 14+ (App Router), Tailwind CSS, NextAuth.js, and shadcn/ui. 
Your task is to implement the foundational UI components, authentication layouts, and shared elements for the "Rooted" (Ambi-Care) project based on four specific UI tasks (UI-001 to UI-004).

# Key Tech Stack & Architecture Constraints
- **Framework**: Next.js (App Router). Strict separation of Server Components and Client Components ("use client" only where hooks are needed).
- **Styling**: Tailwind CSS and shadcn/ui.
- **Authentication**: NextAuth.js. You must use `getServerSession` for server-side route protection.
- **Quality**: Ensure zero TypeScript errors and zero ESLint warnings. Implement responsive design (Mobile-first).

---

# Task Breakdown & Implementation Details

## 1. Root Foundation & Landing Page (UI-001)
Implement the base application structure:
- **app/layout.tsx**: Create the Root Layout (Server Component). Must include <html lang="ko">, import globals.css, and define Next.js Metadata (Title: "Rooted — Ambient Home Safety", plus a relevant description).
- **app/globals.css**: Set up Tailwind directives and ensure shadcn/ui CSS variables are prepared.
- **app/page.tsx**: Build a Landing Page. Include the "Rooted" service name, a slogan ("AI-based Ambient Care Solution"), a Guardian login button (routing to /login), and a Facility Admin login button.
- **Global UI States**: 
  - app/not-found.tsx: Basic 404 custom page.
  - app/error.tsx: Global error boundary.
  - app/loading.tsx: Global loading UI using a Skeleton or spinner.
- **public/favicon.ico**: Add a basic placeholder favicon.

## 2. Guardian Portal Layout (UI-002)
Implement the layout for the Guardian role in the (guardian) route group:
- **app/(guardian)/layout.tsx**: Create a Server Component layout.
- **Auth Protection**: Use getServerSession(authOptions). Redirect unauthenticated users to /login.
- **Navigation UI**: Implement a responsive navigation (Sidebar for desktop, Bottom tab or Hamburger for mobile). Include user's name/email from the session.
- **Menu Items**: Home Dashboard (/(guardian)/dashboard), Daily Reports (/(guardian)/reports), Device Settings, and a Logout button (triggering signOut()).
- **Active State**: Extract navigation links into a Client Component to use usePathname() for highlighting the active route.

## 3. Facility Admin Portal Layout (UI-003)
Implement the layout for the Admin role in the (admin) route group:
- **app/(admin)/layout.tsx**: Create a Server Component layout.
- **Role-Based Auth Protection**: Validate session and check session.user.role. 
  - Unauthenticated -> Redirect to /login.
  - If role !== 'FACILITY_ADMIN' (e.g., Guardian) -> Redirect to /(guardian)/dashboard or show a 403 error.
- **Navigation UI**: Real-time Dashboard (/(admin)/dashboard), Event Logs (/(admin)/dashboard/events), Device Management, and Logout.
- **UI Details**: Display a "시설 관리자" (Facility Admin) badge/label. Add a notification bell icon in the header. Use usePathname() in a Client Component for active highlighting.

## 4. Shared Device Status Indicator (UI-004)
Implement a reusable component for displaying sensor/device status:
- **Types**: Create types/device.ts and define/export DeviceStatus ('ACTIVE' | 'INACTIVE' | 'MAINTENANCE').
- **Component**: Create components/shared/device-status-indicator.tsx.
- **Props**: 
  - status: DeviceStatus
  - size?: 'sm' | 'md' | 'lg' (sm: w-2 h-2, md: w-3 h-3, lg: w-4 h-4)
  - showLabel?: boolean
- **Visual Mapping**:
  - ACTIVE: Green dot + "활성" text + optional animate-pulse effect.
  - INACTIVE: Red dot + "오프라인" text.
  - MAINTENANCE: Yellow dot + "점검 중" text.
- **Accessibility**: Add role="status" and aria-label (e.g., "디바이스 상태: 활성"). Even if showLabel is false, the aria-label must remain. Ensure this is a pure UI component with no data fetching.

---
# Output Instruction
Please generate the complete, production-ready code for the files mentioned above. Maintain clean folder structures and provide the code block for each specific file.
