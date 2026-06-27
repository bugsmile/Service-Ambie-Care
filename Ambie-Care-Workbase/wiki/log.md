---
title: Wiki 운영 로그
type: log
tags: [log, operations]
source_count: 13
last_updated: 2026-04-25
---

# Wiki 운영 로그

> 형식: `## [YYYY-MM-DD] 작업유형 | 내용`  
> 작업유형: `ingest` | `query` | `lint` | `build`

---

## [2026-04-23] build | 위키 초기 구축

**작업 내용:** `raw/` 내 12개 원시 소스 전체를 처리하여 위키 초기 구조를 구축했습니다.

**처리된 소스:**
1. `1.porters-forces.md` → `sources/01-porters-forces.md`
2. `2.competents-analysis.md` → `sources/02-competitive-analysis.md`
3. `3.value-chain.md` → `sources/03-value-chain.md`
4. `4.KSFs-report.md` → `sources/04-ksfs.md`
5. `5.Problem-definition.md` → `sources/05-problem-definition.md`
6. `6.TAM-SAM-SOM+MarketSegment.md` → `sources/06-tam-sam-som.md`
7. `7.persona-spectrum-map.md` → `sources/07-persona-spectrum.md`
8. `8.customer-journey-map.md` → `sources/08-customer-journey-map.md`
9. `9.aos-dos-analysis.md` → `sources/09-aos-dos.md`
10. `10.jtbd-interview-report.md` → `sources/10-jtbd-interview.md`
11. `07.value-proposition-sheet_Rooted_v2.md` → `sources/11-vps.md`
12. `PRD_V1.md` → `sources/12-prd.md`
13. `SRS_V03(KOR_OPUS).md` → 미처리 (추후 수집 예정)

**생성된 엔티티 페이지 (9개):**
- `entities/persona-park-jisu.md` — Core 페르소나 박지수
- `entities/persona-jeong-minseok.md` — Adjacent 페르소나 정민석
- `entities/persona-jang-younghee.md` — Extreme 페르소나 장영희
- `entities/persona-go-taesik.md` — Non-user 페르소나 고태식
- `entities/company-carebell.md` — 경쟁사 케어벨
- `entities/company-opasnet.md` — 경쟁사 오파스넷
- `entities/company-aqaralife.md` — 경쟁사 아카라라이프
- `entities/company-umain.md` — 경쟁사 유메인
- `entities/company-brlab.md` — 경쟁사 비알랩

**생성된 컨셉 페이지 (8개):**
- `concepts/false-alarm.md` — 오탐률 (핵심 설계 과제)
- `concepts/zero-friction.md` — Zero-Friction UX
- `concepts/uwb-radar.md` — UWB 레이더 기술
- `concepts/ambient-care.md` — 앰비언트 케어
- `concepts/space-context-moat.md` — 공간 맥락 지표 해자
- `concepts/emr-integration.md` — EMR 연동
- `concepts/daily-report.md` — 웰니스 데일리 리포트
- `concepts/two-track-lineup.md` — 투트랙 라인업 전략

**미처리 소스:** `SRS_V03` — 추후 `ingest` 명령으로 별도 처리 권장

---

## [2026-04-23] lint | 초기 구축 직후 상태 점검

**발견 사항:**
- `SRS_V03(KOR_OPUS).md` 소스 미처리 → 추후 수집 예정
- TAM-SAM-SOM 세그먼트 상세(SOM S1~S4) 수치는 VPS §1.6에서 보완 필요
- 페르소나 간 상호 영향 관계(장영희 → 정민석 압력 경로 등) `entities/` 페이지에 명시 필요
- `entities/company-carebell.md`의 Lock-in 전략이 `concepts/emr-integration.md`와 교차 참조 필요 (현재 연결됨)

**권장 다음 작업:**
1. SRS 소스 수집: `"SRS_V03 소스를 위키에 수집해줘"`
2. TAM-SAM-SOM 세그먼트 상세 보완
3. 위키 그래프 뷰(Obsidian)에서 고아 페이지 확인

---

## [2026-04-23] build | index.md 생성 및 위키 초기 구축 완료

**작업 내용:** 나머지 컨셉 2개(`daily-report.md`, `two-track-lineup.md`) 및 `index.md` 생성으로 초기 구축 완료.

