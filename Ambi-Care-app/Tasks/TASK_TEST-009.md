---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-009: [Integration] B2B Dashboard Polling 통합 테스트"
labels: 'test, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-009] B2B Dashboard 30초 Polling 통합 테스트
- 목적: DASH-002(Traffic Light UI)와 DASH-003(Polling 로직)이 30초 간격으로 `/api/dashboard/status`를 호출하고, 상태 변경 시 UI가 올바르게 업데이트되는지 통합 테스트로 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_DASH-002.md`](./TASK_DASH-002.md) — Traffic Light UI 컴포넌트
- 테스트 대상: [`/TASKs/TASK_DASH-003.md`](./TASK_DASH-003.md) — Polling 로직
- API 계약: [`/TASKs/all/TASK_API-003.md`](./TASK_API-003.md) — Dashboard Status API
- SRS 섹션: §5.1.2 Real-time Polling, NFR-PERF-002
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-009

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/integration/dashboard-polling.test.tsx`
- [ ] `@testing-library/react` + `msw` (Mock Service Worker) 설정
- [ ] `jest.useFakeTimers()` — 30초 interval 시뮬레이션
- [ ] 테스트 케이스:
  - 초기 마운트 시 즉시 API 호출 1회 확인
  - 30초 경과 후 추가 API 호출 발생 확인
  - API 응답 GREEN → TrafficLight 초록색 렌더링
  - API 응답 변경 RED → UI 업데이트 확인
  - 컴포넌트 언마운트 시 polling interval 정리 확인 (메모리 누수 방지)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 초기 로드 시 즉시 API 호출**
- Given: Dashboard 페이지 마운트
- When: 렌더링 완료
- Then: `/api/dashboard/status` 1회 호출, 상태 표시

**Scenario 2: 30초 후 재조회**
- Given: Dashboard 마운트 후 30초 경과 (fake timer)
- When: interval 트리거
- Then: API 2번째 호출, UI 최신 상태 반영

**Scenario 3: 상태 변경 시 UI 업데이트**
- Given: 첫 응답 GREEN, 두 번째 응답 RED
- When: 30초 후 polling
- Then: UI가 RED 상태로 업데이트

## :gear: Technical & Non-Functional Constraints
- **HTTP Mock:** `msw` 또는 `fetch` mock
- **Timer:** `jest.useFakeTimers()` + `jest.advanceTimersByTime(30000)`
- **Cleanup:** `afterEach` interval 정리 확인

## :checkered_flag: Definition of Done (DoD)
- [ ] polling 초기 호출/재호출/UI 업데이트/cleanup 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] 메모리 누수(interval 미정리) 없음 확인?
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
- **Depends on:** TASK_DASH-002, TASK_DASH-003
- **Blocks:** 없음
