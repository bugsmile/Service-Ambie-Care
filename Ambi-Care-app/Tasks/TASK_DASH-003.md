---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DASH-003: Dashboard API Polling — 30초 간격 자동 갱신 구현"
labels: 'feature, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [DASH-003] Dashboard 30초 간격 API Polling 자동 갱신
- 목적: B2B Dashboard가 별도의 페이지 새로고침 없이 30초마다 최신 디바이스 상태를 자동으로 가져와 화면을 갱신함으로써, 시설 관리자가 실시간에 가까운 모니터링을 수행할 수 있도록 한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Client Apps (GAP-01: API Polling)
- 기능 요구사항: REQ-FUNC-011 — 30초 자동 갱신
- GAP 분석: GAP-01 — WebSocket 대신 API Polling 사용 (Vercel Hobby 제약)
- API: [`/TASKs/TASK_DASH-001.md`](./TASK_DASH-001.md) — GET /api/dashboard/status
- 페이지: [`/TASKs/TASK_DASH-002.md`](./TASK_DASH-002.md) — Dashboard UI 페이지
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DASH-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `components/dashboard/dashboard-polling.tsx` — Client Component (`"use client"`) 생성
- [ ] `useState`로 디바이스 데이터 상태 관리, `useEffect`로 Polling 루프 설정
- [ ] `setInterval` 또는 SWR `refreshInterval` 옵션으로 30초 간격 `fetch('/api/dashboard/status')` 호출 구현
  - SWR 사용 시: `useSWR('/api/dashboard/status', fetcher, { refreshInterval: 30000 })`
  - `setInterval` 사용 시: cleanup 함수에서 `clearInterval` 필수
- [ ] Polling 중 에러 발생 시 이전 데이터 유지 (stale-while-revalidate 패턴)
- [ ] 브라우저 탭 비활성화(`visibilitychange` API) 시 Polling 일시 정지 → 활성화 시 즉시 재갱신
- [ ] 마지막 갱신 시간 UI 표시 — `"마지막 업데이트: {time}"` 텍스트 (상단 우측)
- [ ] Polling 상태 표시 — 갱신 중 로딩 인디케이터 (subtle spinner 또는 애니메이션 도트)
- [ ] `app/(admin)/dashboard/page.tsx`에 `<DashboardPolling />` 통합

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 30초 자동 갱신 동작**
- Given: 대시보드 페이지가 열려 있고 30초가 경과함
- When: `setInterval` 또는 SWR의 자동 갱신이 트리거됨
- Then: `GET /api/dashboard/status` 가 다시 호출되고 UI에 최신 데이터가 반영된다.

**Scenario 2: 탭 비활성화 시 Polling 중지**
- Given: 대시보드 탭이 백그라운드(비활성)로 전환됨
- When: 30초가 경과함
- Then: Polling 요청이 발생하지 않는다 (불필요한 네트워크 낭비 방지).

**Scenario 3: 탭 재활성화 시 즉시 갱신**
- Given: 탭이 비활성 상태에서 다시 활성화됨
- When: `visibilitychange` 이벤트가 발생함
- Then: 즉시 `GET /api/dashboard/status`를 호출하여 최신 상태를 가져온다.

**Scenario 4: 네트워크 에러 시 이전 데이터 유지**
- Given: 30초 갱신 시 API 호출이 네트워크 오류로 실패함
- When: fetch 에러가 발생함
- Then: 이전에 표시되던 디바이스 데이터가 그대로 유지되고, 에러 토스트 메시지가 표시된다.

## :gear: Technical & Non-Functional Constraints
- **GAP-01 준수:** WebSocket 실시간 연결 불가 (Vercel Hobby 제약) → API Polling으로 대체
- **Polling 간격:** 정확히 30,000ms (30초) — 더 짧은 간격은 Supabase Free DB 연결 한도 초과 위험
- **메모리 누수 방지:** 컴포넌트 언마운트 시 반드시 `clearInterval` 또는 SWR 구독 해제
- **SWR 권장:** `swr` 패키지 사용 시 내장 `refreshInterval`, `revalidateOnFocus`, `dedupingInterval` 옵션 활용 가능

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 30초마다 정확히 API가 재호출되는가? (브라우저 Network 탭으로 확인)
- [ ] 탭 비활성화 시 Polling이 중지되고, 활성화 시 즉시 재개되는가?
- [ ] 컴포넌트 언마운트 시 메모리 누수가 없는가? (React DevTools로 확인)
- [ ] 네트워크 오류 발생 시 UI가 크래시 없이 이전 데이터를 유지하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DASH-001 (GET /api/dashboard/status API), TASK_DASH-002 (Dashboard UI 페이지)
- **Blocks:** TASK_TEST-009 (B2B Dashboard API Polling 통합 테스트)
- **참고:** SWR vs `setInterval` 선택은 팀 컨벤션에 따르되, SWR 사용 시 `swr` 패키지를 `package.json`에 추가해야 한다.
