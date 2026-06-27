---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-008: Server Action 인터페이스 정의 — 4개 Core Server Actions 입출력 타입"
labels: 'feature, api-spec, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [API-008] Server Action 인터페이스 정의 — `createWellnessEvent`, `updateFalseAlarmFlag`, `generateDailyReport`, `updateDeviceStatus` 입출력 타입
- 목적: Next.js Server Actions 4개의 입력/출력 TypeScript 타입을 사전 정의하여, Route Handler와 Server Action 간의 계약을 명확히 하고 후속 구현 태스크의 타입 안정성을 보장한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — MVP Core Server Actions (4개)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — `app/actions/events.ts`, `reports.ts`, `devices.ts`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-07`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Server Actions / Route Handlers 전용
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§6.2.1~§6.2.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — 5개 모델 필드 참조
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-008

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] **SA #1: `createWellnessEvent`** (`app/actions/events.ts`) 타입 정의:
  ```typescript
  // Input
  interface CreateWellnessEventInput {
    deviceId: string
    eventType: "ACTIVITY_ALERT" | "WELLNESS_SCORE" | "EMERGENCY"
    timestamp: Date
    confidenceScore: number    // 0.0 ~ 1.0
    zone?: string              // default: "BEDROOM"
    integrityHash: string
  }
  // Output
  interface CreateWellnessEventOutput {
    success: boolean
    event?: { id: string; deviceId: string; timestamp: Date }
    error?: string
  }
  ```
- [ ] **SA #2: `updateFalseAlarmFlag`** (`app/actions/events.ts`) 타입 정의:
  ```typescript
  // Input
  interface UpdateFalseAlarmInput {
    eventId: string
    isFalseAlarm: boolean
  }
  // Output
  interface UpdateFalseAlarmOutput {
    success: boolean
    event?: { id: string; isFalseAlarm: boolean; updatedAt: Date }
    error?: string
  }
  ```
- [ ] **SA #3: `generateDailyReport`** (`app/actions/reports.ts`) 타입 정의:
  ```typescript
  // Input
  interface GenerateDailyReportInput {
    deviceId: string
    date: Date                 // 대상 날짜 (전일)
  }
  // Output
  interface GenerateDailyReportOutput {
    success: boolean
    report?: {
      id: string
      deviceId: string
      date: Date
      sleepScore: number | null
      bathroomVisitCount: number | null
      anomalyFlags: string[]
      statusCode: string
      aiSummary: string | null
    }
    emailSent?: boolean        // Resend 이메일 발송 여부
    error?: string
  }
  ```
- [ ] **SA #4: `updateDeviceStatus`** (`app/actions/devices.ts`) 타입 정의:
  ```typescript
  // Input
  interface UpdateDeviceStatusInput {
    deviceId: string
    status?: "ACTIVE" | "INACTIVE" | "MAINTENANCE"
    lastHeartbeatAt?: Date
  }
  // Output
  interface UpdateDeviceStatusOutput {
    success: boolean
    device?: { id: string; status: string; lastHeartbeatAt: Date | null }
    error?: string
  }
  ```
- [ ] 타입 파일 위치 결정: `types/actions.ts` 또는 각 Action 파일 내 인라인
- [ ] `'use server'` 디렉티브 적용 규격 명시
- [ ] 에러 처리 패턴 통일: `{ success: boolean; error?: string }` 일관된 반환 구조

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 타입 일관성 검증**
- Given: 4개 Server Action의 입출력 타입이 정의됨
- When: Route Handler에서 Server Action을 호출함
- Then: TypeScript 컴파일 에러 없이 타입 안정적으로 호출 가능하다.

**Scenario 2: createWellnessEvent 타입 호환**
- Given: API-001의 EventIngestRequest DTO가 정의됨
- When: Route Handler에서 DTO를 CreateWellnessEventInput으로 변환함
- Then: 필드 매핑이 1:1로 대응되고 타입 변환이 명확하다.

**Scenario 3: generateDailyReport Output 완전성**
- Given: Output 타입에 emailSent 필드가 포함됨
- When: Daily Report 생성 파이프라인이 실행됨
- Then: 보고서 생성 + 이메일 발송 결과가 하나의 Output에서 확인 가능하다.

**Scenario 4: 에러 처리 패턴 일관성**
- Given: 모든 Server Action이 `{ success: boolean; error?: string }` 패턴을 따름
- When: 모든 Action의 에러 시나리오를 확인함
- Then: 동일한 에러 처리 패턴으로 Route Handler에서 일관되게 처리 가능하다.

## :gear: Technical & Non-Functional Constraints
- **Server Actions 전용:** `'use server'` 디렉티브 필수 — CON-07
- **타입 안정성:** 모든 입출력이 TypeScript 타입으로 사전 정의되어 런타임 에러 방지
- **에러 패턴:** throw 대신 `{ success: false, error: "..." }` 반환 패턴 사용 (Server Action 직렬화 제약)
- **금지어:** Input/Output 타입에 `diagnosis`, `medical`, `patient` 미사용 — CON-04

## :checkered_flag: Definition of Done (DoD)
- [ ] 4개 Server Action의 Input/Output 타입이 TypeScript로 정의되었는가?
- [ ] 각 Action 타입이 해당 Prisma 모델 필드와 일치하는가?
- [ ] 에러 처리 패턴이 일관적인가?
- [ ] `'use server'` 디렉티브 적용 규격이 명시되었는가?
- [ ] API DTO(API-001~006)와의 필드 매핑이 명확한가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 ~ DB-005 (5개 모델 필드 참조)
- **Blocks:** EVT-002 (createWellnessEvent 구현), FA-002 (updateFalseAlarmFlag 구현), PIPE-001~006 (generateDailyReport 구현), HB-002 (updateDeviceStatus 구현)
- **참고:** 이 태스크는 Step 1(Contract) 마지막 태스크로, Server Action 구현(Step 2) 전에 인터페이스를 확정합니다.
