---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] ENH-003: Triage 엔진 — 클라이언트 위험도 계산 + 우선순위 정렬 + 시각/사운드 큐"
labels: 'feature, frontend, backend, priority:high, phase:3'
assignees: ''
---

## :dart: Summary
- 기능명: [ENH-003] Triage 엔진 — 위험도 기반 자동 우선순위 정렬 및 최상위 케이스 강조
- 목적: B2B Dashboard에서 3개 이상 동시 긴급 이벤트 발생 시, 각 디바이스의 risk score를 계산하여 우선순위를 자동 정렬하고, 최상위 케이스에 시각적 강조(펄스 애니메이션) 및 사운드 큐를 제공하는 `lib/triage.ts` 엔진을 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 3 Enhancements
- 기능 요구사항: REQ-FUNC-012 — Triage 엔진
- 의존 페이지: [`/TASKs/TASK_DASH-002.md`](./TASK_DASH-002.md) — B2B Dashboard UI
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — ENH-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/triage.ts` 파일 생성 — 순수 계산 함수로 분리
- [ ] `calculateRiskScore(device: DeviceWithLatestEvent): number` 구현:
  - `EMERGENCY` + `INACTIVE` → 100점
  - `EMERGENCY` + `ACTIVE` → 90점
  - `INACTIVE` → 70점
  - `ACTIVITY_ALERT` + 최근 5분 이내 → 50점
  - `ACTIVITY_ALERT` + 5분 이상 경과 → 30점
  - 정상 → 0점
  - `confidenceScore` 가중치 반영: `score * confidenceScore`
- [ ] `triageDevices(devices: DeviceWithLatestEvent[]): TriagedDevice[]` 구현:
  - 각 디바이스 `riskScore` 계산 → 내림차순 정렬
  - 반환: `{ ...device, riskScore, rank: number, isTopPriority: boolean }`
  - `isTopPriority: true` — 상위 3건이면서 `riskScore >= 70`인 경우
- [ ] `app/(admin)/dashboard/page.tsx`에 `triageDevices()` 적용 — `devices` 배열 정렬 후 `<TrafficLightCard />` 렌더링
- [ ] 최상위 케이스 시각 큐:
  - `isTopPriority: true` 카드에 `ring-2 ring-red-500 animate-pulse` 강조 테두리
  - 카드 상단에 `"⚡ 우선 케이스 #1"` 뱃지 표시
- [ ] 사운드 큐 — `isTopPriority` 디바이스 존재 시 Web Audio API로 경고음 1회 재생:
  - `new Audio('/alert.mp3').play()` — `public/alert.mp3` 파일 추가
  - 브라우저 자동 재생 정책 고려: 사용자 인터랙션 후 첫 Polling 갱신 시만 재생

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 3개 이상 동시 긴급 이벤트 → risk score 기반 정렬**
- Given: 3개 디바이스에 동시 EMERGENCY 이벤트 (각기 다른 confidenceScore)
- When: `triageDevices(devices)` 호출
- Then: `riskScore` 내림차순으로 정렬되고, 최상위 케이스에 `isTopPriority: true`가 설정된다.

**Scenario 2: 최상위 케이스 시각 강조**
- Given: `isTopPriority: true` 인 디바이스 카드
- When: Dashboard 렌더링
- Then: 해당 카드에 빨간 테두리(`ring-red-500`) + `animate-pulse` + `"⚡ 우선 케이스 #1"` 뱃지가 표시된다.

**Scenario 3: 긴급 이벤트 2개 이하 — Triage 발동 안 함**
- Given: EMERGENCY 디바이스 2개 이하
- When: `triageDevices()` 호출
- Then: `isTopPriority: false`로 모두 반환 (3개 미만 시 Triage 미발동).

**Scenario 4: 사운드 큐 재생**
- Given: `isTopPriority` 디바이스가 1개 이상, 사용자가 이전에 클릭한 이력 있음
- When: Polling 갱신으로 긴급 이벤트 감지
- Then: 경고음이 1회 재생된다.

## :gear: Technical & Non-Functional Constraints
- **복잡도:** H (High) — risk score 알고리즘 + 정렬 + 시각/사운드 큐 통합
- **순수 함수:** `lib/triage.ts`는 외부 의존성 없음 — 단위 테스트 용이
- **사운드 정책:** 브라우저 자동 재생 차단 대응 — 사용자 인터랙션 이후에만 재생 시도
- **성능:** 클라이언트 사이드 계산 — 디바이스 수 증가에도 O(n log n) 정렬로 충분

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `triageDevices()`가 `lib/triage.ts`에 순수 함수로 구현되었는가?
- [ ] 3개 이상 긴급 이벤트 시에만 Triage가 발동되는가?
- [ ] 최상위 케이스 시각 강조(테두리 + 뱃지)가 표시되는가?
- [ ] TASK_TEST-018 (Triage 정렬 테스트)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DASH-002 (Dashboard UI), TASK_DASH-004 (TrafficLightCard), TASK_ENH-002 (필터 — 정렬 연계)
- **Blocks:** TASK_TEST-018
