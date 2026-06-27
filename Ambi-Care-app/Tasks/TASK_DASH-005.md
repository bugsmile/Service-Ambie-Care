---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DASH-005: 이벤트 로그 역추적 조회 — 30일 범위 날짜 검색"
labels: 'feature, backend, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [DASH-005] 이벤트 로그 역추적 날짜 범위 검색 기능
- 목적: 시설 관리자가 특정 날짜 범위(최대 30일)를 지정하여 과거 웰니스 이벤트 로그를 역추적 조회할 수 있도록, 이벤트 로그 검색 UI와 Prisma 쿼리를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 1 B2B Dashboard
- 기능 요구사항: REQ-FUNC-015 — 30일 이내 이벤트 로그 역추적 조회
- 데이터 모델: [`/TASKs/TASK_DB-002.md`](./TASK_DB-002.md) — WellnessEvent (timestamp index)
- 데이터 모델: [`/TASKs/TASK_DB-008.md`](./TASK_DB-008.md) — 30일 초과 데이터 자동 삭제
- 인증: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DASH-005

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/events/route.ts` GET 핸들러 생성 (또는 기존 이벤트 라우트에 쿼리 파라미터 추가)
  - Query params: `deviceId?`, `startDate`, `endDate`, `eventType?`, `limit?` (기본값 100)
- [ ] JWT 인증 검증 — 미인증 시 401, 타 사용자 디바이스 접근 시 403
- [ ] Prisma 쿼리 구현:
  ```typescript
  wellnessEvent.findMany({
    where: {
      deviceId,
      timestamp: { gte: startDate, lte: endDate }
    },
    orderBy: { timestamp: 'desc' },
    take: limit
  })
  ```
- [ ] 날짜 범위 검증 — `endDate - startDate > 30일` 시 400 Bad Request 반환
- [ ] `app/(admin)/dashboard/events/page.tsx` — 이벤트 로그 조회 페이지 생성
- [ ] 날짜 범위 선택 UI — shadcn/ui `DatePicker` 또는 `Input[type=date]` 2개 (시작일/종료일)
- [ ] 이벤트 로그 테이블 UI — shadcn/ui `Table` 컴포넌트 (timestamp, deviceId, locationZone, eventType, confidenceScore 컬럼)
- [ ] 페이지네이션 또는 무한 스크롤 (100건 이상 시)
- [ ] 필터 UI — `eventType` 드롭다운 필터 (ALL / ACTIVITY_ALERT / WELLNESS_SCORE / EMERGENCY)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 유효한 날짜 범위 이벤트 조회**
- Given: `startDate: 7일 전`, `endDate: 오늘`, 유효한 JWT 제공
- When: 이벤트 로그 페이지에서 검색 실행
- Then: 해당 기간 내 WellnessEvent 목록이 최신순으로 표시된다.

**Scenario 2: 30일 초과 범위 요청 시 제한**
- Given: `startDate: 31일 전`, `endDate: 오늘`
- When: API에 검색 요청을 보냄
- Then: 400 Bad Request와 `{ error: "Date range cannot exceed 30 days" }` 메시지를 반환한다.

**Scenario 3: 결과 없는 날짜 범위**
- Given: 이벤트가 없는 날짜 범위 선택
- When: 검색 실행
- Then: 빈 테이블과 "해당 기간 내 이벤트가 없습니다" 안내 메시지가 표시된다.

**Scenario 4: eventType 필터 적용**
- Given: `eventType: "EMERGENCY"` 필터 선택, 7일치 데이터 중 EMERGENCY 이벤트 3건
- When: 필터를 적용하여 검색
- Then: EMERGENCY 이벤트 3건만 표시된다.

## :gear: Technical & Non-Functional Constraints
- **성능:** `timestamp` 컬럼 인덱스 활용 (DB-002에서 설정) — 대용량 쿼리 최적화
- **데이터 보존:** 30일 초과 데이터는 DB-008에 의해 자동 삭제되므로, 30일 이상 조회 UI를 비활성화하거나 API에서 400 반환
- **보안:** 자신의 디바이스 데이터만 조회 가능하도록 서버 사이드에서 `userId` 기반 필터링 — REQ-NF-011
- **페이지네이션:** `limit` 최대 100건, 초과 시 400 반환

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 30일 범위 제한이 API와 UI 양쪽에서 적용되는가?
- [ ] `timestamp` 인덱스를 활용한 쿼리가 p95 ≤ 5,000ms 이내에 응답하는가?
- [ ] JWT 인증 없는 접근 시 401이 반환되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?
- [ ] REQ-FUNC-015 Acceptance Criteria가 충족되는가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_DB-002 (WellnessEvent + timestamp index), TASK_DB-007 (마이그레이션), TASK_DB-008 (30일 자동 삭제), TASK_AUTH-001 (JWT 인증)
- **Blocks:** 직접 블로킹하는 후속 태스크 없음 (Phase 1 독립 기능)
- **참고:** 날짜 범위 유효성 검증은 클라이언트(UI 비활성화)와 서버(API 400 반환) 양쪽에서 이중으로 처리해야 한다.
