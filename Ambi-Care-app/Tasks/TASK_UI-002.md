---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] UI-002: Guardian Layout — 사이드바/네비게이션 구현"
labels: 'feature, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [UI-002] Guardian 포털 공통 레이아웃 (`app/(guardian)/layout.tsx`) 구현
- 목적: Guardian(보호자) 역할 사용자가 사용하는 모든 페이지의 공통 네비게이션(사이드바 또는 탑바)과 인증 보호 래퍼를 구현하여, Guardian 전용 라우트의 일관된 UX를 제공한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`app/(guardian)/`)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Client Apps (Guardian Portal)
- 인증: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js JWT 설정
- Root Layout: [`/TASKs/TASK_UI-001.md`](./TASK_UI-001.md) — Root Layout
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — UI-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/(guardian)/layout.tsx` — Guardian Layout Server Component 생성
- [ ] 서버 사이드 세션 검증 — `getServerSession(authOptions)` 호출, 미인증 시 `/login`으로 리다이렉트
- [ ] `role` 검증 — Guardian 역할이 아닌 사용자(예: FACILITY_ADMIN) 접근 시 적절한 페이지로 리다이렉트 또는 403 표시
- [ ] 네비게이션 구조 구현 (모바일 우선):
  - 모바일: 하단 탭 바 또는 햄버거 메뉴
  - 데스크톱: 좌측 사이드바 또는 상단 네비게이션 바
- [ ] 네비게이션 메뉴 항목:
  - 홈 대시보드 (`/(guardian)/dashboard`)
  - 일간 보고서 (`/(guardian)/reports`)
  - 디바이스 설정 (향후 추가 예정)
  - 로그아웃 버튼 (NextAuth.js `signOut()`)
- [ ] 현재 경로 활성 표시 — `usePathname()` 훅으로 현재 메뉴 하이라이트
- [ ] 사용자 이름/이메일 표시 (세션 정보에서 가져오기)
- [ ] shadcn/ui `Sheet` (모바일 드로어) 또는 고정 사이드바 레이아웃 구현

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 인증된 Guardian 정상 접근**
- Given: 유효한 Guardian JWT 세션이 있는 사용자
- When: `/(guardian)/dashboard`에 접근함
- Then: 사이드바/네비게이션이 표시되고 대시보드 콘텐츠가 정상 렌더링된다.

**Scenario 2: 미인증 사용자 리다이렉트**
- Given: 로그인하지 않은 사용자
- When: `/(guardian)/dashboard`에 직접 URL로 접근함
- Then: `/login` 페이지로 자동 리다이렉트된다.

**Scenario 3: 네비게이션 활성 상태 표시**
- Given: Guardian이 `/reports` 페이지에 있음
- When: 사이드바/탑바 메뉴 렌더링
- Then: "일간 보고서" 메뉴 항목이 활성(하이라이트) 상태로 표시된다.

**Scenario 4: 로그아웃 동작**
- Given: Guardian이 로그인된 상태
- When: 로그아웃 버튼을 클릭함
- Then: NextAuth.js `signOut()`이 호출되고 `/login` 페이지로 이동한다.

## :gear: Technical & Non-Functional Constraints
- **App Router 라우트 그룹:** `(guardian)` 폴더명은 URL에 포함되지 않음 (Next.js Route Groups)
- **Server + Client 혼합:** 레이아웃 자체는 Server Component, 네비게이션의 `usePathname()` 사용 부분은 별도 Client Component로 분리
- **인증 보호:** 클라이언트 사이드만의 리다이렉트는 보안 취약 — 서버 사이드 `getServerSession()` 필수
- **반응형:** 모바일 375px ~ 데스크톱 1280px 전 범위에서 정상 동작

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 미인증 사용자가 서버 사이드에서 리다이렉트되는가?
- [ ] 모바일/데스크톱 모두에서 네비게이션이 정상 표시되는가?
- [ ] 현재 경로에 맞는 메뉴가 활성 상태로 표시되는가?
- [ ] 로그아웃이 정상 동작하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_AUTH-001 (NextAuth.js 설정), TASK_INFRA-001 (shadcn/ui), TASK_UI-001 (Root Layout)
- **Blocks:** 모든 `app/(guardian)/` 하위 페이지 (RPT-002, RPT-003, FA-003 등)
- **참고:** `(guardian)` 라우트 그룹과 `(admin)` 라우트 그룹은 완전히 분리된 레이아웃을 가진다. 공통 네비게이션 로직은 `components/shared/navigation.tsx`로 추출하여 재사용하는 것을 권장한다.
