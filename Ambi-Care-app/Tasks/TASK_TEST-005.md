---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-005: [Unit] Dashboard Status API 테스트"
labels: 'test, backend, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-005] GET /api/dashboard/status B2B Dashboard API 단위 테스트
- 목적: DASH-001에서 구현한 Dashboard Status API가 B2B 관리자 인증, 디바이스 상태 집계, Traffic Light 판정 로직을 올바르게 처리하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_DASH-001.md`](./TASK_DASH-001.md) — GET /api/dashboard/status
- API 계약: [`/TASKs/all/TASK_API-003.md`](./TASK_API-003.md) — Dashboard Status API 규격
- SRS 섹션: §5.1 B2B Dashboard, AC of API-003
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-005

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/api/dashboard/status.test.ts`
- [ ] Prisma Client Mock 설정
- [ ] NextAuth.js ADMIN 역할 세션 Mock 설정
- [ ] 테스트 케이스:
  - 미인증 요청 → 401
  - GUARDIAN 역할 요청 → 403 (ADMIN only)
  - 정상 요청, 디바이스 전체 `ACTIVE` + 최근 Heartbeat → 200 + GREEN 상태
  - `ACTIVE` 디바이스 중 최신 이벤트가 `WELLNESS_SCORE` 또는 주의 상태 → YELLOW 판정
  - `INACTIVE` 디바이스 또는 `lastHeartbeatAt` 15분 초과 → RED 판정
  - 빈 디바이스 목록 → 200 + 빈 배열
  - 응답 devices[]에 `{ id, status, locationZone, lastHeartbeatAt, latestEvent }` 포함 검증

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: ADMIN 인증, 전체 GREEN**
- Given: ADMIN 세션, 전체 디바이스가 `ACTIVE`이고 최근 15분 내 Heartbeat 존재
- When: GET /api/dashboard/status
- Then: 200 OK + `{ status: "GREEN", devices: [...] }`

**Scenario 2: ALERT 디바이스 존재 → YELLOW**
- Given: ADMIN 세션, 1개 이상 디바이스 ALERT 상태
- When: GET /api/dashboard/status
- Then: 200 OK + `{ status: "YELLOW", ... }`

**Scenario 3: INACTIVE 또는 Heartbeat 초과 → RED**
- Given: ADMIN 세션, `status: "INACTIVE"`이거나 `lastHeartbeatAt`이 15분을 초과한 디바이스 존재
- When: GET /api/dashboard/status
- Then: 200 OK + `{ status: "RED", ... }`

## :gear: Technical & Non-Functional Constraints
- **테스트 격리:** Prisma Mock 사용
- **역할 검증:** ADMIN vs GUARDIAN 역할 분기 테스트 포함
- **Traffic Light 로직:** API-003 기준 GREEN/YELLOW/RED 3가지 상태 모두 커버
- **상태 용어:** `OFFLINE`이 아니라 DB 표준 상태 `INACTIVE`를 사용

## :checkered_flag: Definition of Done (DoD)
- [ ] 인증/역할/상태 판정 6개 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] Traffic Light 3개 상태 분기 100% 커버?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DASH-001, TASK_API-003
- **Blocks:** 없음
