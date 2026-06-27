---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] EMAIL-002: 일간 보고서 생성 완료 시 Guardian 이메일 알림 (sendDailyReport)"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [EMAIL-002] 일간 보고서 완료 이메일 알림 (`sendDailyReport`)
- 목적: `generateDailyReport` 파이프라인이 완료되면 해당 디바이스와 연결된 Guardian에게 "어르신의 어제 웰니스 리포트가 준비되었습니다" 이메일을 발송하여, Guardian이 앱을 열어 보고서를 확인하도록 유도한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Daily Report Generation (알림 단계)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 2 Pipeline
- 기능 요구사항: REQ-FUNC-020 — 일간 보고서 완료 시 Guardian 이메일 알림
- 이메일 유틸리티: [`/TASKs/TASK_EMAIL-001.md`](./TASK_EMAIL-001.md) — lib/email.ts sendEmail()
- 파이프라인: [`/TASKs/TASK_PIPE-006.md`](./TASK_PIPE-006.md) — DailyReport 저장 완료 이후
- 데이터 모델: [`/TASKs/TASK_DB-003.md`](./TASK_DB-003.md) — UserAccount (email, notificationPref)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — EMAIL-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/email.ts`에 `sendDailyReportEmail(deviceId: string, reportDate: string, reportId: string): Promise<void>` 함수 구현
- [ ] `UserDevice` 조인 테이블 조회 → 해당 `deviceId`와 연결된 `userId` 목록 조회
- [ ] `UserAccount`에서 각 `userId`의 `email` 및 `notificationPref` 조회
  - `notificationPref`에 이메일 알림 비활성화 설정 시 발송 스킵
- [ ] 이메일 HTML 템플릿 구성:
  - 제목: `"[Rooted] {date} 웰니스 리포트가 준비되었습니다"`
  - 본문: 날짜, 보고서 링크 (`/reports/{date}`), 간략 안내 문구
- [ ] `sendEmail()` 호출로 이메일 발송
- [ ] 이메일 발송 실패 → `console.error` 로깅만, 파이프라인 에러 전파 금지
- [ ] `generateDailyReport` (PIPE-001) 완료 후 이 함수 호출:
  ```typescript
  await sendDailyReportEmail(deviceId, targetDate, reportId).catch(console.error);
  ```

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 보고서 완료 시 Guardian 이메일 발송**
- Given: `deviceId`에 연결된 Guardian 이메일이 존재하고, 알림 활성화 상태
- When: `generateDailyReport(deviceId)` 완료
- Then: Guardian 이메일로 보고서 완료 알림이 발송되고 Resend API 호출이 확인된다.

**Scenario 2: notificationPref 이메일 비활성화 시 스킵**
- Given: Guardian의 `notificationPref`에 이메일 알림이 비활성화됨
- When: `generateDailyReport(deviceId)` 완료
- Then: 이메일 발송 없이 파이프라인이 정상 완료된다.

**Scenario 3: 이메일 발송 실패 — 파이프라인 영향 없음**
- Given: Resend API 실패 또는 잘못된 이메일 주소
- When: `sendDailyReportEmail()` 호출
- Then: `console.error` 로깅만 발생하고 `generateDailyReport`는 `{ success: true }` 반환한다.

**Scenario 4: 복수 Guardian 이메일 발송**
- Given: 디바이스에 Guardian 2명이 연결됨
- When: `generateDailyReport(deviceId)` 완료
- Then: 2명의 Guardian 모두에게 이메일이 발송된다.

## :gear: Technical & Non-Functional Constraints
- **한도 주의:** Resend Free 100통/일 — 디바이스 수 × Guardian 수 × 일수 계산 필요 (RISK-09)
- **비동기 처리:** `.catch(console.error)` 패턴으로 비동기 이메일 발송이 파이프라인 블로킹 방지
- **이메일 링크:** 보고서 링크(`/reports/{date}`)는 배포된 앱 URL(`NEXTAUTH_URL` 환경 변수 기준) 사용

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 이메일 발송 실패 시 파이프라인이 에러 없이 완료되는가?
- [ ] `notificationPref` 비활성화 Guardian에게 이메일이 발송되지 않는가?
- [ ] 복수 Guardian 대상 이메일이 모두 발송되는가?
- [ ] TASK_TEST-016 (이메일 알림 테스트)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_EMAIL-001 (sendEmail 유틸리티), TASK_PIPE-006 (DailyReport 저장 완료), TASK_DB-003 (UserAccount email/notificationPref), TASK_DB-004 (UserDevice 조인)
- **Blocks:** TASK_TEST-016 (이메일 알림 전송 테스트)
- **참고:** `notificationPref` 필드는 SRS §6.2.3에서 JSON string으로 정의됨. `{ emailEnabled: boolean, smsEnabled: boolean }` 구조로 파싱하여 처리한다.
