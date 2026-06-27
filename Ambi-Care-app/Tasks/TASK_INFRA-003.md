---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] INFRA-003: Vercel Cron Job 설정 (1일 1회, Hobby 제한)"
labels: 'feature, infra, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [INFRA-003] `vercel.json` — Vercel Cron Job 설정 (1일 1회, Hobby 제한)
- 목적: Daily Report 생성 파이프라인의 자동 트리거를 위해 Vercel Cron Job을 설정하여, 매일 1회 `generateDailyReport` Server Action이 자동으로 실행되는 스케줄링 인프라를 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-13`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Vercel Hobby Limits (Cron 1/day)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#DEP-05`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Vercel Cron Jobs 의존성
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§3.4.1`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Daily Wellness Report Generation Sequence
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 0 Foundation
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — `vercel.json` 위치 확인
- Vercel Cron Jobs Docs: [https://vercel.com/docs/cron-jobs](https://vercel.com/docs/cron-jobs) (REF-12)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — INFRA-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 프로젝트 루트에 `vercel.json` 파일 생성
- [ ] Cron Job 설정 작성 — 매일 1회 실행 (예: `"0 6 * * *"` — UTC 06:00 = KST 15:00, 또는 적절한 시간대)
- [ ] Cron Job 대상 API Route 생성 — `app/api/cron/daily-report/route.ts` (GET 핸들러)
- [ ] Cron 전용 API Route에 `CRON_SECRET` 환경변수 기반 인증 보호 적용 (`Authorization: Bearer <CRON_SECRET>`)
- [ ] Cron Route 내부에서 `generateDailyReport` Server Action 호출 로직 스캐폴드 작성 (실제 로직은 PIPE-001에서 구현)
- [ ] `vercel.json` 내 Cron 스케줄 표현식 검증 — Vercel Hobby 1/day 제한 준수 확인
- [ ] Vercel 배포 후 대시보드에서 Cron Job 등록 상태 확인
- [ ] Vercel 대시보드 Cron Job Logs에서 실행 이력 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: vercel.json Cron 설정 정상 등록**
- Given: `vercel.json`에 crons 배열이 설정됨
- When: Vercel에 배포함
- Then: Vercel 대시보드의 Cron Jobs 섹션에 해당 Cron이 등록되어 있고, 다음 실행 예정 시각이 표시된다.

**Scenario 2: Cron Job 1일 1회 제한 준수**
- Given: Vercel Hobby Plan의 Cron 제한이 1일 1회임
- When: `vercel.json`에 1개의 Cron Job만 설정됨
- Then: 빌드 및 배포 시 경고/에러 없이 Cron이 정상 등록된다. 2개 이상 Cron 등록 시 Hobby Plan 에러가 발생하는 것을 인지한다.

**Scenario 3: Cron 전용 API Route 인증 보호**
- Given: `CRON_SECRET` 환경변수가 설정됨
- When: `Authorization: Bearer <CRON_SECRET>` 헤더 없이 Cron API에 직접 요청함
- Then: 401 Unauthorized 응답을 반환하여 외부 무단 호출을 차단한다.

**Scenario 4: Cron Job 정상 실행**
- Given: Cron Job이 등록되고 실행 시각이 도래함
- When: Vercel이 Cron Job을 트리거함
- Then: Cron 전용 API Route가 호출되고, 200 OK 응답이 반환되며, Vercel Cron 로그에 성공 기록이 남는다.

## :gear: Technical & Non-Functional Constraints
- **Hobby Plan 제한:** Cron Job 최대 1개, 1일 1회 실행 — CON-13
- **Function Timeout:** Serverless Function 10초 timeout — 대량 디바이스 처리 시 순차 실행 필요
- **보안:** Cron API Route에 `CRON_SECRET` 기반 인증 필수 — 외부 임의 호출 방지
- **시간대:** Cron 표현식은 UTC 기준. KST(UTC+9) 환산 필요 (예: KST 06:00 = UTC 21:00 전일)
- **비용:** $0/월 유지 필수 — CON-16

## :checkered_flag: Definition of Done (DoD)
- [ ] `vercel.json` 파일이 프로젝트 루트에 정상 생성되었는가?
- [ ] Cron Job 설정이 Vercel 대시보드에 정상 등록되었는가?
- [ ] Cron 전용 API Route(`app/api/cron/daily-report/route.ts`)가 생성되었는가?
- [ ] `CRON_SECRET` 인증이 적용되어 무단 호출이 차단되는가?
- [ ] Hobby Plan의 1일 1회 Cron 제한을 준수하는가?
- [ ] `npm run build` 시 `vercel.json` 관련 에러가 없는가?

## :construction: Dependencies & Blockers
- **Depends on:** INFRA-002 (Vercel Hobby 배포 설정 완료)
- **Blocks:** PIPE-007 (Vercel Cron → generateDailyReport 트리거 연동)
- **참고:** Vercel Hobby Plan은 Cron Job 1개만 허용하므로, Heartbeat 모니터링은 Cron이 아닌 device→server push 모델(HB-001)로 구현해야 합니다. Cron Job은 오직 Daily Report 생성 전용으로 사용합니다.
