---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] AI-001: lib/ai.ts — Vercel AI SDK + @ai-sdk/google (Gemini) 설정"
labels: 'feature, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [AI-001] Gemini AI 클라이언트 유틸리티 설정 (`lib/ai.ts`)
- 목적: Vercel AI SDK와 `@ai-sdk/google` 패키지를 사용하여 Gemini 1.5 Flash 모델 기반의 AI 클라이언트를 초기화하고, 환경 변수(`AI_MODEL`)로 모델을 교체할 수 있는 설정 유틸리티를 구현한다. 이후 AI-002~004의 모든 AI 호출에서 이 유틸리티를 공유한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — AI Integration Overview
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — AI Model Configuration
- 제약사항: CON-10 (Gemini API 무료 티어), CON-11 (AI_MODEL 환경변수)
- 환경 변수: [`/TASKs/TASK_INFRA-004.md`](./TASK_INFRA-004.md) — GOOGLE_GENERATIVE_AI_API_KEY, AI_MODEL
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AI-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 패키지 설치: `npm install ai @ai-sdk/google`
- [ ] `lib/ai.ts` 파일 생성
- [ ] `@ai-sdk/google`의 `createGoogleGenerativeAI()` 또는 `google()` 헬퍼로 Gemini 클라이언트 초기화:
  ```typescript
  import { createGoogleGenerativeAI } from '@ai-sdk/google';
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!
  });
  ```
- [ ] 모델 팩토리 함수 구현:
  ```typescript
  export function getAIModel() {
    const modelId = process.env.AI_MODEL ?? 'gemini-1.5-flash';
    return google(modelId);
  }
  ```
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY` 환경 변수 미설정 시 명확한 에러 메시지 throw
- [ ] `lib/ai.ts`를 server-only 모듈로 지정 — `import 'server-only'` 추가 (클라이언트 번들 포함 방지)
- [ ] `.env.example`에 `AI_MODEL=gemini-1.5-flash` 예시 항목 추가

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 기본 모델(gemini-1.5-flash) 초기화**
- Given: `AI_MODEL` 환경 변수 미설정, `GOOGLE_GENERATIVE_AI_API_KEY` 설정됨
- When: `getAIModel()` 호출
- Then: `gemini-1.5-flash` 모델이 반환되며 에러 없이 초기화된다.

**Scenario 2: 커스텀 모델 교체**
- Given: `AI_MODEL=gemini-1.5-pro` 환경 변수 설정
- When: `getAIModel()` 호출
- Then: `gemini-1.5-pro` 모델이 반환된다.

**Scenario 3: API 키 미설정 시 에러**
- Given: `GOOGLE_GENERATIVE_AI_API_KEY` 환경 변수 미설정
- When: `getAIModel()` 호출
- Then: `"GOOGLE_GENERATIVE_AI_API_KEY is not set"` 메시지의 에러가 throw된다.

**Scenario 4: server-only 모듈 보호**
- Given: 클라이언트 컴포넌트에서 `lib/ai.ts`를 import 시도
- When: Next.js 빌드 실행
- Then: 빌드 에러가 발생하여 API 키가 클라이언트 번들에 포함되지 않는다.

## :gear: Technical & Non-Functional Constraints
- **보안:** `GOOGLE_GENERATIVE_AI_API_KEY`는 서버 사이드 전용 — 클라이언트 번들 노출 절대 금지 (CON-10)
- **모델 교체:** `AI_MODEL` 환경 변수만 변경하면 모델 교체 가능 — 코드 수정 불필요 (CON-11)
- **server-only:** `import 'server-only'` 로 클라이언트 컴포넌트에서의 실수 import 방지
- **기본값:** `AI_MODEL` 미설정 시 `gemini-1.5-flash`(무료 티어 기본 모델) 사용

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] `getAIModel()` 함수가 `lib/ai.ts`에서 export되는가?
- [ ] `import 'server-only'`가 설정되어 클라이언트 번들 포함이 차단되는가?
- [ ] `AI_MODEL` 환경 변수로 모델 교체가 가능한가?
- [ ] API 키 미설정 시 명확한 에러 메시지가 출력되는가?
- [ ] `npm run build`가 에러 없이 완료되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-004 (환경 변수: GOOGLE_GENERATIVE_AI_API_KEY, AI_MODEL)
- **Blocks:** TASK_AI-002 (Wellness Summary API), TASK_AI-003 (Daily Report AI 요약 통합), TASK_AI-004 (이상 징후 AI 설명)
- **참고:** Vercel AI SDK(`ai` 패키지)와 `@ai-sdk/google`은 별도 패키지이다. `ai` 패키지의 `generateText()`, `streamText()` 함수와 `@ai-sdk/google`의 모델 인스턴스를 조합하여 사용한다.
