---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-005: POST /api/events/[eventId]/false-alarm — Request/Response DTO + JWT 인증 규격"
labels: 'feature, api-spec, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [API-005] [Phase 2] POST `/api/events/[eventId]/false-alarm` — Request DTO + Response DTO (200/404) + JWT 인증 규격
- 목적: Guardian이 잘못된 알림(False Alarm)을 피드백할 수 있는 API의 계약을 정의하여, PMF 핵심 지표(월 2건 이하 불만, REQ-NF-014)를 추적하고 AI 필터링 알고리즘 학습 데이터를 수집하는 기반을 마련한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #3: POST `/api/events/[eventId]/false-alarm`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Action #2: `updateFalseAlarmFlag`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — WellnessEvent.isFalseAlarm 필드
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-005`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — False Alarm 피드백 기능
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-014`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — PMF: ≤ 2 불만/집/월
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-005

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] URL 파라미터 규격: `eventId` — WellnessEvent.id (cuid)
- [ ] Request DTO:
  ```typescript
  interface FalseAlarmRequest {
    isFalseAlarm: boolean   // true: 오알람 표시, false: 오알람 해제
    reason?: string         // 선택: 피드백 사유 (Wave 2 학습용, MVP에서는 저장만)
  }
  ```
- [ ] Response DTO:
  ```typescript
  // 200 OK
  interface FalseAlarmResponse {
    success: true
    eventId: string
    isFalseAlarm: boolean
    updatedAt: string
  }
  // 404 Not Found
  interface EventNotFoundResponse {
    success: false
    error: { code: "EVENT_NOT_FOUND", message: "Event not found" }
  }
  // 403 Forbidden — 해당 디바이스에 접근 권한 없음
  interface ForbiddenResponse {
    success: false
    error: { code: "FORBIDDEN", message: "You do not have access to this event" }
  }
  ```
- [ ] 인증: JWT (NextAuth.js) — Guardian만 자신에게 연결된 디바이스의 이벤트에 피드백 가능
- [ ] 권한 확인: eventId → deviceId → UserDevice 테이블 확인
- [ ] HTTP 상태 코드: `200 OK`, `404 Not Found`, `403 Forbidden`, `401 Unauthorized`

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상적인 False Alarm 피드백**
- Given: Guardian이 자신에게 연결된 디바이스의 이벤트(`evt-001`)에 대해 피드백함
- When: `POST /api/events/evt-001/false-alarm` with `{ isFalseAlarm: true }`
- Then: `200 OK`, 해당 이벤트의 `isFalseAlarm`이 `true`로 업데이트된다.

**Scenario 2: 존재하지 않는 이벤트**
- Given: `evt-999`가 DB에 없음
- When: `POST /api/events/evt-999/false-alarm`
- Then: `404 Not Found`를 반환한다.

**Scenario 3: 타 사용자 디바이스 이벤트 피드백 시도**
- Given: Guardian-1이 Guardian-2에게만 연결된 디바이스의 이벤트에 피드백 시도
- When: False alarm 요청
- Then: `403 Forbidden`을 반환한다.

**Scenario 4: False Alarm 해제 (토글)**
- Given: 이미 `isFalseAlarm: true`인 이벤트가 존재함
- When: `{ isFalseAlarm: false }`로 요청함
- Then: `isFalseAlarm`이 `false`로 복원된다.

## :gear: Technical & Non-Functional Constraints
- **인증:** JWT (NextAuth.js) — REQ-NF-011
- **접근 제어:** Event → Device → UserDevice 체인으로 권한 확인
- **PMF 메트릭:** `isFalseAlarm` 집계를 통한 월별 불만 건수 추적 — REQ-NF-014
- **Phase:** Phase 2

## :checkered_flag: Definition of Done (DoD)
- [ ] Request/Response DTO 타입 정의 완료
- [ ] JWT 인증 + UserDevice 기반 권한 확인 규격 정의
- [ ] HTTP 상태 코드 매핑 완료
- [ ] isFalseAlarm 토글(true↔false) 동작 규격 정의

## :construction: Dependencies & Blockers
- **Depends on:** DB-002 (WellnessEvent — isFalseAlarm 필드)
- **Blocks:** FA-001 (False Alarm Route Handler 구현), FA-002 (updateFalseAlarmFlag Server Action), TEST-003 (False Alarm API 테스트)
