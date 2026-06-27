---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] RPT-002: Guardian 홈 대시보드 — 일일 요약 + AI 서술 표시 UI"
labels: 'feature, frontend, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [RPT-002] Guardian 홈 대시보드 페이지 (`app/(guardian)/dashboard/page.tsx`) 구현
- 목적: Guardian(보호자)이 앱 진입 시 가장 먼저 보게 되는 홈 화면으로, 오늘의 일간 웰니스 요약(수면 점수, 화장실 방문, 이상 징후)과 AI가 생성한 서술 요약을 직관적으로 확인할 수 있도록 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Client Apps (Guardian Portal)
- 기능 요구사항: FR-05 (UI) — Guardian 홈 대시보드
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 1 Core UI
- API: [`/TASKs/TASK_RPT-001.md`](./TASK_RPT-001.md) — GET /api/reports/daily/[deviceId]/[date]
- 컴포넌트: [`/TASKs/TASK_RPT-004.md`](./TASK_RPT-004.md) — DailyReportCard
- 컴포넌트: [`/TASKs/TASK_RPT-005.md`](./TASK_RPT-005.md) — AnomalyAlert
- 레이아웃: [`/TASKs/TASK_UI-002.md`](./TASK_UI-002.md) — Guardian Layout
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — RPT-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/(guardian)/dashboard/page.tsx` — Server Component로 생성
- [ ] 서버 사이드에서 `getServerSession()` 으로 세션 확인 및 `deviceId` 추출 (UserDevice 조회)
- [ ] 오늘 날짜(UTC 기준)로 `GET /api/reports/daily/{deviceId}/{today}` 또는 Prisma 직접 쿼리
- [ ] `<DailyReportCard />` 컴포넌트로 오늘의 요약 카드 렌더링:
  - 수면 점수 (sleepScore) — 숫자 + 진행 바 또는 원형 게이지
  - 화장실 방문 횟수 (bathroomVisitCount) — 아이콘 + 숫자
  - 상태 코드 (statusCode) — "정상" / "데이터 부족" 등 텍스트 매핑
- [ ] AI 서술 요약 섹션 — `aiSummary` 텍스트 표시 (없으면 "요약을 준비 중입니다" fallback)
- [ ] `<AnomalyAlert />` 컴포넌트 — `anomalyFlags` 존재 시 경고 배너 표시
- [ ] "오늘의 보고서 없음" 빈 상태 처리 — "아직 오늘의 보고서가 생성되지 않았습니다" 안내
- [ ] "과거 보고서 보기" 링크 — `/reports` 페이지로 이동
- [ ] 디바이스 연결 없음 상태 처리 — `UserDevice` 없는 Guardian에게 안내 메시지
- [ ] `loading.tsx` 스켈레톤 UI 추가

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 오늘 보고서가 있는 경우**
- Given: 인증된 Guardian, 오늘 날짜의 DailyReport가 DB에 존재함
- When: Guardian 홈 대시보드에 접근함
- Then: sleepScore, bathroomVisitCount, aiSummary가 카드 형태로 표시된다.

**Scenario 2: 이상 징후 경고 표시**
- Given: 오늘 보고서의 `anomalyFlags`에 이상 징후 항목이 1개 이상 있음
- When: Guardian 홈 대시보드에 접근함
- Then: `<AnomalyAlert />` 경고 배너가 카드 상단에 표시된다.

**Scenario 3: 오늘 보고서 미생성 상태**
- Given: 오늘 날짜의 DailyReport가 DB에 없음 (예: 오전 6시 이전, Cron 미실행)
- When: Guardian 홈 대시보드에 접근함
- Then: "아직 오늘의 보고서가 생성되지 않았습니다" 안내 메시지와 어제 보고서 링크가 표시된다.

**Scenario 4: AI 요약 없음 Fallback**
- Given: 오늘 보고서의 `aiSummary` 필드가 `null`임 (Gemini API 실패 등)
- When: Guardian 홈 대시보드에 접근함
- Then: "AI 요약을 준비 중입니다" fallback 텍스트가 표시되며 UI가 크래시 없이 정상 표시된다.

**Scenario 5: 로딩 스켈레톤**
- Given: 페이지 데이터 로딩 중
- When: `loading.tsx` 가 렌더링됨
- Then: 카드 영역에 Skeleton 컴포넌트가 표시된다.

## :gear: Technical & Non-Functional Constraints
- **복잡도:** H (High) — 복합 데이터 로직 + 다중 컴포넌트 조합 + 다양한 빈 상태 처리
- **성능:** 초기 LCP ≤ 3,000ms
- **오늘 날짜:** 서버 타임존 의존 방지를 위해 `date-fns` 또는 `dayjs` 사용하여 UTC 날짜 계산 권장
- **인증 보호:** `(guardian)` 라우트 그룹의 `layout.tsx` (UI-002)에서 인증 처리 — 이 페이지에서 중복 검증 불필요
- **복수 디바이스:** Guardian이 복수 디바이스를 소유한 경우 디바이스 선택 드롭다운 표시 (또는 첫 번째 디바이스 기본 선택)

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `anomalyFlags` 존재 시 경고 배너가 표시되는가?
- [ ] `aiSummary: null` 시 UI 크래시 없이 fallback이 표시되는가?
- [ ] 오늘 보고서 없음 상태가 안내 메시지로 처리되는가?
- [ ] `loading.tsx` 스켈레톤이 표시되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_RPT-001 (Daily Report 조회 API), TASK_RPT-004 (DailyReportCard), TASK_RPT-005 (AnomalyAlert), TASK_UI-002 (Guardian Layout), TASK_INFRA-001 (shadcn/ui)
- **Blocks:** TASK_FA-003 (False Alarm 피드백 UI — RPT-002 페이지에 버튼 추가), TASK_TEST-009 연계
- **참고:** `aiSummary` 필드는 Phase 2 AI-003 완료 전까지 MOCK-003 시드 데이터의 하드코딩된 텍스트로 표시된다.
