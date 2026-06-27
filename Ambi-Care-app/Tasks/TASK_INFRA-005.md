---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] INFRA-005: Supabase Free 7일 비활성 일시정지 방지 설정"
labels: 'feature, infra, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [INFRA-005] Supabase Free 프로젝트 7일 비활성 일시정지 방지 — UptimeRobot Free 또는 GitHub Actions Daily Ping 설정
- 목적: Supabase Free Plan의 7일 비활성 시 프로젝트 자동 일시정지(pause) 정책으로 인한 서비스 중단을 방지하기 위해, 외부에서 주기적으로 DB를 Ping하는 자동화 스케줄을 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#RISK-07`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Supabase Free 7일 비활성 pause 리스크
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-14`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Supabase Free Limits
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 0 Foundation
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§15`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Free Tier Constraint Specification
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#REQ-NF-005`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Best Effort ~99% 가용성 목표
- Supabase Free Tier Limits: [https://supabase.com/pricing](https://supabase.com/pricing) (REF-14)
- UptimeRobot: [https://uptimerobot.com](https://uptimerobot.com)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — INFRA-005

## :white_check_mark: Task Breakdown (실행 계획)
### 옵션 A: UptimeRobot Free (권장)
- [ ] UptimeRobot Free 계정 생성 (50 monitors, 5분 간격)
- [ ] 모니터 추가 — Type: `HTTP(s)`, URL: Vercel 배포 URL의 Health Check 엔드포인트 (예: `https://rooted-mvp.vercel.app/api/health`)
- [ ] Monitoring Interval: 5분 설정 (Free Plan 최소 간격)
- [ ] Alert Contacts 설정 — 이메일 알림 등록 (서비스 다운 시 통보)
- [ ] `app/api/health/route.ts` Health Check API 생성 — DB 커넥션 테스트 (Prisma `$queryRaw` 또는 간단한 SELECT) 포함

### 옵션 B: GitHub Actions Daily Ping (대안)
- [ ] `.github/workflows/supabase-ping.yml` 워크플로우 파일 생성
- [ ] Cron 스케줄 설정: `"0 0 * * *"` (매일 UTC 00:00)
- [ ] 워크플로우 내용: `curl` 또는 `wget`으로 Health Check 엔드포인트 호출
- [ ] GitHub Repository Secrets에 Health Check URL 등록

### 공통
- [ ] Health Check API 응답 확인 — DB 연결 성공 시 `200 OK` + `{ "status": "ok", "db": "connected" }`, 실패 시 `503 Service Unavailable`
- [ ] Supabase 대시보드에서 프로젝트 활성 상태 확인
- [ ] 7일 이상 방치 시 정상 작동 검증 (실제 7일 대기 테스트는 불필요, 구조적 검증)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: Health Check API 정상 응답**
- Given: Supabase PostgreSQL DB가 활성 상태이고 Health Check API가 배포됨
- When: `GET /api/health` 요청을 보냄
- Then: `200 OK`와 함께 `{ "status": "ok", "db": "connected", "timestamp": "..." }` 응답이 반환된다.

**Scenario 2: UptimeRobot 모니터링 정상 동작**
- Given: UptimeRobot에 Health Check URL이 등록됨
- When: 5분 간격으로 자동 Ping이 실행됨
- Then: UptimeRobot 대시보드에 `Up` 상태가 표시되고, Supabase 프로젝트가 활성 상태를 유지한다.

**Scenario 3: DB 연결 실패 시 알림**
- Given: Supabase DB가 일시적으로 접근 불가능한 상태임
- When: Health Check API가 DB 연결을 시도함
- Then: `503 Service Unavailable` 응답을 반환하고, UptimeRobot이 Alert Contact에게 다운 알림을 발송한다.

**Scenario 4: GitHub Actions 대안 동작 (옵션 B)**
- Given: GitHub Actions 워크플로우가 설정됨
- When: 매일 UTC 00:00에 스케줄 트리거가 실행됨
- Then: `curl` 요청이 Health Check API에 전송되고, 워크플로우 로그에 성공/실패가 기록된다.

## :gear: Technical & Non-Functional Constraints
- **Supabase Free 제약:** 7일 연속 비활성 시 프로젝트 자동 일시정지 — CON-14, RISK-07
- **UptimeRobot Free 제약:** 최대 50 monitors, 최소 5분 간격 — 충분
- **GitHub Actions Free 제약:** Public repo 무제한, Private repo 2,000분/월 — 충분
- **가용성 목표:** Best Effort ~99% (SLA 보장 없음) — REQ-NF-005
- **비용:** $0/월 유지 필수 — CON-16
- **Health Check API 응답 시간:** < 2,000ms (cold start 포함)

## :checkered_flag: Definition of Done (DoD)
- [ ] `app/api/health/route.ts` Health Check API가 정상 동작하는가?
- [ ] 외부 모니터링(UptimeRobot 또는 GitHub Actions)이 정상 설정되었는가?
- [ ] Health Check API가 DB 커넥션 테스트를 포함하는가?
- [ ] Supabase 프로젝트가 활성 상태를 유지하고 있는가?
- [ ] 비용이 $0으로 유지되는가?
- [ ] 장애 발생 시 알림이 정상 발송되는가?

## :construction: Dependencies & Blockers
- **Depends on:** INFRA-002 (Vercel Hobby 배포 완료), DB-007 (Prisma 마이그레이션 + Supabase 연결 완료)
- **Blocks:** AVAIL-001 (UptimeRobot 합성 모니터링 상세 설정)
- **참고:** INFRA-005는 DB-007(Supabase 실제 연결)이 완료된 후에 Health Check의 DB 커넥션 테스트 부분이 완전히 동작합니다. 단, UptimeRobot 계정 생성 및 기본 HTTP 모니터링 설정은 선행하여 진행 가능합니다.
