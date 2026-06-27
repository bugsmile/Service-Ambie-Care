---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-007: POST /api/mock/generate — Mock 이벤트 자동 생성 API 규격"
labels: 'feature, api-spec, mock, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [API-007] [Phase 0] POST `/api/mock/generate` — Mock 이벤트 자동 생성 API Request/Response 규격 정의
- 목적: Edge 센서 없이 프론트엔드 개발 및 데모를 진행하기 위한 Mock 이벤트 자동 생성 API의 계약을 정의하여, 개발자/데모 진행자가 버튼 하나로 테스트 데이터를 생성할 수 있는 인터페이스를 확립한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`app/api/mock/generate/route.ts`)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Seed Script / Event Generation API
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sample Mock Data
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#NEW-06`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock Data Generator 역량
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-007

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] Request DTO:
  ```typescript
  interface MockGenerateRequest {
    deviceId?: string           // 특정 디바이스 지정 (미지정 시 전체)
    days?: number               // 생성할 일수 (기본: 1, 최대: 7)
    eventsPerDay?: number       // 일별 이벤트 수 (기본: 288 = 5분 간격)
    includeReports?: boolean    // DailyReport도 함께 생성 (기본: false)
  }
  ```
- [ ] Response DTO:
  ```typescript
  // 200 OK
  interface MockGenerateResponse {
    success: true
    data: {
      eventsCreated: number
      reportsCreated: number
      deviceIds: string[]
      dateRange: { from: string, to: string }
    }
  }
  // 400 Bad Request — 유효하지 않은 파라미터
  interface MockGenerateErrorResponse {
    success: false
    error: { code: "VALIDATION_ERROR", message: string }
  }
  ```
- [ ] 인증: API Key 또는 개발 환경 전용 (`NODE_ENV !== "production"` 가드 고려)
- [ ] eventType 분포: ACTIVITY_ALERT 95%, WELLNESS_SCORE 4%, EMERGENCY 1% — §14.1
- [ ] HTTP: `200 OK`, `400 Bad Request`, `401 Unauthorized`

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 기본 Mock 이벤트 생성**
- Given: 3개 디바이스가 등록됨
- When: `POST /api/mock/generate` (body 없음)
- Then: `200 OK`, 디바이스당 288개 × 3 = 864개 이벤트가 생성된다.

**Scenario 2: 특정 디바이스 + 7일치 생성**
- Given: `dev-001` 지정, `days: 7`
- When: `POST /api/mock/generate { deviceId: "dev-001", days: 7 }`
- Then: 288 × 7 = 2,016개 이벤트가 `dev-001`에 대해 생성된다.

**Scenario 3: DailyReport 동시 생성**
- Given: `includeReports: true`
- When: Mock 생성 요청
- Then: WellnessEvent와 함께 DailyReport도 생성되고, `reportsCreated > 0`.

**Scenario 4: 프로덕션 환경 보호**
- Given: `NODE_ENV=production`
- When: Mock 생성 요청
- Then: `403 Forbidden` 또는 비활성화되어 프로덕션 데이터 오염 방지.

## :gear: Technical & Non-Functional Constraints
- **환경 보호:** 프로덕션 환경에서는 비활성화 권장
- **이벤트 분포:** §14.1 준수 (ACTIVITY_ALERT 95%, WELLNESS_SCORE 4%, EMERGENCY 1%)
- **성능:** 대량 생성 시 `createMany()` 배치 사용, Vercel 10초 타임아웃 내 완료
- **Phase:** Phase 0

## :checkered_flag: Definition of Done (DoD)
- [ ] Request/Response DTO 타입 정의 완료
- [ ] eventType 분포 규격 정의
- [ ] 프로덕션 환경 보호 규격 정의
- [ ] DailyReport 동시 생성 옵션 규격 정의

## :construction: Dependencies & Blockers
- **Depends on:** API-001 (Event Ingest DTO — 이벤트 구조 참조), MOCK-001 (기본 Seed 데이터)
- **Blocks:** MOCK-004 (Mock 자동 생성 모드 구현)
