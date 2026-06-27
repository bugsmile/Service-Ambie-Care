---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] MOCK-002: prisma/seed.ts — Mock WellnessEvent 7일치 생성"
labels: 'feature, mock-data, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [MOCK-002] `prisma/seed.ts` — Mock WellnessEvent 7일치 생성 (5분 간격 288개/일/디바이스, eventType 분포: ACTIVITY_ALERT 95%, WELLNESS_SCORE 4%, EMERGENCY 1%)
- 목적: Traffic Light 대시보드, Daily Report 조회, False Alarm 피드백 등 프론트엔드 개발에 필요한 현실적인 이벤트 데이터를 자동 생성하여, 실제 센서 없이도 모든 UI 기능을 테스트할 수 있는 환경을 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock WellnessEvent 사양
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§14.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Sample Mock Data
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — WellnessEvent 모델 필드
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#GAP-10`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Mock 데이터 의존 리스크
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — MOCK-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `prisma/seed.ts`에 WellnessEvent 생성 함수 추가
- [ ] 생성 규격:
  - **기간:** 7일 (오늘 기준 7일 전 ~ 어제)
  - **간격:** 5분 (1일 288개/디바이스)
  - **총 이벤트:** 3 디바이스 × 288 × 7 = **6,048개**
  - **eventType 분포:**
    - `ACTIVITY_ALERT`: 95% (273개/일/디바이스)
    - `WELLNESS_SCORE`: 4% (12개/일/디바이스)
    - `EMERGENCY`: 1% (3개/일/디바이스)
- [ ] 각 이벤트 필드 생성 규칙:
  - `id`: `cuid()` 자동 생성
  - `deviceId`: MOCK-001에서 생성된 디바이스 참조
  - `eventType`: 확률 분포에 따라 랜덤 배정
  - `timestamp`: 5분 간격 순차 생성 (오래된 것부터 최신 순서)
  - `confidenceScore`: 0.6 ~ 1.0 랜덤 (EMERGENCY는 0.8 이상)
  - `isFalseAlarm`: `false` 기본 (일부 EMERGENCY에 `true` 설정 가능)
  - `zone`: `"BEDROOM"` 고정
  - `integrityHash`: 간단한 hash 문자열 생성 (`crypto.createHash('sha256')`)
- [ ] 배치 삽입 — `prisma.wellnessEvent.createMany({ data: [...] })` 사용 (성능)
- [ ] 배치 크기 관리 — 6,048건을 한 번에 삽입하면 메모리 이슈 가능. 디바이스별 or 일별 배치 분할
- [ ] `INACTIVE` 디바이스(dev-003)에 대해서는 이벤트 생성을 줄이거나 마지막 2일간 생성하지 않음 (현실적 시나리오)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 7일치 이벤트 총 건수 검증**
- Given: MOCK-001 Seed가 완료되어 3개 디바이스가 존재함
- When: MOCK-002 Seed를 실행함
- Then: 약 6,048개의 WellnessEvent가 DB에 생성된다.

**Scenario 2: eventType 분포 검증**
- Given: Seed 실행 완료
- When: `prisma.wellnessEvent.groupBy({ by: ['eventType'], _count: true })`를 실행함
- Then: ACTIVITY_ALERT ≈ 95%, WELLNESS_SCORE ≈ 4%, EMERGENCY ≈ 1% 비율로 분포한다.

**Scenario 3: timestamp 순차 검증**
- Given: Seed 실행 완료
- When: 특정 디바이스의 이벤트를 `timestamp` 오름차순으로 조회함
- Then: 5분 간격으로 순차적으로 생성된 타임스탬프가 확인된다.

**Scenario 4: INACTIVE 디바이스 현실적 데이터**
- Given: dev-003이 `INACTIVE` 상태임
- When: dev-003의 이벤트를 조회함
- Then: 최근 2일 이벤트가 없거나 줄어든 현실적 패턴을 보인다.

**Scenario 5: integrityHash 생성**
- Given: 모든 이벤트에 integrityHash가 필수임
- When: Seed 실행 완료
- Then: 모든 이벤트의 integrityHash가 비어있지 않은 SHA-256 형식 문자열이다.

## :gear: Technical & Non-Functional Constraints
- **데이터 볼륨:** 약 6,048건 — Supabase Free 500MB 내 (약 2~5MB 추정)
- **배치 삽입:** `createMany()` 필수 — 개별 `create()` 6,048회는 성능 불가
- **배치 분할:** 디바이스별 또는 일별 1,000건 단위 배치 권장
- **분포 정확도:** ±2% 오차 허용 (확률 기반 랜덤이므로)
- **멱등성:** 기존 이벤트 삭제 후 재생성 (`deleteMany()` → `createMany()`) 패턴 사용
- **Phase:** Phase 0

## :checkered_flag: Definition of Done (DoD)
- [ ] 7일치 WellnessEvent가 정상 생성되는가?
- [ ] eventType 분포가 95/4/1 비율을 근사하는가?
- [ ] timestamp가 5분 간격으로 순차 생성되는가?
- [ ] `createMany()` 배치 삽입으로 실행 시간이 합리적인가 (< 30초)?
- [ ] integrityHash가 모든 레코드에 존재하는가?
- [ ] Seed 실행 중 메모리/타임아웃 이슈가 없는가?

## :construction: Dependencies & Blockers
- **Depends on:** MOCK-001 (SensorDevice + UserAccount Seed 완료)
- **Blocks:** MOCK-003 (DailyReport 생성 — 이벤트 기반), MOCK-004 (Mock API — 이벤트 분포 참조), 프론트엔드 개발 (Traffic Light, 보고서 UI)
