## Role & Objective

You are a senior Frontend Engineer specializing in **Next.js 14+ App Router**, **Tailwind CSS**, **shadcn/ui**, and **NextAuth.js**.

Your goal is to implement the **complete UI foundation** for the "Rooted" (Ambi-Care) ambient care platform — covering the Root Layout, a Landing Page, role-based portal layouts for Guardian and Facility Admin users, and a reusable Device Status Indicator component.

Implement every file listed in the four tasks below. Output **production-ready, copy-pasteable TypeScript code** for each file, grouped by task. Add a short comment block at the top of each file describing its role.

---

## Hard Constraints (Non-Negotiable)

| Category | Rule |
|---|---|
| **App Router** | All layout files are **Server Components** by default. Never add `"use client"` to `app/layout.tsx`, `app/(guardian)/layout.tsx`, or `app/(admin)/layout.tsx`. |
| **Client Components** | Only components that use React hooks (`usePathname`, `useState`, etc.) may be Client Components. Extract them into separate files under `components/`. |
| **Auth Protection** | Route protection MUST use `getServerSession(authOptions)` on the server side. Client-side-only redirect is a security vulnerability and is NOT acceptable. |
| **Metadata** | Use Next.js `Metadata` API only. Never modify `<head>` directly. |
| **i18n / Accessibility** | `<html lang="ko">` is required. All interactive/status elements need proper ARIA attributes. |
| **TypeScript** | Zero type errors. All props interfaces must be explicitly typed. |
| **ESLint** | Zero warnings. No unused imports. |
| **Responsive** | Mobile-first design. Support 375 px (mobile) → 1280 px (desktop). |

---

## Project File Structure (Target)

Generate code only for the files marked with `[ ]` below. Do not modify other files.

```
app/
  layout.tsx                         ← [UI-001] Root Layout (Server Component)
  globals.css                        ← [UI-001] Tailwind directives + shadcn/ui CSS variables
  page.tsx                           ← [UI-001] Landing Page
  not-found.tsx                      ← [UI-001] Custom 404
  error.tsx                          ← [UI-001] Global Error Boundary ("use client")
  loading.tsx                        ← [UI-001] Global Loading UI
  (guardian)/
    layout.tsx                       ← [UI-002] Guardian Portal Layout (Server Component)
  (admin)/
    layout.tsx                       ← [UI-003] Admin Portal Layout (Server Component)
components/
  shared/
    navigation-links.tsx             ← [UI-002 / UI-003] Active-route nav links (Client Component)
    device-status-indicator.tsx      ← [UI-004] Reusable status dot component
types/
  device.ts                          ← [UI-004] DeviceStatus type definition
```

---

## Task 1 — Root Layout & Landing Page (UI-001)

### Files to generate

#### `app/layout.tsx`
- **Server Component** — no `"use client"`.
- Set `<html lang="ko">`.
- Import `./globals.css`.
- Export a `Metadata` object:
  - `title`: `"Rooted — Ambient Home Safety"`
  - `description`: `"AI 기반 비접촉 앰비언트 케어 솔루션으로 소중한 가족의 일상 안전을 지킵니다."`
- Render `{children}` inside `<body>`.
- Optionally wrap `{children}` in a `ThemeProvider` if you scaffold dark-mode support.

