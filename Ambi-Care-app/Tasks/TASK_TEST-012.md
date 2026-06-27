---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-012: [Unit] generateDailyReport 이상치 필터링 테스트"
labels: 'test, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-012] `generateDailyReport` 화장실 방문 이상치 필터링 테스트
- 목적: PIPE-003에서 구현하는 `bathroomVisitCount` 산출 로직이 정상 방문 횟수를 계산하고, 하루 화장실 방문 횟수가 50회 이상일 때 `anomalyFlags`에 데이터 신뢰도 경고를 추가하는지 검증한다.
- 범위: PIPE-003의 방문 그룹핑/카운팅/이상치 플래그 로직. 장시간 체류 기반 이상 징후 감지와 AI 설명 생성은 PIPE-004/AI-004/TEST-013 범위다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/all/TASK_PIPE-003.md`](./TASK_PIPE-003.md) — 화장실 방문 횟수 카운팅 + 이상치 필터링
- 저장 대상: [`/TASKs/all/TASK_DB-005.md`](./TASK_DB-005.md) — `DailyReport.bathroomVisitCount`, `anomalyFlags`
- 후속 저장: [`/TASKs/all/TASK_PIPE-006.md`](./TASK_PIPE-006.md) — `DailyReport` 저장
- SRS 섹션: REQ-FUNC-019 AC
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-012

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/pipe/bathroomVisitCount.test.ts`
- [ ] PIPE-003의 순수 함수 또는 추출 가능한 함수(`countBathroomVisits`, `calculateBathroomMetrics` 등)를 단위 테스트 대상으로 지정
- [ ] Mock WellnessEvent fixture 작성:
  - 정상 방문 3회 데이터
  - 방문 이벤트 49회 데이터
  - 방문 이벤트 50회 데이터
  - 방문 이벤트 52회 데이터
  - false alarm 처리 이벤트(`isFalseAlarm: true`)가 포함된 데이터
- [ ] 테스트 케이스:
  - 정상 이벤트 그룹 → `bathroomVisitCount` 정확히 산출
  - 방문 횟수 49회 → 신뢰도 경고 없음
  - 방문 횟수 50회 → `anomalyFlags`에 데이터 신뢰도 경고 추가
  - 방문 횟수 52회 → 경고 플래그에 실제 count가 포함됨
  - `isFalseAlarm: true` 이벤트는 방문 횟수 산정에서 제외
  - 이벤트가 없으면 `{ count: 0, anomalyFlags: [] }`
- [ ] JSON 저장 전 단계에서 `anomalyFlags` 배열을 반환하고, PIPE-006에서 문자열화하는 책임 분리 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 방문 횟수 산출**
- Given: 하루 동안 화장실 방문으로 그룹핑 가능한 이벤트 3회
- When: `countBathroomVisits(events)`를 호출함
- Then: `{ count: 3, anomalyFlags: [] }`를 반환한다.

**Scenario 2: 49회 방문은 경고 없음**
- Given: 하루 화장실 방문 횟수가 49회인 이벤트 세트
- When: `countBathroomVisits(events)`를 호출함
- Then: `count`는 49이고 `anomalyFlags`는 빈 배열이다.

**Scenario 3: 50회 이상 방문 시 신뢰도 경고**
- Given: 하루 화장실 방문 횟수가 50회인 이벤트 세트
- When: `countBathroomVisits(events)`를 호출함
- Then: `anomalyFlags`에 `"데이터 신뢰도 경고"` 또는 프로젝트 표준 warning code가 포함된다.

**Scenario 4: false alarm 이벤트 제외**
- Given: 방문 이벤트 중 일부가 `isFalseAlarm: true`로 표시됨
- When: `countBathroomVisits(events)`를 호출함
- Then: false alarm 이벤트는 count에 포함되지 않는다.

**Scenario 5: DailyReport 저장값 연계**
- Given: PIPE-003 결과가 `{ count: 52, anomalyFlags: [...] }`
- When: PIPE-006이 DailyReport를 저장함
- Then: `bathroomVisitCount: 52`, `anomalyFlags: JSON.stringify([...])` 형태로 저장 가능해야 한다.

## :gear: Technical & Non-Functional Constraints
- **필드명:** `falseAlarm`이 아니라 `isFalseAlarm`, `anomalyFlag` 단수 boolean이 아니라 `anomalyFlags` 배열/JSON 문자열을 기준으로 검증
- **임계값:** `bathroomVisitCount >= 50`부터 데이터 신뢰도 경고
- **순수 함수 우선:** DB 접근 없이 이벤트 배열 입력 → metrics 출력 형태로 테스트
- **경계값:** 49/50 케이스를 반드시 포함
- **책임 분리:** 장시간 체류 이상 감지(PIPE-004)와 AI 설명 생성(TEST-013)을 이 테스트에 섞지 않는다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 정상 count, 49회, 50회, 52회, false alarm 제외, 빈 배열 케이스가 모두 구현되었는가?
- [ ] `isFalseAlarm`, `bathroomVisitCount`, `anomalyFlags` 필드명이 SRS/DB 명세와 일치하는가?
- [ ] `npm test` 또는 `npm run test:unit`에서 TEST-012 관련 테스트가 GREEN인가?
- [ ] PIPE-003과 PIPE-006의 반환/저장 계약이 테스트로 깨지지 않게 보호되는가?

## :construction: Dependencies & Blockers
- **Depends on:** PIPE-003, DB-005
- **Blocks:** PIPE-006 저장 검증, TEST-013 이상 징후 + AI 설명 테스트
- **주의:** confidenceScore 기반 이벤트 필터링이나 연속 ALERT 감지는 이 task의 원본 범위가 아니다. 해당 로직이 필요하면 PIPE-004 또는 별도 enhancement task에서 다룬다.
