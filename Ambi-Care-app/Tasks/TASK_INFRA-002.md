---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] INFRA-002: Vercel Hobby 배포 설정 (Git Push 자동 배포 + PR Preview)"
labels: 'feature, infra, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [INFRA-002] Vercel Hobby 배포 설정 (Git Push 자동 배포 + PR Preview)
- 목적: Rooted MVP 프로젝트를 Vercel Hobby 플랜에 연결하여 Git Push 시 자동 배포(Production) 및 PR Preview 배포를 활성화함으로써, 지속적 배포(CD) 파이프라인을 무료로 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-12`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — C-TEC-007: Vercel Deployment
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-13`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Vercel Hobby Limits
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.2`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 0 Foundation
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§15`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Free Tier Constraint Specification
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#NEW-03`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Rapid Deployment Cycle 신규 역량
- Vercel Platform Docs: [https://vercel.com/docs](https://vercel.com/docs) (REF-12)
- Vercel Hobby Plan Limits: [https://vercel.com/docs/accounts/plans](https://vercel.com/docs/accounts/plans) (REF-15)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — INFRA-002

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] GitHub Repository 생성 (Public 또는 Private) — `rooted-mvp` 저장소명
- [ ] 로컬 프로젝트를 GitHub 원격 저장소에 Push (`git init` → `git remote add` → `git push`)
- [ ] Vercel 계정 생성 (Hobby Plan — 무료) 및 GitHub OAuth 연동
- [ ] Vercel 대시보드에서 `Import Project` → GitHub 저장소 연결
- [ ] Framework Preset 확인 — `Next.js` 자동 감지 확인
- [ ] Build Command / Output Directory / Install Command 기본값 확인 (`npm run build`, `.next`)
- [ ] 최초 Production 배포 트리거 — `main` 브랜치 Push 시 자동 배포 확인
- [ ] 배포 URL 확인 — `https://rooted-mvp-xxxxx.vercel.app` 형태의 Production URL 접속 확인
- [ ] PR Preview 배포 테스트 — 별도 브랜치에서 PR 생성 시 Preview URL 생성 확인
- [ ] Vercel 대시보드에서 Hobby Plan 제한사항 확인 (Serverless 100 GB-hr, 10s timeout, 100GB bandwidth)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: Git Push 시 자동 Production 배포**
- Given: GitHub 저장소가 Vercel 프로젝트에 연결됨
- When: `main` 브랜치에 코드를 Push함
- Then: Vercel가 자동으로 빌드 및 배포를 수행하고, Production URL에서 최신 코드가 반영된 페이지가 정상적으로 표시된다.

**Scenario 2: PR Preview 배포 생성**
- Given: `main` 브랜치로의 Pull Request가 생성됨
- When: PR에 코드 변경사항이 포함됨
- Then: Vercel가 Preview URL(`https://rooted-mvp-xxxxx-git-branch-xxxxx.vercel.app`)을 자동 생성하고, PR 코멘트에 Preview 링크가 첨부된다.

**Scenario 3: 빌드 실패 시 알림**
- Given: 문법 에러가 포함된 코드가 Push됨
- When: Vercel 빌드가 실패함
- Then: Vercel 대시보드와 GitHub Commit/PR에 빌드 실패 상태가 표시되고, 이전 정상 배포가 유지된다.

**Scenario 4: Hobby Plan 비용 확인**
- Given: Vercel Hobby Plan으로 배포가 완료됨
- When: Vercel 대시보드의 Usage 탭을 확인함
- Then: 월간 비용이 $0이며 Free Tier 제한 범위 내에 있다.

## :gear: Technical & Non-Functional Constraints
- **플랜 제한:** Vercel Hobby (무료) — Serverless 100 GB-hr/월, Function 10초 timeout, Edge Runtime 미지원, Bandwidth 100GB/월 — CON-13
- **배포 방식:** Git Push 자동 배포만 사용 (CLI 수동 배포 지양) — CON-12
- **비용:** $0/월 유지 필수 — CON-16, REQ-NF-012
- **빌드 시간:** Hobby Plan 빌드 타임아웃 45분 이내
- **도메인:** 기본 `*.vercel.app` 도메인 사용 (커스텀 도메인은 추후 설정 가능)

## :checkered_flag: Definition of Done (DoD)
- [ ] GitHub 저장소와 Vercel 프로젝트가 정상적으로 연결되었는가?
- [ ] `main` 브랜치 Push 시 자동 배포가 트리거되는가?
- [ ] Production URL에서 Next.js 앱이 정상적으로 로드되는가?
- [ ] PR 생성 시 Preview 배포 URL이 자동 생성되는가?
- [ ] Vercel 대시보드에서 비용이 $0으로 확인되는가?
- [ ] TLS 1.3 인증서가 자동 적용되었는가? (REQ-NF-008)

## :construction: Dependencies & Blockers
- **Depends on:** INFRA-001 (Next.js 프로젝트 초기 설정 완료)
- **Blocks:** INFRA-003 (Vercel Cron Job 설정), INFRA-005 (Supabase 일시정지 방지), SEC-001 (TLS 1.3 검증), PERF-003 (Vercel Analytics 설정), AVAIL-001 (UptimeRobot 설정), AVAIL-002 (빌링 대시보드 확인), ENH-005 (Analytics 연동)
- **참고:** Vercel Hobby Plan의 제한사항(Serverless 100 GB-hr, 1 Cron/day)을 반드시 숙지하고, RISK-08(Serverless 한도 초과) 리스크를 인지해야 합니다.
