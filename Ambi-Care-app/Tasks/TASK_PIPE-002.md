---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] PIPE-002: generateDailyReport — 수면 점수(sleepScore) 계산 로직"
labels: 'feature, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [PIPE-002] 수면 점수 계산 알고리즘 구현
- 목적: `generateDailyReport` 파이프라인 내에서 하루치 WellnessEvent 데이터를 분석하여 수면 점수(0~100)를 계산하는 로직을 구현한다. 오차율 < 10% 정확도를 충족해야 한다 (REQ-NF-003).

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Daily Report Generation
- 기능 요구사항: REQ-FUNC-016 — 수면 점수 계산
- 비기능 요구사항: REQ-NF-003 — 수면 점수 오차율 < 10%
- 선행 태스크: [`/TASKs/TASK_PIPE-001.md`](./TASK_PIPE-001.md) — generateDailyReport 기반 구조
- 데이터 모델: [`/TASKs/TASK_DB-002.md`](./TASK_DB-002.md) — WellnessEvent (eventType, timestamp, confidenceScore)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — PIPE-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/report/sleep-score.ts` 파일 생성 — 순수 계산 함수로 분리 (테스트 용이성)
- [ ] `calculateSleepScore(events: WellnessEvent[], targetDate: Date): number` 함수 구현
- [ ] 수면 시간 추정 알고리즘 구현:
  - `ACTIVITY_ALERT` 이벤트 간격 분석 → 연속 미감지 구간(≥60분)을 수면 구간으로 판정
  - 야간 시간대(오후 10시 ~ 오전 8시) 가중치 적용
  - 총 수면 시간(분) 계산
- [ ] 수면 점수 공식 적용:
  - 기준 수면 시간: 7시간(420분) = 100점
  - 점수 = min(100, round(totalSleepMinutes / 420 * 100))
  - `confidenceScore` 가중 평균 반영 (낮은 신뢰도 이벤트 보정)
- [ ] 결과 범위 클리핑 — 0 이상 100 이하 보장
- [ ] `generateDailyReport` (PIPE-001) 내에서 이 함수 호출하여 `sleepScore` 필드에 할당

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 7시간 수면 → 100점**
- Given: 야간 오후 10시~오전 5시(7시간) 동안 `ACTIVITY_ALERT` 이벤트가 없는 WellnessEvent 세트
- When: `calculateSleepScore(events, targetDate)` 호출
- Then: 반환값이 95~100 범위 내에 있다 (오차 허용).

**Scenario 2: 5시간 수면 → 약 71점**
- Given: 5시간 수면 구간이 추정되는 이벤트 세트
- When: `calculateSleepScore(events, targetDate)` 호출
- Then: 반환값이 64~78 범위 내에 있다 (±10% 허용).

**Scenario 3: 수면 구간 없음 → 0점**
- Given: 야간 내내 `ACTIVITY_ALERT` 이벤트가 연속으로 있어 수면 구간 없음
- When: `calculateSleepScore(events, targetDate)` 호출
- Then: 반환값이 0이다.

**Scenario 4: 점수 범위 보장**
- Given: 어떤 이벤트 세트가 주어지더라도
- When: `calculateSleepScore()` 호출
- Then: 반환값은 항상 0 이상 100 이하의 정수이다.

## :gear: Technical & Non-Functional Constraints
- **정확도:** 오차율 < 10% — REQ-NF-003. Mock 데이터 기반 TEST-010에서 검증
- **복잡도:** H (High) — 이벤트 시계열 분석 알고리즘
- **순수 함수:** 외부 의존성(DB, API) 없이 입력 데이터만으로 계산 → 단위 테스트 용이
- **타임존:** `targetDate` 기준 야간 시간대 계산 시 UTC 기준 일관 처리
- **정수 반환:** `Math.round()` 적용 후 정수로 반환

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `calculateSleepScore`가 `lib/report/sleep-score.ts`로 분리되어 독립 테스트 가능한가?
- [ ] 반환값이 항상 0~100 범위의 정수인가?
- [ ] TASK_TEST-010 (수면 점수 오차율 < 10% 검증)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_PIPE-001 (generateDailyReport 기반 구조), TASK_DB-002 (WellnessEvent 모델)
- **Blocks:** TASK_PIPE-006 (DailyReport DB 저장 — sleepScore 값 필요), TASK_TEST-010 (수면 점수 정확도 테스트)
- **참고:** 수면 점수 알고리즘의 세부 공식은 SRS §3.4.1에 명시되지 않은 구현 세부사항이다. "오차율 < 10%" 조건을 만족하는 한 알고리즘 접근법은 구현자에게 위임된다. TEST-010에서 Mock 데이터로 검증한다.
