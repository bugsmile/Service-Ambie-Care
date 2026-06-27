---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] RPT-001: GET /api/reports/daily/[deviceId]/[date] — 일간 보고서 조회 API"
labels: 'feature, backend, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [RPT-001] Daily Report 조회 API 라우트 핸들러 구현
- 목적: Guardian(보호자)이 특정 디바이스의 특정 날짜에 대한 일간 웰니스 보고서(수면 점수, 화장실 방문 횟수, 이상 징후, AI 요약)를 조회할 수 있도록, `GET /api/reports/daily/[deviceId]/[date]` 라우트 핸들러를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #2 Daily Report
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 1 Core UI
- API 계약: [`/TASKs/TASK_API-002.md`](./TASK_API-002.md) — Response DTO 및 에러 코드 정의
- 데이터 모델: [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md) — DailyReport 모델
- 데이터 모델: [`/TASKs/TASK_DB-001.md`](./TASK_DB-001.md) — SensorDevice 모델
- 인증: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js JWT
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — RPT-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/reports/daily/[deviceId]/[date]/route.ts` 파일 생성
- [ ] `date` 경로 파라미터 유효성 검증 — `YYYY-MM-DD` 형식 파싱, 유효하지 않은 날짜 포맷 시 400 반환
- [ ] NextAuth.js `getServerSession()` 으로 JWT 인증 검증 — 미인증 시 401 반환
- [ ] 소유권 검증 — `UserDevice` 조인 테이블 조회로 `session.user.id`와 `deviceId`의 연결 여부 확인, 미일치 시 403 반환
- [ ] Prisma 쿼리 — `dailyReport.findFirst({ where: { deviceId, date: parsedDate } })`
- [ ] 보고서 없음 처리 — `null` 결과 시 404 Not Found 반환
- [ ] Response DTO 조립 — `{ deviceId, date, sleepScore, bathroomVisitCount, anomalyFlags, statusCode, aiSummary }` 반환
- [ ] `date` 파라미터를 `Date` 객체로 변환 시 타임존 주의 — UTC 기준 처리

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 유효한 보고서 조회**
- Given: 인증된 Guardian, 소유 디바이스 `deviceId`, 보고서가 존재하는 `date` (예: `2026-04-21`)
- When: `GET /api/reports/daily/{deviceId}/2026-04-21` 요청
- Then: 200 OK와 함께 `sleepScore`, `bathroomVisitCount`, `anomalyFlags`, `statusCode`, `aiSummary` 필드가 포함된 JSON을 반환한다.

**Scenario 2: 보고서 미존재 날짜 조회**
- Given: 인증된 Guardian, 유효한 `deviceId`, 보고서가 없는 `date`
- When: `GET /api/reports/daily/{deviceId}/{date}` 요청
- Then: 404 Not Found와 `{ error: "Report not found" }` 를 반환한다.

**Scenario 3: 타 사용자 디바이스 접근**
- Given: 인증된 Guardian이 자신이 소유하지 않은 `deviceId`로 요청
- When: `GET /api/reports/daily/{otherDeviceId}/{date}` 요청
- Then: 403 Forbidden과 `{ error: "Access denied" }` 를 반환한다.

**Scenario 4: 인증 미제공**
- Given: JWT 세션 없이 요청
- When: `GET /api/reports/daily/{deviceId}/{date}` 요청
- Then: 401 Unauthorized를 반환한다.

**Scenario 5: 잘못된 날짜 포맷**
- Given: `date` 파라미터가 `"not-a-date"` 형식
- When: 해당 URL로 요청
- Then: 400 Bad Request와 `{ error: "Invalid date format. Use YYYY-MM-DD" }` 를 반환한다.

## :gear: Technical & Non-Functional Constraints
- **성능:** p95 ≤ 5,000ms (Serverless cold start 허용) — REQ-NF-001
- **보안:** `deviceId` 소유권 서버 사이드 검증 필수 — REQ-NF-011 (Guardian은 자신의 디바이스만 조회 가능)
- **타임존:** `date` 파라미터는 `YYYY-MM-DD` (UTC 날짜 기준) 처리 — `new Date(date + 'T00:00:00.000Z')` 패턴
- **에러 응답:** 일관된 `{ error: string }` 형식 유지

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `deviceId` 소유권 검증이 서버 사이드에서 수행되는가?
- [ ] 200/400/401/403/404 모든 응답 코드가 올바르게 반환되는가?
- [ ] `date` 파라미터의 타임존 처리가 일관되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?
- [ ] TASK_TEST-004 (Daily Report 조회 API 테스트)가 통과하는가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_API-002 (Response DTO), TASK_DB-005 (DailyReport 모델), TASK_DB-007 (마이그레이션 배포), TASK_AUTH-001 (NextAuth.js JWT)
- **Blocks:** TASK_RPT-002 (Guardian 홈 대시보드 UI), TASK_RPT-003 (일간 보고서 상세 페이지), TASK_TEST-004 (API 테스트)
- **참고:** `DailyReport` 레코드는 Phase 2의 `PIPE-006` (`generateDailyReport` Server Action)에 의해 생성된다. Phase 1에서는 MOCK-003의 시드 데이터로 테스트한다.
