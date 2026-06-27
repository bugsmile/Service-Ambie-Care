---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-002: [Unit] Prisma 스키마 무결성 테스트"
labels: 'test, backend, priority:medium, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-002] Prisma 스키마 5개 모델 무결성 단위 테스트
- 목적: DB-001~005에서 정의한 5개 Prisma 모델(SensorDevice, WellnessEvent, UserAccount, UserDevice, DailyReport)의 PK 생성, FK 관계, unique 제약, 인덱스가 올바르게 적용되었는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 섹션: §3.6 ERD, §6.2.1~6.2.5
- 테스트 대상: [`/TASKs/TASK_DB-001.md`](./TASK_DB-001.md) ~ [`/TASKs/TASK_DB-005.md`](./TASK_DB-005.md)
- 마이그레이션: [`/TASKs/TASK_DB-007.md`](./TASK_DB-007.md)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/db/schema.test.ts`
- [ ] Prisma 테스트 환경 설정 — `DATABASE_URL` 테스트 DB (SQLite in-memory 또는 별도 Supabase 테스트 프로젝트)
- [ ] `beforeAll`: `prisma.$connect()` + 마이그레이션 적용
- [ ] `afterAll`: `prisma.$disconnect()` + 테스트 데이터 정리
- [ ] 테스트 케이스:
  - SensorDevice `cuid()` PK 자동 생성 검증
  - WellnessEvent `deviceId` FK → SensorDevice 참조 무결성 검증 (존재하지 않는 deviceId → 에러)
  - UserAccount `email` unique 제약 검증 (중복 insert → 에러)
  - UserDevice 복합 PK `(userId, deviceId)` 검증
  - WellnessEvent `timestamp` 인덱스 존재 확인
  - DailyReport `(deviceId, date)` unique 제약 검증

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: cuid PK 자동 생성**
- Given: id 미지정으로 SensorDevice insert
- When: `prisma.sensorDevice.create({ data: { ... } })`
- Then: `id`가 cuid 형식 문자열로 자동 생성된다.

**Scenario 2: FK 참조 무결성**
- Given: 존재하지 않는 `deviceId`로 WellnessEvent 생성 시도
- When: `prisma.wellnessEvent.create(...)`
- Then: Prisma FK 에러 발생.

**Scenario 3: UserAccount email unique**
- Given: 동일 email로 두 번째 UserAccount 생성 시도
- When: 두 번째 `prisma.userAccount.create(...)`
- Then: unique 제약 에러 발생.

## :gear: Technical & Non-Functional Constraints
- **테스트 DB:** SQLite in-memory (`datasource db { provider = "sqlite" }`) 또는 격리된 테스트 Supabase
- **실행 속도:** 스키마 테스트는 마이그레이션 포함 30초 이내 완료
- **Traceability:** 구현 결과 또는 PR 설명에 SRS 섹션, Task ID, 검증 명령을 명시해야 한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 5개 모델 전체 제약 조건이 테스트되었는가?
- [ ] 모든 테스트 GREEN?
- [ ] CI에서 자동 실행 가능한가?
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
- **Depends on:** TASK_DB-007 (마이그레이션 배포 완료)
- **Blocks:** 없음
