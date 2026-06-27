---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] PIPE-004: generateDailyReport — 이상 징후 감지 (체류 시간 > 평균 +50%)"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [PIPE-004] 화장실 체류 시간 이상 징후 감지 로직 구현
- 목적: `generateDailyReport` 파이프라인 내에서 각 화장실 방문의 체류 시간을 분석하여, 평균 체류 시간 대비 50% 이상 초과하는 방문이 있을 경우 `anomaly_flag`를 설정하는 이상 징후 감지 로직을 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Daily Report Generation
- 기능 요구사항: REQ-FUNC-017 — 이상 징후 감지 (체류 시간 > 평균 +50%)
- 선행 태스크: [`/TASKs/TASK_PIPE-001.md`](./TASK_PIPE-001.md) — generateDailyReport 기반 구조
- 선행 태스크: [`/TASKs/TASK_PIPE-003.md`](./TASK_PIPE-003.md) — 화장실 방문 그룹핑 로직 재사용
- 후속 연동: [`/TASKs/TASK_AI-004.md`](./TASK_AI-004.md) — 이상 징후 AI 설명 생성
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — PIPE-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/report/anomaly-detection.ts` 파일 생성 — 순수 계산 함수로 분리
- [ ] `detectDwellTimeAnomaly(visitGroups: VisitGroup[]): { hasAnomaly: boolean; anomalyFlags: string[]; anomalyVisits: VisitGroup[] }` 함수 구현
- [ ] 방문 그룹별 체류 시간 계산 — 그룹 내 첫 이벤트 ~ 마지막 이벤트 시간 차이(분)
- [ ] 평균 체류 시간 계산 — `avgDwellTime = sum(dwellTimes) / visitGroups.length`
- [ ] 이상 징후 임계값 — `dwellTime > avgDwellTime * 1.5` (평균 +50% 초과)
- [ ] 이상 징후 발견 시 `anomalyFlags`에 추가:
  - `"화장실 체류 시간 이상 감지: ${visit.timestamp} (${dwellTime}분, 평균 ${Math.round(avgDwellTime)}분의 ${Math.round(ratio * 100)}%)"`
- [ ] `anomalyVisits` 목록 반환 — AI-004에서 상세 설명 생성에 사용
- [ ] 방문 횟수 1건 이하 시 비교 불가 → `{ hasAnomaly: false, anomalyFlags: [], anomalyVisits: [] }` 반환
- [ ] `generateDailyReport` (PIPE-001) 내에서 이 함수 호출 후 anomalyFlags 병합

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 이상 징후 감지 — 체류 시간 평균 +50% 초과**
- Given: 방문 그룹 4개의 체류 시간이 [10분, 12분, 11분, 20분], 평균 13.25분
- When: `detectDwellTimeAnomaly(visitGroups)` 호출
- Then: 20분 방문(평균의 151%)이 `hasAnomaly: true`와 함께 anomalyFlags에 포함된다.

**Scenario 2: 정상 범위 — 이상 징후 없음**
- Given: 방문 그룹 3개의 체류 시간이 [8분, 10분, 12분], 평균 10분
- When: `detectDwellTimeAnomaly(visitGroups)` 호출
- Then: 최대 12분(평균의 120%)으로 임계값 미만 → `{ hasAnomaly: false, anomalyFlags: [] }` 반환한다.

**Scenario 3: 방문 1건만 있을 때 비교 불가**
- Given: 방문 그룹이 1개만 존재함
- When: `detectDwellTimeAnomaly(visitGroups)` 호출
- Then: 비교 기준 없음으로 `{ hasAnomaly: false, anomalyFlags: [] }` 반환한다.

**Scenario 4: 경계값 — 정확히 +50% 초과**
- Given: 평균 10분, 특정 방문 15.1분 (150.1%)
- When: `detectDwellTimeAnomaly(visitGroups)` 호출
- Then: `hasAnomaly: true`로 플래그가 설정된다.

**Scenario 5: 정확히 +50% — 플래그 없음**
- Given: 평균 10분, 특정 방문 정확히 15분 (150%)
- When: `detectDwellTimeAnomaly(visitGroups)` 호출
- Then: `hasAnomaly: false` — "초과(strictly greater than)"이므로 플래그 없음.

## :gear: Technical & Non-Functional Constraints
- **임계값 정의:** `dwellTime > avgDwellTime * 1.5` (strictly greater than, ≤150%는 정상)
- **순수 함수:** 외부 의존성 없음 — 단위 테스트 용이
- **부동소수점:** 체류 시간 계산 시 밀리초 단위 연산 후 분으로 변환 (`Math.floor(ms / 60000)`)
- **AI 연동:** `anomalyVisits` 반환값은 AI-004에서 Gemini 자연어 설명 생성에 사용됨

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 경계값(`> 150%` vs `= 150%`)이 정확하게 처리되는가?
- [ ] 방문 1건 이하 엣지 케이스가 안전하게 처리되는가?
- [ ] `lib/report/anomaly-detection.ts`로 분리되어 독립 테스트 가능한가?
- [ ] TASK_TEST-013 (이상 징후 감지 테스트)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_PIPE-001 (generateDailyReport), TASK_PIPE-003 (방문 그룹핑 — VisitGroup 타입 공유)
- **Blocks:** TASK_PIPE-006 (DailyReport 저장 — anomalyFlags 값 필요), TASK_AI-004 (이상 징후 AI 설명 — anomalyVisits 사용), TASK_TEST-013
- **참고:** `VisitGroup` 타입은 PIPE-003과 PIPE-004에서 공유한다. `types/report.ts`에 정의하여 두 모듈에서 import하도록 구성한다.
