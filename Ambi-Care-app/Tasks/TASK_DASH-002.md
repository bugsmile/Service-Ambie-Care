---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DASH-002: B2B Dashboard — Traffic Light 다중 침대 모니터링 UI"
labels: 'feature, frontend, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [DASH-002] Traffic Light 다중 침대 모니터링 UI 페이지 구현
- 목적: 시설 관리자가 한 화면에서 모든 침대(디바이스)의 실시간 상태를 신호등 색상(Red/Yellow/Green)으로 직관적으로 파악할 수 있도록, `app/(admin)/dashboard/page.tsx`를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Client Apps (B2B Dashboard)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 1 Core UI
- 기능 요구사항: REQ-FUNC-011 — Traffic Light 다중 침대 모니터링
- API: [`/TASKs/TASK_DASH-001.md`](./TASK_DASH-001.md) — GET /api/dashboard/status
- 컴포넌트: [`/TASKs/TASK_DASH-004.md`](./TASK_DASH-004.md) — traffic-light-card 컴포넌트
- 레이아웃: [`/TASKs/TASK_UI-003.md`](./TASK_UI-003.md) — Admin Layout
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DASH-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/(admin)/dashboard/page.tsx` 파일 생성 (Server Component 기본, Polling은 Client Component로 분리)
- [ ] 초기 데이터 로드 — 서버 사이드에서 `GET /api/dashboard/status` 호출 또는 Prisma 직접 쿼리
- [ ] `<TrafficLightCard />` 컴포넌트 사용하여 디바이스 목록 그리드 렌더링 (반응형: 모바일 1열, 태블릿 2열, 데스크톱 3~4열)
- [ ] 상태별 색상 매핑 로직 구현:
  - `ACTIVE` + 최신 이벤트 없음 → Green (정상)
  - `ACTIVE` + `ACTIVITY_ALERT` 이벤트 → Yellow (주의)
  - `ACTIVE` + `EMERGENCY` 이벤트 → Red (긴급)
  - `INACTIVE` → Red (오프라인)
- [ ] shadcn/ui `Badge` 컴포넌트로 상태 표시 (색상 variant 매핑)
- [ ] 상단 요약 섹션 — 전체 디바이스 수, 활성/비활성 수, 긴급 알림 수 표시
- [ ] 디바이스 카드 클릭 시 `locationZone`, `lastHeartbeatAt`, `latestEvent.eventType` 상세 정보 표시 (Tooltip 또는 Dialog)
- [ ] 로딩 스켈레톤 UI (`loading.tsx`) 추가
- [ ] 빈 상태(디바이스 0개) UI 처리

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 상태 디바이스 Green 표시**
- Given: `status: "ACTIVE"`, 최근 15분 내 Heartbeat 수신, EMERGENCY 이벤트 없음
- When: 대시보드 페이지에 접근함
- Then: 해당 디바이스 카드가 Green 색상 Badge로 표시된다.

**Scenario 2: 긴급 이벤트 디바이스 Red 표시**
- Given: `latestEvent.eventType: "EMERGENCY"` 인 디바이스가 존재함
- When: 대시보드 페이지에 접근함
- Then: 해당 디바이스 카드가 Red 색상 Badge로 표시되고 시각적으로 강조된다.

**Scenario 3: 오프라인 디바이스 Red 표시**
- Given: `status: "INACTIVE"` 인 디바이스 (15분+ Heartbeat 미수신)
- When: 대시보드 페이지에 접근함
- Then: 해당 디바이스 카드가 Red 색상 Badge + "오프라인" 레이블로 표시된다.

**Scenario 4: 반응형 레이아웃**
- Given: 모바일(375px), 태블릿(768px), 데스크톱(1280px) 뷰포트
- When: 각 화면 크기에서 대시보드에 접근함
- Then: 모바일 1열, 태블릿 2열, 데스크톱 3열 이상 그리드가 정상적으로 렌더링된다.

## :gear: Technical & Non-Functional Constraints
- **복잡도:** H (High) — 상태 매핑 로직 + 반응형 그리드 + 실시간 Polling 연동 필요
- **성능:** 초기 페이지 로드 LCP ≤ 3,000ms
- **접근성:** 색상만으로 상태를 구분하지 않고 텍스트 레이블 병행 표시 (색맹 사용자 고려)
- **UI 라이브러리:** shadcn/ui `Badge`, `Card`, `Skeleton` 컴포넌트 사용 필수 — CON-09
- **인증 보호:** `(admin)` 라우트 그룹은 FACILITY_ADMIN 역할만 접근 가능 (미들웨어 또는 서버 컴포넌트 내 세션 체크)

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] Red/Yellow/Green 색상 매핑이 모든 status 조합에서 정확하게 동작하는가?
- [ ] 반응형 그리드가 모바일/태블릿/데스크톱에서 정상 렌더링되는가?
- [ ] `loading.tsx` 스켈레톤 UI가 데이터 로딩 중 표시되는가?
- [ ] 인증되지 않은 접근 시 로그인 페이지로 리다이렉트되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?
- [ ] TASK_TEST-009 (B2B Dashboard API Polling 테스트)와 연계 동작이 확인되는가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DASH-001 (Status API), TASK_DASH-004 (TrafficLightCard 컴포넌트), TASK_UI-003 (Admin Layout), TASK_INFRA-001 (shadcn/ui 설치)
- **Blocks:** TASK_DASH-003 (API Polling), TASK_DASH-005 (이벤트 로그), TASK_TEST-009 (Dashboard Polling 테스트)
- **참고:** 상태 색상 매핑 로직은 TASK_DASH-004 (`traffic-light-card.tsx`) 컴포넌트 내에 캡슐화하는 것을 권장한다.
