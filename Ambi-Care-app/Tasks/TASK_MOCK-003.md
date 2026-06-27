---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] MOCK-003: prisma/seed.ts — Mock DailyReport 7일치 생성"
labels: 'feature, mock-data, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [MOCK-003] `prisma/seed.ts` — Mock DailyReport 7일치 생성 (sleepScore 60~95 랜덤, bathroomVisitCount 1~5 랜덤, 하드코딩된 AI 요약 3~5개 문장)
- 목적: Guardian Portal의 일간 보고서 상세 화면과 AI 요약 표시 UI를 Gemini API 호출 없이 개발하기 위한 Mock DailyReport 데이터를 생성하여, Phase 1~2 프론트엔드 개발을 unblock한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock DailyReport 사양
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sample Mock Data (mockAISummaries 5개)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — DailyReport 모델 필드
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — MOCK-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/seed.ts`에 DailyReport 생성 함수 추가
- [ ] 생성 규격:
  - **기간:** 7일 (오늘 기준 7일 전 ~ 어제)
  - **디바이스 수:** ACTIVE 디바이스 2~3개
  - **총 보고서:** 2~3 디바이스 × 7일 = **14~21개**
- [ ] 각 보고서 필드 생성 규칙:
  - `sleepScore`: 60~95 랜덤 정수 (약 15% 확률로 `null` — INSUFFICIENT_DATA 시뮬레이션)
  - `bathroomVisitCount`: 1~5 랜덤 정수 (약 15% 확률로 `null`)
  - `anomalyFlags`: 대부분 `"[]"`, 약 20% 확률로 `'["LONG_BATHROOM_DWELL"]'` 또는 `'["HIGH_VISIT_COUNT"]'`
  - `statusCode`: 약 80% `"NORMAL"`, 15% `"INSUFFICIENT_DATA"`, 5% `"SENSOR_ERROR"`
  - `aiSummary`: SRS §14.2의 mockAISummaries 5개 중 랜덤 선택
  - `generatedAt`: 해당 날짜 06:00 KST (Cron 실행 시뮬레이션)
  - `date`: 해당 일자 00:00 UTC
- [ ] Mock AI Summary 하드코딩 (SRS §14.2 원문):
  ```typescript
  const mockAISummaries = [
    "Your family member slept well for 7.5 hours last night. Used the bathroom 2 times (within normal range). No anomalies detected.",
    "Your family member had a slightly restless night with 5.5 hours of sleep. Bathroom visits were 4 times, slightly above average. Consider a check-in today.",
    "Your family member had a good rest with 8 hours of sleep. Bathroom usage was normal at 1 time. Everything looks healthy.",
    "Insufficient data collected today. Your family member may not have been home. We'll resume monitoring when activity is detected.",
    "⚠️ Bathroom dwell time is 50% longer than usual. We recommend checking on your family member.",
  ]
  ```
- [ ] `statusCode === "INSUFFICIENT_DATA"` 시 `sleepScore: null`, `bathroomVisitCount: null`, `aiSummary`: 4번째 요약 사용
- [ ] `@@unique([deviceId, date])` 제약 고려 — 동일 디바이스+날짜 중복 방지
- [ ] INACTIVE 디바이스(dev-003)에 대해서는 보고서 미생성 또는 `SENSOR_ERROR` 상태로 생성

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 7일치 DailyReport 생성**
- Given: MOCK-001 Seed가 완료되어 3개 디바이스가 존재함
- When: MOCK-003 Seed를 실행함
- Then: 약 14~21개의 DailyReport가 생성된다.

**Scenario 2: sleepScore 범위 검증**
- Given: Seed 실행 완료
- When: 모든 DailyReport의 sleepScore를 조회함
- Then: null이 아닌 값은 모두 60~95 범위 내이다.

**Scenario 3: aiSummary 하드코딩 검증**
- Given: Seed 실행 완료
- When: DailyReport의 aiSummary를 조회함
- Then: SRS §14.2의 5개 요약 중 하나가 포함되어 있다.

**Scenario 4: INSUFFICIENT_DATA 보고서**
- Given: statusCode가 `INSUFFICIENT_DATA`인 보고서가 존재함
- When: 해당 보고서를 조회함
- Then: `sleepScore: null`, `bathroomVisitCount: null`이고, aiSummary에 "Insufficient data" 문구가 포함된다.

**Scenario 5: unique 제약 준수**
- Given: Seed 실행 완료
- When: 동일 deviceId + date 조합의 중복을 확인함
- Then: 중복 0건이다.

## :gear: Technical & Non-Functional Constraints
- **anomalyFlags 형식:** JSON 배열 문자열 — `"[]"` 또는 `'["LONG_BATHROOM_DWELL"]'`
- **aiSummary:** Gemini 호출 없이 하드코딩 — Phase 2 이전 개발용
- **unique 제약:** `@@unique([deviceId, date])` — 중복 방지
- **시간대:** `generatedAt`은 KST 06:00 시뮬레이션 (UTC 21:00 전일)
- **Phase:** Phase 0

## :checkered_flag: Definition of Done (DoD)
- [ ] 7일치 DailyReport가 정상 생성되는가?
- [ ] sleepScore, bathroomVisitCount 범위가 SRS 사양과 일치하는가?
- [ ] mockAISummaries 5개가 정상 랜덤 배정되는가?
- [ ] INSUFFICIENT_DATA/SENSOR_ERROR 상태가 적절히 포함되는가?
- [ ] unique 제약(deviceId + date)이 위반되지 않는가?

## :construction: Dependencies & Blockers
- **Depends on:** MOCK-001 (SensorDevice Seed 완료)
- **Blocks:** RPT-001~005 (Guardian 보고서 UI 개발), DASH-002 (대시보드 UI)
- **참고:** MOCK-002(WellnessEvent)와 독립적으로 실행 가능하나, 동일 Seed 스크립트 내에서 순차 실행이 권장됩니다 (MOCK-001 → MOCK-002 → MOCK-003 순서).
