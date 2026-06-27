---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-014: [Unit] False Alarm 피드백 처리 테스트"
labels: 'test, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-014] FA-001/FA-002 False Alarm 피드백 API + Server Action 단위 테스트
- 목적: FA-001(False Alarm API)과 FA-002(Server Action)가 올바른 사용자 권한으로 특정 WellnessEvent를 `isFalseAlarm`으로 표시/해제하고, API-005 경로와 응답 계약을 준수하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_FA-001.md`](./TASK_FA-001.md) — False Alarm API Route
- 테스트 대상: [`/TASKs/TASK_FA-002.md`](./TASK_FA-002.md) — False Alarm Server Action
- SRS 섹션: §5.7 False Alarm Feedback
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-014

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/api/falseAlarm.test.ts`
- [ ] Prisma Mock (`wellnessEvent.findFirst`, `userDevice.findFirst`, `wellnessEvent.update`)
- [ ] NextAuth 세션 Mock (GUARDIAN 역할)
- [ ] 테스트 케이스:
  - 미인증 요청 → 401
  - 다른 사용자의 deviceId → 403 (권한 없음)
  - 존재하지 않는 eventId → 404
  - 유효한 요청 `{ isFalseAlarm: true }` → `wellnessEvent.isFalseAlarm: true` 업데이트 확인
  - 해제 요청 `{ isFalseAlarm: false }` → `isFalseAlarm: false` 업데이트 확인
  - 이미 같은 값으로 처리된 이벤트 재처리 → 200 OK 멱등 처리
  - Server Action 호출 후 필요한 리포트/이벤트 경로 revalidate 트리거 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 false alarm 처리**
- Given: GUARDIAN 세션, 자신의 device 이벤트 ID
- When: POST `/api/events/{eventId}/false-alarm` with `{ isFalseAlarm: true }`
- Then: 200 OK, `wellnessEvent.isFalseAlarm: true` 업데이트

**Scenario 2: 권한 없는 device → 403**
- Given: GUARDIAN 세션, 타인 device 이벤트 ID
- When: POST `/api/events/{eventId}/false-alarm`
- Then: 403 Forbidden

**Scenario 3: 존재하지 않는 이벤트 → 404**
- Given: DB에 없는 `eventId`
- When: POST `/api/events/{eventId}/false-alarm`
- Then: 404 Not Found

**Scenario 4: False Alarm 해제**
- Given: `isFalseAlarm: true`인 이벤트
- When: POST `/api/events/{eventId}/false-alarm` with `{ isFalseAlarm: false }`
- Then: `isFalseAlarm: false`로 업데이트된다.

## :gear: Technical & Non-Functional Constraints
- **Prisma Mock:** 이벤트 조회 → UserDevice 권한 확인 → `wellnessEvent.update` 호출 순서 및 인수 검증
- **권한 검증:** UserDevice 관계 확인 로직 Mock 포함
- **Server Action:** `next/cache` `revalidatePath` Mock
- **경로 규격:** `/api/false-alarm`이 아니라 `/api/events/[eventId]/false-alarm`
- **필드명:** `falseAlarm`이 아니라 DB 표준 필드 `isFalseAlarm`

## :checkered_flag: Definition of Done (DoD)
- [ ] 인증/권한/정상처리/중복처리/revalidation 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] 토글(true/false) 및 멱등 처리 확인?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_FA-001, TASK_FA-002
- **Blocks:** 없음
