---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] AUTH-003: Register 페이지 UI — shadcn/ui Form 적용"
labels: 'feature, ui, auth, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [AUTH-003] Register 페이지 UI — `app/(auth)/register/page.tsx` (shadcn/ui Form 컴포넌트)
- 목적: 신규 Guardian 사용자가 회원 가입할 수 있는 화면을 구현한다. (MVP에서는 복잡한 승인 절차 없이 기본 회원 가입 흐름 제공)

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`app/(auth)/register/page.tsx`)
- UI Constraint: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-09`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Tailwind CSS + shadcn/ui
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AUTH-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/(auth)/register/page.tsx` 생성
- [ ] Zod 스키마 정의:
  - `name` (필수, 2자 이상)
  - `email` (올바른 이메일 형식)
  - `password` (최소 6자 이상)
  - `confirmPassword` (비밀번호 확인, 일치 여부 검사)
- [ ] shadcn/ui Form 컴포넌트로 UI 조립
- [ ] onSubmit 핸들러 구현:
  - `POST /api/auth/register` (또는 해당하는 Server Action) 호출하여 사용자 생성
  - 에러 처리 (이미 존재하는 이메일 등)
  - 성공 시 `signIn`을 자동으로 호출하거나, Login 페이지로 리다이렉트
- [ ] `app/api/auth/register/route.ts` (또는 Server Action) 구현 (DB-003 UserAccount에 insert)
- [ ] UI에 로그인 페이지로 돌아가는 링크("Already have an account?") 추가

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 성공적인 회원 가입**
- Given: 중복되지 않는 새 이메일 주소
- When: 올바른 형식의 회원 정보를 입력하고 제출함
- Then: UserAccount 레코드가 DB에 생성되고 로그인 페이지로 리다이렉트(또는 자동 로그인) 된다.

**Scenario 2: 이메일 중복 가입 시도**
- Given: 이미 가입된 이메일(`guardian1@demo.com`)
- When: 가입 시도함
- Then: "Email already exists" 에러가 명확히 폼에 표시된다.

**Scenario 3: 비밀번호 불일치**
- Given: `password`와 `confirmPassword`가 다름
- When: Submit 시도
- Then: 클라이언트 단 Zod 검증에서 즉시 에러가 표시되고 서버 요청이 방지된다.

## :gear: Technical & Non-Functional Constraints
- **비밀번호 저장:** MVP 단순화 과정에서도 비밀번호는 해시화(bcryptjs)하여 저장 필수 (보안 최소 요건)
- **가입 역할:** 기본적으로 신규 가입자는 `GUARDIAN` 역할 부여
- **Phase:** Phase 1

## :checkered_flag: Definition of Done (DoD)
- [ ] Register Form UI가 완성되었는가?
- [ ] Zod 스키마 유효성 검사(비밀번호 일치 포함)가 동작하는가?
- [ ] DB에 정상적으로 사용자가 삽입되고, 비밀번호가 해시화되어 저장되는가?
- [ ] 중복 이메일 예외 처리가 작동하는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** NextAuth 설정, UI 플로우, JWT role 처리의 경계를 분리해 인증 실패와 권한 실패를 서로 다른 결과로 검증한다.
- **추가 Edge Cases:** 만료/변조 토큰, 잘못된 role, 빈 세션, 이미 로그인한 사용자의 로그인/회원가입 접근을 포함한다.
- **검증 증거:** `npm run lint`, 인증 관련 unit/integration test, 보호 라우트 수동 점검 결과를 작업 코멘트에 남긴다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** AUTH-001, DB-003
- **Blocks:** None (신규 사용자 가입 테스트 가능)
