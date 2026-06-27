---
title: Value Proposition Sheet — Rooted v2
type: source
tags: [VPS, MVP, GTM, 가치제안, 전략]
source_count: 1
last_updated: 2026-04-25
---

# Value Proposition Sheet (VPS) — Rooted v2

> 원본: `raw/07.value-proposition-sheet_Rooted_v2.md`  
> 작성일: 2026-04-12  
> 모든 리서치(1~10번 문서)를 통합한 종합 가치 제안 및 MVP 계획서

---

## 핵심 문제 (Why We Build This)

비접촉 앰비언트 케어 시장은 B2B/B2G/B2C 세 관점에서 **구조적으로 미충족(Unmet Need)** 상태:
- **B2B:** 오탐 12건/일 → 알람 피로 → 야간 낙상 사망사고
- **B2G:** 고스펙 = 단가 초과, 저스펙 = 응급 누락 → 딜레마
- **B2C:** 웨어러블 방치 + CCTV 거부 = 데이터 공백 + 극도 불안

---

## MVP 핵심 스펙 (Must-Have)

### 2.1 HW — UWB 레이더 비접촉 센서 모듈
- 침실 천장 1개 + 화장실 문 상단 1개 기본 패키지
- 벽/천장 부착형 인비저블 설치 (어르신 조작 0회)
- 설치 기사용 앱으로 설치 위치 오차 최소화

### 2.2 AI — 오탐 제로화 필터링 엔진
- **기술 목표:** 월 오탐 ≤ 0.3건/가구
- UWB 레이더 파형 딥러닝 분석: 뒤척임 vs 낙상/무호흡 정밀 구분
- 반려동물(10kg 이하) 구분 정확도 99% 이상

### 2.3 SW — 보호자 앱 + B2B 관제 대시보드
- **B2C 앱 (iOS 우선, Android Wave 2):**
  - 매일 7:30 데일리 리포트 (수면 점수, 화장실 이용, 낙상 감지)
  - 낙상 감지 시 60초 이내 긴급 푸시 알림
  - 오탐 신고 버튼 (피드백 루프)
- **B2B 관제 (웹 대시보드):**
  - 신호등 방식 (적/황/녹) 직관 UI
  - EMR Webhook 자동 연동

---

## Not-To-Do (1차 MVP 배제)

| 배제 항목 | 이유 |
|---------|------|
| 스마트홈 제어 연동 (조명/가전) | 안전이라는 핵심 가치 희석 |
| '케어/돌봄' 마케팅 언어 | 고태식형 ~44~54만 가구 낙인 거부 방지 |
| B2G 최저가 입찰 SLA 스펙 | DOS 2.4, 론칭 시점 지연 초래 |

---

## GTM 최우선 타겟 및 가격

| 채널 | Wave | 타겟 | 가격 |
|------|------|------|------|
| **Wave 1** B2B 클로즈드 베타 | S3 요양시설 | 30병상 이하 중소 요양원 5~10곳 | 설치비 0원 + 월 10만원 Lite |
| **Wave 2** B2C 오픈 베타 | S2 가족 홈케어 | 웨어러블 실패 경험 원격 자녀 100~200가구 | 월 30,000원 + 설치비 49,000원 |

---

## 검증 지표 (Success Metrics)

| 지표 | 목표 | 측정 방법 |
|-----|------|---------|
| 북극성: 월간 체감 오탐 | ≤ 2회/가구 | `is_false_alarm` 플래그 월간 집계 |
| 앱 데일리 리포트 확인 빈도 | ≥ 5회/주 | `view_daily_report` 이벤트 (Amplitude) |
| 어르신 조작 불만 이탈율 | 0건 | CRM 해지 사유 태깅 |

---

## 연관 페이지
- [PRD v1](12-prd.md)
- [AOS/DOS](09-aos-dos.md)
- [JTBD 인터뷰](10-jtbd-interview.md)
- [TAM-SAM-SOM](06-tam-sam-som.md)
- [오탐률 개념](../concepts/false-alarm.md)
- [Zero-Friction 개념](../concepts/zero-friction.md)
- [UWB 레이더](../concepts/uwb-radar.md)
