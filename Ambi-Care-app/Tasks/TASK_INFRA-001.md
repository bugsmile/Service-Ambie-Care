---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] INFRA-001: Next.js + Tailwind CSS + shadcn/ui 초기 프로젝트 설정"
labels: 'feature, infra, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [INFRA-001] Next.js + Tailwind CSS + shadcn/ui 초기 프로젝트 설정
- 목적: Rooted MVP의 전체 기술 스택 기반이 되는 Next.js App Router 프로젝트를 생성하고, Tailwind CSS와 shadcn/ui 컴포넌트 라이브러리를 통합 설정하여 모든 후속 개발 작업의 토대를 마련한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Recommended Project Structure
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 0 Foundation
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§15`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Free Tier Constraint Specification
- 제약사항: CON-06 (Next.js Fullstack), CON-09 (Tailwind CSS + shadcn/ui)
- Next.js App Router Docs: [https://nextjs.org/docs/app](https://nextjs.org/docs/app) (REF-08)
- shadcn/ui Docs: [https://ui.shadcn.com](https://ui.shadcn.com)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — INFRA-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `npx create-next-app@latest ./` 실행 — App Router, TypeScript, Tailwind CSS, ESLint, `src/` 미사용 옵션 선택
- [ ] `package.json` 의존성 확인 — `next`, `react`, `react-dom`, `typescript`, `tailwindcss` 버전 확인
- [ ] `tailwind.config.ts` 기본 설정 검증 — `content` 경로에 `app/`, `components/` 포함 확인
- [ ] `app/globals.css` — Tailwind CSS 디렉티브(`@tailwind base/components/utilities`) 포함 확인
- [ ] shadcn/ui 초기화 — `npx shadcn-ui@latest init` 실행 (components.json 생성)
- [ ] shadcn/ui 핵심 컴포넌트 설치 — `button`, `card`, `badge`, `alert`, `input`, `form`, `label` 컴포넌트 추가
- [ ] `app/layout.tsx` — Root Layout 생성 (메타데이터: title "Rooted — Ambient Home Safety", description 포함)
- [ ] `app/page.tsx` — 기본 Landing 페이지 스캐폴드 생성 (프로젝트명 + 간단 설명)
- [ ] `tsconfig.json` — `@/` 경로 별칭 설정 확인 (`"@/*": ["./*"]`)
- [ ] `next.config.ts` — 기본 설정 파일 생성 확인
- [ ] 로컬 개발 서버 실행 확인 — `npm run dev` → `http://localhost:3000` 정상 접속

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: Next.js 프로젝트 정상 생성 및 실행**
- Given: `npx create-next-app@latest`로 프로젝트가 생성됨
- When: `npm run dev` 명령을 실행함
- Then: `http://localhost:3000`에서 기본 페이지가 정상적으로 렌더링되고 콘솔에 에러가 없다.

**Scenario 2: Tailwind CSS 정상 작동**
- Given: `globals.css`에 Tailwind 디렉티브가 포함됨
- When: 임의의 Tailwind 클래스(예: `bg-blue-500 text-white p-4`)를 적용한 `<div>`를 렌더링함
- Then: 해당 스타일이 브라우저에 정상적으로 반영된다.

**Scenario 3: shadcn/ui 컴포넌트 정상 렌더링**
- Given: `npx shadcn-ui@latest init`으로 초기화되고 `button` 컴포넌트가 설치됨
- When: `import { Button } from "@/components/ui/button"`을 사용하여 버튼을 렌더링함
- Then: shadcn/ui 스타일이 적용된 버튼 컴포넌트가 정상적으로 표시된다.

**Scenario 4: App Router 디렉토리 구조 확인**
- Given: 프로젝트가 App Router 모드로 생성됨
- When: `app/` 디렉토리 내 `layout.tsx`, `page.tsx` 파일을 확인함
- Then: App Router 기반 라우팅이 정상적으로 동작하며, `(auth)`, `(guardian)`, `(admin)` 라우트 그룹 디렉토리를 추가할 수 있는 구조이다.

## :gear: Technical & Non-Functional Constraints
- **프레임워크 제약:** Next.js App Router 사용 필수 (Pages Router 사용 금지) — CON-06
- **UI 라이브러리:** Tailwind CSS + shadcn/ui 조합 필수 — CON-09
- **TypeScript:** 프로젝트 전체 TypeScript 필수
- **패키지 매니저:** npm 사용 (yarn/pnpm도 가능하나 일관성을 위해 npm 권장)
- **Node.js 버전:** Node.js 18.x 이상
- **빌드 확인:** `npm run build` 시 에러 0건

## :checkered_flag: Definition of Done (DoD)
- [ ] `npm run dev`로 로컬 개발 서버가 정상 실행되는가?
- [ ] `npm run build`가 에러 없이 완료되는가?
- [ ] Tailwind CSS 유틸리티 클래스가 정상적으로 적용되는가?
- [ ] shadcn/ui 컴포넌트(Button, Card, Badge 등)가 import 및 렌더링 가능한가?
- [ ] `components.json` (shadcn/ui 설정 파일)이 정상 생성되었는가?
- [ ] App Router 기반 `app/layout.tsx`, `app/page.tsx`가 존재하며 정상 동작하는가?
- [ ] ESLint 경고/에러가 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** 없음 (최초 태스크)
- **Blocks:** INFRA-002 (Vercel Hobby 배포), INFRA-003 (Cron Job 설정), INFRA-004 (환경 변수 설정), DB-001~DB-005 (모든 Prisma 스키마), AUTH-001 (NextAuth.js), UI-001~004 (모든 Layout/Shared 컴포넌트)
- **참고:** 이 태스크는 Phase 0의 최초 진입점이며, 전체 프로젝트의 기반이 됩니다.
