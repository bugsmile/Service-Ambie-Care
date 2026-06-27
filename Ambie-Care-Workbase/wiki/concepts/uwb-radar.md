---
title: UWB 레이더 — 핵심 센싱 기술
type: concept
tags: [UWB, 레이더, 기술, HW, 센서]
source_count: 4
last_updated: 2026-04-25
---

# UWB 레이더 (Ultra-Wideband Radar)

> 출처: [Porter's Five Forces](../sources/01-porters-forces.md), [VPS](../sources/11-vps.md), [PRD](../sources/12-prd.md), [경쟁사 분석](../sources/02-competitive-analysis.md)

---

## 정의

**UWB(초광대역, Ultra-Wideband)** 주파수 기반의 비접촉 레이더 센서. 카메라 없이 레이더 전파로 사람의 움직임, 호흡, 심박, 공간 체류를 감지한다.

---

## 핵심 특성

| 특성 | 설명 |
|-----|------|
| **비영상(Non-visual)** | 카메라 없음 → 프라이버시 침해 제로 |
| **비접촉(Non-contact)** | 착용·충전·조작 불필요 |
| **정밀 감지** | 호흡수, 심박수, 미세 움직임 (뒤척임/낙상 구분) |
| **공간 분석** | 특정 구역 체류 시간, 동선 추적 가능 |

---

## 감지 가능 데이터

- **응급 감지:** 낙상, 무호흡, 장기 비활동
- **수면 분석:** 수면 품질, 기상 시간, 야간 움직임
- **화장실 패턴:** 방문 횟수, 체류 시간 (배뇨 장애 전조 지표)
- **동선 분석:** 실내 이동 경로, 구역별 체류 시간

---

## 한계

- **오탐 발생 가능:** 이불 뒤척임, 반려동물, 외풍 등 노이즈 → AI 필터링 필수
- **단일 패스 이미지 한계:** 인라인 이미지 포함 데이터 처리 시 별도 확인 필요
- **설치 환경 민감도:** 가구 배치, 공간 구조에 따라 정확도 영향

---

## 공급망 리스크

**PRD R-03:** NXP, Infineon 등 소수 글로벌 칩셋 공급사 종속  
→ 단기: 다중 소싱 전략  
→ 장기: [유메인](../entities/company-umain.md) 벤치마킹 → 독자 칩셋 설계 로드맵

---

## 엣지 AI 아키텍처

**NFR-06 보안 원칙:** 원시 레이더 파형 데이터는 **엣지단에서 비식별 처리** 후 수치형 메타데이터만 서버 전송  
→ TLS 1.3 암호화, 배치 전송(5분 주기)

---

## 경쟁사 기술 비교

| 회사 | 기술 |
|-----|------|
| [케어벨](../entities/company-carebell.md) | UWB 레이더 + AI 공간 분석 알고리즘 |
| [오파스넷](../entities/company-opasnet.md) | IR-UWB 고성능 센서 |
| [유메인](../entities/company-umain.md) | UWB 원천 칩셋 + 안테나-SoC 독자 설계 |
| [비알랩](../entities/company-brlab.md) | 스마트 매트리스 무구속 수면 모니터링 |

---

## 연관 개념
- [오탐률 개념](false-alarm.md) — UWB 신호의 노이즈 필터링이 핵심
- [Zero-Friction 개념](zero-friction.md) — UWB로 인해 착용 불필요
- [공간 맥락 지표](space-context-moat.md) — UWB만의 공간 분석 고유 능력
- [앰비언트 케어](ambient-care.md)
