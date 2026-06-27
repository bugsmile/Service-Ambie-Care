---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DASH-004: TrafficLightCard — 개별 침대 상태 카드 컴포넌트"
labels: 'feature, frontend, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [DASH-004] `traffic-light-card.tsx` 재사용 가능 컴포넌트 구현
- 목적: 개별 침대(디바이스)의 상태 정보를 신호등 색상으로 시각화하는 재사용 가능한 카드 컴포넌트를 구현하여, Dashboard UI에서 일관된 상태 표시를 보장한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure
- 기능 요구사항: REQ-FUNC-011 — Traffic Light 시각화
- API Response DTO: [`/TASKs/TASK_API-003.md`](./TASK_API-003.md) — devices[] 항목 타입
- 페이지 연동: [`/TASKs/TASK_DASH-002.md`](./TASK_DASH-002.md) — Dashboard UI
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DASH-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `components/dashboard/traffic-light-card.tsx` 파일 생성
- [ ] Props 타입 정의:
  ```typescript
  interface TrafficLightCardProps {
    deviceId: string;
    locationZone: string;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    lastHeartbeatAt: Date | null;
    latestEvent: { eventType: string; timestamp: Date; confidenceScore: number } | null;
  }
  ```
- [ ] 신호등 색상 결정 함수 `getTrafficColor(status, latestEvent)` 구현:
  - `INACTIVE` → `'red'`
  - `ACTIVE` + `latestEvent.eventType === 'EMERGENCY'` → `'red'`
  - `ACTIVE` + `latestEvent.eventType === 'ACTIVITY_ALERT'` → `'yellow'`
  - `ACTIVE` + 이벤트 없음 또는 `WELLNESS_SCORE` → `'green'`
- [ ] shadcn/ui `Card` + `Badge` 컴포넌트로 UI 구성
- [ ] 색상별 Tailwind CSS 클래스 적용 (red: `bg-red-500`, yellow: `bg-yellow-400`, green: `bg-green-500`)
- [ ] 카드 내 정보 표시: `locationZone`, `deviceId` (마지막 4자리), 상태 텍스트, `lastHeartbeatAt` (상대 시간 포맷: "5분 전")
- [ ] 색맹 접근성: 색상 + 텍스트 레이블 병행 표시 ("정상" / "주의" / "긴급" / "오프라인")
- [ ] 긴급(Red) 상태 시 `animate-pulse` CSS 애니메이션 적용으로 시각적 강조
- [ ] Storybook 또는 `__tests__/traffic-light-card.test.tsx` 작성 (옵션)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: ACTIVE + 이벤트 없음 → Green**
- Given: `status: "ACTIVE"`, `latestEvent: null` Props 전달
- When: `<TrafficLightCard />` 렌더링
- Then: Green Badge와 "정상" 텍스트가 표시된다.

**Scenario 2: ACTIVE + EMERGENCY → Red + Pulse**
- Given: `status: "ACTIVE"`, `latestEvent.eventType: "EMERGENCY"` Props 전달
- When: `<TrafficLightCard />` 렌더링
- Then: Red Badge와 "긴급" 텍스트, `animate-pulse` 애니메이션이 적용된다.

**Scenario 3: INACTIVE → Red + 오프라인 레이블**
- Given: `status: "INACTIVE"` Props 전달
- When: `<TrafficLightCard />` 렌더링
- Then: Red Badge와 "오프라인" 텍스트가 표시된다.

**Scenario 4: ACTIVITY_ALERT → Yellow**
- Given: `status: "ACTIVE"`, `latestEvent.eventType: "ACTIVITY_ALERT"` Props 전달
- When: `<TrafficLightCard />` 렌더링
- Then: Yellow Badge와 "주의" 텍스트가 표시된다.

## :gear: Technical & Non-Functional Constraints
- **순수 컴포넌트:** Props만으로 렌더링 — 내부에서 API fetch 금지 (데이터는 부모에서 주입)
- **재사용성:** Dashboard 페이지 외에도 다른 컨텍스트에서 사용 가능하도록 설계
- **UI 라이브러리:** shadcn/ui `Card`, `Badge` 사용 — CON-09
- **접근성:** `aria-label` 속성으로 스크린 리더 지원 (`aria-label="침대 B-101: 긴급 상태"`)

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 4가지 상태 조합(Green/Yellow/Red-Emergency/Red-Offline)이 모두 정확하게 렌더링되는가?
- [ ] 텍스트 레이블이 색상과 항상 함께 표시되는가 (접근성)?
- [ ] 긴급 상태에서 `animate-pulse`가 동작하는가?
- [ ] Props 타입이 완전히 정의되어 TypeScript 오류가 없는가?
- [ ] ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001 (shadcn/ui 설치), TASK_API-003 (Response DTO 타입)
- **Blocks:** TASK_DASH-002 (Dashboard UI 페이지에서 이 컴포넌트 사용)
- **참고:** `getTrafficColor` 함수는 `lib/utils/device-status.ts`로 분리하여 테스트하기 쉽게 구성하는 것을 권장한다.
