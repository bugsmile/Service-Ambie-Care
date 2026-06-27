---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Availability] AVAIL-001: UptimeRobot Free 합성 모니터링 (5분 간격)"
labels: 'availability, infra, priority:medium, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [AVAIL-001] UptimeRobot Free 플랜으로 핵심 엔드포인트 5분 간격 가용성 모니터링
- 목적: SRS NFR-AVAIL-001(월 가동률 99% 목표)을 달성하기 위해 UptimeRobot Free 플랜으로 헬스체크 엔드포인트를 5분 간격으로 모니터링하고 다운타임 발생 시 즉시 알림을 수신한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 관련 인프라: [`/TASKs/TASK_INFRA-001.md`](./TASK_INFRA-001.md) — Vercel 배포 설정
- 관련 인프라: [`/TASKs/TASK_INFRA-004.md`](./TASK_INFRA-004.md) — 헬스체크 엔드포인트
- SRS 섹션: §9.1 Availability Requirements, NFR-AVAIL-001
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AVAIL-001

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] UptimeRobot 계정 생성 (free.uptimerobot.com)
- [ ] 모니터 등록:
  - `GET /api/health` — HTTP 200 응답 확인, 5분 간격
  - `GET /` (홈페이지) — 200 응답 확인
- [ ] 알림 설정: 이메일 알림 (`setsuna.s.r@gmail.com`) + Slack Webhook 연동 (OPS-001)
- [ ] `/api/health` 엔드포인트 구현:
  ```typescript
  // GET /api/health
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  ```
- [ ] Supabase 연결 상태 포함 헬스체크 옵션:
  ```typescript
  await prisma.$queryRaw`SELECT 1`  // DB 연결 확인
  ```
- [ ] UptimeRobot Dashboard에서 가동률 리포트 확인

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 헬스체크 정상 응답**
- Given: Vercel 정상 배포 상태
- When: UptimeRobot GET /api/health (5분 간격)
- Then: HTTP 200 + `{ status: 'ok' }` 응답, UptimeRobot 상태 GREEN

**Scenario 2: 다운타임 감지 → 알림**
- Given: Vercel 배포 오류 또는 Supabase 일시 중단
- When: /api/health 응답 실패 (timeout 또는 5xx)
- Then: 이메일 알림 발송, Slack 알림 전송

**Scenario 3: 월 가동률 99% 확인**
- Given: 30일 모니터링 데이터
- When: UptimeRobot Reports 확인
- Then: 가동률 ≥ 99% (다운타임 ≤ 7.3시간/월)

## :gear: Technical & Non-Functional Constraints
- **UptimeRobot Free:** 50개 모니터, 5분 간격 (무료 최소 간격)
- **Supabase 7일 비활성 정책:** UptimeRobot 5분 핑으로 비활성 방지 효과
- **헬스체크 응답 시간:** < 1,000ms (느린 경우 Supabase cold start 고려)

## :checkered_flag: Definition of Done (DoD)
- [ ] UptimeRobot 모니터 2개 이상 등록 및 GREEN 상태?
- [ ] /api/health 엔드포인트 구현 완료?
- [ ] 다운타임 이메일 알림 수신 테스트?
- [ ] 월 가동률 대시보드 접근 가능?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 헬스체크 대상, 감지 주기, 알림 수신자, 월간 가용성 계산식을 산출물로 고정한다.
- **추가 Edge Cases:** Vercel 배포 실패, Supabase 일시 중지, 5xx, timeout을 각각 다운타임으로 분류한다.
- **검증 증거:** UptimeRobot 모니터 URL 또는 캡처, 첫 GREEN 확인, 테스트 알림 수신 기록을 첨부한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001, TASK_INFRA-004
- **Blocks:** AVAIL-002
