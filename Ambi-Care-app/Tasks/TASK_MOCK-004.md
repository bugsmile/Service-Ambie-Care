---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] MOCK-004: POST /api/events/ingest — mock=true 자동 생성 모드 구현"
labels: 'feature, mock-data, priority:medium, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [MOCK-004] POST `/api/events/ingest` — `mock=true` 파라미터 시 자동 생성 모드 구현 (프론트엔드 개발용 Mocking API)
- 목적: 기존 Event Ingest API에 `mock=true` 쿼리 파라미터를 추가하여, 외부 도구(Postman, curl) 없이도 프론트엔드 개발자가 브라우저에서 즉시 Mock 이벤트를 생성할 수 있는 편의 기능을 제공한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Event Generation API: `mock=true` 사양
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #1: POST `/api/events/ingest`
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — MOCK-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/events/ingest/route.ts`에 `mock=true` 쿼리 파라미터 분기 추가
- [ ] Mock 모드 동작 정의:
  ```
  POST /api/events/ingest?mock=true
  → Request Body 불필요 (자동 생성)
  → 랜덤 디바이스 선택
  → eventType 분포에 따라 랜덤 이벤트 1건 생성
  → 201 Created 반환
  ```
- [ ] Mock 이벤트 자동 생성 필드:
  - `deviceId`: DB에서 ACTIVE 디바이스 중 랜덤 선택
  - `eventType`: 확률 분포(95/4/1)에 따라 랜덤
  - `timestamp`: 현재 시각
  - `confidenceScore`: 0.6~1.0 랜덤
  - `zone`: "BEDROOM"
  - `integrityHash`: 자동 SHA-256 생성
- [ ] 프로덕션 보호: `NODE_ENV === "production"` 시 `mock=true` 비활성화 (400 반환)
- [ ] API Key 인증: Mock 모드에서도 API Key 유지 또는 개발 환경 전용 면제 결정
- [ ] Response에 `mock: true` 플래그 포함 — Mock 데이터임을 명시

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: mock=true 자동 이벤트 생성**
- Given: ACTIVE 디바이스가 DB에 존재함
- When: `POST /api/events/ingest?mock=true` (body 없이) 요청
- Then: `201 Created`와 함께 자동 생성된 이벤트 정보가 반환되고, `mock: true` 플래그가 포함된다.

**Scenario 2: mock=false (일반 모드) 영향 없음**
- Given: `mock` 파라미터가 없거나 `false`
- When: `POST /api/events/ingest` 요청
- Then: 기존 API-001 규격대로 Request Body 유효성 검증이 수행된다.

**Scenario 3: 프로덕션 환경 보호**
- Given: `NODE_ENV=production`
- When: `POST /api/events/ingest?mock=true` 요청
- Then: `400 Bad Request` 또는 `403 Forbidden` — Mock 모드 비활성화.

**Scenario 4: eventType 분포 확인**
- Given: mock=true로 100건을 연속 생성함
- When: 생성된 이벤트의 eventType을 집계함
- Then: ACTIVITY_ALERT ≈ 95%, WELLNESS_SCORE ≈ 4%, EMERGENCY ≈ 1% 분포를 근사한다.

## :gear: Technical & Non-Functional Constraints
- **기존 API 무영향:** `mock` 파라미터 미제공 시 API-001 규격 그대로 동작
- **프로덕션 보호:** 프로덕션에서 Mock 데이터 생성 차단 필수
- **Phase:** Phase 0

## :checkered_flag: Definition of Done (DoD)
- [ ] `mock=true` 파라미터로 자동 이벤트 생성이 동작하는가?
- [ ] 기존 일반 모드에 영향이 없는가?
- [ ] 프로덕션 환경에서 Mock 모드가 차단되는가?
- [ ] Response에 `mock: true` 플래그가 포함되는가?
- [ ] 생성된 이벤트의 eventType 분포가 SRS §14.1과 일치하는가?

## :construction: Dependencies & Blockers
- **Depends on:** API-001 (Event Ingest DTO 규격), MOCK-001 (기본 디바이스 Seed 데이터)
- **Blocks:** 프론트엔드 개발 시 실시간 Mock 데이터 생성 편의
- **참고:** MOCK-004는 "인터랙티브 Mock" 기능으로, Seed 기반 정적 데이터(MOCK-001~003)와 상호 보완적입니다. 프론트엔드 개발 중 실시간으로 이벤트를 추가하여 대시보드 갱신을 테스트할 때 활용됩니다.
