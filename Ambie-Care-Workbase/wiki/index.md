---
title: Ambie-Care (Rooted) 지식베이스 인덱스
type: index
tags: [index, knowledge-base, rooted]
source_count: 13
last_updated: 2026-04-25
---

# Ambie-Care Workbase — Wiki Index

> **제품:** Rooted — 비접촉 AI 앰비언트 홈 안전 솔루션  
> **원본:** `raw/` 내 13개 문서  
> **현재 실행 기준:** PRD v0.3의 제품 목표 + SRS v3.0의 무료 티어 MVP 범위

---

## 빠른 참조

| 항목 | 값 |
|---|---|
| 기존 오작동 빈도 | 하루 12건, 월 360건/가구 |
| AI 엔진 목표 | 월 0.3건 이하/가구 |
| 북극성 지표 | 사용자 체감 월 2건 이하/가구 |
| MVP Core 범위 | 웹 대시보드, 데일리 리포트, AI 요약, 이메일 알림, 모의 데이터 |
| MVP 제외/Wave 2 | UWB HW 연동, Edge AI, EMR HMAC, SMS/카카오/푸시, 90일+ 보존 |
| MVP 보존 정책 | Hot 30일 |
| 제품 목표 보존 정책 | 90일 Hot + 3년 Cold |
| B2C 가격 | 월 30,000원 + 설치비 49,000원 |
| B2B Lite 가격 | 설치비 0원 + 월 100,000원 |
| 초기 SOM | 약 63.0억원 |
| 규제 포지셔닝 | 웰니스/홈 안전, 진단·의료 표현 회피 |

---

## Sources

| 파일 | 제목 | 핵심 내용 |
|---|---|---|
| [01-porters-forces.md](sources/01-porters-forces.md) | Porter's Five Forces | 대체재 위협 Very High, B2B/B2G 구매자 교섭력 High |
| [02-competitive-analysis.md](sources/02-competitive-analysis.md) | 경쟁사 분석 | 케어벨·오파스넷·아카라라이프·유메인·비알랩 비교 |
| [03-value-chain.md](sources/03-value-chain.md) | 케어벨 가치사슬 | 알고리즘 해자, 공간 맥락, B2B Lock-in 벤치마킹 |
| [04-ksfs.md](sources/04-ksfs.md) | KSF Top 5 | 오작동 제거, 공간 맥락, Two-Track, EMR, B2B2C |
| [05-problem-definition.md](sources/05-problem-definition.md) | 문제 정의 | B2B/B2G/B2C 관점의 공통 미충족 문제 |
| [06-tam-sam-som.md](sources/06-tam-sam-som.md) | TAM-SAM-SOM | 글로벌/국내 시장과 SOM S1~S4 |
| [07-persona-spectrum.md](sources/07-persona-spectrum.md) | 페르소나 스펙트럼 | 대표 4대 페르소나와 상호작용 |
| [08-customer-journey-map.md](sources/08-customer-journey-map.md) | 고객 여정지도 | 박지수 CJM, P4 오작동 알림 위기 |
| [09-aos-dos.md](sources/09-aos-dos.md) | AOS/DOS 분석 | 12명 페르소나와 우선순위 매트릭스 |
| [10-jtbd-interview.md](sources/10-jtbd-interview.md) | JTBD 인터뷰 | 최근 사용자·이탈자·미사용 탐색 그룹 검증 |
| [11-vps.md](sources/11-vps.md) | Value Proposition Sheet | MVP 기능, Not-To-Do, GTM Wave 전략 |
| [12-prd.md](sources/12-prd.md) | PRD v0.3 | FR/NFR/리스크/DB/API 개요 |
| [13-srs-v03.md](sources/13-srs-v03.md) | SRS v3.0 | 무료 티어 MVP 최적화, 4대 결정, Phase 0~3 |

---

## Concepts

| 파일 | 개념 | 한줄 요약 |
|---|---|---|
| [mvp-v3-scope.md](concepts/mvp-v3-scope.md) | MVP v3.0 범위 | 무료 티어·1인 바이브 코딩 기준의 실제 구현 범위 |
| [data-retention.md](concepts/data-retention.md) | 데이터 보존 정책 | PRD 90일 요구와 SRS 30일 MVP 결정의 차이 |
| [market-segments.md](concepts/market-segments.md) | 시장 세그먼트 | SOM S1~S4와 GTM Wave 연결 |
| [regulatory-language.md](concepts/regulatory-language.md) | 규제·언어 가드레일 | 진단·의료·낙인 표현 회피 원칙 |
| [false-alarm.md](concepts/false-alarm.md) | 오탐률/오작동 | 12회/일 → 0.3회/월, 신뢰 붕괴의 핵심 |
| [zero-friction.md](concepts/zero-friction.md) | Zero-Friction UX | 착용·충전·조작 없이 작동 |
| [uwb-radar.md](concepts/uwb-radar.md) | UWB 레이더 | 비영상 비접촉 센싱 기반 |
| [ambient-care.md](concepts/ambient-care.md) | 앰비언트 케어 | 공간 자체가 상태를 감지하는 방식 |
| [space-context-moat.md](concepts/space-context-moat.md) | 공간 맥락 Moat | 화장실 체류·야간 동선 등 웨어러블 방어 해자 |
| [emr-integration.md](concepts/emr-integration.md) | EMR 연동 | B2B Lock-in 축, SRS v3.0에서는 Wave 2 |
| [daily-report.md](concepts/daily-report.md) | 데일리 리포트 | 아침 보호자 안심 루틴, MVP 킬러 기능 |
| [two-track-lineup.md](concepts/two-track-lineup.md) | Two-Track 라인업 | B2G/B2B 이중 진입 전략 |

