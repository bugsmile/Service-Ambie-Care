---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-002: Prisma 스키마 정의 — WellnessEvent 모델"
labels: 'feature, database, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-002] Prisma 스키마 정의 — WellnessEvent 모델 (deviceId FK, eventType, timestamp index, confidenceScore, isFalseAlarm, integrityHash)
- 목적: UWB 센서(MVP에서는 Mock 데이터)로부터 수신한 웰니스 이벤트를 저장하는 핵심 데이터 모델을 정의하여, 이벤트 수집(Ingestion), 일간 보고서 생성, 오알람 피드백, 트래픽 라이트 대시보드의 데이터 기반을 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.6`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — ERD (Entity-Relationship Diagram) — WellnessEvent
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — WellnessEvent 데이터 모델 상세
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #1: POST `/api/events/ingest` (이벤트 수신 API)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Action #1: `createWellnessEvent`, #2: `updateFalseAlarmFlag`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Daily Report Generation Sequence
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Prisma + SQLite/Supabase 제약
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-04`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — DB/API 금지어 네이밍 규칙
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-017`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 30일 데이터 보존 정책
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock Data Spec (이벤트 분포)
- Prisma ORM Docs: [https://www.prisma.io/docs](https://www.prisma.io/docs) (REF-09)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/schema.prisma`에 `WellnessEvent` 모델 추가
- [ ] 모델 정의:
  ```prisma
  model WellnessEvent {
    id              String       @id @default(cuid())
    deviceId        String
    eventType       String
    timestamp       DateTime
    confidenceScore Float
    isFalseAlarm    Boolean      @default(false)
    zone            String       @default("BEDROOM")
    integrityHash   String
    createdAt       DateTime     @default(now())

    device          SensorDevice @relation(fields: [deviceId], references: [id])

    @@index([timestamp])
    @@index([deviceId])
  }
  ```
