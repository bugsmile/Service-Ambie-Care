---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] HB-001: POST /api/devices/[deviceId]/heartbeat/route.ts — API Route Handler 구현"
labels: 'feature, api, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [HB-001] POST `/api/devices/[deviceId]/heartbeat/route.ts` 구현
- 목적: API-004 계약을 구현하여 센서 디바이스의 하트비트를 수신하고, API Key 인증 후 `updateDeviceStatus` Server Action을 호출해 `SensorDevice.lastHeartbeatAt`과 `status`를 즉시 갱신한다.
- 범위: Route Handler, 요청 인증/검증, Server Action 호출, 표준 JSON 응답 매핑. 15분 미수신 감지 및 INACTIVE 일괄 전환은 HB-003/HB-004 범위로 분리한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- API Spec: [`/TASKs/all/TASK_API-004.md`](./TASK_API-004.md) — `POST /api/devices/[deviceId]/heartbeat` DTO 및 인증 규격
- Server Action Spec: [`/TASKs/all/TASK_API-008.md`](./TASK_API-008.md) — `updateDeviceStatus` 입출력 타입
- 구현 대상: [`/TASKs/all/TASK_HB-002.md`](./TASK_HB-002.md) — `updateDeviceStatus` Server Action
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #6
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Heartbeat Sequence
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — HB-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/devices/[deviceId]/heartbeat/route.ts` 파일 생성
- [ ] `POST` Route Handler export 구현
- [ ] `params.deviceId` 추출 및 빈 값/비문자열 값 검증
- [ ] `x-api-key` 헤더를 `DEVICE_API_KEY` 또는 프로젝트 표준 API Key 환경변수와 상수 시간 비교 방식으로 검증
- [ ] 요청 본문 파싱:
  - `healthStatus?: "OK" | "DEGRADED" | "ERROR"` 허용
  - `firmwareVersion?: string` 선택 갱신값으로 허용
  - 본문이 비어 있어도 정상 하트비트로 처리
- [ ] HB-002의 `updateDeviceStatus({ deviceId, status: "ACTIVE", lastHeartbeatAt: new Date(), firmwareVersion? })` 호출
- [ ] Action 결과를 HTTP 응답으로 매핑:
  - 성공: `200 OK` + `{ success: true, deviceId, status, lastHeartbeatAt }`
  - 미등록 디바이스: `404 Not Found` + `DEVICE_NOT_FOUND`
  - 인증 실패: `401 Unauthorized` + `UNAUTHORIZED`
  - 검증 실패: `400 Bad Request` + `VALIDATION_ERROR`
- [ ] INACTIVE였던 디바이스가 하트비트를 보내면 `ACTIVE`로 복구되도록 status 업데이트를 강제
- [ ] `NextResponse.json()`으로 모든 응답을 직렬화 가능한 plain object로 반환
- [ ] 서버 로그에는 `deviceId`, 결과 코드, 처리 시간만 남기고 API Key/원문 payload는 기록하지 않음

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 하트비트 처리**
- Given: 등록된 `deviceId`와 올바른 `x-api-key`가 제공됨
- When: `POST /api/devices/{deviceId}/heartbeat` 요청을 보냄
- Then: `200 OK`와 함께 `lastHeartbeatAt` ISO 문자열, `status: "ACTIVE"`를 반환하고 DB 업데이트 Action이 1회 호출된다.

**Scenario 2: INACTIVE 디바이스 복구**
- Given: DB에 `status: "INACTIVE"`인 디바이스가 존재함
- When: 유효한 Heartbeat 요청을 보냄
- Then: `status`가 `"ACTIVE"`로 변경되고 `lastHeartbeatAt`이 현재 시각으로 갱신된다.

**Scenario 3: 미등록 디바이스**
- Given: DB에 존재하지 않는 `deviceId`
- When: 유효한 API Key로 Heartbeat 요청을 보냄
- Then: `404 Not Found`와 `{ code: "DEVICE_NOT_FOUND" }`를 반환한다.

**Scenario 4: API Key 누락 또는 불일치**
- Given: `x-api-key` 헤더가 없거나 잘못됨
- When: Heartbeat 요청을 보냄
- Then: Server Action을 호출하지 않고 `401 Unauthorized`를 반환한다.

**Scenario 5: 잘못된 healthStatus**
- Given: `healthStatus: "BROKEN"` 요청 본문
- When: 유효한 API Key로 Heartbeat 요청을 보냄
- Then: `400 Bad Request`와 `VALIDATION_ERROR`를 반환한다.

## :gear: Technical & Non-Functional Constraints
- **인증 방식:** 디바이스→서버 통신은 JWT가 아닌 API Key(`x-api-key`) 사용
- **경로 규격:** `/api/heartbeat`가 아니라 `/api/devices/[deviceId]/heartbeat`를 사용한다.
- **상태 필드:** `OFFLINE` 또는 `lastSeenAt`을 쓰지 않는다. SRS/DB 기준 필드는 `status: "ACTIVE" | "INACTIVE" | "MAINTENANCE"`, `lastHeartbeatAt`이다.
- **성능:** 5분 주기 다수 디바이스 호출을 고려해 라우트 내 DB 작업은 HB-002 Action 1회로 제한한다.
- **보안:** API Key, 환경변수, 원문 요청 body를 로그에 남기지 않는다.
- **분리 원칙:** 15분 초과 미수신 디바이스 조회/전환은 HB-003/HB-004에서 처리한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] `app/api/devices/[deviceId]/heartbeat/route.ts`가 생성되었는가?
- [ ] `x-api-key` 인증 성공/실패 분기가 구현되었는가?
- [ ] `deviceId`, `healthStatus`, optional `firmwareVersion` 검증이 적용되었는가?
- [ ] 성공 시 `updateDeviceStatus`를 호출하고 `lastHeartbeatAt`, `status`를 반환하는가?
- [ ] 200/400/401/404 응답 포맷이 API-004와 일치하는가?
- [ ] `/api/heartbeat`, `lastSeenAt`, `OFFLINE` 같은 구버전 명칭을 사용하지 않는가?
- [ ] TASK_TEST-006 Heartbeat API 테스트가 통과하는가?

## :construction: Dependencies & Blockers
- **Depends on:** API-004, API-008, DB-007, HB-002
- **Blocks:** HB-003, HB-004, TEST-006, PERF-002
- **주의:** 이 Route Handler에서 전체 디바이스 오프라인 스캔을 수행하면 호출 비용이 불필요하게 커질 수 있으므로, HB-003/HB-004에서 별도 유틸리티 또는 Dashboard 조회 시점으로 분리한다.
