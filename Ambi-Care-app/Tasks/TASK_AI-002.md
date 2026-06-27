---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] AI-002: POST /api/ai/wellness-summary — Gemini generateText() 호출 API"
labels: 'feature, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [AI-002] Wellness Summary 생성 API 라우트 핸들러 구현
- 목적: Guardian 포털 또는 Report Pipeline이 지정된 메트릭(수면 점수, 화장실 방문 횟수, 이상 징후)을 전달하면 Gemini `generateText()`를 호출하여 자연어 웰니스 요약 문단을 생성하는 `POST /api/ai/wellness-summary` 엔드포인트를 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — AI Integration, Fallback 정책
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Prompt Structure
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #4
- API 계약: [`/TASKs/TASK_API-006.md`](./TASK_API-006.md) — Request/Response DTO + Fallback 규격
- AI 설정: [`/TASKs/TASK_AI-001.md`](./TASK_AI-001.md) — lib/ai.ts getAIModel()
- 인증: [`/TASKs/TASK_AUTH-001.md`](./TASK_AUTH-001.md) — NextAuth.js JWT
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AI-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/ai/wellness-summary/route.ts` 파일 생성
- [ ] JWT 인증 검증 — `getServerSession()` 미인증 시 401 반환
- [ ] Request Body 파싱 및 검증:
  ```typescript
  interface WellnessSummaryRequest {
    deviceId: string;
    date: string;       // YYYY-MM-DD
    metrics: {
      sleepScore: number | null;
      bathroomVisitCount: number | null;
      anomalyFlags: string[];
      statusCode: string;
    }
  }
  ```
- [ ] SRS §7.3 프롬프트 구조 적용:
  ```
  System: "You are a compassionate wellness assistant..."
  User: "Generate a 3-5 sentence wellness summary for [date]...
    Sleep Score: {sleepScore}/100
    Bathroom Visits: {bathroomVisitCount}
    Anomalies: {anomalyFlags}
    Language: Korean"
  ```
- [ ] `generateText({ model: getAIModel(), system, prompt })` 호출
- [ ] 성공 시 `{ aiSummary: string }` 반환 (200 OK)
- [ ] **Fallback 구현** — API 호출 실패 시 사용자에게 에러 노출 없이:
  - `catch` 블록에서 `console.error` 로깅
  - `{ aiSummary: null }` 반환 (200 OK, 에러 상태 코드 없음)
- [ ] 응답 길이 제한 — Gemini 응답이 1,000자 초과 시 `slice(0, 1000)` 처리

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상 AI 요약 생성**
- Given: 유효한 JWT, `sleepScore: 78`, `bathroomVisitCount: 3`, `anomalyFlags: []`
- When: `POST /api/ai/wellness-summary` 요청
- Then: 200 OK와 함께 한국어 웰니스 요약 텍스트 3~5문장이 `{ aiSummary: "..." }` 형태로 반환된다.

**Scenario 2: Gemini API 실패 시 Fallback**
- Given: Gemini API 일시 장애 또는 Rate Limit 초과
- When: `POST /api/ai/wellness-summary` 요청
- Then: 200 OK와 `{ aiSummary: null }` 반환 — 사용자에게 에러 상태 코드 미노출, 서버 로그에만 에러 기록.

**Scenario 3: 인증 미제공 시 401**
- Given: JWT 세션 없이 요청
- When: `POST /api/ai/wellness-summary` 요청
- Then: 401 Unauthorized 반환.

**Scenario 4: INSUFFICIENT_DATA 상태 메트릭**
- Given: `statusCode: "INSUFFICIENT_DATA"`, `sleepScore: null`
- When: `POST /api/ai/wellness-summary` 요청
- Then: AI가 데이터 부족 상황을 설명하는 한국어 요약을 생성하고 정상 반환한다.

## :gear: Technical & Non-Functional Constraints
- **복잡도:** H (High) — Gemini API 연동 + Fallback 처리 + 프롬프트 엔지니어링
- **Fallback 필수:** AI API 실패 시 사용자 경험 영향 없음 — `null` 반환으로 Guardian UI fallback 텍스트 표시 (§7.1)
- **비용 관리:** Gemini 무료 티어 RPM(Request Per Minute) 제한 고려 — MVP 단계에서 1일 1회 Cron 호출이므로 한도 초과 가능성 낮음 (CON-10)
- **언어:** 프롬프트에 "Language: Korean" 명시 — 한국어 응답 강제
- **응답 길이:** `maxTokens` 옵션 또는 응답 후 slice로 1,000자 이내 보장

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] Gemini API 실패 시 200 OK + `{ aiSummary: null }` Fallback이 동작하는가?
- [ ] 프롬프트가 SRS §7.3 구조를 따르고 한국어 응답을 생성하는가?
- [ ] JWT 미인증 시 401이 반환되는가?
- [ ] TASK_TEST-015 (AI 요약 Fallback 테스트)가 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_AI-001 (lib/ai.ts getAIModel()), TASK_API-006 (Request/Response DTO), TASK_AUTH-001 (JWT 인증)
- **Blocks:** TASK_AI-003 (generateDailyReport 내 AI 요약 통합 — 이 API 또는 함수 재사용)
- **참고:** AI-003은 이 API를 HTTP 호출하거나, 동일한 `generateText()` 로직을 `lib/ai.ts` 내 공유 함수로 추출하여 직접 호출하는 방식으로 구현 가능하다. 코드 중복을 피하기 위해 후자를 권장한다.
