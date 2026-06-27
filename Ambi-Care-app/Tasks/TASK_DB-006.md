---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] DB-006: Supabase Free PostgreSQL 연결 + Prisma Client 싱글턴 설정"
labels: 'feature, database, infra, priority:critical, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [DB-006] Supabase Free PostgreSQL 연결 설정 + Prisma Client 싱글턴 (`lib/prisma.ts`)
- 목적: Supabase Free PostgreSQL 데이터베이스에 Prisma ORM을 연결하고, Next.js 환경에서 안전하게 사용할 수 있는 Prisma Client 싱글턴 인스턴스를 생성하여, 모든 Server Action 및 Route Handler에서 일관되게 DB에 접근할 수 있는 인프라를 구축한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§9`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Environment Variables (DATABASE_URL)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-08`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — C-TEC-003: Prisma + Supabase
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#CON-14`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Supabase Free Limits (500MB DB)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§8`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Project Structure (`lib/prisma.ts`)
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§15`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Free Tier Constraint Specification
- Prisma Docs (Best Practices for Next.js): [https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices) (REF-09)
- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs) (REF-10)
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — DB-006

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] Supabase Free 프로젝트 생성 (supabase.com 대시보드)
- [ ] Supabase 대시보드에서 PostgreSQL 연결 문자열 확인 (Settings → Database → Connection String)
- [ ] `.env.local`에 `DATABASE_URL` 환경 변수 설정 (Supabase 직접 연결 또는 Pooling URL)
- [ ] Prisma 패키지 설치: `npm install prisma @prisma/client` (devDependencies/dependencies 구분)
- [ ] `prisma/schema.prisma`의 `datasource db` 설정 확인:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
  }

  generator client {
    provider = "prisma-client-js"
  }
  ```
- [ ] `lib/prisma.ts` Prisma Client 싱글턴 파일 생성:
  ```typescript
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```
- [ ] `npx prisma generate` 실행 — Prisma Client 타입 생성 확인
- [ ] DB 연결 테스트 — 간단한 `prisma.$queryRaw` 또는 Health Check API에서 연결 확인
- [ ] Vercel 환경 변수에 `DATABASE_URL` 등록 (프로덕션 배포용)
- [ ] Connection Pooling 검토 — Supabase Free에서 Prisma 연결 풀 설정 (필요시 `?pgbouncer=true&connection_limit=1`)

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: Prisma Client 정상 초기화**
- Given: `DATABASE_URL`이 `.env.local`에 설정됨
- When: `import { prisma } from '@/lib/prisma'`를 Server Component/API Route에서 호출함
- Then: Prisma Client 인스턴스가 정상적으로 생성되고 DB 연결이 수립된다.

**Scenario 2: 싱글턴 패턴 동작 (개발 모드)**
- Given: `NODE_ENV=development`에서 Next.js HMR(Hot Module Replacement)이 동작 중임
- When: 여러 API Route에서 동시에 `prisma`를 import함
- Then: 동일한 Prisma Client 인스턴스가 재사용되어 `globalThis`에 저장된 싱글턴이 유지된다. "Too many Prisma Client instances" 경고가 발생하지 않는다.

**Scenario 3: Supabase PostgreSQL 쿼리 실행**
- Given: Prisma Client가 Supabase Free PostgreSQL에 연결됨
- When: `prisma.$queryRaw`SELECT 1``을 실행함
- Then: 쿼리가 성공적으로 실행되고 결과가 반환된다.

**Scenario 4: 프로덕션 환경 연결**
- Given: Vercel 환경 변수에 `DATABASE_URL`이 등록됨
- When: Vercel에 배포 후 API Route에서 DB 쿼리를 실행함
- Then: Supabase Free PostgreSQL에 정상 연결되어 쿼리가 실행된다.

**Scenario 5: 개발 모드 쿼리 로깅**
- Given: `NODE_ENV=development`이고 Prisma Client에 `log: ['query', 'error', 'warn']`이 설정됨
- When: DB 쿼리를 실행함
- Then: 콘솔에 실행된 SQL 쿼리가 로깅된다. 프로덕션에서는 `error` 레벨만 로깅된다.

## :gear: Technical & Non-Functional Constraints
- **DB 제약:** Supabase Free — 500MB 용량, 7일 비활성 시 일시정지 — CON-14
- **싱글턴 필수:** Next.js 개발 모드 HMR에서 Prisma Client 인스턴스 누수 방지를 위한 `globalThis` 패턴 필수
- **Connection Pooling:** Supabase Free에서는 PgBouncer 기반 Pooling URL 사용 권장 (Serverless 환경 커넥션 관리)
- **환경 변수:** `DATABASE_URL`은 서버 전용 (`NEXT_PUBLIC_` 접두사 금지) — 클라이언트 노출 방지
- **비용:** $0/월 유지 필수 — CON-16
- **Prisma Client 버전:** 프로젝트 내 `prisma`와 `@prisma/client` 버전 일치 필수
- **로깅:** 프로덕션에서는 쿼리 로깅 비활성화 (성능 + 보안)

## :checkered_flag: Definition of Done (DoD)
- [ ] `lib/prisma.ts` 파일이 싱글턴 패턴으로 정상 생성되었는가?
- [ ] Supabase Free PostgreSQL에 정상 연결되는가?
- [ ] `npx prisma generate`가 에러 없이 Prisma Client를 생성하는가?
- [ ] 개발 모드에서 "Too many Prisma Client instances" 경고가 발생하지 않는가?
- [ ] `.env.local`의 `DATABASE_URL`이 Git에 커밋되지 않는가?
- [ ] Vercel 환경 변수에 프로덕션 `DATABASE_URL`이 등록되었는가?
- [ ] 간단한 DB 쿼리가 성공적으로 실행되는가?

## :construction: Dependencies & Blockers
- **Depends on:** DB-001 ~ DB-005 (전체 5개 Prisma 모델 정의 완료), INFRA-001 (Next.js 프로젝트), INFRA-004 (환경 변수 설정 — DATABASE_URL)
- **Blocks:** DB-007 (Prisma 마이그레이션 실행), 모든 Server Action 및 Route Handler (prisma import 필요)
- **참고:** Supabase Free는 7일 비활성 시 일시정지됩니다 (RISK-07). INFRA-005(일시정지 방지)와 함께 운영해야 합니다. Connection Pooling URL(`?pgbouncer=true`)과 Direct URL 중 적절한 것을 선택해야 합니다.
