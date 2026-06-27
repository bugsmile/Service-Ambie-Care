---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] OPS-001: lib/slack.ts — Slack/Discord Incoming Webhook 유틸리티 설정"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [OPS-001] Slack/Discord Webhook 운영 알림 유틸리티 설정 (`lib/slack.ts`)
- 목적: 시스템 운영 이벤트(디바이스 대규모 오프라인, 파이프라인 에러 등)를 Slack 또는 Discord Incoming Webhook으로 전송하는 공유 유틸리티를 구현한다. OPS-002의 모든 운영 알림에서 이 유틸리티를 사용한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 2 Pipeline
- 기능 요구사항: REQ-NF-007 — 운영 이상 시 Slack/Discord 알림
- 환경 변수: [`/TASKs/TASK_INFRA-004.md`](./TASK_INFRA-004.md) — SLACK_WEBHOOK_URL
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — OPS-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/slack.ts` 파일 생성
- [ ] `import 'server-only'` — 서버 전용 모듈 지정
- [ ] `sendWebhookAlert(message: WebhookMessage): Promise<{ success: boolean }>` 공통 함수 구현:
  ```typescript
  interface WebhookMessage {
    text: string;
    level?: 'info' | 'warning' | 'critical';
    fields?: { title: string; value: string }[];
  }
  ```
- [ ] Slack/Discord 공통 포맷 — `fetch(SLACK_WEBHOOK_URL, { method: 'POST', body: JSON.stringify({ text }) })` 기본 구현
  - Slack Block Kit 또는 Discord Embed 형식 지원 (선택적)
  - `level`에 따른 이모지 접두사: `info` → ℹ️, `warning` → ⚠️, `critical` → 🚨
- [ ] `SLACK_WEBHOOK_URL` 미설정 시 경고 로그 + `{ success: false }` 반환 (에러 throw 금지)
- [ ] 전송 실패 시 에러 throw 없이 `{ success: false, error }` 반환
- [ ] `.env.example`에 `SLACK_WEBHOOK_URL=https://hooks.slack.com/...` 예시 추가

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 Webhook 전송**
- Given: `SLACK_WEBHOOK_URL` 설정됨, 유효한 Webhook URL
- When: `sendWebhookAlert({ text: '⚠️ 디바이스 오프라인 비율 10% 초과', level: 'warning' })` 호출
- Then: `{ success: true }` 반환, Slack/Discord 채널에 메시지 수신.

**Scenario 2: Webhook URL 미설정 시 안전 처리**
- Given: `SLACK_WEBHOOK_URL` 미설정
- When: `sendWebhookAlert(...)` 호출
- Then: 경고 로그 출력, `{ success: false }` 반환 — 서버 크래시 없음.

**Scenario 3: 전송 실패 시 에러 throw 없음**
- Given: 잘못된 Webhook URL 또는 네트워크 오류
- When: `sendWebhookAlert(...)` 호출
- Then: `{ success: false, error: '...' }` 반환, 에러 propagation 없음.

## :gear: Technical & Non-Functional Constraints
- **호환성:** Slack과 Discord Webhook 모두 `{ "text": "..." }` JSON 페이로드를 지원하므로 기본 형식 공유 가능
- **server-only:** `SLACK_WEBHOOK_URL` 노출 방지
- **비차단:** 운영 알림 실패가 메인 비즈니스 로직에 영향 없도록 에러 throw 금지

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `import 'server-only'`가 설정되었는가?
- [ ] URL 미설정/전송 실패 시 에러 없이 `{ success: false }` 반환하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** Webhook 설정, 메시지 포맷, 비밀값 보관, 실패 시 로깅/무시 정책을 분리해 정의한다.
- **추가 Edge Cases:** Webhook URL 누락, 4xx/5xx 응답, 네트워크 실패, 중복 알림, 민감정보 포함 여부를 검증한다.
- **검증 증거:** 로컬 mock webhook 또는 테스트 채널 수신 기록과 환경 변수 마스킹 확인 결과를 남긴다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-004 (SLACK_WEBHOOK_URL 환경 변수)
- **Blocks:** TASK_OPS-002 (오프라인 비율 운영 알림)
