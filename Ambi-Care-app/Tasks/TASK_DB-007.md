---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-007: Prisma 마이그레이션 스크립트 생성 및 Supabase 배포 실행"
labels: 'feature, database, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-007] Prisma 마이그레이션 스크립트 생성 및 Supabase 배포 실행
- 목적: DB-001~DB-005에서 정의한 5개 Prisma 모델(SensorDevice, WellnessEvent, UserAccount, UserDevice, DailyReport)에 대한 마이그레이션 SQL을 생성하고, Supabase Free PostgreSQL에 적용하여 실제 운영 가능한 데이터베이스 스키마를 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.6`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — ERD (5 Models)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — C-TEC-003: Prisma + Supabase
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-14`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Supabase Free Limits (500MB)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.1~§6.2.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 전체 데이터 모델 상세
- 선행 태스크: TASK_DB-001 ~ TASK_DB-006
- Prisma Docs (Migrate): [https://www.prisma.io/docs/concepts/components/prisma-migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate) (REF-09)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-007

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/schema.prisma` 전체 스키마 최종 검토 — 5개 모델, 관계, 인덱스, 제약조건 완전성 확인
- [ ] `npx prisma validate` 실행 — 스키마 구문 오류 0건 확인
- [ ] `npx prisma migrate dev --name init` 실행 — 로컬 개발 환경 마이그레이션 생성
- [ ] `prisma/migrations/` 디렉토리에 마이그레이션 SQL 파일 생성 확인
- [ ] 생성된 마이그레이션 SQL 리뷰 — CREATE TABLE 5개, 인덱스, FK 제약 정상 포함 확인
- [ ] Supabase Free PostgreSQL에 마이그레이션 적용:
  - 옵션 A: `npx prisma migrate deploy` (프로덕션용 — Vercel CI/CD에서 실행)
  - 옵션 B: `npx prisma db push` (프로토타입 단계 — 직접 스키마 동기화)
- [ ] Supabase 대시보드 → Table Editor에서 5개 테이블 생성 확인
- [ ] 각 테이블의 컬럼, 타입, 제약조건, 인덱스 검증:
  - `SensorDevice`: 9 컬럼, PK(id), DEFAULT 값 3개
  - `WellnessEvent`: 9 컬럼, PK(id), FK(deviceId), INDEX(timestamp, deviceId)
  - `UserAccount`: 7 컬럼, PK(id), UNIQUE(email)
  - `UserDevice`: 2 컬럼, 복합 PK(userId, deviceId), FK 2개
  - `DailyReport`: 9 컬럼, PK(id), FK(deviceId), INDEX(date, deviceId), UNIQUE(deviceId, date)
- [ ] `npx prisma generate` 실행 — Prisma Client 최신 타입 재생성
- [ ] `package.json`에 마이그레이션 관련 스크립트 추가:
  ```json
  {
    "scripts": {
      "db:migrate:dev": "prisma migrate dev",
      "db:migrate:deploy": "prisma migrate deploy",
      "db:push": "prisma db push",
      "db:seed": "prisma db seed",
      "postinstall": "prisma generate"
    }
  }
  ```
- [ ] Vercel 빌드 시 `postinstall`에서 `prisma generate` 자동 실행 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 마이그레이션 파일 정상 생성**
- Given: 5개 Prisma 모델이 `schema.prisma`에 정의됨
- When: `npx prisma migrate dev --name init`을 실행함
- Then: `prisma/migrations/{timestamp}_init/migration.sql` 파일이 생성되고, 5개 CREATE TABLE 문과 관련 인덱스/제약조건이 포함된다.

**Scenario 2: Supabase PostgreSQL 스키마 적용**
- Given: 마이그레이션 SQL이 생성됨
- When: Supabase Free PostgreSQL에 마이그레이션을 적용함
- Then: Supabase 대시보드 Table Editor에서 5개 테이블(`SensorDevice`, `WellnessEvent`, `UserAccount`, `UserDevice`, `DailyReport`)이 정상 표시된다.

**Scenario 3: FK 관계 정상 동작**
- Given: 마이그레이션 적용 후 FK 제약이 활성 상태임
- When: 존재하지 않는 `deviceId`로 WellnessEvent를 INSERT 시도함
- Then: FK 제약 위반 에러가 발생한다.

**Scenario 4: 인덱스 생성 확인**
- Given: `@@index([timestamp])`, `@@index([deviceId])`, `@@index([date])` 등이 스키마에 정의됨
- When: Supabase 대시보드에서 인덱스 목록을 확인함
- Then: 해당 인덱스들이 정상 생성되어 있다.

**Scenario 5: Prisma Client 타입 재생성**
- Given: 마이그레이션 적용 후 `npx prisma generate`를 실행함
- When: TypeScript에서 `prisma.sensorDevice.create()`를 타이핑함
- Then: 모든 필드에 대한 자동 완성(IntelliSense)이 정상 동작한다.

## :gear: Technical & Non-Functional Constraints
- **DB 용량:** Supabase Free 500MB 이내 — CON-14, ASM-08
- **마이그레이션 전략:** 개발 초기에는 `prisma db push` 허용, 안정화 후 `prisma migrate dev` 전환 권장
- **Vercel 배포:** `postinstall` 스크립트에 `prisma generate` 필수 — Vercel 빌드 시 Prisma Client 재생성
- **마이그레이션 파일 Git 관리:** `prisma/migrations/` 디렉토리는 Git에 커밋하여 버전 관리
- **Downtime:** Supabase Free에서는 마이그레이션 중 짧은 다운타임 발생 가능 (MVP 단계 허용)
- **비용:** $0/월 — CON-16

## :checkered_flag: Definition of Done (DoD)
- [ ] `prisma/migrations/` 디렉토리에 마이그레이션 SQL 파일이 존재하는가?
- [ ] Supabase Free PostgreSQL에 5개 테이블이 정상 생성되었는가?
- [ ] 모든 FK, 인덱스, UNIQUE 제약이 정상 적용되었는가?
- [ ] `npx prisma generate`가 에러 없이 Prisma Client를 생성하는가?
- [ ] TypeScript IntelliSense가 5개 모델에 대해 정상 동작하는가?
- [ ] `package.json`에 DB 관련 스크립트가 추가되었는가?
- [ ] Vercel 빌드 시 `postinstall`에서 `prisma generate`가 자동 실행되는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 ~ DB-005 (전체 5개 모델 정의), DB-006 (Supabase 연결 + Prisma Client)
- **Blocks:** DB-008 (30일 초과 데이터 삭제 쿼리), MOCK-001~003 (Seed 데이터 생성), EVT-001/002 (Event Ingestion), HB-001/002 (Heartbeat), DASH-001 (Dashboard 조회), RPT-001 (Report 조회), INFRA-005 (Health Check API의 DB 테스트), 사실상 모든 후속 로직 태스크
- **참고:** 이 태스크는 Phase 0의 핵심 마일스톤입니다. 마이그레이션 완료 후 비로소 실제 데이터를 저장/조회할 수 있으며, MOCK-001 Seed 데이터 생성과 후속 Phase 1 개발이 가능해집니다.
