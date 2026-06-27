---
title: 페르소나 — 오성진 (Core)
type: entity
tags: [페르소나, core, B2B, 수간호사, 관제]
source_count: 1
last_updated: 2026-04-25
---

# 오성진 (37세) — Core 페르소나

> 출처: [AOS/DOS 분석](../sources/09-aos-dos.md)

## 역할

요양원 수간호사. 야간 현장의 알람 피로, 수기 기록, 다중 병상 상태 파악 문제가 집중되는 실무 사용자다.

## 핵심 Pain / Goal

| Pain / Goal | Importance | Satisfaction | AOS | 시사점 |
|---|---:|---:|---:|---|
| 오작동 필터링, 진짜 낙상만 알림 | 5 | 1 | **4.0** | 알람 피로 제거 |
| 배회와 낙상 AI 자동 구분 | 5 | 1 | **4.0** | 현장 신뢰 형성 |
| 전 병동 직관적 실시간 대시보드 | 4 | 1 | 3.2 | B2B MVP 화면 핵심 |
| EMR 자동 연동, 수작업 기록 제거 | 4 | 1 | 3.2 | Wave 2 Lock-in 축 |

## 제품 요구

- 신호등식 Red/Yellow/Green 다중 병상 대시보드
- 오작동 신고 및 재학습 피드백 루프
- 수기 기록 부담을 줄이는 [EMR 연동](../concepts/emr-integration.md)
- [SRS v3.0](../sources/13-srs-v03.md) 기준 MVP에서는 EMR 없이 독립형 대시보드와 30초 폴링으로 시작

## 연관 페이지

- [오탐률](../concepts/false-alarm.md)
- [MVP v3.0 범위](../concepts/mvp-v3-scope.md)
- [EMR 연동](../concepts/emr-integration.md)