- [ ] 필드 타입 및 제약조건 검증:
  - `id`: `String @id @default(cuid())` — cuid 문자열 PK
  - `deviceId`: `String` NOT NULL, FK → SensorDevice.id
  - `eventType`: `String` NOT NULL — 허용 값: `ACTIVITY_ALERT`, `WELLNESS_SCORE`, `EMERGENCY`
  - `timestamp`: `DateTime` NOT NULL, `@@index` — 쿼리 성능을 위한 인덱스 필수
  - `confidenceScore`: `Float` NOT NULL — 범위: 0.0 ~ 1.0
  - `isFalseAlarm`: `Boolean @default(false)` — 가디언 피드백으로 업데이트 (Server Action #2)
  - `zone`: `String @default("BEDROOM")` — MVP 고정
  - `integrityHash`: `String` NOT NULL — SHA-256 해시 (체인 검증은 Wave 2)
  - `createdAt`: `DateTime @default(now())`
- [ ] `SensorDevice` 모델에 역방향 관계 추가: `wellnessEvents WellnessEvent[]`
- [ ] `@@index([timestamp])` 복합 인덱스 설정 — 일간 보고서 생성 시 날짜 범위 쿼리 최적화
- [ ] `@@index([deviceId])` 인덱스 설정 — 디바이스별 이벤트 조회 최적화
- [ ] 금지어 검증 — `diagnosis`, `medical`, `patient` 키워드 부재 확인
- [ ] `npx prisma validate` 실행 — 스키마 유효성 검증 (관계, FK 포함)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: WellnessEvent 모델 스키마 유효성**
- Given: `prisma/schema.prisma`에 WellnessEvent 모델이 정의됨
- When: `npx prisma validate`를 실행함
- Then: 유효성 검증이 통과하고 에러가 없다.

**Scenario 2: deviceId FK 관계 정상 동작**
- Given: SensorDevice 레코드가 존재함
- When: 해당 디바이스의 `id`를 `deviceId`로 참조하여 WellnessEvent를 생성함
- Then: 레코드가 정상 생성되고, `device` 관계를 통해 SensorDevice 정보에 접근 가능하다.

**Scenario 3: isFalseAlarm 기본값 및 업데이트**
- Given: `isFalseAlarm` 기본값이 `false`로 설정됨
- When: 이벤트 생성 시 `isFalseAlarm`을 명시하지 않음
- Then: `isFalseAlarm`이 `false`로 저장되고, 이후 `updateFalseAlarmFlag` Server Action으로 `true`로 업데이트 가능하다.

**Scenario 4: timestamp 인덱스 쿼리 최적화**
- Given: `timestamp` 필드에 `@@index`가 설정됨
- When: 특정 날짜 범위의 이벤트를 조회함 (`where: { timestamp: { gte: yesterday, lt: today } }`)
- Then: 인덱스를 활용하여 효율적으로 쿼리가 실행된다.

**Scenario 5: eventType 허용 값 준수**
- Given: `eventType` 필드가 `String` 타입으로 정의됨
- When: 이벤트 생성 시 `eventType`을 `ACTIVITY_ALERT`, `WELLNESS_SCORE`, `EMERGENCY` 중 하나로 설정함
- Then: 레코드가 정상 생성된다. (애플리케이션 레벨에서 유효성 검증 수행)

**Scenario 6: 존재하지 않는 deviceId FK 참조 시 에러**
- Given: 존재하지 않는 deviceId로 WellnessEvent 생성을 시도함
- When: `prisma.wellnessEvent.create()` 실행
- Then: FK 제약 조건 위반 에러가 발생한다.

## :gear: Technical & Non-Functional Constraints
- **ORM:** Prisma 사용 필수 — CON-08
- **PK 타입:** `String @id @default(cuid())` — CON-08
- **ENUM 대체:** `eventType`, `zone` 필드는 Prisma native ENUM 대신 `String` 사용 — CON-08 (SQLite 호환)
- **인덱스:** `timestamp`, `deviceId` 필드에 인덱스 필수 — 30일 데이터 범위 쿼리 성능 확보
- **데이터 보존:** 30일 초과 데이터 자동 삭제 대상 — REQ-NF-017 (삭제 로직은 DB-008에서 구현)
- **무결성 해시:** `integrityHash` 필드는 저장만 하고 체인 검증은 Wave 2로 연기
- **금지어 규칙:** CON-04 준수
- **Mock 데이터 분포:** ACTIVITY_ALERT 95%, WELLNESS_SCORE 4%, EMERGENCY 1% — §14.1
- **이벤트 볼륨 추정:** 50 디바이스 × 288 이벤트/일 = 14,400 이벤트/일 × 30일 = 432,000 레코드 (Supabase Free 500MB 이내)

## :checkered_flag: Definition of Done (DoD)
- [ ] `prisma/schema.prisma`에 WellnessEvent 모델이 정확히 정의되었는가?
- [ ] 모든 9개 필드의 타입, 제약조건, 기본값이 SRS §6.2.2와 일치하는가?
- [ ] `deviceId` FK 관계가 SensorDevice 모델과 정상 연결되었는가?
- [ ] `@@index([timestamp])` 및 `@@index([deviceId])` 인덱스가 설정되었는가?
- [ ] `npx prisma validate`가 에러 없이 통과하는가?
- [ ] 금지어(diagnosis, medical, patient)가 필드명에 포함되지 않는가?
- [ ] SensorDevice 모델에 역방향 관계(`wellnessEvents WellnessEvent[]`)가 추가되었는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 (SensorDevice 모델 — deviceId FK 대상)
- **Blocks:** API-001 (POST `/api/events/ingest` DTO 정의 — eventType, confidenceScore 등), API-005 (POST `/api/events/[eventId]/false-alarm` DTO 정의), DB-008 (30일 초과 데이터 삭제 쿼리), EVT-001/EVT-002 (이벤트 수집 로직), FA-001/FA-002 (오알람 피드백 로직), MOCK-002 (Mock WellnessEvent 7일치 생성)
- **참고:** WellnessEvent는 Rooted MVP에서 가장 높은 볼륨의 테이블입니다. 50 디바이스 × 288 이벤트/일 × 30일 = 최대 432,000 레코드가 저장되며, Supabase Free 500MB 제한 내에서 관리해야 합니다 (ASM-08).