**생성 파일:**
- `concepts/daily-report.md` — 데일리 웰니스 리포트 (FR-05, B2C 잔존율 방어)
- `concepts/two-track-lineup.md` — B2G 보급형 + B2B 프리미엄 GTM 전략
- `index.md` — 전체 위키 네비게이션 인덱스 (소스 12개, 엔티티 9개, 컨셉 8개)

**위키 완성 현황:**
- sources/: 12개 ✅
- entities/: 9개 ✅
- concepts/: 8개 ✅
- index.md ✅
- log.md ✅
- CLAUDE.md (스키마) ✅

**미처리:** 없음 — 전체 소스 처리 완료

---

## [2026-04-23] ingest | SRS_V03(KOR_OPUS).md — SRS v3.0 바이브 코딩 MVP 최적화

**처리 소스:** `raw/SRS_V03(KOR_OPUS).md` (1,532줄)

**생성 페이지:**
- `sources/13-srs-v03.md` — SRS v3.0 전체 요약

**업데이트 페이지:**
- `concepts/emr-integration.md` — Wave 2 연기 결정 (SRS v3.0) 추가
- `concepts/daily-report.md` — FR-05 Must 격상 + Gemini/Resend 구현 상세 추가
- `index.md` — SRS 소스 등록 + 미처리 소스 없음 업데이트

**핵심 발견 사항:**

1. **v3.0 4대 결정**: (1) 실시간 푸시 → Resend 이메일 대체, (2) SLA Best Effort ~99%, (3) 데이터 보존 90일 → 30일, (4) EMR 연동 Wave 2 연기
2. **기술 스택 확정**: Next.js App Router + Prisma + Supabase Free + Vercel Hobby + Gemini 1.5 Flash
3. **아키텍처 다이어트**: Route Handlers 11개 → 6개, Prisma 모델 7개 → 5개 (Facility 테이블 삭제)
4. **무료 인프라 제약**: Vercel Hobby Cron 1회/일, Supabase 7일 미가동 Pause 위험, Gemini Flash 1,500회/일
5. **Phase 로드맵**: Phase 0(1주) → Phase 1(2주) → Phase 2(2주) → Phase 3(1-2주) → Wave 2(별도)
6. **GAP-09 중요**: MVP는 실시간 응급 알림 불가 — "아침 리포트 + 대시보드 조회" 중심

**모의 데이터 전략**: 실물 센서 없이 `prisma/seed.ts`로 7일치 가짜 데이터 생성, `app/api/events/ingest`로 실시간 주입

**현재 위키 상태:**
- sources/: **13개** ✅ (모든 원시 소스 처리 완료)
- entities/: 9개 ✅
- concepts/: 8개 ✅

---

## [2026-04-25] build | raw 기반 지식베이스 현재화 및 확장

**작업 내용:** `llm-wiki.md`의 지속형 위키 설계 방식에 맞춰 `raw/`의 현재 13개 소스를 기준으로 위키를 점검하고 확장했습니다.

**정리 사항:**
- 기존 페이지의 원본 경로 표기를 `raw/assets/`에서 실제 경로인 `raw/`로 수정
- 전체 위키 페이지의 `last_updated`를 2026-04-25로 갱신
- `index.md`를 현재 지식베이스 카탈로그로 재작성
- `log.md`에 YAML 프런트매터 추가

**신규 엔티티 페이지:** AOS/DOS의 12명 페르소나 중 누락된 8명을 추가했습니다.
- `entities/persona-lee-hyunwoo.md`
- `entities/persona-kim-jeongsuk.md`
- `entities/persona-oh-seongjin.md`
- `entities/persona-han-miyoung.md`
- `entities/persona-bae-sujin.md`
- `entities/persona-yoon-taehyun.md`
- `entities/persona-choi-bongsu.md`
- `entities/persona-seo-migyeong.md`

**신규 컨셉 페이지:**
- `concepts/mvp-v3-scope.md` — SRS v3.0 기준 무료 티어 MVP 범위
- `concepts/data-retention.md` — PRD 90일 요구와 SRS 30일 MVP 결정의 차이
- `concepts/market-segments.md` — SOM S1~S4와 GTM Wave 연결
- `concepts/regulatory-language.md` — 규제·언어 가드레일

**현재 위키 상태:**
- sources/: **13개**
- entities/: **17개** (페르소나 12개 + 경쟁사 5개)
- concepts/: **12개**
- index.md / log.md 갱신 완료
