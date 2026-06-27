---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-013: [Unit] 이상 징후 감지 + AI 설명 호출 테스트"
labels: 'test, backend, priority:high, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-013] PIPE-004 이상 징후 감지 시 AI-004 Gemini 설명 생성 호출 테스트
- 목적: PIPE-004의 화장실 체류 시간 이상 징후 감지 결과(`hasAnomaly`, `anomalyVisits`, `anomalyFlags`)에 따라 AI-004의 `generateAnomalyExplanation`이 필요한 경우에만 호출되고, 생성된 설명이 `DailyReport.anomalyFlags` 저장 흐름에 병합되는지 검증한다.
- 범위: 장시간 체류 이상 징후와 AI 설명 호출. 방문 횟수 ≥ 50회 데이터 신뢰도 경고는 TEST-012 범위다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/all/TASK_PIPE-004.md`](./TASK_PIPE-004.md) — 체류 시간 > 평균 +50% 이상 징후 감지
- 테스트 대상: [`/TASKs/all/TASK_AI-004.md`](./TASK_AI-004.md) — Gemini 이상 설명 생성
- 저장 대상: [`/TASKs/all/TASK_DB-005.md`](./TASK_DB-005.md) — `DailyReport.anomalyFlags`
- SRS 섹션: REQ-FUNC-017 AC
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-013

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/pipe/anomalyExplanation.test.ts`
- [ ] `detectDwellTimeAnomaly` 또는 `generateDailyReport` 내부 PIPE-004 호출부 테스트 fixture 구성
- [ ] `generateAnomalyExplanation` 또는 Vercel AI SDK `generateText` Mock 설정
- [ ] Prisma Mock 설정 시 `dailyReport.create`/`dailyReport.update`의 `anomalyFlags` 저장값 검증
- [ ] 테스트 케이스:
  - 체류 시간 > 평균 +50% 이상 징후 → AI 설명 생성 1회 호출
  - 이상 징후 없음 → AI 호출 없음
  - Gemini 응답 텍스트가 `anomalyFlags` 배열에 `"[AI 설명] ..."` 항목으로 병합
  - Gemini API 오류 → 기존 PIPE-004 플래그만 유지하고 파이프라인 성공
  - 복수 이상 방문 → 이상 방문 개수만큼 설명 생성 또는 명세된 상한만큼 호출
  - 프롬프트에 `deviceId`, 방문 시각, 체류 시간, 평균 체류 시간이 포함되는지 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 이상 징후 → Gemini 호출**
- Given: 방문 그룹 체류 시간이 평균 대비 50%를 초과하여 `hasAnomaly: true`, `anomalyVisits.length: 1`
- When: 파이프라인을 실행함
- Then: `generateAnomalyExplanation` 또는 `generateText`가 1회 호출되고 프롬프트에 이벤트 데이터가 포함된다.

**Scenario 2: 정상 → Gemini 미호출**
- Given: PIPE-004 결과가 `hasAnomaly: false`, `anomalyVisits: []`
- When: 파이프라인을 실행함
- Then: Gemini 호출은 0회이고 `anomalyFlags`에 AI 설명 항목이 추가되지 않는다.

**Scenario 3: Gemini 성공 → anomalyFlags 병합**
- Given: Gemini가 `"평소보다 오래 머문 방문이 관찰되었습니다."`를 반환함
- When: DailyReport 저장 단계가 실행됨
- Then: `anomalyFlags`에 기존 체류 시간 플래그와 `"[AI 설명] 평소보다 오래 머문 방문이 관찰되었습니다."`가 함께 포함된다.

**Scenario 4: Gemini 오류 → fallback**
- Given: `generateText`가 Error를 throw함
- When: 파이프라인을 실행함
- Then: AI 설명 없이 기존 이상 징후 플래그만 저장되고 사용자-facing 에러는 발생하지 않는다.

## :gear: Technical & Non-Functional Constraints
- **AI Mock:** 실제 Gemini API를 호출하지 않고 `generateAnomalyExplanation`/`generateText`를 Mock 처리
- **저장 필드:** `DailyReport.anomalyExplanation` 같은 별도 필드를 전제하지 않는다. MVP 저장 대상은 `anomalyFlags` JSON 문자열/배열 흐름이다.
- **Fallback:** AI 실패는 파이프라인 실패가 아니며 기존 플래그를 유지한다.
- **호출 최소화:** `hasAnomaly: false`인 경우 AI 호출 0회 보장
- **금지어:** Mock 응답/프롬프트 검증에 `diagnosis`, `medical`, `patient`가 포함되지 않게 확인

## :checkered_flag: Definition of Done (DoD)
- [ ] 이상 감지, 정상, AI 성공 병합, AI 오류 fallback 케이스가 모두 구현되었는가?
- [ ] `anomalyFlags` 저장 계약이 DB-005/PIPE-006과 일치하는가?
- [ ] Gemini API가 실제로 호출되지 않도록 Mock이 적용되었는가?
- [ ] 이상 징후 없음 시 AI 호출이 0회임을 검증하는가?
- [ ] TEST-012의 방문 횟수 이상치 테스트와 책임이 중복되지 않는가?

## :construction: Dependencies & Blockers
- **Depends on:** PIPE-004, AI-004, AI-003
- **Blocks:** 없음
- **주의:** AI-004가 별도 필드를 추가하도록 SRS가 변경되지 않는 한, 테스트는 `anomalyFlags` 병합을 기준으로 작성한다.
