---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] OPS-002: 오프라인 디바이스 비율 ≥10% 시 Slack/Discord 운영 알림"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [OPS-002] 오프라인 디바이스 비율 10% 이상 시 운영팀 Webhook 알림
- 목적: Heartbeat 체크(HB-003) 사이클에서 전체 활성 디바이스 중 `INACTIVE` 비율이 10% 이상으로 감지될 때, Slack/Discord Webhook으로 운영팀에 시스템 이상 알림을 자동 전송한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Heartbeat / Offline Detection
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 2 Pipeline
- 비기능 요구사항: REQ-NF-007 — 오프라인 ≥10% 시 Slack 운영 알림
- Webhook 유틸리티: [`/TASKs/TASK_OPS-001.md`](./TASK_OPS-001.md) — lib/slack.ts
- Heartbeat 로직: [`/TASKs/TASK_HB-003.md`](./TASK_HB-003.md) — 오프라인 디바이스 식별
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — OPS-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `HB-003` Heartbeat 체크 로직 내 오프라인 비율 계산 추가:
  ```typescript
  const totalDevices = devices.length;
  const inactiveDevices = devices.filter(d => isOffline(d.lastHeartbeatAt)).length;
  const offlineRatio = inactiveDevices / totalDevices;
  ```
- [ ] 비율 ≥ 10% 시 `sendWebhookAlert()` 호출:
  ```typescript
  if (offlineRatio >= 0.1) {
    await sendWebhookAlert({
      text: `🚨 오프라인 디바이스 비율 경고: ${inactiveDevices}/${totalDevices} (${Math.round(offlineRatio * 100)}%)`,
      level: 'critical',
      fields: [
        { title: '오프라인 디바이스', value: offlineDeviceIds.join(', ') },
        { title: '감지 시각', value: new Date().toISOString() }
      ]
    }).catch(console.error);
  }
  ```
- [ ] 중복 알림 방지 — 동일 사이클 내 이미 알림 전송 시 재전송 금지 (간단한 `Set` 또는 cooldown 타임스탬프)
- [ ] 알림 전송 실패 → `console.error` 로깅만, HB 파이프라인 중단 없음
- [ ] `totalDevices === 0` 시 알림 스킵 (초기 빈 상태 보호)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 오프라인 비율 10% 이상 — Webhook 알림 발송**
- Given: 총 디바이스 10개 중 1개(10%) 이상이 15분+ 미응답 상태
- When: Heartbeat 체크 사이클 실행
- Then: `sendWebhookAlert`가 호출되고 Slack/Discord에 `"🚨 오프라인 디바이스 비율 경고: 1/10 (10%)"` 메시지가 전송된다.

**Scenario 2: 오프라인 비율 9% — 알림 없음**
- Given: 총 10개 중 0개 INACTIVE (0%)
- When: Heartbeat 체크 사이클 실행
- Then: `sendWebhookAlert`가 호출되지 않는다.

**Scenario 3: Webhook 전송 실패 — HB 파이프라인 영향 없음**
- Given: Slack Webhook URL 오류로 전송 실패
- When: 오프라인 비율 ≥10% 감지 후 알림 시도
- Then: `console.error` 로깅만 발생하고 HB-003/HB-004 로직은 정상 완료된다.

**Scenario 4: 디바이스 0개 시 알림 스킵**
- Given: `sensorDevice` 레코드가 0건
- When: Heartbeat 체크 실행
- Then: 알림 계산 스킵, Webhook 미호출.

## :gear: Technical & Non-Functional Constraints
- **임계값:** 정확히 10%(`>= 0.1`) — 반올림 없이 비율 그대로 비교
- **비차단:** Webhook 전송이 HB 파이프라인 완료를 지연시키지 않음 — `.catch(console.error)` 패턴
- **운영 민감도:** 프로덕션에서 잦은 False Positive 알림 방지를 위해 cooldown(예: 30분 이내 중복 알림 방지) 고려

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 10% 경계값에서 알림 분기가 정확한가?
- [ ] Webhook 실패 시 HB 파이프라인이 영향받지 않는가?
- [ ] 디바이스 0개 시 안전하게 처리되는가?
- [ ] TASK_TEST-017 (Heartbeat + Slack 알림 통합 테스트)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_OPS-001 (lib/slack.ts), TASK_HB-003 (오프라인 디바이스 식별 로직)
- **Blocks:** TASK_TEST-017
