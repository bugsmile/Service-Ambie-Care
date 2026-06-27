---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] AUTH-002: Login 페이지 UI — shadcn/ui Form 적용"
labels: 'feature, ui, auth, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [AUTH-002] Login 페이지 UI — `app/(auth)/login/page.tsx` (shadcn/ui Form 컴포넌트)
- 목적: B2C Guardian 및 B2B Admin 사용자가 시스템에 접근할 수 있는 로그인 화면을 shadcn/ui 기반으로 아름답고 반응성 있게 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`app/(auth)/login/page.tsx`)
- UI Constraint: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-09`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Tailwind CSS + shadcn/ui
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AUTH-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/(auth)/login/page.tsx` 생성
- [ ] Zod 스키마 정의: email(이메일 형식), password(최소 6자 이상) 유효성 검사
- [ ] `react-hook-form` 및 `@hookform/resolvers/zod` 설정
- [ ] shadcn/ui Form 컴포넌트 (`Card`, `Input`, `Button`, `Label`, `Form`) 조립하여 로그인 폼 구성
- [ ] onSubmit 핸들러 구현:
  - `signIn("credentials", { email, password, redirect: false })` 호출 (NextAuth.js 제공)
  - 로딩 상태(spinner 또는 disabled) 처리
  - 성공 시 역할(role)에 따른 라우팅:
    - GUARDIAN → `/dashboard` (Guardian Portal)
    - FACILITY_ADMIN → `/admin/dashboard` (B2B Dashboard)
  - 실패 시 에러 메시지(toast 또는 form error) 표시
- [ ] UI/UX 개선: 모바일 반응형 대응 (가운데 정렬, 적절한 여백)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 로그인 및 리다이렉트 (Guardian)**
- Given: Guardian 계정으로 로그인 페이지 접속
- When: 올바른 이메일과 비밀번호 입력 후 로그인 클릭
- Then: 인증 성공 후 `/dashboard`로 리다이렉트된다.

**Scenario 2: 유효성 검사 오류 표시**
- Given: 빈 폼 상태
- When: 로그인 버튼 클릭
- Then: 이메일 및 비밀번호 필수 입력 에러 메시지가 폼 하단에 즉시 표시된다 (Zod 런타임 검사).

**Scenario 3: 잘못된 자격 증명**
- Given: 틀린 비밀번호 입력
- When: 로그인 시도
- Then: "Invalid credentials" 에러 메시지가 화면에 명확히 표시된다.

## :gear: Technical & Non-Functional Constraints
- **UI 라이브러리:** shadcn/ui Form 컴포넌트 필수 사용 — CON-09
- **검증:** Zod 기반 클라이언트 사이드 유효성 검증
- **접근성:** 키보드 네비게이션 및 ARIA 라벨 지원 (shadcn/ui 기본)
- **에러 핸들링:** NextAuth.js `signIn` 메서드의 반환 에러 객체를 적절히 파싱하여 사용자에게 피드백
- **Phase:** Phase 1

## :checkered_flag: Definition of Done (DoD)
- [ ] 로그인 폼 UI가 모바일과 데스크톱에서 정상적으로 렌더링되는가?
- [ ] Zod를 통한 클라이언트 사이드 검증이 작동하는가?
- [ ] NextAuth.js의 `signIn` 함수가 정상적으로 연동되었는가?
- [ ] 로그인 성공 후 권한에 따른 분기 라우팅이 정상 동작하는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** NextAuth 설정, UI 플로우, JWT role 처리의 경계를 분리해 인증 실패와 권한 실패를 서로 다른 결과로 검증한다.
- **추가 Edge Cases:** 만료/변조 토큰, 잘못된 role, 빈 세션, 이미 로그인한 사용자의 로그인/회원가입 접근을 포함한다.
- **검증 증거:** `npm run lint`, 인증 관련 unit/integration test, 보호 라우트 수동 점검 결과를 작업 코멘트에 남긴다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** AUTH-001 (NextAuth.js 설정 완료), INFRA-001 (shadcn/ui 설정)
- **Blocks:** 실제 Guardian / Admin Dashboard 사용 테스트
