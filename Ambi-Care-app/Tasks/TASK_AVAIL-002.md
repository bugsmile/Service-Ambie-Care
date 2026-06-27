---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Availability] AVAIL-002: Vercel + Supabase $0 비용 확인 프로세스"
labels: 'availability, infra, priority:low, phase:1'
assignees: ''
---

## :dart: Summary
- 기능명: [AVAIL-002] Vercel Hobby + Supabase Free 플랜 $0 월 비용 유지 확인 프로세스
- 목적: SRS NFR-AVAIL-002(인프라 비용 $0/월)를 지속적으로 달성하기 위해 Vercel/Supabase 무료 플랜 한계 모니터링 및 초과 방지 체크리스트를 수립한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 관련 인프라: [`/TASKs/TASK_INFRA-001.md`](./TASK_INFRA-001.md) — Vercel 배포
- 관련 인프라: [`/TASKs/TASK_INFRA-002.md`](./TASK_INFRA-002.md) — Supabase 설정
- 관련 태스크: [`/TASKs/TASK_AVAIL-001.md`](./TASK_AVAIL-001.md) — UptimeRobot 모니터링
- SRS 섹션: §9.2 Cost Constraints, NFR-AVAIL-002
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — AVAIL-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] **Vercel Hobby 무료 한계 모니터링 항목:**
  - Serverless Function 실행 시간: 100GB-hour/월
  - Edge Middleware 실행: 1,000,000건/월
  - 배포 횟수: 무제한
  - Cron Jobs: 1개/프로젝트 (daily report 파이프라인 사용)
- [ ] **Supabase Free 무료 한계 모니터링 항목:**
  - DB 용량: 500MB — 데이터 보존 30일 정책으로 관리
  - 월간 트랜잭션: 확인 불필요 (SaaS 관리형)
  - 7일 비활성 → 프로젝트 일시 정지 → AVAIL-001 핑으로 방지
- [ ] **월간 비용 확인 프로세스 (체크리스트):**
  1. Vercel Dashboard → Usage 탭 → Serverless Function 사용량 확인
  2. Supabase Dashboard → Settings → Billing 탭 → 사용량 확인
  3. Resend Dashboard → 이메일 발송 건수 확인 (100건/일 Free)
  4. UptimeRobot → 모니터 수 확인 (50개 무료 한계)
- [ ] 비용 경고 알림 설정: Vercel/Supabase 사용량 80% 도달 시 이메일 알림
- [ ] 데이터 보존 Cron 동작 확인 (DB-008) — 30일 초과 데이터 정리로 500MB 유지

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: Vercel 무료 한계 내 운영**
- Given: MVP 50개 디바이스, 일일 보고서 Cron 1회
- When: 월간 Vercel Usage 확인
- Then: Serverless Function 실행 시간 < 100GB-hour (100% 미만)

**Scenario 2: Supabase DB 용량 500MB 이내**
- Given: 30일 데이터 보존 정책 적용 중
- When: Supabase Dashboard Storage 확인
- Then: DB 용량 < 500MB

**Scenario 3: Supabase 7일 비활성 방지**
- Given: UptimeRobot 5분 간격 핑 활성화
- When: 7일 경과
- Then: Supabase 프로젝트 일시 정지 없음

## :gear: Technical & Non-Functional Constraints
- **무료 한계 버퍼:** 사용량 80% 초과 시 즉시 최적화 검토
- **외부 서비스 비용:**
  - Resend: 100건/일 Free (초과 시 $0.001/건)
  - Gemini: 1,500 RPD Free (초과 시 유료)
- **비용 목표:** 인프라 + 외부 서비스 합계 $0/월 (SRS NFR-AVAIL-002)

## :checkered_flag: Definition of Done (DoD)
- [ ] 월간 비용 확인 체크리스트 문서화?
- [ ] Vercel/Supabase 사용량 알림 설정?
- [ ] 데이터 보존 Cron으로 DB 용량 관리?
- [ ] 첫 1개월 운영 후 실제 비용 $0 확인?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001, TASK_INFRA-002, TASK_AVAIL-001, TASK_DB-008
- **Blocks:** 없음
