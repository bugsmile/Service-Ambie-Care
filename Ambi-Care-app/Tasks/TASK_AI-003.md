---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] AI-003: generateDailyReport 내 AI 요약 생성 통합 + Fallback"
labels: 'feature, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [AI-003] Daily Report 생성 파이프라인에 Gemini AI 요약 통합
- 목적: `generateDailyReport` Server Action(PIPE-001)이 DailyReport DB 저장(PIPE-006) 후, Gemini API로 한국어 웰니스 요약(`aiSummary`)을 생성하여 저장하는 통합 흐름을 구현한다. Gemini 호출 실패 시 `aiSummary: null`로 저장하고 사용자 에러를 노출하지 않는 Fallback을 필수로 구현한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — AI Fallback 정책 (NEW-01)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.3`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Prompt Structure
- 선행 태스크: [`/TASKs/TASK_AI-002.md`](./TASK_AI-002.md) — generateText() 호출 로직
- 파이프라인: [`/TASKs/TASK_PIPE-006.md`](./TASK_PIPE-006.md) — DailyReport 저장 (aiSummary null)
- 파이프라인: [`/TASKs/TASK_PIPE-001.md`](./TASK_PIPE-001.md) — generateDailyReport 오케스트레이터
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AI-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/ai.ts`에 `generateWellnessSummary(metrics: ReportMetrics): Promise<string | null>` 공유 함수 추출
  - `metrics`: `{ sleepScore, bathroomVisitCount, anomalyFlags, statusCode, date }`
  - SRS §7.3 프롬프트 구조 적용 (AI-002와 동일 로직)
  - 성공 시 요약 문자열, 실패 시 `null` 반환 (Fallback)
- [ ] `generateDailyReport` (PIPE-001) 파이프라인에 AI 요약 단계 추가:
  ```typescript
  // PIPE-006 저장 완료 후
  const aiSummary = await generateWellnessSummary(metrics);
  await prisma.dailyReport.update({
    where: { id: reportId },
    data: { aiSummary }
  });
  ```
- [ ] **Fallback 처리** — `generateWellnessSummary` 내 `try/catch`:
  - 성공: `aiSummary` 문자열 반환
  - 실패(네트워크, Rate Limit 등): `console.error` 로깅 후 `null` 반환
  - `null` 반환 시 `dailyReport.update` 생략 (이미 `null`로 저장됨)
- [ ] Gemini 응답 후처리 — 응답 문자열 앞뒤 공백 제거(`trim()`), 1,000자 초과 시 slice
- [ ] `INSUFFICIENT_DATA` statusCode 시에도 AI 요약 시도 (데이터 부족 상황 설명)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: AI 요약 정상 생성 및 DB 저장**
- Given: PIPE-006으로 DailyReport가 `aiSummary: null`로 저장됨, Gemini API 정상
- When: `generateDailyReport(deviceId)` 호출 (AI-003 통합 후)
- Then: Gemini API 호출 성공, DB의 `aiSummary` 필드가 한국어 요약 텍스트로 업데이트된다.

**Scenario 2: Gemini API 실패 시 aiSummary null 유지**
- Given: PIPE-006으로 DailyReport 저장 완료, Gemini API 호출 실패
- When: `generateDailyReport(deviceId)` 호출
- Then: DailyReport의 `aiSummary`는 `null`로 유지되고, 파이프라인은 에러 없이 `{ success: true }` 반환한다.

**Scenario 3: Fallback이 전체 파이프라인에 영향 없음**
- Given: Gemini Rate Limit 초과로 AI 호출 실패
- When: `generateDailyReport(deviceId)` 호출
- Then: PIPE-002~006의 수치 데이터(sleepScore, bathroomVisitCount 등)는 정상 저장되며, `aiSummary: null`만 별도 처리된다.

**Scenario 4: INSUFFICIENT_DATA 상태 요약 생성**
- Given: `statusCode: "INSUFFICIENT_DATA"`, Gemini API 정상
- When: `generateDailyReport(deviceId)` 호출
- Then: "오늘은 충분한 데이터가 수집되지 않아..." 형태의 한국어 요약이 생성되어 저장된다.

## :gear: Technical & Non-Functional Constraints
- **Fallback 필수:** AI 실패가 사용자 경험에 영향 없어야 함 — §7.1 (NEW-01)
- **실행 순서:** PIPE-006 저장 완료 → AI 요약 생성 → DB 업데이트 순서 보장
- **타임아웃:** Gemini API 응답 대기 최대 30초 — Vercel Hobby Function 타임아웃(10초) 고려 시 `AbortSignal.timeout(8000)` 적용 권장
- **중복 호출 방지:** `aiSummary`가 이미 존재하는 레코드 재실행 시 덮어쓰기 또는 skip 선택

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] Gemini 실패 시 파이프라인 전체가 `{ success: true }` 반환하는가?
- [ ] `aiSummary`가 정상 케이스에서 DB에 저장되는가?
- [ ] `generateWellnessSummary`가 `lib/ai.ts`에 공유 함수로 분리되었는가?
- [ ] TASK_TEST-015 (AI 요약 Fallback 테스트)가 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_AI-001 (lib/ai.ts), TASK_AI-002 (generateText 로직), TASK_PIPE-006 (DailyReport 저장)
- **Blocks:** TASK_TEST-015 (AI Fallback 테스트)
- **참고:** Vercel Hobby Function 10초 타임아웃 제약으로 인해 Gemini API 응답이 늦을 경우 파이프라인 전체가 타임아웃될 수 있다. `Promise.race([geminiCall, timeoutPromise])`로 타임아웃 처리하여 AI 실패를 Fallback으로 처리하는 것을 권장한다.
