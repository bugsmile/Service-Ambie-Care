---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] RPT-003: 일간 보고서 상세 페이지 — app/(guardian)/reports/[date]/page.tsx"
labels: 'feature, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [RPT-003] 일간 보고서 상세 페이지 구현
- 목적: Guardian이 특정 날짜를 선택하여 해당 날짜의 상세 웰니스 보고서를 확인할 수 있는 전용 페이지(`app/(guardian)/reports/[date]/page.tsx`)를 구현한다. 홈 대시보드(RPT-002)가 "오늘"을 보여준다면, 이 페이지는 "과거 임의 날짜"의 보고서를 제공한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 1 Core UI
- API: [`/TASKs/TASK_RPT-001.md`](./TASK_RPT-001.md) — GET /api/reports/daily/[deviceId]/[date]
- 컴포넌트: [`/TASKs/TASK_RPT-004.md`](./TASK_RPT-004.md) — DailyReportCard
- 컴포넌트: [`/TASKs/TASK_RPT-005.md`](./TASK_RPT-005.md) — AnomalyAlert
- 레이아웃: [`/TASKs/TASK_UI-002.md`](./TASK_UI-002.md) — Guardian Layout
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — RPT-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/(guardian)/reports/[date]/page.tsx` — Server Component로 생성
- [ ] `params.date` 유효성 검증 — `YYYY-MM-DD` 형식 검증, 미래 날짜 또는 30일 초과 과거 날짜 접근 시 redirect 또는 404
- [ ] 세션에서 `deviceId` 추출 후 `RPT-001` API 호출 또는 Prisma 직접 쿼리
- [ ] 보고서 없음(404) 처리 — "해당 날짜의 보고서가 없습니다" + 이전/다음 날 이동 버튼
- [ ] 페이지 상단 날짜 표시 — 한국어 포맷 (예: `2026년 4월 21일 (화)`)
- [ ] `<DailyReportCard />` 컴포넌트로 상세 데이터 렌더링 (RPT-002와 동일 컴포넌트 재사용)
- [ ] `<AnomalyAlert />` 컴포넌트 — anomalyFlags 존재 시 표시
- [ ] 날짜 네비게이션 UI — `←이전 날` / `다음 날→` 버튼으로 인접 날짜 이동
- [ ] "보고서 목록으로" 링크 — `app/(guardian)/reports/page.tsx` (향후 구현 예정) 또는 홈으로 이동
- [ ] `generateMetadata()` — 페이지 타이틀 `"2026년 4월 21일 웰니스 보고서 | Rooted"` 동적 생성

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 유효한 날짜 보고서 조회**
- Given: 인증된 Guardian, `date: "2026-04-21"`, 해당 날짜 보고서 존재
- When: `/reports/2026-04-21`에 접근함
- Then: 해당 날짜의 sleepScore, bathroomVisitCount, anomalyFlags, aiSummary가 표시된다.

**Scenario 2: 보고서 없는 날짜 접근**
- Given: 인증된 Guardian, 보고서가 없는 날짜 (`date: "2026-04-10"`)
- When: `/reports/2026-04-10`에 접근함
- Then: "해당 날짜의 보고서가 없습니다" 안내 메시지와 이전/다음 날 이동 버튼이 표시된다.

**Scenario 3: 날짜 네비게이션**
- Given: 현재 `/reports/2026-04-21` 페이지
- When: `← 이전 날` 버튼 클릭
- Then: `/reports/2026-04-20`으로 이동한다.

**Scenario 4: 30일 초과 과거 날짜 접근**
- Given: 오늘로부터 31일 이전 날짜 (`date: "2026-03-20"`)
- When: 해당 URL에 직접 접근함
- Then: 404 또는 "데이터 보존 기간(30일)을 초과한 날짜입니다" 안내 메시지가 표시된다.

**Scenario 5: 동적 메타데이터**
- Given: `/reports/2026-04-21` 페이지 로드
- When: 브라우저 탭 제목 확인
- Then: `"2026년 4월 21일 웰니스 보고서 | Rooted"` 형식으로 표시된다.

## :gear: Technical & Non-Functional Constraints
- **30일 데이터 보존:** TASK_DB-008의 자동 삭제 정책과 일치하여 30일 초과 날짜 접근 차단 또는 안내
- **날짜 포맷:** `date-fns` 또는 `Intl.DateTimeFormat`으로 한국어 날짜 포맷 처리
- **동적 라우트:** `[date]` 세그먼트는 `YYYY-MM-DD` 패턴만 유효 — `generateStaticParams()` 사용 불가 (동적 데이터)
- **SEO:** `generateMetadata()` 함수로 페이지별 타이틀/description 동적 생성

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 30일 초과 날짜 접근 시 적절한 처리가 이루어지는가?
- [ ] 날짜 네비게이션(이전/다음 날)이 정상 동작하는가?
- [ ] `generateMetadata()`로 페이지별 타이틀이 동적 생성되는가?
- [ ] `<DailyReportCard />`와 `<AnomalyAlert />`가 RPT-002와 동일하게 재사용되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_RPT-001 (Daily Report API), TASK_RPT-004 (DailyReportCard), TASK_RPT-005 (AnomalyAlert), TASK_UI-002 (Guardian Layout)
- **Blocks:** TASK_FA-003 (False Alarm 버튼 — 이 페이지에 추가 예정)
- **참고:** 날짜 네비게이션에서 "다음 날" 버튼은 오늘 이후 미래 날짜로의 이동을 비활성화해야 한다.
