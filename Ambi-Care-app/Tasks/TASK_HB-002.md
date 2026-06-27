---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] HB-002: updateDeviceStatus Server Action 구현"
labels: 'feature, server-action, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [HB-002] `app/actions/devices.ts` — `updateDeviceStatus` Server Action 구현
- 목적: HB-001 Route Handler에서 호출할 단일 상태 변경 함수를 제공하여 `SensorDevice.lastHeartbeatAt`, `status`, 선택적 `firmwareVersion` 갱신을 일관되게 처리한다.
- 범위: Prisma update 로직, 입력/출력 타입, 미등록 디바이스 처리, 직렬화 가능한 결과 반환. Route 인증은 HB-001 책임이다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- API Spec: [`/TASKs/all/TASK_API-008.md`](./TASK_API-008.md) — `updateDeviceStatus` 인터페이스 정의
- Route Handler: [`/TASKs/all/TASK_HB-001.md`](./TASK_HB-001.md) — Heartbeat API 호출부
- DB Model: [`/TASKs/all/TASK_DB-001.md`](./TASK_DB-001.md) — `SensorDevice` 모델
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — SA #4
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — HB-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/actions/devices.ts` 파일 생성 또는 기존 파일 확장
- [ ] 파일 상단에 `'use server'` 선언
- [ ] 입력 타입 정의:
  ```typescript
  interface UpdateDeviceStatusInput {
    deviceId: string
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
    lastHeartbeatAt?: Date
    firmwareVersion?: string
  }
  ```
- [ ] 반환 타입 정의:
  ```typescript
  type UpdateDeviceStatusResult =
    | { success: true; device: { id: string; status: string; lastHeartbeatAt: string | null; firmwareVersion: string } }
    | { success: false; error: { code: 'DEVICE_NOT_FOUND' | 'VALIDATION_ERROR' | 'DATABASE_ERROR'; message: string } }
  ```
- [ ] `deviceId` 공백/빈 문자열 방어
- [ ] 허용되지 않는 status 값 방어. `OFFLINE`은 저장하지 않고 오프라인 상태는 `INACTIVE`로 표현
- [ ] Prisma `sensorDevice.update` 호출:
  - `where: { id: deviceId }`
  - `data.status` 갱신
  - `lastHeartbeatAt`이 제공되면 해당 값으로 갱신
  - `firmwareVersion`이 제공되면 함께 갱신
- [ ] Prisma `P2025` 또는 record not found 오류를 `DEVICE_NOT_FOUND`로 변환
- [ ] 기타 DB 오류는 `DATABASE_ERROR`로 변환하되 상세 connection string/secret은 노출하지 않음
- [ ] 반환 객체의 Date는 ISO 문자열로 변환해 Next.js Server Action 직렬화 이슈 방지

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 상태 업데이트 성공**
- Given: 등록된 `deviceId`
- When: `updateDeviceStatus({ deviceId, status: "ACTIVE", lastHeartbeatAt: now })`를 호출함
- Then: DB의 `status`와 `lastHeartbeatAt`이 갱신되고 `{ success: true }`를 반환한다.

**Scenario 2: INACTIVE 전환**
- Given: 15분 이상 하트비트가 없는 활성 디바이스
- When: `updateDeviceStatus({ deviceId, status: "INACTIVE" })`를 호출함
- Then: DB의 `status`가 `"INACTIVE"`로 저장된다.

**Scenario 3: 미등록 디바이스**
- Given: 존재하지 않는 `deviceId`
- When: Action을 호출함
- Then: throw가 라우트까지 전파되지 않고 `{ success: false, error.code: "DEVICE_NOT_FOUND" }`를 반환한다.

**Scenario 4: 직렬화 가능한 반환값**
- Given: Prisma가 Date 객체를 반환함
- When: Action 결과를 생성함
- Then: `lastHeartbeatAt`은 ISO 문자열 또는 `null`로 반환된다.

## :gear: Technical & Non-Functional Constraints
- **DB 접근:** Prisma Client 싱글턴(`lib/prisma.ts`)을 사용한다.
- **상태 용어:** SRS 기준 `ACTIVE`, `INACTIVE`, `MAINTENANCE`만 저장한다.
- **Plain Object:** Server Action 반환값에 Date, Error, Prisma 객체 원본을 직접 포함하지 않는다.
- **멱등성:** 같은 `deviceId`에 같은 status를 반복 업데이트해도 성공해야 한다.
- **보안:** DB 오류 원문에 secret이 포함될 수 있으므로 사용자 응답에는 표준 코드/메시지만 반환한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] `updateDeviceStatus` 입력/반환 타입이 명확히 정의되었는가?
- [ ] 정상 update, 미등록 device, validation error, DB error 분기가 구현되었는가?
- [ ] `lastHeartbeatAt` 반환값이 ISO 문자열로 직렬화되는가?
- [ ] `OFFLINE` 또는 `lastSeenAt` 같은 비표준 필드를 사용하지 않는가?
- [ ] HB-001 Route Handler와 TEST-006이 같은 응답 구조를 기준으로 동작하는가?

## :construction: Dependencies & Blockers
- **Depends on:** API-008, DB-001, DB-007
- **Blocks:** HB-001, HB-004, TEST-006, TEST-017
- **참고:** HB-003의 조회 함수와 HB-004의 일괄 업데이트 함수도 같은 `app/actions/devices.ts`에 둘 수 있지만, 외부에서 재사용하기 쉽도록 함수 경계를 분리한다.
