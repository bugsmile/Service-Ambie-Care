---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] ENH-001: 수면 트렌드 차트 — Recharts 기반 주간/월간 타임라인 시각화"
labels: 'feature, frontend, priority:medium, phase:3'
assignees: ''
---

## :dart: Summary
- 기능명: [ENH-001] 수면 트렌드 Recharts 차트 컴포넌트 구현
- 목적: Guardian이 7일 이상의 `sleepScore` 추이를 Recharts 기반의 라인/바 차트로 시각화하여, 수면 패턴 변화를 한눈에 파악할 수 있도록 한다. 데이터 부족 시 안내 메시지를 표시한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 3 Enhancements
- 기능 요구사항: FR-06, REQ-FUNC-021 — 수면 트렌드 차트
- API: [`/TASKs/TASK_RPT-001.md`](./TASK_RPT-001.md) — GET /api/reports/daily (복수 날짜 조회 확장 필요)
- 데이터 모델: [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md) — DailyReport.sleepScore
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — ENH-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 패키지 설치: `npm install recharts`
- [ ] `app/api/reports/daily/[deviceId]/route.ts` — 기간 범위 쿼리 엔드포인트 추가 또는 신규 생성
  - Query params: `startDate`, `endDate` (최대 30일)
  - Response: `DailyReport[]` 배열
- [ ] `components/reports/sleep-trend-chart.tsx` — Client Component 생성
- [ ] Props:
  ```typescript
  interface SleepTrendChartProps {
    reports: { date: string; sleepScore: number | null }[];
    period?: '7d' | '14d' | '30d';
  }
  ```
- [ ] Recharts `LineChart` 또는 `BarChart` 구현:
  - X축: 날짜 (MM/DD 포맷)
  - Y축: 수면 점수 (0~100)
  - 데이터 포인트: `sleepScore` null → 점선 처리 또는 gap
  - Tooltip: 날짜 + 점수 표시
  - 참조선(ReferenceLine): 80점 "양호 기준선" 점선 표시
- [ ] 기간 선택 탭 UI — shadcn/ui `Tabs` (7일 / 14일 / 30일)
- [ ] 데이터 7일 미만 시 "트렌드 분석을 위해 7일 이상의 데이터가 필요합니다" 안내
- [ ] `app/(guardian)/dashboard/page.tsx` 또는 별도 `/trends` 페이지에 통합

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 7일+ 데이터 차트 렌더링**
- Given: 최근 7일간 `sleepScore` 데이터가 모두 존재
- When: `<SleepTrendChart reports={...} period="7d" />` 렌더링
- Then: 7개 데이터 포인트를 가진 라인/바 차트가 정상 표시된다.

**Scenario 2: 데이터 7일 미만 — 안내 메시지**
- Given: `reports` 배열에 5개 항목만 존재
- When: `<SleepTrendChart />` 렌더링
- Then: 차트 대신 "7일 이상의 데이터가 필요합니다" 안내 메시지가 표시된다.

**Scenario 3: null sleepScore 처리**
- Given: 특정 날짜 `sleepScore: null` (INSUFFICIENT_DATA)
- When: 차트 렌더링
- Then: 해당 날짜의 데이터 포인트가 gap(빈칸)으로 표시되거나 점선으로 연결된다.

**Scenario 4: 기간 선택 탭 전환**
- Given: 현재 7일 탭 선택 상태
- When: "30일" 탭 클릭
- Then: API에서 30일치 데이터를 재조회하고 차트가 업데이트된다.

## :gear: Technical & Non-Functional Constraints
- **라이브러리:** Recharts 필수 (CON-09 범위 내, 추가 설치 필요) — `npm install recharts`
- **반응형:** 모바일에서도 차트 가로 스크롤 또는 축소 렌더링
- **Client Component:** Recharts는 클라이언트 사이드 렌더링 전용 → `"use client"` 필수
- **데이터 캐싱:** SWR 또는 `fetch` 캐싱으로 기간 전환 시 불필요한 재요청 방지

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 7일 미만 데이터 시 안내 메시지가 표시되는가?
- [ ] `null` 데이터 포인트가 안전하게 처리되는가?
- [ ] 기간 선택(7d/14d/30d)이 동작하는가?
- [ ] TASK_TEST-019 (차트 렌더링 테스트)가 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_RPT-001 (Daily Report API — 복수 날짜 조회 확장), TASK_DB-005 (DailyReport.sleepScore)
- **Blocks:** TASK_TEST-019
