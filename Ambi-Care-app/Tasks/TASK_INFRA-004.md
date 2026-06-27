---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] INFRA-004: 환경 변수 8개 설정 (.env.local / .env.example)"
labels: 'feature, infra, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [INFRA-004] `.env.local` / `.env.example` — 환경 변수 8개 설정
- 목적: Rooted MVP에서 사용하는 모든 외부 서비스 연결 정보와 시크릿 키를 환경 변수로 관리하여, 민감 정보의 코드 하드코딩을 방지하고 로컬/스테이징/프로덕션 환경 간 안전한 전환을 보장한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§9`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Environment Variables (8 Variables)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§7.4`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — AI Model Swap Strategy
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§15`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Free Tier Constraint Specification
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`.env.local`, `.env.example` 위치)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — INFRA-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `.env.example` 파일 생성 — 8개 환경 변수 키 + 설명 주석 + 샘플 값(placeholder) 포함
- [ ] `.env.local` 파일 생성 — 로컬 개발용 실제 값 설정 (개발자 개인 키)
- [ ] `.gitignore` 확인 — `.env.local`이 Git 추적에서 제외되어 있는지 확인 (Next.js 기본 포함)
- [ ] 환경 변수 목록 작성 (8개):
  - `DATABASE_URL` — Supabase Free PostgreSQL 연결 문자열
  - `NEXTAUTH_SECRET` — NextAuth.js JWT 서명 시크릿 (최소 32자 랜덤 문자열)
  - `NEXTAUTH_URL` — NextAuth.js 콜백 URL (`http://localhost:3000` / 프로덕션 URL)
  - `GOOGLE_GENERATIVE_AI_API_KEY` — Gemini API 키 (Google AI Studio에서 발급)
  - `AI_MODEL` — Gemini 모델 식별자 (`gemini-1.5-flash` 기본값)
  - `RESEND_API_KEY` — Resend 이메일 API 키 (Free: 100통/일)
  - `NEXT_PUBLIC_AMPLITUDE_KEY` — Analytics 키 (Optional, Vercel Analytics 대체 가능)
  - `SLACK_WEBHOOK_URL` — Slack/Discord Incoming Webhook URL (Optional)
- [ ] `NEXTAUTH_SECRET` 생성 스크립트 안내 — `openssl rand -base64 32` 또는 온라인 생성기
- [ ] Vercel 대시보드에 프로덕션 환경 변수 등록 (Settings → Environment Variables)
- [ ] 환경 변수 로딩 검증 — `app/api/health/route.ts` (선택사항) 또는 로컬 콘솔 확인
- [ ] `CRON_SECRET` 환경 변수 추가 — INFRA-003 Cron Job 인증용 (SRS §9에는 명시되지 않았으나 보안상 필요)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: .env.example 파일 완전성 검증**
- Given: `.env.example` 파일이 프로젝트 루트에 존재함
- When: 새 개발자가 프로젝트를 클론하고 `.env.example`을 확인함
- Then: 8개 + α 환경 변수 키와 설명 주석이 포함되어 있어, 필요한 외부 서비스 키가 무엇인지 즉시 파악할 수 있다.

**Scenario 2: .env.local Git 추적 제외**
- Given: `.env.local`에 실제 시크릿 값이 입력됨
- When: `git status`를 실행함
- Then: `.env.local`이 Untracked/Ignored 상태이며, Git에 커밋되지 않는다.

**Scenario 3: Next.js 환경 변수 정상 로딩**
- Given: `.env.local`에 `DATABASE_URL`이 설정됨
- When: `npm run dev`로 로컬 서버를 실행함
- Then: `process.env.DATABASE_URL`이 Server Component/API Route에서 정상적으로 접근 가능하다.

**Scenario 4: 클라이언트 환경 변수 구분**
- Given: `NEXT_PUBLIC_AMPLITUDE_KEY`가 설정됨
- When: Client Component에서 `process.env.NEXT_PUBLIC_AMPLITUDE_KEY`를 참조함
- Then: `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에서 접근 가능하고, `DATABASE_URL` 등 서버 전용 변수는 클라이언트에서 `undefined`이다.

**Scenario 5: Vercel 프로덕션 환경 변수 적용**
- Given: Vercel 대시보드에 환경 변수가 등록됨
- When: 프로덕션 배포 후 해당 변수를 사용하는 API를 호출함
- Then: Vercel 서버에서 환경 변수가 정상적으로 로딩되어 API가 정상 동작한다.

## :gear: Technical & Non-Functional Constraints
- **보안:** `.env.local` 파일은 절대 Git에 커밋하지 않음 — 시크릿 유출 방지
- **Next.js 규칙:** 서버 전용 변수는 `NEXT_PUBLIC_` 접두사 없이, 클라이언트 노출 변수만 `NEXT_PUBLIC_` 접두사 사용
- **AI 모델 교체:** `AI_MODEL` 환경변수 변경만으로 Gemini 모델 교체 가능해야 함 — CON-11, §7.4
- **비용 제약:** 모든 외부 서비스는 Free Tier 사용 — CON-16
- **민감 정보 마스킹:** 환경 변수 값이 로그에 노출되지 않도록 주의

## :checkered_flag: Definition of Done (DoD)
- [ ] `.env.example` 파일이 8개 + α 환경 변수 키와 설명을 포함하는가?
- [ ] `.env.local`이 `.gitignore`에 포함되어 Git 추적에서 제외되는가?
- [ ] Next.js 서버 컴포넌트/API Route에서 환경 변수가 정상 로딩되는가?
- [ ] `NEXT_PUBLIC_` 접두사 규칙이 올바르게 적용되었는가?
- [ ] Vercel 대시보드에 프로덕션 환경 변수가 등록되었는가?
- [ ] `NEXTAUTH_SECRET`이 최소 32자 이상의 랜덤 문자열인가?

## :construction: Dependencies & Blockers
- **Depends on:** INFRA-001 (Next.js 프로젝트 초기 설정)
- **Blocks:** AI-001 (Vercel AI SDK + Gemini 설정 — `GOOGLE_GENERATIVE_AI_API_KEY`, `AI_MODEL` 필요), EMAIL-001 (Resend 설정 — `RESEND_API_KEY` 필요), OPS-001 (Slack Webhook 설정 — `SLACK_WEBHOOK_URL` 필요), AUTH-001 (NextAuth.js — `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 필요), DB-006 (Prisma Client — `DATABASE_URL` 필요)
- **참고:** SRS v3.0에서 환경 변수가 12개 → 8개로 감소했습니다. FCM, VAPID, EMR 관련 변수가 제거되고 Resend, Slack 변수가 추가되었습니다.
