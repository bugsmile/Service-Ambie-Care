---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] ENH-005: Vercel Analytics / Umami — view_daily_report 이벤트 추적 연동"
labels: 'feature, infra, priority:low, phase:3'
assignees: ''
---

## :dart: Summary
- 기능명: [ENH-005] 사용자 행동 분석 도구 연동 (Vercel Analytics 또는 Umami)
- 목적: Guardian의 `view_daily_report` 이벤트 등 핵심 사용자 행동을 추적하여, 제품 사용 패턴과 PMF(Product-Market Fit) 지표를 측정할 수 있도록 Vercel Analytics(무료) 또는 Umami(오픈소스 자체 호스팅)를 연동한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 3 Enhancements
- 비기능 요구사항: REQ-NF-014 (사용자 행동 추적), REQ-NF-015 (Analytics 이벤트)
- 의존 태스크: [`/TASKs/TASK_INFRA-002.md`](./TASK_INFRA-002.md) — Vercel 배포 설정
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — ENH-005

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] **옵션 A: Vercel Analytics (권장)**
  - `npm install @vercel/analytics`
  - `app/layout.tsx`에 `<Analytics />` 컴포넌트 추가
  - Vercel 대시보드에서 Analytics 활성화 (Hobby 무료 포함)
- [ ] **옵션 B: Umami (자체 호스팅)**
  - Umami 스크립트 태그를 `app/layout.tsx` `<head>`에 추가
  - `data-website-id` 설정
- [ ] 커스텀 이벤트 추적 유틸리티 — `lib/analytics.ts`:
  ```typescript
  export function trackEvent(name: string, properties?: Record<string, string>) {
    if (typeof window !== 'undefined') {
      // Vercel Analytics
      window.va?.('event', { name, ...properties });
      // 또는 Umami
      window.umami?.track(name, properties);
    }
  }
  ```
- [ ] 핵심 이벤트 추적 구현:
  - `view_daily_report`: `RPT-003` 일간 보고서 상세 페이지 마운트 시
  - `report_false_alarm`: `FA-003` 거짓 경보 신고 성공 시
  - `view_dashboard`: `DASH-002` Dashboard 페이지 방문 시
- [ ] 개인정보 보호 — PII(이메일, 디바이스 ID 등) 이벤트 페이로드에 포함 금지 (REQ-NF-009)
- [ ] 개발 환경에서는 이벤트 추적 비활성화 — `NODE_ENV === 'production'` 체크

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: view_daily_report 이벤트 추적**
- Given: Guardian이 `/reports/2026-04-21` 페이지 접속
- When: 페이지가 마운트됨
- Then: `view_daily_report` 이벤트가 Analytics 대시보드에 기록된다.

**Scenario 2: report_false_alarm 이벤트 추적**
- Given: Guardian이 거짓 경보 신고 완료
- When: `FA-003` 피드백 제출 성공
- Then: `report_false_alarm` 이벤트가 기록된다.

**Scenario 3: 개발 환경에서 이벤트 미전송**
- Given: `NODE_ENV === 'development'` 환경
- When: `trackEvent('view_daily_report')` 호출
- Then: 실제 Analytics API 호출 없음 (개발 데이터 오염 방지).

**Scenario 4: PII 포함 이벤트 차단**
- Given: 이벤트 페이로드에 이메일 주소 포함 시도
- When: `trackEvent('view_report', { userEmail: 'test@example.com' })` 호출
- Then: 이벤트가 전송되지 않거나 PII 필드가 제거된다.

## :gear: Technical & Non-Functional Constraints
- **프라이버시:** REQ-NF-009 — PII 수집 금지. 이벤트 name과 non-PII 속성만 전송
- **무료 티어:** Vercel Analytics Hobby 플랜 무료 — 추가 비용 없음
- **SSR 안전:** `typeof window !== 'undefined'` 체크 — 서버 사이드 렌더링 시 오류 방지
- **선택적:** Umami는 자체 호스팅 필요 — MVP에서는 Vercel Analytics 권장

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `view_daily_report` 이벤트가 Analytics 대시보드에서 확인되는가?
- [ ] 개발 환경에서 이벤트가 전송되지 않는가?
- [ ] PII가 이벤트 페이로드에 포함되지 않는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-002 (Vercel 배포), TASK_RPT-003 (보고서 페이지), TASK_FA-003 (거짓 경보 UI)
- **Blocks:** 없음 (독립 Enhancement)
