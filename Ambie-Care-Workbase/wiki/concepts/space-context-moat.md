---
title: 공간 맥락 지표 Moat — 웨어러블 위협 방어 해자
type: concept
tags: [Moat, 공간분석, 차별화, KSF, 웨어러블방어]
source_count: 4
last_updated: 2026-04-25
---

# 공간 맥락 지표 Moat

> **KSF #2 — 스마트워치 위협을 방어하는 유일한 해자**  
> 출처: [KSF 보고서](../sources/04-ksfs.md), [Porter's Five Forces](../sources/01-porters-forces.md), [PRD](../sources/12-prd.md), [경쟁사 분석](../sources/02-competitive-analysis.md)

---

## 배경: 대체재 위협 Very High 🔴

Apple Watch / Galaxy Watch가 앰비언트 케어 센서의 주력 세일즈 포인트를 이미 의료기기 등급으로 완성:
- 낙상 감지 ✅
- 심박 이상 감지 ✅
- 수면 품질 분석 ✅

→ "굳이 비싼 설치형 레이더 센서가 필요한가?" 라는 당위성 위협

---

## 방어 전략: 공간이 알 수 있는 것

**손목에서는 절대 알 수 없는 공간 맥락:**

| 지표 | 의미 |
|-----|------|
| **화장실 체류 시간** | 배뇨 장애 초기 징후, 하체 근육 상실 전조 |
| **화장실 방문 빈도** | 야간 빈뇨 → 수면 저하 → 우울증 전조 |
| **야간 동선 패턴** | 수면 품질, 야간 배회 (치매 징후) |
| **낙상 발생 위치** | 화장실, 침실 등 구역별 위험 지점 특정 |
| **구역별 장기 체류** | 낙상 후 비활동 감지 (5분 이상) |

---

## VoC 증거

> *"밤에 화장실 자주 가시느라 선잠을 주무셔서 우울해하시는 게 더 걱정이에요. 그 패턴만 알 수 있어도 병원에 일찍 모시고 갈 텐데요."* — JTBD 미사용 탐색 그룹

---

## 제품 구현 경로

### 화장실 동선 분석 → 데일리 리포트
- `bathroom_visit_count` (화장실 방문 횟수)
- 화장실 체류 시간 평균 대비 +50% 초과 시 → 사전 경고 (AC-2.2)
- 야간 수면/화장실 패턴 오차율 10% 미만 목표 (AC-2.1)

### 특허 방어 전략
공간 행동-건강 교차 분석 알고리즘 특허 → 웨어러블의 기능 침범에 대한 법적 방어

---

## 경쟁사 현황

| 회사 | 공간 맥락 분석 여부 |
|-----|---------------|
| Apple Watch / Galaxy Watch | ❌ (손목 데이터만) |
| [비알랩](../entities/company-brlab.md) | ⚠️ 수면 분석 특화, 화장실 동선 부재 |
| [케어벨](../entities/company-carebell.md) | ✅ 화장실 체류 시간 포함 |
| **Rooted** | ✅ (핵심 차별화 영역) |

---

## 연관 소스
- [KSF 보고서](../sources/04-ksfs.md)
- [JTBD 인터뷰](../sources/10-jtbd-interview.md)
- [PRD FR-03, FR-05](../sources/12-prd.md)
- [AOS/DOS](../sources/09-aos-dos.md)

## 연관 컨셉
- [UWB 레이더](uwb-radar.md)
- [앰비언트 케어](ambient-care.md)
- [데일리 리포트](daily-report.md)
