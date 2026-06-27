---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FA-001: POST /api/events/[eventId]/false-alarm — 거짓 경보 피드백 API"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [FA-001] 거짓 경보(False Alarm) 피드백 API 라우트 핸들러 구현
- 목적: Guardian이 특정 이벤트를 "거짓 경보"로 표시할 수 있도록, `POST /api/events/[eventId]/false-alarm` 엔드포인트를 구현한다. JWT 인증 후 `updateFalseAlarmFlag` Server Action을 호출하여 `isFalseAlarm: true`로 업데이트한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #3
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — PMF Sequence: False Alarm Feedback
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 2 Pipeline
- API 계약: [`/TASKs/TASK_API-005.md`](./TASK_API-005.md) — Request/Response DTO + JWT 인증 규격
- 기능 요구사항: REQ-FUNC-005 — 거짓 경보 피드백
- 인증: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js JWT
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — FA-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/events/[eventId]/false-alarm/route.ts` 파일 생성
- [ ] JWT 인증 검증 — `getServerSession()` 미인증 시 401 반환
- [ ] `eventId` 유효성 확인 — cuid 형식 검증, 공백/빈값 시 400 반환
- [ ] 이벤트 소유권 검증 — `wellnessEvent.findFirst({ where: { id: eventId } })`로 이벤트 조회 후 해당 `deviceId`가 세션 사용자의 디바이스인지 확인, 미일치 시 403 반환
- [ ] 이벤트 미존재 시 404 반환
- [ ] `updateFalseAlarmFlag(eventId)` Server Action (FA-002) 호출
- [ ] 성공 시 `200 OK` + `{ success: true, eventId }` 반환
- [ ] 이미 `isFalseAlarm: true`인 이벤트 재처리 — 멱등 처리(200 OK 반환, 에러 없음)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 거짓 경보 표시**
- Given: 인증된 Guardian, 본인 소유 디바이스의 유효한 `eventId`
- When: `POST /api/events/{eventId}/false-alarm` 요청
- Then: 200 OK와 `{ success: true, eventId }` 반환, DB의 `isFalseAlarm`이 `true`로 업데이트된다.

**Scenario 2: 인증 미제공 시 401**
- Given: JWT 세션 없이 요청
- When: `POST /api/events/{eventId}/false-alarm`
- Then: 401 Unauthorized 반환.

**Scenario 3: 존재하지 않는 eventId — 404**
- Given: DB에 없는 `eventId`로 요청
- When: `POST /api/events/{eventId}/false-alarm`
- Then: 404 Not Found + `{ error: "Event not found" }` 반환.

**Scenario 4: 타 사용자 이벤트 접근 — 403**
- Given: 자신이 소유하지 않은 디바이스의 `eventId`로 요청
- When: `POST /api/events/{eventId}/false-alarm`
- Then: 403 Forbidden + `{ error: "Access denied" }` 반환.

**Scenario 5: 이미 거짓 경보로 표시된 이벤트 — 멱등 처리**
- Given: `isFalseAlarm: true`인 이벤트에 재요청
- When: `POST /api/events/{eventId}/false-alarm`
- Then: 200 OK 반환 (에러 없음, 멱등 보장).

## :gear: Technical & Non-Functional Constraints
- **보안:** 이벤트 소유권 서버 사이드 검증 필수 (타 사용자 이벤트 조작 방지)
- **멱등성:** 동일 eventId 반복 호출 시 동일 결과 보장
- **HTTP Method:** POST 사용 (상태 변경이므로 PATCH/PUT도 가능하나 SRS Route #3 명세 준수)

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 소유권 검증이 서버 사이드에서 수행되는가?
- [ ] 멱등 처리가 동작하는가?
- [ ] 200/401/403/404 응답 코드가 모두 정확한가?
- [ ] TASK_TEST-014 (False Alarm 피드백 테스트)가 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_API-005 (DTO 정의), TASK_AUTH-001 (JWT), TASK_FA-002 (updateFalseAlarmFlag Server Action)
- **Blocks:** TASK_FA-003 (Guardian UI 피드백 버튼), TASK_TEST-014
- **참고:** 거짓 경보로 표시된 이벤트는 EMAIL-004의 긴급 알림 재발송 대상에서 제외된다 (EMAIL-004의 `isFalseAlarm` 체크 참조).
