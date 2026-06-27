---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] EMAIL-001: lib/email.ts — Resend API 이메일 유틸리티 설정"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [EMAIL-001] Resend API 이메일 전송 유틸리티 설정 (`lib/email.ts`)
- 목적: Resend API를 사용하여 이메일을 전송하는 공유 유틸리티(`lib/email.ts`)를 구현한다. 이후 EMAIL-002~004의 모든 이메일 전송 기능(일간 보고서, 오프라인 경고, 긴급 이벤트 알림)이 이 유틸리티를 공유하여 사용한다. Resend Free 티어 100통/일 한도를 관리한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 2 Pipeline
- 참조: REF-13 — Resend API (이메일 전송)
- 환경 변수: [`/TASKs/TASK_INFRA-004.md`](./TASK_INFRA-004.md) — RESEND_API_KEY
- 위험 요소: RISK-09 — Resend 100통/일 무료 한도
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — EMAIL-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 패키지 설치: `npm install resend`
- [ ] `lib/email.ts` 파일 생성
- [ ] `import 'server-only'` — 서버 전용 모듈 지정
- [ ] Resend 클라이언트 초기화:
  ```typescript
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  ```
- [ ] `sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }>` 공통 함수 구현:
  ```typescript
  interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;   // 기본값: 'noreply@rooted.app' 또는 Resend 검증 도메인
  }
  ```
- [ ] `resend.emails.send()` 호출 + 에러 처리
  - 성공: `{ success: true }` 반환
  - 실패: `console.error` 로깅 후 `{ success: false, error: message }` 반환 (에러 throw 금지)
- [ ] `RESEND_API_KEY` 미설정 시 경고 로그 출력 + `{ success: false }` 반환 (개발 환경 안전 처리)
- [ ] `.env.example`에 `RESEND_API_KEY=re_xxxx` 예시 항목 추가

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 이메일 정상 전송**
- Given: `RESEND_API_KEY` 설정됨, 유효한 수신자 이메일
- When: `sendEmail({ to: 'guardian@example.com', subject: '테스트', html: '<p>내용</p>' })` 호출
- Then: Resend API 호출 성공, `{ success: true }` 반환.

**Scenario 2: Resend API 실패 시 에러 throw 없음**
- Given: Resend API 일시 장애 또는 잘못된 API 키
- When: `sendEmail(...)` 호출
- Then: 에러가 throw되지 않고 `{ success: false, error: '...' }` 반환, 서버 로그에 에러 기록.

**Scenario 3: API 키 미설정 시 안전 처리**
- Given: `RESEND_API_KEY` 환경 변수 미설정 (로컬 개발 환경)
- When: `sendEmail(...)` 호출
- Then: 경고 로그 출력 후 `{ success: false }` 반환 — 서버 크래시 없음.

**Scenario 4: server-only 모듈 보호**
- Given: 클라이언트 컴포넌트에서 `lib/email.ts` import 시도
- When: Next.js 빌드
- Then: 빌드 에러 발생 — API 키가 클라이언트 번들에 포함되지 않음.

## :gear: Technical & Non-Functional Constraints
- **보안:** `RESEND_API_KEY` 서버 전용 — `import 'server-only'` 필수
- **한도 관리:** Resend Free 100통/일 — EMAIL-002~004 합산 시 하루 최대 발송량 계산 필요 (RISK-09)
- **Fallback:** 이메일 전송 실패가 메인 파이프라인(DailyReport 생성 등)을 중단시키지 않도록 에러 throw 금지
- **From 주소:** Resend에서 검증된 발신자 도메인 사용 — `onboarding@resend.dev` (개발용 기본값) 또는 커스텀 도메인

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `sendEmail` 함수가 `lib/email.ts`에서 export되는가?
- [ ] `import 'server-only'`가 설정되었는가?
- [ ] API 키 미설정 시 서버가 크래시 없이 `{ success: false }` 반환하는가?
- [ ] 에러 발생 시 throw 없이 반환값으로 처리되는가?
- [ ] `npm run build`가 에러 없이 완료되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-004 (RESEND_API_KEY 환경 변수)
- **Blocks:** TASK_EMAIL-002 (일간 보고서 이메일), TASK_EMAIL-003 (오프라인 경고 이메일), TASK_EMAIL-004 (긴급 이벤트 이메일)
- **참고:** Resend Free 티어에서 발신자 도메인 검증이 필요하다. 도메인이 없는 경우 `onboarding@resend.dev`를 임시 발신자로 사용 가능하나, 스팸 처리될 수 있다. 프로덕션 전 커스텀 도메인 DNS 설정을 권장한다.
