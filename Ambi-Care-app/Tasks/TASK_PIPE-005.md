---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] PIPE-005: generateDailyReport — 데이터 부족 처리 (INSUFFICIENT_DATA)"
labels: 'feature, backend, priority:low, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [PIPE-005] 데이터 수집 부족 시 `INSUFFICIENT_DATA` 처리 분기 구현
- 목적: `generateDailyReport` 파이프라인에서 하루 데이터 수집량이 5시간 미만인 경우, 신뢰할 수 없는 수치 대신 `statusCode: "INSUFFICIENT_DATA"` 로 DailyReport를 저장하는 예외 처리 분기를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Daily Report Generation
- 기능 요구사항: REQ-FUNC-018 — 데이터 수집 < 5시간 시 INSUFFICIENT_DATA 처리
- 선행 태스크: [`/TASKs/TASK_PIPE-001.md`](./TASK_PIPE-001.md) — generateDailyReport 기반 구조 (분기 조건 포함)
- 데이터 모델: [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md) — DailyReport.statusCode 필드
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — PIPE-005

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/report/data-coverage.ts` 파일 생성 — 데이터 커버리지 계산 유틸리티
- [ ] `calculateDataCoverageHours(events: WellnessEvent[], targetDate: Date): number` 함수 구현
  - 이벤트 첫 타임스탬프 ~ 마지막 타임스탬프 기준 총 커버리지 시간 계산
  - 또는 이벤트 발생 시간대(1시간 단위 버킷)로 커버된 시간 수 계산 (더 정확한 방식)
- [ ] `PIPE-001` (`generateDailyReport`) 내 분기 로직:
  ```typescript
  const coverageHours = calculateDataCoverageHours(events, targetDate);
  if (coverageHours < 5) {
    // PIPE-005 분기: 데이터 부족 처리
    return await saveInsufficientDataReport(deviceId, targetDate);
  }
  // 정상 처리: PIPE-002, PIPE-003, PIPE-004 실행
  ```
- [ ] `saveInsufficientDataReport(deviceId, date)` 헬퍼 함수 구현:
  - `statusCode: "INSUFFICIENT_DATA"`
  - `sleepScore: null`, `bathroomVisitCount: null`
  - `anomalyFlags: []`
  - `aiSummary: null`
- [ ] Guardian UI에서 `"INSUFFICIENT_DATA"` 표시 시 `RPT-004` DailyReportCard의 상태 텍스트 "데이터 부족 (5시간 미만 수집)" 매핑 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 4시간 30분 데이터 → INSUFFICIENT_DATA**
- Given: 하루 WellnessEvent가 4.5시간(270분) 범위에만 존재함
- When: `generateDailyReport(deviceId)` 호출
- Then: DB에 `statusCode: "INSUFFICIENT_DATA"`, `sleepScore: null`, `bathroomVisitCount: null` 로 DailyReport가 저장된다.

**Scenario 2: 정확히 5시간 → 정상 처리**
- Given: 하루 WellnessEvent가 5.0시간(300분) 커버리지
- When: `generateDailyReport(deviceId)` 호출
- Then: `INSUFFICIENT_DATA` 분기로 진입하지 않고 정상 파이프라인(PIPE-002~004)이 실행된다.

**Scenario 3: 이벤트 0건 → INSUFFICIENT_DATA**
- Given: 해당 날짜 WellnessEvent가 0건
- When: `generateDailyReport(deviceId)` 호출
- Then: `statusCode: "INSUFFICIENT_DATA"` 로 저장되고 `{ success: true }` 반환한다.

**Scenario 4: 5시간 미만이지만 보고서는 반드시 생성**
- Given: 3시간치 데이터 존재
- When: `generateDailyReport(deviceId)` 호출
- Then: DailyReport 레코드가 생성되며(null 필드 포함), 에러가 발생하지 않는다.

## :gear: Technical & Non-Functional Constraints
- **임계값:** 정확히 5시간(300분 = 18,000,000ms) 미만 — `< 5` (strictly less than, 5시간은 정상 처리)
- **저장 보장:** `INSUFFICIENT_DATA` 경우에도 DailyReport 레코드는 반드시 생성되어야 함 (Guardian UI에 "데이터 없음" 표시용)
- **순수 함수:** `calculateDataCoverageHours`는 외부 의존성 없는 순수 함수로 구현

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 5시간 경계값에서 분기가 정확하게 동작하는가?
- [ ] `INSUFFICIENT_DATA` 시에도 DailyReport 레코드가 DB에 저장되는가?
- [ ] `RPT-004` DailyReportCard에서 `"INSUFFICIENT_DATA"` 텍스트가 정상 표시되는가?
- [ ] TASK_TEST-011 (데이터 부족 처리 테스트)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_PIPE-001 (generateDailyReport 분기 로직), TASK_DB-005 (DailyReport.statusCode 필드)
- **Blocks:** TASK_PIPE-006 (DailyReport 저장 — statusCode 값 사용), TASK_TEST-011
- **참고:** `statusCode` 필드에 허용되는 값은 `"NORMAL"`, `"INSUFFICIENT_DATA"`, `"ANOMALY_DETECTED"` 3가지이다. TypeScript `enum` 또는 `const` 객체로 정의하여 magic string 사용을 방지한다.
