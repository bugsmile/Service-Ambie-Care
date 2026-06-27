---
title: PRD v0.3 — Rooted 비접촉 AI 앰비언트 홈 안전 솔루션
type: source
tags: [PRD, 요구사항, 기능, 비기능, MVP, 리스크]
source_count: 1
last_updated: 2026-04-25
---

# PRD v0.3 — Rooted

> 원본: `raw/PRD_V1.md` (최종 업데이트: 2026-04-18)

---

## 핵심 목표 (To-Be)

| 목표 | As-Is | To-Be |
|------|-------|-------|
| 월간 오탐 빈도 | 하루 12건 (월 360건) | **≤ 0.3건/월/가구** |
| 어르신 기기 조작 | 웨어러블 충전/착용 마찰 상시 | **0회 (Zero-Friction)** |
| 야간 패턴 오차율 | 데이터 부재 | **10% 미만** |
| 프라이버시 침해 | CCTV 감시 거부 반응 | **비영상 방식으로 침해 제로** |
| B2B 이중 기록 | 수기 + 시스템 이중 입력 | **EMR 자동 연동으로 0건** |

---

## 성공 지표

- **북극성:** 월간 사용자 체감 오탐 ≤ 2회/가구
- **보조 KPI 1:** 앱 데일리 리포트 주간 확인 빈도 ≥ 5회/주
- **보조 KPI 2:** 어르신 조작 불만 이탈 = 0건

---

## 기능 요구사항 (MoSCoW)

| FR-ID | 기능명 | MoSCoW | DOS | T-shirt |
|-------|-------|-------|-----|---------|
| **FR-01** | 오탐 제로화 AI 필터링 엔진 | **Must** | 3.8 | XL (3~4 스프린트) |
| **FR-02** | Zero-Friction 비접촉 센서 모듈 | **Must** | 3.6 | L (2~3 스프린트) |
| **FR-03** | 비영상 프라이버시 보호 동선 추적 | **Must** | 3.0 | L (2~3 스프린트) |
| **FR-04** | B2B 관제 대시보드 + EMR Webhook | **Must** | 3.4 | L (2~3 스프린트) |
| **FR-05** | 웰니스 데일리 리포트 (B2C) | **Should** | 2.85 | M (1~2 스프린트) |
| **FR-06** | 수면 점수 트렌드 그래프 (주간/월간) | Could | — | S (1 스프린트) |
| **FR-07** | 보호자 다중 알림 채널 (SMS/카카오톡) | Could | — | S (1 스프린트) |
| **FR-08** | 관제 대시보드 커스텀 필터링 | Could | — | S (1 스프린트) |

---

## 핵심 NFR

| NFR-ID | 카테고리 | 목표치 |
|--------|---------|-------|
| NFR-01 | 성능 | 낙상 감지 알림 지연 p95 ≤ 2,000ms |
| NFR-04 | 신뢰성 | 클라우드 가용성 ≥ 99.9% |
| NFR-06 | 보안 | 엣지단 비식별 처리 + 분기 1회 Pentest |
| NFR-08 | 비용 | 클라우드 인프라 월 500원/가구 이하 |
| NFR-10 | 데이터 보존 | 90일 Hot + 3년 S3 Glacier Cold |
| NFR-12 | 용어 | 'diagnosis/medical/patient' DB 네이밍 금지 |
| NFR-14 | 확장성 | 동시 1,000 센서 기준 이벤트 처리 ≤ 500ms |

---

## 6대 리스크

| Risk-ID | 리스크 | 확률 | 영향 | ADR 결정 |
|---------|-------|------|------|---------|
| R-01 | 의료기기법 분류 (진단 해석) | 높음 | 매우 높음 | 웰니스 포지셔닝 채택 + Disclaimer 필수 |
| R-02 | 개인정보보호법 위반 | 높음 | 높음 | 엣지단 비식별 변환 아키텍처 |
| R-03 | UWB 칩셋 공급 종속 | 보통 | 높음 | 다중 소싱 + 유메인형 독자 칩셋 로드맵 |
| R-04 | SI 전락 위험 | 높음 | 높음 | SaaS 우선 + 표준 플러그인 모델 |
| R-05 | 대체재(웨어러블) 위협 | 매우 높음 | 매우 높음 | 공간 맥락 분석 Moat 구축 |
| R-06 | 엣지 AI 실환경 정확도 미달 | 높음 | 매우 높음 | 베타 기간 현장 학습 + OTA 패치 |

---

## 핵심 엔터티 (DB 스키마)

### SensorDevice
`device_id`, `location_zone` (bedroom/bathroom/living_room), `firmware_version`, `status`

### WellnessEvent
`event_id`, `event_type` (activity_alert/wellness_score/emergency), `confidence_score`, `is_false_alarm`

### DailyReport
`report_id`, `sleep_score`, `bathroom_visit_count`, `anomaly_flags[]`

> ⚠️ 필드 네이밍에 'diagnosis/medical/patient' 사용 금지 (NFR-12)

---

## 베타 롤아웃

- **Wave 1 (Closed Beta):** 30병상 이하 중소 요양원 5~10곳
- **Wave 2 (Open Beta):** 원격지 직장인 자녀 100~200가구

---

## 연관 페이지
- [VPS v2](11-vps.md)
- [UWB 레이더](../concepts/uwb-radar.md)
- [오탐률 개념](../concepts/false-alarm.md)
- [EMR 연동](../concepts/emr-integration.md)
- [데일리 리포트](../concepts/daily-report.md)
- [공간 맥락 지표](../concepts/space-context-moat.md)
