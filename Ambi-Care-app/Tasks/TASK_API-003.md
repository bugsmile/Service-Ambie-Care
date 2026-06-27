---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-003: GET /api/dashboard/status — Response DTO + JWT 인증 규격 정의"
labels: 'feature, api-spec, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [API-003] [Phase 1] GET `/api/dashboard/status` — Response DTO (devices[]: {id, status, locationZone, lastHeartbeatAt, latestEvent}) + JWT 인증 규격
- 목적: B2B Monitoring Dashboard에서 다중 침대(디바이스)의 실시간 상태를 Traffic Light(Red/Yellow/Green) 방식으로 표시하기 위한 API 계약을 정의하여, 30초 간격 API Polling 기반 대시보드의 데이터 인터페이스를 확립한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #5: GET `/api/dashboard/status` (Phase 1)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — API Endpoint List
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-011`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Traffic Light 다중 침대 모니터링 UI
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — B2B Monitoring Dashboard (API Polling 30s)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#GAP-01`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Real-time gap → API Polling 대안
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — SensorDevice 모델 (status, lastHeartbeatAt)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — WellnessEvent 모델 (latestEvent 정보)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Fall Detection → Dashboard 업데이트 Sequence
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-011`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — JWT 인증
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-04`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 금지어 네이밍 규칙
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] Response DTO 타입 정의 (`types/api.ts` 또는 `types/dashboard.ts`):
  ```typescript
  // 200 OK — 대시보드 상태 조회 성공
  interface DashboardStatusResponse {
    success: true
    data: {
      devices: DeviceStatus[]
      totalCount: number
      activeCount: number
      inactiveCount: number
      lastUpdated: string           // 서버 응답 시각 (ISO 8601)
    }
  }

  interface DeviceStatus {
    id: string                      // SensorDevice.id
    locationZone: string            // "BEDROOM" (MVP 고정)
    status: string                  // "ACTIVE" | "INACTIVE" | "MAINTENANCE"
    lastHeartbeatAt: string | null  // ISO 8601 datetime or null
    trafficLight: string            // "GREEN" | "YELLOW" | "RED" (계산된 값)
    latestEvent: LatestEvent | null // 가장 최근 이벤트 정보
  }

  interface LatestEvent {
    id: string                      // WellnessEvent.id
    eventType: string               // "ACTIVITY_ALERT" | "WELLNESS_SCORE" | "EMERGENCY"
    timestamp: string               // ISO 8601 datetime
    confidenceScore: number         // 0.0 ~ 1.0
  }

  // 401 Unauthorized
  interface UnauthorizedResponse {
    success: false
    error: {
      code: "UNAUTHORIZED"
      message: "Authentication required"
    }
  }
  ```
- [ ] Traffic Light 색상 매핑 규칙 정의:
  - 🟢 **GREEN**: `status === "ACTIVE"` AND `lastHeartbeatAt` within 15분 AND 최근 이벤트가 EMERGENCY가 아님
  - 🟡 **YELLOW**: `status === "ACTIVE"` AND (`lastHeartbeatAt` 5~15분 경과 OR 최근 이벤트가 `WELLNESS_SCORE`)
  - 🔴 **RED**: `status === "INACTIVE"` OR `lastHeartbeatAt` 15분 초과 OR 최근 이벤트가 `EMERGENCY`
- [ ] 인증 규격 정의:
  - JWT (NextAuth.js) — `Authorization: Bearer <JWT_TOKEN>`
  - `getServerSession()` 또는 `getToken()`으로 세션 검증
  - MVP Core: 인증된 모든 사용자 접근 허용 (Phase 2에서 FACILITY_ADMIN 역할 제한)
- [ ] 쿼리 규격 정의:
  ```
  Prisma Query:
  prisma.sensorDevice.findMany({
    include: {
      wellnessEvents: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      }
    }
  })
  ```
- [ ] HTTP 상태 코드 매핑:
  - `200 OK`: 전체 디바이스 상태 정상 조회
  - `401 Unauthorized`: JWT 미제공/만료
- [ ] Polling 관련 규격:
  - 클라이언트에서 30초 간격으로 이 API를 호출 (GAP-01 대안)
  - Response에 `lastUpdated` 타임스탬프 포함하여 데이터 신선도 확인 가능
