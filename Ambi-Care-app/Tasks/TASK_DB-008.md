---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-008: 30일 초과 데이터 자동 삭제 SQL/Prisma 쿼리 작성"
labels: 'feature, database, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-008] 30일 초과 데이터 자동 삭제 SQL/Prisma 쿼리 작성 (Daily Cleanup)
- 목적: Supabase Free 500MB 용량 제한 내에서 데이터를 안전하게 관리하기 위해, 30일이 경과한 WellnessEvent 및 DailyReport 데이터를 자동으로 삭제하는 쿼리를 작성하여 데이터 보존 정책을 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-017`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 데이터 보존: Hot 30일, 자동 삭제
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-015`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 검색 가능한 이벤트 로그 유지 (30일 범위)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-14`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Supabase Free 500MB 제한
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#ASM-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 50 디바이스 × 30일 데이터 500MB 이내 가정
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§15`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Free Tier Constraint Specification
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-008

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] WellnessEvent 30일 초과 데이터 삭제 Prisma 쿼리 작성:
  ```typescript
  // lib/cleanup.ts 또는 app/actions/cleanup.ts
  import { prisma } from '@/lib/prisma'

  export async function cleanupExpiredData() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const deletedEvents = await prisma.wellnessEvent.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo,
        },
      },
    })

    const deletedReports = await prisma.dailyReport.deleteMany({
      where: {
        date: {
          lt: thirtyDaysAgo,
        },
      },
    })

    return { deletedEvents: deletedEvents.count, deletedReports: deletedReports.count }
  }
  ```
- [ ] DailyReport 30일 초과 데이터 삭제 쿼리 작성 (위 코드에 포함)
- [ ] Cleanup 함수를 Vercel Cron Job에서 호출할 수 있도록 API Route 연동 검토:
  - 옵션 A: INFRA-003의 `app/api/cron/daily-report/route.ts`에 cleanup 로직 추가 (Cron 1/day 제한 내 통합)
  - 옵션 B: 별도 유틸리티 함수로 분리하여 `generateDailyReport` 실행 전/후에 호출
- [ ] 삭제 대상 데이터 범위 검증 — `timestamp < (현재 - 30일)` 조건 정확성 확인
- [ ] 삭제 실행 로그 기록 — 삭제된 레코드 수 콘솔 로깅
- [ ] 트랜잭션 고려 — WellnessEvent → DailyReport 순서 삭제 또는 `prisma.$transaction()` 사용
- [ ] Edge Case 처리:
  - 삭제 대상이 0건일 때 에러 없이 정상 종료
  - 대량 삭제 시 Supabase Free 타임아웃(Serverless 10s) 내 완료 가능 여부 확인
- [ ] 수동 실행 테스트 — 삭제 쿼리 실행 후 30일 초과 데이터 0건 + 30일 이내 데이터 보존 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 30일 초과 WellnessEvent 삭제**
- Given: DB에 31일 전~현재까지의 WellnessEvent 데이터가 존재함
- When: `cleanupExpiredData()` 함수를 실행함
- Then: 30일 초과(31일 이전) 이벤트가 모두 삭제되고, 30일 이내 데이터는 보존된다.

**Scenario 2: 30일 초과 DailyReport 삭제**
- Given: DB에 31일 전~현재까지의 DailyReport 데이터가 존재함
- When: `cleanupExpiredData()` 함수를 실행함
- Then: 30일 초과 보고서가 모두 삭제되고, 30일 이내 보고서는 보존된다.

**Scenario 3: 삭제 대상 0건 시 정상 동작**
- Given: 모든 데이터가 30일 이내임 (삭제 대상 없음)
- When: `cleanupExpiredData()` 함수를 실행함
- Then: 에러 없이 정상 종료되고, `{ deletedEvents: 0, deletedReports: 0 }`을 반환한다.

**Scenario 4: 대량 데이터 삭제 성능**
- Given: 50 디바이스 × 288 이벤트/일 × 7일 초과분 = 약 100,800건의 삭제 대상이 존재함
- When: `cleanupExpiredData()` 함수를 실행함
- Then: Vercel Serverless 10초 타임아웃 내에 삭제가 완료된다.

**Scenario 5: integrityHash 보존 기간 준수**
- Given: integrityHash 필드가 WellnessEvent에 포함됨
- When: 30일 보존 기간 내 데이터를 조회함
- Then: integrityHash가 정상적으로 보존되어 있다 (보존 기간 내 무결성 유지).

## :gear: Technical & Non-Functional Constraints
- **데이터 보존:** Hot 30일, 자동 삭제 — REQ-NF-017
- **DB 용량:** Supabase Free 500MB — 50 디바이스 × 30일 ≈ 100MB 추정 (ASM-08)
- **실행 빈도:** 1일 1회 — Vercel Cron 1/day 제한 (CON-13)과 통합
- **타임아웃:** Vercel Serverless Function 10초 timeout — 대량 삭제 시 배치 분할 필요 가능
- **트랜잭션:** 삭제 순서 중요 — FK 제약 고려 (WellnessEvent 먼저 삭제 후 관련 없는 DailyReport 삭제)
- **Wave 2 참고:** Wave 2에서는 Hot 90일 + Cold Archival(3년+) 정책으로 전환 예정
- **비용:** $0/월 — CON-16

## :checkered_flag: Definition of Done (DoD)
- [ ] 30일 초과 WellnessEvent 삭제 쿼리가 정상 동작하는가?
- [ ] 30일 초과 DailyReport 삭제 쿼리가 정상 동작하는가?
- [ ] 30일 이내 데이터가 삭제 후에도 정상 보존되는가?
- [ ] 삭제 대상 0건 시 에러 없이 정상 동작하는가?
- [ ] Vercel Serverless 10초 타임아웃 내에 실행 가능한가?
- [ ] 삭제 건수 로깅이 구현되었는가?
- [ ] Cron Job 또는 Daily Report 생성 파이프라인과의 통합 지점이 명확한가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-007 (Prisma 마이그레이션 완료 — 실제 테이블 존재)
- **Blocks:** TEST-007 (30일 초과 데이터 삭제 테스트)
- **관련:** INFRA-003 (Vercel Cron Job — cleanup 실행 트리거), PIPE-007 (Daily Report Cron 연동 — cleanup 통합 실행 가능)
- **참고:** Vercel Hobby의 Cron이 1일 1회 제한이므로, cleanup은 `generateDailyReport`와 같은 Cron 트리거 내에서 통합 실행하는 것이 효율적입니다. 별도 Cron을 사용할 수 없습니다.
