---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FA-002: updateFalseAlarmFlag Server Action — isFalseAlarm 업데이트"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [FA-002] `updateFalseAlarmFlag` Server Action 구현
- 목적: `app/actions/events.ts`에 `updateFalseAlarmFlag(eventId: string)` Server Action을 구현하여, 지정된 WellnessEvent의 `isFalseAlarm` 필드를 `true`로 업데이트하는 비즈니스 로직 단계를 캡슐화한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Action #2 updateFalseAlarmFlag
- 기능 요구사항: REQ-FUNC-005 — 거짓 경보 피드백
- API 호출처: [`/TASKs/TASK_FA-001.md`](./TASK_FA-001.md) — POST /api/events/[eventId]/false-alarm
- API 계약: [`/TASKs/TASK_API-008.md`](./TASK_API-008.md) — Server Action 인터페이스 정의
- 데이터 모델: [`/TASKs/TASK_DB-002.md`](./TASK_DB-002.md) — WellnessEvent.isFalseAlarm 필드
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — FA-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/actions/events.ts` 파일에 `updateFalseAlarmFlag` 함수 추가 (기존 `createWellnessEvent`와 동일 파일)
- [ ] 함수 시그니처:
  ```typescript
  export async function updateFalseAlarmFlag(
    eventId: string
  ): Promise<{ success: boolean; error?: string }>
  ```
- [ ] Prisma 업데이트 쿼리:
  ```typescript
  await prisma.wellnessEvent.update({
    where: { id: eventId },
    data: { isFalseAlarm: true }
  })
  ```
- [ ] `PrismaClientKnownRequestError` — `eventId` 미존재 시 (`P2025`) 에러 캐치 후 `{ success: false, error: 'Event not found' }` 반환
- [ ] 성공 시 `{ success: true }` 반환
- [ ] 소유권 검증은 FA-001 API 라우트에서 처리하므로 이 함수에서는 생략 (단일 책임 원칙)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 isFalseAlarm 업데이트**
- Given: DB에 존재하는 유효한 `eventId`, `isFalseAlarm: false`
- When: `updateFalseAlarmFlag(eventId)` 호출
- Then: `{ success: true }` 반환, DB의 해당 이벤트 `isFalseAlarm`이 `true`로 변경된다.

**Scenario 2: 존재하지 않는 eventId**
- Given: DB에 없는 `eventId`
- When: `updateFalseAlarmFlag(eventId)` 호출
- Then: `{ success: false, error: 'Event not found' }` 반환, 에러 throw 없음.

**Scenario 3: 이미 isFalseAlarm: true인 이벤트 — 멱등 처리**
- Given: `isFalseAlarm: true`인 이벤트 `eventId`
- When: `updateFalseAlarmFlag(eventId)` 호출
- Then: `{ success: true }` 반환 (동일 값으로 업데이트, 에러 없음).

## :gear: Technical & Non-Functional Constraints
- **단일 책임:** 소유권 검증 미포함 — FA-001 API 라우트에서 처리
- **멱등성:** 동일 `eventId` 반복 호출 시 동일 결과 (`isFalseAlarm: true`)
- **에러 처리:** Prisma 에러를 에러 throw 대신 반환값으로 처리 — 호출부에서 핸들링 용이

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] Prisma `P2025` 에러가 안전하게 처리되는가?
- [ ] `app/actions/events.ts`에 `createWellnessEvent`와 함께 export되는가?
- [ ] TASK_TEST-014가 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DB-002 (WellnessEvent.isFalseAlarm 필드), TASK_DB-007 (마이그레이션)
- **Blocks:** TASK_FA-001 (API 라우트에서 이 함수 호출), TASK_TEST-014
