---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-003: Prisma 스키마 정의 — UserAccount 모델"
labels: 'feature, database, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-003] Prisma 스키마 정의 — UserAccount 모델 (email unique, role, notificationPref JSON string)
- 목적: Rooted MVP의 사용자 계정 정보를 관리하는 UserAccount 모델을 정의하여, NextAuth.js 인증 시스템, 역할 기반 접근 제어(Phase 2 RBAC), Guardian/Facility Admin 구분, 이메일 알림 기능의 데이터 기반을 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.6`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — ERD (Entity-Relationship Diagram) — UserAccount
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — UserAccount 데이터 모델 상세
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Stakeholders (Guardian, Facility Admin 역할)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Prisma + SQLite/Supabase 제약
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-04`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — DB/API 금지어 네이밍 규칙
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-011`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — JWT 인증 + RBAC (Phase 2)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sample Mock Data (UserAccount)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-009`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — PII 필드 0건 규칙
- Prisma ORM Docs: [https://www.prisma.io/docs](https://www.prisma.io/docs) (REF-09)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/schema.prisma`에 `UserAccount` 모델 추가
- [ ] 모델 정의:
  ```prisma
  model UserAccount {
    id               String       @id @default(cuid())
    email            String       @unique
    name             String?
    role             String
    notificationPref String       @default("{\"push\": true}")
    createdAt        DateTime     @default(now())
    updatedAt        DateTime     @updatedAt
  }
  ```
- [ ] 필드 타입 및 제약조건 검증:
  - `id`: `String @id @default(cuid())` — cuid 문자열 PK (CON-08)
  - `email`: `String @unique` — 로그인 이메일, 유니크 제약 필수
  - `name`: `String?` — nullable, 표시 이름
  - `role`: `String` NOT NULL — 허용 값: `GUARDIAN`, `FACILITY_ADMIN`
  - `notificationPref`: `String @default("{\"push\": true}")` — JSON 문자열 (SQLite 호환, CON-08)
  - `createdAt`: `DateTime @default(now())`
  - `updatedAt`: `DateTime @updatedAt`
- [ ] 관계(Relations) 자리 확보 — UserDevice 조인 테이블과의 관계는 DB-004에서 추가
- [ ] `@unique` 인덱스 자동 생성 확인 — `email` 필드의 unique 제약
- [ ] 금지어 검증 — `patient`, `medical`, `diagnosis` 등 규제 키워드 부재 확인 (CON-04)
- [ ] PII 검증 — `email`과 `name`이 개인정보에 해당하나, SRS에서 허용한 최소 필드임을 확인. 주민번호, 전화번호, 주소 등 추가 PII 필드 없음 확인
- [ ] `npx prisma validate` 실행 — 스키마 유효성 검증

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: UserAccount 모델 스키마 유효성**
- Given: `prisma/schema.prisma`에 UserAccount 모델이 정의됨
- When: `npx prisma validate`를 실행함
- Then: 유효성 검증이 통과하고 에러가 없다.

**Scenario 2: email 유니크 제약 동작**
- Given: `email` 필드에 `@unique` 제약이 설정됨
- When: 이미 존재하는 이메일(`guardian1@demo.com`)로 새 UserAccount를 생성 시도함
- Then: Prisma unique constraint violation 에러가 발생한다.

**Scenario 3: role 필드 저장 및 조회**
- Given: `role` 필드가 `String` 타입으로 정의됨
- When: `role: "GUARDIAN"`으로 UserAccount를 생성함
- Then: 레코드가 정상 생성되고, 조회 시 `role`이 `"GUARDIAN"`으로 반환된다.

**Scenario 4: notificationPref JSON 문자열 저장**
- Given: `notificationPref` 기본값이 `"{\"push\": true}"`로 설정됨
- When: `notificationPref`을 명시하지 않고 UserAccount를 생성함
- Then: `notificationPref`에 `{"push": true}` JSON 문자열이 저장되고, 애플리케이션에서 `JSON.parse()`로 파싱 가능하다.

**Scenario 5: name 필드 nullable 동작**
- Given: `name` 필드가 `String?`(nullable)로 설정됨
- When: `name`을 지정하지 않고 UserAccount를 생성함
- Then: `name`이 `null`로 저장된다.

**Scenario 6: 금지어 및 과도한 PII 부재 확인**
- Given: UserAccount 모델의 모든 필드명이 정의됨
- When: 필드명/값에서 규제 키워드 및 과도한 PII(주민번호, 전화번호, 주소 등)를 검색함
- Then: 금지어 0건, 과도한 PII 필드 0건이 발견된다.

## :gear: Technical & Non-Functional Constraints
- **ORM:** Prisma 사용 필수 — CON-08
- **PK 타입:** `String @id @default(cuid())` — CON-08
- **ENUM 대체:** `role` 필드는 Prisma native ENUM 대신 `String` 사용 — SQLite 호환 (CON-08)
- **JSON 처리:** `notificationPref`는 JSON 타입 대신 `String` 사용 — SQLite JSON 미지원 대응 (CON-08). 애플리케이션에서 `JSON.parse()`/`JSON.stringify()`로 처리
- **금지어 규칙:** `patient`, `medical`, `diagnosis` 사용 금지 — CON-04
- **PII 최소화:** `email`과 `name`만 허용. 추가 PII 필드(phone, address, SSN 등) 절대 추가 금지 — REQ-NF-009, CON-02
- **facilityId FK 제외:** Facility 모델은 Wave 2로 연기됨 — SRS v3.0 변경사항
- **RBAC:** MVP Core에서는 `role` 필드를 저장만 하고 미들웨어 강제는 하지 않음. Phase 2에서 RBAC 미들웨어 적용 (SEC-004) — REQ-NF-011
- **Mock 사용자:** Guardian 2명, Admin 1명 — §14.2

## :checkered_flag: Definition of Done (DoD)
- [ ] `prisma/schema.prisma`에 UserAccount 모델이 정확히 정의되었는가?
- [ ] 모든 7개 필드의 타입, 제약조건, 기본값이 SRS §6.2.3과 일치하는가?
- [ ] `email` 필드에 `@unique` 제약이 적용되었는가?
- [ ] `notificationPref` 필드가 JSON 문자열(`String`)로 정의되었는가?
- [ ] `npx prisma validate`가 에러 없이 통과하는가?
- [ ] 금지어(diagnosis, medical, patient)가 필드명에 포함되지 않는가?
- [ ] 과도한 PII 필드(phone, address, SSN 등)가 없는가?

## :construction: Dependencies & Blockers
- **Depends on:** 없음 (UserAccount 모델은 독립적으로 정의 가능)
- **Blocks:** DB-004 (UserDevice 조인 테이블 — userId FK), AUTH-001 (NextAuth.js 설정 — 사용자 모델 참조), MOCK-001 (Mock UserAccount 3명 생성), EMAIL-002/003/004 (이메일 알림 — 사용자 이메일 참조)
- **참고:** SRS v3.0에서 `facilityId` FK가 제거되었습니다. NextAuth.js와의 통합 시 UserAccount 모델을 NextAuth 어댑터 스키마에 맞게 확장하거나, 별도 매핑이 필요할 수 있습니다 (AUTH-001에서 상세 결정).
