---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-015: [Unit] Gemini AI Fallback 테스트"
labels: 'test, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-015] AI-003 Gemini Fallback 로직 단위 테스트
- 목적: AI-003에서 구현한 Gemini API 오류 시 fallback 로직이 RPM 초과, 네트워크 오류, 타임아웃 등 다양한 실패 시나리오에서 서비스 중단 없이 fallback 메시지를 반환하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/TASK_AI-003.md`](./TASK_AI-003.md) — Gemini Fallback 처리
- 테스트 대상: [`/TASKs/TASK_AI-001.md`](./TASK_AI-001.md) — lib/ai.ts 설정
- SRS 섹션: §5.6.3 AI Fallback Strategy, NFR-AVAIL-002
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-015

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/ai/fallback.test.ts`
- [ ] `@ai-sdk/google` `generateText` Mock 설정 (오류 시나리오별)
- [ ] 테스트 케이스:
  - Gemini `429 Too Many Requests` → fallback 메시지 반환
  - Gemini `500 Internal Server Error` → fallback 메시지 반환
  - 네트워크 타임아웃 (AbortError) → fallback 메시지 반환
  - 정상 응답 → Gemini 텍스트 그대로 반환
  - fallback 메시지 한국어 확인: `"AI 분석을 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요."`
  - 오류 발생 시 console.error 로깅 확인 (모니터링)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: RPM 초과 → fallback**
- Given: `generateText` throws `{ status: 429 }`
- When: AI 요약 생성 함수 호출
- Then: 에러 throw 없이 fallback 문자열 반환

**Scenario 2: 정상 응답**
- Given: `generateText` returns `{ text: "수면 상태 양호" }`
- When: AI 요약 생성 함수 호출
- Then: `"수면 상태 양호"` 그대로 반환

**Scenario 3: 오류 로깅**
- Given: 임의 오류 발생
- When: fallback 처리
- Then: `console.error` 또는 Sentry 로깅 1회 호출

## :gear: Technical & Non-Functional Constraints
- **오류 타입:** 429, 500, AbortError 3가지 시나리오 모두 커버
- **fallback 메시지:** SRS 명세 한국어 문자열 정확히 일치
- **에러 전파 없음:** 호출부에서 try/catch 불필요

## :checkered_flag: Definition of Done (DoD)
- [ ] 429/500/타임아웃/정상 4개 케이스 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] fallback 문자열 SRS 명세와 일치?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.
- **리뷰 체크포인트:**
  - 구현 파일 경로가 Task Breakdown과 일치하는지 확인한다.
  - 실패 케이스가 Acceptance Criteria 또는 테스트에 반영되었는지 확인한다.
  - SRS 금지어 및 PII 노출 규칙을 재확인한다.
  - 외부 서비스 의존성이 mock/fallback으로 검증 가능한지 확인한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_AI-001, TASK_AI-003
- **Blocks:** 없음
