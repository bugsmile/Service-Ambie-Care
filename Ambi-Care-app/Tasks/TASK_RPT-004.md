---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] RPT-004: DailyReportCard — 일간 보고서 카드 컴포넌트 (AI 요약 포함)"
labels: 'feature, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [RPT-004] `daily-report-card.tsx` 재사용 보고서 카드 컴포넌트 구현
- 목적: Guardian 홈 대시보드(RPT-002)와 일간 보고서 상세 페이지(RPT-003) 양쪽에서 재사용되는 일간 웰니스 보고서 카드 컴포넌트를 구현하여, 수면 점수·화장실 방문 횟수·AI 요약을 일관된 UI로 표시한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`components/reports/`)
- 데이터 모델: [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md) — DailyReport 모델 필드
- API 계약: [`/TASKs/TASK_API-002.md`](./TASK_API-002.md) — Daily Report Response DTO
- 사용 페이지: [`/TASKs/TASK_RPT-002.md`](./TASK_RPT-002.md) — Guardian 홈 대시보드
- 사용 페이지: [`/TASKs/TASK_RPT-003.md`](./TASK_RPT-003.md) — 일간 보고서 상세 페이지
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — RPT-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `components/reports/daily-report-card.tsx` 파일 생성
- [ ] Props 타입 정의:
  ```typescript
  interface DailyReportCardProps {
    date: string;               // YYYY-MM-DD
    sleepScore: number | null;
    bathroomVisitCount: number | null;
    statusCode: string;         // "NORMAL" | "INSUFFICIENT_DATA" | "ANOMALY_DETECTED"
    aiSummary: string | null;
    anomalyFlags: string[];     // JSON 배열
  }
  ```
- [ ] 수면 점수 시각화 — shadcn/ui `Progress` 컴포넌트 또는 원형 게이지 (0~100 범위, 색상: 80↑ green, 60~79 yellow, 60↓ red)
- [ ] 화장실 방문 횟수 표시 — 아이콘(🚿 또는 SVG) + 숫자 + "회" 단위
- [ ] `statusCode` 텍스트 매핑:
  - `"NORMAL"` → "정상"
  - `"INSUFFICIENT_DATA"` → "데이터 부족 (5시간 미만 수집)"
  - `"ANOMALY_DETECTED"` → "이상 징후 감지"
- [ ] AI 요약 섹션 — 텍스트 표시 영역, `aiSummary: null` 시 "AI 요약을 불러오는 중입니다." 표시
- [ ] `anomalyFlags` 배열이 비어있지 않으면 경고 아이콘(⚠) + 플래그 항목 목록 표시
- [ ] 데이터 없음(`sleepScore: null`) 상태 — "—" 또는 "데이터 없음" 표시
- [ ] shadcn/ui `Card`, `CardHeader`, `CardContent`, `CardFooter` 레이아웃 구조 사용

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 데이터 카드 렌더링**
- Given: `sleepScore: 82`, `bathroomVisitCount: 3`, `statusCode: "NORMAL"`, `aiSummary: "오늘 수면 상태가 양호합니다."`, `anomalyFlags: []` Props 전달
- When: `<DailyReportCard />` 렌더링
- Then: 초록색 진행 바(82%), "3회", "정상", AI 요약 텍스트가 모두 표시된다.

**Scenario 2: INSUFFICIENT_DATA 상태**
- Given: `statusCode: "INSUFFICIENT_DATA"`, `sleepScore: null`, `bathroomVisitCount: null` Props 전달
- When: `<DailyReportCard />` 렌더링
- Then: "데이터 부족 (5시간 미만 수집)" 텍스트가 표시되고, 수치 필드는 "—"로 표시된다.

**Scenario 3: AI 요약 Null Fallback**
- Given: `aiSummary: null` Props 전달
- When: `<DailyReportCard />` 렌더링
- Then: "AI 요약을 불러오는 중입니다." fallback 텍스트가 표시되며 UI가 정상 렌더링된다.

**Scenario 4: 이상 징후 플래그 표시**
- Given: `anomalyFlags: ["화장실 체류 시간 이상 (평균 +65%)"]` Props 전달
- When: `<DailyReportCard />` 렌더링
- Then: 경고 아이콘과 함께 해당 플래그 항목이 표시된다.

**Scenario 5: 수면 점수 색상 분기**
- Given: `sleepScore: 55` (60 미만) Props 전달
- When: `<DailyReportCard />` 렌더링
- Then: 진행 바 색상이 red 계열로 표시된다.

## :gear: Technical & Non-Functional Constraints
- **순수 컴포넌트:** Props만으로 렌더링 — 내부 API fetch 금지
- **재사용성:** `components/reports/` 하위에 배치 — Guardian Portal 전용 컴포넌트
- **Null 안전성:** `sleepScore`, `bathroomVisitCount`, `aiSummary` 모두 `null` 가능 — 모든 null 케이스를 안전하게 처리
- **UI 라이브러리:** shadcn/ui `Card`, `Progress`, `Badge` 사용 — CON-09

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 3가지 statusCode 텍스트 매핑이 모두 정확한가?
- [ ] `sleepScore` 범위별(80↑/60~79/60↓) 색상이 정확하게 분기되는가?
- [ ] `aiSummary: null`, `sleepScore: null` 등 모든 null 케이스가 안전하게 처리되는가?
- [ ] RPT-002와 RPT-003 양쪽에서 동일 컴포넌트를 재사용하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001 (shadcn/ui 설치), TASK_DB-005 (DailyReport 필드 타입), TASK_API-002 (Response DTO)
- **Blocks:** TASK_RPT-002 (Guardian 홈 대시보드), TASK_RPT-003 (일간 보고서 상세 페이지)
- **참고:** `statusCode` 값 목록은 Phase 2의 PIPE-005에서 최종 확정되므로, 현재는 `"NORMAL"`, `"INSUFFICIENT_DATA"`, `"ANOMALY_DETECTED"` 3가지를 처리하되 unknown 값에 대한 fallback 텍스트도 구현한다.
