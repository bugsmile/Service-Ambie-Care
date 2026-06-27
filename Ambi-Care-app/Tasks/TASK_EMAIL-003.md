---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] EMAIL-003: 디바이스 15분 오프라인 시 Guardian 이메일 알림 (sendOfflineAlert)"
labels: 'feature, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [EMAIL-003] 디바이스 오프라인 감지 시 Guardian 이메일 알림 (`sendOfflineAlert`)
- 목적: Heartbeat 15분 미수신으로 디바이스 상태가 `INACTIVE`로 변경될 때(HB-004), 해당 디바이스의 Guardian에게 "디바이스 연결이 끊겼습니다" 이메일을 1회 발송한다. 중복 발송 방지 로직을 포함한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Heartbeat / Offline Detection
- 기능 요구사항: REQ-FUNC-008 — 15분 오프라인 시 Guardian 이메일 알림 (1회)
- 이메일 유틸리티: [`/TASKs/TASK_EMAIL-001.md`](./TASK_EMAIL-001.md) — lib/email.ts sendEmail()
- 선행 태스크: [`/TASKs/TASK_HB-004.md`](./TASK_HB-004.md) — INACTIVE 상태 변경 트리거
- 데이터 모델: [`/TASKs/TASK_DB-001.md`](./TASK_DB-001.md) — SensorDevice (status, lastHeartbeatAt)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — EMAIL-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/email.ts`에 `sendOfflineAlertEmail(deviceId: string, lastHeartbeatAt: Date): Promise<void>` 함수 구현
- [ ] `UserDevice` → `UserAccount` 경로로 Guardian 이메일 조회
- [ ] **1회 발송 보장 로직** — 중복 발송 방지:
  - 방법 A: `SensorDevice`에 `offlineAlertSentAt` 필드 추가 → null이면 발송, not null이면 skip
  - 방법 B: 메모리 캐시(Set) 또는 Redis(미사용) → MVP에서는 방법 A 권장
- [ ] 이메일 HTML 템플릿:
  - 제목: `"[Rooted 긴급] {deviceId} 디바이스 연결이 끊겼습니다"`
  - 본문: 마지막 연결 시각, 조치 방법(앱 확인, 현장 방문 검토), 오프라인 지속 시간 표시
- [ ] `sendEmail()` 호출
- [ ] `HB-004` (`updateDeviceStatus` Server Action) 완료 직후 이 함수 호출:
  ```typescript
  if (newStatus === 'INACTIVE' && !device.offlineAlertSentAt) {
    await sendOfflineAlertEmail(deviceId, device.lastHeartbeatAt).catch(console.error);
    await prisma.sensorDevice.update({ where: { id: deviceId }, data: { offlineAlertSentAt: new Date() } });
  }
  ```
- [ ] 디바이스가 다시 `ACTIVE`로 복귀하면 `offlineAlertSentAt`을 `null`로 초기화

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 15분 오프라인 감지 시 이메일 1회 발송**
- Given: 디바이스 `lastHeartbeatAt`이 현재로부터 15분 초과, status `ACTIVE` → `INACTIVE` 전환
- When: `HB-004` 상태 변경 완료
- Then: Guardian 이메일로 오프라인 경고 이메일이 1회 발송된다.

**Scenario 2: 중복 발송 방지 — 이미 발송된 경우 skip**
- Given: 오프라인 경고 이메일이 이미 발송된 상태 (`offlineAlertSentAt` not null)
- When: 다음 Heartbeat 체크 사이클에서 여전히 `INACTIVE` 확인
- Then: 추가 이메일 발송 없음.

**Scenario 3: 디바이스 복귀 시 offlineAlertSentAt 초기화**
- Given: `INACTIVE` 디바이스가 Heartbeat를 재전송하여 `ACTIVE`로 복귀
- When: `updateDeviceStatus` Server Action에서 status `ACTIVE` 업데이트
- Then: `offlineAlertSentAt`이 `null`로 초기화되어 다음 오프라인 시 재발송 가능.

**Scenario 4: 이메일 발송 실패 — 상태 변경은 정상 처리**
- Given: 디바이스가 `INACTIVE`로 전환됨, Resend API 실패
- When: `sendOfflineAlertEmail()` 호출
- Then: `console.error` 로깅만 발생하고 `HB-004` 상태 변경은 정상 완료.

## :gear: Technical & Non-Functional Constraints
- **1회 발송:** 동일 오프라인 이벤트에 대해 중복 이메일 발송 금지 — `offlineAlertSentAt` 필드로 관리
- **긴급도:** 오프라인 알림은 높은 우선순위 — 가능하면 `INACTIVE` 전환 즉시 발송
- **스키마 변경:** `SensorDevice` 모델에 `offlineAlertSentAt DateTime?` 필드 추가 필요 (DB 마이그레이션)

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 중복 발송이 `offlineAlertSentAt` 필드로 방지되는가?
- [ ] 디바이스 복귀 시 `offlineAlertSentAt`이 `null`로 초기화되는가?
- [ ] 이메일 발송 실패 시 HB-004 상태 변경이 영향받지 않는가?
- [ ] TASK_TEST-016, TASK_TEST-017 (오프라인 감지 + 이메일 알림 테스트)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_EMAIL-001 (sendEmail 유틸리티), TASK_HB-004 (INACTIVE 상태 변경), TASK_DB-001 (SensorDevice — offlineAlertSentAt 필드 추가 필요)
- **Blocks:** TASK_TEST-016 (이메일 알림 테스트), TASK_TEST-017 (Heartbeat 오프라인 + 이메일 통합 테스트)
- **참고:** `offlineAlertSentAt` 필드를 `SensorDevice` 스키마에 추가하려면 DB-001 Prisma 스키마 수정 + 마이그레이션이 필요하다. 이 변경사항은 이 태스크 내에서 처리한다.
