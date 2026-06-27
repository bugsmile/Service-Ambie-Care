---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-002: GET /api/reports/daily/[deviceId]/[date] — Response DTO + 에러 코드 정의"
labels: 'feature, api-spec, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [API-002] [Phase 1] GET `/api/reports/daily/[deviceId]/[date]` — Response DTO (sleepScore, bathroomVisitCount, anomalyFlags, statusCode, aiSummary) + 에러 코드 정의 (404 Not Found, 403 Forbidden)
- 목적: Guardian이 특정 디바이스의 특정 날짜 일간 보고서를 조회하는 API의 계약을 정의하여, B2C Guardian Portal에서 수면 점수, 화장실 방문 횟수, AI 요약, 이상 징후 정보를 표시할 수 있는 데이터 인터페이스를 확립한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #2: GET `/api/reports/daily/[deviceId]/[date]` (Phase 1)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — API Endpoint List
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — DailyReport 모델 필드
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-016~020`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — FR-05: Daily Wellness Report 기능 요구사항
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-011`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — JWT 인증 (NextAuth.js)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — AI Summary (aiSummary 필드)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-04`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 금지어 네이밍 규칙
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] URL 파라미터 규격 정의:
  - `deviceId`: SensorDevice.id (cuid 문자열)
  - `date`: 날짜 문자열 (형식: `YYYY-MM-DD`, 예: `2026-04-21`)
- [ ] Response DTO 타입 정의 (`types/api.ts` 또는 `types/reports.ts`):
  ```typescript
  // 200 OK — 보고서 조회 성공
  interface DailyReportResponse {
    success: true
    data: {
      id: string                   // DailyReport.id
      deviceId: string             // 디바이스 ID
      date: string                 // "YYYY-MM-DD"
      sleepScore: number | null    // 0~100, null if INSUFFICIENT_DATA
      bathroomVisitCount: number | null  // null if INSUFFICIENT_DATA
      anomalyFlags: string[]       // 파싱된 JSON 배열 (서버에서 파싱하여 전달)
      statusCode: string           // "NORMAL" | "INSUFFICIENT_DATA" | "SENSOR_ERROR"
      aiSummary: string | null     // Gemini AI 서술 or null
      generatedAt: string          // ISO 8601 datetime
    }
  }

  // 404 Not Found — 해당 날짜 보고서 미존재
  interface ReportNotFoundResponse {
    success: false
    error: {
      code: "NOT_FOUND"
      message: "Daily report not found for the specified device and date"
    }
  }

  // 403 Forbidden — 타 사용자 디바이스 접근
  interface ForbiddenResponse {
    success: false
    error: {
      code: "FORBIDDEN"
      message: "You do not have access to this device"
    }
  }

  // 401 Unauthorized — JWT 미제공/만료
  interface UnauthorizedResponse {
    success: false
    error: {
      code: "UNAUTHORIZED"
      message: "Authentication required"
    }
  }
  ```
- [ ] 인증 규격 정의:
  - 인증 방식: JWT (NextAuth.js) — `Authorization: Bearer <JWT_TOKEN>`
  - JWT 검증: NextAuth.js `getServerSession()` 또는 `getToken()` 사용
  - 권한 확인: 요청자의 UserDevice 연결 확인 (해당 deviceId에 접근 권한이 있는지)
- [ ] 에러 코드 매핑:
  - `200 OK`: 보고서 정상 조회
  - `404 Not Found`: 해당 (deviceId, date) 조합 보고서 미존재
  - `403 Forbidden`: JWT 사용자가 해당 디바이스에 연결되지 않음 (UserDevice 테이블 확인)
  - `401 Unauthorized`: JWT 미제공 또는 만료/무효
  - `400 Bad Request`: date 형식 유효하지 않음
- [ ] `anomalyFlags` 처리 규격 — DB에 JSON 문자열로 저장, API 응답에서는 파싱된 `string[]` 배열로 전달
- [ ] 금지어 검증 — Response 필드명에 `diagnosis`, `medical`, `patient` 미사용 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상적인 보고서 조회**
- Given: `dev-001`의 `2026-04-21` DailyReport가 DB에 존재하고, 요청자가 해당 디바이스에 접근 권한이 있음
- When: `GET /api/reports/daily/dev-001/2026-04-21`로 JWT와 함께 요청함
- Then: `200 OK`와 함께 sleepScore, bathroomVisitCount, anomalyFlags, statusCode, aiSummary를 포함한 응답을 반환한다.

**Scenario 2: 존재하지 않는 보고서 조회**
- Given: `dev-001`의 `2026-04-30` 보고서가 DB에 존재하지 않음
- When: `GET /api/reports/daily/dev-001/2026-04-30`로 요청함
- Then: `404 Not Found`와 함께 `{ code: "NOT_FOUND" }` 에러를 반환한다.

**Scenario 3: 타 사용자 디바이스 접근 시도**
- Given: 요청자(`guardian1@demo.com`)가 `dev-003`에 연결되지 않음 (UserDevice 미존재)
- When: `GET /api/reports/daily/dev-003/2026-04-21`로 요청함
- Then: `403 Forbidden`과 함께 `{ code: "FORBIDDEN" }` 에러를 반환한다.

**Scenario 4: JWT 미인증 접근**
- Given: Authorization 헤더가 없음
- When: `GET /api/reports/daily/dev-001/2026-04-21`로 요청함
- Then: `401 Unauthorized`를 반환한다.

**Scenario 5: INSUFFICIENT_DATA 상태 보고서 조회**
- Given: statusCode가 `INSUFFICIENT_DATA`인 보고서가 존재함
- When: 해당 보고서를 조회함
- Then: `sleepScore: null`, `bathroomVisitCount: null`, `statusCode: "INSUFFICIENT_DATA"`가 포함된 응답을 반환한다.

## :gear: Technical & Non-Functional Constraints
- **인증:** JWT (NextAuth.js) — REQ-NF-011
- **접근 제어:** UserDevice 테이블을 통한 디바이스 접근 권한 확인 (MVP 수준, Phase 2에서 RBAC 미들웨어로 강화)
- **URL 파라미터:** Next.js App Router 동적 라우트 — `[deviceId]`, `[date]`
- **날짜 형식:** `YYYY-MM-DD` — URL-safe하고 명확한 형식
- **anomalyFlags 변환:** DB String → API Response Array (서버에서 JSON.parse 수행)
- **성능:** p95 ≤ 5,000ms (cold start 허용) — REQ-NF-001
- **금지어:** CON-04 준수
- **Phase:** Phase 1

## :checkered_flag: Definition of Done (DoD)
- [ ] URL 파라미터(deviceId, date) 규격이 정의되었는가?
- [ ] Response DTO (200/404/403/401) 타입이 정의되었는가?
- [ ] JWT 인증 방식이 명확히 문서화되었는가?
- [ ] UserDevice 기반 접근 제어 규칙이 정의되었는가?
- [ ] HTTP 상태 코드 매핑이 완료되었는가?
- [ ] anomalyFlags String → Array 변환 규격이 문서화되었는가?
- [ ] 금지어가 DTO에 포함되지 않는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-005 (DailyReport 모델 — Response DTO 필드 매핑 기준)
- **Blocks:** RPT-001 (Daily Report 조회 Route Handler 구현), RPT-002~005 (Guardian 대시보드/보고서 UI), TEST-004 (Daily Report 조회 API 테스트)
- **참고:** 이 API는 Guardian Portal의 핵심 데이터 소스입니다. aiSummary 필드는 Phase 2에서 Gemini AI로 생성되지만, Phase 1에서는 Mock 데이터(하드코딩된 요약)가 반환됩니다.
