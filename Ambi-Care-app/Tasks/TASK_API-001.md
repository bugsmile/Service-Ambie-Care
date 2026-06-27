---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-001: POST /api/events/ingest — Request/Response DTO + API Key 인증 규격 정의"
labels: 'feature, api-spec, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [API-001] [Phase 0] POST `/api/events/ingest` — Request DTO (eventType, confidenceScore, zone, integrityHash) + Response DTO (201/400/401) + API Key 인증 규격 정의
- 목적: Edge 센서 시뮬레이터(MVP에서는 Mock 데이터)로부터 웰니스 이벤트를 수신하는 API의 계약(Contract)을 정의하여, 이벤트 수집 파이프라인의 입출력 인터페이스를 명확히 하고 후속 구현(EVT-001/002)의 기반을 마련한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #1: POST `/api/events/ingest` (Phase 0)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Action #1: `createWellnessEvent`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — API Endpoint List
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — WellnessEvent 모델 필드
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-04`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 금지어 네이밍 규칙
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock Event Generation (mock=true 파라미터)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Daily Report Generation Sequence (이벤트 수집 시작점)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] Request DTO 타입 정의 (`types/api.ts` 또는 `types/events.ts`):
  ```typescript
  // Request DTO
  interface EventIngestRequest {
    deviceId: string       // FK → SensorDevice.id (cuid)
    eventType: string      // "ACTIVITY_ALERT" | "WELLNESS_SCORE" | "EMERGENCY"
    timestamp: string      // ISO 8601 datetime string
    confidenceScore: number // 0.0 ~ 1.0
    zone?: string          // default: "BEDROOM" (MVP 고정)
    integrityHash: string  // SHA-256 hash string
  }
  ```
- [ ] Response DTO 타입 정의:
  ```typescript
  // 201 Created — 성공
  interface EventIngestResponse {
    success: true
    eventId: string      // 생성된 WellnessEvent.id (cuid)
    timestamp: string    // 서버 수신 시각
  }

  // 400 Bad Request — 유효성 검증 실패
  interface EventIngestErrorResponse {
    success: false
    error: {
      code: "VALIDATION_ERROR"
      message: string    // 구체적 에러 메시지
      details?: Record<string, string>  // 필드별 에러
    }
  }

  // 401 Unauthorized — API Key 미제공/불일치
  interface UnauthorizedResponse {
    success: false
    error: {
      code: "UNAUTHORIZED"
      message: "Invalid or missing API key"
    }
  }
  ```
- [ ] API Key 인증 규격 정의:
  - 인증 방식: Request Header `x-api-key` 또는 `Authorization: Bearer <API_KEY>`
  - API Key 소스: 환경 변수 `API_KEY` (`.env.local` 추가 필요)
  - 검증 로직: Header 값과 `process.env.API_KEY` 비교 (simple string match)
- [ ] 유효성 검증(Validation) 규칙 정의:
  - `deviceId`: 필수, 비어있지 않은 문자열
  - `eventType`: 필수, `["ACTIVITY_ALERT", "WELLNESS_SCORE", "EMERGENCY"]` 중 하나
  - `timestamp`: 필수, 유효한 ISO 8601 datetime
  - `confidenceScore`: 필수, 0.0 이상 1.0 이하의 숫자
  - `integrityHash`: 필수, 비어있지 않은 문자열
  - `zone`: 선택적, 미제공 시 `"BEDROOM"` 기본값
- [ ] HTTP 상태 코드 매핑:
  - `201 Created`: 이벤트 정상 수신 및 저장
  - `400 Bad Request`: 필수 필드 누락 또는 유효하지 않은 값
  - `401 Unauthorized`: API Key 미제공 또는 불일치
- [ ] `mock=true` 쿼리 파라미터 규격 정의 — §14.1 Mock 모드 자동 생성 (MOCK-004에서 구현)
- [ ] 금지어 검증 — Request/Response 필드명에 `diagnosis`, `medical`, `patient` 미사용 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상적인 이벤트 수신**
- Given: 유효한 API Key와 올바른 형식의 Request Body가 주어짐
- When: `POST /api/events/ingest`로 요청함
- Then: `201 Created`와 함께 `{ success: true, eventId: "clxxx...", timestamp: "..." }`을 반환한다.

**Scenario 2: API Key 미제공 시 인증 실패**
- Given: `x-api-key` 헤더가 없거나 빈 값임
- When: `POST /api/events/ingest`로 요청함
- Then: `401 Unauthorized`와 함께 `{ success: false, error: { code: "UNAUTHORIZED" } }`을 반환한다.

**Scenario 3: 필수 필드 누락 시 유효성 에러**
- Given: `eventType` 필드가 누락된 Request Body가 주어짐
- When: `POST /api/events/ingest`로 요청함
- Then: `400 Bad Request`와 함께 `{ success: false, error: { code: "VALIDATION_ERROR", details: { eventType: "Required" } } }`를 반환한다.

**Scenario 4: 유효하지 않은 eventType**
- Given: `eventType: "INVALID_TYPE"`이 포함된 Request Body가 주어짐
- When: `POST /api/events/ingest`로 요청함
- Then: `400 Bad Request`와 함께 eventType 관련 에러 메시지를 반환한다.

**Scenario 5: confidenceScore 범위 초과**
- Given: `confidenceScore: 1.5` (범위 초과)가 포함된 Request Body가 주어짐
- When: `POST /api/events/ingest`로 요청함
- Then: `400 Bad Request`와 함께 confidenceScore 범위 에러를 반환한다.

## :gear: Technical & Non-Functional Constraints
- **인증:** API Key 기반 (환경 변수) — JWT 아닌 간단한 키 비교 (디바이스 → 서버 통신)
- **Phase:** Phase 0 — 가장 먼저 구현되는 Route Handler
- **금지어:** CON-04 준수 — Request/Response에 `diagnosis`, `medical`, `patient` 사용 금지
- **Validation 라이브러리:** Zod 사용 권장 (타입 안정성 + 런타임 유효성 검증 통합)
- **Rate Limiting:** MVP에서는 미적용 (< 50 디바이스). Wave 2에서 100 req/min 제한 추가 예정
- **Content-Type:** `application/json` 필수
- **Serverless timeout:** Vercel Hobby 10초 이내 응답 — CON-13

## :checkered_flag: Definition of Done (DoD)
- [ ] Request DTO 타입이 TypeScript 인터페이스로 정의되었는가?
- [ ] Response DTO (201/400/401) 타입이 정의되었는가?
- [ ] API Key 인증 방식이 명확히 문서화되었는가?
- [ ] 유효성 검증 규칙이 각 필드별로 명세되었는가?
- [ ] HTTP 상태 코드 매핑이 완료되었는가?
- [ ] 금지어(diagnosis, medical, patient)가 DTO에 포함되지 않는가?
- [ ] mock=true 쿼리 파라미터 규격이 정의되었는가?
- [ ] Zod 스키마 또는 동등한 검증 라이브러리 적용 계획이 수립되었는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-002 (WellnessEvent 모델 — DTO 필드 매핑 기준)
- **Blocks:** EVT-001 (Route Handler 구현), EVT-002 (createWellnessEvent Server Action), API-007 (Mock 생성 API), MOCK-004 (mock=true 모드), TEST-001 (Event Ingestion 유효성 테스트)
- **참고:** 이 API는 MVP의 데이터 진입점(Entry Point)입니다. Edge 센서 대신 Mock 데이터를 수신하며, 전체 Daily Report 파이프라인(§3.4.1)의 시작점이 됩니다.
