---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DASH-001: GET /api/dashboard/status — 전체 디바이스 상태 + 최신 이벤트 조회 API"
labels: 'feature, backend, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [DASH-001] B2B Dashboard Status Query API 구현
- 목적: 시설 관리자(FACILITY_ADMIN)가 전체 병실 디바이스의 실시간 상태와 최신 웰니스 이벤트를 한 번의 API 호출로 조회할 수 있도록, `GET /api/dashboard/status` 라우트 핸들러를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #5 Dashboard Status
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 1 Core UI
- API 계약: [`/TASKs/TASK_API-003.md`](./TASK_API-003.md) — Response DTO 정의
- 데이터 모델: [`/TASKs/TASK_DB-001.md`](./TASK_DB-001.md) — SensorDevice 모델
- 데이터 모델: [`/TASKs/TASK_DB-002.md`](./TASK_DB-002.md) — WellnessEvent 모델
- 인증 설정: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js JWT 설정
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DASH-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/dashboard/status/route.ts` 파일 생성
- [ ] NextAuth.js `getServerSession()` 호출로 JWT 인증 검증 — 미인증 시 401 반환
- [ ] Prisma `sensorDevice.findMany()` — 전체 디바이스 목록 조회 (`id`, `status`, `locationZone`, `lastHeartbeatAt`, `firmwareVersion` 필드 포함)
- [ ] 각 디바이스별 최신 WellnessEvent 조회 — `wellnessEvent.findFirst({ orderBy: { timestamp: 'desc' } })` + `deviceId` 조건
- [ ] Response DTO 조립 — `devices[]: { id, status, locationZone, lastHeartbeatAt, latestEvent: { eventType, timestamp, confidenceScore } }`
- [ ] 에러 처리 — Prisma 쿼리 실패 시 500 반환, 빈 디바이스 목록은 빈 배열(`[]`)로 200 반환
- [ ] `GET /api/dashboard/status` 응답 타입 (`DashboardStatusResponse`) TypeScript 인터페이스 정의 — `types/api.ts` 또는 인라인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 JWT로 대시보드 상태 조회**
- Given: 유효한 JWT 토큰을 가진 FACILITY_ADMIN 사용자로 인증됨
- When: `GET /api/dashboard/status`를 호출함
- Then: 200 OK와 함께 전체 디바이스 배열을 반환하며, 각 항목에 `id`, `status`, `locationZone`, `lastHeartbeatAt`, `latestEvent` 필드가 포함된다.

**Scenario 2: 인증 미제공 시 401 반환**
- Given: Authorization 헤더 또는 세션 쿠키 없이 요청함
- When: `GET /api/dashboard/status`를 호출함
- Then: 401 Unauthorized 상태 코드와 `{ error: "Unauthorized" }` 메시지를 반환한다.

**Scenario 3: 디바이스 없는 초기 상태**
- Given: DB에 SensorDevice 레코드가 0건임
- When: `GET /api/dashboard/status`를 호출함
- Then: 200 OK와 함께 `{ devices: [] }`를 반환한다.

**Scenario 4: latestEvent가 없는 디바이스**
- Given: 특정 디바이스에 아직 WellnessEvent가 없음
- When: `GET /api/dashboard/status`를 호출함
- Then: 해당 디바이스의 `latestEvent` 필드는 `null`로 반환된다.

## :gear: Technical & Non-Functional Constraints
- **인증:** NextAuth.js JWT 세션 검증 필수 — REQ-NF-011
- **성능:** p95 ≤ 5,000ms (Serverless cold start 허용) — REQ-NF-001
- **쿼리 최적화:** N+1 문제 방지 — `sensorDevice.findMany({ include: { wellnessEvents: { take: 1, orderBy: { timestamp: 'desc' } } } })` 사용 권장
- **응답 포맷:** `Content-Type: application/json`
- **에러 응답 포맷:** `{ error: string, code?: string }`

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] JWT 미제공 시 401, 정상 인증 시 200이 반환되는가?
- [ ] Prisma 관계 쿼리로 N+1 문제 없이 단일 쿼리로 처리되는가?
- [ ] TypeScript 타입 오류가 0건인가 (`npm run build` 통과)?
- [ ] ESLint 경고/에러가 0건인가?
- [ ] TASK_TEST-005 (Dashboard Status API 테스트)가 통과하는가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_API-003 (Response DTO 정의), TASK_DB-001 (SensorDevice), TASK_DB-002 (WellnessEvent), TASK_DB-007 (마이그레이션 배포), TASK_AUTH-001 (NextAuth.js)
- **Blocks:** TASK_DASH-002 (Dashboard UI), TASK_DASH-003 (API Polling), TASK_DASH-005 (이벤트 로그 조회)
- **참고:** 이 API는 Phase 1 B2B Dashboard의 데이터 공급원으로, DASH-002 UI 구현의 선행 조건이다.
