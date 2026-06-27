---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-001: [Unit] Event Ingestion 유효성 검증 테스트"
labels: 'test, backend, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-001] POST /api/events/ingest 유효성 검증 단위 테스트
- 목적: Event Ingestion API(EVT-001)의 API Key 인증 및 요청 페이로드 유효성 검증 로직이 각 에러 케이스에 대해 올바른 HTTP 상태 코드를 반환하는지 단위 테스트로 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_EVT-001.md`](./TASK_EVT-001.md) — POST /api/events/ingest
- API 계약: [`/TASKs/TASK_API-001.md`](./TASK_API-001.md) — Request DTO + 인증 규격
- SRS 섹션: AC of API-001, REQ-FUNC-001 (MVP: mock)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일 생성: `__tests__/api/events/ingest.test.ts`
- [ ] 테스트 프레임워크 설정 확인 — Jest + `@testing-library/jest-dom` 또는 Vitest
- [ ] `next/server`의 `NextRequest` Mocking 설정
- [ ] 테스트 케이스 작성:
  - API Key 미전송 → 401
  - 잘못된 API Key → 401
  - 유효한 API Key + 필수 필드 누락 → 400
  - `eventType` 허용되지 않는 값 → 400
  - `confidenceScore` 범위 외(< 0 또는 > 1) → 400
  - 유효한 요청 → 201 Created
- [ ] Prisma Client Mock 설정 (`jest.mock('@/lib/prisma')`)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: API Key 미전송 → 401**
- Given: `Authorization` 헤더 없음
- When: POST /api/events/ingest 요청
- Then: 401 Unauthorized 반환.

**Scenario 2: 필수 필드 누락 → 400**
- Given: `eventType` 필드 없는 요청 본문
- When: 유효한 API Key와 함께 요청
- Then: 400 Bad Request 반환.

**Scenario 3: 유효하지 않은 eventType → 400**
- Given: `eventType: "UNKNOWN_TYPE"`
- When: 유효한 API Key와 함께 요청
- Then: 400 Bad Request 반환.

**Scenario 4: 정상 요청 → 201**
- Given: 유효한 API Key + 올바른 페이로드 (`eventType`, `confidenceScore`, `zone`, `integrityHash`)
- When: POST /api/events/ingest 요청
- Then: 201 Created 반환.

## :gear: Technical & Non-Functional Constraints
- **테스트 격리:** Prisma DB 실제 연결 없이 Mock 사용
- **테스트 프레임워크:** Jest 또는 Vitest — 프로젝트 설정에 따름
- **실행:** `npm test` 또는 `npm run test:unit`으로 실행 가능

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Scenario가 테스트 케이스로 구현되었는가?
- [ ] 모든 테스트가 통과하는가 (`npm test` GREEN)?
- [ ] Prisma Mock이 실제 DB를 호출하지 않는가?
- [ ] 테스트 커버리지: EVT-001 라우트 핸들러 핵심 분기 100%

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_EVT-001 (구현 완료 후 테스트 작성)
- **Blocks:** 없음
