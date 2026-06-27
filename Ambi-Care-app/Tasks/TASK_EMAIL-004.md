---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] EMAIL-004: 긴급 이벤트(EMERGENCY) 수신 시 Guardian 이메일 알림 (sendEmergencyAlert)"
labels: 'feature, backend, priority:critical, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [EMAIL-004] 긴급 이벤트 수신 시 Guardian 즉시 이메일 알림 (`sendEmergencyAlert`)
- 목적: `POST /api/events/ingest`로 `eventType: "EMERGENCY"` 이벤트가 수신되면 5분 이내에 해당 디바이스의 Guardian에게 "긴급 상황이 감지되었습니다" 이메일을 즉시 발송한다. 이는 시스템에서 가장 높은 우선순위의 알림이다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Emergency Event
- 기능 요구사항: REQ-FUNC-004 — 긴급 이벤트 감지 5분 이내 Guardian 알림
- 이메일 유틸리티: [`/TASKs/TASK_EMAIL-001.md`](./TASK_EMAIL-001.md) — lib/email.ts sendEmail()
- 이벤트 수집: [`/TASKs/TASK_EVT-001.md`](./TASK_EVT-001.md) — POST /api/events/ingest
- 이벤트 수집: [`/TASKs/TASK_EVT-002.md`](./TASK_EVT-002.md) — createWellnessEvent Server Action
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — EMAIL-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/email.ts`에 `sendEmergencyAlertEmail(deviceId: string, event: WellnessEvent): Promise<void>` 함수 구현
- [ ] `UserDevice` → `UserAccount` 경로로 Guardian 이메일 조회
- [ ] 긴급 이메일 HTML 템플릿:
  - 제목: `"[Rooted 긴급] 🚨 {locationZone} 에서 긴급 상황이 감지되었습니다"`
  - 본문:
    - 감지 시각 (`event.timestamp`)
    - 위치 (`device.locationZone`)
    - 신뢰도 점수 (`event.confidenceScore * 100}%`)
    - 권고 행동 ("즉시 현장을 확인하거나 119에 연락하세요")
    - 앱 링크
- [ ] `sendEmail()` 호출 — `priority: 'high'` (Resend 지원 시)
- [ ] `createWellnessEvent` Server Action (EVT-002) 내에서 `EMERGENCY` 이벤트 감지 시 즉시 호출:
  ```typescript
  if (event.eventType === 'EMERGENCY') {
    sendEmergencyAlertEmail(event.deviceId, savedEvent).catch(console.error);
  }
  ```
- [ ] 5분 이내 발송 보장 — 동기 처리 대신 `await` 없는 비동기 호출로 응답 지연 방지
- [ ] `isFalseAlarm: true`로 표시된 이벤트는 재발송 금지 (거짓 경보 플래그 체크)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: EMERGENCY 이벤트 수신 시 5분 내 이메일 발송**
- Given: `eventType: "EMERGENCY"` 이벤트가 `POST /api/events/ingest`로 수신됨
- When: `createWellnessEvent` Server Action 완료
- Then: Guardian 이메일로 긴급 경보 이메일이 발송되며, 발송 지연이 5분을 초과하지 않는다.

**Scenario 2: 일반 이벤트 수신 시 이메일 미발송**
- Given: `eventType: "ACTIVITY_ALERT"` 이벤트 수신
- When: `createWellnessEvent` 완료
- Then: 이메일이 발송되지 않는다.

**Scenario 3: 이메일 발송이 API 응답 지연시키지 않음**
- Given: `EMERGENCY` 이벤트 수신, Resend API 응답 시간 2초
- When: `POST /api/events/ingest` 처리
- Then: API 응답은 Resend API 완료를 기다리지 않고 즉시 201 Created 반환.

**Scenario 4: 이메일 발송 실패 — 이벤트 저장은 정상 완료**
- Given: `EMERGENCY` 이벤트 수신, Resend API 실패
- When: `createWellnessEvent` 실행
- Then: WellnessEvent는 DB에 정상 저장되고 `{ success: true }` 반환. 이메일 실패는 `console.error`로만 기록.

**Scenario 5: isFalseAlarm 이벤트 발송 금지**
- Given: `isFalseAlarm: true`로 마킹된 EMERGENCY 이벤트 (재처리 시나리오)
- When: 이메일 발송 로직 실행
- Then: 거짓 경보로 확인된 이벤트에 대해 이메일 발송을 skip한다.

## :gear: Technical & Non-Functional Constraints
- **우선순위:** CRITICAL — REQ-FUNC-004의 5분 이내 알림 SLA
- **비동기 발송:** `sendEmergencyAlertEmail(...).catch(console.error)` — API 응답 블로킹 금지
- **한도 주의:** EMERGENCY 이벤트 빈발 시 Resend 100통/일 한도 초과 위험 — 디바이스당 1시간 내 중복 발송 제한 고려 (MVP에서는 단순 구현)
- **발신자 명확성:** 긴급 이메일 제목에 `🚨` 이모지 및 `[Rooted 긴급]` 접두사로 즉각 인지 가능

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `EMERGENCY` 이벤트에서만 이메일이 발송되는가?
- [ ] 이메일 발송이 API 응답을 블로킹하지 않는가?
- [ ] 이메일 실패 시 이벤트 저장이 영향받지 않는가?
- [ ] `isFalseAlarm: true` 이벤트에 대해 이메일이 발송되지 않는가?
- [ ] TASK_TEST-016 (이메일 알림 전송 테스트)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_EMAIL-001 (sendEmail 유틸리티), TASK_EVT-001 (POST /api/events/ingest), TASK_EVT-002 (createWellnessEvent Server Action)
- **Blocks:** TASK_TEST-016 (이메일 알림 전송 테스트)
- **참고:** MVP 단계에서는 EMERGENCY 이벤트 발생 시 무조건 이메일 발송으로 구현한다. 중복 발송 제한(쿨다운)은 Phase 3 Enhancement 또는 이슈 발생 시 추가한다.
