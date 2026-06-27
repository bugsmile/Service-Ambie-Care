---
title: 규제·언어 가드레일
type: concept
tags: [규제, 언어, 웰니스, 포지셔닝, NFR]
source_count: 3
last_updated: 2026-04-25
---

# 규제·언어 가드레일

> 출처: [PRD v0.3](../sources/12-prd.md), [SRS v3.0](../sources/13-srs-v03.md), [고객 여정지도](../sources/08-customer-journey-map.md)

## 핵심 원칙

Rooted는 MVP와 초기 GTM에서 진단·치료·환자 관리 제품처럼 보이면 안 된다. 제품 포지셔닝은 **웰니스/홈 안전/상태 확인**에 둔다.

## 금지 또는 회피 대상

| 영역 | 회피 표현 | 권장 방향 |
|---|---|---|
| 규제 촉발 | diagnosis, medical, patient | wellness, safety, status |
| 낙인 유발 | 노인, 시니어, 케어, 돌봄 | 홈 안전, 공간 모니터, 웰니스 |
| 질병 판정 | 치매 진단, 배뇨장애 진단 | 패턴 변화, 안부 확인 권장 |
| 긴급 보장 | 즉시 구조 보장 | 알림·확인 지원 |

## 이유

- PRD R-01: 호흡·심박 기반 알림이 진단으로 해석되면 의료기기 인허가 리스크가 커진다.
- 고태식형 비사용자는 "노인/시니어/케어" 언어만으로도 탐색을 중단한다.
- SRS v3.0 MVP는 이메일 알림과 웹 리포트 중심이므로 실시간 구조 서비스를 약속할 수 없다.

## 적용 위치

- 코드/DB/API 네이밍
- 제품 랜딩·앱 문구
- 데일리 리포트 AI 요약 프롬프트
- 영업 자료와 파일럿 동의서

## 연관 페이지

- [고태식](../entities/persona-go-taesik.md)
- [MVP v3.0 범위](mvp-v3-scope.md)
- [데일리 리포트](daily-report.md)
