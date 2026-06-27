---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-001: Prisma 스키마 정의 — SensorDevice 모델"
labels: 'feature, database, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-001] Prisma 스키마 정의 — SensorDevice 모델 (cuid PK, locationZone, firmwareVersion, status, calibrationStatus, lastHeartbeatAt)
- 목적: Rooted MVP의 핵심 엔티티인 센서 디바이스 정보를 관리하는 SensorDevice 모델을 Prisma 스키마로 정의하여, 디바이스 상태 추적, 하트비트 모니터링, 트래픽 라이트 대시보드의 데이터 기반을 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.6`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — ERD (Entity-Relationship Diagram)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — SensorDevice 데이터 모델 상세
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — C-TEC-003: Prisma + SQLite/Supabase 제약
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-04`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — DB/API 금지어 네이밍 규칙
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sample Mock Data (SensorDevice)
- Prisma ORM Docs: [https://www.prisma.io/docs](https://www.prisma.io/docs) (REF-09)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/schema.prisma` 파일 생성 (또는 기존 파일에 추가)
- [ ] Prisma datasource 설정 — `provider = "postgresql"`, `url = env("DATABASE_URL")`
- [ ] Prisma generator 설정 — `provider = "prisma-client-js"`
- [ ] `SensorDevice` 모델 정의:
  ```prisma
  model SensorDevice {
    id                String    @id @default(cuid())
    locationZone      String    @default("BEDROOM")
    firmwareVersion   String
    installationDate  DateTime
    status            String    @default("ACTIVE")
    calibrationStatus String    @default("PENDING")
    lastHeartbeatAt   DateTime?
    createdAt         DateTime  @default(now())
    updatedAt         DateTime  @updatedAt
  }
  ```
- [ ] 필드 타입 및 제약조건 검증:
  - `id`: `String @id @default(cuid())` — SQLite 호환성을 위한 cuid 문자열 PK (CON-08)
  - `locationZone`: `String @default("BEDROOM")` — MVP에서는 BEDROOM 고정 (§3.6)
  - `firmwareVersion`: `String` NOT NULL
  - `installationDate`: `DateTime` NOT NULL
  - `status`: `String @default("ACTIVE")` — 허용 값: `ACTIVE`, `INACTIVE`, `MAINTENANCE`
  - `calibrationStatus`: `String @default("PENDING")` — 허용 값: `CALIBRATED`, `PENDING`
  - `lastHeartbeatAt`: `DateTime?` — nullable (최초 등록 시 null)
  - `createdAt`: `DateTime @default(now())`
  - `updatedAt`: `DateTime @updatedAt`
- [ ] 관계(Relations) 자리 확보 — WellnessEvent, DailyReport, UserDevice와의 관계는 해당 모델 생성 시 추가
- [ ] 금지어 검증 — `diagnosis`, `medical`, `patient` 등 규제 키워드가 필드명에 포함되지 않았는지 확인 (CON-04)
- [ ] `npx prisma validate` 실행 — 스키마 문법 검증

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: SensorDevice 모델 스키마 유효성**
- Given: `prisma/schema.prisma`에 SensorDevice 모델이 정의됨
- When: `npx prisma validate`를 실행함
- Then: 유효성 검증이 통과하고 에러가 없다.

**Scenario 2: cuid() PK 자동 생성**
- Given: SensorDevice 모델의 `id` 필드가 `@default(cuid())`로 설정됨
- When: 새 SensorDevice 레코드를 생성함 (`prisma.sensorDevice.create()`)
- Then: `id` 필드에 cuid 형식의 고유 문자열이 자동 생성된다 (예: `clxxxxxxxxxxxxxxxxx`).

**Scenario 3: status 기본값 적용**
- Given: `status` 필드가 `@default("ACTIVE")`로 설정됨
- When: `status` 값을 명시하지 않고 SensorDevice를 생성함
- Then: `status`가 `"ACTIVE"`로 자동 설정된다.

**Scenario 4: lastHeartbeatAt nullable 동작**
- Given: `lastHeartbeatAt` 필드가 `DateTime?`(nullable)로 설정됨
- When: SensorDevice를 최초 생성 시 `lastHeartbeatAt`을 지정하지 않음
- Then: `lastHeartbeatAt`이 `null`로 저장된다.

**Scenario 5: 금지어 부재 확인**
- Given: SensorDevice 모델의 모든 필드명이 정의됨
- When: 필드명에서 `diagnosis`, `medical`, `patient` 키워드를 검색함
- Then: 해당 금지어가 0건 발견된다.

## :gear: Technical & Non-Functional Constraints
- **ORM:** Prisma 사용 필수 — CON-08
- **PK 타입:** `String @id @default(cuid())` — SQLite 호환성 (CON-08). auto-increment 정수 PK 사용 금지
- **ENUM 대체:** Prisma native ENUM 대신 `String` 타입 사용 — SQLite 호환 (CON-08)
- **금지어 규칙:** `diagnosis`, `medical`, `patient` 등 규제 트리거 단어 사용 금지 — CON-04, REQ-NF-019
- **locationZone:** MVP에서는 `"BEDROOM"` 고정 — 다중 Zone 지원은 Wave 2
- **facilityId FK 제외:** Facility 모델은 Wave 2로 연기됨 — SRS v3.0 변경사항
- **PII 필드 0건:** DB에 식별 가능한 개인정보 마커 없어야 함 — REQ-NF-009, CON-02

## :checkered_flag: Definition of Done (DoD)
- [ ] `prisma/schema.prisma`에 SensorDevice 모델이 정확히 정의되었는가?
- [ ] 모든 9개 필드의 타입, 제약조건, 기본값이 SRS §6.2.1과 일치하는가?
- [ ] `npx prisma validate`가 에러 없이 통과하는가?
- [ ] cuid() PK, nullable 필드, @default 값이 정상 적용되는가?
- [ ] 금지어(diagnosis, medical, patient)가 필드명에 포함되지 않는가?
- [ ] PII 필드가 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** 없음 (DB 스키마 정의는 독립적으로 시작 가능. 단, `prisma init`은 INFRA-001 이후 권장)
- **Blocks:** DB-002 (WellnessEvent — deviceId FK), DB-004 (UserDevice 조인 테이블 — deviceId FK), DB-005 (DailyReport — deviceId FK), DB-006 (Supabase 연결 + Prisma Client), DB-007 (마이그레이션 실행)
- **참고:** SRS v3.0에서 `facilityId` FK가 제거되었고, `locationZone`은 MVP에서 `"BEDROOM"`으로 고정됩니다. Wave 2에서 Facility 모델 추가 및 다중 Zone 지원이 예정되어 있습니다.
