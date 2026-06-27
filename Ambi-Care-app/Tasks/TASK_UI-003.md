---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] UI-003: Admin Layout — 시설 관리자 네비게이션 구현"
labels: 'feature, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [UI-003] Admin(시설 관리자) 포털 공통 레이아웃 (`app/(admin)/layout.tsx`) 구현
- 목적: FACILITY_ADMIN 역할 사용자가 사용하는 B2B Dashboard 및 관리 페이지 전체에 공통 네비게이션과 역할 기반 인증 보호를 적용하여, 관리자 전용 라우트의 일관된 UX를 제공한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`app/(admin)/`)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Client Apps (B2B Dashboard)
- 인증: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js JWT + role 필드
- Guardian Layout 참조: [`/TASKs/TASK_UI-002.md`](./TASK_UI-002.md) — 유사 구조
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — UI-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/(admin)/layout.tsx` — Admin Layout Server Component 생성
- [ ] 서버 사이드 세션 검증 — `getServerSession(authOptions)` 호출, 미인증 시 `/login` 리다이렉트
- [ ] `role` 검증 — `session.user.role !== 'FACILITY_ADMIN'` 시 Guardian 대시보드 또는 403 페이지로 리다이렉트
- [ ] 관리자 전용 네비게이션 구현:
  - 실시간 대시보드 (`/(admin)/dashboard`) — 메인 메뉴
  - 이벤트 로그 검색 (`/(admin)/dashboard/events`)
  - 디바이스 관리 (향후 Phase 3+)
  - 로그아웃 버튼
- [ ] 관리자 식별 UI — "시설 관리자" 역할 배지 또는 레이블 표시
- [ ] `usePathname()` 기반 활성 메뉴 하이라이트 (Client Component로 분리)
- [ ] 상단 헤더에 알림 아이콘/뱃지 — 긴급 이벤트 수 표시 (선택적, Phase 2+)
- [ ] 반응형 레이아웃 — 사이드바(데스크톱) / 햄버거 메뉴(모바일)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: FACILITY_ADMIN 정상 접근**
- Given: `role: "FACILITY_ADMIN"` JWT 세션이 있는 사용자
- When: `/(admin)/dashboard`에 접근함
- Then: 관리자 네비게이션이 표시되고 대시보드 콘텐츠가 정상 렌더링된다.

**Scenario 2: Guardian 역할 사용자의 Admin 라우트 접근 차단**
- Given: `role: "GUARDIAN"` JWT 세션이 있는 사용자
- When: `/(admin)/dashboard`에 직접 URL로 접근함
- Then: Guardian 대시보드(`/(guardian)/dashboard`) 또는 403 페이지로 리다이렉트된다.

**Scenario 3: 미인증 사용자 차단**
- Given: 세션이 없는 미인증 사용자
- When: `/(admin)/dashboard`에 접근함
- Then: `/login` 페이지로 자동 리다이렉트된다.

**Scenario 4: 관리자 역할 표시**
- Given: FACILITY_ADMIN이 로그인됨
- When: 관리자 레이아웃이 렌더링됨
- Then: UI에 "시설 관리자" 역할 표시가 있고, 관리자 전용 메뉴 항목만 표시된다.

## :gear: Technical & Non-Functional Constraints
- **역할 기반 접근 제어:** 서버 사이드에서 `session.user.role` 검증 필수 — REQ-NF-011
- **App Router Route Groups:** `(admin)` 폴더명은 URL에 포함되지 않음
- **Server + Client 분리:** 레이아웃 = Server Component, `usePathname()` 사용 부분 = Client Component
- **RBAC Phase:** 현재는 단순 role 비교; Phase 2 SEC-004에서 미들웨어 기반 RBAC로 고도화 예정

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 서버 사이드에서 role 검증이 이루어지는가?
- [ ] Guardian 역할 사용자가 Admin 라우트에 접근할 수 없는가?
- [ ] 미인증 사용자가 로그인 페이지로 리다이렉트되는가?
- [ ] 모바일/데스크톱에서 네비게이션이 정상 표시되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_AUTH-001 (NextAuth.js + role 필드), TASK_INFRA-001 (shadcn/ui), TASK_UI-001 (Root Layout)
- **Blocks:** TASK_DASH-001 (Dashboard Status API 페이지), TASK_DASH-002 (Traffic Light UI), TASK_DASH-005 (이벤트 로그)
- **참고:** `(guardian)/layout.tsx`와 `(admin)/layout.tsx`는 역할 검증 로직만 다르고 구조가 유사하다. 공통 컴포넌트는 `components/shared/` 하위에 추출하여 중복을 최소화한다.
