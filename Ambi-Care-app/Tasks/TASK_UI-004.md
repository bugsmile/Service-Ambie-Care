---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] UI-004: DeviceStatusIndicator — 디바이스 상태 표시 공유 컴포넌트"
labels: 'feature, frontend, priority:low, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [UI-004] `device-status-indicator.tsx` 공유 컴포넌트 구현
- 목적: Guardian 포털과 B2B Dashboard 양쪽에서 재사용되는 디바이스 상태 표시 인디케이터 컴포넌트를 `components/shared/` 하위에 구현하여, 동일한 상태 표시 로직의 중복을 제거하고 일관성을 보장한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`components/shared/`)
- 디바이스 상태 카드: [`/TASKs/TASK_DASH-004.md`](./TASK_DASH-004.md) — TrafficLightCard (상위 컴포넌트)
- API 계약: [`/TASKs/TASK_API-003.md`](./TASK_API-003.md) — device status 타입
- 데이터 모델: [`/TASKs/TASK_DB-001.md`](./TASK_DB-001.md) — SensorDevice.status 필드
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — UI-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `components/shared/device-status-indicator.tsx` 파일 생성
- [ ] Props 타입 정의:
  ```typescript
  interface DeviceStatusIndicatorProps {
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
  }
  ```
- [ ] 상태별 색상 + 레이블 매핑:
  - `ACTIVE` → Green dot + "활성" (옵션)
  - `INACTIVE` → Red dot + "오프라인" (옵션)
  - `MAINTENANCE` → Yellow dot + "점검 중" (옵션)
- [ ] 시각적 구현 — Tailwind CSS로 색상 원형 인디케이터 (예: `w-3 h-3 rounded-full bg-green-500`)
- [ ] `size` 별 크기 변환 — `sm: w-2 h-2`, `md: w-3 h-3`, `lg: w-4 h-4`
- [ ] `showLabel` props로 텍스트 레이블 표시 여부 제어
- [ ] `ACTIVE` 상태 시 `animate-pulse` 옵션 (선택적 `pulse` prop)
- [ ] 접근성 — `role="status"` + `aria-label="디바이스 상태: 활성"` 속성
- [ ] `types/device.ts` — `DeviceStatus` 타입을 공유 타입 파일에 정의

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: ACTIVE 상태 표시**
- Given: `status: "ACTIVE"`, `showLabel: true` Props 전달
- When: `<DeviceStatusIndicator />` 렌더링
- Then: Green 원형 인디케이터와 "활성" 레이블이 표시된다.

**Scenario 2: INACTIVE 상태 표시**
- Given: `status: "INACTIVE"`, `showLabel: true` Props 전달
- When: `<DeviceStatusIndicator />` 렌더링
- Then: Red 원형 인디케이터와 "오프라인" 레이블이 표시된다.

**Scenario 3: 레이블 숨김 모드**
- Given: `status: "ACTIVE"`, `showLabel: false` Props 전달
- When: `<DeviceStatusIndicator />` 렌더링
- Then: 색상 인디케이터만 표시되고 텍스트 레이블은 숨겨지지만, `aria-label`은 유지된다.

**Scenario 4: 다양한 크기 렌더링**
- Given: `size: "sm"`, `size: "md"`, `size: "lg"` 각각 전달
- When: `<DeviceStatusIndicator />` 렌더링
- Then: 각각 2px, 3px, 4px(Tailwind 기준 w-2/w-3/w-4) 크기의 인디케이터가 표시된다.

## :gear: Technical & Non-Functional Constraints
- **순수 표시 컴포넌트:** 내부 상태/API 호출 없음 — Props 기반 순수 렌더링만
- **공유 컴포넌트:** Guardian과 Admin 양쪽에서 import하여 사용 — `components/shared/` 위치 필수
- **타입 공유:** `DeviceStatus` 타입은 `types/device.ts`에서 export하여 중복 정의 방지
- **접근성:** 색상만으로 상태를 전달하지 않도록 `aria-label` 필수

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 3가지 상태(ACTIVE/INACTIVE/MAINTENANCE)가 모두 정확한 색상으로 표시되는가?
- [ ] `showLabel`, `size` props가 정상 동작하는가?
- [ ] `aria-label` 접근성 속성이 올바르게 설정되는가?
- [ ] `DeviceStatus` 타입이 공유 파일에 정의되고 다른 컴포넌트에서 재사용 가능한가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001 (Tailwind CSS 설치), TASK_DB-001 (SensorDevice.status Enum 타입)
- **Blocks:** TASK_DASH-004 (TrafficLightCard에서 이 컴포넌트 재사용 가능), TASK_UI-002 (Guardian Layout 네비게이션에서 사용 가능)
- **참고:** TASK_DASH-004의 `traffic-light-card.tsx`와 역할이 겹치지 않도록 주의한다. `DeviceStatusIndicator`는 단순 상태 표시 dot/badge이고, `TrafficLightCard`는 이를 포함하는 전체 카드 컴포넌트이다.
