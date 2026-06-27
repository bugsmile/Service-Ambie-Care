---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] AI-004: 이상 징후 AI 설명 생성 — anomaly_flag 감지 시 Gemini 자연어 설명"
labels: 'feature, backend, priority:medium, phase:2'
assignees: ''
---

## :dart: Summary
- 기능명: [AI-004] 이상 징후 감지 시 Gemini 기반 자연어 설명 생성 (NEW-02)
- 목적: `generateDailyReport` 파이프라인에서 이상 징후(`anomaly_flag`)가 감지된 경우(PIPE-004), Gemini API로 해당 이상 징후의 원인과 Guardian을 위한 권고 행동을 자연어로 설명하는 텍스트를 생성하여 `anomalyFlags` 항목에 포함하거나 별도 필드에 저장한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — NEW-02 이상 징후 AI 설명
- 기능 요구사항: REQ-FUNC-017 — 이상 징후 자연어 설명 생성
- 선행 태스크: [`/TASKs/TASK_AI-001.md`](./TASK_AI-001.md) — lib/ai.ts getAIModel()
- 선행 태스크: [`/TASKs/TASK_AI-002.md`](./TASK_AI-002.md) — generateText() 로직
- 이상 징후 감지: [`/TASKs/TASK_PIPE-004.md`](./TASK_PIPE-004.md) — detectDwellTimeAnomaly() 반환값
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AI-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/ai.ts`에 `generateAnomalyExplanation(anomalyVisit: VisitGroup, avgDwellTime: number): Promise<string | null>` 함수 추가
- [ ] 이상 징후 설명 프롬프트 구성:
  ```
  System: "You are a healthcare assistant explaining wellness anomalies to family caregivers in simple Korean."
  User: "Bathroom visit at {timestamp} lasted {dwellTime} minutes.
    Average duration today: {avgDwellTime} minutes ({ratio}% longer than average).
    Generate 2-3 sentences: explain potential causes and recommended guardian action."
  ```
- [ ] `generateDailyReport` (PIPE-001) 내 PIPE-004 이후 AI 설명 생성 단계 추가:
  ```typescript
  if (anomalyResult.hasAnomaly) {
    for (const visit of anomalyResult.anomalyVisits) {
      const explanation = await generateAnomalyExplanation(visit, avgDwellTime);
      if (explanation) {
        anomalyFlags.push(`[AI 설명] ${explanation}`);
      }
    }
  }
  ```
- [ ] Fallback — 설명 생성 실패 시 기존 플래그 문자열(`"화장실 체류 시간 이상 감지..."`)만 유지
- [ ] 생성된 설명 길이 제한 — 500자 초과 시 slice
- [ ] AI 설명 생성은 이상 징후 건당 1회 호출 — 복수 이상 징후 시 순차 처리

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 이상 징후 감지 시 AI 설명 생성**
- Given: PIPE-004에서 체류 시간 이상 징후 1건 감지 (`anomalyVisits.length === 1`), Gemini API 정상
- When: `generateDailyReport(deviceId)` 호출
- Then: `anomalyFlags` 배열에 기존 플래그 텍스트와 함께 `"[AI 설명] 화장실에서 평소보다..."` 형태의 한국어 설명이 추가된다.

**Scenario 2: AI 설명 생성 실패 시 기존 플래그 유지**
- Given: 이상 징후 감지됨, Gemini API 실패
- When: `generateDailyReport(deviceId)` 호출
- Then: `anomalyFlags`에 AI 설명 없이 기존 이상 징후 텍스트만 포함되며 파이프라인이 정상 완료된다.

**Scenario 3: 이상 징후 없음 시 AI 호출 없음**
- Given: PIPE-004에서 `hasAnomaly: false`
- When: `generateDailyReport(deviceId)` 호출
- Then: `generateAnomalyExplanation` 함수가 호출되지 않는다 (불필요한 API 호출 방지).

**Scenario 4: 복수 이상 징후 시 각각 설명 생성**
- Given: `anomalyVisits.length === 2` (이상 징후 2건)
- When: `generateDailyReport(deviceId)` 호출
- Then: 각 이상 징후 방문에 대해 개별 AI 설명이 생성되어 `anomalyFlags`에 2개 항목이 추가된다.

## :gear: Technical & Non-Functional Constraints
- **Fallback 필수:** AI 설명 생성 실패가 파이프라인 중단 없이 처리됨 (§7.1 Fallback 원칙)
- **API 호출 최소화:** 이상 징후 건당 1회 호출 — 복수 이상 징후 시 Gemini API 호출 횟수 증가에 주의
- **언어:** 프롬프트에 한국어 응답 명시 — Guardian 가족이 이해하기 쉬운 평이한 표현
- **응답 길이:** 2~3문장 (500자 이내) — 과도하게 긴 설명 방지

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 이상 징후 없음 시 Gemini API가 호출되지 않는가?
- [ ] AI 설명 생성 실패 시 파이프라인이 정상 완료되는가?
- [ ] `anomalyFlags`에 AI 설명이 `"[AI 설명] ..."` 접두사와 함께 추가되는가?
- [ ] TASK_TEST-013 (이상 징후 감지 테스트 — AI 설명 호출 검증)이 통과하는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_AI-001 (lib/ai.ts), TASK_AI-002 (generateText() 로직), TASK_PIPE-004 (이상 징후 감지 — VisitGroup 타입)
- **Blocks:** TASK_TEST-013 (이상 징후 감지 + AI 설명 호출 검증)
- **참고:** Gemini 무료 티어 Rate Limit(RPM 제한) 고려 시, 이상 징후 건수가 많을 경우 호출 간 지연(`await sleep(1000)`)을 추가하는 것을 검토한다. MVP 단계(소수 디바이스)에서는 허용 범위로 판단한다.
