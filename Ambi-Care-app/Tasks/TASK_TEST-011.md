---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-011: [Unit] generateDailyReport 데이터 부족 처리 테스트"
labels: 'test, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-011] PIPE-005 데이터 부족 처리 로직 단위 테스트
- 목적: PIPE-005에서 구현하는 데이터 커버리지 계산과 `INSUFFICIENT_DATA` 분기가 하루 데이터 수집 시간이 5시간 미만일 때 정상 metrics 대신 null 값을 가진 DailyReport를 저장하는지 검증한다.
- 범위: 데이터 커버리지 계산, 5시간 경계값, `statusCode: "INSUFFICIENT_DATA"` 저장 계약. 수면 점수/방문 횟수/이상 징후 계산은 충분한 데이터일 때의 후속 PIPE-002~004 범위다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/all/TASK_PIPE-005.md`](./TASK_PIPE-005.md) — 데이터 수집 < 5시간 시 `INSUFFICIENT_DATA`
- 저장 대상: [`/TASKs/all/TASK_DB-005.md`](./TASK_DB-005.md) — `DailyReport.statusCode`, nullable metrics
- 후속 저장: [`/TASKs/all/TASK_PIPE-006.md`](./TASK_PIPE-006.md) — DailyReport 저장
- SRS 섹션: REQ-FUNC-018 AC
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-011

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/pipe/insufficientData.test.ts`
- [ ] 순수 함수 `calculateDataCoverageHours(events, targetDate)` 단위 테스트
- [ ] `saveInsufficientDataReport(deviceId, date)` 또는 `generateDailyReport` 분기 테스트에서 Prisma Mock 설정
- [ ] 테스트 fixture 작성:
  - 0건 이벤트
  - 4시간 30분 커버리지 이벤트
  - 정확히 5시간 커버리지 이벤트
  - 6시간 이상 커버리지 이벤트
- [ ] 테스트 케이스:
  - 4.5시간 데이터 → `INSUFFICIENT_DATA` 분기
  - 0건 이벤트 → `INSUFFICIENT_DATA` 보고서 저장
  - 정확히 5시간 → 정상 파이프라인으로 진행
  - `INSUFFICIENT_DATA` 저장값은 `sleepScore: null`, `bathroomVisitCount: null`, `aiSummary: null`, `anomalyFlags: "[]"`
  - 데이터 부족이어도 `prisma.dailyReport.create`는 호출됨
- [ ] 기존의 “이벤트 수 144개 미만” 같은 count 기반 임계값을 사용하지 않도록 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 4시간 30분 데이터 → INSUFFICIENT_DATA**
- Given: 하루 WellnessEvent가 4.5시간 범위에만 존재함
- When: `generateDailyReport(deviceId, date)`를 실행함
- Then: `prisma.dailyReport.create`가 `statusCode: "INSUFFICIENT_DATA"`, `sleepScore: null`, `bathroomVisitCount: null`로 호출된다.

**Scenario 2: 이벤트 0건 → INSUFFICIENT_DATA 보고서 저장**
- Given: 해당 날짜 WellnessEvent가 0건
- When: `generateDailyReport(deviceId, date)`를 실행함
- Then: DailyReport 레코드가 생성되고 `statusCode`는 `"INSUFFICIENT_DATA"`이다.

**Scenario 3: 정확히 5시간 → 정상 처리**
- Given: 이벤트 커버리지가 정확히 5.0시간
- When: 데이터 부족 분기 체크를 실행함
- Then: `INSUFFICIENT_DATA` 분기로 진입하지 않고 PIPE-002~004 정상 계산을 진행한다.

**Scenario 4: 저장 스키마 일치**
- Given: `INSUFFICIENT_DATA` 분기 결과
- When: DailyReport 저장 payload를 검증함
- Then: DB-005 기준 필드만 사용하며 `dataQuality` 같은 미정의 필드를 저장하지 않는다.

## :gear: Technical & Non-Functional Constraints
- **임계값:** 수집 커버리지 `< 5시간`이면 데이터 부족. 정확히 5시간은 정상 처리
- **저장 보장:** 데이터 부족이어도 DailyReport를 반드시 생성한다. DB 저장 스킵 금지
- **필드명:** `statusCode`, `sleepScore`, `bathroomVisitCount`, `anomalyFlags`, `aiSummary` 기준
- **순수 함수 테스트:** coverage 계산은 DB 없이 테스트하고, 저장 분기는 Prisma Mock으로 검증
- **시간 계산:** 테스트에서 `jest.setSystemTime()` 또는 고정 timestamp fixture로 timezone 변동을 제거

## :checkered_flag: Definition of Done (DoD)
- [ ] 0건, 4.5시간, 5.0시간, 6시간 이상 케이스가 모두 구현되었는가?
- [ ] `INSUFFICIENT_DATA` 시 DailyReport가 저장됨을 검증하는가?
- [ ] nullable metrics와 `anomalyFlags: "[]"` 저장 payload가 DB-005와 일치하는가?
- [ ] count 기반 임계값(예: 144개)이나 `dataQuality` 미정의 필드를 사용하지 않는가?
- [ ] 모든 관련 테스트가 GREEN인가?

## :construction: Dependencies & Blockers
- **Depends on:** PIPE-005, DB-005
- **Blocks:** PIPE-006 저장 검증
- **주의:** 데이터 부족 판단은 이벤트 개수가 아니라 시간 커버리지 기준이다. 5분 간격 이벤트 60건이어도 5시간에 걸쳐 수집되었으면 정상 처리 경계에 해당한다.
