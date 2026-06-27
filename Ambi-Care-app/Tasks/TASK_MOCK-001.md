---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] MOCK-001: prisma/seed.ts — Mock SensorDevice + UserAccount + UserDevice Seed 스크립트"
labels: 'feature, mock-data, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [MOCK-001] `prisma/seed.ts` — Mock SensorDevice 3~5개 + Mock UserAccount 3개 (Guardian 2, Admin 1) + UserDevice 연결 데이터 생성 스크립트 작성
- 목적: Edge 센서 없이 웹 애플리케이션을 개발하고 데모하기 위한 기본 마스터 데이터(디바이스, 사용자, 연결 관계)를 자동 생성하는 Seed 스크립트를 작성하여, 모든 후속 개발 및 테스트의 데이터 기반을 확보한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Seed Script 사양
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sample Mock Data (JSON)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — `prisma/seed.ts` 위치
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#NEW-06`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock Data Generator 역량
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — MOCK-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/seed.ts` 파일 생성
- [ ] Mock SensorDevice 3~5개 생성 (SRS §14.2 준수):
  ```typescript
  const devices = [
    { id: "dev-001", locationZone: "BEDROOM", status: "ACTIVE", firmwareVersion: "1.0.0-mock", installationDate: new Date(), calibrationStatus: "CALIBRATED" },
    { id: "dev-002", locationZone: "BEDROOM", status: "ACTIVE", firmwareVersion: "1.0.0-mock", installationDate: new Date(), calibrationStatus: "CALIBRATED" },
    { id: "dev-003", locationZone: "BEDROOM", status: "INACTIVE", firmwareVersion: "1.0.0-mock", installationDate: new Date(), calibrationStatus: "PENDING" },
  ]
  ```
- [ ] Mock UserAccount 3명 생성 (Guardian 2, Admin 1):
  ```typescript
  const users = [
    { email: "guardian1@demo.com", role: "GUARDIAN", name: "Park Ji-soo (Demo)" },
    { email: "guardian2@demo.com", role: "GUARDIAN", name: "Kim Min-ji (Demo)" },
    { email: "admin@demo.com", role: "FACILITY_ADMIN", name: "Admin (Demo)" },
  ]
  ```
- [ ] Mock UserDevice 연결 생성:
  - Guardian-1 → dev-001, dev-002
  - Guardian-2 → dev-002, dev-003
  - Admin → dev-001, dev-002, dev-003 (전체 접근)
- [ ] `package.json`에 Prisma seed 설정 추가:
  ```json
  { "prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" } }
  ```
- [ ] `npx prisma db seed` 실행 테스트
- [ ] 중복 실행 방지 — `upsert()` 사용으로 idempotent(멱등) 실행 보장
- [ ] Seed 완료 로그 출력 — 생성된 디바이스 수, 사용자 수, 연결 수 콘솔 출력

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: Seed 스크립트 정상 실행**
- Given: DB가 비어있고 마이그레이션이 완료됨
- When: `npx prisma db seed`를 실행함
- Then: SensorDevice 3개, UserAccount 3개, UserDevice 5개가 생성되고, 콘솔에 생성 결과가 출력된다.

**Scenario 2: 멱등 실행 (중복 방지)**
- Given: Seed가 이미 한 번 실행됨
- When: `npx prisma db seed`를 다시 실행함
- Then: 에러 없이 upsert로 기존 데이터가 유지되고 중복 생성되지 않는다.

**Scenario 3: Mock 데이터 SRS 준수**
- Given: Seed 실행 완료
- When: `prisma.sensorDevice.findMany()`를 실행함
- Then: §14.2 Sample Data와 일치하는 디바이스 정보(id, locationZone, status)가 반환된다.

**Scenario 4: UserDevice 연결 검증**
- Given: Seed 실행 완료
- When: Guardian-1의 연결 디바이스를 조회함
- Then: dev-001, dev-002가 연결되어 있다.

## :gear: Technical & Non-Functional Constraints
- **위치:** `prisma/seed.ts` — SRS §8 준수
- **실행 방법:** `npx prisma db seed` (package.json prisma.seed 설정)
- **TypeScript 실행:** `ts-node` 또는 `tsx` 사용
- **멱등성:** `upsert()` 사용 필수 — 반복 실행 시 에러 방지
- **ID 고정:** Mock 데이터는 `dev-001`, `dev-002` 등 예측 가능한 ID 사용 (테스트 편의)
- **Phase:** Phase 0

## :checkered_flag: Definition of Done (DoD)
- [ ] `prisma/seed.ts` 파일이 생성되었는가?
- [ ] `npx prisma db seed`로 정상 실행되는가?
- [ ] SensorDevice 3~5개가 §14.2와 일치하는가?
- [ ] UserAccount 3명(Guardian 2, Admin 1)이 생성되는가?
- [ ] UserDevice 연결이 정상 생성되는가?
- [ ] 중복 실행 시 에러가 발생하지 않는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-007 (Prisma 마이그레이션 완료 — 실제 테이블 존재)
- **Blocks:** MOCK-002 (Mock WellnessEvent 생성), MOCK-003 (Mock DailyReport 생성), MOCK-004 (Mock API 구현)
- **참고:** MOCK-001은 마스터 데이터(디바이스/사용자) 생성 전용입니다. 이벤트/보고서 Mock 데이터는 MOCK-002, MOCK-003에서 이 Seed 위에 추가됩니다.
