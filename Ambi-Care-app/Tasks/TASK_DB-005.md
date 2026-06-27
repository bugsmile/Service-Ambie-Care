---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-005: Prisma 스키마 정의 — DailyReport 모델"
labels: 'feature, database, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-005] Prisma 스키마 정의 — DailyReport 모델 (deviceId FK, date index, sleepScore, bathroomVisitCount, anomalyFlags JSON, statusCode, aiSummary)
- 목적: 매일 자동 생성되는 웰니스 일간 보고서 데이터를 저장하는 모델을 정의하여, Guardian에게 제공되는 수면 점수, 화장실 방문 횟수, 이상 징후 플래그, AI 요약 서술의 데이터 기반을 구축한다. MVP의 핵심 킬러 피처(FR-05)의 데이터 저장소이다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.6`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — ERD (DailyReport)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — DailyReport 데이터 모델 상세
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Daily Wellness Report Generation Sequence
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Action #3: `generateDailyReport`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Gemini AI Integration (aiSummary 필드)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-FUNC-016~020`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — FR-05: Daily Wellness Notification Pipeline
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Prisma + SQLite/Supabase 제약
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock DailyReport 사양
- Prisma ORM Docs: [https://www.prisma.io/docs](https://www.prisma.io/docs) (REF-09)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-005

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/schema.prisma`에 `DailyReport` 모델 추가
- [ ] 모델 정의:
  ```prisma
  model DailyReport {
    id                 String       @id @default(cuid())
    deviceId           String
    date               DateTime
    sleepScore         Int?
    bathroomVisitCount Int?
    anomalyFlags       String       @default("[]")
    statusCode         String       @default("NORMAL")
    aiSummary          String?
    generatedAt        DateTime

    device             SensorDevice @relation(fields: [deviceId], references: [id])

    @@index([date])
    @@index([deviceId])
    @@unique([deviceId, date])
  }
  ```
- [ ] 필드 타입 및 제약조건 검증:
  - `id`: `String @id @default(cuid())` — cuid 문자열 PK
  - `deviceId`: `String` NOT NULL, FK → SensorDevice.id
  - `date`: `DateTime` NOT NULL, `@@index` — 보고서 날짜 (인덱스 필수)
  - `sleepScore`: `Int?` — nullable, 범위 0~100 (데이터 부족 시 null)
  - `bathroomVisitCount`: `Int?` — nullable (데이터 부족 시 null)
  - `anomalyFlags`: `String @default("[]")` — JSON 배열 문자열 (SQLite 호환)
  - `statusCode`: `String @default("NORMAL")` — 허용 값: `NORMAL`, `INSUFFICIENT_DATA`, `SENSOR_ERROR`
  - `aiSummary`: `String?` — nullable, Gemini 1.5 Flash AI 생성 서술 (Fallback 시 null)
  - `generatedAt`: `DateTime` NOT NULL — 보고서 생성 시각
- [ ] `SensorDevice` 모델에 역방향 관계 추가: `dailyReports DailyReport[]`
- [ ] `@@index([date])` 인덱스 설정 — 날짜 기반 조회 최적화
- [ ] `@@index([deviceId])` 인덱스 설정 — 디바이스별 보고서 조회 최적화
- [ ] `@@unique([deviceId, date])` 유니크 복합 제약 설정 — 디바이스당 날짜별 1개 보고서 보장
- [ ] `npx prisma validate` 실행 — 스키마 유효성 검증

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: DailyReport 모델 스키마 유효성**
- Given: `prisma/schema.prisma`에 DailyReport 모델이 정의됨
- When: `npx prisma validate`를 실행함
- Then: 유효성 검증이 통과하고 에러가 없다.

**Scenario 2: 정상적인 DailyReport 생성**
- Given: SensorDevice(`dev-001`)가 DB에 존재함
- When: `prisma.dailyReport.create({ data: { deviceId: "dev-001", date: new Date("2026-04-21"), sleepScore: 85, bathroomVisitCount: 3, anomalyFlags: "[]", statusCode: "NORMAL", aiSummary: "...", generatedAt: new Date() } })`를 실행함
- Then: DailyReport 레코드가 정상 생성된다.

**Scenario 3: 디바이스+날짜 유니크 제약**
- Given: `dev-001`의 `2026-04-21` 보고서가 이미 존재함
- When: 동일한 (deviceId, date) 조합으로 새 보고서 생성을 시도함
- Then: Prisma unique constraint violation 에러가 발생하여 중복 보고서 생성이 방지된다.

**Scenario 4: INSUFFICIENT_DATA 상태 보고서 생성**
- Given: 데이터 수집 시간이 5시간 미만임
- When: `statusCode: "INSUFFICIENT_DATA"`, `sleepScore: null`, `bathroomVisitCount: null`로 보고서를 생성함
- Then: nullable 필드가 null로 저장되고, statusCode가 `INSUFFICIENT_DATA`로 기록된다.

**Scenario 5: anomalyFlags JSON 배열 문자열 저장/파싱**
- Given: 이상 징후가 감지되어 `anomalyFlags: '["LONG_BATHROOM_DWELL","HIGH_VISIT_COUNT"]'`로 저장됨
- When: 조회 후 `JSON.parse(report.anomalyFlags)`를 실행함
- Then: `["LONG_BATHROOM_DWELL","HIGH_VISIT_COUNT"]` 배열이 정상적으로 파싱된다.

**Scenario 6: aiSummary Fallback (null 저장)**
- Given: Gemini API 호출이 실패함
- When: `aiSummary: null`로 보고서를 생성함
- Then: 보고서가 정상 생성되고, `aiSummary`가 null로 저장된다 (사용자에게 에러 미노출).

## :gear: Technical & Non-Functional Constraints
- **ORM:** Prisma 사용 필수 — CON-08
- **PK 타입:** `String @id @default(cuid())` — CON-08
- **ENUM 대체:** `statusCode` 필드는 Prisma native ENUM 대신 `String` 사용 — SQLite 호환
- **JSON 처리:** `anomalyFlags`는 JSON 타입 대신 `String` 사용 — SQLite 호환. 애플리케이션에서 `JSON.parse()`/`JSON.stringify()` 처리
- **유니크 제약:** `@@unique([deviceId, date])` — 디바이스당 하루 1개 보고서 원칙
- **AI Summary:** Gemini API 실패 시 null 저장, 사용자 에러 미노출 — §7.1 Fallback 정책
- **데이터 보존:** 30일 초과 시 자동 삭제 대상 — REQ-NF-017 (삭제 로직은 DB-008)
- **금지어 규칙:** CON-04 준수
- **Mock 데이터:** 7일치, sleepScore 60~95, bathroomVisitCount 1~5 — §14.1

## :checkered_flag: Definition of Done (DoD)
- [ ] `prisma/schema.prisma`에 DailyReport 모델이 정확히 정의되었는가?
- [ ] 모든 9개 필드의 타입, 제약조건, 기본값이 SRS §6.2.5와 일치하는가?
- [ ] `deviceId` FK 관계가 SensorDevice 모델과 정상 연결되었는가?
- [ ] `@@index([date])`, `@@index([deviceId])`, `@@unique([deviceId, date])` 제약이 설정되었는가?
- [ ] `npx prisma validate`가 에러 없이 통과하는가?
- [ ] nullable 필드(`sleepScore`, `bathroomVisitCount`, `aiSummary`)가 정상 동작하는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 (SensorDevice 모델 — deviceId FK 대상)
- **Blocks:** API-002 (GET `/api/reports/daily/[deviceId]/[date]` DTO 정의), API-006 (POST `/api/ai/wellness-summary` DTO 정의), DB-006 (Prisma Client — 전체 5개 모델 완성), MOCK-003 (Mock DailyReport 7일치 생성), RPT-001~005 (Daily Report 조회/UI), PIPE-001~007 (Report Generation Pipeline)
- **참고:** DailyReport는 FR-05(MVP 킬러 피처)의 핵심 데이터 모델입니다. sleepScore, bathroomVisitCount는 PIPE-002/003에서 계산되고, aiSummary는 AI-003에서 Gemini를 통해 생성됩니다.