---

## Entities

### 페르소나

| 파일 | 이름 | 유형 | 핵심 특징 |
|---|---|---|---|
| [persona-park-jisu.md](entities/persona-park-jisu.md) | 박지수 | Core | 원격 보호자, 데일리 리포트와 오작동 최소화가 핵심 |
| [persona-lee-hyunwoo.md](entities/persona-lee-hyunwoo.md) | 이현우 | Core | 프리미엄 실버타운 원장, 오작동·EMR·관제 통합 중시 |
| [persona-kim-jeongsuk.md](entities/persona-kim-jeongsuk.md) | 김정숙 | Core | 재가 수급자, 조작 없는 자동 작동과 바우처 채널 |
| [persona-oh-seongjin.md](entities/persona-oh-seongjin.md) | 오성진 | Core | 요양원 수간호사, 알람 피로와 수기 기록 제거 |
| [persona-han-miyoung.md](entities/persona-han-miyoung.md) | 한미영 | Core | 복지용구 사업소 대표, 바우처·AS·CS 부담 |
| [persona-jeong-minseok.md](entities/persona-jeong-minseok.md) | 정민석 | Adjacent | 지자체 조달, 대규모 오작동 실증 데이터 요구 |
| [persona-bae-sujin.md](entities/persona-bae-sujin.md) | 배수진 | Adjacent | 장애인 시설, CCTV 없는 야간 이상 감지 |
| [persona-yoon-taehyun.md](entities/persona-yoon-taehyun.md) | 윤태현 | Adjacent | 건설사 PM, 빌트인·장기 AS 안정성 |
| [persona-jang-younghee.md](entities/persona-jang-younghee.md) | 장영희 | Extreme | 낙상 사망사고 피해 가족, 로그 보존과 오작동 제거 |
| [persona-choi-bongsu.md](entities/persona-choi-bongsu.md) | 최봉수 | Extreme | 무연고 고위험군, 비활동 감지와 공공 연결 |
| [persona-go-taesik.md](entities/persona-go-taesik.md) | 고태식 | Non-user | 낙인 언어 거부, 배우자 안전 프레이밍 전환 |
| [persona-seo-migyeong.md](entities/persona-seo-migyeong.md) | 서미경 | Non-user | 소형 요양원 원장, 월 10만원 이하 Lite 플랜 |

### 경쟁사

| 파일 | 회사 | 포지션 | 차별 포인트 |
|---|---|---|---|
| [company-carebell.md](entities/company-carebell.md) | 케어벨 | B2B 프리미엄 선두 | UWB + 관제 + Lock-in 벤치마킹 대상 |
| [company-opasnet.md](entities/company-opasnet.md) | 오파스넷 | B2G 공공 선두 | 공공/통신망 신뢰도 |
| [company-aqaralife.md](entities/company-aqaralife.md) | 아카라라이프 | AIoT 스마트홈 | 생태계형, 안전 집중 전략과 대비 |
| [company-umain.md](entities/company-umain.md) | 유메인 | UWB 칩셋 원천 | 독자 SoC·공급망 리스크 참조 |
| [company-brlab.md](entities/company-brlab.md) | 비알랩 | 수면 분석 특화 | 수면 강점, 공간 동선 약점 |

---

## 핵심 관계도

```text
[MVP v3.0 범위]
  ├─ Phase 0~3: 웹 대시보드 + 데일리 리포트 + 이메일 + 모의 데이터
  └─ Wave 2: UWB HW + Edge AI + EMR + 푸시/SMS + 90일+ 보존

[오탐률/오작동]
  ├─ 박지수: 새벽 오작동 → 구독 해지 위험
  ├─ 오성진/이현우: 알람 피로 → 현장 무시
  ├─ 정민석: 허위 출동 → 조달 장벽
  └─ 장영희: 사고·소송 → 로그 보존 요구

[공간 맥락 Moat]
  ├─ UWB 레이더
  ├─ 화장실 체류/야간 동선/장기 비활동
  └─ 데일리 리포트 → 보호자 안심 루틴

[시장 세그먼트]
  ├─ S3/Wave 1: 소형 요양시설 B2B Lite
  ├─ S2/Wave 2: 가족 지불 홈 안전
  └─ S1/S4 후속: 공공·복지용구 채널
```

---

## 미처리 소스

없음. `raw/`의 13개 원시 소스를 모두 위키에 반영했습니다.

## 운영 로그

→ [log.md](log.md)
