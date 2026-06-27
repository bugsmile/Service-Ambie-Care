---
title: AOS/DOS 기회점수 매트릭스
type: source
tags: [AOS, DOS, 기회점수, 우선순위, MVP]
source_count: 1
last_updated: 2026-04-25
---

# AOS/DOS 기회점수 매트릭스

> 원본: `raw/9.aos-dos-analysis.md`

---

## DOS 평가 결과 (점수 내림차순)

| Pain/Goal 항목 | DOS | 사분면 | 전략 시사점 |
|--------------|-----|-------|-----------|
| **오탐률 제로화 알고리즘** | **3.8** | 🔥 Q1 핵심 성장 동력 | MVP 최우선 R&D 목표. 시장 존속의 절대 요건 |
| **Zero-Friction 완전비접촉** | **3.6** | 🔥 Q1 핵심 성장 동력 | 사용자(어르신) 거부감 제거 1순위 |
| **기존 EMR/관제 자동 연동** | **3.4** | 🔥 Q1 핵심 성장 동력 | B2B 전환 비용(Lock-in) 생성 |
| **月 10만 이하 Lite 구독** | **3.2** | 🔥 Q1 핵심 성장 동력 | 중소 요양원 시장 침투 캐시카우 |
| **비영상 프라이버시 감지** | **3.0** | 🔥 Q1 핵심 성장 동력 | 인권·감시 경계 우회 전환 키워드 |
| 앱 데일리 가족 리포트 | 2.85 | ⚙️ Q3 대중 확산 지렛대 | B2C Lock-in + 바이럴 핵심 |
| 90일 데이터 로그 보존 | 2.6 | 💡 Q2 틈새·방어기제 | 법적 분쟁 시 브랜드 신뢰 방어 해자 |
| 공공 조달 SLA 스펙 | 2.4 | 🚫 Q4 선택적 투자 주의 | 후순위 채널 진출 수단 |
| 웰니스 리프레이밍 | 2.25 | 🚫 Q4 선택적 투자 주의 | R&D보다 마케팅 자원 투입 |
| 복지용구 바우처 적용 | 2.1 | 🚫 Q4 선택적 투자 주의 | 제도적 시간 지연이 크므로 병행 사업 |

---

## 핵심 결론

> **📌 12명 전원이 Q1 혁신기회 영역에 분포. Q3·Q4가 완전히 비어있음 = 이 시장이 구조적으로 미충족된 Unmet Need 상태.**

---

## AOS 기준 페르소나 최고점 순위 (상위)

| 페르소나 | 유형 | 최고 AOS | 핵심 Pain |
|---------|------|---------|---------|
| 이현우 (요양원장) | Core | 4.0 | 오탐률 제로화 + EMR 연동 |
| 오성진 (수간호사) | Core | 4.0 | 오탐 필터링 + 치매낙상 구분 |
| 박지수 (보호자 자녀) | Core | 4.0 | 낙상 감지 + Zero-Friction |
| 장영희 (낙상사망 피해 가족) | Extreme | 4.0 | 오탐 제로 + 90일 로그 |
| 정민석 (지자체 공무원) | Adjacent | 4.0 | 오탐 실증 B2G 조달 |
| 서미경 (소형 요양원장) | Non-user | 4.0 | Lite 플랜 月10만 이하 |

---

## 12명 페르소나 엔티티 맵

| 유형 | 페르소나 |
|---|---|
| Core | [박지수](../entities/persona-park-jisu.md), [이현우](../entities/persona-lee-hyunwoo.md), [김정숙](../entities/persona-kim-jeongsuk.md), [오성진](../entities/persona-oh-seongjin.md), [한미영](../entities/persona-han-miyoung.md) |
| Adjacent | [정민석](../entities/persona-jeong-minseok.md), [배수진](../entities/persona-bae-sujin.md), [윤태현](../entities/persona-yoon-taehyun.md) |
| Extreme | [장영희](../entities/persona-jang-younghee.md), [최봉수](../entities/persona-choi-bongsu.md) |
| Non-user | [고태식](../entities/persona-go-taesik.md), [서미경](../entities/persona-seo-migyeong.md) |

---

## 개발 로드맵 (AOS 기반)

```
Phase 1 (0~6개월) — MVP 필수
  ├─ 오탐 제로 알고리즘 (파일럿 400세대 실증)
  └─ Zero-Friction 설치 자동화

Phase 2 (6~12개월) — 채널 확장
  ├─ 복지용구 바우처 품목 인증
  ├─ B2G 파일럿 레퍼런스 확보
  └─ 90일 데이터 로그 보존 클라우드

Phase 3 (12~18개월) — 시장 확장
  ├─ EMR 연동 턴키 솔루션
  ├─ 보호자 앱 UI 고도화
  └─ Lite 플랜 소형 시설 설계
```

---

## 연관 페이지
- [KSF 보고서](04-ksfs.md)
- [JTBD 인터뷰](10-jtbd-interview.md)
- [PRD](12-prd.md)
- [오탐률 개념](../concepts/false-alarm.md)
- [Zero-Friction 개념](../concepts/zero-friction.md)
- [시장 세그먼트](../concepts/market-segments.md)
