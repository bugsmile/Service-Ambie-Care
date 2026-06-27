---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] HB-003: 15분 초과 Heartbeat 미수신 디바이스 식별 로직"
labels: 'feature, query, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [HB-003] [Query] 활성 디바이스의 `lastHeartbeatAt`을 확인하여 15분 초과 미수신 디바이스 식별
- 목적: REQ-FUNC-008의 15분 Heartbeat 미수신 규칙을 구현하기 위해, `ACTIVE` 상태이면서 기준 시각보다 오래된 디바이스를 조회하는 순수 Query 함수를 제공한다.
- 범위: 식별 Query와 반환 타입. 실제 `INACTIVE` 상태 변경은 HB-004에서 수행한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- DB Model: [`/TASKs/all/TASK_DB-001.md`](./TASK_DB-001.md) — `SensorDevice.lastHeartbeatAt`, `status`
- API Spec: [`/TASKs/all/TASK_API-003.md`](./TASK_API-003.md) — Dashboard status의 `lastHeartbeatAt`/RED 판정
- 상태 업데이트: [`/TASKs/all/TASK_HB-004.md`](./TASK_HB-004.md) — INACTIVE 전환
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Heartbeat Sequence
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-008`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 15분 초과 미수신 감지
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — HB-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/actions/devices.ts` 또는 `lib/devices/heartbeat.ts`에 `findInactiveHeartbeatDevices` 함수 구현
- [ ] 함수 입력 타입 정의:
  ```typescript
  interface FindInactiveHeartbeatDevicesInput {
    now?: Date
    thresholdMinutes?: number // default 15
  }
  ```
- [ ] 기준 시각 계산: `thresholdAt = new Date(now.getTime() - thresholdMinutes * 60_000)`
- [ ] Prisma Query 작성:
  - `status: "ACTIVE"`
  - `OR: [{ lastHeartbeatAt: null }, { lastHeartbeatAt: { lt: thresholdAt } }]`
  - `select: { id, locationZone, lastHeartbeatAt, status }`
- [ ] MVP 정책 결정: `lastHeartbeatAt: null`인 신규 디바이스도 감지 대상에 포함하되, 설치 직후 grace period가 필요하면 별도 후속 task로 분리
- [ ] 반환값은 id 배열만이 아니라 후속 알림/로그에 필요한 최소 메타데이터 포함
- [ ] 테스트 가능성을 위해 `now`를 주입 가능하게 설계
- [ ] 쿼리 결과가 0건인 경우 빈 배열을 반환하고 에러로 처리하지 않음

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 15분 초과 디바이스 감지**
- Given: `status: "ACTIVE"`, `lastHeartbeatAt`이 현재보다 20분 전인 디바이스
- When: `findInactiveHeartbeatDevices({ now })`를 실행함
- Then: 해당 디바이스가 결과에 포함된다.

**Scenario 2: 15분 이내 디바이스 제외**
- Given: `status: "ACTIVE"`, `lastHeartbeatAt`이 현재보다 5분 전인 디바이스
- When: Query를 실행함
- Then: 해당 디바이스는 결과에 포함되지 않는다.

**Scenario 3: 이미 INACTIVE인 디바이스 제외**
- Given: `status: "INACTIVE"`이고 `lastHeartbeatAt`이 오래된 디바이스
- When: Query를 실행함
- Then: 반복 전환/중복 알림 방지를 위해 결과에 포함되지 않는다.

**Scenario 4: 하트비트 기록이 없는 활성 디바이스**
- Given: `status: "ACTIVE"`, `lastHeartbeatAt: null`인 디바이스
- When: Query를 실행함
- Then: 오프라인 후보로 결과에 포함된다.

## :gear: Technical & Non-Functional Constraints
- **기준 필드:** `lastSeenAt`이 아니라 `lastHeartbeatAt` 사용
- **상태 값:** `OFFLINE`이 아니라 `INACTIVE` 전환 후보를 찾는다.
- **성능:** MVP 50개 디바이스 기준으로 가벼운 select만 수행한다. 대규모 확장 시 `(status, lastHeartbeatAt)` 인덱스 검토
- **재사용성:** Dashboard status 조회, Cron, 테스트에서 같은 함수를 재사용할 수 있게 `now`와 threshold를 파라미터화한다.
- **부작용 없음:** 이 task의 함수는 DB를 변경하지 않는다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 15분 threshold 계산이 테스트 가능한 방식으로 구현되었는가?
- [ ] `ACTIVE` + 오래된 `lastHeartbeatAt` 조건이 정확한가?
- [ ] 이미 `INACTIVE`인 디바이스를 제외하는가?
- [ ] 반환값이 HB-004/EMAIL-003/OPS-002에서 재사용 가능한 최소 정보를 포함하는가?
- [ ] TEST-017에서 정상/초과/이미 INACTIVE 케이스를 검증할 수 있는가?

## :construction: Dependencies & Blockers
- **Depends on:** HB-001, HB-002, DB-007
- **Blocks:** HB-004, EMAIL-003, OPS-002, TEST-017
- **주의:** 이 Query를 매 Heartbeat 요청마다 전체 스캔으로 실행하면 불필요한 부하가 생길 수 있다. MVP에서는 Dashboard polling 또는 daily/periodic job에서 호출하는 방식을 우선 고려한다.
