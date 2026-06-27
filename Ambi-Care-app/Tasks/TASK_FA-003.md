---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FA-003: Guardian Portal — Report False Alarm 버튼 + 피드백 제출 UI"
labels: 'feature, frontend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [FA-003] Guardian 포털 내 "거짓 경보 신고" 버튼 및 피드백 제출 UI 구현
- 목적: Guardian이 일간 보고서 또는 이벤트 목록에서 특정 이벤트를 "거짓 경보"로 신고할 수 있는 UI 버튼과 확인 다이얼로그를 구현하여, 시스템이 거짓 경보를 학습하고 알림 정확도를 높일 수 있도록 한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — PMF Sequence: False Alarm Feedback
- 기능 요구사항: REQ-FUNC-005 — 거짓 경보 피드백 UI
- API: [`/TASKs/TASK_FA-001.md`](./TASK_FA-001.md) — POST /api/events/[eventId]/false-alarm
- 페이지: [`/TASKs/TASK_RPT-002.md`](./TASK_RPT-002.md) — Guardian 홈 대시보드
- 페이지: [`/TASKs/TASK_RPT-003.md`](./TASK_RPT-003.md) — 일간 보고서 상세 페이지
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — FA-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `components/reports/false-alarm-button.tsx` — Client Component(`"use client"`) 생성
- [ ] Props 타입:
  ```typescript
  interface FalseAlarmButtonProps {
    eventId: string;
    isFalseAlarm: boolean;
    onSuccess?: () => void;
  }
  ```
- [ ] shadcn/ui `AlertDialog` 확인 모달 구현:
  - 버튼 클릭 → "이 이벤트를 거짓 경보로 신고하시겠습니까?" 확인 다이얼로그
  - "확인" → `POST /api/events/{eventId}/false-alarm` 호출
  - "취소" → 다이얼로그 닫기
- [ ] API 호출 중 로딩 상태 — 버튼 비활성화 + 스피너
- [ ] 성공 후 버튼 상태 변경 — "거짓 경보로 신고됨" 비활성 상태로 표시 (재신고 방지)
- [ ] `isFalseAlarm: true` 초기 상태 시 처음부터 비활성 버튼으로 렌더링
- [ ] 에러 발생 시 shadcn/ui `Toast`로 "신고에 실패했습니다. 다시 시도해주세요." 표시
- [ ] `RPT-002` Guardian 홈 대시보드와 `RPT-003` 보고서 상세 페이지에 이 컴포넌트 통합

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 거짓 경보 신고 정상 제출**
- Given: Guardian이 특정 이벤트 카드에서 "거짓 경보 신고" 버튼 클릭
- When: 확인 다이얼로그에서 "확인" 클릭
- Then: API 호출 성공, 버튼이 "거짓 경보로 신고됨" 비활성 상태로 변경된다.

**Scenario 2: 확인 다이얼로그 취소**
- Given: "거짓 경보 신고" 버튼 클릭 후 확인 다이얼로그 표시됨
- When: "취소" 버튼 클릭
- Then: 다이얼로그가 닫히고 이벤트 상태 변화 없음.

**Scenario 3: 이미 거짓 경보로 신고된 이벤트**
- Given: `isFalseAlarm: true` Props로 컴포넌트 렌더링
- When: 컴포넌트 렌더링
- Then: 버튼이 비활성 상태("거짓 경보로 신고됨")로 표시되어 재신고 불가.

**Scenario 4: API 호출 실패 시 Toast 에러 표시**
- Given: 확인 클릭 후 API 호출 실패
- When: 에러 응답 수신
- Then: Toast 에러 메시지가 표시되고 버튼이 다시 활성 상태로 복귀.

## :gear: Technical & Non-Functional Constraints
- **Client Component 필수:** 사용자 인터랙션(클릭, 상태 변경) 포함 — `"use client"` 선언
- **UI 라이브러리:** shadcn/ui `AlertDialog`, `Button`, `Toast` 사용 — CON-09
- **UX:** 확인 단계(다이얼로그) 없이 즉시 신고되지 않도록 방지 — 실수 신고 예방

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 확인 다이얼로그가 표시되고 취소 시 아무 변화 없는가?
- [ ] 성공 후 버튼이 비활성 상태로 전환되는가?
- [ ] 에러 시 Toast가 표시되는가?
- [ ] RPT-002, RPT-003 페이지에 통합되었는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_FA-001 (false-alarm API), TASK_RPT-002 (Guardian 홈), TASK_RPT-003 (보고서 상세), TASK_INFRA-001 (shadcn/ui AlertDialog 설치)
- **Blocks:** 없음 (Phase 2 최종 UI 기능)
