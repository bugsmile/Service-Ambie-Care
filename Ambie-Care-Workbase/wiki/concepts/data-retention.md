---
title: 데이터 보존 정책 — 30일 MVP와 90일 제품 요구
type: concept
tags: [데이터보존, SRS, PRD, 법적증거, 운영정책]
source_count: 3
last_updated: 2026-04-25
---

# 데이터 보존 정책

> 출처: [PRD v0.3](../sources/12-prd.md), [SRS v3.0](../sources/13-srs-v03.md), [AOS/DOS](../sources/09-aos-dos.md)

## 핵심 요약

데이터 보존은 제품 신뢰와 법적 분쟁 대응의 핵심이지만, MVP에서는 무료 인프라 제약 때문에 30일 Hot 보존으로 축소된다.

> ⚠️ 모순: PRD와 AOS/DOS는 장영희 사례를 근거로 **90일 이상 로그 보존**을 제품 신뢰의 핵심 요구로 둔다. 그러나 SRS v3.0은 Supabase Free 500MB 제약 때문에 MVP 기간의 Hot 보존을 **30일**로 단축했다. 현재 위키의 실행 기준은 SRS v3.0이며, 90일+3년 Cold는 Wave 2 목표로 분리한다.

## 보존 기간 비교

| 기준 | 보존 정책 | 위치 |
|---|---|---|
| PRD v0.3 | 90일 Hot + 3년 Cold | 제품 목표 |
| AOS/DOS | 90일 이상 데이터 로그 | Extreme/법적 방어 Pain |
| SRS v3.0 MVP | 30일 Hot 자동 삭제 | 무료 티어 실행안 |
| SRS v3.0 Wave 2 | 90일 Hot + 장기 Cold | 유료 인프라 전환 후 |

## 왜 중요한가

- [장영희](../entities/persona-jang-younghee.md) 사례에서 새벽 2:30~5:00 데이터 공백은 소송상 핵심 리스크가 됨
- B2B 시설은 사고 후 책임소재 확인을 위해 로그 무결성을 요구
- B2G 조달에서는 공공 신뢰와 유지보수 SLA의 일부로 해석될 수 있음

## MVP 운영 원칙

- 30일이 넘은 이벤트는 자동 삭제한다.
- 무결성 해시는 가능한 범위에서 보존해 추후 Wave 2 전환 여지를 남긴다.
- 사용자·시설 영업 문구에서는 90일 보존을 MVP 제공 기능처럼 약속하지 않는다.

## 연관 페이지

- [MVP v3.0 범위](mvp-v3-scope.md)
- [장영희](../entities/persona-jang-younghee.md)
- [SRS v3.0](../sources/13-srs-v03.md)
