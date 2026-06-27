---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] HB-004: 15분 이상 Heartbeat 미수신 시 디바이스 INACTIVE 상태 업데이트"
labels: 'feature, mutation, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [HB-004] [Command] 15분 이상 Heartbeat 미수신 디바이스를 `INACTIVE`로 전환
- 목적: HB-003에서 식별한 오프라인 후보를 실제 DB 상태에 반영하여 Dashboard Traffic Light RED 표시, Guardian 이메일 알림, 운영 Slack 알림의 단일 상태 기준을 제공한다.
- 범위: 일괄 상태 변경, 변경 결과 반환, 후속 알림 task가 사용할 변경 대상 목록 제공. 알림 전송 자체는 EMAIL-003/OPS-002 범위다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 후보 조회: [`/TASKs/all/TASK_HB-003.md`](./TASK_HB-003.md) — 15분 초과 미수신 디바이스 식별
- 상태 업데이트 Action: [`/TASKs/all/TASK_HB-002.md`](./TASK_HB-002.md) — `updateDeviceStatus`
- Dashboard API: [`/TASKs/all/TASK_API-003.md`](./TASK_API-003.md) — RED 판정 기준
- Email Alert: [`/TASKs/all/TASK_EMAIL-003.md`](./TASK_EMAIL-003.md) — Guardian 오프라인 알림
- Ops Alert: [`/TASKs/all/TASK_OPS-002.md`](./TASK_OPS-002.md) — 오프라인 비율 10% 이상 알림
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-008`](../../SRS-Draft/SRS_V03(ENG_OPUS).md)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — HB-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `markInactiveHeartbeatDevices` Command 함수 구현
- [ ] HB-003의 `findInactiveHeartbeatDevices({ now, thresholdMinutes: 15 })` 호출
- [ ] 후보가 0건이면 DB update 없이 `{ success: true, updatedCount: 0, devices: [] }` 반환
- [ ] 후보 device id 배열에 대해 Prisma `updateMany` 실행:
  - `where: { id: { in: ids }, status: "ACTIVE" }`
  - `data: { status: "INACTIVE" }`
- [ ] race condition 방지를 위해 update 조건에 `status: "ACTIVE"`를 다시 포함
- [ ] 변경 대상 목록은 HB-003 결과 기준으로 반환하되 `updatedCount`와 함께 제공
- [ ] 동일 디바이스 반복 실행 시 이미 `INACTIVE`이면 재업데이트/중복 알림 대상이 되지 않도록 처리
- [ ] 호출 위치 결정:
  - MVP 1순위: Dashboard status API(DASH-001) 또는 periodic route에서 호출
  - Cron 기반 호출은 PIPE-007/INFRA-003과 충돌하지 않게 분리
- [ ] EMAIL-003/OPS-002가 중복 알림 방지를 구현할 수 있도록 `transitionedAt` 또는 상태 변경 시각 전달 방식을 검토

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: INACTIVE 전환**
- Given: HB-003 결과에 20분 이상 하트비트가 없는 `ACTIVE` 디바이스가 포함됨
- When: `markInactiveHeartbeatDevices()`를 실행함
- Then: 해당 디바이스의 `status`가 `"INACTIVE"`로 업데이트되고 `updatedCount`가 1 이상이다.

**Scenario 2: 후보 없음**
- Given: 모든 활성 디바이스가 15분 이내 하트비트를 보냄
- When: Command를 실행함
- Then: `updateMany`가 호출되지 않거나 0건 업데이트되고 성공 결과를 반환한다.

**Scenario 3: 이미 INACTIVE인 디바이스 중복 처리 방지**
- Given: 이전 실행에서 이미 `INACTIVE`로 전환된 디바이스
- When: Command를 다시 실행함
- Then: 해당 디바이스는 업데이트 대상과 알림 후보에 포함되지 않는다.

**Scenario 4: Dashboard RED 기준 반영**
- Given: 디바이스가 `INACTIVE`로 전환됨
- When: DASH-001의 `/api/dashboard/status`를 조회함
- Then: API-003 규격에 따라 해당 디바이스는 RED로 판정 가능하다.

## :gear: Technical & Non-Functional Constraints
- **상태 값:** 오프라인 상태는 DB에 `"INACTIVE"`로 저장한다. `"OFFLINE"`은 사용하지 않는다.
- **필드명:** 마지막 하트비트 필드는 `lastHeartbeatAt`이다. `lastSeenAt` 사용 금지
- **배치 업데이트:** 여러 디바이스는 `updateMany`로 처리하되, 알림용 세부 정보는 HB-003 조회 결과를 재사용한다.
- **동시성:** Heartbeat 수신과 INACTIVE 전환이 동시에 발생할 수 있으므로 update 조건에 `status: "ACTIVE"`와 후보 id를 함께 둔다.
- **알림 분리:** 이메일/Slack 호출은 이 task에서 직접 수행하지 않고 EMAIL-003/OPS-002가 담당한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] HB-003 후보 조회와 HB-004 상태 변경이 함수 경계로 분리되었는가?
- [ ] `updateMany`가 `ACTIVE` 후보만 `INACTIVE`로 전환하는가?
- [ ] 후보 0건, 중복 실행, race condition 시나리오가 안전한가?
- [ ] 반환값에 `updatedCount`와 후속 알림용 device 목록이 포함되는가?
- [ ] TEST-017 통합 테스트가 `INACTIVE`, `lastHeartbeatAt` 기준으로 작성될 수 있는가?

## :construction: Dependencies & Blockers
- **Depends on:** HB-003, HB-002, DB-007
- **Blocks:** EMAIL-003, OPS-002, TEST-017, DASH-001 정확도 개선
- **참고:** 실제 알림 중복 방지는 별도 상태 필드가 없으면 이메일/운영 알림 task에서 최근 발송 로그 또는 메모리/DB 기반 dedupe 정책을 정의해야 한다.
