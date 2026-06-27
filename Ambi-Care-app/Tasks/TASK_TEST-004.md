---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-004: [Unit] Daily Report 조회 API 테스트"
labels: 'test, backend, priority:high, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-004] GET `/api/reports/daily/[deviceId]/[date]` 조회 API 단위 테스트
- 목적: RPT-001에서 구현한 Daily Report 조회 API가 경로 파라미터(`deviceId`, `date`), JWT 인증, 디바이스 접근 권한, API-002 응답 DTO를 올바르게 처리하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/all/TASK_RPT-001.md`](./TASK_RPT-001.md) — GET `/api/reports/daily/[deviceId]/[date]`
- API 계약: [`/TASKs/all/TASK_API-002.md`](./TASK_API-002.md) — Daily Report API 규격
- SRS 섹션: §5.3 Daily Report Query, AC of API-002
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/api/reports/daily/[deviceId]/[date].test.ts`
- [ ] Prisma Client Mock 설정 (`jest.mock('@/lib/prisma')`)
- [ ] NextAuth.js 세션 Mock 설정
- [ ] 테스트 케이스:
  - 미인증 요청 → 401
  - `date` 경로 파라미터 형식 오류(non-ISO 또는 `YYYY-MM-DD` 불일치) → 400
  - `deviceId` 경로 파라미터가 cuid/프로젝트 표준 형식이 아님 → 400
  - 유효한 요청, 데이터 있음 → 200 + API-002 DailyReport DTO
  - 유효한 요청, 데이터 없음 → 404
  - 세션 사용자가 소유하지 않은 `deviceId` 접근 → 403
  - 응답에 `sleepScore`, `bathroomVisitCount`, `anomalyFlags`, `statusCode`, `aiSummary` 포함 검증

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 미인증 요청 → 401**
- Given: NextAuth 세션 없음
- When: GET `/api/reports/daily/dev-001/2025-01-01`
- Then: 401 Unauthorized 반환

**Scenario 2: 정상 조회 → 200**
- Given: 유효한 세션, 해당 날짜 DailyReport 존재
- When: GET `/api/reports/daily/dev-001/2025-01-01`
- Then: 200 OK + `{ deviceId, date, sleepScore, bathroomVisitCount, anomalyFlags, statusCode, aiSummary }` 반환

**Scenario 3: 데이터 없음 → 404**
- Given: 유효한 세션, 해당 날짜 DailyReport 미존재
- When: GET `/api/reports/daily/dev-001/2025-01-01`
- Then: 404 Not Found 반환

**Scenario 4: 타 사용자 디바이스 접근 → 403**
- Given: 유효한 세션이나 `dev-002`가 세션 사용자의 UserDevice에 연결되어 있지 않음
- When: GET `/api/reports/daily/dev-002/2025-01-01`
- Then: 403 Forbidden 반환

## :gear: Technical & Non-Functional Constraints
- **테스트 격리:** Prisma Mock 사용, 실제 DB 연결 없음
- **인증 Mock:** `next-auth/jwt` 또는 `getServerSession` Mock
- **응답 스키마:** API-002 필드명 기준으로 Zod 또는 수동 타입 검증
- **경로 규격:** Query string이 아니라 `/api/reports/daily/[deviceId]/[date]` 동적 라우트를 기준으로 테스트

## :checkered_flag: Definition of Done (DoD)
- [ ] 인증/파라미터/데이터 존재 여부 6개 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] Prisma Mock이 실제 DB를 호출하지 않는가?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_RPT-001, TASK_API-002
- **Blocks:** 없음
