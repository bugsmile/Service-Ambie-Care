---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] API-006: POST /api/ai/wellness-summary — Request/Response DTO + Gemini Fallback 규격"
labels: 'feature, api-spec, ai, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [API-006] [Phase 2] POST `/api/ai/wellness-summary` — Request DTO (deviceId, date, metrics) + Response DTO (aiSummary string) + Gemini 에러 Fallback 규격
- 목적: Vercel AI SDK + Google Gemini 1.5 Flash를 활용한 AI 웰니스 서술 생성 API의 계약을 정의하여, Guardian에게 자연어로 된 일간 건강 요약을 제공하는 MVP 킬러 피처(NEW-01)의 인터페이스를 확립한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Route #4: POST `/api/ai/wellness-summary`
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Vercel AI SDK + Gemini Integration
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — AI Use Cases (NEW-01, NEW-02)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Prompt Structure
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Model Swap Strategy (AI_MODEL env)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-10`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Vercel AI SDK 필수
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-11`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Gemini API + AI_MODEL 환경변수
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-15`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Gemini Free Quota (15 RPM, 1,500 req/day)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — API-006

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] Request DTO 타입 정의:
  ```typescript
  interface WellnessSummaryRequest {
    deviceId: string
    date: string              // "YYYY-MM-DD"
    metrics: {
      sleepScore: number | null
      sleepHours?: number
      bathroomVisitCount: number | null
      anomalyFlags: string[]
      statusCode: string
    }
  }
  ```
- [ ] Response DTO 타입 정의:
  ```typescript
  // 200 OK — AI Summary 생성 성공
  interface WellnessSummaryResponse {
    success: true
    data: {
      aiSummary: string       // Gemini 생성 자연어 서술 (100단어 이내)
      model: string           // 사용된 모델명 (예: "gemini-1.5-flash")
      generatedAt: string     // ISO 8601
    }
  }

  // 200 OK — Fallback (AI 실패 시에도 200 반환)
  interface WellnessSummaryFallbackResponse {
    success: true
    data: {
      aiSummary: null
      fallbackReason: string  // "GEMINI_API_ERROR" | "RATE_LIMIT" | "TIMEOUT"
      model: string
      generatedAt: string
    }
  }

  // 401 Unauthorized
  interface UnauthorizedResponse {
    success: false
    error: { code: "UNAUTHORIZED", message: "Authentication required" }
  }
  ```
- [ ] Prompt Template 규격 (SRS §7.3 준수):
  ```
  System: You are an AI wellness assistant for the Rooted ambient care system...
  (금지어: "diagnosis", "medical", "patient" 절대 미사용)
  User: Device: {deviceId}, Date: {date}, Sleep Score: {sleepScore}/100...
  ```
- [ ] Gemini Fallback 규격:
  - API 에러 시: `aiSummary: null` + `fallbackReason` 반환 (사용자 에러 미노출)
  - Rate Limit (429) 시: 재시도 없이 null 반환
  - Timeout 시: 8초 타임아웃 (Vercel 10초 이내)
  - DailyReport에는 null 저장, Guardian에게는 "AI 요약 준비 중" 메시지 표시
- [ ] 인증: JWT (NextAuth.js) — 내부 Server Action에서도 호출 가능
- [ ] AI_MODEL 환경변수 기반 모델 교체 규격
- [ ] 금지어 검증 — Prompt/Response에 규제 키워드 미사용

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 정상적인 AI Summary 생성**
- Given: 유효한 metrics 데이터와 Gemini API가 정상 동작 중
- When: `POST /api/ai/wellness-summary` 요청
- Then: `200 OK`와 함께 100단어 이내의 자연어 `aiSummary`가 반환된다.

**Scenario 2: Gemini API 에러 시 Fallback**
- Given: Gemini API가 500 에러를 반환함
- When: AI Summary 생성 요청
- Then: `200 OK`와 `{ aiSummary: null, fallbackReason: "GEMINI_API_ERROR" }`를 반환. 클라이언트 에러 미노출.

**Scenario 3: Rate Limit 초과 시 Fallback**
- Given: Gemini Free 15 RPM 한도를 초과함
- When: AI Summary 생성 요청
- Then: `200 OK`와 `{ aiSummary: null, fallbackReason: "RATE_LIMIT" }`를 반환.

**Scenario 4: INSUFFICIENT_DATA 상태 처리**
- Given: `statusCode: "INSUFFICIENT_DATA"`, `sleepScore: null`
- When: AI Summary 생성 요청
- Then: "데이터 부족" 관련 자연어 요약이 생성되거나, Fallback 응답이 반환된다.

**Scenario 5: AI_MODEL 환경변수 교체**
- Given: `AI_MODEL="gemini-1.5-pro"`로 변경됨
- When: AI Summary 생성 요청
- Then: `model: "gemini-1.5-pro"` 응답 필드로 사용 모델이 확인된다.

## :gear: Technical & Non-Functional Constraints
- **SDK:** Vercel AI SDK (`ai` + `@ai-sdk/google`) — CON-10
- **모델:** Gemini 1.5 Flash 기본, `AI_MODEL` 환경변수로 교체 — CON-11, §7.4
- **Free Quota:** 15 RPM, 1M TPM, 1,500 req/day — CON-15
- **Timeout:** 8초 (Vercel 10초 내) — CON-13
- **Fallback:** API 실패 시 null 반환, 사용자 에러 미노출 — §7.1
- **Prompt 금지어:** "diagnosis", "medical", "patient" 사용 금지 — CON-04, CON-01
- **캐싱:** DailyReport.aiSummary에 저장, 동일 디바이스+날짜 재생성 방지 — §7.1
- **Phase:** Phase 2

## :checkered_flag: Definition of Done (DoD)
- [ ] Request/Response DTO (성공/Fallback/401) 정의 완료
- [ ] Prompt Template이 SRS §7.3과 일치하는가?
- [ ] Gemini Fallback 3가지 시나리오 (에러/Rate Limit/Timeout) 규격 정의
- [ ] AI_MODEL 환경변수 교체 규격 문서화
- [ ] 금지어가 Prompt/Response에 포함되지 않는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-005 (DailyReport — aiSummary 필드)
- **Blocks:** AI-001 (Vercel AI SDK 초기 설정), AI-002 (Gemini Prompt 최적화), AI-003 (AI Summary Route Handler 구현), PIPE-005 (Daily Report 파이프라인 내 AI 요약 생성)
