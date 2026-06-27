---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-008: [Unit] NextAuth.js JWT 인증 테스트"
labels: 'test, backend, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-008] NextAuth.js JWT 인증 흐름 단위 테스트
- 목적: AUTH-001~003에서 구현한 NextAuth.js 설정이 이메일/패스워드 로그인, JWT 발급, 역할(role) 클레임 포함, 미들웨어 보호를 올바르게 처리하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js 설정
- 테스트 대상: [`/TASKs/TASK_AUTH-002.md`](./TASK_AUTH-002.md) — JWT + 역할 클레임
- 테스트 대상: [`/TASKs/TASK_AUTH-003.md`](./TASK_AUTH-003.md) — 미들웨어 보호
- SRS 섹션: §4.2 Authentication, §6.1.2 JWT
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-008

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/auth/nextauth.test.ts`
- [ ] NextAuth.js `signIn` handler Mock 설정
- [ ] JWT `encode`/`decode` 유틸리티 테스트
- [ ] 테스트 케이스:
  - 올바른 이메일/패스워드 → JWT 발급, `role` 클레임 포함 확인
  - 잘못된 패스워드 → 인증 실패 (`null` 반환)
  - JWT 페이로드에 `role: "GUARDIAN"` 포함 확인
  - JWT 페이로드에 `role: "ADMIN"` 포함 확인
  - 만료된 JWT → 세션 무효화
  - 보호 경로 미인증 접근 → `/login` 리다이렉트

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 올바른 자격증명 → JWT 발급**
- Given: 등록된 이메일/패스워드
- When: `signIn` 호출
- Then: JWT 발급, `sub`, `email`, `role` 클레임 포함

**Scenario 2: 잘못된 자격증명 → 실패**
- Given: 잘못된 패스워드
- When: `signIn` 호출
- Then: `null` 반환, JWT 미발급

**Scenario 3: 보호 경로 미인증 → 리다이렉트**
- Given: JWT 없음
- When: `/dashboard` 접근
- Then: `/login`으로 리다이렉트

## :gear: Technical & Non-Functional Constraints
- **테스트 격리:** Prisma Mock + NextAuth Mock 사용
- **JWT 검증:** `@auth/core` 또는 `next-auth` 내부 encode/decode 사용
- **역할 클레임:** GUARDIAN, ADMIN 두 가지 역할 모두 테스트

## :checkered_flag: Definition of Done (DoD)
- [ ] 로그인 성공/실패, JWT 클레임, 미들웨어 리다이렉트 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] role 클레임 GUARDIAN/ADMIN 두 가지 검증?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.
- **리뷰 체크포인트:**
  - 구현 파일 경로가 Task Breakdown과 일치하는지 확인한다.
  - 실패 케이스가 Acceptance Criteria 또는 테스트에 반영되었는지 확인한다.
  - SRS 금지어 및 PII 노출 규칙을 재확인한다.
  - 외부 서비스 의존성이 mock/fallback으로 검증 가능한지 확인한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_AUTH-001, TASK_AUTH-002, TASK_AUTH-003
- **Blocks:** 없음
