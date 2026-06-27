---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] PIPE-003: generateDailyReport — 화장실 방문 횟수 카운팅 + 이상치 필터링"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [PIPE-003] 화장실 방문 횟수 카운팅 및 이상치 필터링 로직 구현
- 목적: `generateDailyReport` 파이프라인 내에서 하루치 WellnessEvent에서 화장실 방문 횟수를 카운팅하고, 비정상적으로 높은 횟수(≥50회) 감지 시 데이터 신뢰도 경고 플래그를 설정하는 로직을 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Daily Report Generation
- 기능 요구사항: REQ-FUNC-019 — 화장실 방문 횟수 카운팅 + 이상치 필터링
- 선행 태스크: [`/TASKs/TASK_PIPE-001.md`](./TASK_PIPE-001.md) — generateDailyReport 기반 구조
- 데이터 모델: [`/TASKs/TASK_DB-002.md`](./TASK_DB-002.md) — WellnessEvent (eventType: ACTIVITY_ALERT, WELLNESS_SCORE)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — PIPE-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/report/bathroom-count.ts` 파일 생성 — 순수 계산 함수로 분리
- [ ] `countBathroomVisits(events: WellnessEvent[]): { count: number; anomalyFlags: string[] }` 함수 구현
- [ ] 화장실 방문 판정 로직:
  - `eventType === 'ACTIVITY_ALERT'` 이벤트 중 연속 감지 구간(30분 이내)을 하나의 "방문"으로 그룹핑
  - 그룹 수 = `bathroomVisitCount`
- [ ] 이상치 감지 로직:
  - `bathroomVisitCount >= 50` → `anomalyFlags`에 `"데이터 신뢰도 경고: 화장실 방문 횟수 이상 (${count}회)"` 추가
  - 데이터 수집 불량(센서 오류 가능성) 플래그로 처리
- [ ] 반환값 구조: `{ count: number, anomalyFlags: string[] }`
- [ ] `generateDailyReport` (PIPE-001) 내에서 이 함수 호출 후:
  - `bathroomVisitCount` 필드에 `count` 할당
  - `anomalyFlags` 배열에 반환된 플래그 병합

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 방문 횟수 카운팅**
- Given: 하루 동안 별개의 활동 감지 구간(각 30분 이내 연속)이 3그룹 존재
- When: `countBathroomVisits(events)` 호출
- Then: `{ count: 3, anomalyFlags: [] }` 반환한다.

**Scenario 2: 이상치 ≥50회 플래그 설정**
- Given: 하루 동안 활동 감지 구간이 52그룹(52회) 존재 (센서 오류 의심)
- When: `countBathroomVisits(events)` 호출
- Then: `{ count: 52, anomalyFlags: ["데이터 신뢰도 경고: 화장실 방문 횟수 이상 (52회)"] }` 반환한다.

**Scenario 3: 이벤트 없음**
- Given: 해당 날짜에 `ACTIVITY_ALERT` 이벤트가 0건
- When: `countBathroomVisits(events)` 호출
- Then: `{ count: 0, anomalyFlags: [] }` 반환한다.

**Scenario 4: 경계값 49회 — 플래그 없음**
- Given: 활동 감지 구간이 정확히 49그룹
- When: `countBathroomVisits(events)` 호출
- Then: `{ count: 49, anomalyFlags: [] }` 반환한다 (50회 미만이므로 플래그 없음).

**Scenario 5: 경계값 50회 — 플래그 설정**
- Given: 활동 감지 구간이 정확히 50그룹
- When: `countBathroomVisits(events)` 호출
- Then: `anomalyFlags`에 신뢰도 경고 항목이 포함된다.

## :gear: Technical & Non-Functional Constraints
- **그룹핑 기준:** 30분(1,800,000ms) 이내 연속 이벤트를 동일 "방문"으로 판정 — SRS에 명시되지 않은 구현 세부사항, 검토 후 확정
- **순수 함수:** 외부 의존성 없이 입력 데이터만으로 계산 → 단위 테스트 용이
- **이상치 임계값:** 정확히 50회부터(`count >= 50`) 플래그 설정 — REQ-FUNC-019

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `countBathroomVisits`가 `lib/report/bathroom-count.ts`로 분리되어 독립 테스트 가능한가?
- [ ] 경계값 49/50회에서 플래그 분기가 정확한가?
- [ ] TASK_TEST-012 (이상치 필터링 테스트) 가 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_PIPE-001 (generateDailyReport 기반 구조), TASK_DB-002 (WellnessEvent 모델)
- **Blocks:** TASK_PIPE-006 (DailyReport 저장 — bathroomVisitCount, anomalyFlags 값 필요), TASK_PIPE-004 (이상 징후 감지 로직 — anomalyFlags 공유), TASK_TEST-012
- **참고:** `anomalyFlags`는 PIPE-003과 PIPE-004 양쪽에서 항목을 추가한다. PIPE-001에서 두 결과를 병합(`[...pipe003Flags, ...pipe004Flags]`)하여 `DailyReport.anomalyFlags`에 저장한다.