#### `app/globals.css`
- Include Tailwind directives: `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`.
- Define shadcn/ui CSS variable block inside `:root` and `.dark` (standard shadcn/ui init output):
  - Variables include `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, `--radius`, etc.
- Do **not** invent custom values — use the default shadcn/ui palette.

#### `app/page.tsx`
- **Server Component**.
- Display the service name **"Rooted"** prominently (e.g., `<h1>`).
- Display the slogan: `"AI 기반 앰비언트 케어 솔루션"`.
- Render two buttons using shadcn/ui `<Button>` wrapped in Next.js `<Link>`:
  - `"보호자 로그인"` → routes to `/login`
  - `"시설 관리자 로그인"` → routes to `/login` (same route; role is determined post-login)
- Add a brief service description paragraph.
- Page must be visually clean and centered.

#### `app/not-found.tsx`
- Display a friendly 404 message in Korean.
- Include a shadcn/ui `<Button>` link back to `/`.

#### `app/error.tsx`
- **Must be a Client Component** (`"use client"`).
- Accept `{ error, reset }` props (Next.js error boundary signature).
- Display the error message and a retry button that calls `reset()`.

#### `app/loading.tsx`
- Global loading UI.
- Use shadcn/ui `<Skeleton>` or a simple centered spinner.

### Acceptance Criteria Checklist (UI-001)
- [ ] `<html lang="ko">` is set in `app/layout.tsx`.
- [ ] Browser tab title is `"Rooted — Ambient Home Safety"`.
- [ ] Landing page renders both login buttons and navigates to `/login`.
- [ ] `/nonexistent` shows the custom 404 page.
- [ ] `npm run build` completes without errors.

---

## Task 2 — Guardian Portal Layout (UI-002)

### Files to generate

#### `app/(guardian)/layout.tsx`
- **Server Component**.
- Call `getServerSession(authOptions)` at the top.
  - If no session → `redirect('/login')`.
  - If `session.user.role !== 'GUARDIAN'` → `redirect('/(admin)/dashboard')` or `redirect('/login')`.
- Render a responsive shell:
  - **Desktop (≥ 768 px)**: Left sidebar, fixed width ~240 px, with navigation links.
  - **Mobile (< 768 px)**: Collapsible drawer using shadcn/ui `<Sheet>`, or a bottom tab bar.
- Display the logged-in user's **name or email** (from `session.user`).
- Render `{children}` in the main content area.

#### Navigation menu items (for Guardian)
Use these items in the sidebar / mobile nav. Active state is handled by `<NavigationLinks>` (see below):

| Label | href |
|---|---|
| 홈 대시보드 | `/(guardian)/dashboard` |
| 일간 보고서 | `/(guardian)/reports` |
| 디바이스 설정 | `/(guardian)/devices` (placeholder) |

- Add a **로그아웃** button at the bottom that calls `signOut()` from `next-auth/react`.
  - Since `signOut()` requires a client-side call, wrap this button in a small `LogoutButton` Client Component.

#### `components/shared/navigation-links.tsx`
- **Client Component** (`"use client"`).
- Accept a `links` prop: `Array<{ label: string; href: string }>`.
- Use `usePathname()` to detect the current path.
- Render each link as a Next.js `<Link>`. Apply an **active style** (e.g., different background color, bold text) when `pathname === href` or `pathname.startsWith(href)`.

### Acceptance Criteria Checklist (UI-002)
- [ ] Unauthenticated users are redirected to `/login` server-side.
- [ ] The current route's menu item is visually highlighted.
- [ ] Logout button triggers `signOut()`.
- [ ] Navigation is visible and functional on both mobile and desktop.

---

## Task 3 — Facility Admin Portal Layout (UI-003)

### Files to generate

#### `app/(admin)/layout.tsx`
- **Server Component**.
- Call `getServerSession(authOptions)` at the top.
  - If no session → `redirect('/login')`.
  - If `session.user.role !== 'FACILITY_ADMIN'` → `redirect('/(guardian)/dashboard')`.
- Render a responsive admin shell (same pattern as Guardian, but visually distinct):
  - Show a **"시설 관리자"** role badge/label near the user name.
  - *(Optional / Phase 2)*: Add a notification bell icon in the header area with a badge count.
- Reuse `<NavigationLinks>` (created in UI-002) for active-route highlighting.
- Render `{children}` in the main content area.

#### Navigation menu items (for Admin)

| Label | href |
|---|---|
| 실시간 대시보드 | `/(admin)/dashboard` |
| 이벤트 로그 | `/(admin)/dashboard/events` |
| 디바이스 관리 | `/(admin)/devices` (placeholder) |

- Add a **로그아웃** button (reuse the same `LogoutButton` Client Component from UI-002).

### Acceptance Criteria Checklist (UI-003)
- [ ] `role !== 'FACILITY_ADMIN'` users are redirected server-side.
- [ ] "시설 관리자" label/badge is visible in the layout.
- [ ] Admin route group is completely isolated from Guardian route group.
- [ ] Navigation works on mobile and desktop.

---

## Task 4 — DeviceStatusIndicator Shared Component (UI-004)

### Files to generate

#### `types/device.ts`
```typescript
// Shared device status type used across Guardian and Admin portals
export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
```

#### `components/shared/device-status-indicator.tsx`

**Props interface:**
```typescript
interface DeviceStatusIndicatorProps {
  status: DeviceStatus;
  size?: 'sm' | 'md' | 'lg';   // default: 'md'
  showLabel?: boolean;           // default: false
  pulse?: boolean;               // animate-pulse for ACTIVE, default: false
}
```

**Status → visual mapping:**

| Status | Dot color (Tailwind) | Label text |
|---|---|---|
| `ACTIVE` | `bg-green-500` | `"활성"` |
| `INACTIVE` | `bg-red-500` | `"오프라인"` |
| `MAINTENANCE` | `bg-yellow-500` | `"점검 중"` |

**Size → Tailwind class mapping:**

| size | Dot class |
|---|---|
| `sm` | `w-2 h-2` |
| `md` | `w-3 h-3` |
| `lg` | `w-4 h-4` |

**Accessibility requirements:**
- The wrapping element must have `role="status"`.
- Always set `aria-label` e.g. `"디바이스 상태: 활성"` — even when `showLabel` is `false`.

**Behavior:**
- When `pulse` is `true` and `status === 'ACTIVE'`, add `animate-pulse` to the dot element.
- When `showLabel` is `true`, render the label text next to the dot (e.g., inside a `<span>`).
- This is a **pure presentational component**: no hooks, no data fetching, no side effects.

### Acceptance Criteria Checklist (UI-004)
- [ ] All three statuses render the correct color dot.
- [ ] `showLabel: true` shows the text label; `showLabel: false` hides it but `aria-label` remains.
- [ ] `size` prop changes the dot dimensions correctly.
- [ ] `pulse: true` adds `animate-pulse` class on ACTIVE status.
- [ ] `DeviceStatus` type is exported from `types/device.ts` (single source of truth).

---

## Output Format Instructions

For each file, output in this format:

```
### `<file path>`
\`\`\`tsx
// ... complete file content ...
\`\`\`
```

Generate **all files** in order: UI-001 → UI-002 → UI-003 → UI-004.

Do not truncate or skip any file. Each file must be **complete and immediately usable** without further edits (except filling in real `authOptions` import paths if needed).

After all code blocks, add a brief **"Integration Notes"** section listing:
1. Required npm packages not already in a standard Next.js + shadcn/ui setup.
2. Any `authOptions` import path assumptions you made.
3. Any placeholder hrefs that need to be created in future tasks.