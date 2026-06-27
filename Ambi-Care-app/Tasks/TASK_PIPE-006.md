---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] PIPE-006: generateDailyReport — Prisma dailyReport.create() 저장"
labels: 'feature, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [PIPE-006] DailyReport DB 저장 — `dailyReport.upsert()` 구현
- 목적: PIPE-002~005에서 계산된 모든 지표(sleepScore, bathroomVisitCount, anomalyFlags, statusCode, aiSummary)를 Prisma `dailyReport.upsert()`로 DB에 원자적으로 저장하는 파이프라인 최종 단계를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sequence: Daily Report Generation (저장 단계)
- 데이터 모델: [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md) — DailyReport 모델 전체 필드
- 선행 계산: [`/TASKs/TASK_PIPE-002.md`](./TASK_PIPE-002.md) — sleepScore
- 선행 계산: [`/TASKs/TASK_PIPE-003.md`](./TASK_PIPE-003.md) — bathroomVisitCount, anomalyFlags
- 선행 계산: [`/TASKs/TASK_PIPE-004.md`](./TASK_PIPE-004.md) — anomalyFlags (이상 징후)
- 선행 계산: [`/TASKs/TASK_PIPE-005.md`](./TASK_PIPE-005.md) — statusCode (INSUFFICIENT_DATA)
- AI 연동: [`/TASKs/TASK_AI-003.md`](./TASK_AI-003.md) — aiSummary (Phase 2 AI 통합 후)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — PIPE-006

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/actions/reports.ts` 내 `saveDailyReport()` 헬퍼 함수 구현 (또는 `generateDailyReport` 내 인라인)
- [ ] Prisma `dailyReport.upsert()` 쿼리 구현:
  ```typescript
  await prisma.dailyReport.upsert({
    where: { deviceId_date: { deviceId, date: targetDate } },
    update: {
      sleepScore,
      bathroomVisitCount,
      anomalyFlags: JSON.stringify(anomalyFlags),
      statusCode,
      aiSummary
    },
    create: {
      deviceId,
      date: targetDate,
      sleepScore,
      bathroomVisitCount,
      anomalyFlags: JSON.stringify(anomalyFlags),
      statusCode,
      aiSummary
    }
  })
  ```
- [ ] `anomalyFlags` 배열을 JSON 문자열로 직렬화 (`JSON.stringify`) — DB 저장 전
- [ ] `aiSummary` 필드 처리 — Phase 2 AI-003 통합 전까지 `null`로 저장
- [ ] 저장 성공 시 `reportId` (cuid) 반환
- [ ] Prisma 에러 처리 — `PrismaClientKnownRequestError` 캐치 + 에러 로깅
- [ ] `generateDailyReport` 완료 후 EMAIL-002 (`sendDailyReport`) 트리거 호출

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 신규 DailyReport 생성**
- Given: 해당 `deviceId + date` 조합의 DailyReport가 DB에 없음
- When: `saveDailyReport({ deviceId, date, sleepScore: 78, bathroomVisitCount: 3, ... })` 호출
- Then: DB에 새 DailyReport 레코드가 생성되고 `reportId`가 반환된다.

**Scenario 2: 기존 DailyReport upsert (재실행)**
- Given: 동일 `deviceId + date` 조합의 DailyReport가 이미 존재함
- When: `saveDailyReport()` 재호출 (예: Cron 재실행)
- Then: 기존 레코드가 업데이트되고 중복 레코드가 생성되지 않는다.

**Scenario 3: anomalyFlags 직렬화 저장**
- Given: `anomalyFlags: ["화장실 체류 시간 이상", "데이터 신뢰도 경고"]`
- When: `saveDailyReport()` 호출
- Then: DB의 `anomalyFlags` 컬럼에 `'["화장실 체류 시간 이상", "데이터 신뢰도 경고"]'` JSON 문자열이 저장된다.

**Scenario 4: aiSummary null 저장 허용**
- Given: AI-003 미완료 상태 (aiSummary 없음)
- When: `saveDailyReport({ ..., aiSummary: null })` 호출
- Then: DB에 `aiSummary: null` 로 저장되고 에러가 발생하지 않는다.

## :gear: Technical & Non-Functional Constraints
- **원자성:** `upsert` 단일 트랜잭션으로 저장 — 부분 저장 방지
- **복합 유니크 키:** `deviceId_date` 복합 인덱스 (`@@unique([deviceId, date])`) 사용 — DB-005에서 정의
- **anomalyFlags 타입:** Prisma 스키마에서 `String` 타입 (JSON 직렬화) — 조회 시 `JSON.parse()` 필요
- **멱등성:** 동일 입력으로 반복 실행 시 동일 결과 보장

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `upsert`로 중복 없이 신규 생성과 업데이트가 모두 처리되는가?
- [ ] `anomalyFlags` JSON 직렬화/역직렬화가 정확한가?
- [ ] `aiSummary: null` 저장이 에러 없이 처리되는가?
- [ ] Prisma 에러가 캐치되어 파이프라인이 크래시 없이 종료되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_PIPE-002 (sleepScore), TASK_PIPE-003 (bathroomVisitCount, anomalyFlags), TASK_PIPE-004 (anomalyFlags), TASK_PIPE-005 (statusCode), TASK_DB-005 (DailyReport 모델)
- **Blocks:** TASK_AI-003 (aiSummary 업데이트 — 저장된 reportId 필요), TASK_EMAIL-002 (보고서 완료 이메일 — 저장 완료 이벤트), TASK_PIPE-007 (Cron 트리거 — 파이프라인 완료 기준)
- **참고:** AI-003 완료 후, `aiSummary` 생성 → `dailyReport.update({ aiSummary })` 패턴으로 후속 업데이트한다. PIPE-006은 `aiSummary: null`로 우선 저장하고 AI-003에서 채워 넣는 구조를 지원해야 한다.
