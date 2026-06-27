---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-004: Prisma 스키마 정의 — UserDevice 조인 테이블"
labels: 'feature, database, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-004] Prisma 스키마 정의 — UserDevice 조인 테이블 (복합 PK: userId + deviceId)
- 목적: UserAccount와 SensorDevice 간의 M:N(다대다) 관계를 관리하는 조인 테이블을 정의하여, 한 명의 Guardian이 여러 디바이스를 모니터링하고, 하나의 디바이스에 여러 Guardian이 접근할 수 있는 구조를 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.6`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — ERD (UserDevice 조인 테이블)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — UserDevice 데이터 모델 상세
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — C-TEC-003: Prisma + SQLite/Supabase (M:N → UserDevice 조인 테이블)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sample Mock Data (UserDevice 연결)
- Prisma ORM Docs (Many-to-many): [https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations) (REF-09)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/schema.prisma`에 `UserDevice` 모델 추가
- [ ] 모델 정의 (Explicit M:N 조인 테이블):
  ```prisma
  model UserDevice {
    userId   String
    deviceId String

    user     UserAccount  @relation(fields: [userId], references: [id])
    device   SensorDevice @relation(fields: [deviceId], references: [id])

    @@id([userId, deviceId])
  }
  ```
- [ ] `UserAccount` 모델에 역방향 관계 추가: `devices UserDevice[]`
- [ ] `SensorDevice` 모델에 역방향 관계 추가: `users UserDevice[]`
- [ ] 복합 PK(`@@id([userId, deviceId])`) 설정 검증 — 동일 (userId, deviceId) 쌍 중복 방지
- [ ] FK 관계 검증 — `userId` → UserAccount.id, `deviceId` → SensorDevice.id
- [ ] Cascade 삭제 정책 검토 — UserAccount/SensorDevice 삭제 시 연관 UserDevice 레코드 처리 방식 결정
- [ ] `npx prisma validate` 실행 — 전체 스키마 유효성 검증 (5개 모델 관계 포함)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: UserDevice 조인 레코드 정상 생성**
- Given: UserAccount(`guardian1@demo.com`)와 SensorDevice(`dev-001`)가 DB에 존재함
- When: `prisma.userDevice.create({ data: { userId: "...", deviceId: "..." } })`를 실행함
- Then: UserDevice 레코드가 정상 생성되고, 해당 Guardian과 Device가 연결된다.

**Scenario 2: 복합 PK 중복 방지**
- Given: UserDevice에 (`userId: "u1", deviceId: "d1"`) 레코드가 이미 존재함
- When: 동일한 (userId, deviceId) 쌍으로 재생성을 시도함
- Then: Prisma unique constraint violation 에러가 발생하여 중복 연결이 방지된다.

**Scenario 3: M:N 관계 양방향 조회**
- Given: Guardian-1이 Device-001, Device-002에 연결되어 있음
- When: `prisma.userAccount.findUnique({ include: { devices: { include: { device: true } } } })`를 실행함
- Then: Guardian-1에 연결된 2개 디바이스 정보가 정상적으로 반환된다.

**Scenario 4: 역방향 조회 (디바이스 → 사용자)**
- Given: Device-001에 Guardian-1, Guardian-2가 연결되어 있음
- When: `prisma.sensorDevice.findUnique({ include: { users: { include: { user: true } } } })`를 실행함
- Then: Device-001에 연결된 2명의 Guardian 정보가 정상적으로 반환된다.

## :gear: Technical & Non-Functional Constraints
- **ORM:** Prisma Explicit M:N 관계 사용 필수 — CON-08
- **복합 PK:** `@@id([userId, deviceId])` — auto-increment 대신 복합 문자열 PK 사용 (SQLite 호환)
- **FK 참조:** userId → UserAccount.id (cuid), deviceId → SensorDevice.id (cuid)
- **추가 필드 금지:** MVP에서는 `assignedAt`, `role` 등 추가 필드 없이 순수 조인 테이블로 운영
- **금지어 규칙:** CON-04 준수 — `patient`, `medical`, `diagnosis` 사용 금지
- **Cascade 정책:** MVP에서는 기본 Prisma 동작 (`onDelete: Restrict`) 유지 권장. UserAccount/SensorDevice 삭제 전 연관 UserDevice 수동 삭제 필요.

## :checkered_flag: Definition of Done (DoD)
- [ ] `prisma/schema.prisma`에 UserDevice 모델이 정확히 정의되었는가?
- [ ] `@@id([userId, deviceId])` 복합 PK가 정상 설정되었는가?
- [ ] UserAccount ↔ UserDevice ↔ SensorDevice 양방향 관계가 정상 연결되었는가?
- [ ] `npx prisma validate`가 에러 없이 통과하는가?
- [ ] 중복 (userId, deviceId) 쌍 생성이 방지되는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 (SensorDevice 모델), DB-003 (UserAccount 모델)
- **Blocks:** DB-006 (Prisma Client 싱글턴 — 전체 5개 모델 완성 필요), MOCK-001 (UserDevice 연결 데이터 Seed)
- **참고:** SRS §6.2.4에 명시된 대로 Explicit M:N 조인 테이블 방식을 사용합니다. Prisma의 implicit M:N(`@relation`)이 아닌 명시적 모델 정의가 필요합니다 — 향후 `assignedAt` 등 추가 필드 확장 가능성을 고려한 설계입니다.
