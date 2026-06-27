---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] UI-001: Root Layout + 전역 스타일 + Landing 페이지 구성"
labels: 'feature, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [UI-001] Root Layout (`app/layout.tsx`) + 전역 CSS + Landing 페이지 구현
- 목적: 전체 애플리케이션의 공통 HTML 구조, 전역 Tailwind CSS 스타일, 메타데이터, 그리고 서비스 진입점이 되는 Landing 페이지를 구성하여 모든 하위 페이지의 기반을 마련한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Recommended Project Structure
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 0 Foundation
- 의존 태스크: [`/TASKs/TASK_INFRA-001.md`](./TASK_INFRA-001.md) — Next.js + shadcn/ui 초기화
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — UI-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/layout.tsx` — Root Layout 구현:
  - `<html lang="ko">` 설정
  - `<body>` 내 `globals.css` import 확인
  - Next.js `Metadata` 타입으로 `title: "Rooted — Ambient Home Safety"`, `description` 설정
  - `ThemeProvider` (다크모드 지원 시) 또는 기본 설정 유지
- [ ] `app/globals.css` — Tailwind CSS 디렉티브 확인 + 공통 CSS 변수 정의 (shadcn/ui 색상 변수)
- [ ] `app/page.tsx` — Landing 페이지 구현:
  - 서비스명 "Rooted" + 슬로건 표시
  - Guardian 로그인 버튼 (`/login` 링크)
  - 시설 관리자 로그인 버튼 (또는 단일 로그인 버튼)
  - 서비스 소개 간략 문구 ("AI 기반 앰비언트 케어 솔루션")
- [ ] `app/not-found.tsx` — 404 페이지 기본 구현
- [ ] `app/error.tsx` — 전역 에러 바운더리 기본 구현
- [ ] `public/` — `favicon.ico` 설정 (기본 또는 서비스 아이콘)
- [ ] `app/loading.tsx` — 전역 로딩 UI (shadcn/ui Skeleton 또는 spinner)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: Root Layout 정상 렌더링**
- Given: Next.js 앱이 실행됨
- When: `http://localhost:3000`에 접근함
- Then: Landing 페이지가 `app/layout.tsx`의 Root Layout 안에서 정상 렌더링되며, `<html lang="ko">`가 적용된다.

**Scenario 2: Landing 페이지 로그인 네비게이션**
- Given: `app/page.tsx` Landing 페이지가 렌더링됨
- When: 로그인 버튼을 클릭함
- Then: `/login` 또는 `/(auth)/login` 경로로 정상 이동한다.

**Scenario 3: 404 페이지**
- Given: 존재하지 않는 경로(`/nonexistent`)로 접근함
- When: Next.js 라우팅 처리
- Then: `app/not-found.tsx`의 커스텀 404 페이지가 표시된다.

**Scenario 4: 메타데이터 적용 확인**
- Given: Landing 페이지가 렌더링됨
- When: 브라우저 탭 제목 및 `<meta name="description">` 확인
- Then: 제목이 `"Rooted — Ambient Home Safety"`, description이 SRS에 명시된 내용으로 설정된다.

## :gear: Technical & Non-Functional Constraints
- **App Router 전용:** `app/layout.tsx`는 Server Component — `"use client"` 사용 금지
- **국제화:** `<html lang="ko">` 설정 필수 (접근성)
- **SEO:** Next.js `Metadata` API 사용 — `<head>` 직접 수정 금지
- **shadcn/ui:** CSS 변수(`--background`, `--foreground` 등)가 `globals.css`에 정의되어야 shadcn/ui 컴포넌트 스타일 정상 적용

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `app/layout.tsx`가 App Router Server Component로 구현되었는가?
- [ ] Landing 페이지에서 로그인 페이지로 정상 이동되는가?
- [ ] `not-found.tsx`와 `error.tsx`가 존재하는가?
- [ ] `npm run build`가 에러 없이 완료되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001 (Next.js + shadcn/ui 설치 및 초기화)
- **Blocks:** TASK_UI-002 (Guardian Layout), TASK_UI-003 (Admin Layout), TASK_AUTH-002 (Login 페이지 UI)
- **참고:** `globals.css`의 shadcn/ui CSS 변수는 TASK_INFRA-001의 `npx shadcn-ui@latest init`에서 자동 생성된다. 내용을 임의로 수정하지 않는다.
