---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-004: POST /api/devices/[deviceId]/heartbeat — Request/Response DTO + API Key 인증 규격"
labels: 'feature, api-spec, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [API-004] [Phase 1] POST `/api/devices/[deviceId]/heartbeat` — Request DTO (healthStatus) + Response DTO (200/404) + API Key 인증 규격
- 목적: 센서 디바이스(MVP에서는 Mock)로부터 주기적인 하트비트 신호를 수신하는 API의 계약을 정의하여, 디바이스 생존 상태 모니터링과 Traffic Light 대시보드의 실시간 상태 반영 기반을 마련한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #6: POST `/api/devices/[deviceId]/heartbeat` (Phase 1)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Action #4: `updateDeviceStatus`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — SensorDevice 모델 (lastHeartbeatAt, status)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-008`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 15분 초과 하트비트 미수신 시 INACTIVE 전환
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Heartbeat Monitoring Sequence
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] URL 파라미터 규격 정의:
  - `deviceId`: SensorDevice.id (cuid 문자열)
- [ ] Request DTO 타입 정의:
  ```typescript
  interface HeartbeatRequest {
    healthStatus?: string    // 선택: "OK" | "DEGRADED" | "ERROR" (미제공 시 "OK")
    firmwareVersion?: string // 선택: 현재 펌웨어 버전 (변경 감지용)
  }
  ```
- [ ] Response DTO 타입 정의:
  ```typescript
  // 200 OK — 하트비트 수신 성공
  interface HeartbeatResponse {
    success: true
    deviceId: string
    lastHeartbeatAt: string    // 업데이트된 시각 (ISO 8601)
    status: string             // 현재 디바이스 상태
  }

  // 404 Not Found — 미등록 디바이스
  interface DeviceNotFoundResponse {
    success: false
    error: {
      code: "DEVICE_NOT_FOUND"
      message: "Device not registered"
    }
  }

  // 401 Unauthorized — API Key 인증 실패
  interface UnauthorizedResponse {
    success: false
    error: {
      code: "UNAUTHORIZED"
      message: "Invalid or missing API key"
    }
  }
  ```
- [ ] API Key 인증 규격 — `x-api-key` 헤더 기반 (디바이스→서버 통신, JWT 아님)
- [ ] HTTP 상태 코드 매핑:
  - `200 OK`: 하트비트 정상 수신, `lastHeartbeatAt` 업데이트
  - `404 Not Found`: `deviceId`에 해당하는 디바이스 미존재
  - `401 Unauthorized`: API Key 미제공/불일치
- [ ] 하트비트 수신 시 서버 동작 정의:
  - `SensorDevice.lastHeartbeatAt` → 현재 시각으로 업데이트
  - `SensorDevice.status` → `"ACTIVE"` (INACTIVE → ACTIVE 복구 포함)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상적인 하트비트 수신**
- Given: `dev-001` 디바이스가 DB에 등록되어 있고 유효한 API Key가 제공됨
- When: `POST /api/devices/dev-001/heartbeat`로 요청함
- Then: `200 OK`와 함께 `lastHeartbeatAt`이 현재 시각으로 업데이트되고, `status: "ACTIVE"`를 반환한다.

**Scenario 2: 미등록 디바이스 하트비트**
- Given: `dev-999` 디바이스가 DB에 존재하지 않음
- When: `POST /api/devices/dev-999/heartbeat`로 요청함
- Then: `404 Not Found`와 함께 `{ code: "DEVICE_NOT_FOUND" }` 에러를 반환한다.

**Scenario 3: INACTIVE 디바이스 복구**
- Given: `dev-001`이 `INACTIVE` 상태이고 하트비트가 수신됨
- When: `POST /api/devices/dev-001/heartbeat`로 요청함
- Then: `status`가 `"ACTIVE"`로 변경되고, `lastHeartbeatAt`이 업데이트된다.

**Scenario 4: API Key 미인증**
- Given: `x-api-key` 헤더가 없음
- When: `POST /api/devices/dev-001/heartbeat`로 요청함
- Then: `401 Unauthorized`를 반환한다.

## :gear: Technical & Non-Functional Constraints
- **인증:** API Key (환경 변수 비교) — 디바이스→서버 통신이므로 JWT 아닌 API Key 사용
- **하트비트 주기:** Edge 디바이스에서 5분 간격 전송 예상 (MVP: Mock/수동 테스트)
- **상태 전환:** 하트비트 수신 시 무조건 `ACTIVE` + `lastHeartbeatAt` 갱신
- **15분 룰:** 15분 초과 미수신 시 `INACTIVE` 전환은 별도 로직(HB-003/004)에서 처리
- **Phase:** Phase 1

## :checkered_flag: Definition of Done (DoD)
- [ ] URL 파라미터(deviceId) 규격이 정의되었는가?
- [ ] Request/Response DTO 타입이 정의되었는가?
- [ ] API Key 인증 방식이 문서화되었는가?
- [ ] HTTP 상태 코드 매핑(200/404/401)이 완료되었는가?
- [ ] 하트비트 수신 시 서버 동작이 명확히 정의되었는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 (SensorDevice 모델)
- **Blocks:** HB-001 (Heartbeat Route Handler 구현), HB-002 (updateDeviceStatus Server Action), HB-003/004 (15분 초과 미수신 감지)
