---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] PIPE-007: Vercel Cron Job → generateDailyReport 트리거 연동"
labels: 'feature, infra, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [PIPE-007] Vercel Cron Job과 `generateDailyReport` 파이프라인 연동
- 목적: 매일 1회(UTC 기준 오전 1시) 자동으로 모든 활성 디바이스에 대해 `generateDailyReport`를 실행하는 Vercel Cron Job 엔드포인트를 구현하고, `vercel.json`에 스케줄을 등록한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 2 Pipeline
- 제약사항: CON-13 — Vercel Hobby Cron Job 1일 1회 제한
- 제약사항: DEP-05 — Vercel Cron Job 의존
- 기능 요구사항: REQ-FUNC-020 — 일간 보고서 자동 생성
- Cron Job 설정: [`/TASKs/TASK_INFRA-003.md`](./TASK_INFRA-003.md) — vercel.json Cron 설정
- 파이프라인: [`/TASKs/TASK_PIPE-001.md`](./TASK_PIPE-001.md) — generateDailyReport Server Action
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — PIPE-007

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/cron/daily-report/route.ts` — Cron Job 트리거 API 라우트 생성
- [ ] Cron 요청 인증 — `Authorization: Bearer ${CRON_SECRET}` 헤더 검증 (Vercel Cron Job 자동 주입)
  - 미인증 요청 → 401 반환
- [ ] 전체 활성 디바이스 조회:
  ```typescript
  const devices = await prisma.sensorDevice.findMany({
    where: { status: 'ACTIVE' }
  })
  ```
- [ ] 디바이스별 `generateDailyReport(device.id)` 순차 또는 병렬 실행:
  - 디바이스 수 ≤ 10개: `Promise.all()` 병렬 실행
  - 디바이스 수 > 10개: 청크 단위 병렬 실행 (Supabase Free 연결 한도 고려)
- [ ] 각 디바이스 실행 결과 집계 — `{ success: number, failed: number, results: [...] }`
- [ ] 실행 완료 로그 출력 — `console.log('[Cron] Daily report generation completed:', summary)`
- [ ] `vercel.json` Cron 스케줄 확인:
  ```json
  {
    "crons": [{ "path": "/api/cron/daily-report", "schedule": "0 1 * * *" }]
  }
  ```
- [ ] 개별 디바이스 실패 시 전체 중단 없이 계속 진행 (`try/catch` per device)
- [ ] 응답: `200 OK` + `{ processed: n, succeeded: n, failed: n }`

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 유효한 Cron 요청 — 모든 디바이스 보고서 생성**
- Given: 활성 디바이스 3개, 유효한 `CRON_SECRET` 포함 요청
- When: `POST /api/cron/daily-report` 호출
- Then: 3개 디바이스 모두 `generateDailyReport`가 실행되고, DB에 3개의 DailyReport가 생성된다. 응답: `200 { processed: 3, succeeded: 3, failed: 0 }`.

**Scenario 2: 인증 없는 Cron 요청 차단**
- Given: `Authorization` 헤더 없이 요청
- When: `POST /api/cron/daily-report` 호출
- Then: 401 Unauthorized 반환, 보고서 생성 미실행.

**Scenario 3: 일부 디바이스 실패 시 나머지 계속 진행**
- Given: 활성 디바이스 3개 중 1개에서 `generateDailyReport` 에러 발생
- When: Cron Job 실행
- Then: 나머지 2개 디바이스는 정상 처리되고, 응답: `200 { processed: 3, succeeded: 2, failed: 1 }`.

**Scenario 4: 활성 디바이스 0개 시 정상 응답**
- Given: `status: 'ACTIVE'` 인 SensorDevice가 없음
- When: Cron Job 실행
- Then: 아무 작업 없이 `200 { processed: 0, succeeded: 0, failed: 0 }` 반환.

## :gear: Technical & Non-Functional Constraints
- **Vercel Hobby 제약:** Cron Job 1일 1회 제한 (CON-13) — 스케줄을 `"0 1 * * *"` (UTC 오전 1시)로 고정
- **타임아웃:** Vercel Hobby Function 최대 실행 시간 10초 — 디바이스 수 증가 시 타임아웃 위험. 초기 MVP(≤5 디바이스)는 허용 범위
- **보안:** `CRON_SECRET` 환경 변수 설정 필수 (INFRA-004) — 외부 무단 트리거 방지
- **Supabase Free 연결:** 동시 병렬 처리 수 제한 — `Promise.all()` 사용 시 최대 5개 디바이스 동시 처리 권장

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `CRON_SECRET` 인증이 적용되어 외부 접근이 차단되는가?
- [ ] 각 디바이스 실패가 전체 Cron Job을 중단시키지 않는가?
- [ ] `vercel.json`에 `"0 1 * * *"` 스케줄이 등록되어 있는가?
- [ ] 실행 결과 summary가 응답으로 반환되고 콘솔에 로깅되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?
- [ ] REQ-FUNC-020 (일간 보고서 자동 생성) Acceptance Criteria가 충족되는가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_PIPE-001 (generateDailyReport), TASK_PIPE-006 (DailyReport 저장 완료), TASK_INFRA-003 (vercel.json Cron 설정), TASK_INFRA-004 (CRON_SECRET 환경 변수)
- **Blocks:** TASK_EMAIL-002 (일간 보고서 완료 이메일 — Cron 실행 완료 후 트리거)
- **참고:** Vercel Hobby의 Function 타임아웃(10초) 초과 시 보고서 생성이 중단될 수 있다. 디바이스 수가 증가하면 PIPE-007을 Background Function 또는 Queue 방식으로 리팩토링해야 한다. MVP 단계(≤5 디바이스)에서는 순차/소규모 병렬 처리로 충분하다.
