---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] AUTH-001: NextAuth.js 기본 설정 — JWT 싱글 인증 구성 + 데모 자격 증명"
labels: 'feature, auth, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [AUTH-001] NextAuth.js 기본 설정 — `lib/auth.ts` JWT 싱글 인증 구성 + 데모 자격 증명
- 목적: 애플리케이션 전반의 인증을 관리하기 위해 NextAuth.js(v4 또는 v5)를 도입하고, JWT 기반의 세션 관리와 데모용 Credentials Provider를 설정하여 로그인 기능의 기반을 마련한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-011`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — JWT Authentication (NextAuth.js)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-07`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — C-TEC-002: NextAuth.js for Next.js App Router
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#RISK-10`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Security misconfiguration risk
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock UserAccounts (guardian1, guardian2, admin)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AUTH-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 패키지 설치: `npm install next-auth` (App Router 호환 버전 확인, 필요시 `@auth/prisma-adapter` 추가 검토이나 MVP는 Session DB 미사용)
- [ ] 환경 변수 검증 (`.env.local`): `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 설정 확인 (INFRA-004 완료 전제)
- [ ] `lib/auth.ts` (또는 `auth.ts`) 생성 및 NextAuth 설정 정의:
  - `session: { strategy: "jwt" }` 설정 (필수 - 단일 노드/Serverless 환경)
  - `providers`: `CredentialsProvider` 설정
- [ ] Credentials Provider 인증 로직 구현:
  - 이메일과 비밀번호(데모용 고정 비밀번호 예: `password123`)를 입력받아 Prisma `UserAccount` 테이블에서 사용자 조회
  - 비밀번호 해싱 라이브러리(bcrypt 등) 사용(권장) 또는 MVP 단순화를 위한 평문 비교(보안 경고 주석 필수)
- [ ] `callbacks` 구현:
  - `jwt({ token, user })`: 로그인 성공 시 DB의 `UserAccount.id`, `role` 등을 JWT 토큰에 추가
  - `session({ session, token })`: JWT 토큰의 `id`, `role` 등을 클라이언트 `session.user` 객체로 전달
- [ ] `app/api/auth/[...nextauth]/route.ts` API Route Handler 생성
- [ ] TypeScript 타입 확장: `types/next-auth.d.ts` 파일을 생성하여 `Session`과 `User` 인터페이스에 `id`, `role` 속성 추가

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상적인 데모 계정 로그인**
- Given: MOCK-001로 생성된 `guardian1@demo.com` 계정이 존재함
- When: 올바른 비밀번호로 로그인 API를 호출함
- Then: JWT가 포함된 세션이 정상 생성되고, 세션 객체에 `user.id`와 `user.role`이 포함된다.

**Scenario 2: 존재하지 않는 계정 로그인 시도**
- Given: DB에 없는 이메일 주소로 시도
- When: 로그인 요청
- Then: 인증 실패(null 반환) 처리된다.

**Scenario 3: 세션 정보 접근 가능성**
- Given: 로그인된 사용자의 서버 컴포넌트
- When: `getServerSession(authOptions)`을 호출함
- Then: JWT에서 디코딩된 유효한 세션 객체가 반환된다.

## :gear: Technical & Non-Functional Constraints
- **Session Strategy:** 반드시 `jwt` 사용 (Serverless 환경에서 상태 비저장 유지) — REQ-NF-011
- **Role 기반 제어 대비:** JWT payload에 `role` (GUARDIAN, FACILITY_ADMIN) 정보를 포함하여 향후 RBAC에 대비
- **보안 위험:** 데모 환경이라도 `NEXTAUTH_SECRET`은 복잡한 문자열 사용 — RISK-10
- **Phase:** Phase 1

## :checkered_flag: Definition of Done (DoD)
- [ ] `next-auth` 패키지가 설치되고 `[...nextauth]/route.ts`가 구성되었는가?
- [ ] `lib/auth.ts`에 JWT 기반 `authOptions`가 정의되었는가?
- [ ] Prisma를 통한 Credentials 검증 로직이 포함되었는가?
- [ ] JWT 및 Session Callback이 구현되었는가?
- [ ] `next-auth.d.ts`를 통한 타입 확장이 완료되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** NextAuth 설정, UI 플로우, JWT role 처리의 경계를 분리해 인증 실패와 권한 실패를 서로 다른 결과로 검증한다.
- **추가 Edge Cases:** 만료/변조 토큰, 잘못된 role, 빈 세션, 이미 로그인한 사용자의 로그인/회원가입 접근을 포함한다.
- **검증 증거:** `npm run lint`, 인증 관련 unit/integration test, 보호 라우트 수동 점검 결과를 작업 코멘트에 남긴다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** DB-003 (UserAccount 스키마), MOCK-001 (테스트용 사용자 데이터), INFRA-004 (환경 변수)
- **Blocks:** AUTH-002 (Login UI), AUTH-003 (Register UI), RPT-001 (JWT 보호된 API), DASH-001 (JWT 보호된 API)
