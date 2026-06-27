---
title: 페르소나 — 이현우 (Core)
type: entity
tags: [페르소나, core, B2B, 시설운영, 관제]
source_count: 1
last_updated: 2026-04-25
---

# 이현우 (50세) — Core 페르소나

> 출처: [AOS/DOS 분석](../sources/09-aos-dos.md)

## 역할

프리미엄 실버타운 원장. 시설 운영 책임자 관점에서 오작동 알림, 야간 인력 운영, 보호자 신뢰, 전산 연동을 동시에 판단한다.

## 핵심 Pain / Goal

| Pain / Goal | Importance | Satisfaction | AOS | 시사점 |
|---|---:|---:|---:|---|
| 오작동률 제로화, 알람 피로 해소 | 5 | 1 | **4.0** | 시설 도입의 최우선 조건 |
| EMR 연동 및 관제 대시보드 통합 | 5 | 1 | **4.0** | 운영 마찰 제거와 Lock-in 형성 |
| 야간 직원 1인당 커버 세대 수 확대 | 4 | 2 | 2.4 | 운영 효율 개선 과제 |
| AI 관제 시설 보호자 트러스트 마케팅 | 3 | 2 | 1.8 | 구매 보조 명분 |

## 제품 요구

- 저가 ODM 모션 센서의 일 20~30회 오작동을 제거할 수 있는 실증 데이터
- 전 병동 상태를 한눈에 보는 신호등식 관제 UI
- 이중 기록을 줄이는 EMR 연동. 단, [SRS v3.0](../sources/13-srs-v03.md) 기준 MVP에서는 [EMR 연동](../concepts/emr-integration.md)이 Wave 2로 연기됨
- 법적 책임 리스크에 대비한 [데이터 보존 정책](../concepts/data-retention.md)

## 연관 페이지

- [오탐률](../concepts/false-alarm.md)
- [EMR 연동](../concepts/emr-integration.md)
- [MVP v3.0 범위](../concepts/mvp-v3-scope.md)
