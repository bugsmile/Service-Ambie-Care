---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] RPT-005: AnomalyAlert — 이상 징후 경고 컴포넌트 (shadcn/ui Alert)"
labels: 'feature, frontend, priority:low, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [RPT-005] `anomaly-alert.tsx` 이상 징후 경고 컴포넌트 구현
- 목적: 일간 보고서에서 이상 징후(`anomalyFlags`)가 감지된 경우 Guardian에게 시각적으로 명확히 경고를 전달하는 Alert 컴포넌트를 구현한다. shadcn/ui `Alert` 컴포넌트를 기반으로 하며, Guardian 홈 대시보드(RPT-002)와 일간 보고서 상세 페이지(RPT-003)에서 재사용된다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`components/reports/`)
- 기능 요구사항: REQ-FUNC-019 — 이상 징후 경고 표시
- 데이터 모델: [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md) — DailyReport.anomalyFlags (JSON)
- 사용 페이지: [`/TASKs/TASK_RPT-002.md`](./TASK_RPT-002.md) — Guardian 홈 대시보드
- 사용 페이지: [`/TASKs/TASK_RPT-003.md`](./TASK_RPT-003.md) — 일간 보고서 상세 페이지
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — RPT-005

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `components/reports/anomaly-alert.tsx` 파일 생성
- [ ] Props 타입 정의:
  ```typescript
  interface AnomalyAlertProps {
    anomalyFlags: string[];     // 이상 징후 항목 배열
    date?: string;              // 표시용 날짜 (옵션)
  }
  ```
- [ ] `anomalyFlags.length === 0` 시 컴포넌트를 렌더링하지 않음 (`return null`)
- [ ] shadcn/ui `Alert` + `AlertTitle` + `AlertDescription` 컴포넌트 사용
- [ ] Alert variant: `destructive` (빨간 계열) 사용
- [ ] `AlertTitle` — "이상 징후 감지" 고정 텍스트
- [ ] `AlertDescription` — `anomalyFlags` 배열을 `<ul>/<li>` 목록으로 렌더링
- [ ] 경고 아이콘 — shadcn/ui 또는 lucide-react의 `AlertTriangle` 아이콘 사용
- [ ] 복수 항목 처리 — 2개 이상의 flags가 있을 때도 모두 목록으로 표시
- [ ] 접근성 — `role="alert"` 속성으로 스크린 리더에 경고 전달

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 이상 징후 1개 표시**
- Given: `anomalyFlags: ["화장실 체류 시간 이상 (평균 +65%)"]` Props 전달
- When: `<AnomalyAlert />` 렌더링
- Then: "이상 징후 감지" 타이틀과 해당 플래그 텍스트가 빨간 Alert 박스로 표시된다.

**Scenario 2: 이상 징후 복수 개 표시**
- Given: `anomalyFlags: ["화장실 체류 시간 이상", "데이터 신뢰도 경고 (방문 횟수 ≥50)"]` Props 전달
- When: `<AnomalyAlert />` 렌더링
- Then: 2개의 플래그 항목이 목록 형태로 모두 표시된다.

**Scenario 3: 이상 징후 없음 — 렌더링 안 함**
- Given: `anomalyFlags: []` Props 전달
- When: `<AnomalyAlert />` 렌더링
- Then: 컴포넌트가 DOM에 렌더링되지 않는다 (빈 공간 없음).

**Scenario 4: 접근성 확인**
- Given: `anomalyFlags`가 1개 이상 있는 경우
- When: `<AnomalyAlert />` 렌더링
- Then: 컴포넌트에 `role="alert"` 속성이 있어 스크린 리더가 경고를 인식한다.

## :gear: Technical & Non-Functional Constraints
- **순수 컴포넌트:** Props만으로 렌더링 — 내부 상태/API 호출 금지
- **조건부 렌더링:** `anomalyFlags` 빈 배열 시 `null` 반환으로 레이아웃 깨짐 방지
- **UI 라이브러리:** shadcn/ui `Alert` (`destructive` variant) 필수 — CON-09
- **아이콘:** `lucide-react`의 `AlertTriangle` (Next.js 프로젝트에 기본 포함)
- **접근성:** `role="alert"`로 스크린 리더 지원 — WCAG 2.1 기준

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `anomalyFlags: []` 시 컴포넌트가 렌더링되지 않는가?
- [ ] 복수 flags가 목록으로 모두 표시되는가?
- [ ] `role="alert"` 접근성 속성이 적용되는가?
- [ ] shadcn/ui `Alert destructive` variant가 사용되었는가?
- [ ] RPT-002와 RPT-003 양쪽에서 재사용되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001 (shadcn/ui `Alert` 컴포넌트 설치), TASK_DB-005 (anomalyFlags JSON 타입)
- **Blocks:** TASK_RPT-002 (Guardian 홈 대시보드), TASK_RPT-003 (일간 보고서 상세 페이지)
- **참고:** `anomalyFlags`의 실제 문자열 값 형식은 Phase 2의 PIPE-003(화장실 이상치 필터링)과 PIPE-004(이상 징후 감지 로직)에서 결정된다. Phase 1에서는 MOCK-003의 하드코딩 데이터로 표시 형식을 검증한다.
