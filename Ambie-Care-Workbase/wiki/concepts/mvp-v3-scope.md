---
title: MVP v3.0 범위 — 무료 티어 바이브 코딩 실행안
type: concept
tags: [MVP, SRS, 무료티어, 바이브코딩, 범위관리]
source_count: 2
last_updated: 2026-04-25
---

# MVP v3.0 범위

> 출처: [SRS v3.0](../sources/13-srs-v03.md), [PRD v0.3](../sources/12-prd.md)

## 핵심 결정

SRS v3.0은 PRD의 이상적 제품 요구를 1인 바이브 코딩과 무료 인프라 제약에 맞춰 MVP Core로 축소한 실행 명세다.

| 축 | PRD/초기 구상 | SRS v3.0 MVP 결정 |
|---|---|---|
| 알림 | 실시간 푸시, SMS/카카오 보조 | Resend Free 이메일 중심 |
| SLA | 99.9% 이상 지향 | Best Effort 약 99% |
| 데이터 보존 | 90일 Hot + 3년 Cold | MVP Hot 30일, Wave 2에서 90일+ |
| EMR | MVP Must | Wave 2 연기 |
| HW/Edge AI | UWB 센서와 엣지 추론 | MVP 제외, 모의 데이터로 대체 |

## MVP Core In-Scope

| 기능 | Phase | 설명 |
|---|---|---|
| 모의 데이터 생성기 | Phase 0 | 실물 센서 없이 Seed/Mock API로 개발·데모 |
| B2C 보호자 웹 포털 | Phase 1 | 일일 리포트, 오작동 신고 |
| B2B 모니터링 대시보드 | Phase 1 | 신호등 UI, 30초 API 폴링 |
| 웰니스 일일 리포트 | Phase 2 | Vercel Cron 1회/일 + Gemini 요약 |
| 이메일 알림 | Phase 2 | Resend Free, 일 100건 제한 |

## Wave 2 이관

- UWB 레이더 HW 연동
- 엣지 AI 오작동 필터링
- EMR Webhook 및 HMAC-SHA256
- SMS/카카오/FCM/Web Push
- 90일 초과 콜드 아카이빙
- PagerDuty, RBAC, 대규모 운영 SLA

## 제품 전략상 의미

MVP는 "완전한 안전 장비"가 아니라 **투자·파트너십·사용자 검증을 위한 웹 중심 데모/파일럿 제품**이다. 따라서 커뮤니케이션에서는 실시간 응급 대응을 약속하지 않고, 아침 리포트·상태 확인·오작동 신고 루프의 검증에 집중해야 한다.

## 연관 페이지

- [SRS v3.0](../sources/13-srs-v03.md)
- [데이터 보존 정책](data-retention.md)
- [EMR 연동](emr-integration.md)
- [데일리 리포트](daily-report.md)