- [ ] 금지어 검증 — Response 필드명에 규제 키워드 미사용 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상적인 대시보드 상태 조회**
- Given: JWT로 인증된 사용자가 존재하고, DB에 3개 디바이스가 등록됨
- When: `GET /api/dashboard/status`로 요청함
- Then: `200 OK`와 함께 3개 디바이스의 상태(id, status, trafficLight, latestEvent)를 포함한 배열이 반환된다.

**Scenario 2: Traffic Light GREEN 매핑**
- Given: 디바이스가 `ACTIVE` 상태이고 5분 전에 하트비트를 전송했으며 최근 이벤트가 `ACTIVITY_ALERT`임
- When: 대시보드 상태를 조회함
- Then: 해당 디바이스의 `trafficLight`이 `"GREEN"`으로 반환된다.

**Scenario 3: Traffic Light RED 매핑**
- Given: 디바이스가 `INACTIVE` 상태이거나 15분 이상 하트비트가 없음
- When: 대시보드 상태를 조회함
- Then: 해당 디바이스의 `trafficLight`이 `"RED"`로 반환된다.

**Scenario 4: Traffic Light RED (EMERGENCY 이벤트)**
- Given: 디바이스의 최근 이벤트가 `EMERGENCY` 타입임
- When: 대시보드 상태를 조회함
- Then: 해당 디바이스의 `trafficLight`이 `"RED"`로 반환된다.

**Scenario 5: JWT 미인증 접근**
- Given: Authorization 헤더가 없음
- When: `GET /api/dashboard/status`로 요청함
- Then: `401 Unauthorized`를 반환한다.

**Scenario 6: latestEvent null 처리**
- Given: 디바이스가 등록되었으나 아직 이벤트가 수신되지 않음
- When: 대시보드 상태를 조회함
- Then: 해당 디바이스의 `latestEvent`이 `null`로 반환되고, `trafficLight`은 `"YELLOW"` (데이터 미수신 상태)로 설정된다.

## :gear: Technical & Non-Functional Constraints
- **인증:** JWT (NextAuth.js) — REQ-NF-011
- **Polling 간격:** 클라이언트 30초 — GAP-01 (Supabase Realtime 대안, Phase 2에서 전환 예정)
- **성능:** p95 ≤ 5,000ms (cold start 허용) — REQ-NF-001
- **디바이스 수:** < 50개 — REQ-NF-018
- **Traffic Light 계산:** 서버 사이드에서 계산하여 클라이언트에 전달 (계산 로직 중앙화)
- **금지어:** CON-04 준수
- **Phase:** Phase 1
- **Realtime 전환:** Phase 2에서 Supabase Realtime subscription으로 전환 예정 (DEP-04)

## :checkered_flag: Definition of Done (DoD)
- [ ] Response DTO (200/401) 타입이 정의되었는가?
- [ ] Traffic Light (GREEN/YELLOW/RED) 매핑 규칙이 명확히 정의되었는가?
- [ ] JWT 인증 방식이 문서화되었는가?
- [ ] DeviceStatus 내 latestEvent 포함 규격이 정의되었는가?
- [ ] Prisma 쿼리 패턴이 명시되었는가?
- [ ] Polling 관련 규격(30초 간격, lastUpdated)이 정의되었는가?
- [ ] HTTP 상태 코드 매핑이 완료되었는가?
- [ ] 금지어가 DTO에 포함되지 않는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 (SensorDevice 모델), DB-002 (WellnessEvent 모델 — latestEvent 조회)
- **Blocks:** DASH-001 (Dashboard Status Route Handler 구현), DASH-002 (Traffic Light 대시보드 UI), DASH-003 (API Polling 구현), DASH-004 (Traffic Light Card 컴포넌트), TEST-005 (Dashboard Status API 테스트), TEST-009 (Dashboard Polling 통합 테스트)
- **참고:** MVP Core에서는 API Polling(30초)으로 운영하고, Phase 2에서 Supabase Realtime으로 전환합니다(GAP-01). Traffic Light 색상 매핑 로직은 서버에서 계산하여 `trafficLight` 필드로 클라이언트에 전달하며, 클라이언트에서는 단순히 색상을 표시하기만 합니다.
