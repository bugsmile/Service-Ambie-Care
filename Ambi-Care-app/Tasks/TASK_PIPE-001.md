---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] PIPE-001: generateDailyReport Server Action — 전일 데이터 집계 파이프라인 기반 구현"
labels: 'feature, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [PIPE-001] `generateDailyReport` Server Action 기반 구조 구현
- 목적: 매일 자정(Cron) 이후 전날의 WellnessEvent 데이터를 집계하여 DailyReport를 생성하는 파이프라인의 핵심 진입점(`app/actions/reports.ts`)을 구현한다. 이 Server Action은 PIPE-002~006의 세부 로직을 오케스트레이션하는 파이프라인 컨트롤러 역할을 한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Action #3 generateDailyReport
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence Diagram: Daily Report Generation
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 2 Pipeline
- API 계약: [`/TASKs/TASK_API-008.md`](./TASK_API-008.md) — Server Action 인터페이스 정의
- 데이터 모델: [`/TASKs/TASK_DB-002.md`](./TASK_DB-002.md) — WellnessEvent 모델
- 데이터 모델: [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md) — DailyReport 모델
- 이벤트 수집: [`/TASKs/TASK_EVT-002.md`](./TASK_EVT-002.md) — createWellnessEvent
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — PIPE-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/actions/reports.ts` 파일 생성 (또는 기존 파일에 추가)
- [ ] `generateDailyReport(deviceId: string, targetDate?: Date)` 함수 시그니처 정의
  - `targetDate` 미제공 시 전날(어제) UTC 날짜 자동 계산
- [ ] 전날 날짜 범위 계산 — `dayStart = new Date(yesterday + 'T00:00:00.000Z')`, `dayEnd = new Date(yesterday + 'T23:59:59.999Z')`
- [ ] Prisma 데이터 집계 쿼리:
  ```typescript
  wellnessEvent.findMany({
    where: {
      deviceId,
      timestamp: { gte: dayStart, lte: dayEnd }
    },
    orderBy: { timestamp: 'asc' }
  })
  ```
- [ ] 수집 데이터 시간 범위 계산 — 첫 이벤트 ~ 마지막 이벤트 간격(시간)
- [ ] 파이프라인 분기:
  - 데이터 < 5시간 → `PIPE-005` 로직으로 `statusCode: "INSUFFICIENT_DATA"` 처리
  - 데이터 ≥ 5시간 → `PIPE-002`, `PIPE-003`, `PIPE-004` 로직 호출
- [ ] 중복 실행 방지 — 같은 `deviceId + date` 조합의 DailyReport 이미 존재 시 업데이트 또는 skip
- [ ] 에러 처리 — 각 세부 로직 실패 시 전체 파이프라인 중단 없이 부분 저장 후 에러 로깅
- [ ] 함수 반환값: `{ success: boolean; reportId?: string; error?: string }`

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 데이터로 보고서 생성 트리거**
- Given: 특정 `deviceId`에 대해 어제 날짜 기준 5시간 이상의 WellnessEvent가 존재함
- When: `generateDailyReport(deviceId)` 호출
- Then: PIPE-002~006 로직이 순서대로 실행되고 `{ success: true, reportId }` 반환 및 DailyReport가 DB에 생성된다.

**Scenario 2: 데이터 부족 시 INSUFFICIENT_DATA 처리**
- Given: 어제 WellnessEvent가 4시간 30분치만 존재함
- When: `generateDailyReport(deviceId)` 호출
- Then: `statusCode: "INSUFFICIENT_DATA"` 로 DailyReport가 저장되고 `{ success: true }` 반환한다.

**Scenario 3: 중복 실행 방지**
- Given: 같은 `deviceId + date` 조합의 DailyReport가 이미 DB에 존재함
- When: `generateDailyReport(deviceId)` 재호출
- Then: 중복 생성 없이 기존 레코드를 upsert 처리하고 `{ success: true }` 반환한다.

**Scenario 4: 이벤트 데이터 없음**
- Given: 어제 해당 `deviceId`의 WellnessEvent가 0건임
- When: `generateDailyReport(deviceId)` 호출
- Then: `statusCode: "INSUFFICIENT_DATA"`, sleepScore/bathroomVisitCount `null`로 저장되고 `{ success: true }` 반환한다.

## :gear: Technical & Non-Functional Constraints
- **복잡도:** H (High) — 멀티 스텝 파이프라인 오케스트레이션
- **타임존:** 전날 계산은 서버 UTC 기준으로 일관 처리 — 로컬 타임존 의존 금지
- **트랜잭션:** PIPE-006의 `dailyReport.create()` 저장은 단일 트랜잭션으로 처리
- **멱등성:** 동일 `deviceId + date`에 대해 반복 실행해도 동일 결과 보장 (`upsert` 사용)
- **성능:** 단일 디바이스 기준 전체 파이프라인 완료 ≤ 30,000ms (AI 호출 포함)

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] PIPE-002~006 세부 로직과의 인터페이스가 정의되어 연결 가능한가?
- [ ] `upsert` 로 중복 실행이 안전하게 처리되는가?
- [ ] UTC 기반 전날 날짜 계산이 정확한가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?
- [ ] TASK_TEST-010 (수면 점수 정확도 테스트) 연계 시 통과하는가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DB-005 (DailyReport 모델), TASK_DB-007 (마이그레이션), TASK_EVT-002 (createWellnessEvent), TASK_API-008 (Server Action 인터페이스)
- **Blocks:** TASK_PIPE-002~006 (세부 계산 로직), TASK_PIPE-007 (Cron Job 트리거), TASK_AI-003 (AI 요약 통합), TASK_EMAIL-002 (보고서 완료 이메일)
- **참고:** `generateDailyReport`는 모든 활성 디바이스에 대해 반복 호출되어야 한다. PIPE-007에서 Cron Job이 `sensorDevice.findMany({ where: { status: 'ACTIVE' } })`로 전체 디바이스를 순회하며 이 함수를 호출한다.
