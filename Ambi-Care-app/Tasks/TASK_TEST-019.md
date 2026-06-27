---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-019: [Unit] 수면 트렌드 차트 렌더링 테스트"
labels: 'test, frontend, priority:low, phase:3'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-019] ENH-001 Recharts 수면 트렌드 차트 렌더링 단위 테스트
- 목적: ENH-001에서 구현한 SleepTrendChart 컴포넌트가 7일 DailyReport 데이터를 올바르게 시각화하고, 데이터 없음/로딩 상태를 올바르게 처리하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_ENH-001.md`](./TASK_ENH-001.md) — SleepTrendChart 컴포넌트
- SRS 섹션: §5.3.3 Sleep Trend Visualization, Phase 3 Enhancement
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-019

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/components/SleepTrendChart.test.tsx`
- [ ] `@testing-library/react` + `jest-environment-jsdom` 설정
- [ ] Recharts `ResponsiveContainer` Mock (jsdom SVG 미지원 대응)
- [ ] 테스트 케이스:
  - 7개 DailyReport 데이터 전달 → 7개 데이터 포인트 렌더링 확인
  - 빈 배열 전달 → "데이터 없음" fallback 텍스트 렌더링
  - `isLoading: true` prop → 로딩 스피너/스켈레톤 렌더링
  - `sleepScore` 값이 차트에 올바르게 반영 (aria-label 또는 data-testid)
  - 날짜 x축 레이블 형식 확인 (`MM/DD`)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 데이터 렌더링**
- Given: 7개 DailyReport 배열 (sleepScore 포함)
- When: `<SleepTrendChart data={reports} />` 렌더링
- Then: 7개 데이터 포인트, x축 날짜 레이블 존재

**Scenario 2: 빈 데이터 → fallback**
- Given: 빈 배열 `[]`
- When: `<SleepTrendChart data={[]} />` 렌더링
- Then: "데이터가 없습니다" 텍스트 렌더링

**Scenario 3: 로딩 상태**
- Given: `isLoading: true`
- When: 컴포넌트 렌더링
- Then: 로딩 인디케이터 표시, 차트 미렌더링

## :gear: Technical & Non-Functional Constraints
- **Recharts Mock:** `jest.mock('recharts')` — jsdom SVG 한계 우회
- **접근성:** `role="img"` 또는 `aria-label`로 차트 존재 검증
- **스냅샷 테스트:** 선택적 — 스냅샷보다 동작 기반 테스트 우선

## :checkered_flag: Definition of Done (DoD)
- [ ] 정상 렌더링/빈 데이터/로딩 상태 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] Recharts jsdom 환경 에러 없음?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.
- **리뷰 체크포인트:**
  - 구현 파일 경로가 Task Breakdown과 일치하는지 확인한다.
  - 실패 케이스가 Acceptance Criteria 또는 테스트에 반영되었는지 확인한다.
  - SRS 금지어 및 PII 노출 규칙을 재확인한다.
  - 외부 서비스 의존성이 mock/fallback으로 검증 가능한지 확인한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_ENH-001
- **Blocks:** 없음
