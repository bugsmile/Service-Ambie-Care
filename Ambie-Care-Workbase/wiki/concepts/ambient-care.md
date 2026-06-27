---
title: 앰비언트 케어 (Ambient Care)
type: concept
tags: [앰비언트, 케어, 비접촉, 시장정의, 공간]
source_count: 3
last_updated: 2026-04-25
---

# 앰비언트 케어 (Ambient Care)

> 출처: [TAM-SAM-SOM](../sources/06-tam-sam-som.md), [Porter's Five Forces](../sources/01-porters-forces.md), [VPS](../sources/11-vps.md)

---

## 정의

**"공간 자체가 노인을 돌보는"** 방식. 기기를 착용하거나 조작하지 않아도, 공간에 설치된 비접촉 센서(UWB 레이더, 열화상, 모션 등)가 거주자의 움직임과 생체 신호를 24시간 자동 모니터링.

---

## 웨어러블과의 근본적 차이

| 구분 | 웨어러블 (Apple Watch 등) | 앰비언트 케어 |
|-----|----------------------|------------|
| 착용 | 필수 | 불필요 |
| 충전 | 매일 | 불필요 |
| 감지 영역 | 손목 (개인 생체신호) | 공간 전체 (동선, 체류, 환경) |
| 화장실 체류 분석 | 불가 | 가능 |
| 낙상 발생 위치 추적 | 불가 | 가능 |
| 프라이버시 | 낮음 (개인 데이터) | 낮음 (비영상) |

---

## 앰비언트만이 제공하는 고유 지표

웨어러블이 절대 줄 수 없는 **공간 맥락 데이터:**
- **화장실 체류 시간** → 배뇨 장애, 낙상 전조 징후
- **야간 동선 패턴** → 수면 품질, 우울증 전조
- **구역별 체류 이상** → 낙상 후 장기 비활동 감지
- **실내 이동 빈도** → 활동량 저하, 건강 상태 변화

→ 이것이 [공간 맥락 지표 Moat](space-context-moat.md)의 근거

---

## 시장 트렌드

- **글로벌 AAL(Ambient Assisted Living) 시장:** 2026년 $134.8억 → 2031년 $358.4억 (CAGR 21.6%)
- 2025년 기준 하드웨어 51.35%, 재가 45.25%, 요양시설 54.75%
- 치매 환자, Zero-Friction 요구 고령자 증가로 수요 가속화

---

## 리스크 (R-01 의료기기법)

**PRD R-01:** 맥박/호흡수 데이터 기반 알림이 '진단'으로 해석될 경우 식약처 인허가 필수  
→ **ADR 결정:** 라이프케어 스마트홈 기기 (웰니스/안전 확인용) 포지셔닝  
→ DB/API에서 'diagnosis', 'medical' 단어 완전 배제 (NFR-12)

---

## 연관 개념
- [UWB 레이더](uwb-radar.md)
- [Zero-Friction](zero-friction.md)
- [공간 맥락 지표 Moat](space-context-moat.md)

## 연관 소스
- [TAM-SAM-SOM](../sources/06-tam-sam-som.md)
- [문제 정의서](../sources/05-problem-definition.md)
- [PRD](../sources/12-prd.md)
