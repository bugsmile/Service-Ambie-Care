---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-016: [Unit] 이메일 알림 전송 테스트"
labels: 'test, backend, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-016] EMAIL-002/EMAIL-003 일일 보고서 + 오프라인 알림 이메일 전송 단위 테스트
- 목적: EMAIL-002(일일 보고서 이메일)와 EMAIL-003(오프라인 알림 + 중복 발송 방지)이 올바른 수신자, 제목, 본문으로 Resend API를 호출하고 중복 방지 로직이 동작하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_EMAIL-002.md`](./TASK_EMAIL-002.md) — 일일 보고서 이메일
- 테스트 대상: [`/TASKs/TASK_EMAIL-003.md`](./TASK_EMAIL-003.md) — 오프라인 알림 + 중복 방지
- 테스트 대상: [`/TASKs/TASK_EMAIL-001.md`](./TASK_EMAIL-001.md) — lib/email.ts Resend 설정
- SRS 섹션: §5.8 Email Notifications, NFR-NOTIF-001
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-016

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/email/notifications.test.ts`
- [ ] Resend `emails.send` Mock 설정 (`jest.mock('resend')`)
- [ ] Prisma Mock (중복 방지 조회)
- [ ] 테스트 케이스:
  - 일일 보고서 이메일 — `to` 주소, `subject` 패턴 (`[AmbieCARE] 일일 보고서`) 확인
  - 오프라인 알림 — 첫 번째 발송 성공
  - 오프라인 알림 — 1시간 이내 동일 deviceId 재발송 → Resend 미호출 (중복 방지)
  - 1시간 이후 동일 deviceId → 재발송 허용
  - Resend API 오류 → 에러 throw 없이 로깅만

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 일일 보고서 이메일 발송**
- Given: DailyReport 생성 완료, guardian email 존재
- When: 이메일 발송 함수 호출
- Then: `resend.emails.send` 1회 호출, subject에 `[AmbieCARE]` 포함

**Scenario 2: 오프라인 알림 중복 방지**
- Given: 이미 30분 전 동일 deviceId 오프라인 알림 발송
- When: 동일 deviceId 오프라인 알림 재발송 시도
- Then: `resend.emails.send` 미호출

**Scenario 3: Resend API 오류 → graceful 처리**
- Given: `resend.emails.send` throws Error
- When: 이메일 발송 시도
- Then: 에러 throw 없이 `console.error` 로깅

## :gear: Technical & Non-Functional Constraints
- **Resend Mock:** 실제 API 호출 없음
- **중복 방지:** Redis 또는 Prisma `EmailLog` 테이블 기반 — 구현에 따라 Mock 조정
- **Resend Free 제한:** 100건/일 — 테스트에서 발송 횟수 검증

## :checkered_flag: Definition of Done (DoD)
- [ ] 발송/중복방지/오류처리 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] Resend API 실제 호출 없음 확인?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.
- **리뷰 체크포인트:**
  - 구현 파일 경로가 Task Breakdown과 일치하는지 확인한다.
  - 실패 케이스가 Acceptance Criteria 또는 테스트에 반영되었는지 확인한다.
  - SRS 금지어 및 PII 노출 규칙을 재확인한다.
  - 외부 서비스 의존성이 mock/fallback으로 검증 가능한지 확인한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_EMAIL-001, TASK_EMAIL-002, TASK_EMAIL-003
- **Blocks:** 없음
