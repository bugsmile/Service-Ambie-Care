---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] ENH-002: 대시보드 필터 — shadcn/ui DataTable (병실/우선순위 그룹핑)"
labels: 'feature, frontend, priority:medium, phase:3'
assignees: ''
---

## :dart: Summary
- 기능명: [ENH-002] B2B Dashboard 디바이스 필터 및 그룹핑 기능
- 목적: 시설 관리자가 다수의 디바이스를 병실(`locationZone`) 기준으로 그룹핑하거나, 우선순위(긴급/주의/정상) 기준으로 필터링할 수 있도록 shadcn/ui DataTable 기반의 필터 컴포넌트를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 3 Enhancements
- 기능 요구사항: FR-08, REQ-FUNC-023 — 대시보드 필터
- 의존 페이지: [`/TASKs/TASK_DASH-002.md`](./TASK_DASH-002.md) — B2B Dashboard UI
- 컴포넌트: [`/TASKs/TASK_DASH-004.md`](./TASK_DASH-004.md) — TrafficLightCard
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — ENH-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `components/dashboard/device-filter.tsx` — Client Component 생성
- [ ] 필터 상태 관리: `useState`로 `{ zone: string | 'ALL', priority: 'ALL' | 'CRITICAL' | 'WARNING' | 'NORMAL' }`
- [ ] `locationZone` 기반 그룹핑 — 유니크 zone 목록 추출 → shadcn/ui `Select` 드롭다운
- [ ] 우선순위 필터 — shadcn/ui `ToggleGroup` 또는 `Tabs` (전체 / 긴급 / 주의 / 정상)
- [ ] 필터링 로직: 클라이언트 사이드에서 `devices` 배열을 조건에 따라 filter
- [ ] 필터 결과 개수 표시 — "3/10개 디바이스 표시 중"
- [ ] 필터 초기화 버튼 — "필터 초기화"
- [ ] `app/(admin)/dashboard/page.tsx`에 `<DeviceFilter />` + 필터된 `devices` 전달 통합
- [ ] URL 쿼리 파라미터에 필터 상태 동기화 (`?zone=A동&priority=CRITICAL`) — 새로고침 후 유지

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: locationZone 필터링**
- Given: 디바이스 10개 중 "A동" 4개, "B동" 6개
- When: `locationZone: "A동"` 필터 선택
- Then: "A동" 4개 디바이스만 그리드에 표시되고 "4/10개 표시 중" 카운트가 나타난다.

**Scenario 2: 긴급(CRITICAL) 우선순위 필터**
- Given: 디바이스 10개 중 EMERGENCY 상태 2개
- When: 우선순위 필터 "긴급" 선택
- Then: EMERGENCY 상태 2개 디바이스만 표시된다.

**Scenario 3: 복합 필터 (zone + priority)**
- Given: 필터 zone="A동" + priority="CRITICAL" 동시 적용
- When: 두 조건 모두 활성화
- Then: "A동"이면서 EMERGENCY 상태인 디바이스만 표시된다.

**Scenario 4: 필터 초기화**
- Given: zone + priority 필터 적용 상태
- When: "필터 초기화" 버튼 클릭
- Then: 모든 필터가 해제되고 전체 디바이스가 표시된다.

## :gear: Technical & Non-Functional Constraints
- **클라이언트 사이드 필터링:** 서버 재요청 없이 메모리 내 배열 필터로 즉각 반응
- **URL 동기화:** `useSearchParams`, `useRouter`로 필터 상태를 URL에 반영 — 페이지 공유/북마크 가능
- **UI:** shadcn/ui `Select`, `ToggleGroup`, `Badge` 컴포넌트 사용

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] zone + priority 복합 필터가 동작하는가?
- [ ] 필터 상태가 URL 쿼리 파라미터에 동기화되는가?
- [ ] 필터 초기화 버튼이 동작하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 필터 상태, URL/query 동기화, 빈 결과 상태, 접근성 라벨을 구현 범위에 포함한다.
- **추가 Edge Cases:** 필터 0건, 다중 필터 조합, 모바일 폭, 새로고침 후 상태 복원, 권한 없는 사용자를 검증한다.
- **검증 증거:** 컴포넌트 테스트, 브라우저 수동 확인, 주요 viewport 스크린샷을 작업 결과에 남긴다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DASH-002 (Dashboard UI — devices 배열 데이터), TASK_DASH-004 (TrafficLightCard)
- **Blocks:** TASK_ENH-003 (Triage 엔진 — 우선순위 정렬과 연계)
